/* ===== AI CAMERA & PHOTO ANALYSIS ===== */
import { state } from './state.js';
import { determineSeason } from './scoring.js';
import { renderResult } from './result.js';
import { showScreen } from './app.js';

// ========================================
// Camera Control
// ========================================

export async function startAI() {
  state.scores = { temp: 0, depth: 0, clarity: 0 };
  state.currentSeason = null;
  state.capturedImageData = null;

  // Reset UI
  document.getElementById('photo-preview').style.display = 'none';
  document.getElementById('scan-overlay').style.display = 'none';
  document.getElementById('ai-actions').style.display = 'none';
  document.getElementById('detected-colors').style.display = 'none';
  document.getElementById('ai-controls').style.display = 'flex';
  document.getElementById('ai-tips').style.display = 'block';
  document.getElementById('ai-nocamera').style.display = 'none';
  document.querySelector('.face-guide').style.display = 'flex';

  showScreen('ai-screen');
  await startCamera();
}

async function startCamera() {
  const video = /** @type {HTMLVideoElement} */ (document.getElementById('camera-video'));
  try {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(t => t.stop());
    }
    state.cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: state.facingMode,
        width: { ideal: 640 },
        height: { ideal: 854 }
      },
      audio: false
    });
    video.srcObject = state.cameraStream;
    video.style.display = 'block';

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(d => d.kind === 'videoinput');
    if (videoInputs.length > 1) {
      document.getElementById('switch-camera-btn').style.display = 'inline-flex';
    }
  } catch (_err) {
    video.style.display = 'none';
    document.getElementById('ai-controls').style.display = 'none';
    document.querySelector('.face-guide').style.display = 'none';
    document.getElementById('ai-nocamera').style.display = 'block';
  }
}

export async function switchCamera() {
  state.facingMode = state.facingMode === 'user' ? 'environment' : 'user';
  await startCamera();
}

export function exitAI() {
  stopCamera();
  showScreen('intro-screen');
}

function stopCamera() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach(t => t.stop());
    state.cameraStream = null;
  }
  /** @type {HTMLVideoElement} */ (document.getElementById('camera-video')).srcObject = null;
}

// ========================================
// Photo Capture & Upload
// ========================================

export function capturePhoto() {
  const video = /** @type {HTMLVideoElement} */ (document.getElementById('camera-video'));
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('camera-canvas'));
  const preview = /** @type {HTMLImageElement} */ (document.getElementById('photo-preview'));

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');

  if (state.facingMode === 'user') {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0);
  if (state.facingMode === 'user') {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  state.capturedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  preview.src = canvas.toDataURL('image/jpeg', 0.9);
  preview.style.display = 'block';
  video.style.display = 'none';
  document.querySelector('.face-guide').style.display = 'none';
  document.getElementById('ai-controls').style.display = 'none';
  document.getElementById('ai-tips').style.display = 'none';
  document.getElementById('ai-actions').style.display = 'flex';

  stopCamera();
}

/**
 * @param {Event} event
 */
export function handleUpload(event) {
  const input = /** @type {HTMLInputElement} */ (event.target);
  const file = input.files ? input.files[0] : null;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('camera-canvas'));
      const maxDim = 800;
      let w = img.width, h = img.height;
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      state.capturedImageData = ctx.getImageData(0, 0, w, h);

      const preview = /** @type {HTMLImageElement} */ (document.getElementById('photo-preview'));
      preview.src = canvas.toDataURL('image/jpeg', 0.9);
      preview.style.display = 'block';
      document.getElementById('camera-video').style.display = 'none';
      document.querySelector('.face-guide').style.display = 'none';
      document.getElementById('ai-controls').style.display = 'none';
      document.getElementById('ai-tips').style.display = 'none';
      document.getElementById('ai-nocamera').style.display = 'none';
      document.getElementById('ai-actions').style.display = 'flex';
      stopCamera();
    };
    img.src = /** @type {string} */ (e.target.result);
  };
  reader.readAsDataURL(file);
  input.value = '';
}

