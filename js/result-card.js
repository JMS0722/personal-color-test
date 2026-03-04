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

  // ===== LAYOUT: Left = info, Right = palette + axis =====
  const LEFT_W = 520;
  const RIGHT_X = LEFT_W;

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // Left panel gradient
  const leftGrad = ctx.createLinearGradient(0, 0, LEFT_W, H);
  leftGrad.addColorStop(0, s.light);
  leftGrad.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = leftGrad;
  ctx.fillRect(0, 0, LEFT_W, H);

  // Left accent bar
  ctx.fillStyle = s.primary;
  ctx.fillRect(0, 0, 6, H);

  // --- LEFT SIDE: Season info ---
  const cx = LEFT_W / 2;

  // Emoji
  ctx.font = '72px serif';
  ctx.textAlign = 'center';
  ctx.fillText(s.emoji, cx, 130);

  // Season name (Vietnamese)
  ctx.font = 'bold 44px sans-serif';
  ctx.fillStyle = '#2D2A26';
  ctx.fillText(s.name, cx, 200);

  // English name
  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#6B6560';
  ctx.fillText(s.enName, cx, 240);

  // Subtitle
  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#9E9690';
  ctx.fillText(s.subtitle, cx, 275);

  // 3-axis scores (vertical stack on left)
  const axes = [
    { left: 'Cool', right: 'Warm', value: state.scores.temp },
    { left: 'Dark', right: 'Light', value: state.scores.depth },
    { left: 'Soft', right: 'Clear', value: state.scores.clarity }
  ];

  const barStartY = 320;
  const barW = 340;
  const barH = 16;
  const barX = (LEFT_W - barW) / 2;
  const barGap = 56;

  axes.forEach((axis, i) => {
    const y = barStartY + i * barGap;

    // Labels
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#9E9690';
    ctx.textAlign = 'right';
    ctx.fillText(axis.left, barX - 8, y + 12);
    ctx.textAlign = 'left';
    ctx.fillText(axis.right, barX + barW + 8, y + 12);

    // Bar background
    ctx.fillStyle = '#E8E0D8';
    roundRect(ctx, barX, y, barW, barH, 8);
    ctx.fill();

    // Center line
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(barX + barW / 2 - 1, y, 2, barH);

    // Bar fill
    const maxPossible = 15;
    const pct = (axis.value / maxPossible) * 50;
    const normalizedPct = 50 + Math.max(-50, Math.min(50, pct));
    const center = barW / 2;
    ctx.fillStyle = s.primary;

    if (normalizedPct >= 50) {
      const fillW = Math.max(2, (normalizedPct - 50) / 100 * barW);
      roundRect(ctx, barX + center, y, fillW, barH, 8);
    } else {
      const fillW = Math.max(2, (50 - normalizedPct) / 100 * barW);
      roundRect(ctx, barX + center - fillW, y, fillW, barH, 8);
    }
    ctx.fill();
  });

  // --- RIGHT SIDE: Color palette grid (6×2) ---
  const swatchSize = 80;
  const gap = 12;
  const cols = 6;
  const rows = 2;
  const gridW = cols * swatchSize + (cols - 1) * gap;
  const gridH = rows * swatchSize + (rows - 1) * gap;
  const gridX = RIGHT_X + (W - RIGHT_X - gridW) / 2;
  const gridY = 60;

  s.palette.forEach((hex, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = gridX + col * (swatchSize + gap);
    const y = gridY + row * (swatchSize + gap);
    ctx.fillStyle = hex;
    roundRect(ctx, x, y, swatchSize, swatchSize, 12);
    ctx.fill();

    // Hex label
    ctx.font = '11px monospace';
    ctx.fillStyle = '#9E9690';
    ctx.textAlign = 'center';
    ctx.fillText(hex, x + swatchSize / 2, y + swatchSize + 16);
  });

  // "Bảng màu" title above grid
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#6B6560';
  ctx.textAlign = 'center';
  ctx.fillText('Bảng màu của bạn', RIGHT_X + (W - RIGHT_X) / 2, gridY - 20);

  // Avoid colors row below palette
  const avoidY = gridY + gridH + 40;
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#9E9690';
  ctx.textAlign = 'center';
  ctx.fillText('Nên tránh', RIGHT_X + (W - RIGHT_X) / 2, avoidY);

  const avoidSize = 36;
  const avoidGap = 10;
  const avoidCount = Math.min(s.avoid.length, 6);
  const avoidTotalW = avoidCount * avoidSize + (avoidCount - 1) * avoidGap;
  const avoidStartX = RIGHT_X + (W - RIGHT_X - avoidTotalW) / 2;

  s.avoid.forEach((hex, i) => {
    if (i >= 6) return;
    const x = avoidStartX + i * (avoidSize + avoidGap);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = hex;
    roundRect(ctx, x, avoidY + 12, avoidSize, avoidSize, 6);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // X mark
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.textAlign = 'center';
    ctx.fillText('✕', x + avoidSize / 2, avoidY + 12 + avoidSize / 2 + 5);
  });

  // --- BOTTOM BAR ---
  const barBottomH = 48;
  const barBottomY = H - barBottomH;
  const bottomGrad = ctx.createLinearGradient(0, barBottomY, W, barBottomY);
  bottomGrad.addColorStop(0, s.primary);
  bottomGrad.addColorStop(1, s.light);
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, barBottomY, W, barBottomH);

  ctx.font = '15px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText('personal-color-test-5dz.pages.dev  ·  Miễn phí 100%', W / 2, barBottomY + 30);

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
