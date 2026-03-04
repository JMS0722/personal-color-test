/* ===================================================================
   Personal Color Test — Comprehensive Test Suite (12-Season, Modular)
   Run with: node test_suite.js
   =================================================================== */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
let pass = 0, fail = 0, warn = 0;
const failures = [];

function ok(desc) { pass++; console.log(`  [PASS] ${desc}`); }
function ng(desc, detail) { fail++; failures.push({ desc, detail }); console.log(`  [FAIL] ${desc} — ${detail}`); }
function wn(desc) { warn++; console.log(`  [WARN] ${desc}`); }
function section(title) { console.log(`\n=== ${title} ===`); }

// ===== LOAD FILES =====
const htmlSrc = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');

// Load all CSS files
const cssFiles = ['base.css', 'components.css', 'screens.css', 'seasons.css'];
let cssSrc = '';
cssFiles.forEach(f => {
  const p = path.join(DIR, 'css', f);
  if (fs.existsSync(p)) cssSrc += fs.readFileSync(p, 'utf8') + '\n';
});

// Load all JS files
const jsFiles = [
  'js/data/questions.js', 'js/data/seasons.js',
  'js/state.js', 'js/scoring.js', 'js/quiz.js', 'js/result.js',
  'js/ai-analysis.js', 'js/share.js', 'js/app.js',
  'js/analytics.js', 'js/result-card.js', 'js/comparison.js'
];
let allJsSrc = '';
const jsSources = {};
jsFiles.forEach(f => {
  const p = path.join(DIR, f);
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    jsSources[f] = content;
    allJsSrc += content + '\n';
  }
});

// ===== EXTRACT DATA FROM MODULE FILES =====
/** @type {Array<{id: number, text: string, hint: string, options: Array<{text: string, temp: number, depth: number, clarity: number}>, primaryAxis: string, secondaryAxis: string, weight: number, phase: number}>} */
let QUESTIONS;
let SEASONS;
let PHASE1_IDS;
let AXIS_QUESTIONS;

try {
  // Extract QUESTIONS from questions.js
  const qSrc = jsSources['js/data/questions.js'] || '';
  const qBody = qSrc
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/\/\*\*[\s\S]*?\*\//g, '')
    .replace(/import\s+.*?;\n/g, '');
  const qFn = new Function(qBody + '\nreturn { QUESTIONS, PHASE1_IDS, AXIS_QUESTIONS };');
  const qData = qFn();
  QUESTIONS = qData.QUESTIONS;
  PHASE1_IDS = qData.PHASE1_IDS;
  AXIS_QUESTIONS = qData.AXIS_QUESTIONS;
} catch (e) {
  console.error('Cannot extract QUESTIONS:', e.message);
}

try {
  // Extract SEASONS from seasons.js
  const sSrc = jsSources['js/data/seasons.js'] || '';
  const sBody = sSrc
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/\/\*\*[\s\S]*?\*\//g, '')
    .replace(/import\s+.*?;\n/g, '');
  const sFn = new Function(sBody + '\nreturn SEASONS;');
  SEASONS = sFn();
} catch (e) {
  console.error('Cannot extract SEASONS:', e.message);
}

// ===== 1. FILE STRUCTURE VALIDATION =====
section('1. FILE STRUCTURE VALIDATION');

const expectedFiles = [
  'index.html',
  'css/base.css', 'css/components.css', 'css/screens.css', 'css/seasons.css',
  'js/app.js', 'js/state.js', 'js/scoring.js', 'js/quiz.js', 'js/result.js',
  'js/ai-analysis.js', 'js/share.js', 'js/analytics.js',
  'js/result-card.js', 'js/comparison.js',
  'js/data/questions.js', 'js/data/seasons.js'
];
let missingFiles = 0;
expectedFiles.forEach(f => {
  if (fs.existsSync(path.join(DIR, f))) {
    ok(`File: ${f}`);
  } else {
    ng(`File: ${f}`, 'Not found');
    missingFiles++;
  }
});

// Module imports check
if (htmlSrc.includes('type="module"') && htmlSrc.includes('js/app.js')) {
  ok('index.html uses ES module script');
} else {
  ng('Module import', 'Missing type="module" or js/app.js reference');
}

// CSS links
cssFiles.forEach(f => {
  if (htmlSrc.includes(`css/${f}`)) ok(`CSS link: css/${f}`);
  else ng(`CSS link: css/${f}`, 'Not found in index.html');
});

// ===== 2. SEO & META TAGS =====
section('2. SEO & META TAGS');

const metaChecks = [
  ['og:type', /property="og:type"\s+content="website"/],
  ['og:url', /property="og:url"/],
  ['og:title', /property="og:title"/],
  ['og:description', /property="og:description"/],
  ['og:image', /property="og:image"/],
  ['og:image:width', /property="og:image:width"\s+content="1200"/],
  ['og:image:height', /property="og:image:height"\s+content="630"/],
  ['og:locale', /property="og:locale"\s+content="vi_VN"/],
  ['twitter:card', /name="twitter:card"\s+content="summary_large_image"/],
  ['canonical', /rel="canonical"/],
  ['lang="vi"', /html lang="vi"/],
  ['Schema.org Quiz', /"@type":\s*"Quiz"/],
  ['meta description', /name="description"\s+content=/],
  ['meta keywords', /name="keywords"\s+content=/],
  ['viewport', /name="viewport"/],
];

metaChecks.forEach(([name, regex]) => {
  if (regex.test(htmlSrc)) ok(`Meta: ${name}`);
  else ng(`Meta: ${name}`, 'Not found in index.html');
});

if (htmlSrc.includes('<!DOCTYPE html>') && htmlSrc.includes('</html>')) {
  ok('index.html has doctype and closing tag');
} else {
  ng('index.html structure', 'Missing DOCTYPE or closing tag');
}

const titleMatch = htmlSrc.match(/<title>([^<]+)<\/title>/);
if (titleMatch) {
  const titleLen = titleMatch[1].length;
  if (titleLen <= 70) ok(`Title length: ${titleLen} chars (good)`);
  else wn(`Title length: ${titleLen} chars (ideally <= 70)`);
} else {
  ng('Title', 'Missing <title> tag');
}

// ===== 3. SCREEN STRUCTURE =====
section('3. SCREEN STRUCTURE');

