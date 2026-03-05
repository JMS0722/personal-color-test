/* ===== RESULT RENDERING ===== */
import { state } from './state.js';
import { SEASONS, ADJACENT_SEASONS } from './data/seasons.js';
import { updateUrlHash } from './share.js';
import { getSeasonConfidence } from './scoring.js';
import { initDraping } from './draping.js';

/** Best/Worst pair navigation index */
let bwIndex = 0;

export function renderResult() {
  const s = state.currentSeason;
  if (!s) return;

  // Apply season theme via CSS custom properties
  const root = document.documentElement;
  root.style.setProperty('--season-primary', s.primary);
  root.style.setProperty('--season-light', s.light);
  root.style.setProperty('--season-gradient', s.gradient);

  // Apply 12-season CSS class for theme (Design Kit §9)
  const resultScreen = document.getElementById('result-screen');
  if (resultScreen) {
    resultScreen.className = resultScreen.className.replace(/season-theme-\S+/g, '').trim();
    resultScreen.classList.add('screen', 'season-theme-' + s.key);
  }

  // Header
  document.getElementById('result-emoji').textContent = s.emoji;
  document.getElementById('result-season').textContent = s.name;
  document.getElementById('result-en-name').textContent = s.enName;
  document.getElementById('result-subtitle').textContent = s.subtitle;
  document.getElementById('result-desc').textContent = s.description;

  // Base season badge
  const baseLabels = { spring: '🌸 Spring', summer: '🌊 Summer', autumn: '🍂 Autumn', winter: '❄️ Winter' };
  const baseBadge = document.getElementById('result-baseseason-badge');
  baseBadge.textContent = baseLabels[s.baseseason] || '';
  baseBadge.className = 'result-baseseason-badge baseseason-' + s.baseseason;

  const header = document.getElementById('result-header');
  header.style.background = '';

  // New sections (A1, A3, B2, A4, B4, B5)
  renderConfidence(s);
  renderAxisChart();
  renderStory(s);
  renderPalette(s);
  renderBestWorst(s);
  renderAdjacentSeasons(s);
  renderMakeup(s);
  renderClothing(s);
  renderHair(s);
  renderNails(s);
  document.getElementById('jewelry-text').textContent = s.jewelry;
  renderCelebrities(s);
  renderProducts(s);
  initDraping();

  // Scroll animations
  initScrollAnimations();

  // Confetti celebration (Design Kit §8-4)
  celebrateResult(s);

  // Save result to localStorage (A5)
  saveResult(s);

  // Update URL hash
  updateUrlHash();
}

/* ===== A1: Season Confidence ===== */
function renderConfidence(s) {
  const container = document.getElementById('confidence-bars');
  const tip = document.getElementById('confidence-tip');
  if (!container) return;
  container.innerHTML = '';

  const conf = getSeasonConfidence();
  const items = [conf.primary, conf.secondary, conf.tertiary].filter(Boolean);

  items.forEach(item => {
    const season = SEASONS[item.key];
    if (!season) return;
    const row = document.createElement('div');
    row.className = 'confidence-row';
    row.innerHTML = `
      <span class="confidence-emoji">${season.emoji}</span>
      <span class="confidence-name">${season.name}</span>
      <div class="confidence-track"><div class="confidence-fill" style="width:0%"></div></div>
      <span class="confidence-pct">${item.percent}%</span>
    `;
    container.appendChild(row);
    // Animate fill
    setTimeout(() => {
      row.querySelector('.confidence-fill').style.width = item.percent + '%';
    }, 200);
  });

  if (tip && conf.secondary) {
    const sec = SEASONS[conf.secondary.key];
    tip.textContent = `💡 Bạn cũng có thể thử các màu thuộc mùa ${sec.name} (${sec.enName})`;
  } else if (tip) {
    tip.textContent = '';
  }
}

/* ===== 3-Axis Bar Chart ===== */
function renderAxisChart() {
  const { temp, depth, clarity } = state.scores;
  const maxPossible = 15;
  const normalize = (val) => 50 + Math.max(-50, Math.min(50, (val / maxPossible) * 50));

  renderAxisBar('axis-temp', normalize(temp));
  renderAxisBar('axis-depth', normalize(depth));
  renderAxisBar('axis-clarity', normalize(clarity));
}

function renderAxisBar(id, pct) {
  const bar = document.getElementById(id);
  if (!bar) return;
  const center = 50;
  if (pct >= center) {
    bar.style.left = center + '%';
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = (pct - center) + '%'; }, 100);
  } else {
    bar.style.left = pct + '%';
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = (center - pct) + '%'; }, 100);
  }
}