export function retakePhoto() {
  state.capturedImageData = null;
  document.getElementById('photo-preview').style.display = 'none';
  document.getElementById('ai-actions').style.display = 'none';
  document.getElementById('detected-colors').style.display = 'none';
  document.getElementById('scan-overlay').style.display = 'none';
  document.getElementById('ai-controls').style.display = 'flex';
  document.getElementById('ai-tips').style.display = 'block';
  document.querySelector('.face-guide').style.display = 'flex';
  startCamera();
}

export function analyzePhoto() {
  if (!state.capturedImageData) return;

  document.getElementById('scan-overlay').style.display = 'block';
  document.getElementById('ai-actions').style.display = 'none';

  setTimeout(() => {
    const colors = extractFaceColors(state.capturedImageData);

    document.getElementById('detected-skin').style.background = rgbStr(colors.skin);
    document.getElementById('detected-hair').style.background = rgbStr(colors.hair);
    document.getElementById('detected-eye').style.background = rgbStr(colors.eye);
    document.getElementById('detected-colors').style.display = 'block';
    document.getElementById('scan-overlay').style.display = 'none';

    state.scores = analyzeColorsToScores(colors);

    setTimeout(() => {
      determineSeason();
      renderResult();
      showScreen('result-screen');
    }, 1500);
  }, 2500);
}

// ========================================
// Color Extraction Engine
// ========================================

/**
 * @typedef {{r: number, g: number, b: number}} RGBColor
 * @typedef {{h: number, s: number, l: number}} HSLColor
 */

/**
 * @param {ImageData} imageData
 * @returns {{skin: RGBColor, hair: RGBColor, eye: RGBColor}}
 */
function extractFaceColors(imageData) {
  const w = imageData.width;
  const h = imageData.height;

  const faceCX = Math.round(w / 2);
  const faceCY = Math.round(h * 0.42);
  const faceW = Math.round(w * 0.55);
  const faceH = Math.round(h * 0.55);

  const skinLeft = sampleRegion(imageData,
    faceCX - Math.round(faceW * 0.28), faceCY + Math.round(faceH * 0.05),
    Math.round(faceW * 0.12), Math.round(faceH * 0.12));
  const skinRight = sampleRegion(imageData,
    faceCX + Math.round(faceW * 0.16), faceCY + Math.round(faceH * 0.05),
    Math.round(faceW * 0.12), Math.round(faceH * 0.12));
  const skin = avgColors(skinLeft, skinRight);

  const hair = sampleRegion(imageData,
    faceCX - Math.round(faceW * 0.15), faceCY - Math.round(faceH * 0.42),
    Math.round(faceW * 0.3), Math.round(faceH * 0.1));

  const eyeLeft = sampleRegion(imageData,
    faceCX - Math.round(faceW * 0.18), faceCY - Math.round(faceH * 0.08),
    Math.round(faceW * 0.1), Math.round(faceH * 0.06));
  const eyeRight = sampleRegion(imageData,
    faceCX + Math.round(faceW * 0.08), faceCY - Math.round(faceH * 0.08),
    Math.round(faceW * 0.1), Math.round(faceH * 0.06));
  const eye = avgColors(eyeLeft, eyeRight);

  return { skin, hair, eye };
}

/**
 * @param {ImageData} imageData
 * @param {number} cx
 * @param {number} cy
 * @param {number} rw
 * @param {number} rh
 * @returns {RGBColor}
 */
function sampleRegion(imageData, cx, cy, rw, rh) {
  const w = imageData.width;
  const h = imageData.height;
  const data = imageData.data;

  let totalR = 0, totalG = 0, totalB = 0, count = 0;
  const x0 = Math.max(0, cx - Math.floor(rw / 2));
  const y0 = Math.max(0, cy - Math.floor(rh / 2));
  const x1 = Math.min(w, cx + Math.ceil(rw / 2));
  const y1 = Math.min(h, cy + Math.ceil(rh / 2));

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const brightness = (r + g + b) / 3;
      if (brightness > 25 && brightness < 245) {
        totalR += r;
        totalG += g;
        totalB += b;
        count++;
      }
    }
  }

  if (count === 0) return { r: 128, g: 128, b: 128 };
  return {
    r: Math.round(totalR / count),
    g: Math.round(totalG / count),
    b: Math.round(totalB / count)
  };
}