const requiredScreens = ['intro-screen', 'ai-screen', 'quiz-screen', 'loading-screen', 'result-screen'];
requiredScreens.forEach(id => {
  if (htmlSrc.includes(`id="${id}"`)) ok(`Screen: ${id}`);
  else ng(`Screen: ${id}`, 'Missing in HTML');
});

const activeScreens = htmlSrc.match(/class="screen active"/g) || [];
if (activeScreens.length === 1 && htmlSrc.includes('id="intro-screen" class="screen active"')) {
  ok('Only intro-screen starts as active');
} else {
  ng('Active screens', `Found ${activeScreens.length} active screens`);
}

// ===== 4. QUIZ DATA INTEGRITY =====
section('4. QUIZ DATA INTEGRITY');

if (QUESTIONS && QUESTIONS.length === 12) {
  ok(`QUESTIONS count: ${QUESTIONS.length}`);
} else {
  ng('QUESTIONS count', `Expected 12, got ${QUESTIONS ? QUESTIONS.length : 'undefined'}`);
}

if (QUESTIONS) {
  let qDataOk = true;
  QUESTIONS.forEach((q, i) => {
    if (!q.id || !q.text || !q.options) {
      ng(`Q${q.id || i + 1} fields`, 'Missing id/text/options');
      qDataOk = false;
      return;
    }
    if (q.options.length !== 4) {
      ng(`Q${q.id} options`, `Expected 4, got ${q.options.length}`);
      qDataOk = false;
    }
    q.options.forEach((opt, j) => {
      if (typeof opt.temp !== 'number' || typeof opt.depth !== 'number' || typeof opt.clarity !== 'number') {
        ng(`Q${q.id} opt${j + 1}`, 'Missing score axis');
        qDataOk = false;
      }
    });
    if (!q.hint) {
      wn(`Q${q.id} hint missing`);
    }
  });
  if (qDataOk) ok('All 12 questions have valid structure (id, text, hint, 4 options with 3-axis scores)');
}

// ===== 5. INPUT-BASED PAGING FIELDS =====
section('5. INPUT-BASED PAGING FIELDS');

if (QUESTIONS) {
  let pagingFieldsOk = true;
  QUESTIONS.forEach(q => {
    if (!q.primaryAxis || !('secondaryAxis' in q) || typeof q.weight !== 'number' || typeof q.phase !== 'number') {
      ng(`Q${q.id} paging fields`, 'Missing primaryAxis/secondaryAxis/weight/phase');
      pagingFieldsOk = false;
    }
  });
  if (pagingFieldsOk) ok('All questions have input-based paging fields (primaryAxis, secondaryAxis, weight, phase)');

  // Verify primaryAxis values
  const validAxes = ['temp', 'depth', 'clarity'];
  const invalidAxes = QUESTIONS.filter(q => !validAxes.includes(q.primaryAxis));
  if (invalidAxes.length === 0) ok('All primaryAxis values are valid (temp/depth/clarity)');
  else ng('primaryAxis values', `Invalid: ${invalidAxes.map(q => `Q${q.id}=${q.primaryAxis}`).join(', ')}`);

  // Verify phase values
  const phase1 = QUESTIONS.filter(q => q.phase === 1);
  const phase2 = QUESTIONS.filter(q => q.phase === 2);
  if (phase1.length >= 3 && phase1.length <= 5) ok(`Phase 1 questions: ${phase1.length} (mandatory)`);
  else ng('Phase 1 count', `Expected 3-5, got ${phase1.length}`);

  if (phase2.length >= 7 && phase2.length <= 9) ok(`Phase 2 questions: ${phase2.length} (adaptive)`);
  else ng('Phase 2 count', `Expected 7-9, got ${phase2.length}`);

  // Verify weight ordering: phase 1 should have higher weight
  const phase1MinWeight = Math.min(...phase1.map(q => q.weight));
  const phase2MaxWeight = Math.max(...phase2.map(q => q.weight));
  if (phase1MinWeight >= phase2MaxWeight) ok('Phase 1 questions have higher or equal weight than Phase 2');
  else wn(`Phase 1 min weight (${phase1MinWeight}) < Phase 2 max weight (${phase2MaxWeight})`);
}

// Verify PHASE1_IDS
if (PHASE1_IDS && Array.isArray(PHASE1_IDS)) {
  ok(`PHASE1_IDS defined: [${PHASE1_IDS.join(', ')}]`);
  // All IDs should exist in QUESTIONS
  const qIds = new Set(QUESTIONS ? QUESTIONS.map(q => q.id) : []);
  const invalidIds = PHASE1_IDS.filter(id => !qIds.has(id));
  if (invalidIds.length === 0) ok('All PHASE1_IDS exist in QUESTIONS');
  else ng('PHASE1_IDS', `IDs not in QUESTIONS: ${invalidIds.join(', ')}`);
} else {
  ng('PHASE1_IDS', 'Not defined');
}

// Verify AXIS_QUESTIONS
if (AXIS_QUESTIONS && typeof AXIS_QUESTIONS === 'object') {
  ok('AXIS_QUESTIONS defined');
  ['temp', 'depth', 'clarity'].forEach(axis => {
    if (Array.isArray(AXIS_QUESTIONS[axis]) && AXIS_QUESTIONS[axis].length > 0) {
      ok(`AXIS_QUESTIONS.${axis}: ${AXIS_QUESTIONS[axis].length} question IDs`);
    } else {
      ng(`AXIS_QUESTIONS.${axis}`, 'Missing or empty');
    }
  });
} else {
  ng('AXIS_QUESTIONS', 'Not defined');
}

// ===== 6. 12-SEASON DATA COMPLETENESS =====
section('6. 12-SEASON DATA COMPLETENESS');

const seasonKeys = [
  'brightspring', 'lightspring', 'warmspring',
  'lightsummer', 'coolsummer', 'softsummer',
  'warmautumn', 'deepautumn', 'softautumn',
  'coolwinter', 'deepwinter', 'brightwinter'
];

const requiredFields = ['key', 'baseseason', 'emoji', 'name', 'enName', 'subtitle', 'description', 'gradient', 'primary', 'light', 'palette', 'avoid', 'makeup', 'clothing', 'hair', 'jewelry', 'celebrities', 'products'];

