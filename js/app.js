/* ===== APP ENTRY POINT ===== */
import { state } from './state.js';
import { SEASONS } from './data/seasons.js';
import { startQuiz, renderQuestion, selectOption, goBack } from './quiz.js';
import { determineSeason } from './scoring.js';
import { renderResult } from './result.js';
import { startAI, switchCamera, exitAI, capturePhoto, handleUpload, retakePhoto, analyzePhoto } from './ai-analysis.js';
import { shareFacebook, shareZalo, copyLink, retakeQuiz } from './share.js';
import { downloadResultCard, downloadStoryCard, downloadWallpaperCard } from './result-card.js';
import { trackQuizStart, trackShare, trackRetake } from './analytics.js';
import { handleCompare, getSeasonOptions } from './comparison.js';
import { prevBestWorst, nextBestWorst } from './result.js';
import { prevDrapingColor, nextDrapingColor, switchDrapingMode, retryDraping, applyDrapingColor } from './draping.js';

// ========================================
// Screen Management
// ========================================

/**
 * Switch to a screen by id, hiding all others.
 * @param {string} id
 */
export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// Loading Screen
// ========================================

/**
 * Show the loading screen with animated steps, then reveal result.
 */
export function showLoading() {
  showScreen('loading-screen');

  const steps = [
    document.getElementById('load-step-1'),
    document.getElementById('load-step-2'),
    document.getElementById('load-step-3')
  ];

  steps.forEach(s => { if (s) s.className = 'load-step'; });

  setTimeout(() => { if (steps[0]) steps[0].classList.add('active'); }, 300);
  setTimeout(() => {
    if (steps[0]) steps[0].classList.replace('active', 'done');
    if (steps[1]) steps[1].classList.add('active');
  }, 1200);
  setTimeout(() => {
    if (steps[1]) steps[1].classList.replace('active', 'done');
    if (steps[2]) steps[2].classList.add('active');
  }, 2200);
  setTimeout(() => {
    determineSeason();
    renderResult();
    showScreen('result-screen');
  }, 3200);
}

// ========================================
// Social Proof Counter
// ========================================

/**
 * Animate the social proof counter from 0 to target.
 */
function initSocialProof() {
  const el = document.getElementById('social-proof-count');
  if (!el) return;
  const target = 50000 + Math.floor(Math.random() * 10000);
  let current = 0;
  const step = Math.ceil(target / 60);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('vi-VN');
    if (current >= target) clearInterval(interval);
  }, 30);
}

// ========================================
// Comparison UI
// ========================================

/**
 * Build the friend season picker for comparison.
 */
function initComparisonPicker() {
  const picker = document.getElementById('compare-picker');
  if (!picker) return;

  const options = getSeasonOptions();
  picker.innerHTML = '';

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'season-chip compare-chip';
    btn.textContent = `${opt.emoji} ${opt.name}`;
    btn.addEventListener('click', () => {
      handleCompare(opt.key);
      trackShare('copy', opt.key);
    });
    picker.appendChild(btn);
  });
}

// ========================================
// Window Global Bindings
// (Required for inline onclick handlers in HTML)
// ========================================

// Quiz
window.startQuiz = function() {
  trackQuizStart('quiz');
  startQuiz();
};
window.goBack = goBack;

// AI
window.startAI = function() {
  trackQuizStart('ai');
  startAI();
};
window.switchCamera = switchCamera;
window.exitAI = exitAI;
window.capturePhoto = capturePhoto;
window.handleUpload = handleUpload;
window.retakePhoto = retakePhoto;
window.analyzePhoto = analyzePhoto;

// Share
window.shareFacebook = function() {
  trackShare('facebook', state.currentSeason ? state.currentSeason.key : '');
  shareFacebook();
};
window.shareZalo = function() {
  trackShare('zalo', state.currentSeason ? state.currentSeason.key : '');
  shareZalo();
};
window.copyLink = function() {
  trackShare('copy', state.currentSeason ? state.currentSeason.key : '');
  copyLink();
};
window.downloadResultCard = function() {
  trackShare('download', state.currentSeason ? state.currentSeason.key : '');
  downloadResultCard();
};
window.downloadStoryCard = function() {
  trackShare('download_story', state.currentSeason ? state.currentSeason.key : '');
  downloadStoryCard();
};
window.downloadWallpaperCard = function() {
  trackShare('download_wallpaper', state.currentSeason ? state.currentSeason.key : '');
  downloadWallpaperCard();
};
window.toggleDownloadMenu = function() {
  const menu = document.getElementById('download-menu');
  if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
};
window.prevBestWorst = prevBestWorst;
window.nextBestWorst = nextBestWorst;
window.prevDrapingColor = prevDrapingColor;
window.nextDrapingColor = nextDrapingColor;
window.switchDrapingMode = switchDrapingMode;
window.retryDraping = retryDraping;
window.applyDrapingColor = applyDrapingColor;
window.switchStyleTab = function(tab) {
  document.querySelectorAll('.style-tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.style-tab').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('style-tab-' + tab);
  if (target) target.style.display = '';
  const btn = document.querySelector(`.style-tab[data-tab="${tab}"]`);
  if (btn) btn.classList.add('active');
};

// Navigation
window.retakeQuiz = function() {
  trackRetake();
  retakeQuiz();
};

// Saved result (A5)
window.viewSavedResult = function() {
  const saved = localStorage.getItem('pct_result');
  if (!saved) return;
  const data = JSON.parse(saved);
  if (data.seasonKey && SEASONS[data.seasonKey]) {
    state.scores.temp = data.scores.temp || 0;
    state.scores.depth = data.scores.depth || 0;
    state.scores.clarity = data.scores.clarity || 0;
    state.currentSeason = SEASONS[data.seasonKey];
    renderResult();
    showScreen('result-screen');
    initComparisonPicker();
  }
};
window.dismissSavedResult = function() {
  const banner = document.getElementById('saved-result-banner');
  if (banner) banner.style.display = 'none';
};

// ========================================
// URL Restoration & Init
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Social proof
  initSocialProof();

  // A5: Show saved result banner if available
  const saved = localStorage.getItem('pct_result');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.seasonKey && SEASONS[data.seasonKey]) {
        const banner = document.getElementById('saved-result-banner');
        const nameEl = document.getElementById('saved-name');
        const emojiEl = document.getElementById('saved-emoji');
        if (banner && nameEl && emojiEl) {
          const season = SEASONS[data.seasonKey];
          nameEl.textContent = season.name;
          emojiEl.textContent = season.emoji;
          banner.style.display = 'flex';
        }
      }
    } catch (e) { /* ignore parse errors */ }
  }

  // URL restoration
  const hash = window.location.hash;
  if (hash && hash.includes('result=')) {
    const params = new URLSearchParams(hash.slice(1));
    const key = params.get('result');
    state.scores.temp = parseInt(params.get('temp') || '0', 10) || 0;
    state.scores.depth = parseInt(params.get('depth') || '0', 10) || 0;
    state.scores.clarity = parseInt(params.get('clarity') || '0', 10) || 0;

    if (key && SEASONS[key]) {
      // Direct match (12-season key)
      state.currentSeason = SEASONS[key];
      renderResult();
      showScreen('result-screen');
      initComparisonPicker();
    } else if (key) {
      // Fallback: old 4-season URL — recalculate from scores
      determineSeason();
      renderResult();
      showScreen('result-screen');
      initComparisonPicker();
    }
  }
});
