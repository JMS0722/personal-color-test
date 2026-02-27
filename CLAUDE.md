# Personal Color Test

## Project Overview
Vietnamese-targeted personal color analysis quiz (퍼스널 컬러 테스트).
Single-page application: HTML/CSS/Vanilla JS.

## Architecture
- **2-track entry**: AI Photo Analysis (camera/upload) OR 12-question quiz
- **Scoring**: 3-axis bipolar system — `temp` (Cool↔Warm), `depth` (Dark↔Light), `clarity` (Soft↔Clear)
- **AI analysis**: Canvas pixel sampling → face region color extraction (skin/hair/eye) → HSL analysis → 3-axis scores
- **Result**: 2-stage determination → 12-season subtype (see below)
- **SPA**: 5 screens (intro → ai/quiz → loading → result), `.screen`/`.active` toggling
- **URL sharing**: `#result=brightspring&temp=5&depth=3&clarity=2` hash-based restoration
- **Camera API**: `getUserMedia` with `facingMode: user/environment`, works on mobile + desktop

## 12-Season System
2-stage determination: base season (affinity formula) → subtype (dominant axis).

| Base Season | Subtype 1 (clarity) | Subtype 2 (depth) | Subtype 3 (temp) |
|-------------|--------------------|--------------------|-------------------|
| Spring | Bright Spring | Light Spring | Warm Spring |
| Summer | Soft Summer | Light Summer | Cool Summer |
| Autumn | Soft Autumn | Deep Autumn | Warm Autumn |
| Winter | Bright Winter | Deep Winter | Cool Winter |

**Key functions**: `getBaseSeason()` → `getSubtype()` → `determineSeason()`

**12 season keys**: `brightspring`, `lightspring`, `warmspring`, `lightsummer`, `coolsummer`, `softsummer`, `warmautumn`, `deepautumn`, `softautumn`, `coolwinter`, `deepwinter`, `brightwinter`

**Each SEASONS entry has**: key, baseseason, emoji, name, enName, subtitle, description, gradient, primary, light, palette(12), avoid(6), makeup(4), clothing(5), hair(4), jewelry, celebrities(6), products(4)

**URL fallback**: Old 4-season URLs (e.g. `#result=spring`) trigger `determineSeason()` recalculation from scores.

## AI Color Analysis Algorithm
1. Face region estimation based on centered oval guide
2. Sample pixels from cheeks (skin), above forehead (hair), eye region (eyes)
3. RGB → HSL conversion for each feature
4. Temp: skin hue warmth + R/B ratio + G/B ratio + hair hue
5. Depth: weighted overall lightness (skin 45% + hair 35% + eye 20%)
6. Clarity: contrast strength + skin saturation + eye contrast + overall mutedness
7. Feed scores into same `determineSeason()` as quiz path

## Files
- `index.html` — SPA shell with 5 screens (intro/ai/quiz/loading/result), OG/meta tags
- `script.js` — 12 questions + AI camera/analysis engine + 12-season scoring + result data + share logic
- `style.css` — gold/rose theme, baseseason badges, responsive (480px/768px breakpoints)
- `test_suite.js` — 202 tests: data integrity, 12-season reachability, subtype logic, AI, DOM/CSS consistency
- `privacy.html`, `contact.html` — Legal/contact pages
- `.github/workflows/deploy.yml` — GitHub Actions → Cloudflare Pages

## Deployment
- GitHub Actions auto-deploys on push to `main`
- Cloudflare Pages project: `personal-color-test`
- Initial domain: `personal-color-test.pages.dev`

## Cross-project
- Sister site: https://skintypetest.com (skin type quiz)
- Cross-links in result page footer
