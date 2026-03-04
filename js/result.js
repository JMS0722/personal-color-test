/* ===== RESULT RENDERING ===== */
import { state } from './state.js';
import { updateUrlHash } from './share.js';

export function renderResult() {
  const s = state.currentSeason;
  if (!s) return;

  // Apply season theme
  document.documentElement.style.setProperty('--season-primary', s.primary);
  document.documentElement.style.setProperty('--season-light', s.light);
  document.documentElement.style.setProperty('--season-gradient', s.gradient);

  // Header
  document.getElementById('result-emoji').textContent = s.emoji;
  document.getElementById('result-season').textContent = s.name;
  document.getElementById('result-en-name').textContent = s.enName;
  document.getElementById('result-subtitle').textContent = s.subtitle;
  document.getElementById('result-desc').textContent = s.description;

  // Base season badge
  /** @type {Record<string, string>} */
  const baseLabels = { spring: '🌸 Spring', summer: '🌊 Summer', autumn: '🍂 Autumn', winter: '❄️ Winter' };
  const baseBadge = document.getElementById('result-baseseason-badge');
  baseBadge.textContent = baseLabels[s.baseseason] || '';
  baseBadge.className = 'result-baseseason-badge baseseason-' + s.baseseason;

  // Result header background
  const header = document.getElementById('result-header');
  header.style.background = s.light;

  // 3-Axis bar chart
  renderAxisChart();

  // Color palette
  renderPalette(s);

  // Makeup guide
  renderMakeup(s);

  // Clothing
  renderClothing(s);

  // Hair
  renderHair(s);

  // Jewelry
  document.getElementById('jewelry-text').textContent = s.jewelry;

  // Celebrities
  renderCelebrities(s);

  // Products
  renderProducts(s);

  // Scroll animations
  initScrollAnimations();

  // Update URL hash
  updateUrlHash();
}

function renderAxisChart() {
  const { temp, depth, clarity } = state.scores;
  const maxPossible = 15;

  /** @param {number} val */
  const normalize = (val) => {
    const pct = (val / maxPossible) * 50;
    return 50 + Math.max(-50, Math.min(50, pct));
  };

  renderAxisBar('axis-temp', normalize(temp));
  renderAxisBar('axis-depth', normalize(depth));
  renderAxisBar('axis-clarity', normalize(clarity));
}

/**
 * @param {string} id
 * @param {number} pct
 */
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

/**
 * @param {import('./data/seasons.js').SeasonData} s
 */
function renderPalette(s) {
  const grid = document.getElementById('palette-grid');
  if (!grid) return;
  grid.innerHTML = '';
  s.palette.forEach(hex => {
    const div = document.createElement('div');
    div.className = 'swatch';
    div.style.backgroundColor = hex;
    div.innerHTML = `<span class="swatch-hex">${hex}</span>`;
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

/**
 * @param {import('./data/seasons.js').SeasonData} s
 */
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

/**
 * @param {import('./data/seasons.js').SeasonData} s
 */
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

/**
 * @param {import('./data/seasons.js').SeasonData} s
 */
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

/**
 * @param {import('./data/seasons.js').SeasonData} s
 */
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

/**
 * @param {import('./data/seasons.js').SeasonData} s
 */
function renderProducts(s) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // Affiliate disclosure
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

/** Scroll animation using IntersectionObserver */
function initScrollAnimations() {
  const cards = document.querySelectorAll('#result-screen .card');
  cards.forEach(card => card.classList.add('card-hidden'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
}
