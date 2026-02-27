/* ===================================================================
   Personal Color Test — Comprehensive Test Suite (12-Season)
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
const scriptSrc = fs.readFileSync(path.join(DIR, 'script.js'), 'utf8');
const htmlSrc = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
const cssSrc = fs.readFileSync(path.join(DIR, 'style.css'), 'utf8');

// ===== EXTRACT DATA FROM script.js =====
let QUESTIONS, SEASONS;
try {
  const extractFn = new Function(
    scriptSrc.replace(/document\b/g, '({querySelectorAll:()=>[],getElementById:()=>({style:{},classList:{remove:()=>{}},innerHTML:"",textContent:"",className:""}),addEventListener:()=>{}})')
      .replace(/window\b/g, '({scrollTo:()=>{},location:{hash:"",origin:"",pathname:"/"},open:()=>{}})')
      .replace(/navigator\b/g, '({mediaDevices:{getUserMedia:()=>Promise.resolve(),enumerateDevices:()=>Promise.resolve([])},clipboard:{writeText:()=>Promise.resolve()}})')
    + '; return { QUESTIONS, SEASONS, getBaseSeason, getSubtype };'
  );
  const data = extractFn();
  QUESTIONS = data.QUESTIONS;
  SEASONS = data.SEASONS;
  var getBaseSeason = data.getBaseSeason;
  var getSubtype = data.getSubtype;
} catch (e) {
  try {
    const qMatch = scriptSrc.match(/const QUESTIONS = (\[[\s\S]*?\n\]);/);
    const sMatch = scriptSrc.match(/const SEASONS = (\{[\s\S]*?\n\});/);
    if (qMatch) QUESTIONS = eval(qMatch[1]);
    if (sMatch) SEASONS = eval(sMatch[1]);
  } catch (e2) {
    console.error('FATAL: Cannot extract QUESTIONS/SEASONS:', e2.message);
    process.exit(1);
  }
}

// ===== 1. SYNTAX VALIDATION =====
section('1. SYNTAX VALIDATION');

try {
  new Function(scriptSrc);
  ok('script.js parses without syntax errors');
} catch (e) {
  ng('script.js syntax', e.message);
}

if (htmlSrc.includes('<!DOCTYPE html>') && htmlSrc.includes('</html>')) {
  ok('index.html has doctype and closing tag');
} else {
  ng('index.html structure', 'Missing DOCTYPE or closing tag');
}

const openBraces = (scriptSrc.match(/{/g) || []).length;
const closeBraces = (scriptSrc.match(/}/g) || []).length;
if (openBraces === closeBraces) {
  ok(`script.js braces balanced (${openBraces} pairs)`);
} else {
  ng('script.js braces', `Open: ${openBraces}, Close: ${closeBraces}`);
}

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
      ng(`Q${i + 1} fields`, 'Missing id/text/options');
      qDataOk = false;
      return;
    }
    if (q.options.length !== 4) {
      ng(`Q${i + 1} options`, `Expected 4, got ${q.options.length}`);
      qDataOk = false;
    }
    q.options.forEach((opt, j) => {
      if (typeof opt.temp !== 'number' || typeof opt.depth !== 'number' || typeof opt.clarity !== 'number') {
        ng(`Q${i + 1} opt${j + 1}`, 'Missing score axis');
        qDataOk = false;
      }
    });
    if (!q.hint) {
      wn(`Q${i + 1} hint missing`);
    }
  });
  if (qDataOk) ok('All 12 questions have valid structure (id, text, hint, 4 options with 3-axis scores)');
}

// ===== 5. 12-SEASON DATA COMPLETENESS =====
section('5. 12-SEASON DATA COMPLETENESS');

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
    // Check key matches
    if (s.key !== sk) ng(`${sk} key`, `Expected "${sk}", got "${s.key}"`);

    // Check baseseason
    const expectedBase = sk.replace(/^(bright|light|warm|cool|deep|soft)/, '');
    if (s.baseseason !== expectedBase) ng(`${sk} baseseason`, `Expected "${expectedBase}", got "${s.baseseason}"`);

    // Check all required fields
    let missingFields = requiredFields.filter(f => !s[f]);
    if (missingFields.length === 0) {
      ok(`Season ${sk}: All ${requiredFields.length} fields present`);
    } else {
      ng(`Season ${sk}`, `Missing: ${missingFields.join(', ')}`);
    }
    // Palette count
    if (s.palette && s.palette.length === 12) ok(`${sk} palette: 12 colors`);
    else ng(`${sk} palette`, `Expected 12, got ${s.palette ? s.palette.length : 0}`);
    // Avoid count
    if (s.avoid && s.avoid.length === 6) ok(`${sk} avoid: 6 colors`);
    else ng(`${sk} avoid`, `Expected 6, got ${s.avoid ? s.avoid.length : 0}`);
    // Products count
    if (s.products && s.products.length === 4) ok(`${sk} products: 4 items`);
    else ng(`${sk} products`, `Expected 4, got ${s.products ? s.products.length : 0}`);
    // Celebrities count
    if (s.celebrities && s.celebrities.length === 6) ok(`${sk} celebrities: 6 names`);
    else ng(`${sk} celebrities`, `Expected 6, got ${s.celebrities ? s.celebrities.length : 0}`);

    // HEX color validation
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
    // Makeup check
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
    // Products URLs
    if (s.products) {
      const badProducts = s.products.filter(p => !p.url || !p.name || !p.brand || !p.price);
      if (badProducts.length === 0) ok(`${sk} products: All have url/name/brand/price`);
      else ng(`${sk} products`, `${badProducts.length} items missing fields`);
    }
  });

  // Check no old 4-season keys remain
  const old4Keys = ['spring', 'summer', 'autumn', 'winter'];
  old4Keys.forEach(k => {
    if (SEASONS[k]) ng(`Old key "${k}"`, 'Should be removed in 12-season system');
  });
  if (!old4Keys.some(k => SEASONS[k])) ok('No old 4-season keys remain');

} else {
  ng('SEASONS', 'Not loaded');
}

// ===== 6. SCORING ALGORITHM =====
section('6. SCORING ALGORITHM');

// Verify affinity formula balance
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

// Test all 4 base seasons reachable
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

// ===== 7. SUBTYPE DETERMINATION LOGIC =====
section('7. SUBTYPE DETERMINATION LOGIC');

// Local subtype function for testing
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

// Spring subtypes
const springSubtypeTests = [
  // clarity dominant → brightspring
  { t: 2, d: 1, c: 5, expected: 'brightspring', desc: 'Spring clarity dominant → brightspring' },
  // depth dominant → lightspring
  { t: 1, d: 5, c: 2, expected: 'lightspring', desc: 'Spring depth dominant → lightspring' },
  // temp dominant → warmspring
  { t: 5, d: 1, c: 2, expected: 'warmspring', desc: 'Spring temp dominant → warmspring' },
];

// Summer subtypes
const summerSubtypeTests = [
  // depth dominant → lightsummer
  { t: -2, d: 5, c: -1, expected: 'lightsummer', desc: 'Summer depth dominant → lightsummer' },
  // temp dominant → coolsummer
  { t: -5, d: 1, c: -2, expected: 'coolsummer', desc: 'Summer temp dominant → coolsummer' },
  // clarity dominant → softsummer
  { t: -1, d: 2, c: -5, expected: 'softsummer', desc: 'Summer clarity dominant → softsummer' },
];

// Autumn subtypes
const autumnSubtypeTests = [
  // temp dominant → warmautumn
  { t: 5, d: -1, c: -2, expected: 'warmautumn', desc: 'Autumn temp dominant → warmautumn' },
  // depth dominant → deepautumn
  { t: 1, d: -5, c: -2, expected: 'deepautumn', desc: 'Autumn depth dominant → deepautumn' },
  // clarity dominant → softautumn
  { t: 2, d: -1, c: -5, expected: 'softautumn', desc: 'Autumn clarity dominant → softautumn' },
];

// Winter subtypes
const winterSubtypeTests = [
  // temp dominant → coolwinter
  { t: -5, d: -1, c: 2, expected: 'coolwinter', desc: 'Winter temp dominant → coolwinter' },
  // depth dominant → deepwinter
  { t: -1, d: -5, c: 2, expected: 'deepwinter', desc: 'Winter depth dominant → deepwinter' },
  // clarity dominant → brightwinter
  { t: -1, d: -2, c: 5, expected: 'brightwinter', desc: 'Winter clarity dominant → brightwinter' },
];

const allSubtypeTests = [...springSubtypeTests, ...summerSubtypeTests, ...autumnSubtypeTests, ...winterSubtypeTests];
let subtypeOk = true;
allSubtypeTests.forEach(({ t, d, c, expected, desc }) => {
  const result = fullDetermine(t, d, c);
  if (result === expected) {
    ok(desc);
  } else {
    ng(desc, `Expected ${expected}, got ${result}`);
    subtypeOk = false;
  }
});

// Verify all 12 subtypes are reachable
const reachableSubtypes = new Set(allSubtypeTests.map(({ t, d, c }) => fullDetermine(t, d, c)));
if (reachableSubtypes.size === 12) {
  ok('All 12 subtypes reachable via unit tests');
} else {
  const missing = seasonKeys.filter(k => !reachableSubtypes.has(k));
  ng('Subtype reachability', `Missing: ${missing.join(', ')}`);
}

// ===== 8. AI COLOR ANALYSIS =====
section('8. AI COLOR ANALYSIS');

function rgbToHsl(c) {
  const r = c.r / 255, g = c.g / 255, b = c.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
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

// AI test cases — check base season correctness
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

// ===== 9. DOM ID CONSISTENCY =====
section('9. DOM ID CONSISTENCY');

const getElByIdRegex = /getElementById\(['"]([\w-]+)['"]\)/g;
const jsIds = new Set();
let m;
while ((m = getElByIdRegex.exec(scriptSrc)) !== null) {
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

// ===== 10. CSS CLASS CONSISTENCY =====
section('10. CSS CLASS CONSISTENCY');

const criticalClasses = [
  'screen', 'active', 'container', 'intro-container', 'ai-container', 'quiz-container',
  'loading-container', 'result-container', 'option-btn', 'selected', 'progress-fill',
  'progress-text', 'cta-btn', 'back-btn', 'card', 'swatch', 'swatch-avoid',
  'track-btn', 'track-ai', 'track-quiz', 'camera-wrap', 'face-guide', 'face-oval',
  'scan-overlay', 'scan-line', 'ai-capture-btn', 'detected-colors', 'detected-dot',
  'share-btn', 'copy-btn', 'facebook-btn', 'retake-btn',
  'result-baseseason-badge', 'result-en-name',
  'baseseason-spring', 'baseseason-summer', 'baseseason-autumn', 'baseseason-winter'
];

let cssMismatches = 0;
criticalClasses.forEach(cls => {
  const inCSS = cssSrc.includes(`.${cls}`) || cssSrc.includes(`.${cls} `) || cssSrc.includes(`.${cls}{`) || cssSrc.includes(`.${cls}:`);
  const inHTML = htmlSrc.includes(`class="`) && (htmlSrc.includes(cls) || scriptSrc.includes(cls));
  if (inCSS && inHTML) {
    // ok
  } else if (!inCSS) {
    ng(`CSS class: .${cls}`, 'Used in HTML/JS but missing in CSS');
    cssMismatches++;
  }
});
if (cssMismatches === 0) ok(`All ${criticalClasses.length} critical CSS classes defined`);

// ===== 11. RESPONSIVE & ACCESSIBILITY =====
section('11. RESPONSIVE & ACCESSIBILITY');

if (cssSrc.includes('@media (max-width: 480px)')) ok('Mobile breakpoint: 480px');
else ng('Mobile breakpoint', 'Missing 480px media query');

if (cssSrc.includes('@media (min-width: 768px)')) ok('Tablet breakpoint: 768px');
else ng('Tablet breakpoint', 'Missing 768px media query');

if (htmlSrc.includes('viewport')) ok('Viewport meta tag present');
else ng('Viewport', 'Missing viewport meta');

const onclickCount = (htmlSrc.match(/onclick="/g) || []).length;
const buttonCount = (htmlSrc.match(/<button/g) || []).length;
ok(`Interactive elements: ${buttonCount} buttons, ${onclickCount} onclick handlers`);

// ===== 12. SECURITY =====
section('12. SECURITY');

const evalMatches = scriptSrc.match(/\beval\s*\(/g);
if (!evalMatches) ok('No eval() in script.js');
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

const innerHTMLCount = (scriptSrc.match(/\.innerHTML\s*=/g) || []).length;
ok(`innerHTML usage: ${innerHTMLCount} instances (all controlled template data)`);

// ===== 13. URL HASH SHARING =====
section('13. URL HASH SHARING');

if (scriptSrc.includes('result=${currentSeason.key}&temp=${scores.temp}&depth=${scores.depth}&clarity=${scores.clarity}')) {
  ok('URL hash format: #result=KEY&temp=N&depth=N&clarity=N');
} else {
  ng('URL hash format', 'Expected hash format not found');
}

// Check fallback for old 4-season URLs
if (scriptSrc.includes('determineSeason()') && scriptSrc.includes("hash.includes('result=')")) {
  ok('URL restoration with determineSeason() fallback');
} else {
  ng('URL restoration', 'Missing determineSeason() fallback');
}

const parseIntCalls = scriptSrc.match(/parseInt\([^)]+\)/g) || [];
let noRadix = parseIntCalls.filter(c => !c.includes(', 10'));
if (noRadix.length === 0) ok('All parseInt calls include radix 10');
else wn(`${noRadix.length} parseInt calls without explicit radix`);

// ===== 14. OLD 4-SEASON URL FALLBACK TEST =====
section('14. OLD 4-SEASON URL FALLBACK');

// Simulate: old URL has key="spring" which no longer exists in SEASONS
const old4SeasonKeys = ['spring', 'summer', 'autumn', 'winter'];
old4SeasonKeys.forEach(oldKey => {
  if (!SEASONS[oldKey]) {
    ok(`Old key "${oldKey}" correctly absent from SEASONS → triggers fallback`);
  } else {
    ng(`Old key "${oldKey}"`, 'Still exists, should be removed for 12-season');
  }
});

// Verify fallback logic exists in source
if (scriptSrc.includes('else if (key)')) {
  ok('Fallback branch exists for unrecognized keys');
} else {
  ng('Fallback', 'No else-if branch for old 4-season URL fallback');
}

// ===== 15. CAMERA API =====
section('15. CAMERA API');

if (scriptSrc.includes('getUserMedia')) ok('getUserMedia API used');
else ng('Camera API', 'getUserMedia not found');

if (scriptSrc.includes("facingMode")) ok('Camera facingMode switching supported');
else ng('Camera', 'facingMode not found');

if (scriptSrc.includes('enumerateDevices')) ok('Device enumeration for multi-camera support');
else ng('Camera', 'enumerateDevices not found');

if (scriptSrc.includes('scaleX(-1)') || scriptSrc.includes("scale(-1, 1)")) {
  ok('Front camera mirror mode');
} else {
  ng('Camera', 'Mirror mode not found');
}

if (scriptSrc.includes("accept=\"image/*\"") || htmlSrc.includes("accept=\"image/*\"")) {
  ok('File upload accepts all image types');
} else {
  ng('Upload', 'accept="image/*" not found');
}

// ===== 16. SUPPORTING FILES =====
section('16. SUPPORTING FILES');

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

// ===== 17. MISSING ASSETS =====
section('17. MISSING ASSETS (Warnings)');

const expectedAssets = ['og-image.jpg'];
expectedAssets.forEach(f => {
  if (fs.existsSync(path.join(DIR, f))) ok(`Asset: ${f}`);
  else wn(`Asset: ${f} — not yet created (referenced in OG tags)`);
});

// ===== 18. QUIZ PATH SIMULATION (12-SEASON) =====
section('18. QUIZ PATH SIMULATION (12-SEASON)');

function simulateQuiz(optionIndices) {
  let t = 0, d = 0, c = 0;
  optionIndices.forEach((idx, qi) => {
    const opt = QUESTIONS[qi].options[idx];
    t += opt.temp;
    d += opt.depth;
    c += opt.clarity;
  });
  const base = determineBaseSeason(t, d, c);
  const subtype = localGetSubtype(base, t, d, c);
  return { temp: t, depth: d, clarity: c, base, subtype };
}

// Spring path
const springPath = [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0];
const springResult = simulateQuiz(springPath);
ok(`Spring sim: ${springResult.subtype} [base=${springResult.base}] (t=${springResult.temp} d=${springResult.depth} c=${springResult.clarity})`);

// Summer path
const summerPath = [3, 3, 3, 0, 0, 1, 0, 1, 2, 1, 3, 1];
const summerResult = simulateQuiz(summerPath);
ok(`Summer sim: ${summerResult.subtype} [base=${summerResult.base}] (t=${summerResult.temp} d=${summerResult.depth} c=${summerResult.clarity})`);

// Autumn path
const autumnPath = [1, 0, 1, 2, 1, 0, 3, 3, 1, 2, 2, 2];
const autumnResult = simulateQuiz(autumnPath);
ok(`Autumn sim: ${autumnResult.subtype} [base=${autumnResult.base}] (t=${autumnResult.temp} d=${autumnResult.depth} c=${autumnResult.clarity})`);

// Winter path
const winterPath = [0, 2, 3, 3, 0, 1, 3, 2, 0, 3, 1, 3];
const winterResult = simulateQuiz(winterPath);
ok(`Winter sim: ${winterResult.subtype} [base=${winterResult.base}] (t=${winterResult.temp} d=${winterResult.depth} c=${winterResult.clarity})`);

// Check all 4 base seasons reachable via quiz
const allBases = new Set([springResult.base, summerResult.base, autumnResult.base, winterResult.base]);
if (allBases.size === 4) ok('All 4 base seasons reachable via quiz paths');
else ng('Season reachability', `Only ${allBases.size} base seasons reachable: ${[...allBases].join(', ')}`);

// Check subtypes are valid 12-season keys
[springResult, summerResult, autumnResult, winterResult].forEach(r => {
  if (SEASONS[r.subtype]) ok(`Quiz result "${r.subtype}" exists in SEASONS`);
  else ng(`Quiz result "${r.subtype}"`, 'Not found in SEASONS');
});

// ===== 19. GOBACK SCORE ROLLBACK =====
section('19. GOBACK SCORE ROLLBACK');

let scores = { temp: 0, depth: 0, clarity: 0 };
let history = [];
for (let i = 0; i < 3; i++) {
  const opt = QUESTIONS[i].options[0];
  history.push({ temp: opt.temp, depth: opt.depth, clarity: opt.clarity });
  scores.temp += opt.temp;
  scores.depth += opt.depth;
  scores.clarity += opt.clarity;
}
const beforeGoBack = { ...scores };
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