if (SEASONS) {
  const allKeys = Object.keys(SEASONS);
  if (allKeys.length === 12) ok(`SEASONS count: 12`);
  else ng('SEASONS count', `Expected 12, got ${allKeys.length}`);

  seasonKeys.forEach(sk => {
    const s = SEASONS[sk];
    if (!s) {
      ng(`Season: ${sk}`, 'Not found in SEASONS');
      return;
    }
    if (s.key !== sk) ng(`${sk} key`, `Expected "${sk}", got "${s.key}"`);

    const expectedBase = sk.replace(/^(bright|light|warm|cool|deep|soft)/, '');
    if (s.baseseason !== expectedBase) ng(`${sk} baseseason`, `Expected "${expectedBase}", got "${s.baseseason}"`);

    let missingFields = requiredFields.filter(f => !s[f]);
    if (missingFields.length === 0) {
      ok(`Season ${sk}: All ${requiredFields.length} fields present`);
    } else {
      ng(`Season ${sk}`, `Missing: ${missingFields.join(', ')}`);
    }
    if (s.palette && s.palette.length === 12) ok(`${sk} palette: 12 colors`);
    else ng(`${sk} palette`, `Expected 12, got ${s.palette ? s.palette.length : 0}`);
    if (s.avoid && s.avoid.length === 6) ok(`${sk} avoid: 6 colors`);
    else ng(`${sk} avoid`, `Expected 6, got ${s.avoid ? s.avoid.length : 0}`);
    if (s.products && s.products.length === 4) ok(`${sk} products: 4 items`);
    else ng(`${sk} products`, `Expected 4, got ${s.products ? s.products.length : 0}`);
    if (s.celebrities && s.celebrities.length === 6) ok(`${sk} celebrities: 6 names`);
    else ng(`${sk} celebrities`, `Expected 6, got ${s.celebrities ? s.celebrities.length : 0}`);

    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    if (s.palette) {
      const invalidPalette = s.palette.filter(c => !hexRegex.test(c));
      if (invalidPalette.length === 0) ok(`${sk} palette HEX valid`);
      else ng(`${sk} palette HEX`, `Invalid: ${invalidPalette.join(', ')}`);
    }
    if (s.avoid) {
      const invalidAvoid = s.avoid.filter(c => !hexRegex.test(c));
      if (invalidAvoid.length === 0) ok(`${sk} avoid HEX valid`);
      else ng(`${sk} avoid HEX`, `Invalid: ${invalidAvoid.join(', ')}`);
    }
    if (s.makeup) {
      let mkOk = true;
      ['foundation', 'lip', 'blush', 'eyeshadow'].forEach(mk => {
        if (!s.makeup[mk] || !s.makeup[mk].text || !s.makeup[mk].colors || s.makeup[mk].colors.length !== 3) {
          ng(`${sk} makeup.${mk}`, 'Missing text or colors');
          mkOk = false;
        }
      });
      if (mkOk) ok(`${sk} makeup: 4 categories valid`);
    }
    if (s.products) {
      const badProducts = s.products.filter(p => !p.url || !p.name || !p.brand || !p.price);
      if (badProducts.length === 0) ok(`${sk} products: All have url/name/brand/price`);
      else ng(`${sk} products`, `${badProducts.length} items missing fields`);
    }
  });

  const old4Keys = ['spring', 'summer', 'autumn', 'winter'];
  if (!old4Keys.some(k => SEASONS[k])) ok('No old 4-season keys remain');
  else old4Keys.filter(k => SEASONS[k]).forEach(k => ng(`Old key "${k}"`, 'Should be removed'));
} else {
  ng('SEASONS', 'Not loaded');
}

// ===== 7. SCORING ALGORITHM =====
section('7. SCORING ALGORITHM');

function testAffinity(temp, depth, clarity) {
  const sp = temp + depth + clarity;
  const su = -temp + depth - clarity;
  const au = temp - depth - clarity;
  const wi = -temp - depth + clarity;
  return { sp, su, au, wi, sum: sp + su + au + wi };
}

const testCases = [
  [5, 3, 2], [-3, 4, -1], [0, 0, 0], [-5, -5, 5], [10, -8, 3], [-2, 6, -4]
];
let balanceOk = true;
testCases.forEach(([t, d, c]) => {
  const r = testAffinity(t, d, c);
  if (r.sum !== 0) {
    ng(`Affinity balance [${t},${d},${c}]`, `Sum = ${r.sum}, expected 0`);
    balanceOk = false;
  }
});
if (balanceOk) ok('Affinity formula: sum always = 0 (balanced)');

function determineBaseSeason(temp, depth, clarity) {
  const affinities = {
    spring: temp + depth + clarity,
    summer: -temp + depth - clarity,
    autumn: temp - depth - clarity,
    winter: -temp - depth + clarity
  };
  let best = 'spring', bestScore = -Infinity;
  for (const [s, score] of Object.entries(affinities)) {
    if (score > bestScore) { bestScore = score; best = s; }
  }
  return best;
}

if (determineBaseSeason(5, 3, 2) === 'spring') ok('Reachable: spring (warm+light+clear)');
else ng('Season reachability', 'spring not reachable with (5,3,2)');

if (determineBaseSeason(-5, 3, -2) === 'summer') ok('Reachable: summer (cool+light+soft)');
else ng('Season reachability', 'summer not reachable with (-5,3,-2)');

if (determineBaseSeason(5, -3, -2) === 'autumn') ok('Reachable: autumn (warm+dark+soft)');
else ng('Season reachability', 'autumn not reachable with (5,-3,-2)');

if (determineBaseSeason(-5, -3, 2) === 'winter') ok('Reachable: winter (cool+dark+clear)');
else ng('Season reachability', 'winter not reachable with (-5,-3,2)');

// ===== 8. SUBTYPE DETERMINATION LOGIC =====
section('8. SUBTYPE DETERMINATION LOGIC');

function localGetSubtype(baseSeason, temp, depth, clarity) {
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
  }
}

function fullDetermine(temp, depth, clarity) {
  const base = determineBaseSeason(temp, depth, clarity);
  return localGetSubtype(base, temp, depth, clarity);
}

