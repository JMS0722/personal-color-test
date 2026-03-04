# Personal Color Test — Design Kit

> 작성일: 2026-03-04 | 기반: research.md, design-strategy.md, 경쟁사 비주얼 분석
> 원칙: Vanilla CSS (빌드 도구 없음), 모바일 퍼스트, 베트남 Gen Z + K-뷰티 감성

---

## 목차

1. [현재 디자인 진단](#1-현재-디자인-진단)
2. [경쟁사 비주얼 벤치마크](#2-경쟁사-비주얼-벤치마크)
3. [디자인 방향성 결정](#3-디자인-방향성-결정)
4. [Design Token 시스템](#4-design-token-시스템)
5. [타이포그래피](#5-타이포그래피)
6. [컬러 시스템](#6-컬러-시스템)
7. [컴포넌트 라이브러리](#7-컴포넌트-라이브러리)
8. [애니메이션 & 마이크로인터랙션](#8-애니메이션--마이크로인터랙션)
9. [12시즌 비주얼 테마](#9-12시즌-비주얼-테마)
10. [CSS 프레임워크 선택](#10-css-프레임워크-선택)
11. [아이콘 & 일러스트레이션](#11-아이콘--일러스트레이션)
12. [최종 디자인 스택](#12-최종-디자인-스택)

---

## 1. 현재 디자인 진단

### 1-1. 현재 디자인 시스템 요약

| 항목 | 현재 값 | 평가 |
|------|---------|------|
| 폰트 | Inter 400-800 | 적합하나 베트남어 최적화 부족 |
| 메인 컬러 | Gold `#C9956B` + Rose `#D4768A` | 따뜻한 뷰티 느낌, 적절 |
| 배경색 | Cream `#FFFBF5` | 좋음 — 순백보다 따뜻하고 눈 피로 적음 |
| 텍스트 | `#2D2A26` / `#6B6560` | 충분한 대비, 적절 |
| 레이아웃 | max-width 560px | 적절한 모바일 중심 폭 |
| border-radius | 16px / 10px | K-뷰티 트렌드 부합 (16-24px 둥근 모서리) |
| 그림자 | `0 2px 12px rgba(201,149,107,.12)` | 매우 부드러운 그림자, 적절 |
| 버튼 | Pill 형태 (50px radius) + 그라디언트 | K-뷰티 트렌드 부합 |
| 애니메이션 | fadeUp 0.45s | 최소한, 확장 필요 |
| 시즌 테마 | CSS 변수로 동적 변경 | 좋은 기반 — 12시즌으로 확장 필요 |

### 1-2. 현재 디자인의 강점

1. **따뜻한 gold/rose 테마** — 뷰티/컬러 콘텐츠에 적합
2. **깔끔한 카드 기반 레이아웃** — 정보 계층이 명확
3. **CSS 변수 기반 시즌 테마** — 동적 테마 전환에 좋은 기반
4. **pill 형태 버튼** — K-뷰티 트렌드 부합
5. **적절한 max-width** — 모바일 친화적

### 1-3. 현재 디자인의 약점

| 문제 | 영향 | 개선 방향 |
|------|------|----------|
| **Inter 폰트가 베트남어 diacritic에 비최적** | 일부 결합 부호가 좁아 보임 | Be Vietnam Pro 또는 Quicksand 도입 |
| **퀴즈 화면이 단조로움** | 중반 이탈 가속 | 옵션 선택 피드백 애니메이션 추가 |
| **결과 공개가 평탄함** | 감정적 피크 약함 | 스태거드 리빌 + confetti 효과 |
| **카드 진입 애니메이션 없음** | 스크롤 시 발견 재미 없음 | Intersection Observer 스크롤 애니메이션 |
| **결과 시즌별 시각 차별화 약함** | 12시즌 각각의 아이덴티티 불분명 | 시즌별 고유 그라디언트 + 배경 패턴 |
| **공유 카드 이미지 없음** | 소셜 공유 시 시각 임팩트 없음 | Canvas 결과 카드 생성 |
| **글래스모피즘 미적용** | 2025-2026 트렌드 미반영 | 결과 헤더에 glassmorphism 적용 |

---

## 2. 경쟁사 비주얼 벤치마크

### 2-1. 경쟁사 디자인 비교표

| 사이트 | 디자인 느낌 | 컬러 전략 | 타이포 | 강점 | 약점 |
|--------|-----------|----------|--------|------|------|
| **Ktestone** | 레트로 귀여움 (K-cute) | 결과별 파스텔 테마 | 기본 sans-serif | 공유 카드가 곧 제품 | UI 자체는 투박 |
| **Colorwise** | 전문적·유틸리티 | 중립 UI + 결과 컬러 팝 | 모던 sans-serif | 사진 옆 팔레트 비교 | 감성적 매력 부족 |
| **Palette Hunt** | 프리미엄 SaaS | 퍼플 액센트 + 중립 | Poppins + Inter | AI 기술 신뢰감 | 뷰티 감성 부족 |
| **Visee (KOSE)** | 세련된 J-뷰티 | 깨끗한 화이트 + 페미닌 | 일본 최적화 | 모바일 전용 퀄리티 | 데스크톱 미지원 |
| **e.l.f. Elfnalysis** | 에디토리얼 미니멀 | Coral pink `#FF808B` | Untitled Serif + Sans | Pinterest 쇼핑 연동 | 결과 공유 기능 약함 |
| **Interact** | 클린 SaaS | Purple `#7371FC` | Golos Text + Proxima | 템플릿 다양성 | 뷰티 특화 아님 |

### 2-2. 경쟁사에서 배울 패턴

**Ktestone에서 배울 것**:
- 결과 카드가 소셜에서 독립적으로 작동해야 함 (스크린샷 = 콘텐츠)
- 호환성/비교 기능이 바이럴 2차 루프

**Colorwise에서 배울 것**:
- 퀴즈 UI는 중립적으로, 결과에서 컬러가 폭발해야 함
- 인트로→퀴즈는 절제, 결과는 풍성

**e.l.f.에서 배울 것**:
- Serif + Sans 듀얼 폰트가 에디토리얼 고급감 부여
- 48px 최소 터치 타겟 (접근성)

**Visee에서 배울 것**:
- 모바일 전용 경험의 집중도
- AI 분석 중 "처리 중" 애니메이션의 기대감 구축

---

## 3. 디자인 방향성 결정

### 3-1. 포지셔닝 매트릭스

```
        전문적/정밀
           ↑
  Colorwise │ Palette Hunt
           │
 ──────────┼──────────→ 감성적/뷰티
           │
  Ktestone │  ★ 우리 목표
           │
        귀여움/캐주얼
```

**우리 위치**: "감성적 K-뷰티 + 적당한 전문성"
- Ktestone보다 세련되고, Colorwise보다 따뜻한 중간 지점
- 베트남 Gen Z가 공유하고 싶은 "예쁜 결과" + 신뢰할 수 있는 "과학적 분석"

### 3-2. 디자인 무드 키워드

```
Soft    ·   Warm    ·   Korean    ·   Premium-Casual
파스텔  ·   따뜻함  ·   한국식    ·   고급스러운 캐주얼
```

- **Soft**: 부드러운 그림자, 둥근 모서리, 파스텔 그라디언트
- **Warm**: 크림 배경, 골드/로즈 액센트, 따뜻한 중성색
- **Korean**: K-뷰티 브랜드 레퍼런스 (Romand의 chic 미니멀, Etude의 friendly 핑크)
- **Premium-Casual**: 럭셔리하지 않지만 저렴해 보이지도 않는, 접근 가능한 고급감

### 3-3. 핵심 디자인 원칙

| 원칙 | 설명 | 구현 |
|------|------|------|
| **절제된 인트로, 폭발하는 결과** | 퀴즈 UI는 깔끔·중립, 결과에서 시즌 컬러가 화면을 채움 | 인트로/퀴즈: gold/rose 최소 사용. 결과: 시즌 그라디언트 풀 적용 |
| **결과 카드 = 소셜 자산** | 결과 카드만 보고도 공유하고 싶어야 함 | 1200×630 Canvas 카드, 시즌별 고유 그라디언트 |
| **모바일 퍼스트, 모바일 온리 마인드** | 98.6% 모바일 사용자 | 360px 기준 설계, 터치 타겟 48px+ |
| **베트남어 가독성 우선** | 결합 부호(diacritics) 완벽 표현 | Be Vietnam Pro, line-height 1.7 |
| **12시즌 = 12가지 비주얼 아이덴티티** | 각 시즌이 고유한 색감으로 기억되어야 함 | 시즌별 전용 gradient + primary + accent |

---

## 4. Design Token 시스템

### 4-1. Open Props 도입

**Open Props**: CSS 커스텀 프로퍼티 기반 디자인 토큰 라이브러리
- 크기: **4 KB** (Brotli)
- 빌드 도구 불필요 — CDN 한 줄로 로드
- 500+ CSS 변수: 컬러 스케일, 그림자, 이징, 애니메이션, 간격 등
- 커스텀 테마 오버라이드 자유

```html
<link rel="stylesheet" href="https://unpkg.com/open-props"/>
<link rel="stylesheet" href="https://unpkg.com/open-props/normalize.min.css"/>
```

### 4-2. 도입 이유

| 비교 항목 | Open Props | 현재 (커스텀 변수) | Pico CSS | Tailwind CDN |
|----------|------------|------------------|----------|-------------|
| 크기 | 4 KB | 0 KB | 7.7 KB | ~300 KB |
| 빌드 도구 | 불필요 | 불필요 | 불필요 | 불필요 |
| 커스텀 자유도 | 최고 — 토큰만 제공 | 최고 | 중간 — 오피니언 있음 | 높음 |
| 컬러 스케일 | 17 패밀리 × 13 단계 | 수동 정의 필요 | 20 테마 | Tailwind 팔레트 |
| 그림자 프리셋 | 6단계 외부 + 5단계 내부 | 2개 (shadow, shadow-lg) | 기본만 | 유틸리티 |
| 이징 함수 | 40+ 프리셋 | 없음 | 없음 | 없음 |
| 애니메이션 | 15+ 키프레임 | 2개 (fadeUp, spin) | 없음 | 없음 |
| 비주얼 오피니언 | **없음** (토큰만) | 없음 | 있음 | 없음 |

**결론**: Open Props는 **디자인 토큰**만 제공하므로 우리의 gold/rose K-뷰티 미학을 방해하지 않으면서, 일관된 그림자/간격/이징/애니메이션 시스템을 즉시 제공한다.

### 4-3. 사용할 Open Props 토큰

```css
/* 우리가 활용할 Open Props 변수 예시 */

/* 그림자 (현재 2개 → 6단계로 확장) */
--shadow-1   /* 카드 기본 */
--shadow-2   /* 카드 호버 */
--shadow-3   /* 모달, 드롭다운 */
--shadow-4   /* 플로팅 버튼 */
--shadow-5   /* 결과 헤더 */

/* 이징 (현재 없음 → 40+ 프리셋) */
--ease-out-3     /* 일반 전환 */
--ease-out-5     /* 부드러운 감속 */
--ease-in-out-2  /* 대칭 전환 */
--ease-spring-3  /* 탄성 효과 (결과 리빌) */
--ease-elastic-3 /* 바운스 (버튼 피드백) */

/* 간격 (일관된 8px 기반 스케일) */
--size-1 through --size-15

/* 애니메이션 (현재 fadeUp만 → 다양한 프리셋) */
--animation-fade-in
--animation-slide-in-up
--animation-scale-up
```

### 4-4. 커스텀 토큰 레이어 (Open Props 위에 오버라이드)

```css
:root {
  /* === 브랜드 컬러 (유지 + 확장) === */
  --brand-gold: #C9956B;
  --brand-gold-light: #FFF8EE;
  --brand-rose: #D4768A;
  --brand-rose-light: #FFF0F3;
  --brand-gradient: linear-gradient(135deg, #C9956B, #D4768A);

  /* === 시맨틱 컬러 === */
  --bg-primary: #FFFBF5;        /* 크림 배경 (유지) */
  --bg-card: #FFFFFF;
  --bg-subtle: #FAF6F0;         /* 카드 내부 섹션 */
  --text-primary: #2D2A26;
  --text-secondary: #6B6560;
  --text-muted: #9E9690;
  --border-default: #E8E0D8;
  --border-hover: var(--brand-gold);

  /* === 시즌 테마 (동적 오버라이드) === */
  --season-primary: var(--brand-gold);
  --season-secondary: var(--brand-rose);
  --season-light: var(--brand-gold-light);
  --season-gradient: var(--brand-gradient);
  --season-text-on-gradient: #FFFFFF;

  /* === 레이아웃 === */
  --container-max: 560px;
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 50px;          /* pill 버튼 */

  /* === 타이포 스케일 === */
  --text-xs: 0.75rem;     /* 12px — 캡션 */
  --text-sm: 0.8125rem;   /* 13px — 힌트, 부가 */
  --text-base: 0.9375rem; /* 15px — 본문 */
  --text-md: 1rem;        /* 16px — 본문 강조 */
  --text-lg: 1.125rem;    /* 18px — 카드 타이틀 */
  --text-xl: 1.375rem;    /* 22px — 질문 텍스트 */
  --text-2xl: 2rem;       /* 32px — 결과 시즌명 */
  --text-3xl: 2.25rem;    /* 36px — 인트로 타이틀 */
}
```

---

## 5. 타이포그래피

### 5-1. 현재 문제

Inter는 우수한 UI 폰트이지만 베트남어 diacritics에 최적화되지 않음:
- 결합 부호(dấu) 위치가 약간 좁고 기계적
- 라인 높이 여유가 부족하면 위 부호(ả, ã, ắ 등)가 잘림 우려
- 베트남어 전용 디자인이 아니므로 모음+부호 결합 간격이 미세하게 불균일

### 5-2. 폰트 선택

#### 추천: Be Vietnam Pro + Quicksand 페어링

**Be Vietnam Pro** (본문):
- 베트남 디자이너가 만든 **베트남어 전용 최적화 폰트**
- 결합 부호가 자연스럽게 배치됨 (Inter/Roboto 대비 약 15% 더 넓은 diacritic 공간)
- 300-700 weight 지원
- Google Fonts 무료, vietnamese subset 네이티브 포함
- 10개 weight × 2 (normal + italic) = 풍부한 타이포 계층

**Quicksand** (헤딩/디스플레이):
- 둥근 기하학적 sans-serif — 친근하고 부드러운 뷰티 감성
- Vietnamese 완벽 지원
- Gen Z 선호 "friendly rounded" 트렌드에 부합
- 인트로 타이틀, 결과 시즌명, 카드 타이틀에 사용

#### 대안 페어링 옵션

| 페어링 | 느낌 | 장단점 |
|--------|------|--------|
| **Quicksand + Be Vietnam Pro** (추천) | 친근한 뷰티 + 읽기 편한 본문 | 가장 K-뷰티 친화적, 2 폰트 로드 |
| Be Vietnam Pro 단독 | 깔끔한 미니멀 | 1 폰트만 로드, 헤딩 개성 부족 |
| Nunito Sans + Be Vietnam Pro | 따뜻한 라운드 + 본문 | Quicksand보다 덜 독특 |
| Playfair Display + Be Vietnam Pro | 에디토리얼 고급감 | Serif가 K-뷰티 감성과 다소 거리 |

### 5-3. 폰트 로드

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Quicksand:wght@600;700&display=swap" rel="stylesheet">
```

**로드 전략**:
- Be Vietnam Pro: 400 (본문), 500 (강조), 600 (라벨/배지), 700 (카드 타이틀) = **4 weight**
- Quicksand: 600 (서브 헤딩), 700 (메인 헤딩) = **2 weight**
- 총 **6 weight × ~25 KB/weight (vietnamese subset) ≈ 150 KB** (캐싱 후 0)
- `font-display: swap` → 폰트 로드 전 시스템 폰트로 즉시 렌더링

### 5-4. 타이포 규칙

```css
/* 기본 스택 */
body {
  font-family: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
  font-size: var(--text-base);     /* 15px */
  line-height: 1.7;                /* 베트남어 diacritics 여유 */
  letter-spacing: 0.01em;          /* 미세한 자간 확보 */
  -webkit-font-smoothing: antialiased;
}

/* 디스플레이/헤딩 */
h1, h2, .result-season, .intro-title {
  font-family: 'Quicksand', 'Be Vietnam Pro', sans-serif;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;         /* 헤딩은 약간 타이트 */
}

/* 카드 타이틀 */
.card-title {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-weight: 700;
  font-size: var(--text-lg);       /* 18px */
}

/* 캡션/힌트 */
.caption, .hint {
  font-size: var(--text-sm);       /* 13px */
  color: var(--text-secondary);
  line-height: 1.5;
}
```

### 5-5. 베트남어 타이포 주의사항

```css
/* 상단 부호 잘림 방지 */
.result-season,
.intro-title,
.question-text {
  padding-top: 0.15em;
  overflow: visible;
}

/* 베트남어 텍스트는 영어보다 ~30% 길어짐 → 줄바꿈 대비 */
.option-btn span {
  word-break: keep-all;
  overflow-wrap: break-word;
}

/* 모바일에서 최소 16px (iOS 자동 줌 방지) */
input, select, textarea {
  font-size: 16px;
}
```

---

## 6. 컬러 시스템

### 6-1. 기본 팔레트 (유지 + 확장)

```
브랜드 코어
┌──────────────────────────────────────────────┐
│  Gold #C9956B     Rose #D4768A               │  ← 메인 그라디언트 쌍
│  Gold-lt #FFF8EE  Rose-lt #FFF0F3            │  ← 라이트 배리언트
└──────────────────────────────────────────────┘

배경 스케일
┌──────────────────────────────────────────────┐
│  Cream #FFFBF5    ← 페이지 배경              │
│  White #FFFFFF    ← 카드 배경                │
│  Warm Gray #FAF6F0 ← 카드 내부 서브 영역     │
│  Border #E8E0D8   ← 구분선                   │
└──────────────────────────────────────────────┘

텍스트 스케일
┌──────────────────────────────────────────────┐
│  Primary #2D2A26  ← 메인 텍스트              │
│  Secondary #6B6560 ← 서브 텍스트             │
│  Muted #9E9690    ← 캡션, 비활성             │
│  Disabled #C8C2BC ← 비활성 요소              │
│  On-gradient #FFFFFF ← 그라디언트 위 텍스트  │
└──────────────────────────────────────────────┘
```

### 6-2. 시즌 칩 컬러 (인트로 화면)

| 시즌 | 배경 | 텍스트 | 느낌 |
|------|------|--------|------|
| 🌸 Xuân (Spring) | `#FFF5E6` | `#D4880F` | 따뜻한 피치 |
| 🌊 Hạ (Summer) | `#EBF5FF` | `#4A8FD4` | 시원한 블루 |
| 🍂 Thu (Autumn) | `#FFF0E6` | `#C4723A` | 깊은 테라코타 |
| ❄️ Đông (Winter) | `#F0E8FF` | `#6B4CC4` | 차가운 바이올렛 |

### 6-3. 상태 컬러

| 상태 | 컬러 | 용도 |
|------|------|------|
| Hover | Gold `#C9956B` 보더 + `#FFF8EE` 배경 | 옵션 호버 |
| Selected | Rose `#D4768A` 보더 + `#FFF0F3` 배경 | 옵션 선택됨 |
| Focus ring | `0 0 0 3px rgba(212,118,138,0.3)` | 접근성 포커스 표시 |
| Success | `#4CAF50` | 복사 완료, 분석 완료 |
| Disabled | opacity 0.3 | 비활성 버튼 |

### 6-4. 디자인 핵심: "절제된 크롬, 폭발하는 결과"

```
인트로/퀴즈 화면:        결과 화면:
┌──────────────┐        ┌──────────────────┐
│  #FFFBF5 bg  │        │  ████████████████ │ ← 시즌 그라디언트 헤더
│  미니멀 골드  │  →→→   │  ████████████████ │
│  절제된 로즈  │        │  ████████████████ │
│              │        │                  │
│  중립적 UI   │        │  시즌 컬러 폭발!  │
└──────────────┘        │  팔레트 풍성     │
                        │  시즌 라이트 배경  │
                        └──────────────────┘
```

인트로와 퀴즈에서는 gold/rose를 **최소한**으로 사용하고, 결과 화면에서 시즌별 `--season-gradient`가 헤더를 가득 채우면서 **시각적 보상**을 만든다. 이 대비가 감정적 피크를 강화한다.

---

## 7. 컴포넌트 라이브러리

### 7-1. 버튼

#### CTA 버튼 (Primary)
```css
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--brand-gradient);
  color: var(--season-text-on-gradient);
  border: none;
  padding: 16px 36px;
  border-radius: var(--radius-full);     /* pill 형태 유지 */
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: var(--text-md);             /* 16px */
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s var(--ease-out-3),
              box-shadow 0.18s var(--ease-out-3);
  box-shadow: var(--shadow-3);
  min-height: 52px;                      /* 48px+ 터치 타겟 */
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-4);
}

.cta-btn:active {
  transform: translateY(0) scale(0.97);  /* 누르는 피드백 */
}
```

#### 옵션 버튼 (Quiz)
```css
.option-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 20px;
  background: var(--bg-card);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-md);       /* 16px */
  font-size: var(--text-base);           /* 15px */
  min-height: 56px;                      /* 터치 타겟 확보 */
  transition: transform 0.15s var(--ease-out-3),
              border-color 0.15s,
              background 0.15s,
              box-shadow 0.15s;
}

.option-btn:hover {
  border-color: var(--brand-gold);
  background: var(--brand-gold-light);
}

.option-btn:active {
  transform: scale(0.97);               /* 탭 피드백 */
}

.option-btn.selected {
  border-color: var(--brand-rose);
  background: var(--brand-rose-light);
  box-shadow: 0 0 0 3px rgba(212,118,138,0.15);  /* 선택 강조 링 */
  transform: scale(1.01);
}
```

#### 공유 버튼
```css
.share-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  border: 2px solid var(--border-default);
  border-radius: var(--radius-sm);       /* 10px */
  background: var(--bg-card);
  font-size: var(--text-sm);             /* 14px */
  font-weight: 600;
  min-height: 48px;
  transition: all 0.2s var(--ease-out-3);
}

/* Zalo 버튼 */
.zalo-btn { color: #0068FF; }
.zalo-btn:hover { background: #E8F0FE; border-color: #0068FF; }

/* Facebook 버튼 */
.facebook-btn { color: #1877F2; }
.facebook-btn:hover { background: #EBF3FF; border-color: #1877F2; }
```

### 7-2. 카드

```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);       /* 16px */
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-2);           /* Open Props 그림자 */
}

.card-title {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: var(--text-lg);             /* 18px */
  font-weight: 700;
  margin-bottom: 20px;
}
```

### 7-3. 결과 헤더 (글래스모피즘)

결과 화면의 핵심 — 시즌 그라디언트 위에 반투명 카드:

```css
.result-header {
  text-align: center;
  padding: 48px 24px 36px;
  margin: -40px -20px 32px;             /* 컨테이너 밖으로 확장 */
  background: var(--season-gradient);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);  /* 하단만 둥글게 */
  position: relative;
  overflow: hidden;
}

/* 글래스 오버레이 */
.result-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* 헤더 내부 콘텐츠는 z-index로 올림 */
.result-header > * {
  position: relative;
  z-index: 1;
}

.result-season {
  font-family: 'Quicksand', sans-serif;
  font-size: var(--text-2xl);           /* 32px */
  font-weight: 700;
  color: var(--season-text-on-gradient);
  /* 그라디언트 텍스트 대신 화이트로 변경 — 그라디언트 배경 위에서 더 가독성 좋음 */
  -webkit-text-fill-color: white;
}
```

### 7-4. 프로그레스 바

```css
.progress-bar {
  width: 100%;
  height: 6px;                          /* 8px → 6px 더 미니멀 */
  background: var(--border-default);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--brand-gradient);
  border-radius: var(--radius-full);
  transition: width 0.5s var(--ease-out-5);  /* Open Props 이징 */
}
```

### 7-5. 팔레트 스와치

```css
.swatch {
  aspect-ratio: 1;
  border-radius: var(--radius-sm);       /* 10px */
  border: 2px solid rgba(0,0,0,0.06);
  cursor: pointer;
  transition: transform 0.18s var(--ease-out-3),
              box-shadow 0.18s var(--ease-out-3);
}

.swatch:hover {
  transform: scale(1.08);
  box-shadow: var(--shadow-3);
}

/* 호버 시 hex 코드 표시 */
.swatch:hover .swatch-hex {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.swatch-hex {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
  transition: all 0.2s var(--ease-out-3);
}
```

---

## 8. 애니메이션 & 마이크로인터랙션

### 8-1. 타이밍 가이드라인

| 인터랙션 | 지속 시간 | 이징 (Open Props) | 용도 |
|----------|----------|------------------|------|
| 버튼 탭 피드백 | 120-180ms | `--ease-out-3` | 모든 버튼 active 상태 |
| 카드 호버 | 180ms | `--ease-out-3` | 호버 시 그림자/scale 변경 |
| 옵션 선택 | 200ms | `--ease-out-3` | selected 클래스 전환 |
| 화면 전환 | 400-500ms | `--ease-in-out-2` | showScreen() 전환 |
| 결과 리빌 | 600ms (스태거 100-150ms) | `--ease-out-5` | 결과 요소 순차 등장 |
| 스크롤 카드 등장 | 500ms | `--ease-out-5` | Intersection Observer |
| 프로그레스 바 | 500ms | `--ease-out-5` | 질문 진행 |
| 로딩 스피너 | 1200ms | linear | 무한 회전 |
| Confetti | 2000-3000ms | 물리 기반 | 결과 공개 축하 |

### 8-2. 질문 전환 애니메이션

현재: 단순 DOM 업데이트 (애니메이션 없음)
개선: 슬라이드 전환

```css
/* 질문 진입 */
@keyframes questionEnter {
  from {
    opacity: 0;
    transform: translateX(24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 질문 퇴장 */
@keyframes questionExit {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-24px);
  }
}

#question-area {
  animation: questionEnter 0.4s var(--ease-out-5) both;
}

#question-area.exiting {
  animation: questionExit 0.3s var(--ease-out-3) both;
}
```

### 8-3. 결과 리빌 (스태거드 애니메이션)

결과 화면의 감정적 피크를 극대화하는 순차 등장:

```css
@keyframes revealUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 결과 헤더 내부 요소 순차 등장 */
.result-header .result-badge    { animation: revealUp 0.5s var(--ease-out-5) 0.1s both; }
.result-header .result-emoji    { animation: revealUp 0.5s var(--ease-out-5) 0.25s both; }
.result-header .result-baseseason-badge { animation: revealUp 0.5s var(--ease-out-5) 0.35s both; }
.result-header .result-season   { animation: revealUp 0.6s var(--ease-out-5) 0.5s both; }
.result-header .result-en-name  { animation: revealUp 0.5s var(--ease-out-5) 0.65s both; }
.result-header .result-subtitle { animation: revealUp 0.5s var(--ease-out-5) 0.75s both; }
.result-header .result-desc     { animation: revealUp 0.5s var(--ease-out-5) 0.9s both; }
```

### 8-4. 결과 축하 Confetti

결과 화면 진입 시 confetti 효과 — 감정적 보상.

```html
<!-- CDN 로드 (6 KB) -->
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
```

```javascript
// 결과 화면 표시 후 호출
function celebrateResult() {
  const season = state.currentSeason;
  // 시즌 팔레트에서 상위 4색 추출
  const colors = season.palette.slice(0, 4).map(p => p.hex);

  confetti({
    particleCount: 60,
    spread: 55,
    origin: { y: 0.65 },
    colors: colors,
    gravity: 0.8,
    scalar: 0.9,
    drift: 0,
  });
}
```

### 8-5. 스크롤 트리거 카드 등장

```css
/* 초기 숨김 상태 */
.card-animate {
  opacity: 0;
  transform: translateY(24px);
}

/* 보이면 등장 */
.card-animate.visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s var(--ease-out-5),
              transform 0.5s var(--ease-out-5);
}

/* 접근성: 모션 감소 선호 시 애니메이션 비활성화 */
@media (prefers-reduced-motion: reduce) {
  .card-animate {
    opacity: 1;
    transform: none;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

```javascript
// Intersection Observer (별도 라이브러리 불필요)
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.card-animate').forEach(el => observer.observe(el));
}
```

### 8-6. 로딩 화면 개선

현재: 텍스트 색상만 변경
개선: 아이콘 + 페이드인/체크마크 전환

```css
.load-step {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--text-sm);
  color: var(--text-muted);
  opacity: 0.3;
  transition: all 0.4s var(--ease-out-3);
}

.load-step .step-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  transition: all 0.3s;
}

.load-step.active {
  opacity: 1;
  color: var(--brand-gold);
  font-weight: 600;
}

.load-step.active .step-icon {
  background: var(--brand-gold);
  border-color: var(--brand-gold);
  color: white;
  animation: pulse 1s var(--ease-in-out-2) infinite;
}

.load-step.done {
  opacity: 0.6;
  color: var(--text-primary);
}

.load-step.done .step-icon {
  background: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
```

---

## 9. 12시즌 비주얼 테마

### 9-1. 시즌별 컬러 토큰

각 시즌이 고유한 시각적 아이덴티티를 가져야 소셜 공유 시 즉시 구별 가능.

#### Spring (봄) — 따뜻하고 밝은

| 서브타입 | Primary | Secondary | Light BG | Gradient |
|---------|---------|-----------|----------|----------|
| **Bright Spring** | `#FF6B35` | `#FFB347` | `#FFF8F0` | `linear-gradient(135deg, #FF6B35, #FFB347)` |
| **Light Spring** | `#FFAB76` | `#FFD4A8` | `#FFFAF5` | `linear-gradient(135deg, #FFAB76, #FFD4A8)` |
| **Warm Spring** | `#E8913A` | `#F4C472` | `#FFF6EC` | `linear-gradient(135deg, #E8913A, #F4C472)` |

#### Summer (여름) — 시원하고 부드러운

| 서브타입 | Primary | Secondary | Light BG | Gradient |
|---------|---------|-----------|----------|----------|
| **Light Summer** | `#8BB8D6` | `#B5D4E8` | `#F5F9FC` | `linear-gradient(135deg, #8BB8D6, #B5D4E8)` |
| **Cool Summer** | `#6A8FA7` | `#9FB8CB` | `#F2F6F9` | `linear-gradient(135deg, #6A8FA7, #9FB8CB)` |
| **Soft Summer** | `#9CAAAB` | `#C4CDCE` | `#F5F7F7` | `linear-gradient(135deg, #9CAAAB, #C4CDCE)` |

#### Autumn (가을) — 따뜻하고 깊은

| 서브타입 | Primary | Secondary | Light BG | Gradient |
|---------|---------|-----------|----------|----------|
| **Warm Autumn** | `#C77B3F` | `#D4A06A` | `#FBF5EE` | `linear-gradient(135deg, #C77B3F, #D4A06A)` |
| **Deep Autumn** | `#8B4E2A` | `#A66B3C` | `#F8F1EA` | `linear-gradient(135deg, #8B4E2A, #A66B3C)` |
| **Soft Autumn** | `#B09070` | `#CCBA9A` | `#FAF7F2` | `linear-gradient(135deg, #B09070, #CCBA9A)` |

#### Winter (겨울) — 시원하고 선명한

| 서브타입 | Primary | Secondary | Light BG | Gradient |
|---------|---------|-----------|----------|----------|
| **Cool Winter** | `#5B7FA5` | `#8EAAC5` | `#F0F4F8` | `linear-gradient(135deg, #5B7FA5, #8EAAC5)` |
| **Deep Winter** | `#3D3D6B` | `#5E5E8A` | `#EDEDF5` | `linear-gradient(135deg, #3D3D6B, #5E5E8A)` |
| **Bright Winter** | `#C74B8B` | `#E080A8` | `#FDF0F5` | `linear-gradient(135deg, #C74B8B, #E080A8)` |

### 9-2. 시즌 테마 적용 방식

```javascript
// result.js에서 시즌 결정 후
function applySeasonTheme(season) {
  const root = document.documentElement;
  root.style.setProperty('--season-primary', season.primary);
  root.style.setProperty('--season-secondary', season.secondary || season.primary);
  root.style.setProperty('--season-light', season.light);
  root.style.setProperty('--season-gradient', season.gradient);
}
```

### 9-3. 결과 카드 시즌별 차별화

```
Bright Spring 카드:          Cool Winter 카드:
┌────────────────────┐      ┌────────────────────┐
│ ██ 오렌지→옐로 ██  │      │ ██ 블루→라벤더 ██  │
│                    │      │                    │
│    🌸              │      │    ❄️              │
│  Xuân Rực Rỡ      │      │  Đông Mát Lạnh     │
│  Bright Spring     │      │  Cool Winter       │
│                    │      │                    │
│ [🟠][🟡][🟤][🔴]  │      │ [🔵][💜][⚪][🔷]  │
│                    │      │                    │
└────────────────────┘      └────────────────────┘
```

소셜 피드에서 친구 A의 카드(따뜻한 오렌지)와 친구 B의 카드(차가운 블루)가 명확히 다르게 보임 → **"나도 해봐야지"** FOMO 유발.

---

## 10. CSS 프레임워크 선택

### 10-1. 최종 선택: Open Props + 커스텀 CSS

| 레이어 | 역할 | 출처 |
|--------|------|------|
| **1. Open Props** (4 KB CDN) | 디자인 토큰: 그림자, 이징, 간격, 애니메이션 | `unpkg.com/open-props` |
| **2. 커스텀 base.css** | 브랜드 변수, 리셋, 타이포, 레이아웃 | 직접 작성 |
| **3. 커스텀 components.css** | 버튼, 카드, 프로그레스바 등 | 직접 작성 |
| **4. 커스텀 screens.css** | 화면별 레이아웃 | 직접 작성 |
| **5. 커스텀 seasons.css** | 12시즌 테마 컬러 | 직접 작성 |

### 10-2. 도입하지 않는 것들

| 후보 | 미도입 이유 |
|------|-----------|
| **Tailwind CDN** | ~300 KB, 클래스 오염, HTML 가독성 저하 |
| **Pico CSS** | 오피니언이 있어 gold/rose 테마와 충돌 가능 |
| **Bootstrap** | 과도함, 뷰티 감성과 거리 |
| **Water.css / MVP.css** | 너무 미니멀, 커스텀 컴포넌트 부족 |
| **Sass/PostCSS** | 빌드 도구 필요 — 프로젝트 원칙 위반 |

### 10-3. index.html 최종 CSS 로드 순서

```html
<!-- 1. Open Props 디자인 토큰 (4 KB, CDN 캐싱) -->
<link rel="stylesheet" href="https://unpkg.com/open-props"/>

<!-- 2. 폰트 (Be Vietnam Pro + Quicksand) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Quicksand:wght@600;700&display=swap" rel="stylesheet">

<!-- 3. 커스텀 CSS (4개 파일) -->
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/screens.css">
<link rel="stylesheet" href="css/seasons.css">
```

---

## 11. 아이콘 & 일러스트레이션

### 11-1. 아이콘 전략: 이모지 + 인라인 SVG (현재 유지)

현재 시스템은 이모지(🌸🎨💄👗💇💍⭐🛒📤🔬)와 인라인 SVG를 사용. 이 접근은:
- **추가 HTTP 요청 0개** (CDN 폰트 아이콘 로드 불필요)
- **크로스 플랫폼 일관성 부족** 이 유일한 단점이지만, 이모지가 뷰티/라이프스타일 느낌에 적합
- **SVG 아이콘** (뒤로가기, 업로드 등 UI 아이콘)은 현재 인라인으로 적절

### 11-2. 추가 고려: Lucide Icons (필요 시)

UI 아이콘을 통일하고 싶다면:

```html
<!-- CDN 로드 (~8 KB 개별 아이콘) -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```

Lucide: Feather Icons 후속, 1px stroke, 미니멀, 현재 인라인 SVG와 동일 스타일.
단, **현재 인라인 SVG + 이모지 조합이 충분**하므로 필수 아닌 선택 사항.

### 11-3. 결과 카드 일러스트레이션 (Phase 2+)

현재 이모지(🌸🌊🍂❄️)로 시즌 대표 — 충분히 효과적.
향후 차별화를 위해:
- 시즌별 간단한 SVG 일러스트 (꽃, 파도, 낙엽, 눈꽃)
- 또는 CSS로 만드는 추상적 형태 (그라디언트 원, 소프트 블롭)

```css
/* 결과 헤더 배경에 소프트 블롭 장식 */
.result-header::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  top: -40px;
  right: -60px;
  filter: blur(40px);
}
```

---

## 12. 최종 디자인 스택

### 12-1. 기술 스택 요약

```
┌─────────────────────────────────────────────────┐
│                 디자인 스택                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  토큰 레이어   Open Props (4 KB CDN)             │
│               └ 그림자 6단계                     │
│               └ 이징 40+ 프리셋                  │
│               └ 애니메이션 프리셋                 │
│               └ 간격 스케일                      │
│                                                 │
│  타이포        Quicksand (헤딩, 2 weight)        │
│               Be Vietnam Pro (본문, 4 weight)    │
│               └ Vietnamese diacritic 최적화      │
│               └ line-height 1.7 / 1.3            │
│                                                 │
│  컬러          Gold/Rose 브랜드 쌍 (유지)        │
│               + 12시즌 고유 그라디언트            │
│               + 시맨틱 컬러 토큰                 │
│               + "절제→폭발" 전략                 │
│                                                 │
│  컴포넌트      커스텀 CSS (4 파일)               │
│               └ base.css: 변수, 리셋, 타이포     │
│               └ components.css: 버튼, 카드       │
│               └ screens.css: 5 화면 레이아웃     │
│               └ seasons.css: 12시즌 테마         │
│                                                 │
│  애니메이션    CSS transitions + keyframes        │
│               + Intersection Observer (네이티브)  │
│               + canvas-confetti (6 KB CDN)       │
│               + prefers-reduced-motion 대응       │
│                                                 │
│  아이콘        이모지 + 인라인 SVG (변경 없음)    │
│                                                 │
│  레이아웃      max-width 560px (유지)            │
│               모바일 퍼스트 (360px 기준 설계)     │
│               480px / 768px 브레이크포인트        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 12-2. CDN 의존성 총량

| 리소스 | 크기 | 캐싱 | 필수 여부 |
|--------|------|------|----------|
| Open Props | 4 KB | CDN 캐싱 | 필수 |
| Be Vietnam Pro (4 weight) | ~100 KB | Google Fonts 캐싱 | 필수 |
| Quicksand (2 weight) | ~50 KB | Google Fonts 캐싱 | 필수 |
| canvas-confetti | 6 KB | CDN 캐싱 | Phase 2 |
| **합계** | **~160 KB** | 재방문 시 0 KB | |

vs 현재: Inter (~80 KB) = **폰트 교체로 +70 KB**, 하지만 모두 CDN 캐싱되므로 재방문 시 영향 0.

### 12-3. 현재 → 새 디자인 변경 요약

| 항목 | 현재 | 변경 후 | 이유 |
|------|------|---------|------|
| 폰트 | Inter | **Be Vietnam Pro + Quicksand** | 베트남어 최적화 + K-뷰티 감성 |
| 디자인 토큰 | 커스텀 변수 6개 | **Open Props + 커스텀 확장** | 일관된 그림자/이징/간격 |
| 결과 헤더 | 플랫 배경 | **시즌 그라디언트 + 글래스모피즘** | 감정적 피크 강화 |
| 옵션 선택 | 색상 변경만 | **scale + shadow ring 피드백** | 탭 만족감 |
| 질문 전환 | DOM 즉시 업데이트 | **슬라이드 애니메이션** | 흐름감 |
| 결과 리빌 | 즉시 표시 | **스태거드 fadeUp + confetti** | 감정적 보상 |
| 카드 등장 | 즉시 표시 | **스크롤 트리거 fadeUp** | 발견 재미 |
| 시즌 테마 | CSS 변수 3개 | **4개 변수 × 12시즌** | 시즌별 고유 아이덴티티 |
| 공유 버튼 | 하단 | **결과 헤더 직후** | 감정적 피크 활용 |
| 결과 카드 | 없음 | **Canvas 1200×630** | 소셜 공유 40배 |

### 12-4. 구현 우선순위

| 순서 | 작업 | Phase | 효과 |
|------|------|-------|------|
| 1 | 폰트 교체 (Inter → Be Vietnam Pro + Quicksand) | 1 | 가독성 + 브랜드 |
| 2 | Open Props CDN 추가 + 커스텀 토큰 정리 | 1 | 디자인 일관성 |
| 3 | 12시즌 고유 그라디언트 정의 | 1 | 시즌 아이덴티티 |
| 4 | 옵션 선택 피드백 애니메이션 | 1 | 퀴즈 경험 |
| 5 | 질문 전환 슬라이드 | 1 | 흐름감 |
| 6 | 결과 헤더 글래스모피즘 | 2 | 비주얼 임팩트 |
| 7 | 결과 스태거드 리빌 + confetti | 2 | 감정적 피크 |
| 8 | 스크롤 카드 등장 애니메이션 | 2 | 체류시간 |
| 9 | 공유 버튼 위치 + Zalo 추가 | 2 | 공유율 |
| 10 | Canvas 결과 카드 생성 | 2 | 바이럴 핵심 |

---

## 부록: 디자인 레퍼런스 모음

### A. K-뷰티 브랜드 디자인 레퍼런스

| 브랜드 | 디자인 특징 | 우리에게 배울 점 |
|--------|-----------|----------------|
| **Romand** | 더스티 로즈, chic 미니멀, 세리프 액센트 | 제품 카드 디자인, 컬러 도트 UI |
| **Laneige** | 워터/아쿠아 테마, 블루-화이트 그라디언트 | Cool 시즌 테마 레퍼런스 |
| **Innisfree** | 자연/그린, 오가닉 텍스처 | Autumn 시즌 테마 레퍼런스 |
| **Etude House** | 플레이풀 핑크, 귀여운 일러스트 | Spring 시즌 테마 레퍼런스 |
| **3CE** | 모던 미니멀, 모노톤 + 액센트 | 전체 UI 톤앤매너 |

### B. 2025-2026 웹 디자인 트렌드 적용 여부

| 트렌드 | 적용 | 이유 |
|--------|------|------|
| 글래스모피즘 (반투명 블러) | **적용** (결과 헤더) | 프리미엄 감성, 시즌 그라디언트와 시너지 |
| 네오 파스텔 그라디언트 | **적용** (12시즌 테마) | 뷰티 콘텐츠에 완벽 부합 |
| 다크 모드 | **미적용** | 뷰티/컬러 콘텐츠에 부적합 — 컬러 정확도 저하 |
| 뉴모피즘 | **미적용** | 접근성 문제, 복잡도 증가 |
| 3D 요소 | **미적용** | 성능 부담, 과잉 엔지니어링 |
| View Transitions API | **Phase 3 고려** | 브라우저 지원 확대 후 적용 (Safari 미지원) |
| CSS scroll-driven 애니메이션 | **Phase 3 고려** | Chrome 115+, Firefox 144+만 지원 |
| 마이크로인터랙션 | **적용** | 선택 피드백, 리빌, 스크롤 등장 |
| Confetti/축하 효과 | **적용** (Phase 2) | 결과 공개 감정적 보상 |
