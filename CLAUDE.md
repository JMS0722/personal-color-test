# Personal Color Test

## Project Overview
Vietnamese-targeted personal color analysis quiz (퍼스널 컬러 테스트).
Single-page application: HTML/CSS/Vanilla JS.

## Architecture
- **2-track entry**: AI Photo Analysis (camera/upload) OR 12-question quiz (for privacy-conscious users)
- **Digital Draping**: MediaPipe FaceLandmarker jawline detection → color overlay on captured photo (AI path only)
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

**Each SEASONS entry has**: key, baseseason, emoji, name, enName, subtitle, description, gradient, primary, light, palette(12), avoid(6), makeup(4), clothing(5), hair(4), jewelry, celebrities(6), products(4), populationPercent, story, traits(3), nails(4), bestWorstPairs(4)

**ADJACENT_SEASONS**: Maps each season key → 2 adjacent season keys (for cross-season recommendations)

**URL fallback**: Old 4-season URLs (e.g. `#result=spring`) trigger `determineSeason()` recalculation from scores.

## AI Color Analysis Algorithm
1. Face region estimation based on centered oval guide
2. Sample pixels from cheeks (skin), above forehead (hair), eye region (eyes)
3. RGB → HSL conversion for each feature
4. Temp: skin hue warmth + R/B ratio + G/B ratio + hair hue (range: ±7, symmetric)
5. Depth: weighted overall lightness (skin 45% + hair 35% + eye 20%) (range: ±5)
6. Clarity: contrast strength + skin saturation + eye contrast + dark features bonus (range: ±5~6, symmetric)
7. Feed scores into same `determineSeason()` as quiz path
8. **Rebalanced 2026-03-06**: cool skin hue signal strengthened (-2→-3), dark hair+eye+high contrast flipped from penalty to bonus

## Files (ES Module Architecture)
- `index.html` — SPA shell with 5 screens (intro/ai/quiz/loading/result), OG/meta tags
- `js/app.js` — Entry point, screen management, window bindings, saved result banner
- `js/state.js` — Shared state (scores, currentSeason, currentQuestion)
- `js/quiz.js` — Quiz logic (adaptive questioning)
- `js/scoring.js` — `getBaseSeason()`, `getSubtype()`, `determineSeason()`, `getSeasonConfidence()`
- `js/result.js` — Result rendering (confidence bars, story, palette, bestWorst, adjacent, nails, makeup, clothing, hair, celebrities, products)
- `js/result-card.js` — Canvas image generators: OG card (1200x630), Story card (1080x1920), Wallpaper card (1080x1920)
- `js/ai-analysis.js` — Camera/upload AI color analysis (rebalanced scoring)
- `js/draping.js` — Digital draping: MediaPipe FaceLandmarker, jawline polygon, Canvas overlay, swipe nav
- `js/share.js` — Facebook/Zalo/link sharing, URL hash management
- `js/comparison.js` — Friend season comparison (12x12 compatibility)
- `js/analytics.js` — GA4 event tracking stubs
- `js/data/seasons.js` — 12-season data + ADJACENT_SEASONS mapping
- `css/base.css` — Design tokens, typography, screen transitions
- `css/components.css` — UI components (buttons, cards, progress bar)
- `css/screens.css` — Screen-specific styles (intro, quiz, loading, result)
- `css/seasons.css` — Season-specific theme styles
- `test_suite.js` — 244 tests: data integrity, 12-season reachability, subtype logic, AI, DOM/CSS consistency
- `privacy.html`, `contact.html` — Legal/contact pages
- `.github/workflows/deploy.yml` — GitHub Actions → Cloudflare Pages
- `docs/improvement-plan-v2.md` — Feature improvement plan (Phase 2.5-2.8 complete)

## Deployment
- GitHub Actions auto-deploys on push to `main`
- Cloudflare Pages project: `personal-color-test`
- Initial domain: `personal-color-test.pages.dev`

## Cross-project
- Sister site: https://skintypetest.com (skin type quiz)
- Cross-links in result page footer