const allSubtypeTests = [
  { t: 2, d: 1, c: 5, expected: 'brightspring', desc: 'Spring clarity dominant → brightspring' },
  { t: 1, d: 5, c: 2, expected: 'lightspring', desc: 'Spring depth dominant → lightspring' },
  { t: 5, d: 1, c: 2, expected: 'warmspring', desc: 'Spring temp dominant → warmspring' },
  { t: -2, d: 5, c: -1, expected: 'lightsummer', desc: 'Summer depth dominant → lightsummer' },
  { t: -5, d: 1, c: -2, expected: 'coolsummer', desc: 'Summer temp dominant → coolsummer' },
  { t: -1, d: 2, c: -5, expected: 'softsummer', desc: 'Summer clarity dominant → softsummer' },
  { t: 5, d: -1, c: -2, expected: 'warmautumn', desc: 'Autumn temp dominant → warmautumn' },
  { t: 1, d: -5, c: -2, expected: 'deepautumn', desc: 'Autumn depth dominant → deepautumn' },
  { t: 2, d: -1, c: -5, expected: 'softautumn', desc: 'Autumn clarity dominant → softautumn' },
  { t: -5, d: -1, c: 2, expected: 'coolwinter', desc: 'Winter temp dominant → coolwinter' },
  { t: -1, d: -5, c: 2, expected: 'deepwinter', desc: 'Winter depth dominant → deepwinter' },
  { t: -1, d: -2, c: 5, expected: 'brightwinter', desc: 'Winter clarity dominant → brightwinter' },
];

allSubtypeTests.forEach(({ t, d, c, expected, desc }) => {
  const result = fullDetermine(t, d, c);
  if (result === expected) ok(desc);
  else ng(desc, `Expected ${expected}, got ${result}`);
});

const reachableSubtypes = new Set(allSubtypeTests.map(({ t, d, c }) => fullDetermine(t, d, c)));
if (reachableSubtypes.size === 12) ok('All 12 subtypes reachable via unit tests');
else ng('Subtype reachability', `Missing: ${seasonKeys.filter(k => !reachableSubtypes.has(k)).join(', ')}`);

// ===== 9. AI COLOR ANALYSIS =====
section('9. AI COLOR ANALYSIS');

function rgbToHsl(c) {
  const r = c.r / 255, g = c.g / 255, b = c.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s, l };
}

function analyzeColorsToScores(colors) {
  const skinHSL = rgbToHsl(colors.skin);
  const hairHSL = rgbToHsl(colors.hair);
  const eyeHSL = rgbToHsl(colors.eye);
  let temp = 0, depth = 0, clarity = 0;

  const skinHue = skinHSL.h;
  if (skinHue >= 18 && skinHue <= 55) temp += 3;
  else if (skinHue >= 10 && skinHue < 18) temp += 1;
  else if (skinHue >= 300 || skinHue < 10) temp -= 2;

  const rbRatio = colors.skin.r / Math.max(colors.skin.b, 1);
  if (rbRatio > 1.5) temp += 2;
  else if (rbRatio > 1.25) temp += 1;
  else if (rbRatio < 1.05) temp -= 2;
  else if (rbRatio < 1.15) temp -= 1;

  const gbRatio = colors.skin.g / Math.max(colors.skin.b, 1);
  if (gbRatio > 1.15) temp += 1;
  else if (gbRatio < 0.95) temp -= 1;

  const hairHue = hairHSL.h;
  if (hairHue >= 15 && hairHue <= 45) temp += 1;
  else if (hairHue >= 200 || hairHue < 10) temp -= 1;

  const overallL = skinHSL.l * 0.45 + hairHSL.l * 0.35 + eyeHSL.l * 0.20;
  if (overallL > 0.55) depth += 5;
  else if (overallL > 0.48) depth += 3;
  else if (overallL > 0.42) depth += 1;
  else if (overallL > 0.35) depth -= 1;
  else if (overallL > 0.28) depth -= 3;
  else depth -= 5;

  const contrast = Math.abs(skinHSL.l - hairHSL.l);
  if (contrast > 0.55) clarity += 2;
  else if (contrast > 0.4) clarity += 1;
  else if (contrast < 0.15) clarity -= 1;

  if (skinHSL.s > 0.45) clarity += 1;
  else if (skinHSL.s < 0.18) clarity -= 1;

  const eyeContrast = Math.abs(eyeHSL.l - skinHSL.l);
  if (eyeContrast > 0.4) clarity += 1;
  else if (eyeContrast < 0.08) clarity -= 1;

  if (hairHSL.l < 0.15 && eyeHSL.l < 0.25 && contrast > 0.4) {
    clarity -= 1;
  }

  const avgSat = (skinHSL.s + hairHSL.s + eyeHSL.s) / 3;
  if (avgSat < 0.13) clarity -= 2;
  else if (avgSat < 0.20) clarity -= 1;

  temp = Math.max(-12, Math.min(12, temp));
  depth = Math.max(-12, Math.min(12, depth));
  clarity = Math.max(-12, Math.min(12, clarity));

  return { temp, depth, clarity };
}

const aiTests = [
  ['Spring: warm golden skin, warm brown hair, amber eyes',
    { skin: { r: 230, g: 190, b: 140 }, hair: { r: 140, g: 100, b: 60 }, eye: { r: 160, g: 120, b: 70 } },
    'spring'],
  ['Summer: cool pink skin, cool ash hair, soft grey-brown eyes',
    { skin: { r: 220, g: 200, b: 200 }, hair: { r: 100, g: 90, b: 95 }, eye: { r: 120, g: 110, b: 115 } },
    'summer'],
  ['Autumn: warm olive skin, dark warm hair, deep brown eyes',
    { skin: { r: 180, g: 145, b: 110 }, hair: { r: 50, g: 35, b: 25 }, eye: { r: 70, g: 50, b: 35 } },
    'autumn'],
  ['Winter: cool very fair skin, jet black hair, dark cool eyes',
    { skin: { r: 240, g: 220, b: 225 }, hair: { r: 15, g: 12, b: 18 }, eye: { r: 30, g: 25, b: 35 } },
    'winter'],
  ['Vietnamese Spring: warm golden skin, dark warm hair, light brown eyes',
    { skin: { r: 220, g: 180, b: 130 }, hair: { r: 60, g: 45, b: 30 }, eye: { r: 140, g: 110, b: 75 } },
    'spring'],
  ['Vietnamese Summer: fair cool skin, dark ash hair, soft dark eyes',
    { skin: { r: 225, g: 210, b: 205 }, hair: { r: 35, g: 30, b: 35 }, eye: { r: 55, g: 50, b: 55 } },
    'summer'],
  ['Vietnamese Autumn: warm medium skin, very dark warm hair, deep eyes',
    { skin: { r: 195, g: 155, b: 115 }, hair: { r: 30, g: 22, b: 15 }, eye: { r: 55, g: 40, b: 28 } },
    'autumn'],
  ['Vietnamese Winter: cool fair skin, black hair, very dark cool eyes',
    { skin: { r: 235, g: 215, b: 220 }, hair: { r: 10, g: 8, b: 15 }, eye: { r: 25, g: 20, b: 30 } },
    'winter']
];

