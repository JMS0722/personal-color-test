/* ===== FRIEND COMPARISON (144 combinations) ===== */
import { SEASONS } from './data/seasons.js';
import { state } from './state.js';

/**
 * @typedef {Object} ComparisonResult
 * @property {string} myName
 * @property {string} friendName
 * @property {number} score - 0-100 compatibility
 * @property {string} comment
 * @property {string[]} sharedColors
 */

/**
 * Season compatibility matrix.
 * Scores 0-100. Symmetrical (A→B = B→A).
 * Higher = more compatible.
 * @type {Record<string, Record<string, number>>}
 */
const COMPAT_SCORES = buildCompatMatrix();

/**
 * Build the 12×12 compatibility matrix based on color theory rules.
 * Same base season subtypes = high compat (75-95)
 * Adjacent seasons (Spring↔Summer, Summer↔Autumn sharing depth/clarity) = medium (50-70)
 * Opposite seasons (Spring↔Autumn temperature, Summer↔Winter temperature) = low-med (35-55)
 * Same subtype = highest (95)
 * @returns {Record<string, Record<string, number>>}
 */
function buildCompatMatrix() {
  const keys = [
    'brightspring', 'lightspring', 'warmspring',
    'lightsummer', 'coolsummer', 'softsummer',
    'warmautumn', 'deepautumn', 'softautumn',
    'coolwinter', 'deepwinter', 'brightwinter'
  ];

  /** @type {Record<string, string>} */
  const baseOf = {};
  keys.forEach(k => {
    const s = SEASONS[k];
    if (s) baseOf[k] = s.baseseason;
  });

  /** @type {Record<string, Record<string, number>>} */
  const matrix = {};

  for (const a of keys) {
    matrix[a] = {};
    for (const b of keys) {
      if (a === b) {
        matrix[a][b] = 95;
        continue;
      }

      const baseA = baseOf[a] || '';
      const baseB = baseOf[b] || '';

      if (baseA === baseB) {
        // Same base season → high compatibility
        matrix[a][b] = 80;
      } else if (areAdjacent(baseA, baseB)) {
        // Adjacent seasons
        matrix[a][b] = 60;
      } else if (areOpposite(baseA, baseB)) {
        // Opposite seasons → complementary contrast
        matrix[a][b] = 45;
      } else {
        matrix[a][b] = 55;
      }

      // Bonus for shared dominant axis type
      if (sharesDominantType(a, b)) {
        matrix[a][b] += 10;
      }
    }
  }

  return matrix;
}

/**
 * Check if two base seasons are adjacent on the color wheel.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function areAdjacent(a, b) {
  const pairs = [
    ['spring', 'summer'], // share Light
    ['summer', 'autumn'], // share Soft
    ['autumn', 'winter'], // share Dark
    ['winter', 'spring']  // share Clear
  ];
  return pairs.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

/**
 * Check if two base seasons are opposite.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function areOpposite(a, b) {
  return (a === 'spring' && b === 'autumn') ||
         (a === 'autumn' && b === 'spring') ||
         (a === 'summer' && b === 'winter') ||
         (a === 'winter' && b === 'summer');
}

/**
 * Check if two subtypes share a dominant type prefix (e.g., both "light", both "bright").
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function sharesDominantType(a, b) {
  const prefixes = ['bright', 'light', 'warm', 'cool', 'deep', 'soft'];
  for (const p of prefixes) {
    if (a.startsWith(p) && b.startsWith(p)) return true;
  }
  return false;
}

/**
 * Get compatibility comment in Vietnamese.
 * @param {number} score
 * @returns {string}
 */
function getCompatComment(score) {
  if (score >= 90) return 'Hoàn hảo! Hai bạn có phong cách màu sắc rất hài hòa.';
  if (score >= 75) return 'Rất hợp! Các gam màu của hai bạn bổ sung cho nhau tuyệt vời.';
  if (score >= 60) return 'Khá hợp! Có nhiều màu sắc hai bạn cùng mặc đẹp.';
  if (score >= 45) return 'Tương phản thú vị! Sự khác biệt tạo nên điểm nhấn đặc biệt.';
  return 'Đối lập hoàn toàn! Hai bạn tạo nên sự tương phản mạnh mẽ và ấn tượng.';
}

/**
 * Find shared palette colors between two seasons (within CIEDE2000-like threshold).
 * Uses simple hex distance for performance.
 * @param {import('./data/seasons.js').SeasonData} s1
 * @param {import('./data/seasons.js').SeasonData} s2
 * @returns {string[]}
 */
function findSharedColors(s1, s2) {
  /** @type {string[]} */
  const shared = [];
  for (const c1 of s1.palette) {
    for (const c2 of s2.palette) {
      if (hexDistance(c1, c2) < 80) {
        shared.push(c1);
        break;
      }
    }
  }
  return shared.slice(0, 4);
}

/**
 * Simple RGB distance between two hex colors.
 * @param {string} hex1
 * @param {string} hex2
 * @returns {number}
 */
function hexDistance(hex1, hex2) {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

/**
 * Compare the current user's season with a friend's season key.
 * @param {string} friendSeasonKey
 * @returns {ComparisonResult|null}
 */
export function compareWithFriend(friendSeasonKey) {
  const mySeason = state.currentSeason;
  if (!mySeason) return null;

  const friendSeason = SEASONS[friendSeasonKey];
  if (!friendSeason) return null;

  const score = (COMPAT_SCORES[mySeason.key] && COMPAT_SCORES[mySeason.key][friendSeasonKey]) || 50;
  const comment = getCompatComment(score);
  const sharedColors = findSharedColors(mySeason, friendSeason);

  return {
    myName: mySeason.name,
    friendName: friendSeason.name,
    score,
    comment,
    sharedColors
  };
}

/**
 * Render the comparison result into the DOM.
 * @param {ComparisonResult} result
 */
export function renderComparison(result) {
  const card = document.getElementById('compare-card');
  if (!card) return;

  const scoreEl = card.querySelector('.compare-score');
  const commentEl = card.querySelector('.compare-comment');
  const colorsEl = card.querySelector('.compare-shared-colors');

  if (scoreEl) scoreEl.textContent = `${result.score}%`;
  if (commentEl) commentEl.textContent = result.comment;

  if (colorsEl) {
    colorsEl.innerHTML = '';
    result.sharedColors.forEach(hex => {
      const dot = document.createElement('div');
      dot.className = 'compare-color-dot';
      dot.style.backgroundColor = hex;
      colorsEl.appendChild(dot);
    });
  }

  card.style.display = 'block';
}

/**
 * Handle friend season selection for comparison.
 * @param {string} friendKey
 */
export function handleCompare(friendKey) {
  const result = compareWithFriend(friendKey);
  if (result) {
    renderComparison(result);
  }
}

/**
 * Get all available season options for the comparison picker.
 * @returns {{key: string, name: string, emoji: string}[]}
 */
export function getSeasonOptions() {
  return Object.keys(SEASONS).map(key => {
    const s = SEASONS[key];
    return { key, name: s.name, emoji: s.emoji };
  });
}
