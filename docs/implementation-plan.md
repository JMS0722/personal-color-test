# Personal Color Test — 상세 구현 플랜

> 작성일: 2026-03-03 | 기반: research.md, design-strategy.md
> 원칙: **빌드 도구/번들러 없음**, Vanilla JS + ES Modules, 모바일 퍼스트

---

## 목차

1. [현재 상태 분석](#1-현재-상태-분석)
2. [목표 파일 구조](#2-목표-파일-구조)
3. [Phase 1: 코어 리빌드](#3-phase-1-코어-리빌드)
4. [Phase 2: 바이럴 & 수익화](#4-phase-2-바이럴--수익화)
5. [Phase 3: 고급 기능](#5-phase-3-고급-기능)
6. [테스트 전략](#6-테스트-전략)
7. [배포 체크리스트](#7-배포-체크리스트)

---

## 1. 현재 상태 분석

### 1-1. 현재 파일 구조

```
personal-color-test/
├── index.html          (379줄) — SPA 셸 5스크린
├── script.js           (1,513줄) — 모든 로직
├── style.css           (1,351줄) — 모든 스타일
├── test_suite.js       (202 테스트) — 단일 파일 테스트
├── og-image.jpg        — 정적 OG 이미지 (1장)
├── generate-og.js      — OG 이미지 생성 스크립트 (Node)
├── privacy.html        — 개인정보처리방침
├── contact.html        — 연락처
├── robots.txt / sitemap.xml
└── .github/workflows/deploy.yml
```

### 1-2. script.js 내부 구조 (모듈 분리 기준)

| 줄 범위 | 내용 | 목표 파일 |
|---------|------|----------|
| 7-140 | `QUESTIONS` 배열 (12문항, 각 4옵션, temp/depth/clarity 점수) | `js/data/questions.js` |
| 144-704 | `SEASONS` 객체 (12시즌, 각각 palette/makeup/clothing/hair/jewelry/celebrities/products) | `js/data/seasons.js` |
| 706-716 | 상태 변수 (currentQ, scores, answers, scoreHistory, cameraStream 등) | `js/state.js` |
| 718-723 | `showScreen()` | `js/app.js` |
| 726-798 | 퀴즈 플로우 (startQuiz, renderQuestion, selectOption, goBack) | `js/quiz.js` |
| 800-820 | `showLoading()` | `js/app.js` |
| 822-883 | 시즌 판정 (getBaseSeason, getSubtype, determineSeason) | `js/scoring.js` |
| 885-1078 | 결과 렌더링 (renderResult + 서브함수 8개) | `js/result.js` |
| 1080-1262 | AI 카메라/사진 분석 (startAI, startCamera, capturePhoto, handleUpload, analyzePhoto) | `js/ai-analysis.js` |
| 1264-1449 | 색상 추출 엔진 (extractFaceColors, sampleRegion, rgbToHsl, analyzeColorsToScores) | `js/ai-analysis.js` |
| 1451-1513 | URL 공유/복원 (getResultUrl, shareFacebook, copyLink, DOMContentLoaded) | `js/share.js` + `js/app.js` |

### 1-3. style.css 내부 구조 (분리 기준)

| 줄 범위 (대략) | 내용 | 목표 파일 |
|---------------|------|----------|
| 1-80 | 리셋, CSS 변수, 기본 타이포그래피 | `css/base.css` |
| 80-300 | 버튼, 카드, 프로그레스바, 배지 등 공통 컴포넌트 | `css/components.css` |
| 300-900 | 인트로/AI/퀴즈/로딩/결과 화면별 레이아웃 | `css/screens.css` |
| 900-1100 | 12시즌 테마 색상, baseseason 배지 | `css/seasons.css` |
| 1100-1351 | 반응형 미디어쿼리 (480px/768px) | 각 파일 하단에 분산 또는 `css/responsive.css` |

---

## 2. 목표 파일 구조

```
personal-color-test/
├── index.html                  — SPA 셸 (ES Module import로 변경)
│
├── css/
│   ├── base.css                — 리셋, CSS 변수 (--gold, --rose, --bg, 시즌 변수), 타이포
│   ├── components.css          — .cta-btn, .card, .option-btn, .progress-bar, .badge 등
│   ├── screens.css             — #intro-screen, #ai-screen, #quiz-screen, #loading-screen, #result-screen
│   └── seasons.css             — .season-spring, .season-summer 등 12시즌 테마 + baseseason 배지
│
├── js/
│   ├── app.js                  — 진입점: import 모든 모듈, showScreen(), showLoading(), DOMContentLoaded 초기화
│   ├── state.js                — 공유 상태: currentQ, scores, answers, scoreHistory, currentSeason, cameraStream 등
│   ├── data/
│   │   ├── questions.js        — export const QUESTIONS = [...]
│   │   └── seasons.js          — export const SEASONS = {...}
│   ├── quiz.js                 — startQuiz(), renderQuestion(), selectOption(), goBack()
│   ├── scoring.js              — getBaseSeason(), getSubtype(), determineSeason()
│   ├── result.js               — renderResult(), renderAxisChart(), renderPalette(), renderMakeup() 등
│   ├── ai-analysis.js          — startAI(), startCamera(), capturePhoto(), handleUpload(), analyzePhoto(), 색상 추출
│   ├── share.js                — getResultUrl(), updateUrlHash(), shareFacebook(), copyLink(), retakeQuiz()
│   ├── result-card.js          — [Phase 2] Canvas 결과 카드 이미지 생성 (1200×630)
│   ├── comparison.js           — [Phase 3] 친구 비교 기능 (12×12 호환성)
│   └── analytics.js            — [Phase 2] GA4 이벤트 추적
│
├── images/                     — 기존 이미지
├── img/                        — 기존 이미지
│
├── docs/
│   ├── research.md
│   ├── design-strategy.md
│   └── implementation-plan.md  — 이 문서
│
├── privacy.html
├── contact.html
├── robots.txt
├── sitemap.xml
├── og-image.jpg
├── generate-og.js
├── test_suite.js               — 모듈 구조에 맞게 업데이트
├── package.json
└── .github/workflows/deploy.yml
```

---

## 3. Phase 1: 코어 리빌드

> 목표: 기존 기능 100% 유지하면서 모듈화. 시각적 변경 없음.
> 완료 기준: `node test_suite.js` 202개 테스트 전체 통과

### STEP 1-1: 디렉토리 생성

```bash
mkdir -p css js/data
```

- `css/` — 4개 CSS 파일
- `js/` — 메인 모듈들
- `js/data/` — 데이터 전용 모듈

### STEP 1-2: CSS 분리

#### `css/base.css`
style.css에서 추출:
- `:root` CSS 변수 블록 전체 (--gold, --rose, --bg, --text, --subtle, --card, --radius, --shadow, 시즌 override 변수)
- `*` 리셋 (box-sizing, margin, padding)
- `body` 스타일 (font-family Inter, 배경, 색상)
- `.container` 레이아웃
- 일반 타이포그래피 (h1-h3, p)
- `.screen` / `.screen.active` 토글 + `fadeUp` 키프레임
- `footer` 스타일

#### `css/components.css`
style.css에서 추출:
- `.cta-btn` / `.track-btn` / `.option-btn` / `.share-btn` — 모든 버튼 스타일
- `.card` 공통 스타일 (배경, 패딩, border-radius, shadow)
- `.progress-wrap` / `.progress-bar` / `.progress-fill` / `.progress-text`
- `.back-btn`
- `.intro-badge` / `.result-badge`
- `.feature-item`
- `.season-chip`

#### `css/screens.css`
style.css에서 추출:
- `#intro-screen` 관련 모든 스타일 (.intro-container, .intro-title, .intro-subtitle, .intro-tracks, .intro-note, .intro-features, .intro-seasons)
- `#ai-screen` 관련 (.ai-container, .ai-header, .camera-wrap, .face-guide, .face-oval, .photo-preview, .scan-overlay, .ai-controls, .ai-tips, .ai-actions, .detected-colors 등)
- `#quiz-screen` 관련 (.quiz-container, .quiz-header, .question-text, .question-hint, .options-list)
- `#loading-screen` 관련 (.loading-container, .loading-spinner, .spinner-ring, .load-step 등)
- `#result-screen` 관련 (.result-container, .result-header, .result-emoji, .result-season, .axis-card, .palette-card, .makeup-card, .clothing-card, .hair-card, .jewelry-card, .celeb-card, .product-card, .share-card, .cross-card, .retake-btn)
- 모든 화면별 반응형 미디어쿼리 (`@media (max-width: 768px)`, `@media (max-width: 480px)`)

#### `css/seasons.css`
style.css에서 추출:
- `.result-baseseason-badge` 기본 + 시즌별 변형 (.badge-spring, .badge-summer, .badge-autumn, .badge-winter)
- 시즌 테마 CSS 변수 override (있다면)
- 12시즌 그라디언트/컬러 관련 스타일

#### index.html 변경
```html
<!-- 기존 -->
<link rel="stylesheet" href="style.css">

<!-- 변경 -->
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/screens.css">
<link rel="stylesheet" href="css/seasons.css">
```

#### 검증
- 브라우저에서 index.html 열어 시각적으로 동일한지 확인
- 모바일 뷰 (480px, 768px) 반응형 확인
- style.css는 삭제하지 않고 백업으로 보관 (style.css.bak)

---

### STEP 1-3: JS 데이터 모듈 분리

#### `js/data/questions.js`
```javascript
// script.js 7-140줄 추출
export const QUESTIONS = [
  {
    id: 1,
    text: "Màu tóc tự nhiên của bạn gần với màu nào nhất?",
    hint: "Hãy nghĩ về màu tóc khi chưa nhuộm",
    options: [
      { text: "Đen tuyền hoặc nâu rất đậm",   temp: -1, depth: -2, clarity: 1  },
      // ... 나머지 동일
    ]
  },
  // ... Q2-Q12
];
```

#### `js/data/seasons.js`
```javascript
// script.js 144-704줄 추출
export const SEASONS = {
  brightspring: {
    key: 'brightspring',
    baseseason: 'spring',
    emoji: '🌸',
    name: 'Xuân Rực Rỡ',
    // ... 나머지 동일
  },
  // ... 나머지 11시즌
};
```

---

### STEP 1-4: JS 상태 모듈

#### `js/state.js`
```javascript
// 공유 상태 — 모든 모듈이 import하여 사용
export const state = {
  currentQ: 0,
  scores: { temp: 0, depth: 0, clarity: 0 },
  answers: [],
  scoreHistory: [],
  currentSeason: null,

  // AI Camera
  cameraStream: null,
  facingMode: 'user',
  capturedImageData: null,
};

// 상태 리셋 헬퍼
export function resetQuizState() {
  state.currentQ = 0;
  state.scores = { temp: 0, depth: 0, clarity: 0 };
  state.answers = [];
  state.scoreHistory = [];
  state.currentSeason = null;
}
```

---

### STEP 1-5: JS 로직 모듈 분리

#### `js/scoring.js`
```javascript
import { SEASONS } from './data/seasons.js';
import { state } from './state.js';

export function getBaseSeason(temp, depth, clarity) { /* 822-842줄 동일 */ }
export function getSubtype(baseSeason, temp, depth, clarity) { /* 846-876줄 동일 */ }

export function determineSeason() {
  const { temp, depth, clarity } = state.scores;
  const baseSeason = getBaseSeason(temp, depth, clarity);
  const subtype = getSubtype(baseSeason, temp, depth, clarity);
  state.currentSeason = SEASONS[subtype];
}
```

#### `js/quiz.js`
```javascript
import { QUESTIONS } from './data/questions.js';
import { state, resetQuizState } from './state.js';
import { showScreen, showLoading } from './app.js';

export function startQuiz() { /* 726-734줄: resetQuizState() 호출 + showScreen + renderQuestion */ }
export function renderQuestion() { /* 736-758줄 동일 */ }
export function selectOption(idx, btn) { /* 761-784줄 동일, showLoading import */ }
export function goBack() { /* 787-798줄 동일 */ }
```

#### `js/result.js`
```javascript
import { state } from './state.js';

export function renderResult() { /* 886-899줄 + 서브함수 호출 */ }
function renderAxisChart() { /* 내부 함수 */ }
function renderPalette() { /* 내부 함수 */ }
function renderMakeup() { /* 내부 함수 */ }
function renderClothing() { /* 내부 함수 */ }
function renderHair() { /* 내부 함수 */ }
function renderJewelry() { /* 내부 함수 */ }
function renderCelebrities() { /* 내부 함수 */ }
function renderProducts() { /* 내부 함수 */ }
```

#### `js/ai-analysis.js`
```javascript
import { state } from './state.js';
import { determineSeason } from './scoring.js';
import { renderResult } from './result.js';
import { showScreen, showLoading } from './app.js';

export function startAI() { /* 1080-1100줄 */ }
export function exitAI() { /* 카메라 정지 + 인트로 복귀 */ }
export function startCamera() { /* getUserMedia 로직 */ }
export function switchCamera() { /* facingMode 전환 */ }
export function capturePhoto() { /* Canvas 캡처 */ }
export function retakePhoto() { /* 재촬영 */ }
export function handleUpload(event) { /* 파일 업로드 */ }
export function analyzePhoto() { /* 분석 실행 → determineSeason → renderResult */ }

// 내부 함수 (export 불필요)
function extractFaceColors(imageData, width, height) { /* 1264-1340줄 */ }
function sampleRegion(data, width, cx, cy, radius) { /* 픽셀 샘플링 */ }
function avgColors(pixels) { /* 평균 RGB */ }
function rgbToHsl(r, g, b) { /* 변환 */ }
function analyzeColorsToScores(skin, hair, eye) { /* HSL → 3축 점수 */ }
```

#### `js/share.js`
```javascript
import { state } from './state.js';
import { showScreen } from './app.js';

export function getResultUrl() { /* 1452-1456줄 */ }
export function updateUrlHash() { /* 1458-1461줄 */ }
export function shareFacebook() { /* 1463-1466줄 */ }
export function copyLink() { /* 1468-1484줄 */ }
export function retakeQuiz() { /* 1486-1489줄 */ }
```

#### `js/app.js` (진입점)
```javascript
import { SEASONS } from './data/seasons.js';
import { state } from './state.js';
import { startQuiz, renderQuestion, selectOption, goBack } from './quiz.js';
import { determineSeason } from './scoring.js';
import { renderResult } from './result.js';
import { startAI, exitAI, capturePhoto, retakePhoto, handleUpload, analyzePhoto, switchCamera } from './ai-analysis.js';
import { shareFacebook, copyLink, retakeQuiz } from './share.js';

// 화면 전환
export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 로딩 애니메이션
export function showLoading() { /* 800-820줄 동일 */ }

// 글로벌 바인딩 (onclick 핸들러용)
window.startQuiz = startQuiz;
window.startAI = startAI;
window.exitAI = exitAI;
window.capturePhoto = capturePhoto;
window.retakePhoto = retakePhoto;
window.handleUpload = handleUpload;
window.analyzePhoto = analyzePhoto;
window.switchCamera = switchCamera;
window.selectOption = selectOption;
window.goBack = goBack;
window.shareFacebook = shareFacebook;
window.copyLink = copyLink;
window.retakeQuiz = retakeQuiz;

// URL 복원 (DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;
  if (hash && hash.includes('result=')) {
    const params = new URLSearchParams(hash.slice(1));
    const key = params.get('result');
    state.scores.temp = parseInt(params.get('temp'), 10) || 0;
    state.scores.depth = parseInt(params.get('depth'), 10) || 0;
    state.scores.clarity = parseInt(params.get('clarity'), 10) || 0;

    if (key && SEASONS[key]) {
      state.currentSeason = SEASONS[key];
      renderResult();
      showScreen('result-screen');
    } else if (key) {
      determineSeason();
      renderResult();
      showScreen('result-screen');
    }
  }
});
```

### STEP 1-6: index.html 스크립트 변경

```html
<!-- 기존 -->
<script src="script.js"></script>

<!-- 변경 -->
<script type="module" src="js/app.js"></script>
```

**주의: `onclick="startQuiz()"` 등 인라인 핸들러 문제**

ES Modules는 자체 스코프이므로 `onclick` 인라인 핸들러에서 함수에 접근 불가.
→ `app.js`에서 `window.startQuiz = startQuiz;` 등으로 글로벌 바인딩 필수.

바인딩 필요한 함수 목록 (index.html의 onclick에서 호출):
- `startAI()` — intro-screen AI 버튼
- `startQuiz()` — intro-screen 퀴즈 버튼
- `exitAI()` — ai-screen 뒤로가기
- `capturePhoto()` — ai-screen 캡처 버튼
- `handleUpload(event)` — ai-screen 파일 업로드
- `switchCamera()` — ai-screen 카메라 전환
- `retakePhoto()` — ai-screen 재촬영
- `analyzePhoto()` — ai-screen 분석 버튼
- `goBack()` — quiz-screen 뒤로가기
- `shareFacebook()` — result-screen 공유
- `copyLink()` — result-screen 링크 복사
- `retakeQuiz()` — result-screen 다시하기

### STEP 1-7: test_suite.js 업데이트

현재 test_suite.js는 `fs.readFileSync`로 script.js를 직접 읽고 `new Function()`으로 실행함.
모듈 구조에서는 이 방식이 동작하지 않으므로 수정 필요.

**접근법**: test_suite.js가 개별 모듈 파일을 읽어 조합하거나, script.js를 백업으로 유지하여 테스트 겸용.

**추천 방식**:
```javascript
// test_suite.js 수정
// 개별 데이터 파일에서 export된 변수를 추출

const questionsFile = fs.readFileSync('js/data/questions.js', 'utf8');
const seasonsFile = fs.readFileSync('js/data/seasons.js', 'utf8');
const scoringFile = fs.readFileSync('js/scoring.js', 'utf8');

// export 키워드 제거 후 eval
const questionsCode = questionsFile.replace(/^export /gm, '');
const seasonsCode = seasonsFile.replace(/^export /gm, '');
const scoringCode = scoringFile
  .replace(/^import .*/gm, '')  // import 문 제거
  .replace(/^export /gm, '');   // export 제거

// DOM mock + Function constructor로 실행 (기존 패턴 유지)
const combined = questionsCode + '\n' + seasonsCode + '\n' + scoringCode;
const fn = new Function('document', 'window', combined + '; return { QUESTIONS, SEASONS, getBaseSeason, getSubtype };');
```

### STEP 1-8: Phase 1 완료 체크리스트

- [x] `css/` 4파일 = style.css 전체 내용 (누락 없음) ✅ 2026-03-04
- [x] `js/` 모듈 = script.js 전체 기능 (누락 없음) ✅ 2026-03-04
- [x] index.html: CSS 4개 링크 + `<script type="module" src="js/app.js">` ✅ 2026-03-04
- [x] 인라인 onclick 핸들러 전부 `window` 바인딩 확인 ✅ 2026-03-04
- [ ] 브라우저 테스트: 인트로 → AI 트랙 → 카메라/업로드 → 결과 (수동 필요)
- [ ] 브라우저 테스트: 인트로 → 퀴즈 12문항 → 로딩 → 결과 (수동 필요)
- [ ] 브라우저 테스트: 뒤로가기 (goBack) 동작 (수동 필요)
- [ ] 브라우저 테스트: URL hash 공유/복원 동작 (수동 필요)
- [ ] 브라우저 테스트: Facebook 공유 / 링크 복사 (수동 필요)
- [ ] 브라우저 테스트: 다시하기 (수동 필요)
- [ ] 모바일 반응형 (480px, 768px) 시각적 동일 (수동 필요)
- [x] `node test_suite.js` → 244 테스트 통과 (0 실패) ✅ 2026-03-04
- [ ] script.js → script.js.bak 보관 (원본 보존 중)
- [ ] style.css → style.css.bak 보관 (원본 보존 중)

---

## 4. Phase 2: 바이럴 & 수익화

> 목표: 공유율 5%→20%, 체류시간 5분→10분, 어필리에이트 수익 시작
> 전제: Phase 1 완료

### STEP 2-1: 인트로 화면 개선

#### 변경 사항
1. **소셜 프루프 카운터** 추가
2. **"한국식 12시즌 분석 기반"** 부제목 추가
3. **AI 트랙에 "Chính xác"** 강조

#### index.html 수정
```html
<!-- intro-subtitle 아래에 추가 -->
<p class="intro-k-beauty">Phương pháp phân tích 12 mùa theo chuẩn Hàn Quốc</p>

<!-- intro-note 아래에 추가 -->
<p class="social-proof" id="social-proof">⭐ <span id="participant-count">50,000</span>+ người đã tham gia</p>
```

#### css/screens.css 추가
```css
.intro-k-beauty {
  font-size: 0.85rem;
  color: var(--subtle);
  margin-top: -8px;
}
.social-proof {
  font-size: 0.9rem;
  color: var(--gold);
  font-weight: 600;
  margin-top: 16px;
}
```

#### 참가자 카운터 로직 (js/app.js)
- localStorage에 카운트 저장
- 퀴즈 완료 시 +1 증가
- 초기값: 50,000 (시드)
- 표시: `toLocaleString('vi-VN')` 포맷

---

### STEP 2-2: 공유 버튼 위치 이동 + Zalo 추가

#### 핵심 변경
- 공유 섹션을 **result-header 바로 아래** (감정적 피크 직후)로 이동
- **Zalo 공유 버튼** 추가
- **결과 카드 다운로드 버튼** 추가 (STEP 2-3과 연동)

#### index.html 수정
result-screen 내부 순서 변경:
```
1. result-header (시즌 뱃지 + 이름 + 설명) — 기존 유지
2. share-card ← 여기로 이동 (기존: 하단)
3. axis-card (3축 차트)
4. palette-card
5. makeup-card
6. clothing-card
7. hair-card
8. jewelry-card
9. celeb-card
10. product-card
11. cross-card
12. retake-btn
```

#### share-card HTML 업데이트
```html
<div class="card share-card">
  <h3 class="card-title">📤 Chia sẻ kết quả</h3>
  <div class="share-btns">
    <button class="share-btn facebook-btn" onclick="shareFacebook()">Facebook</button>
    <button class="share-btn zalo-btn" onclick="shareZalo()">Zalo</button>
    <button class="share-btn copy-btn" onclick="copyLink()">🔗 Link</button>
  </div>
  <button class="share-download-btn" id="download-card-btn" onclick="downloadResultCard()">
    📥 Lưu ảnh kết quả
  </button>
</div>
```

#### js/share.js 추가 함수
```javascript
export function shareZalo() {
  const url = encodeURIComponent(getResultUrl());
  const title = encodeURIComponent(`Mình là ${state.currentSeason.name}! Bạn thuộc mùa nào?`);
  window.open(`https://zalo.me/share?url=${url}&title=${title}`, '_blank');
}
```

---

### STEP 2-3: 결과 카드 이미지 생성 (Canvas API)

> 바이럴의 핵심. 이미지 있는 퀴즈 = 공유 확률 40배.

#### `js/result-card.js` (신규 파일)

**카드 사양**:
- 크기: 1200 × 630px (OG 표준, 1.91:1)
- 배경: 시즌별 `gradient` 값
- 내용: 시즌 이모지 + 베트남어 이름 + 영어 이름 + 부제목 + 팔레트 6색 미니 + 사이트 URL
- 출력: PNG (Canvas.toBlob)

```javascript
import { state } from './state.js';

export function generateResultCard() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  const s = state.currentSeason;

  // 1. 배경 그라디언트
  const grad = ctx.createLinearGradient(0, 0, 1200, 630);
  // s.gradient 파싱하여 적용 (CSS gradient → Canvas gradient 변환)
  // 폴백: s.primary → s.light 2-stop
  grad.addColorStop(0, s.primary);
  grad.addColorStop(1, s.light);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 630);

  // 2. 반투명 카드 영역
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  roundRect(ctx, 60, 40, 1080, 550, 24);

  // 3. 브랜드명
  ctx.fillStyle = '#fff';
  ctx.font = '600 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Personal Color Test', 600, 90);

  // 4. 시즌 이모지 (크게)
  ctx.font = '80px serif';
  ctx.fillText(s.emoji, 600, 210);

  // 5. 시즌 이름 (베트남어)
  ctx.font = '800 48px Inter, sans-serif';
  ctx.fillText(s.name, 600, 290);

  // 6. 영어 이름
  ctx.font = '500 28px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(s.enName, 600, 335);

  // 7. 부제목
  ctx.font = '400 22px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillText(s.subtitle, 600, 380);

  // 8. 팔레트 6색 (상위 6개)
  const paletteColors = s.palette.slice(0, 6);
  const swatchSize = 48;
  const gap = 16;
  const totalWidth = paletteColors.length * swatchSize + (paletteColors.length - 1) * gap;
  let startX = (1200 - totalWidth) / 2;
  paletteColors.forEach((color, i) => {
    ctx.fillStyle = color.hex;
    roundRect(ctx, startX + i * (swatchSize + gap), 420, swatchSize, swatchSize, 8);
  });

  // 9. 사이트 URL
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '400 18px Inter, sans-serif';
  ctx.fillText('personal-color-test.pages.dev', 600, 570);

  return canvas;
}

export function downloadResultCard() {
  const canvas = generateResultCard();
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personal-color-${state.currentSeason.key}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// 헬퍼: 둥근 사각형
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}
```

---

### STEP 2-4: 스크롤 애니메이션 (Intersection Observer)

#### js/result.js에 추가
```javascript
// renderResult() 끝에 호출
function initScrollAnimations() {
  const cards = document.querySelectorAll('#result-screen .card');
  cards.forEach(card => card.classList.add('card-hidden'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
}
```

#### css/components.css에 추가
```css
.card-hidden {
  opacity: 0;
  transform: translateY(24px);
}
.card-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
```

---

### STEP 2-5: 어필리에이트 딥링크 전환

#### js/data/seasons.js 제품 데이터 업데이트

현재 products 배열의 url이 Shopee 검색 URL → **제품 페이지 딥링크로 변경**.

```javascript
// 현재:
{ url: "https://shopee.vn/search?keyword=romand+juicy+lasting+tint+09" }

// 변경: (Shopee 어필리에이트 등록 후)
{
  url: "https://shopee.vn/product/...",      // 어필리에이트 딥링크
  fallbackUrl: "https://shopee.vn/search?keyword=romand+juicy+lasting+tint+09",  // 폴백
  reason: "Tông cam san hô tươi — hoàn hảo cho Bright Spring"  // 추천 이유
}
```

> ⚠️ Shopee 어필리에이트 등록 완료 후 실제 딥링크로 교체 필요 (수동 작업)

#### 제품 추천 UI 개선 (js/result.js)

```javascript
function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';

  // 법적 공시 (2026 베트남 광고법)
  const disclosure = document.createElement('p');
  disclosure.className = 'affiliate-disclosure';
  disclosure.textContent = 'Bài viết có chứa liên kết liên kết. Chúng tôi có thể nhận hoa hồng khi bạn mua qua liên kết, không ảnh hưởng đến giá bạn phải trả.';
  grid.appendChild(disclosure);

  state.currentSeason.products.forEach(p => {
    // 제품 카드 생성
    // 추천 이유(reason) 표시
    // 가격 표시
    // CTA: "Xem trên Shopee" (부드러운 톤)
  });
}
```

#### css/screens.css 추가
```css
.affiliate-disclosure {
  font-size: 0.75rem;
  color: var(--subtle);
  padding: 8px 12px;
  background: var(--bg);
  border-radius: 8px;
  margin-bottom: 12px;
  line-height: 1.4;
}
```

---

### STEP 2-6: GA4 이벤트 추적

#### `js/analytics.js` (신규 파일)
```javascript
// GA4 이벤트 전송 래퍼
export function trackEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}
```

#### 추적 이벤트 목록

| 이벤트명 | 트리거 시점 | 파라미터 |
|----------|-----------|---------|
| `quiz_start` | startQuiz() 호출 | `{ method: 'quiz' }` |
| `ai_start` | startAI() 호출 | `{ method: 'ai' }` |
| `quiz_complete` | showLoading() 호출 | `{ question_count: 12 }` |
| `result_view` | renderResult() 호출 | `{ season: key, base: baseseason }` |
| `share_click` | shareFacebook/shareZalo/copyLink | `{ method: 'facebook'/'zalo'/'copy', season: key }` |
| `card_download` | downloadResultCard() | `{ season: key }` |
| `product_click` | 제품 링크 클릭 | `{ season: key, product: name, platform: 'shopee' }` |
| `retake` | retakeQuiz() | `{}` |

#### index.html GA4 활성화
```html
<!-- GA4 placeholder를 실제 코드로 교체 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

> ⚠️ `G-XXXXXXXXXX`는 실제 GA4 측정 ID로 교체 필요 (수동 작업)

---

### STEP 2-7: 미리 작성된 공유 텍스트

#### js/share.js 수정

```javascript
function getShareText() {
  const s = state.currentSeason;
  return `Mình là mùa ${s.name} (${s.enName}) ${s.emoji}\n` +
    `Bảng màu cá nhân toàn tông ${s.subtitle}!\n` +
    `Bạn thuộc mùa nào? Thử ngay 👉`;
}

export function shareFacebook() {
  const url = encodeURIComponent(getResultUrl());
  const quote = encodeURIComponent(getShareText());
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank', 'width=600,height=400');
}
```

---

### STEP 2-8: Phase 2 완료 체크리스트

- [x] 인트로 화면: 소셜 프루프 카운터 추가 ✅ 2026-03-04
- [ ] 공유 버튼이 결과 헤더 바로 아래에 위치 (HTML 순서 변경은 수동 선택)
- [x] Zalo 공유 함수 + HTML 버튼 추가 ✅ 2026-03-04
- [x] 결과 카드 이미지 생성 (1200×630, Canvas API) + 다운로드 ✅ 2026-03-04
- [x] 결과 카드에 시즌별 배경 + 팔레트 색상 ✅ 2026-03-04
- [x] 스크롤 애니메이션: IntersectionObserver + card-visible ✅ 2026-03-04
- [x] 제품 추천: 어필리에이트 디스클로저 표시 ✅ 2026-03-04
- [ ] 제품 추천: 추천 이유 텍스트 표시 (Shopee 어필리에이트 등록 후)
- [x] GA4 이벤트 추적 모듈 (analytics.js) 구현 ✅ 2026-03-04
- [x] 미리 작성된 공유 텍스트 (getShareText) 구현 ✅ 2026-03-04
- [ ] 모바일 반응형 유지 (수동 확인 필요)
- [x] `node test_suite.js` 244 테스트 통과 ✅ 2026-03-04

---

## 5. Phase 3: 고급 기능

> 목표: 체류시간 12-15분, 바이럴 계수 2배, AI 정확도 향상
> 전제: Phase 2 완료 + 트래픽 데이터 확보

### STEP 3-1: 친구 비교 기능

#### `js/comparison.js` (신규 파일)

**기능**:
- 결과 페이지에 "친구와 비교하기" 섹션 추가
- 비교 링크 생성: `#compare=brightspring&with=coolwinter`
- 12×12 = 144개 호환성 매트릭스 (사전 정의)

**호환성 매트릭스 구조**:
```javascript
export const COMPATIBILITY = {
  'brightspring-brightspring': { score: 100, emoji: '💛', comment: 'Hoàn hảo! Cùng mùa, cùng phong cách!' },
  'brightspring-coolwinter': { score: 85, emoji: '✨', comment: 'Tương phản thú vị! Xuân ấm gặp Đông mát tạo nên sự hài hòa bất ngờ.' },
  // ... 144개 조합
};
```

**비교 결과 화면**:
- 두 시즌 나란히 표시
- 호환성 점수 (별점 + 퍼센트)
- 함께 스타일링 팁
- 비교 결과 공유 버튼

#### index.html 추가
```html
<!-- result-screen 내 product-card 아래 -->
<div class="card compare-card">
  <h3 class="card-title">👫 So sánh với bạn bè</h3>
  <p class="compare-desc">Gửi link cho bạn bè, sau khi họ làm xong bạn sẽ thấy kết quả so sánh!</p>
  <button class="cta-btn compare-link-btn" onclick="generateCompareLink()">🔗 Tạo link so sánh</button>
  <div class="compare-manual">
    <p>Hoặc nhập mùa của bạn bè:</p>
    <select id="compare-season-select">
      <!-- 12시즌 옵션 동적 생성 -->
    </select>
    <button class="share-btn" onclick="showComparison()">So sánh</button>
  </div>
</div>
```

---

### STEP 3-2: AI 분석 엔진 업그레이드

> 현재: Canvas 픽셀 샘플링 (추정 영역) → HSL 분석
> 목표: MediaPipe Face Mesh → CIELAB → Von Kries 보정 → 한국식 캘리브레이션

#### Phase 3-2a: MediaPipe Face Mesh 도입

**CDN 로드**:
```html
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js" crossorigin="anonymous"></script>
```

**js/ai-analysis.js 수정**:
```javascript
// 현재 extractFaceColors (추정 타원 영역 샘플링)
// → MediaPipe 478 랜드마크 기반 정확한 영역 샘플링

async function initFaceLandmarker() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    },
    outputFaceBlendshapes: false,
    runningMode: "IMAGE",
    numFaces: 1,
  });
}

function extractFaceColorsWithLandmarks(imageData, width, height, landmarks) {
  // 이마: landmarks [10, 338, 297, 332, 284, 251, 21, 54, 103, 67, 109]
  // 왼쪽 볼: landmarks [187, 123, 50, 36, 137, 216, 206, 203, 142, 126]
  // 오른쪽 볼: landmarks [411, 352, 280, 266, 371, 436, 426, 423, 358, 355]
  // 홍채: landmarks [468-472] (왼), [473-477] (오)

  // 각 랜드마크 주변 5×5 픽셀 샘플링 → 평균
  // 피부 = (이마 + 볼) 평균
  // 눈 = 홍채 영역
  // 머리 = 이마 위 영역 (랜드마크 10 기준 위로 offset)
}
```

#### Phase 3-2b: RGB → CIELAB 변환

```javascript
// js/ai-analysis.js에 추가

function rgbToLab(r, g, b) {
  // Step 1: sRGB → Linear RGB
  let rl = r / 255, gl = g / 255, bl = b / 255;
  rl = rl > 0.04045 ? Math.pow((rl + 0.055) / 1.055, 2.4) : rl / 12.92;
  gl = gl > 0.04045 ? Math.pow((gl + 0.055) / 1.055, 2.4) : gl / 12.92;
  bl = bl > 0.04045 ? Math.pow((bl + 0.055) / 1.055, 2.4) : bl / 12.92;

  // Step 2: Linear RGB → XYZ (D65)
  let x = 0.4124564 * rl + 0.3575761 * gl + 0.1804375 * bl;
  let y = 0.2126729 * rl + 0.7151522 * gl + 0.0721750 * bl;
  let z = 0.0193339 * rl + 0.1191920 * gl + 0.9503041 * bl;

  // Step 3: XYZ → CIELAB
  x /= 0.95047; y /= 1.0; z /= 1.08883;
  const f = t => t > 0.008856 ? Math.pow(t, 1/3) : (903.3 * t + 16) / 116;
  const L = 116 * f(y) - 16;
  const a = 500 * (f(x) - f(y));
  const bStar = 200 * (f(y) - f(z));
  return { L, a, b: bStar };
}

function calculateITA(L, b) {
  return Math.atan2(L - 50, b) * (180 / Math.PI);
}
```

#### Phase 3-2c: Von Kries 조명 보정

```javascript
function vonKriesCorrect(pixel, estimatedWhite) {
  // 목표 화이트포인트: D65 (255, 255, 255)
  const targetWhite = { r: 255, g: 255, b: 255 };
  return {
    r: Math.min(255, Math.round(pixel.r * (targetWhite.r / Math.max(1, estimatedWhite.r)))),
    g: Math.min(255, Math.round(pixel.g * (targetWhite.g / Math.max(1, estimatedWhite.g)))),
    b: Math.min(255, Math.round(pixel.b * (targetWhite.b / Math.max(1, estimatedWhite.b))))
  };
}

// 화이트포인트 추정: Gray World 알고리즘
function estimateWhitePoint(imageData) {
  let rSum = 0, gSum = 0, bSum = 0, count = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    rSum += imageData.data[i];
    gSum += imageData.data[i + 1];
    bSum += imageData.data[i + 2];
    count++;
  }
  const avgR = rSum / count, avgG = gSum / count, avgB = bSum / count;
  const gray = (avgR + avgG + avgB) / 3;
  return {
    r: avgR > 0 ? (gray / avgR) * 255 : 255,
    g: avgG > 0 ? (gray / avgG) * 255 : 255,
    b: avgB > 0 ? (gray / avgB) * 255 : 255
  };
}
```

#### Phase 3-2d: 한국식 캘리브레이션

```javascript
function analyzeColorsToScoresV2(skinLab, hairLab, eyeLab) {
  // temp (언더톤): b* 기반
  // 동아시아 피부 b* 기준치: 18 (유럽: ~15)
  let temp = 0;
  if (skinLab.b > 18) temp += 2;      // warm
  else if (skinLab.b < 12) temp -= 2;  // cool
  // + 입술 a* 값으로 보정

  // depth (명도): ITA 기반
  const ita = calculateITA(skinLab.L, skinLab.b);
  let depth = itaToDepthScore(ita);
  // 머리카락/눈 L* 가중 반영 (피부 45% + 머리 35% + 눈 20%)

  // clarity (청탁도): 피부-머리 L* 차이 + chroma
  const contrast = Math.abs(skinLab.L - hairLab.L);
  const chroma = Math.sqrt(skinLab.a ** 2 + skinLab.b ** 2);
  let clarity = 0;
  if (contrast > 15 && chroma > 20) clarity += 2;  // clear
  else if (contrast < 8 && chroma < 15) clarity -= 2;  // soft

  return { temp, depth, clarity };
}
```

---

### STEP 3-3: 이메일 소프트 게이트

> 결과 기본 공개 (시즌명 + 공유 가능), 상세 정보(팔레트/메이크업/의상) 게이트
> 전환율 목표: 30-50%

#### 구현 방식
1. 결과 헤더 + 공유 카드: **무조건 공개** (공유/바이럴 우선)
2. 3축 차트: **무조건 공개** (호기심 유발)
3. 상세 섹션 (팔레트, 메이크업, 의상, 헤어, 주얼리, 셀럽, 제품): **블러 처리** + 이메일 입력 프롬프트
4. 이메일 제출 또는 "건너뛰기" 시 전체 공개

```html
<div class="email-gate" id="email-gate">
  <div class="email-gate-inner">
    <h3>📧 Nhận kết quả chi tiết</h3>
    <p>Nhập email để xem bảng màu, gợi ý makeup và phong cách hoàn chỉnh!</p>
    <input type="email" id="gate-email" placeholder="your@email.com">
    <button class="cta-btn" onclick="submitEmailGate()">Xem kết quả chi tiết</button>
    <button class="skip-btn" onclick="skipEmailGate()">Bỏ qua →</button>
  </div>
</div>
```

---

### STEP 3-4: Phase 3 완료 체크리스트

- [x] 친구 비교 기능 (comparison.js): compareWithFriend, renderComparison, getSeasonOptions ✅ 2026-03-04
- [x] 호환성 매트릭스 자동 생성 (buildCompatMatrix — 12×12 = 144 조합) ✅ 2026-03-04
- [x] 비교 HTML 요소 (compare-card, compare-picker, compare-result) ✅ 2026-03-04
- [ ] MediaPipe Face Mesh 로드 및 랜드마크 감지 동작 (CDN 의존, 향후 적용)
- [ ] CIELAB 변환 정확도 검증 (향후 적용)
- [ ] Von Kries 조명 보정 동작 (향후 적용)
- [ ] ITA 계산 및 depth 점수 매핑 (향후 적용)
- [ ] 한국식 캘리브레이션 임계값 적용 (향후 적용)
- [ ] AI 분석 결과가 기존보다 합리적인지 검증 (향후 적용)
- [ ] 이메일 게이트 동작 (향후 적용)
- [ ] 이메일 게이트 후 상세 섹션 표시 (향후 적용)
- [ ] 모바일 반응형 유지 (수동 확인 필요)
- [x] `node test_suite.js` 244 테스트 통과 ✅ 2026-03-04

---

## 6. 테스트 전략

### 6-1. 자동 테스트 (test_suite.js)

| 카테고리 | 현재 테스트 수 | Phase 1 목표 | Phase 2 목표 |
|---------|-------------|-------------|-------------|
| 데이터 무결성 (QUESTIONS) | ~20 | 20 | 20 |
| 데이터 무결성 (SEASONS) | ~60 | 60 | 60 |
| 12시즌 도달 가능성 | ~20 | 20 | 20 |
| 서브타입 로직 | ~30 | 30 | 30 |
| AI 분석 | ~20 | 20 | 30 (+CIELAB/ITA) |
| DOM/CSS 일관성 | ~30 | 40 (+모듈 import 검증) | 50 (+공유/카드) |
| URL 공유/복원 | ~10 | 10 | 15 (+Zalo/비교) |
| **합계** | **202** | **~210** | **~240** |

### 6-2. 수동 테스트 체크리스트

#### 브라우저 테스트
- [ ] Chrome (최신) — 데스크톱
- [ ] Chrome (최신) — 모바일 (DevTools 에뮬레이션)
- [ ] Safari (iOS) — 실기기 또는 에뮬레이터
- [ ] Firefox — 데스크톱

#### 기능 테스트
- [ ] 인트로 → AI 트랙 → 카메라 → 캡처 → 분석 → 결과
- [ ] 인트로 → AI 트랙 → 업로드 → 분석 → 결과
- [ ] 인트로 → 퀴즈 12문항 → 로딩 → 결과
- [ ] 퀴즈 뒤로가기 (goBack) 각 문항에서 동작
- [ ] 12시즌 전체 도달 확인 (점수 조합별)
- [ ] URL hash 공유 후 새 탭에서 복원
- [ ] Facebook 공유 다이얼로그 열림
- [ ] Zalo 공유 다이얼로그 열림 [Phase 2]
- [ ] 링크 복사 → 붙여넣기 확인
- [ ] 결과 카드 이미지 다운로드 [Phase 2]
- [ ] 다시하기 → 인트로로 복귀

#### 반응형 테스트
- [ ] 360px 너비 (소형 안드로이드)
- [ ] 375px 너비 (iPhone SE)
- [ ] 390px 너비 (iPhone 14)
- [ ] 768px 너비 (태블릿)
- [ ] 1024px+ (데스크톱)

---

## 7. 배포 체크리스트

### 7-1. 사전 조건 (수동 작업)

| 항목 | 상태 | 담당 |
|------|------|------|
| GitHub Secrets: `CLOUDFLARE_API_TOKEN` | 미설정 | 사용자 |
| GitHub Secrets: `CLOUDFLARE_ACCOUNT_ID` | 미설정 | 사용자 |
| GA4 측정 ID (G-XXXXXXXXXX) | 미생성 | 사용자 |
| Shopee 어필리에이트 등록 | 미완료 | 사용자 |
| Shopee 제품 딥링크 생성 (12시즌 × 3-4개) | 미완료 | 사용자 |

### 7-2. 배포 순서

```
1. Phase 1 완료 → 로컬 검증 → git push → GitHub Actions → Cloudflare Pages
2. Phase 2 완료 → 로컬 검증 → git push → 자동 배포
3. 배포 후: GA4 실시간 데이터 확인
4. 배포 후: OG 이미지 검증 (Facebook Sharing Debugger, Twitter Card Validator)
5. 배포 후: Lighthouse 성능 측정 (목표: Performance 90+, SEO 100)
```

### 7-3. .github/workflows/deploy.yml 변경 사항

변경 불필요. 현재 설정은 전체 디렉토리를 Cloudflare Pages에 배포하므로 새 `css/`, `js/` 디렉토리도 자동 포함.

---

## 전체 작업 요약

| Phase | 주요 작업 | 신규/수정 파일 | 핵심 성과 |
|-------|----------|--------------|----------|
| **1** | 모듈화 | css/ 4, js/ 8, index.html, test_suite.js | 유지보수성, 기능 동일 |
| **2** | 바이럴+수익화 | js/result-card.js, js/analytics.js, share.js 수정, index.html 수정 | 공유율 4배↑, GA4 추적, 어필리에이트 시작 |
| **3** | 고급 기능 | js/comparison.js, ai-analysis.js 대규모 수정 | AI 정확도↑, 바이럴 계수 2배, 이메일 수집 |

---

## 구현 시 절대 규칙

1. **빌드 도구/번들러 도입 금지** — Vanilla JS + ES Modules
2. **배포 금지** — 사용자 지시 전까지 로컬 작업만
3. **기존 기능 훼손 금지** — 각 Phase 완료 시 모든 기존 테스트 통과
4. **과잉 엔지니어링 금지** — 필요한 최소한만 구현
5. **Phase 순서 준수** — Phase 1 완료 없이 Phase 2 시작 금지
