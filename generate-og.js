/**
 * OG Image Generator — Personal Color Test
 * 1200×630 social sharing image
 * Run: node generate-og.js
 */
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 1200, H = 630;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// ===== BACKGROUND =====
// Warm cream base
ctx.fillStyle = '#FFFBF5';
ctx.fillRect(0, 0, W, H);

// Gradient overlay (subtle gold → rose)
const bgGrad = ctx.createLinearGradient(0, 0, W, H);
bgGrad.addColorStop(0, 'rgba(201,149,107,0.08)');
bgGrad.addColorStop(0.5, 'rgba(255,251,245,0)');
bgGrad.addColorStop(1, 'rgba(212,118,138,0.08)');
ctx.fillStyle = bgGrad;
ctx.fillRect(0, 0, W, H);

// ===== DECORATIVE CIRCLES (season colors) =====
const circles = [
  { x: 80,   y: 80,   r: 120, color: 'rgba(255,209,102,0.15)' },  // spring yellow
  { x: 1120, y: 80,   r: 100, color: 'rgba(108,155,207,0.12)' },  // summer blue
  { x: 100,  y: 550,  r: 90,  color: 'rgba(196,114,58,0.12)' },   // autumn brown
  { x: 1100, y: 550,  r: 110, color: 'rgba(91,33,182,0.10)' },    // winter purple
  { x: 600,  y: 60,   r: 180, color: 'rgba(201,149,107,0.06)' },  // center gold
  { x: 600,  y: 580,  r: 160, color: 'rgba(212,118,138,0.06)' },  // center rose
];
circles.forEach(c => {
  ctx.beginPath();
  ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
  ctx.fillStyle = c.color;
  ctx.fill();
});

// ===== TOP BADGE =====
const badgeW = 220, badgeH = 36;
const badgeX = (W - badgeW) / 2, badgeY = 60;
const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY);
badgeGrad.addColorStop(0, '#C9956B');
badgeGrad.addColorStop(1, '#D4768A');
roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 18);
ctx.fillStyle = badgeGrad;
ctx.fill();

ctx.fillStyle = '#FFFFFF';
ctx.font = '600 14px Inter, Arial, sans-serif';
ctx.textAlign = 'center';
ctx.fillText('Personal Color Test', W / 2, badgeY + 23);

// ===== MAIN TITLE =====
ctx.textAlign = 'center';

// Gradient text effect (simulate with solid gold)
ctx.font = '800 56px Inter, Arial, sans-serif';
ctx.fillStyle = '#C9956B';
ctx.fillText('Trắc Nghiệm', W / 2, 165);

ctx.font = '800 56px Inter, Arial, sans-serif';
ctx.fillStyle = '#D4768A';
ctx.fillText('Màu Sắc Cá Nhân', W / 2, 230);

// ===== SUBTITLE =====
ctx.font = '400 20px Inter, Arial, sans-serif';
ctx.fillStyle = '#6B6560';
ctx.fillText('Khám phá mùa màu phù hợp nhất với bạn', W / 2, 275);

// ===== 4 SEASON CARDS =====
const seasons = [
  { emoji: '\uD83C\uDF38', name: 'Xuân',  color: '#E8833A', bg: '#FFF5E6', border: '#FFD166' },
  { emoji: '\uD83C\uDF0A', name: 'Hạ',    color: '#4A8FD4', bg: '#EBF5FF', border: '#93C5FD' },
  { emoji: '\uD83C\uDF42', name: 'Thu',    color: '#C4723A', bg: '#FFF0E6', border: '#DEB887' },
  { emoji: '\u2744\uFE0F', name: 'Đông',  color: '#6B4CC4', bg: '#F0E8FF', border: '#C4B5FD' },
];

const cardW = 200, cardH = 110, cardGap = 30;
const totalCardsW = seasons.length * cardW + (seasons.length - 1) * cardGap;
const cardsStartX = (W - totalCardsW) / 2;
const cardsY = 310;

