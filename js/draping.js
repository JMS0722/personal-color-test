/* ===== DIGITAL DRAPING (MediaPipe Face Mesh) ===== */
import { state } from './state.js';

// Face oval landmark indices (MediaPipe 478-point mesh)
const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
  397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
  172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109
];

// Jawline = face oval array indices 8..27 (right ear → chin → left ear)
const JAW_START = 8;
const JAW_END = 28;

// CDN paths
const VISION_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21';
const WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm';
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

let faceLandmarker = null;
let cachedLandmarks = null;
let drapingCanvas = null;
let drapingCtx = null;
let sourceCanvas = null;

let currentMode = 'best';
let currentIndex = 0;
let currentColors = [];
let currentColorNames = [];
let touchStartX = 0;

// ========================================
// Public API
// ========================================

/**
 * Called from renderResult(). Shows draping card if photo available, else CTA.
 */
export function initDraping() {
  const drapingCard = document.getElementById('draping-card');
  const ctaCard = document.getElementById('draping-cta-card');

  if (state.capturedImageData) {
    if (drapingCard) drapingCard.style.display = '';
    if (ctaCard) ctaCard.style.display = 'none';
    bootstrapDraping();
  } else {
    if (drapingCard) drapingCard.style.display = 'none';
    if (ctaCard) ctaCard.style.display = '';
  }
}

export function switchDrapingMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.draping-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });
  loadSeasonColors();
  renderDraping();
}

export function prevDrapingColor() {
  currentIndex = (currentIndex - 1 + currentColors.length) % currentColors.length;
  animateTransition('right');
}

export function nextDrapingColor() {
  currentIndex = (currentIndex + 1) % currentColors.length;
  animateTransition('left');
}

export function retryDraping() {
  cachedLandmarks = null;
  bootstrapDraping();
}

/**
 * Apply a specific color from palette to draping canvas.
 * Called when user taps a palette swatch.
 */
export function applyDrapingColor(hex) {
  if (!drapingCanvas || !drapingCtx || !sourceCanvas) return false;
  // Switch to best mode and find color index
  currentMode = 'best';
  loadSeasonColors();
  const idx = currentColors.indexOf(hex);
  if (idx >= 0) {
    currentIndex = idx;
  } else {
    // Color not in current list — inject temporarily
    currentColors.push(hex);
    currentColorNames.push(hexToViName(hex));
    currentIndex = currentColors.length - 1;
  }
  document.querySelectorAll('.draping-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === 'best');
  });
  renderDraping();
  return true;
}

// ========================================
// Bootstrap
// ========================================

async function bootstrapDraping() {
  const loading = document.getElementById('draping-loading');
  const error = document.getElementById('draping-error');

  if (loading) loading.style.display = 'flex';
  if (error) error.style.display = 'none';

  try {
    prepareSourceCanvas();

    if (sourceCanvas.width < 200 || sourceCanvas.height < 200) {
      showDrapingError('Ảnh quá nhỏ. Vui lòng chụp ảnh lớn hơn.');
      return;
    }

    await loadMediaPipe();
    await initFaceLandmarker();

    if (!detectFace()) {
      showDrapingError('Không nhận diện được khuôn mặt. Vui lòng thử lại với ảnh rõ hơn.');
      return;
    }

    setupDrapingCanvas();
    loadSeasonColors();
    renderDraping();
    setupSwipe();

    if (loading) loading.style.display = 'none';
  } catch (err) {
    console.error('Draping error:', err);
    showDrapingError('Không thể tải AI nhận diện khuôn mặt. Vui lòng thử lại.');
  }
}

// ========================================
// MediaPipe Loading
// ========================================

function prepareSourceCanvas() {
  const imgData = state.capturedImageData;
  sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = imgData.width;
  sourceCanvas.height = imgData.height;
  sourceCanvas.getContext('2d').putImageData(imgData, 0, 0);
}

