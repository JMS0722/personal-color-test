/* ===== GA4 ANALYTICS EVENT TRACKING ===== */

/**
 * @typedef {'quiz_start'|'quiz_complete'|'ai_start'|'ai_complete'|'share_facebook'|'share_zalo'|'share_copy'|'share_download'|'product_click'|'retake'|'compare_start'} EventName
 */

/**
 * Track a GA4 event. No-op if gtag is not loaded.
 * @param {EventName} eventName
 * @param {Record<string, string|number>} [params]
 */
export function trackEvent(eventName, params) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params || {});
  }
}

/**
 * Track quiz start.
 * @param {'quiz'|'ai'} method
 */
export function trackQuizStart(method) {
  trackEvent(method === 'ai' ? 'ai_start' : 'quiz_start', { method });
}

/**
 * Track quiz/AI completion with result season.
 * @param {'quiz'|'ai'} method
 * @param {string} season
 */
export function trackQuizComplete(method, season) {
  trackEvent(method === 'ai' ? 'ai_complete' : 'quiz_complete', { method, season });
}

/**
 * Track share action.
 * @param {'facebook'|'zalo'|'copy'|'download'} platform
 * @param {string} season
 */
export function trackShare(platform, season) {
  trackEvent(/** @type {EventName} */ (`share_${platform}`), { platform, season });
}

/**
 * Track product click.
 * @param {string} productName
 * @param {string} brand
 * @param {string} season
 */
export function trackProductClick(productName, brand, season) {
  trackEvent('product_click', { product_name: productName, brand, season });
}

/**
 * Track retake action.
 */
export function trackRetake() {
  trackEvent('retake');
}