aiTests.forEach(([desc, colors, expectedBase]) => {
  const scores = analyzeColorsToScores(colors);
  const base = determineBaseSeason(scores.temp, scores.depth, scores.clarity);
  const subtype = localGetSubtype(base, scores.temp, scores.depth, scores.clarity);
  if (base === expectedBase) {
    ok(`AI: ${desc} → ${subtype} [base=${base}] (t=${scores.temp} d=${scores.depth} c=${scores.clarity})`);
  } else {
    ng(`AI: ${desc}`, `Expected base ${expectedBase}, got ${base}/${subtype} (t=${scores.temp} d=${scores.depth} c=${scores.clarity})`);
  }
});

// ===== 10. INPUT-BASED PAGING ENGINE =====
section('10. INPUT-BASED PAGING ENGINE');

// Simulate the input-based paging algorithm
const QUESTION_MAP = new Map();
if (QUESTIONS) QUESTIONS.forEach(q => QUESTION_MAP.set(q.id, q));

const MIN_QUESTIONS = 7;
const MAX_QUESTIONS = 12;
const CONFIDENCE_THRESHOLD = 3;

function getAxisConfidence(axis, scores, questionPath) {
  const absScore = Math.abs(scores[axis]);
  const answeredCount = questionPath.filter(qId => {
    const q = QUESTION_MAP.get(qId);
    return q !== undefined && q.primaryAxis === axis;
  }).length;
  return absScore + (answeredCount * 0.5);
}

function allAxesConfident(scores, questionPath) {
  return ['temp', 'depth', 'clarity'].every(
    axis => getAxisConfidence(axis, scores, questionPath) >= CONFIDENCE_THRESHOLD
  );
}

function pickNextQuestion(asked, scores, questionPath) {
  const askedSet = new Set(asked);
  const totalAsked = askedSet.size;

  for (const id of PHASE1_IDS) {
    if (!askedSet.has(id)) {
      return QUESTION_MAP.get(id) || null;
    }
  }

  if (totalAsked >= MAX_QUESTIONS) return null;
  if (totalAsked >= MIN_QUESTIONS && allAxesConfident(scores, questionPath)) return null;

  const axes = ['temp', 'depth', 'clarity'];
  let leastConfidentAxis = axes[0];
  let lowestConf = getAxisConfidence(axes[0], scores, questionPath);
  for (let i = 1; i < axes.length; i++) {
    const conf = getAxisConfidence(axes[i], scores, questionPath);
    if (conf < lowestConf) {
      lowestConf = conf;
      leastConfidentAxis = axes[i];
    }
  }

  const axisIds = AXIS_QUESTIONS[leastConfidentAxis] || [];
  const candidates = axisIds
    .filter(id => !askedSet.has(id))
    .map(id => QUESTION_MAP.get(id))
    .filter(q => q !== undefined)
    .sort((a, b) => b.weight - a.weight);

  if (candidates.length > 0) return candidates[0];

  const remaining = QUESTIONS
    .filter(q => !askedSet.has(q.id))
    .sort((a, b) => b.weight - a.weight);

  return remaining.length > 0 ? remaining[0] : null;
}

// Test 1: First question should be from PHASE1_IDS
if (PHASE1_IDS && PHASE1_IDS.length > 0) {
  const firstQ = pickNextQuestion([], { temp: 0, depth: 0, clarity: 0 }, []);
  if (firstQ && firstQ.id === PHASE1_IDS[0]) {
    ok(`First question is PHASE1_IDS[0] = Q${PHASE1_IDS[0]}`);
  } else {
    ng('First question', `Expected Q${PHASE1_IDS[0]}, got Q${firstQ ? firstQ.id : 'null'}`);
  }
}

// Test 2: Phase 1 questions asked in order
if (PHASE1_IDS) {
  let asked = [];
  let questionPath = [];
  let scores = { temp: 0, depth: 0, clarity: 0 };
  let phase1Order = true;

  for (let i = 0; i < PHASE1_IDS.length; i++) {
    const q = pickNextQuestion(asked, scores, questionPath);
    if (!q || q.id !== PHASE1_IDS[i]) {
      phase1Order = false;
      ng(`Phase 1 order`, `Expected Q${PHASE1_IDS[i]} at position ${i}, got Q${q ? q.id : 'null'}`);
      break;
    }
    asked.push(q.id);
    questionPath.push(q.id);
    // Simulate answering with option 0
    const opt = q.options[0];
    scores.temp += opt.temp;
    scores.depth += opt.depth;
    scores.clarity += opt.clarity;
  }
  if (phase1Order) ok(`Phase 1 questions asked in order: [${PHASE1_IDS.join(', ')}]`);
}

// Test 3: Maximum questions cap
{
  let asked = [];
  let questionPath = [];
  let scores = { temp: 0, depth: 0, clarity: 0 };

  for (let i = 0; i < MAX_QUESTIONS + 5; i++) {
    const q = pickNextQuestion(asked, scores, questionPath);
    if (!q) break;
    asked.push(q.id);
    questionPath.push(q.id);
    scores.temp += q.options[0].temp;
    scores.depth += q.options[0].depth;
    scores.clarity += q.options[0].clarity;
  }

  if (asked.length <= MAX_QUESTIONS) {
    ok(`Max questions cap: stopped at ${asked.length} (max=${MAX_QUESTIONS})`);
  } else {
    ng('Max questions cap', `Asked ${asked.length}, expected <= ${MAX_QUESTIONS}`);
  }
}