seasons.forEach((s, i) => {
  const cx = cardsStartX + i * (cardW + cardGap);

  // Card shadow
  ctx.shadowColor = 'rgba(0,0,0,0.06)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 4;

  // Card bg
  roundRect(ctx, cx, cardsY, cardW, cardH, 16);
  ctx.fillStyle = s.bg;
  ctx.fill();

  // Card border
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  roundRect(ctx, cx, cardsY, cardW, cardH, 16);
  ctx.strokeStyle = s.border;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Emoji
  ctx.font = '36px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000';
  ctx.fillText(s.emoji, cx + cardW / 2, cardsY + 48);

  // Season name
  ctx.font = '700 18px Inter, Arial, sans-serif';
  ctx.fillStyle = s.color;
  ctx.fillText(s.name, cx + cardW / 2, cardsY + 82);

  // Color bar at bottom
  roundRect(ctx, cx + 30, cardsY + cardH - 10, cardW - 60, 4, 2);
  ctx.fillStyle = s.color;
  ctx.fill();
});

// ===== COLOR PALETTE ROW =====
const paletteColors = [
  '#FFD166', '#FF9A56', '#F4845F', '#FF6B6B',
  '#B4C7E7', '#C084FC', '#93C5FD', '#FDA4AF',
  '#C4723A', '#8B6F47', '#556B2F', '#DEB887',
  '#5B21B6', '#DC2626', '#0EA5E9', '#BE185D'
];
const dotR = 10, dotGap = 6;
const totalDotsW = paletteColors.length * (dotR * 2 + dotGap) - dotGap;
const dotsStartX = (W - totalDotsW) / 2;
const dotsY = 460;

paletteColors.forEach((c, i) => {
  const dx = dotsStartX + i * (dotR * 2 + dotGap) + dotR;
  ctx.beginPath();
  ctx.arc(dx, dotsY, dotR, 0, Math.PI * 2);
  ctx.fillStyle = c;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();
});

// ===== FEATURES ROW =====
const features = [
  { icon: '\uD83D\uDCF7', text: 'AI Phân tích ảnh' },
  { icon: '\uD83C\uDFA8', text: 'Bảng màu cá nhân' },
  { icon: '\uD83D\uDC84', text: 'Gợi ý makeup' },
  { icon: '\uD83D\uDC57', text: 'Phối đồ phù hợp' },
];
const featGap = 40;
const featTotalW = features.reduce((sum, f) => {
  ctx.font = '500 16px Inter, Arial, sans-serif';
  return sum + ctx.measureText(f.icon + ' ' + f.text).width;
}, 0) + (features.length - 1) * featGap;
let featX = (W - featTotalW) / 2;
const featY = 510;

ctx.font = '500 16px Inter, Arial, sans-serif';
ctx.textAlign = 'left';
features.forEach((f, i) => {
  const label = f.icon + '  ' + f.text;
  ctx.fillStyle = '#6B6560';
  ctx.fillText(label, featX, featY);
  featX += ctx.measureText(label).width + featGap;
});

// ===== BOTTOM BAR =====
const barGrad = ctx.createLinearGradient(0, H - 6, W, H - 6);
barGrad.addColorStop(0, '#C9956B');
barGrad.addColorStop(1, '#D4768A');
ctx.fillStyle = barGrad;
ctx.fillRect(0, H - 6, W, 6);

// ===== FOOTER TEXT =====
ctx.font = '500 14px Inter, Arial, sans-serif';
ctx.textAlign = 'center';
ctx.fillStyle = '#A09890';
ctx.fillText('personal-color-test-5dz.pages.dev  ·  Miễn phí 100%  ·  12 câu hỏi + AI', W / 2, H - 22);

// ===== SAVE =====
const buffer = canvas.toBuffer('image/jpeg', { quality: 0.92 });
fs.writeFileSync(path.join(__dirname, 'og-image.jpg'), buffer);
console.log('og-image.jpg created (1200x630, ' + Math.round(buffer.length / 1024) + 'KB)');

// ===== HELPER =====
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
