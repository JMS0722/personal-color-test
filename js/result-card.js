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

  // ===== LAYOUT: Left = info, Right = palette + avoid =====
  const LEFT_W = 480;
  const RIGHT_X = LEFT_W;
  const BOTTOM_H = 48;
  const contentH = H - BOTTOM_H;

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // Left panel gradient
  const leftGrad = ctx.createLinearGradient(0, 0, LEFT_W, H);
  leftGrad.addColorStop(0, s.light);
  leftGrad.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = leftGrad;
  ctx.fillRect(0, 0, LEFT_W, contentH);

  // Left accent bar
  ctx.fillStyle = s.primary;
  ctx.fillRect(0, 0, 6, contentH);

  // --- LEFT SIDE: Season info (vertically centered) ---
  const cx = LEFT_W / 2;
  // Total left content height: emoji(72) + gap(20) + name(44) + gap(12) + en(22) + gap(8) + sub(18) + gap(30) + bars(3*18 + 2*65) = 394
  const leftBlockH = 72 + 20 + 44 + 12 + 22 + 8 + 18 + 30 + 3 * 18 + 2 * 65;
  const leftStartY = Math.max(40, (contentH - leftBlockH) / 2);

  // Emoji
  ctx.font = '72px serif';
  ctx.textAlign = 'center';
  let yPos = leftStartY + 72;
  ctx.fillText(s.emoji, cx, yPos);

  // Season name (Vietnamese)
  yPos += 20;
  ctx.font = 'bold 44px sans-serif';
  ctx.fillStyle = '#2D2A26';
  yPos += 44;
  ctx.fillText(s.name, cx, yPos);

  // English name
  yPos += 12;
  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#6B6560';
  yPos += 22;
  ctx.fillText(s.enName, cx, yPos);

  // Subtitle
  yPos += 8;
  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#9E9690';
  yPos += 18;
  ctx.fillText(s.subtitle, cx, yPos);

  // 3-axis scores
  const axes = [
    { left: 'Cool', right: 'Warm', value: state.scores.temp },
    { left: 'Dark', right: 'Light', value: state.scores.depth },
    { left: 'Soft', right: 'Clear', value: state.scores.clarity }
  ];

  yPos += 30;
  const barW = 320;
  const barH = 18;
  const barX = (LEFT_W - barW) / 2;
  const barGap = 65;

  axes.forEach((axis, i) => {
    const by = yPos + i * barGap;

    // Labels
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#9E9690';
    ctx.textAlign = 'right';
    ctx.fillText(axis.left, barX - 10, by + 13);
    ctx.textAlign = 'left';
    ctx.fillText(axis.right, barX + barW + 10, by + 13);

    // Bar background
    ctx.fillStyle = '#E8E0D8';
    roundRect(ctx, barX, by, barW, barH, 9);
    ctx.fill();

    // Center line
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(barX + barW / 2 - 1, by, 2, barH);

    // Bar fill
    const maxPossible = 15;
    const pct = (axis.value / maxPossible) * 50;
    const normalizedPct = 50 + Math.max(-50, Math.min(50, pct));
    const center = barW / 2;
    ctx.fillStyle = s.primary;

    if (normalizedPct >= 50) {
      const fillW = Math.max(2, (normalizedPct - 50) / 100 * barW);
      roundRect(ctx, barX + center, by, fillW, barH, 9);
    } else {
      const fillW = Math.max(2, (50 - normalizedPct) / 100 * barW);
      roundRect(ctx, barX + center - fillW, by, fillW, barH, 9);
    }
    ctx.fill();
  });

  // --- RIGHT SIDE: Color palette grid (4×3) ---
  const rightCX = RIGHT_X + (W - RIGHT_X) / 2;
  const swatchSize = 88;
  const gap = 10;
  const cols = 4;
  const rows = 3;
  const cellH = swatchSize + 20; // swatch + hex label space
  const gridW = cols * swatchSize + (cols - 1) * gap;
  const gridTotalH = rows * cellH + (rows - 1) * 4;
  // Vertically center: palette title + grid + avoid section
  const avoidSectionH = 20 + 8 + 42; // title + gap + swatches
  const rightTotalH = 28 + 12 + gridTotalH + 24 + avoidSectionH; // title + gap + grid + gap + avoid
  const rightStartY = Math.max(20, (contentH - rightTotalH) / 2);
  const gridX = RIGHT_X + (W - RIGHT_X - gridW) / 2;

  // "Bảng màu" title
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#6B6560';
  ctx.textAlign = 'center';
  ctx.fillText('Bảng màu của bạn', rightCX, rightStartY + 20);

  const gridY = rightStartY + 28 + 12;

  s.palette.forEach((hex, i) => {
    if (i >= 12) return;
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = gridX + col * (swatchSize + gap);
    const y = gridY + row * (cellH + 4);
    ctx.fillStyle = hex;
    roundRect(ctx, x, y, swatchSize, swatchSize, 12);
    ctx.fill();

    // Hex label below swatch
    ctx.font = '11px monospace';
    ctx.fillStyle = '#9E9690';
    ctx.textAlign = 'center';
    ctx.fillText(hex, x + swatchSize / 2, y + swatchSize + 15);
  });

  // Avoid colors row
  const avoidY = gridY + gridTotalH + 24;
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#9E9690';
  ctx.textAlign = 'center';
  ctx.fillText('Nên tránh', rightCX, avoidY);

  const avoidSize = 42;
  const avoidGap = 12;
  const avoidCount = Math.min(s.avoid.length, 6);
  const avoidTotalW = avoidCount * avoidSize + (avoidCount - 1) * avoidGap;
  const avoidStartX = RIGHT_X + (W - RIGHT_X - avoidTotalW) / 2;

  s.avoid.forEach((hex, i) => {
    if (i >= 6) return;
    const x = avoidStartX + i * (avoidSize + avoidGap);
    const ay = avoidY + 10;
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = hex;
    roundRect(ctx, x, ay, avoidSize, avoidSize, 8);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // X mark
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.textAlign = 'center';
    ctx.fillText('✕', x + avoidSize / 2, ay + avoidSize / 2 + 6);
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