// Test 4: Early termination when confident
{
  let asked = [];
  let questionPath = [];
  let scores = { temp: 0, depth: 0, clarity: 0 };

  // Force high scores on all axes by picking extreme options
  for (let i = 0; i < MAX_QUESTIONS; i++) {
    const q = pickNextQuestion(asked, scores, questionPath);
    if (!q) break;
    asked.push(q.id);
    questionPath.push(q.id);

    // Pick option that maximizes scores
    let bestOpt = q.options[0];
    let bestTotal = Math.abs(q.options[0].temp) + Math.abs(q.options[0].depth) + Math.abs(q.options[0].clarity);
    for (let j = 1; j < q.options.length; j++) {
      const total = Math.abs(q.options[j].temp) + Math.abs(q.options[j].depth) + Math.abs(q.options[j].clarity);
      if (total > bestTotal) {
        bestTotal = total;
        bestOpt = q.options[j];
      }
    }
    scores.temp += bestOpt.temp;
    scores.depth += bestOpt.depth;
    scores.clarity += bestOpt.clarity;
  }

  if (asked.length >= MIN_QUESTIONS && asked.length <= MAX_QUESTIONS) {
    ok(`Early termination: completed in ${asked.length} questions (min=${MIN_QUESTIONS}, max=${MAX_QUESTIONS})`);
  } else {
    wn(`Early termination: completed in ${asked.length} questions`);
  }
}

// Test 5: No duplicate questions
{
  let asked = [];
  let questionPath = [];
  let scores = { temp: 0, depth: 0, clarity: 0 };
  let hasDuplicates = false;

  for (let i = 0; i < MAX_QUESTIONS; i++) {
    const q = pickNextQuestion(asked, scores, questionPath);
    if (!q) break;
    if (asked.includes(q.id)) {
      ng('No duplicates', `Q${q.id} asked twice at position ${i}`);
      hasDuplicates = true;
      break;
    }
    asked.push(q.id);
    questionPath.push(q.id);
    scores.temp += q.options[0].temp;
    scores.depth += q.options[0].depth;
    scores.clarity += q.options[0].clarity;
  }
  if (!hasDuplicates) ok('No duplicate questions in adaptive path');
}

// Test 6: Confidence calculation
{
  const testScores = { temp: 3, depth: -2, clarity: 1 };
  const testPath = [1, 5]; // Q1=depth, Q5=temp
  const tempConf = getAxisConfidence('temp', testScores, testPath);
  const depthConf = getAxisConfidence('depth', testScores, testPath);
  const clarityConf = getAxisConfidence('clarity', testScores, testPath);

  // temp: |3| + 1*0.5 = 3.5 (Q5 is temp)
  // depth: |-2| + 1*0.5 = 2.5 (Q1 is depth)
  // clarity: |1| + 0*0.5 = 1.0

  if (tempConf === 3.5) ok(`Confidence temp: ${tempConf} (expected 3.5)`);
  else ng('Confidence temp', `Expected 3.5, got ${tempConf}`);

  if (depthConf === 2.5) ok(`Confidence depth: ${depthConf} (expected 2.5)`);
  else ng('Confidence depth', `Expected 2.5, got ${depthConf}`);

  if (clarityConf === 1.0) ok(`Confidence clarity: ${clarityConf} (expected 1.0)`);
  else ng('Confidence clarity', `Expected 1.0, got ${clarityConf}`);
}

// ===== 11. DOM ID CONSISTENCY =====
section('11. DOM ID CONSISTENCY');

