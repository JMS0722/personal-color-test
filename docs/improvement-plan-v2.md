# Personal Color Test — 완성도 향상 계획서 v2

> 작성일: 2026-03-05
> 목적: 실제 퍼스널컬러 진단 서비스 사용자 니즈 분석 + 현재 프로젝트 갭 분석 + 구현 가능한 개선안 종합

---

## 목차

1. [현재 구현 상태 요약](#1-현재-구현-상태-요약)
2. [실제 사용자 니즈 조사](#2-실제-사용자-니즈-조사)
3. [갭 분석: 현재 vs 사용자 기대](#3-갭-분석-현재-vs-사용자-기대)
4. [개선안 상세](#4-개선안-상세)
5. [구현 우선순위 및 로드맵](#5-구현-우선순위-및-로드맵)
6. [기대 효과](#6-기대-효과)

---

## 1. 현재 구현 상태 요약

### ✅ 완료된 기능

| 카테고리 | 기능 | 상태 |
|----------|------|------|
| **코어** | 12시즌 시스템 (2단계 판정) | ✅ |
| **코어** | AI 사진 분석 (카메라 + 업로드) | ✅ |
| **코어** | 12문항 퀴즈 | ✅ |
| **결과** | 시즌 헤더 (이모지, 이름, 설명) | ✅ |
| **결과** | 3축 바 차트 (Cool↔Warm, Dark↔Light, Soft↔Clear) | ✅ |
| **결과** | 12색 팔레트 + 6색 피해야 할 색 | ✅ |
| **결과** | 메이크업 가이드 (4카테고리) | ✅ |
| **결과** | 의상 색상 가이드 (5카테고리) | ✅ |
| **결과** | 헤어 컬러 추천 (4가지) | ✅ |
| **결과** | 주얼리/액세서리 추천 | ✅ |
| **결과** | 같은 시즌 셀러브리티 (6명) | ✅ |
| **결과** | 제품 추천 + 어필리에이트 공시 | ✅ |
| **공유** | Facebook / Zalo / 링크 복사 | ✅ |
| **공유** | Canvas 결과 카드 이미지 다운로드 (1200×630) | ✅ |
| **공유** | URL hash 공유/복원 | ✅ |
| **바이럴** | 친구 비교 (12×12 호환성) | ✅ |
| **바이럴** | 참가자 카운터 (소셜 프루프) | ✅ |
| **효과** | Confetti 축하 애니메이션 | ✅ |
| **효과** | 스크롤 애니메이션 (IntersectionObserver) | ✅ |
| **효과** | 결과 헤더 시차 애니메이션 | ✅ |
| **추적** | GA4 이벤트 스텁 (태그 ID 미설정) | ✅ 스텁 |
| **인프라** | ES Module 구조 (11개 파일) | ✅ |
| **인프라** | GitHub Actions 자동 배포 | ✅ |

### ✅ Phase 2.5-2.7 구현 완료 (2026-03-05)

| 카테고리 | 기능 | 상태 |
|----------|------|------|
| 신뢰도 | 퍼센트 기반 신뢰도 / 보조 시즌 표시 (A1) | ✅ 완료 |
| 시각화 | 디지털 드레이핑 시뮬레이션 | ❌ Phase 3 |
| 팔레트 | Hex 코드 복사 기능 (A2) | ✅ 완료 |
| 팔레트 | 폰 배경화면용 팔레트 이미지 (B3) | ✅ 완료 |
| 교육 | "왜 이 시즌인가" 설명 섹션 (A3) | ✅ 완료 |
| 교육 | 인접 시즌 가이드 (A4) | ✅ 완료 |
| 교육 | Best vs Worst 색상 비교 (B2) | ✅ 완료 |
| 저장 | 결과 로컬 저장 + 복귀 (A5) | ✅ 완료 |
| 카드 | Instagram Story 세로형 카드 (B1) | ✅ 완료 |
| 결과 | 네일 컬러 추천 (B4) | ✅ 완료 |
| 결과 | 시즌 스토리텔링 (A3) | ✅ 완료 |
| 교육 | 3축 교육 카드 (B5) | ✅ 완료 |
| AI | MediaPipe / CIELAB 업그레이드 | ❌ Phase 3 |
| 수익 | 이메일 수집 (소프트 게이트) | ❌ Phase 3 |
| 수익 | GA4 실제 태그 연결 | ❌ Phase 3 |

---

## 2. 실제 사용자 니즈 조사

### 2-1. 시장 현황

- **한국**: MZ세대(15-25세) 71%가 퍼스널컬러 서비스 이용. MBTI처럼 사회적 정체성 레이블로 정착
- **베트남**: 월 18,100건+ 검색. K-뷰티 영향으로 급성장. 전문 진단 서비스 "항상 예약 마감" → 미충족 수요 거대
- **글로벌**: TikTok #coloranalysis 7.5억+ 조회. 드레이핑 필터가 바이럴 → 경험형 콘텐츠 수요

### 2-2. 사용자가 가장 원하는 것 (우선순위)

| 순위 | 니즈 | 설명 | 근거 |
|------|------|------|------|
| 1 | **"이 결과로 뭘 해야 해?"** | 시즌 레이블만으로는 부족. 즉시 실행 가능한 제품명, 쇼핑 링크, 코디 아이디어 필요 | 무료 테스트 공통 불만 1위 |
| 2 | **신뢰도 / 보조 시즌** | "나는 정확히 어디쯤인가?" — 퍼센트 분해 (72% Light Summer, 28% Soft Summer) + 인접 시즌 착용 가이드 | Vivaldi Color Lab, ColorLover 등 인기 앱 핵심 기능 |
| 3 | **공유 가능한 예쁜 카드** | Instagram Story(9:16)용 세로형 + 가로형(OG) 모두. 브랜디드, 팔레트 포함 | "이미지 있는 퀴즈 = 공유 확률 40배" |
| 4 | **색상 시각화** | 내 사진에 색상을 입혀보기 (드레이핑 시뮬). 또는 Best vs Worst 색상 비교 | 대면 진단과 온라인의 가장 큰 차이. TikTok 필터 7.5억 조회 |
| 5 | **교육 콘텐츠** | "왜 이 시즌인가", 축 의미 설명, 인접 시즌과의 차이 | 전문 상담의 핵심 가치. 무료 테스트에 부재 |
| 6 | **다운로드 가능한 팔레트** | Hex 코드 포함, 쇼핑 시 참고용. 폰 배경화면, 지갑 사이즈 | 사용자가 반복적으로 참조하는 핵심 자산 |
| 7 | **저장 & 프로필** | 결과를 저장하고 나중에 다시 보기. 재방문 유도 | 대부분 무료 테스트가 one-shot, 지속성 부재 |
| 8 | **남성 고려** | 성별 중립적 UI/추천. 한국 남성 뷰티 시장 1.1조원, 연 20% 성장 | 대부분 서비스가 여성 중심으로 설계됨 |

### 2-3. 사용자가 결과를 활용하는 방식

```
1. 화장품 쇼핑 시 → 팔레트 hex 코드 대조 (이것이 주 활용)
2. 의류 쇼핑 시 → 저장된 팔레트 이미지 참고
3. 미용실 방문 시 → 헤어 컬러 추천 결과 제시
4. 옷장 정리 시 → 기존 옷을 팔레트와 대조
5. SNS 프로필 → "나는 Cool Summer" 정체성 표현
6. 친구와 대화 → 비교 기능으로 호환성 확인
```

### 2-4. 온라인 테스트 vs 대면 진단 불만 포인트

| 불만 | 설명 | 우리가 할 수 있는 대응 |
|------|------|----------------------|
| **조명/사진 품질** | 같은 사람도 사진마다 다른 결과 | 조명 가이드 강화, Von Kries 보정(Phase 3) |
| **주관적 자가 평가** | "내 피부가 따뜻한지 차가운지 모르겠다" | AI 분석 트랙 강조, 퀴즈에 시각적 보조 추가 |
| **단일 결과의 불확실** | "정말 이 시즌 맞나?" | **퍼센트 신뢰도 + 보조 시즌 표시** |
| **결과의 피상성** | 레이블만 주고 "왜"를 설명 안 함 | **시즌 스토리텔링 + 교육 섹션** |
| **실용성 부족** | "그래서 뭘 사야 해?" | 제품 딥링크 + hex 코드 + 쇼핑 가이드 |
| **드레이핑 체험 불가** | 색감 차이를 직접 느끼지 못함 | **Best vs Worst 비교 + 팔레트 오버레이** |

### 2-5. 경쟁 서비스 벤치마크

| 서비스 | 핵심 차별점 | 우리에게 적용 가능한 것 |
|--------|-----------|---------------------|
| **Vivaldi Color Lab** | 퍼센트 기반 결과 (인접 시즌 포함) | ✅ 신뢰도 퍼센트 표시 |
| **Dressika** | 170 메이크업 쉐이드 + 180 헤어 컬러 AR | △ AR은 어려움, 색상 가이드 확장은 가능 |
| **ColorLover (컬러버)** | 2,500명 데이터 기반 90%+ 정확도 | △ 데이터 확보 어려움, AI 알고리즘 개선은 가능 |
| **iColor (아이컬러)** | 25,000개 화장품 DB | △ 규모 불가, 시즌별 핵심 제품 큐레이션은 가능 |
| **K-Test 컬러 성격** | 호환성 비교 → 200만 참여 | ✅ 이미 구현 (비교 기능) |
| **Palette Hunt** | 셀럽 디렉토리 | ✅ 이미 구현 (6명/시즌) |
| **Klook 대면 진단** | 150-200개 PANTONE 드레이프 | △ 디지털 드레이핑으로 대체 가능 |

---

## 3. 갭 분석: 현재 vs 사용자 기대

### 3-1. 높은 영향 + 낮은 구현 난이도 (Quick Wins)

| # | 개선안 | 영향 | 난이도 | 설명 |
|---|--------|------|--------|------|
| A1 | **퍼센트 신뢰도 + 보조 시즌** | ⭐⭐⭐⭐⭐ | 낮음 | 3축 점수를 12시즌 친화도 퍼센트로 변환. "72% Light Summer · 28% Soft Summer" |
| A2 | **Hex 코드 복사 기능** | ⭐⭐⭐ | 매우 낮음 | 팔레트 스와치 클릭 → hex 코드 클립보드 복사 + 토스트 피드백 |
| A3 | **시즌 스토리텔링 섹션** | ⭐⭐⭐⭐ | 낮음 | 인구 비율, 시즌 특성 설명, "왜 이 시즌인가" 교육 콘텐츠 |
| A4 | **인접 시즌 가이드** | ⭐⭐⭐⭐ | 낮음 | "Light Summer 당신은 Soft Summer 색상도 일부 소화 가능" + 인접 팔레트 미니 표시 |
| A5 | **결과 로컬 저장** | ⭐⭐⭐ | 매우 낮음 | localStorage에 결과 저장 → 재방문 시 자동 복원 |

### 3-2. 높은 영향 + 중간 난이도

| # | 개선안 | 영향 | 난이도 | 설명 |
|---|--------|------|--------|------|
| B1 | **Instagram Story 세로형 카드 (1080×1920)** | ⭐⭐⭐⭐⭐ | 중간 | 9:16 비율 카드. 시즌명 + 팔레트 + 3축 차트. TikTok/IG Story 최적화 |
| B2 | **Best vs Worst 색상 비교** | ⭐⭐⭐⭐ | 중간 | 추천색 vs 피해색을 나란히 시각적으로 비교. "이 색을 입으면 피부가 밝아 보입니다" vs "이 색은 피부를 칙칙하게 만듭니다" |
| B3 | **폰 배경화면 팔레트** | ⭐⭐⭐⭐ | 중간 | 1080×1920 배경화면용 팔레트 이미지 생성 + 다운로드. 쇼핑 시 즉시 참조 |
| B4 | **네일 컬러 추천** | ⭐⭐⭐ | 낮음 | 시즌별 4가지 네일 컬러 추천 (현재 누락) |
| B5 | **시즌 교육 카드: 3축 의미 설명** | ⭐⭐⭐⭐ | 낮음 | "Cool↔Warm은 언더톤, Dark↔Light은 명도, Soft↔Clear는 채도" 인포그래픽 |

### 3-3. 높은 영향 + 높은 난이도 (장기)

| # | 개선안 | 영향 | 난이도 | 설명 |
|---|--------|------|--------|------|
| C1 | **디지털 드레이핑 시뮬레이션** | ⭐⭐⭐⭐⭐ | 높음 | 사용자 사진 위에 색상 오버레이. 추천색/피해색 비교 |
| C2 | **AI 엔진 업그레이드 (CIELAB + MediaPipe)** | ⭐⭐⭐⭐ | 높음 | 기존 HSL → CIELAB + ITA + Von Kries 보정 |
| C3 | **이메일 소프트 게이트** | ⭐⭐⭐ | 중간 | 기본 결과 무료, 상세 결과 이메일 입력 후 공개 |
| C4 | **"내 옷장 컬러 체크"** | ⭐⭐⭐⭐ | 높음 | 카메라로 옷 촬영 → 내 팔레트와 매칭도 표시 |

---

## 4. 개선안 상세

### A1. 퍼센트 신뢰도 + 보조 시즌

**사용자 니즈**: "정말 이 시즌 맞나?" 불확실성 해소
**벤치마크**: Vivaldi Color Lab — 인접 시즌 퍼센트 표시

#### 구현 방식

현재 `scoring.js`의 `getBaseSeason()`은 4계절 친화도를 계산하고 가장 높은 것을 선택.
이 친화도 값을 12시즌 단위로 확장하여 퍼센트로 변환.

```javascript
// js/scoring.js에 추가
export function getSeasonConfidence(scores) {
  const { temp, depth, clarity } = scores;

  // 12시즌 각각에 대한 친화도 점수 계산
  const affinities = {};
  const seasonDefs = {
    brightspring:  { temp: 1, depth: 1, clarity: 1, dominant: 'clarity' },
    lightspring:   { temp: 1, depth: 1, clarity: 0, dominant: 'depth' },
    warmspring:    { temp: 1, depth: 0, clarity: 0, dominant: 'temp' },
    lightsummer:   { temp: -1, depth: 1, clarity: 0, dominant: 'depth' },
    coolsummer:    { temp: -1, depth: 0, clarity: 0, dominant: 'temp' },
    softsummer:    { temp: -1, depth: 0, clarity: -1, dominant: 'clarity' },
    softautumn:    { temp: 1, depth: -1, clarity: -1, dominant: 'clarity' },
    warmautumn:    { temp: 1, depth: -1, clarity: 0, dominant: 'temp' },
    deepautumn:    { temp: 1, depth: -1, clarity: 0, dominant: 'depth' },
    deepwinter:    { temp: -1, depth: -1, clarity: 0, dominant: 'depth' },
    coolwinter:    { temp: -1, depth: -1, clarity: 0, dominant: 'temp' },
    brightwinter:  { temp: -1, depth: 0, clarity: 1, dominant: 'clarity' },
  };

  for (const [key, def] of Object.entries(seasonDefs)) {
    let score = 0;
    score += temp * def.temp;       // 언더톤 일치
    score += depth * def.depth;     // 명도 일치
    score += clarity * def.clarity; // 채도 일치
    affinities[key] = Math.max(0, score);
  }

  // 소프트맥스로 퍼센트 변환
  const total = Object.values(affinities).reduce((a, b) => a + b, 0) || 1;
  const percentages = {};
  for (const [key, val] of Object.entries(affinities)) {
    percentages[key] = Math.round((val / total) * 100);
  }

  // 상위 3개 추출
  const sorted = Object.entries(percentages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return {
    primary: { key: sorted[0][0], percent: sorted[0][1] },
    secondary: sorted[1] ? { key: sorted[1][0], percent: sorted[1][1] } : null,
    tertiary: sorted[2] ? { key: sorted[2][0], percent: sorted[2][1] } : null,
  };
}
```

#### UI 표시

결과 헤더 아래에 추가:

```html
<div class="confidence-bar">
  <div class="confidence-primary">
    <span class="confidence-emoji">🌸</span>
    <span class="confidence-name">Xuân Sáng</span>
    <div class="confidence-fill" style="width: 72%"></div>
    <span class="confidence-pct">72%</span>
  </div>
  <div class="confidence-secondary">
    <span class="confidence-emoji">🌊</span>
    <span class="confidence-name">Hạ Dịu</span>
    <div class="confidence-fill" style="width: 28%"></div>
    <span class="confidence-pct">28%</span>
  </div>
</div>
<p class="confidence-tip">
  💡 Bạn cũng có thể thử các màu thuộc mùa Hạ Dịu (Soft Summer)
</p>
```

#### 수정 파일
- `js/scoring.js`: `getSeasonConfidence()` 추가
- `js/result.js`: `renderConfidence()` 추가 (헤더 아래)
- `css/screens.css`: `.confidence-bar`, `.confidence-fill` 스타일

---

### A2. Hex 코드 복사 기능

**사용자 니즈**: 쇼핑 시 색상 코드 참조

#### 구현

```javascript
// js/result.js의 renderPalette() 수정
// 팔레트 스와치에 클릭 이벤트 추가
swatch.addEventListener('click', () => {
  navigator.clipboard.writeText(color.hex).then(() => {
    showToast(`Đã sao chép: ${color.hex}`);
  });
});
```

#### UI

- 스와치 hover 시 hex 코드 표시 (이미 구현)
- 스와치 **클릭** 시 클립보드 복사 + 토스트 메시지 "Đã sao chép: #FF6B9D"
- 모바일: 탭 시 동일 동작

#### 수정 파일
- `js/result.js`: 클릭 이벤트 + 토스트
- `css/components.css`: `.toast` 스타일 (없으면 추가)

---

### A3. 시즌 스토리텔링 섹션

**사용자 니즈**: "왜 이 시즌인가" 교육 + 흥미 유발

#### 콘텐츠 구조

```
┌──────────────────────────────────────┐
│ 💡 Về mùa màu của bạn               │
│                                      │
│ Bạn thuộc nhóm Xuân Sáng — chiếm    │
│ khoảng 8% dân số.                    │
│                                      │
│ Người Xuân Sáng nổi bật với sự      │
│ tươi sáng tự nhiên. Tông da ấm      │
│ áp kết hợp với độ tương phản cao    │
│ tạo nên vẻ đẹp rực rỡ...           │
│                                      │
│ ✨ Đặc trưng:                        │
│ • Tông ấm với độ sáng cao           │
│ • Tương phản mạnh giữa da và tóc   │
│ • Rực rỡ nhất với màu sắc sống động│
└──────────────────────────────────────┘
```

#### 데이터 추가 (js/data/seasons.js)

```javascript
// 각 시즌에 추가
brightspring: {
  // 기존 필드...
  populationPercent: 8,
  story: 'Người Xuân Rực Rỡ nổi bật với sự tươi sáng tự nhiên...',
  traits: [
    'Tông ấm với độ sáng cao',
    'Tương phản mạnh giữa da và tóc',
    'Rực rỡ nhất với màu sắc sống động'
  ],
}
```

#### 수정 파일
- `js/data/seasons.js`: 각 시즌에 `populationPercent`, `story`, `traits` 추가
- `js/result.js`: `renderStory()` 함수 추가 (3축 차트 아래 배치)
- `css/screens.css`: `.story-card` 스타일

---

### A4. 인접 시즌 가이드

**사용자 니즈**: 경계선 결과 사용자를 위한 유연한 가이드

#### 구현 방식

12시즌 순환 관계를 정의하고, 현재 시즌에서 가장 가까운 2개 시즌의 "차용 가능한 색" 표시.

```javascript
// js/data/seasons.js에 추가
export const ADJACENT_SEASONS = {
  brightspring: ['warmspring', 'brightwinter'],
  lightspring:  ['lightsummer', 'warmspring'],
  warmspring:   ['warmautumn', 'brightspring'],
  lightsummer:  ['lightspring', 'coolsummer'],
  coolsummer:   ['coolwinter', 'softsummer'],
  softsummer:   ['softautumn', 'lightsummer'],
  softautumn:   ['softsummer', 'warmautumn'],
  warmautumn:   ['warmspring', 'deepautumn'],
  deepautumn:   ['deepwinter', 'warmautumn'],
  deepwinter:   ['deepautumn', 'coolwinter'],
  coolwinter:   ['coolsummer', 'brightwinter'],
  brightwinter: ['brightspring', 'coolwinter'],
};
```

#### UI

```
┌──────────────────────────────────────┐
│ 🔄 Mùa lân cận                      │
│                                      │
│ Bạn cũng có thể sử dụng một số     │
│ màu từ các mùa lân cận:            │
│                                      │
│ 🌸 Xuân Ấm (Warm Spring)           │
│ ┌──┐┌──┐┌──┐ ← 3색 미니 팔레트     │
│                                      │
│ ❄️ Đông Rực Rỡ (Bright Winter)      │
│ ┌──┐┌──┐┌──┐ ← 3색 미니 팔레트     │
│                                      │
│ Tip: Dùng màu lân cận làm điểm     │
│ nhấn, giữ màu chính làm nền!       │
└──────────────────────────────────────┘
```

#### 수정 파일
- `js/data/seasons.js`: `ADJACENT_SEASONS` 추가
- `js/result.js`: `renderAdjacentSeasons()` 추가
- `css/screens.css`: `.adjacent-card`, `.mini-palette` 스타일

---

### A5. 결과 로컬 저장

**사용자 니즈**: 재방문 시 결과 바로 보기, 반복 퀴즈 방지

#### 구현

```javascript
// js/result.js — renderResult() 끝에
function saveResult() {
  const data = {
    seasonKey: state.currentSeason.key,
    scores: { ...state.scores },
    timestamp: Date.now(),
  };
  localStorage.setItem('pct_result', JSON.stringify(data));
}

// js/app.js — DOMContentLoaded에 추가
function checkSavedResult() {
  const saved = localStorage.getItem('pct_result');
  if (saved && !window.location.hash.includes('result=')) {
    const data = JSON.parse(saved);
    const daysSince = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
    if (daysSince < 30) {
      // 인트로 화면에 "이전 결과 보기" 버튼 표시
      showSavedResultBanner(data);
    }
  }
}
```

#### UI

인트로 화면 하단에 배너:

```
┌──────────────────────────────────────┐
│ 🌸 Bạn đã làm bài test trước đây!  │
│                                      │
│ Kết quả: Xuân Rực Rỡ (Bright Spring)│
│                                      │
│ [Xem lại kết quả]  [Làm lại bài test]│
└──────────────────────────────────────┘
```

#### 수정 파일
- `js/result.js`: `saveResult()` 추가
- `js/app.js`: `checkSavedResult()`, `showSavedResultBanner()` 추가
- `css/screens.css`: `.saved-result-banner` 스타일

---

### B1. Instagram Story 세로형 카드 (1080×1920)

**사용자 니즈**: TikTok/IG Story 공유에 최적화된 세로 이미지

#### Canvas 레이아웃

```
┌─────────────────────┐  1080 × 1920
│                     │
│  Personal Color     │  ← 브랜드
│  Test               │
│                     │
│       🌸            │  ← 이모지 (120px)
│                     │
│  Xuân Rực Rỡ       │  ← 시즌명 (52px)
│  Bright Spring      │  ← 영어명 (28px)
│                     │
│  "Rực rỡ —         │  ← 부제목
│   Tươi sáng"       │
│                     │
│  ┌───────────────┐  │
│  │ Cool ■■■■□ Warm│  │  ← 3축 미니 바
│  │ Dark □□■■■ Light│  │
│  │ Soft □□□■■ Clear│  │
│  └───────────────┘  │
│                     │
│  ┌──┐┌──┐┌──┐┌──┐  │  ← 팔레트
│  │  ││  ││  ││  │  │     2행 × 4열
│  ┌──┐┌──┐┌──┐┌──┐  │
│  │  ││  ││  ││  │  │
│  └──┘└──┘└──┘└──┘  │
│                     │
│  Bạn thuộc mùa nào?│  ← CTA
│  Thử ngay miễn phí!│
│                     │
│  [URL]              │  ← 사이트 URL
└─────────────────────┘
```

#### 구현

```javascript
// js/result-card.js에 추가
export function generateStoryCard() {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  // ... 렌더링 로직
  return canvas;
}

export function downloadStoryCard() {
  const canvas = generateStoryCard();
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personal-color-story-${state.currentSeason.key}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
```

#### 다운로드 UI

기존 "📥 Lưu ảnh kết quả" 버튼을 드롭다운으로 변경:

```
[📥 Lưu ảnh ▼]
  ├── 🖼️ Ảnh ngang (Facebook/Zalo)     ← 기존 1200×630
  ├── 📱 Ảnh dọc (Story/TikTok)         ← 새 1080×1920
  └── 🎨 Bảng màu nền điện thoại        ← B3 배경화면
```

#### 수정 파일
- `js/result-card.js`: `generateStoryCard()`, `downloadStoryCard()` 추가
- `js/share.js`: 다운로드 옵션 UI 업데이트
- `index.html`: 다운로드 드롭다운 HTML
- `css/components.css`: `.download-dropdown` 스타일

---

### B2. Best vs Worst 색상 비교

**사용자 니즈**: 추천색과 피해색의 차이를 직관적으로 느끼기
**벤치마크**: 대면 드레이핑에서 가장 인상 깊은 순간

#### UI

```
┌──────────────────────────────────────┐
│ ✅ vs ❌ So sánh trực quan           │
│                                      │
│  ┌────────────┐  ┌────────────┐     │
│  │            │  │            │     │
│  │ (추천색     │  │ (피해색     │     │
│  │  배경 +    │  │  배경 +    │     │
│  │  텍스트)   │  │  텍스트)   │     │
│  │            │  │            │     │
│  │ ✅ Nên mặc │  │ ❌ Nên tránh│     │
│  │ San hô     │  │ Oliu đậm   │     │
│  │            │  │            │     │
│  │ Tông ấm    │  │ Tông đất   │     │
│  │ sáng làm   │  │ trầm làm   │     │
│  │ bạn tỏa    │  │ da tối đi  │     │
│  │ sáng ✨    │  │ 😔         │     │
│  └────────────┘  └────────────┘     │
│                                      │
│  [← Màu trước]  1/4  [Màu sau →]   │ ← 스와이프/버튼
└──────────────────────────────────────┘
```

#### 데이터 구조 (seasons.js 추가)

```javascript
brightspring: {
  // 기존 필드...
  bestWorstPairs: [
    {
      best: { hex: '#FF6B6B', name: 'San hô', reason: 'Tông ấm sáng làm da bạn tỏa sáng' },
      worst: { hex: '#556B2F', name: 'Oliu đậm', reason: 'Tông đất trầm làm da bạn tối đi' },
    },
    {
      best: { hex: '#4ECDC4', name: 'Ngọc lam', reason: 'Màu tươi mát tôn lên sự rực rỡ' },
      worst: { hex: '#8B7D6B', name: 'Nâu xám', reason: 'Màu đục làm mất đi sự sống động' },
    },
    // 4쌍
  ],
}
```

#### 수정 파일
- `js/data/seasons.js`: `bestWorstPairs` 추가 (12시즌 × 4쌍)
- `js/result.js`: `renderBestWorst()` 추가 (팔레트 섹션 뒤)
- `css/screens.css`: `.bestworst-card`, `.bestworst-item` 스타일

---

### B3. 폰 배경화면 팔레트 (1080×1920)

**사용자 니즈**: 쇼핑 시 즉시 참조 가능한 팔레트

#### Canvas 레이아웃

```
┌─────────────────────┐  1080 × 1920
│                     │  (미니멀 배경화면)
│                     │
│  My Color Palette   │
│  Xuân Rực Rỡ       │
│                     │
│  ┌────┐┌────┐┌────┐│
│  │#FF6│#4EC │#FFD ││  ← 3×4 그리드
│  │B6B ││DC4 ││700 ││     hex 코드 표시
│  └────┘└────┘└────┘│
│  ┌────┐┌────┐┌────┐│
│  │#E8 │#87C │#FFA ││
│  │8A4 ││EEB ││07A ││
│  └────┘└────┘└────┘│
│  ┌────┐┌────┐┌────┐│
│  │#FF │#40E │#FFE ││
│  │B347││0D0 ││66D ││
│  └────┘└────┘└────┘│
│  ┌────┐┌────┐┌────┐│
│  │#F0 │#20B │#FF8 ││
│  │E68C││2AA ││A65 ││
│  └────┘└────┘└────┘│
│                     │
│  ❌ Nên tránh:      │
│  ┌──┐┌──┐┌──┐     │
│  │  ││  ││  │     │  ← 피해색 3개 (작게)
│  └──┘└──┘└──┘     │
│                     │
│  personalcolortest  │
└─────────────────────┘
```

#### 수정 파일
- `js/result-card.js`: `generateWallpaperCard()` 추가
- `js/share.js`: 다운로드 메뉴에 옵션 추가

---

### B4. 네일 컬러 추천

**현재**: 메이크업(4), 의상(5), 헤어(4), 주얼리(1) 있지만 네일 없음

#### 데이터 추가 (seasons.js)

```javascript
brightspring: {
  // 기존 필드...
  nails: [
    { color: '#FF6B6B', name: 'San hô rực rỡ' },
    { color: '#FF9A8B', name: 'Đào tươi' },
    { color: '#E8888A', name: 'Hồng ấm' },
    { color: '#FFB347', name: 'Cam mật ong' },
  ],
}
```

#### UI

주얼리 섹션과 유사한 컬러 도트 + 이름 레이아웃.

#### 수정 파일
- `js/data/seasons.js`: `nails` 추가 (12시즌 × 4색)
- `js/result.js`: `renderNails()` 추가 (주얼리 뒤)
- `index.html`: `#nail-grid` 요소

---

### B5. 3축 교육 카드

**사용자 니즈**: "Cool↔Warm이 정확히 뭔가?" 이해

#### UI

```
┌──────────────────────────────────────┐
│ 📖 Hiểu về 3 trục màu sắc          │
│                                      │
│ 🌡️ Cool ↔ Warm (Tông màu)           │
│ Xác định bởi undertone (tông nền)   │
│ của da bạn. Cool = tông xanh/hồng,  │
│ Warm = tông vàng/cam.               │
│                                      │
│ 🔆 Dark ↔ Light (Độ sáng)           │
│ Mức độ sáng tối tổng thể của da,    │
│ tóc và mắt. Ảnh hưởng đến độ đậm  │
│ nhạt của màu phù hợp.              │
│                                      │
│ 💎 Soft ↔ Clear (Độ trong)           │
│ Mức tương phản giữa da, tóc và      │
│ mắt. Clear = tương phản cao,        │
│ Soft = hài hòa, nhẹ nhàng.         │
└──────────────────────────────────────┘
```

#### 수정 파일
- `js/result.js`: `renderAxisEducation()` (3축 차트 바로 아래)
- `css/screens.css`: `.axis-education` 스타일

---

### C1. 디지털 드레이핑 시뮬레이션 (장기)

**가장 높은 영향의 장기 기능**

#### 접근법 1: 간이 드레이핑 (Canvas 오버레이)

AI 사진 분석 후, 캡처된 사진 위에 색상 오버레이를 반투명으로 적용.
추천색 vs 피해색을 스와이프로 비교.

```
┌──────────────────────────────┐
│  [추천색 탭] [피해색 탭]      │
│                              │
│  ┌────────────────────────┐  │
│  │    👤 사용자 사진       │  │
│  │    + 색상 오버레이      │  │
│  │    (반투명 #FF6B6B)    │  │
│  └────────────────────────┘  │
│                              │
│  San hô — "이 색이 당신에게  │
│  가장 잘 어울립니다"          │
│                              │
│  [◀ 이전]  3/6  [다음 ▶]    │
└──────────────────────────────┘
```

이 방식은 MediaPipe 없이도 구현 가능:
- 캡처된 사진을 Canvas에 로드
- 색상 사각형을 반투명으로 얼굴 주변에 배치
- 6색(추천) + 6색(피해) 총 12개 슬라이드

#### 접근법 2: 고급 드레이핑 (MediaPipe + Phase 3)

MediaPipe Face Mesh로 얼굴 경계를 감지하고, 피부 영역만 선택적으로 색보정.
이 방식은 Phase 3의 AI 업그레이드와 함께 진행.

#### 수정 파일 (접근법 1)
- `js/ai-analysis.js`: `capturedImageData`를 state에 보존
- `js/result.js` 또는 신규 `js/draping.js`: `renderDraping()` 추가
- `css/screens.css`: `.draping-card`, `.draping-canvas` 스타일

---

## 5. 구현 우선순위 및 로드맵

### Phase 2.5: Quick Wins ✅ 완료 (2026-03-05)

| 순서 | 작업 | 수정 파일 | 상태 |
|------|------|----------|------|
| 1 | A2. Hex 코드 복사 | result.js | ✅ 완료 |
| 2 | A5. 결과 로컬 저장 | result.js, app.js, screens.css, index.html | ✅ 완료 |
| 3 | B4. 네일 컬러 추천 | seasons.js, result.js, index.html | ✅ 완료 |
| 4 | B5. 3축 교육 카드 | index.html, screens.css | ✅ 완료 |

### Phase 2.6: 신뢰도 & 교육 ✅ 완료 (2026-03-05)

| 순서 | 작업 | 수정 파일 | 상태 |
|------|------|----------|------|
| 5 | A1. 퍼센트 신뢰도 + 보조 시즌 | scoring.js, result.js, screens.css, index.html | ✅ 완료 |
| 6 | A3. 시즌 스토리텔링 | seasons.js, result.js, screens.css, index.html | ✅ 완료 |
| 7 | A4. 인접 시즌 가이드 | seasons.js, result.js, screens.css, index.html | ✅ 완료 |

### Phase 2.7: 시각 콘텐츠 ✅ 완료 (2026-03-05)

| 순서 | 작업 | 수정 파일 | 상태 |
|------|------|----------|------|
| 8 | B2. Best vs Worst 비교 | seasons.js, result.js, screens.css, index.html | ✅ 완료 |
| 9 | B1. Instagram Story 카드 | result-card.js, index.html | ✅ 완료 |
| 10 | B3. 배경화면 팔레트 | result-card.js, index.html | ✅ 완료 |

### Phase 3: 고급 (향후)

| 순서 | 작업 | 비고 |
|------|------|------|
| 11 | C1. 간이 드레이핑 (Canvas) | AI 사진 캡처 데이터 활용 |
| 12 | C2. AI 엔진 업그레이드 | MediaPipe + CIELAB |
| 13 | C3. 이메일 소프트 게이트 | 수익화 |
| 14 | C4. 옷장 컬러 체크 | 장기 차별화 |

---

## 6. 기대 효과

### 사용자 만족도

| 지표 | 현재 (추정) | Phase 2.5-2.7 후 | Phase 3 후 |
|------|-----------|------------------|-----------|
| "이 결과 유용하다" 인식 | 중 | **높음** (교육+팔레트+hex) | 매우 높음 |
| "정확하다" 신뢰도 | 중-낮 | **중-높** (퍼센트+보조시즌) | 높음 (CIELAB) |
| "공유하고 싶다" 의향 | 중 | **높음** (Story카드+배경화면) | 매우 높음 |
| 재방문율 | 낮음 | **중** (로컬저장+배경화면) | 높음 (드레이핑) |

### 체류 시간

| 섹션 | 추가 체류 시간 |
|------|-------------|
| 시즌 스토리텔링 | +20-30초 |
| 3축 교육 | +15-20초 |
| Best vs Worst 비교 | +30-60초 (스와이프) |
| 인접 시즌 탐색 | +15-20초 |
| Hex 코드 복사 | +10-15초 |
| 네일 컬러 | +5-10초 |
| **합계** | **+2-3분 (현재 5분 → 7-8분)** |

### 공유율

| 기능 | 예상 공유 증가 |
|------|-------------|
| Story 카드 (9:16) | +50% (TikTok/IG 사용자 커버) |
| 배경화면 팔레트 | +20% (실용적 공유) |
| 퍼센트 신뢰도 | +10% (결과 토론 유발) |
| Best vs Worst | +15% (시각적 콘텐츠) |

### 핵심 차별점

현재 무료 퍼스널 컬러 테스트 시장에서 **우리만의 차별점**:

1. **퍼센트 기반 결과** — 대부분 무료 테스트가 단일 레이블만 제공
2. **인접 시즌 가이드** — 경계선 사용자를 위한 실용적 조언
3. **Best vs Worst 시각 비교** — 드레이핑 경험의 디지털 대안
4. **3종 이미지 (OG + Story + 배경화면)** — 모든 플랫폼 커버
5. **교육 콘텐츠** — 전문 상담의 핵심 가치를 무료로 제공
6. **베트남어 특화 + K-뷰티 포지셔닝** — 지역 시장 니치

---

## 부록: 참고 서비스 & 출처

| 서비스 | URL | 주요 참고 사항 |
|--------|-----|---------------|
| Vivaldi Color Lab | vivaldicolor.com | 퍼센트 기반 결과 |
| Dressika | coloranalysis.app | 170 메이크업 쉐이드 AR |
| ColorLover (컬러버) | 앱스토어 | 2,500명 데이터 기반 |
| iColor (아이컬러) | 앱스토어 | 25,000 화장품 DB |
| Palette Hunt | palettehunt.com | 셀럽 디렉토리 |
| Colorwise.me | colorwise.me | 드레이핑 시뮬레이션 |
| K-Test 컬러 성격 | k-test | 200만 참여 (호환성 바이럴) |
| Klook 서울 대면진단 | klook.com | 150-200 PANTONE 드레이프 |
| Chance Kim VN | chancekim.com | 베트남 퍼스널컬러 교육 |
| mausaccanhan.vn | mausaccanhan.vn | 베트남어 퍼스널컬러 전문 |
| 화해 간편발색보기 | hwahae.co.kr | 피부톤 기반 발색 → 6개월 100만뷰 |

---

## 요약: 한 줄 정리

> **현재 프로젝트는 코어 기능이 잘 갖춰져 있지만, 사용자가 진짜 원하는 것은 "결과를 받은 후 무엇을 할 수 있는가"이다.**
> 퍼센트 신뢰도, 인접 시즌 가이드, Best/Worst 비교, Hex 복사, Story 카드 — 이 5가지가 가장 높은 ROI의 개선안이다.