/**
 * @param {RGBColor} c1
 * @param {RGBColor} c2
 * @returns {RGBColor}
 */
function avgColors(c1, c2) {
  return {
    r: Math.round((c1.r + c2.r) / 2),
    g: Math.round((c1.g + c2.g) / 2),
    b: Math.round((c1.b + c2.b) / 2)
  };
}

/**
 * @param {RGBColor} c
 * @returns {string}
 */
function rgbStr(c) {
  return `rgb(${c.r},${c.g},${c.b})`;
}

/**
 * @param {RGBColor} c
 * @returns {HSLColor}
 */
function rgbToHsl(c) {
  const r = c.r / 255, g = c.g / 255, b = c.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s, l };
}

// ========================================
// Color Analysis -> 3-Axis Scores
// ========================================

/**
 * @param {{skin: RGBColor, hair: RGBColor, eye: RGBColor}} colors
 * @returns {{temp: number, depth: number, clarity: number}}
 */
function analyzeColorsToScores(colors) {
  const skinHSL = rgbToHsl(colors.skin);
  const hairHSL = rgbToHsl(colors.hair);
  const eyeHSL = rgbToHsl(colors.eye);

  let temp = 0, depth = 0, clarity = 0;

  // === TEMP (Cool <-> Warm) ===
  const skinHue = skinHSL.h;
  if (skinHue >= 18 && skinHue <= 55) temp += 3;
  else if (skinHue >= 10 && skinHue < 18) temp += 1;
  else if (skinHue >= 300 || skinHue < 10) temp -= 2;

  const rbRatio = colors.skin.r / Math.max(colors.skin.b, 1);
  if (rbRatio > 1.5) temp += 2;
  else if (rbRatio > 1.25) temp += 1;
  else if (rbRatio < 1.05) temp -= 2;
  else if (rbRatio < 1.15) temp -= 1;

  const gbRatio = colors.skin.g / Math.max(colors.skin.b, 1);
  if (gbRatio > 1.15) temp += 1;
  else if (gbRatio < 0.95) temp -= 1;

  const hairHue = hairHSL.h;
  if (hairHue >= 15 && hairHue <= 45) temp += 1;
  else if (hairHue >= 200 || hairHue < 10) temp -= 1;

  // === DEPTH (Dark <-> Light) ===
  const overallL = skinHSL.l * 0.45 + hairHSL.l * 0.35 + eyeHSL.l * 0.20;
  if (overallL > 0.55) depth += 5;
  else if (overallL > 0.48) depth += 3;
  else if (overallL > 0.42) depth += 1;
  else if (overallL > 0.35) depth -= 1;
  else if (overallL > 0.28) depth -= 3;
  else depth -= 5;

  // === CLARITY (Soft <-> Clear) ===
  const contrast = Math.abs(skinHSL.l - hairHSL.l);
  if (contrast > 0.55) clarity += 2;
  else if (contrast > 0.4) clarity += 1;
  else if (contrast < 0.15) clarity -= 1;

  if (skinHSL.s > 0.45) clarity += 1;
  else if (skinHSL.s < 0.18) clarity -= 1;

  const eyeContrast = Math.abs(eyeHSL.l - skinHSL.l);
  if (eyeContrast > 0.4) clarity += 1;
  else if (eyeContrast < 0.08) clarity -= 1;

  if (hairHSL.l < 0.15 && eyeHSL.l < 0.25 && contrast > 0.4) {
    clarity -= 1;
  }

  const avgSat = (skinHSL.s + hairHSL.s + eyeHSL.s) / 3;
  if (avgSat < 0.13) clarity -= 2;
  else if (avgSat < 0.20) clarity -= 1;

  temp = Math.max(-12, Math.min(12, temp));
  depth = Math.max(-12, Math.min(12, depth));
  clarity = Math.max(-12, Math.min(12, clarity));

  return { temp, depth, clarity };
}