/* ===== A3: Season Storytelling ===== */
function renderStory(s) {
  const popEl = document.getElementById('story-population');
  const textEl = document.getElementById('story-text');
  const traitsEl = document.getElementById('story-traits');
  if (!popEl || !textEl || !traitsEl) return;

  if (s.populationPercent) {
    popEl.textContent = `Bạn thuộc nhóm ${s.name} — chiếm khoảng ${s.populationPercent}% dân số.`;
  } else {
    popEl.textContent = '';
  }

  textEl.textContent = s.story || s.description;

  traitsEl.innerHTML = '';
  if (s.traits && s.traits.length) {
    s.traits.forEach(t => {
      const div = document.createElement('div');
      div.className = 'story-trait';
      div.textContent = t;
      traitsEl.appendChild(div);
    });
  }
}

/* ===== Color Palette (A2: hex copy) ===== */
function renderPalette(s) {
  const grid = document.getElementById('palette-grid');
  if (!grid) return;
  grid.innerHTML = '';
  s.palette.forEach(hex => {
    const div = document.createElement('div');
    div.className = 'swatch';
    div.style.backgroundColor = hex;
    const colorName = hexToViName(hex);
    div.innerHTML = `<span class="swatch-hex">${colorName}</span>`;
    div.title = colorName + ' (' + hex + ')';
    // A2: Click to copy hex code
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => {
      navigator.clipboard.writeText(hex).then(() => {
        showToast('Đã sao chép: ' + colorName + ' ' + hex);
      }).catch(() => {
        showToast('Đã sao chép: ' + colorName + ' ' + hex);
      });
    });
    grid.appendChild(div);
  });

  const avoid = document.getElementById('palette-avoid');
  if (!avoid) return;
  avoid.innerHTML = '';
  s.avoid.forEach(hex => {
    const div = document.createElement('div');
    div.className = 'swatch-avoid';
    div.style.backgroundColor = hex;
    avoid.appendChild(div);
  });
}

/* ===== B2: Best vs Worst ===== */
function renderBestWorst(s) {
  const container = document.getElementById('bw-container');
  const card = document.getElementById('bestworst-card');
  if (!container) return;

  if (!s.bestWorstPairs || !s.bestWorstPairs.length) {
    if (card) card.style.display = 'none';
    return;
  }
  if (card) card.style.display = '';

  bwIndex = 0;
  showBestWorstPair(s);
}

function showBestWorstPair(s) {
  const container = document.getElementById('bw-container');
  const counter = document.getElementById('bw-counter');
  if (!container || !s.bestWorstPairs) return;

  const pair = s.bestWorstPairs[bwIndex];
  container.innerHTML = `
    <div class="bw-pair">
      <div class="bw-item best">
        <div class="bw-swatch" style="background:${pair.best.hex}"></div>
        <div class="bw-label" style="color:#4CAF50">✅ Nên mặc</div>
        <div class="bw-name">${pair.best.name}</div>
        <div class="bw-reason">${pair.best.reason}</div>
      </div>
      <div class="bw-item worst">
        <div class="bw-swatch" style="background:${pair.worst.hex}"></div>
        <div class="bw-label" style="color:#e57373">❌ Nên tránh</div>
        <div class="bw-name">${pair.worst.name}</div>
        <div class="bw-reason">${pair.worst.reason}</div>
      </div>
    </div>
  `;
  if (counter) counter.textContent = `${bwIndex + 1} / ${s.bestWorstPairs.length}`;
}

// Exposed to window in app.js
export function prevBestWorst() {
  const s = state.currentSeason;
  if (!s || !s.bestWorstPairs) return;
  bwIndex = (bwIndex - 1 + s.bestWorstPairs.length) % s.bestWorstPairs.length;
  showBestWorstPair(s);
}

export function nextBestWorst() {
  const s = state.currentSeason;
  if (!s || !s.bestWorstPairs) return;
  bwIndex = (bwIndex + 1) % s.bestWorstPairs.length;
  showBestWorstPair(s);
}

/* ===== A4: Adjacent Seasons ===== */
function renderAdjacentSeasons(s) {
  const list = document.getElementById('adjacent-list');
  const card = document.getElementById('adjacent-card');
  if (!list) return;

  const adjKeys = ADJACENT_SEASONS[s.key];
  if (!adjKeys || !adjKeys.length) {
    if (card) card.style.display = 'none';
    return;
  }
  if (card) card.style.display = '';
  list.innerHTML = '';

  adjKeys.forEach(key => {
    const adj = SEASONS[key];
    if (!adj) return;
    const item = document.createElement('div');
    item.className = 'adjacent-item';
    const miniPalette = adj.palette.slice(0, 4).map(hex =>
      `<div class="adjacent-mini-swatch" style="background:${hex}"></div>`
    ).join('');
    item.innerHTML = `
      <div class="adjacent-season-name">${adj.emoji} ${adj.name} (${adj.enName})</div>
      <div class="adjacent-mini-palette">${miniPalette}</div>
    `;
    list.appendChild(item);
  });
}

