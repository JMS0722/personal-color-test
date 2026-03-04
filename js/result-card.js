/* ===== RESULT CARD IMAGE GENERATION ===== */
import { state } from './state.js';

/**
 * Generate a shareable result card image using Canvas API.
 * Produces a 1200×630 image (Instagram Story / OG image ratio).
 * @returns {Promise<Blob|null>}
 */
export async function generateResultCard() {
  const s = state.currentSeason;
  if (!s) return null;

  const W = 1200;
  const H = 630;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, s.light);
  grad.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Left accent bar
  ctx.fillStyle = s.primary;
  ctx.fillRect(0, 0, 8, H);

  // Emoji
  ctx.font = '80px serif';
  ctx.textAlign = 'center';
  ctx.fillText(s.emoji, 600, 120);

  // Season name (Vietnamese)
  ctx.font = 'bold 48px "Nunito", sans-serif';
  ctx.fillStyle = '#2D2D2D';
  ctx.textAlign = 'center';
  ctx.fillText(s.name, 600, 190);

  // English name
  ctx.font = '24px "Nunito", sans-serif';
  ctx.fillStyle = '#666666';
  ctx.fillText(s.enName, 600, 230);

  // Subtitle
  ctx.font = '20px "Nunito", sans-serif';
  ctx.fillStyle = '#888888';
  ctx.fillText(s.subtitle, 600, 270);

  // Color palette swatches
  const paletteY = 320;
  const swatchSize = 50;
  const gap = 12;
  const totalWidth = s.palette.length * (swatchSize + gap) - gap;
  const startX = (W - totalWidth) / 2;

  s.palette.forEach((hex, i) => {
    const x = startX + i * (swatchSize + gap);
    ctx.fillStyle = hex;
    roundRect(ctx, x, paletteY, swatchSize, swatchSize, 8);
    ctx.fill();
  });

  // 3-axis scores
  const axisY = 420;
  const axes = [
    { label: 'Cool ← → Warm', value: state.scores.temp },
    { label: 'Dark ← → Light', value: state.scores.depth },
    { label: 'Soft ← → Clear', value: state.scores.clarity }
  ];

  axes.forEach((axis, i) => {
    const x = 200 + i * 300;
    ctx.font = '14px "Nunito", sans-serif';
    ctx.fillStyle = '#999999';
    ctx.textAlign = 'center';
    ctx.fillText(axis.label, x, axisY);

    // Bar background
    const barW = 200;
    const barH = 12;
    const barX = x - barW / 2;
    const barY = axisY + 10;
    ctx.fillStyle = '#E0E0E0';
    roundRect(ctx, barX, barY, barW, barH, 6);
    ctx.fill();

    // Bar fill
    const maxPossible = 15;
    const pct = (axis.value / maxPossible) * 50;
    const normalizedPct = 50 + Math.max(-50, Math.min(50, pct));
    const center = barW / 2;
    ctx.fillStyle = s.primary;

    if (normalizedPct >= 50) {
      roundRect(ctx, barX + center, barY, (normalizedPct - 50) / 100 * barW, barH, 6);
    } else {
      const fillW = (50 - normalizedPct) / 100 * barW;
      roundRect(ctx, barX + center - fillW, barY, fillW, barH, 6);
    }
    ctx.fill();
  });

  // Footer
  ctx.font = '16px "Nunito", sans-serif';
  ctx.fillStyle = '#BBBBBB';
  ctx.textAlign = 'center';
  ctx.fillText('personal-color-test-5dz.pages.dev', 600, 580);

  // Watermark
  ctx.font = '13px "Nunito", sans-serif';
  ctx.fillStyle = '#CCCCCC';
  ctx.fillText('Bài Test Màu Sắc Cá Nhân Miễn Phí', 600, 610);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

/**
 * Download the result card as an image.
 */
export async function downloadResultCard() {
  const blob = await generateResultCard();
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `personal-color-${state.currentSeason ? state.currentSeason.key : 'result'}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Visual feedback
  const btn = /** @type {HTMLButtonElement|null} */ (document.querySelector('.share-download-btn'));
  if (btn) {
    const original = btn.textContent || '';
    btn.textContent = '✅ Đã tải!';
    setTimeout(() => { btn.textContent = original; }, 2000);
  }
}

/**
 * Draw a rounded rectangle path and fill.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} r
 */
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
