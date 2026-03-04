/* ===== SEASON DETERMINATION (2-STAGE: base season -> subtype) ===== */
import { SEASONS } from './data/seasons.js';
import { state } from './state.js';

/**
 * Stage 1: Determine base season via affinity formula
 * @param {number} temp
 * @param {number} depth
 * @param {number} clarity
 * @returns {'spring'|'summer'|'autumn'|'winter'}
 */
export function getBaseSeason(temp, depth, clarity) {
  /** @type {Record<string, number>} */
  const affinities = {
    spring: temp + depth + clarity,     // Warm + Light + Clear
    summer: -temp + depth - clarity,    // Cool + Light + Soft
    autumn: temp - depth - clarity,     // Warm + Dark + Soft
    winter: -temp - depth + clarity     // Cool + Dark + Clear
  };

  let best = 'spring';
  let bestScore = -Infinity;
  for (const [season, score] of Object.entries(affinities)) {
    if (score > bestScore) {
      bestScore = score;
      best = season;
    }
  }
  return /** @type {'spring'|'summer'|'autumn'|'winter'} */ (best);
}

/**
 * Stage 2: Within a base season, pick subtype by dominant axis
 * @param {'spring'|'summer'|'autumn'|'winter'} baseSeason
 * @param {number} temp
 * @param {number} depth
 * @param {number} clarity
 * @returns {string}
 */
export function getSubtype(baseSeason, temp, depth, clarity) {
  const absTemp = Math.abs(temp);
  const absDepth = Math.abs(depth);
  const absClarity = Math.abs(clarity);

  switch (baseSeason) {
    case 'spring':
      if (absClarity >= absDepth && absClarity >= absTemp) return 'brightspring';
      if (absDepth >= absTemp) return 'lightspring';
      return 'warmspring';

    case 'summer':
      if (absDepth >= absTemp && absDepth >= absClarity) return 'lightsummer';
      if (absTemp >= absClarity) return 'coolsummer';
      return 'softsummer';

    case 'autumn':
      if (absTemp >= absDepth && absTemp >= absClarity) return 'warmautumn';
      if (absDepth >= absClarity) return 'deepautumn';
      return 'softautumn';

    case 'winter':
      if (absTemp >= absDepth && absTemp >= absClarity) return 'coolwinter';
      if (absDepth >= absClarity) return 'deepwinter';
      return 'brightwinter';

    default:
      return 'brightspring';
  }
}

export function determineSeason() {
  const { temp, depth, clarity } = state.scores;
  const baseSeason = getBaseSeason(temp, depth, clarity);
  const subtype = getSubtype(baseSeason, temp, depth, clarity);
  state.currentSeason = SEASONS[subtype];
}