/* ===== Makeup ===== */
function renderMakeup(s) {
  const grid = document.getElementById('makeup-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const items = [
    { label: 'Kem nền', data: s.makeup.foundation },
    { label: 'Son môi', data: s.makeup.lip },
    { label: 'Má hồng', data: s.makeup.blush },
    { label: 'Phấn mắt', data: s.makeup.eyeshadow }
  ];

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'makeup-item';
    div.innerHTML = `
      <div class="makeup-label">${item.label}</div>
      <div class="makeup-value">${item.data.text}</div>
      <div class="makeup-colors">
        ${item.data.colors.map(c => `<div class="makeup-dot" style="background:${c}"></div>`).join('')}
      </div>
    `;
    grid.appendChild(div);
  });
}

/* ===== Clothing ===== */
function renderClothing(s) {
  const list = document.getElementById('clothing-list');
  if (!list) return;
  list.innerHTML = '';
  s.clothing.forEach(cat => {
    const div = document.createElement('div');
    div.className = 'clothing-item';
    div.innerHTML = `
      <span class="clothing-cat">${cat.cat}</span>
      <div class="clothing-colors">
        ${cat.colors.map(c => `<span class="clothing-tag">${c}</span>`).join('')}
      </div>
    `;
    list.appendChild(div);
  });
}

/* ===== Hair ===== */
function renderHair(s) {
  const list = document.getElementById('hair-list');
  if (!list) return;
  list.innerHTML = '';
  s.hair.forEach(h => {
    const div = document.createElement('div');
    div.className = 'hair-tag';
    div.innerHTML = `<div class="hair-dot" style="background:${h.color}"></div>${h.name}`;
    list.appendChild(div);
  });
}

/* ===== B4: Nail Colors ===== */
function renderNails(s) {
  const list = document.getElementById('nail-list');
  if (!list) return;
  list.innerHTML = '';

  if (!s.nails || !s.nails.length) {
    list.closest('.nail-card').style.display = 'none';
    return;
  }
  list.closest('.nail-card').style.display = '';

  s.nails.forEach(n => {
    const div = document.createElement('div');
    div.className = 'nail-tag';
    div.innerHTML = `<div class="nail-dot" style="background:${n.color}"></div>${n.name}`;
    list.appendChild(div);
  });
}

/* ===== Celebrities ===== */
function renderCelebrities(s) {
  const list = document.getElementById('celeb-list');
  if (!list) return;
  list.innerHTML = '';
  s.celebrities.forEach(name => {
    const span = document.createElement('span');
    span.className = 'celeb-tag';
    span.textContent = name;
    list.appendChild(span);
  });
}

/* ===== Products ===== */
function renderProducts(s) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const disclosure = document.createElement('p');
  disclosure.className = 'affiliate-disclosure';
  disclosure.textContent = 'Bài viết có chứa liên kết liên kết. Chúng tôi có thể nhận hoa hồng khi bạn mua qua liên kết, không ảnh hưởng đến giá bạn phải trả.';
  disclosure.style.gridColumn = '1 / -1';
  grid.appendChild(disclosure);

  s.products.forEach(p => {
    const a = document.createElement('a');
    a.className = 'product-item';
    a.href = p.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = `
      <span class="product-emoji">${p.emoji}</span>
      <span class="product-name">${p.name}</span>
      <span class="product-brand">${p.brand}</span>
      <span class="product-price">${p.price}</span>
    `;
    grid.appendChild(a);
  });
}

/* ===== Scroll Animation (Design Kit §8-5) ===== */
function initScrollAnimations() {
  const cards = document.querySelectorAll('#result-screen .card');
  cards.forEach(card => card.classList.add('card-animate'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
}

/* ===== Confetti (Design Kit §8-4) ===== */
function celebrateResult(s) {
  if (typeof window.confetti !== 'function') return;
  const colors = s.palette.slice(0, 4);
  setTimeout(() => {
    window.confetti({
      particleCount: 60, spread: 55, origin: { y: 0.65 },
      colors, gravity: 0.8, scalar: 0.9, drift: 0,
    });
  }, 600);
}

/* ===== A5: Save result to localStorage ===== */
function saveResult(s) {
  try {
    localStorage.setItem('pct_result', JSON.stringify({
      seasonKey: s.key,
      scores: { ...state.scores },
      timestamp: Date.now(),
    }));
  } catch (e) { /* quota exceeded — ignore */ }
}

/* ===== Hex → Vietnamese color name ===== */
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

  // Near-achromatic
  if (s < 0.08) {
    if (l > 0.92) return 'Trắng';
    if (l > 0.75) return 'Xám nhạt';
    if (l > 0.45) return 'Xám';
    if (l > 0.2) return 'Xám đậm';
    return 'Đen';
  }

  // Lightness prefix
  let prefix = '';
  if (l > 0.82) prefix = 'nhạt ';
  else if (l < 0.25) prefix = 'đậm ';

  // Hue → name
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

  // Saturation modifier
  if (s < 0.25) name += ' xám';
  else if (s > 0.8 && l > 0.5) name += ' tươi';

  return prefix ? name + ' ' + prefix.trim() : name;
}

/* ===== Toast notification ===== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}
