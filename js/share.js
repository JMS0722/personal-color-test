/* ===== SHARING & URL MANAGEMENT ===== */
import { state } from './state.js';
import { showScreen } from './app.js';

/**
 * Build the full result URL with hash parameters.
 * @returns {string}
 */
export function getResultUrl() {
  if (!state.currentSeason) return window.location.origin + '/';
  return window.location.origin + window.location.pathname +
    `#result=${state.currentSeason.key}&temp=${state.scores.temp}&depth=${state.scores.depth}&clarity=${state.scores.clarity}`;
}

/**
 * Update the URL hash to reflect the current result.
 */
export function updateUrlHash() {
  if (!state.currentSeason) return;
  window.location.hash = `result=${state.currentSeason.key}&temp=${state.scores.temp}&depth=${state.scores.depth}&clarity=${state.scores.clarity}`;
}

/**
 * Get pre-written share text for the current season.
 * @returns {string}
 */
export function getShareText() {
  if (!state.currentSeason) return '';
  const s = state.currentSeason;
  return `${s.emoji} Tôi là ${s.name} (${s.enName})! Bạn thuộc mùa nào? Làm bài test miễn phí:`;
}

/**
 * Share to Facebook via sharer dialog.
 */
export function shareFacebook() {
  const url = encodeURIComponent(getResultUrl());
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

/**
 * Share to Zalo via Zalo sharing API.
 */
export function shareZalo() {
  const url = encodeURIComponent(getResultUrl());
  const text = encodeURIComponent(getShareText());
  window.open(`https://zalo.me/share?url=${url}&title=${text}`, '_blank', 'width=600,height=400');
}

/**
 * Copy result link to clipboard with visual feedback.
 */
export function copyLink() {
  const btn = /** @type {HTMLButtonElement|null} */ (document.querySelector('.copy-btn'));
  if (!btn) return;
  navigator.clipboard.writeText(getResultUrl()).then(() => {
    btn.textContent = '✅ Đã sao chép!';
    setTimeout(() => { btn.textContent = '🔗 Sao chép link'; }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = getResultUrl();
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✅ Đã sao chép!';
    setTimeout(() => { btn.textContent = '🔗 Sao chép link'; }, 2000);
  });
}

/**
 * Reset and return to intro screen.
 */
export function retakeQuiz() {
  window.location.hash = '';
  showScreen('intro-screen');
}
