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

/**
 * Calculate confidence percentages for all 12 seasons.
 * Returns top 3 seasons with percentages.
 * @returns {{ primary: {key: string, percent: number}, secondary: {key: string, percent: number}|null, tertiary: {key: string, percent: number}|null }}
 */
export function getSeasonConfidence() {
  const { temp, depth, clarity } = state.scores;

  // Season axis expectations: temp direction, depth direction, clarity direction
  /** @type {Record<string, {t: number, d: number, c: number}>} */
  const defs = {
    brightspring:  { t:  1, d:  1, c:  2 },
    lightspring:   { t:  1, d:  2, c:  1 },
    warmspring:    { t:  2, d:  1, c:  1 },
    lightsummer:   { t: -1, d:  2, c: -1 },
    coolsummer:    { t: -2, d:  1, c: -1 },
    softsummer:    { t: -1, d:  1, c: -2 },
    softautumn:    { t:  1, d: -1, c: -2 },
    warmautumn:    { t:  2, d: -1, c: -1 },
    deepautumn:    { t:  1, d: -2, c: -1 },
    deepwinter:    { t: -1, d: -2, c:  1 },
    coolwinter:    { t: -2, d: -1, c:  1 },
    brightwinter:  { t: -1, d:  1, c:  2 },
  };

  /** @type {Record<string, number>} */
  const affinities = {};
  for (const [key, def] of Object.entries(defs)) {
    const score = temp * def.t + depth * def.d + clarity * def.c;
    affinities[key] = Math.max(0, score);
  }

  const total = Object.values(affinities).reduce((a, b) => a + b, 0) || 1;
  const sorted = Object.entries(affinities)
    .map(([key, val]) => ({ key, percent: Math.round((val / total) * 100) }))
    .sort((a, b) => b.percent - a.percent);

  // Ensure primary matches current season
  const currentKey = state.currentSeason ? state.currentSeason.key : sorted[0].key;
  const currentIdx = sorted.findIndex(s => s.key === currentKey);
  if (currentIdx > 0) {
    const current = sorted.splice(currentIdx, 1)[0];
    current.percent = Math.max(current.percent, sorted[0].percent);
    sorted.unshift(current);
  }

  return {
    primary: sorted[0],
    secondary: sorted[1] && sorted[1].percent > 5 ? sorted[1] : null,
    tertiary: sorted[2] && sorted[2].percent > 5 ? sorted[2] : null,
  };
}