function loadMediaPipe() {
  return new Promise((resolve, reject) => {
    if (window.FilesetResolver && window.FaceLandmarker) {
      resolve();
      return;
    }
    // CJS bundle needs `module` and `exports` shims for browser
    if (!window.module) window.module = { exports: {} };
    if (!window.exports) window.exports = window.module.exports;

    const script = document.createElement('script');
    script.src = VISION_CDN;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      let attempts = 0;
      const check = () => {
        if (attempts++ > 50) return reject(new Error('MediaPipe globals not found'));
        // Check known global locations
        if (window.FilesetResolver && window.FaceLandmarker) return resolve();
        if (window.vision) {
          window.FilesetResolver = window.vision.FilesetResolver;
          window.FaceLandmarker = window.vision.FaceLandmarker;
          return resolve();
        }
        // CJS exports check
        const exp = window.module && window.module.exports;
        if (exp && exp.FilesetResolver) {
          window.FilesetResolver = exp.FilesetResolver;
          window.FaceLandmarker = exp.FaceLandmarker;
          return resolve();
        }
        setTimeout(check, 100);
      };
      setTimeout(check, 100);
    };
    script.onerror = () => reject(new Error('CDN load failed'));
    document.head.appendChild(script);
  });
}

async function initFaceLandmarker() {
  if (faceLandmarker) return;

  const vision = await window.FilesetResolver.forVisionTasks(WASM_PATH);
  faceLandmarker = await window.FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: MODEL_URL,
      delegate: 'GPU'
    },
    runningMode: 'IMAGE',
    numFaces: 1,
    outputFacialTransformationMatrixes: false,
    outputFaceBlendshapes: false
  });
}

// ========================================
// Face Detection
// ========================================

function detectFace() {
  if (cachedLandmarks) return true;

  const result = faceLandmarker.detect(sourceCanvas);
  if (!result.faceLandmarks || result.faceLandmarks.length === 0) return false;

  cachedLandmarks = result.faceLandmarks[0];
  return true;
}

// ========================================
// Draping Polygon
// ========================================

function buildDrapingPolygon() {
  if (!cachedLandmarks) return null;

  const w = sourceCanvas.width;
  const h = sourceCanvas.height;

  // Extract jawline points
  const jawPoints = [];
  for (let i = JAW_START; i < JAW_END; i++) {
    const lm = cachedLandmarks[FACE_OVAL[i]];
    jawPoints.push({ x: lm.x * w, y: lm.y * h });
  }

  // Jaw dimensions
  const jawLeft = jawPoints[jawPoints.length - 1];
  const jawRight = jawPoints[0];
  const jawWidth = Math.abs(jawRight.x - jawLeft.x);

  // Chin (middle of jawline)
  const chinIdx = Math.floor(jawPoints.length / 2);
  const chin = jawPoints[chinIdx];

  // Face height (top of oval to chin)
  const topLm = cachedLandmarks[FACE_OVAL[0]];
  const faceHeight = chin.y - topLm.y * h;

  // Extension parameters
  const expandWidth = jawWidth * 1.4;
  const extendDown = faceHeight * 0.7;
  const centerX = (jawLeft.x + jawRight.x) / 2;
  const bottomY = chin.y + extendDown;

  // Build polygon: jawline curve (right→left) + trapezoid bottom (left→right)
  const polygon = [...jawPoints];

  // Bottom-left (from left jaw, extend outward and down)
  polygon.push({ x: centerX - expandWidth / 2, y: bottomY });
  // Bottom-right (close the loop)
  polygon.push({ x: centerX + expandWidth / 2, y: bottomY });

  return polygon;
}

// ========================================
// Canvas Rendering
// ========================================

function setupDrapingCanvas() {
  drapingCanvas = document.getElementById('draping-canvas');
  if (!drapingCanvas) return;
  drapingCanvas.width = sourceCanvas.width;
  drapingCanvas.height = sourceCanvas.height;
  drapingCtx = drapingCanvas.getContext('2d');
}