const getElByIdRegex = /getElementById\(['"]([\w-]+)['"]\)/g;
const jsIds = new Set();
let m;
while ((m = getElByIdRegex.exec(allJsSrc)) !== null) {
  jsIds.add(m[1]);
}

let domMismatches = 0;
jsIds.forEach(id => {
  if (htmlSrc.includes(`id="${id}"`) || htmlSrc.includes(`id='${id}'`)) {
    // ok
  } else {
    ng(`DOM ID: ${id}`, 'Referenced in JS but missing in HTML');
    domMismatches++;
  }
});
if (domMismatches === 0) ok(`All ${jsIds.size} JS-referenced DOM IDs exist in HTML`);

// ===== 12. CSS CLASS CONSISTENCY =====
section('12. CSS CLASS CONSISTENCY');

const criticalClasses = [
  'screen', 'active', 'container', 'intro-container', 'ai-container', 'quiz-container',
  'loading-container', 'result-container', 'option-btn', 'selected', 'progress-fill',
  'progress-text', 'cta-btn', 'back-btn', 'card', 'swatch', 'swatch-avoid',
  'track-btn', 'track-ai', 'track-quiz', 'camera-wrap', 'face-guide', 'face-oval',
  'scan-overlay', 'scan-line', 'ai-capture-btn', 'detected-colors', 'detected-dot',
  'share-btn', 'copy-btn', 'facebook-btn', 'retake-btn',
  'result-baseseason-badge', 'result-en-name',
  'baseseason-spring', 'baseseason-summer', 'baseseason-autumn', 'baseseason-winter',
  'card-animate', 'card-hidden', 'card-visible', 'share-download-btn', 'zalo-btn',
  'social-proof', 'compare-card', 'compare-score', 'compare-comment'
];

let cssMismatches = 0;
criticalClasses.forEach(cls => {
  const inCSS = cssSrc.includes(`.${cls}`) || cssSrc.includes(`.${cls} `) || cssSrc.includes(`.${cls}{`) || cssSrc.includes(`.${cls}:`);
  const inHTML = htmlSrc.includes(cls) || allJsSrc.includes(cls);
  if (inCSS && inHTML) {
    // ok
  } else if (!inCSS) {
    ng(`CSS class: .${cls}`, 'Used in HTML/JS but missing in CSS');
    cssMismatches++;
  }
});
if (cssMismatches === 0) ok(`All ${criticalClasses.length} critical CSS classes defined`);

// ===== 13. RESPONSIVE & ACCESSIBILITY =====
section('13. RESPONSIVE & ACCESSIBILITY');

if (cssSrc.includes('@media (max-width: 480px)') || cssSrc.includes('@media(max-width: 480px)') || cssSrc.includes('@media(max-width:480px)')) {
  ok('Mobile breakpoint: 480px');
} else {
  ng('Mobile breakpoint', 'Missing 480px media query');
}

if (cssSrc.includes('@media (min-width: 768px)') || cssSrc.includes('@media(min-width: 768px)') || cssSrc.includes('@media(min-width:768px)')) {
  ok('Tablet breakpoint: 768px');
} else {
  ng('Tablet breakpoint', 'Missing 768px media query');
}

if (htmlSrc.includes('viewport')) ok('Viewport meta tag present');
else ng('Viewport', 'Missing viewport meta');

const onclickCount = (htmlSrc.match(/onclick="/g) || []).length;
const buttonCount = (htmlSrc.match(/<button/g) || []).length;
ok(`Interactive elements: ${buttonCount} buttons, ${onclickCount} onclick handlers`);

// ===== 14. SECURITY =====
section('14. SECURITY');

const evalMatches = allJsSrc.match(/\beval\s*\(/g);
if (!evalMatches) ok('No eval() in JS modules');
else ng('eval()', `Found ${evalMatches.length} eval() calls`);

const externalLinks = htmlSrc.match(/<a[^>]+target="_blank"[^>]*>/g) || [];
let noopenerIssues = 0;
externalLinks.forEach(link => {
  if (!link.includes('noopener')) {
    ng('noopener', `Missing rel="noopener" on: ${link.substring(0, 80)}`);
    noopenerIssues++;
  }
});
if (noopenerIssues === 0 && externalLinks.length > 0) {
  ok(`All ${externalLinks.length} external links have rel="noopener"`);
}

// ===== 15. URL HASH SHARING =====
section('15. URL HASH SHARING');

const shareSrc = jsSources['js/share.js'] || '';
if (shareSrc.includes('result=${') && shareSrc.includes('temp=${') && shareSrc.includes('depth=${') && shareSrc.includes('clarity=${')) {
  ok('URL hash format: #result=KEY&temp=N&depth=N&clarity=N');
} else {
  ng('URL hash format', 'Expected hash format not found in share.js');
}

const appSrc = jsSources['js/app.js'] || '';
if (appSrc.includes('determineSeason()') && appSrc.includes("hash.includes('result=')")) {
  ok('URL restoration with determineSeason() fallback');
} else {
  ng('URL restoration', 'Missing determineSeason() fallback in app.js');
}

// ===== 16. MODULE EXPORTS & IMPORTS =====
section('16. MODULE EXPORTS & IMPORTS');

// Check critical exports
const exportChecks = [
  ['js/state.js', 'state'],
  ['js/state.js', 'resetQuizState'],
  ['js/scoring.js', 'getBaseSeason'],
  ['js/scoring.js', 'getSubtype'],
  ['js/scoring.js', 'determineSeason'],
  ['js/quiz.js', 'startQuiz'],
  ['js/quiz.js', 'renderQuestion'],
  ['js/quiz.js', 'goBack'],
  ['js/result.js', 'renderResult'],
  ['js/ai-analysis.js', 'startAI'],
  ['js/ai-analysis.js', 'capturePhoto'],
  ['js/share.js', 'shareFacebook'],
  ['js/share.js', 'shareZalo'],
  ['js/share.js', 'copyLink'],
  ['js/share.js', 'updateUrlHash'],
  ['js/app.js', 'showScreen'],
  ['js/app.js', 'showLoading'],
  ['js/analytics.js', 'trackEvent'],
  ['js/result-card.js', 'downloadResultCard'],
  ['js/comparison.js', 'compareWithFriend'],
];

let exportIssues = 0;
exportChecks.forEach(([file, name]) => {
  const src = jsSources[file] || '';
  if (src.includes(`export function ${name}`) || src.includes(`export async function ${name}`) || src.includes(`export const ${name}`)) {
    // ok
  } else {
    ng(`Export: ${file} → ${name}`, 'Not found');
    exportIssues++;
  }
});
if (exportIssues === 0) ok(`All ${exportChecks.length} critical exports present`);

// ===== 17. PHASE 2 FEATURES =====
section('17. PHASE 2 FEATURES');

// Zalo sharing
if (shareSrc.includes('shareZalo') && htmlSrc.includes('shareZalo')) {
  ok('Zalo sharing: function + HTML button');
} else {
  ng('Zalo sharing', 'Missing function or button');
}

// Result card download
const resultCardSrc = jsSources['js/result-card.js'] || '';
if (resultCardSrc.includes('generateResultCard') && resultCardSrc.includes('downloadResultCard')) {
  ok('Result card: generate + download functions');
} else {
  ng('Result card', 'Missing generate/download functions');
}

// Canvas-based card generation
if (resultCardSrc.includes('canvas') && resultCardSrc.includes('toBlob')) {
  ok('Result card uses Canvas API with toBlob');
} else {
  ng('Result card canvas', 'Missing Canvas API usage');
}

// GA4 analytics
const analyticsSrc = jsSources['js/analytics.js'] || '';
if (analyticsSrc.includes('trackEvent') && analyticsSrc.includes('gtag')) {
  ok('GA4 analytics: trackEvent with gtag');
} else {
  ng('GA4 analytics', 'Missing trackEvent or gtag');
}

// Social proof
if (htmlSrc.includes('social-proof') && appSrc.includes('initSocialProof')) {
  ok('Social proof: HTML element + init function');
} else {
  ng('Social proof', 'Missing HTML element or init function');
}

// Scroll animations
const resultSrc = jsSources['js/result.js'] || '';
if (resultSrc.includes('IntersectionObserver') && resultSrc.includes('card-animate')) {
  ok('Scroll animations: IntersectionObserver + card-animate');
} else {
  ng('Scroll animations', 'Missing IntersectionObserver');
}

// ===== 18. PHASE 3 FEATURES =====
section('18. PHASE 3 FEATURES');

const compSrc = jsSources['js/comparison.js'] || '';

// Comparison module
if (compSrc.includes('compareWithFriend') && compSrc.includes('renderComparison')) {
  ok('Comparison: compareWithFriend + renderComparison');
} else {
  ng('Comparison', 'Missing comparison functions');
}

// Compatibility matrix
if (compSrc.includes('buildCompatMatrix') || compSrc.includes('COMPAT_SCORES')) {
  ok('Comparison: compatibility score matrix');
} else {
  ng('Comparison', 'Missing compatibility matrix');
}

// Comparison HTML
if (htmlSrc.includes('compare-card') && htmlSrc.includes('compare-picker')) {
  ok('Comparison: HTML elements present');
} else {
  ng('Comparison', 'Missing comparison HTML');
}

// ===== 19. CAMERA API =====
section('19. CAMERA API');

const aiSrc = jsSources['js/ai-analysis.js'] || '';

if (aiSrc.includes('getUserMedia')) ok('getUserMedia API used');
else ng('Camera API', 'getUserMedia not found');

if (aiSrc.includes('facingMode')) ok('Camera facingMode switching supported');
else ng('Camera', 'facingMode not found');

if (aiSrc.includes('enumerateDevices')) ok('Device enumeration for multi-camera support');
else ng('Camera', 'enumerateDevices not found');

if (aiSrc.includes('scale(-1, 1)')) ok('Front camera mirror mode');
else ng('Camera', 'Mirror mode not found');

if (htmlSrc.includes('accept="image/*"')) ok('File upload accepts all image types');
else ng('Upload', 'accept="image/*" not found');

// ===== 20. SUPPORTING FILES =====
section('20. SUPPORTING FILES');

const supportFiles = ['robots.txt', 'sitemap.xml', 'privacy.html', 'contact.html', 'CLAUDE.md'];
supportFiles.forEach(f => {
  const fPath = path.join(DIR, f);
  if (fs.existsSync(fPath)) {
    const content = fs.readFileSync(fPath, 'utf8');
    if (content.length > 50) ok(`${f} exists (${content.length} chars)`);
    else wn(`${f} exists but very small (${content.length} chars)`);
  } else {
    ng(`${f}`, 'File not found');
  }
});

const deployPath = path.join(DIR, '.github', 'workflows', 'deploy.yml');
if (fs.existsSync(deployPath)) {
  const deployContent = fs.readFileSync(deployPath, 'utf8');
  if (deployContent.includes('personal-color-test')) ok('deploy.yml targets personal-color-test project');
  else ng('deploy.yml', 'Project name mismatch');
  if (deployContent.includes('CLOUDFLARE_API_TOKEN')) ok('deploy.yml uses CLOUDFLARE_API_TOKEN secret');
  else ng('deploy.yml', 'Missing CLOUDFLARE_API_TOKEN');
} else {
  ng('deploy.yml', 'File not found');
}

// ===== 21. GOBACK SCORE ROLLBACK =====
section('21. GOBACK SCORE ROLLBACK');

if (QUESTIONS) {
  let scores = { temp: 0, depth: 0, clarity: 0 };
  let history = [];
  for (let i = 0; i < 3; i++) {
    const opt = QUESTIONS[i].options[0];
    history.push({ temp: opt.temp, depth: opt.depth, clarity: opt.clarity });
    scores.temp += opt.temp;
    scores.depth += opt.depth;
    scores.clarity += opt.clarity;
  }
  const last = history.pop();
  scores.temp -= last.temp;
  scores.depth -= last.depth;
  scores.clarity -= last.clarity;
  let expected2 = { temp: 0, depth: 0, clarity: 0 };
  for (let i = 0; i < 2; i++) {
    const opt = QUESTIONS[i].options[0];
    expected2.temp += opt.temp;
    expected2.depth += opt.depth;
    expected2.clarity += opt.clarity;
  }
  if (scores.temp === expected2.temp && scores.depth === expected2.depth && scores.clarity === expected2.clarity) {
    ok('GoBack: Score rollback is accurate');
  } else {
    ng('GoBack rollback', `Expected t=${expected2.temp} d=${expected2.depth} c=${expected2.clarity}, got t=${scores.temp} d=${scores.depth} c=${scores.clarity}`);
  }
}

// ===== 22. QUIZ PATH SIMULATION (INPUT-BASED PAGING) =====
section('22. QUIZ PATH SIMULATION (INPUT-BASED PAGING)');

if (QUESTIONS && PHASE1_IDS) {
  // Simulate full quiz with option 0 (tends warm/light)
  function simulateAdaptiveQuiz(optionSelector) {
    let asked = [];
    let questionPath = [];
    let scores = { temp: 0, depth: 0, clarity: 0 };
    let questionOrder = [];

    for (let i = 0; i < MAX_QUESTIONS; i++) {
      const q = pickNextQuestion(asked, scores, questionPath);
      if (!q) break;
      asked.push(q.id);
      questionPath.push(q.id);
      questionOrder.push(q.id);

      const optIdx = optionSelector(q, scores);
      const opt = q.options[optIdx];
      scores.temp += opt.temp;
      scores.depth += opt.depth;
      scores.clarity += opt.clarity;
    }

    const base = determineBaseSeason(scores.temp, scores.depth, scores.clarity);
    const subtype = localGetSubtype(base, scores.temp, scores.depth, scores.clarity);
    return { scores, base, subtype, questionCount: asked.length, questionOrder };
  }

  // All option 0 path
  const path0 = simulateAdaptiveQuiz(() => 0);
  ok(`Adaptive path (opt0): ${path0.subtype} in ${path0.questionCount} questions (t=${path0.scores.temp} d=${path0.scores.depth} c=${path0.scores.clarity})`);

  // All option 3 path
  const path3 = simulateAdaptiveQuiz(() => 3);
  ok(`Adaptive path (opt3): ${path3.subtype} in ${path3.questionCount} questions (t=${path3.scores.temp} d=${path3.scores.depth} c=${path3.scores.clarity})`);

  // Mixed path (alternate 0, 1, 2, 3)
  const pathMixed = simulateAdaptiveQuiz((q, s) => Math.abs(s.temp + s.depth + s.clarity) % 4);
  ok(`Adaptive path (mixed): ${pathMixed.subtype} in ${pathMixed.questionCount} questions`);

  // Verify quiz results are valid seasons
  [path0, path3, pathMixed].forEach(p => {
    if (SEASONS && SEASONS[p.subtype]) {
      ok(`Quiz result "${p.subtype}" exists in SEASONS`);
    } else {
      ng(`Quiz result "${p.subtype}"`, 'Not found in SEASONS');
    }
  });

  // Verify minimum question count
  [path0, path3, pathMixed].forEach(p => {
    if (p.questionCount >= MIN_QUESTIONS) {
      ok(`Quiz completed with ${p.questionCount} >= ${MIN_QUESTIONS} minimum`);
    } else {
      ng('Min questions', `Completed with ${p.questionCount} < ${MIN_QUESTIONS}`);
    }
  });
}

// ===== SUMMARY =====
console.log('\n' + '='.repeat(60));
console.log(`RESULTS: ${pass} passed, ${fail} failed, ${warn} warnings`);
console.log('='.repeat(60));

if (failures.length > 0) {
  console.log('\nFAILURES:');
  failures.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.desc}: ${f.detail}`);
  });
}

process.exit(fail > 0 ? 1 : 0);