function renderDraping() {
  if (!drapingCtx || !sourceCanvas) return;

  const w = drapingCanvas.width;
  const h = drapingCanvas.height;
  const color = currentColors[currentIndex];

  // Draw original photo
  drapingCtx.clearRect(0, 0, w, h);
  drapingCtx.drawImage(sourceCanvas, 0, 0);

  // Build polygon and overlay
  const polygon = buildDrapingPolygon();
  if (!polygon || polygon.length < 3) return;

  drapingCtx.save();

  // Clip to draping region
  drapingCtx.beginPath();
  drapingCtx.moveTo(polygon[0].x, polygon[0].y);
  for (let i = 1; i < polygon.length; i++) {
    drapingCtx.lineTo(polygon[i].x, polygon[i].y);
  }
  drapingCtx.closePath();
  drapingCtx.clip();

  // Semi-transparent color fill
  drapingCtx.globalAlpha = 0.55;
  drapingCtx.fillStyle = color;
  drapingCtx.fillRect(0, 0, w, h);

  // Subtle glossy gradient for fabric feel
  drapingCtx.globalAlpha = 0.12;
  const topY = polygon[0].y;
  const bottomY = polygon[polygon.length - 1].y;
  const gradient = drapingCtx.createLinearGradient(0, topY, 0, bottomY);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.4, 'transparent');
  gradient.addColorStop(0.6, 'transparent');
  gradient.addColorStop(1, '#000000');
  drapingCtx.fillStyle = gradient;
  drapingCtx.fillRect(0, 0, w, h);

  drapingCtx.restore();

  updateColorInfo();
}

// ========================================
// Color Management
// ========================================

function loadSeasonColors() {
  const s = state.currentSeason;
  if (!s) return;

  currentColors = currentMode === 'best' ? [...s.palette] : [...s.avoid];
  currentColorNames = currentColors.map(hex => hexToViName(hex));
  currentIndex = 0;
  updateColorInfo();
}

function updateColorInfo() {
  const dot = document.getElementById('draping-color-dot');
  const name = document.getElementById('draping-color-name');
  const counter = document.getElementById('draping-color-counter');

  if (dot) dot.style.backgroundColor = currentColors[currentIndex] || '#ccc';
  if (name) name.textContent = currentColorNames[currentIndex] || '';
  if (counter) counter.textContent = `${currentIndex + 1} / ${currentColors.length}`;
}

// ========================================
// Animation & Swipe
// ========================================

function animateTransition(direction) {
  if (!drapingCanvas) { renderDraping(); return; }

  drapingCanvas.style.transition = 'none';
  drapingCanvas.style.transform = `translateX(${direction === 'left' ? '30px' : '-30px'})`;
  drapingCanvas.style.opacity = '0.5';

  requestAnimationFrame(() => {
    drapingCanvas.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    drapingCanvas.style.transform = 'translateX(0)';
    drapingCanvas.style.opacity = '1';
    renderDraping();
  });
}

function setupSwipe() {
  const viewport = document.getElementById('draping-viewport');
  if (!viewport) return;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) nextDrapingColor();
      else prevDrapingColor();
    }
  }, { passive: true });
}

// ========================================
// Error Handling
// ========================================

function showDrapingError(msg) {
  const loading = document.getElementById('draping-loading');
  const error = document.getElementById('draping-error');
  const errorMsg = document.getElementById('draping-error-msg');

  if (loading) loading.style.display = 'none';
  if (error) error.style.display = 'flex';
  if (errorMsg) errorMsg.textContent = msg;
}

// ========================================
// Hex → Vietnamese color name
// ========================================

function hexToViName(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)) / 255;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }

  if (s < 0.08) {
    if (l > 0.92) return 'Trắng';
    if (l > 0.75) return 'Xám nhạt';
    if (l > 0.45) return 'Xám';
    if (l > 0.2) return 'Xám đậm';
    return 'Đen';
  }

  let prefix = '';
  if (l > 0.82) prefix = 'nhạt ';
  else if (l < 0.25) prefix = 'đậm ';

  let name;
  if (h < 12) name = 'Đỏ';
  else if (h < 25) name = 'Đỏ cam';
  else if (h < 40) name = 'Cam';
  else if (h < 50) name = 'Cam vàng';
  else if (h < 65) name = 'Vàng';
  else if (h < 80) name = 'Vàng chanh';
  else if (h < 150) name = 'Xanh lá';
  else if (h < 175) name = 'Xanh ngọc';
  else if (h < 200) name = 'Xanh cyan';
  else if (h < 230) name = 'Xanh dương';
  else if (h < 260) name = 'Xanh lam';
  else if (h < 290) name = 'Tím';
  else if (h < 320) name = 'Tím hồng';
  else if (h < 345) name = 'Hồng';
  else name = 'Đỏ';

  if (s < 0.25) name += ' xám';
  else if (s > 0.8 && l > 0.5) name += ' tươi';

  return prefix ? name + ' ' + prefix.trim() : name;
}
