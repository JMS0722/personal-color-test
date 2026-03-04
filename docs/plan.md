# Personal Color Test — 상세 구현 계획 (Input-Based Paging)

> 작성일: 2026-03-04
> 기반: research.md, design-strategy.md, implementation-plan.md, design-kit.md
> 원칙: Vanilla JS + ES Modules, 빌드 도구 없음, 모바일 퍼스트

### 구현 완료 상태 (2026-03-04)

| 섹션 | 상태 | 비고 |
|------|------|------|
| §2 핵심 변환 (오프셋→인풋 기반) | ✅ 완료 | quiz.js 전면 재작성 |
| §3 QUESTIONS 데이터 구조 재설계 | ✅ 완료 | primaryAxis, secondaryAxis, weight, phase 추가 |
| §4 퀴즈 엔진 재설계 (quiz.js) | ✅ 완료 | pickNextQuestion, getAxisConfidence, allAxesConfident |
| §5 상태 관리 변경 (state.js) | ✅ 완료 | currentQuestion, questionPath, scoreHistory 확장 |
| §6 프로그레스 바 & UX 변경 | ✅ 완료 | X / 12 표시, 조기 완료 시 "Hoàn thành!" |
| §7 goBack() 히스토리 스택 재설계 | ✅ 완료 | questionId + optionIdx 포함 |
| §8 시즌 판정 로직 영향 분석 | ✅ 완료 | 변경 없음 (계획대로) |
| §9 AI 분석 경로 영향 분석 | ✅ 완료 | 변경 없음 (계획대로) |
| §10 URL 공유/복원 영향 분석 | ✅ 완료 | 변경 없음 (계획대로) |
| §11 테스트 전략 변경 | ✅ 완료 | +42 테스트 추가 (202→244) |
| §13 전체 파일 변경 맵 | ✅ 완료 | 모든 파일 생성/수정 완료 |

---

## 목차

1. [기존 문서 대비 변경 사항 요약](#1-기존-문서-대비-변경-사항-요약)
2. [핵심 변환: 오프셋 페이징 → 인풋 기반 페이징](#2-핵심-변환-오프셋-페이징--인풋-기반-페이징)
3. [QUESTIONS 데이터 구조 재설계](#3-questions-데이터-구조-재설계)
4. [퀴즈 엔진 재설계 (quiz.js)](#4-퀴즈-엔진-재설계-quizjs)
5. [상태 관리 변경 (state.js)](#5-상태-관리-변경-statejs)
6. [프로그레스 바 & UX 변경](#6-프로그레스-바--ux-변경)
7. [goBack() 히스토리 스택 재설계](#7-goback-히스토리-스택-재설계)
8. [시즌 판정 로직 영향 분석](#8-시즌-판정-로직-영향-분석)
9. [AI 분석 경로 영향 분석](#9-ai-분석-경로-영향-분석)
10. [URL 공유/복원 영향 분석](#10-url-공유복원-영향-분석)
11. [테스트 전략 변경](#11-테스트-전략-변경)
12. [기존 문서 수정 필요 사항](#12-기존-문서-수정-필요-사항)
13. [전체 파일 변경 맵](#13-전체-파일-변경-맵)

---

## 1. 기존 문서 대비 변경 사항 요약

### 기존 문서에서 달라지는 부분

| 문서 | 영향받는 섹션 | 변경 내용 |
|------|-------------|----------|
| `implementation-plan.md` | §1-2 (script.js 구조), §3 STEP 1-3 (questions.js), STEP 1-4 (state.js), STEP 1-5 (quiz.js) | QUESTIONS 구조에 `primaryAxis`, `weight` 추가. state에 `questionPath` 추가. quiz.js 전면 재설계 |
| `implementation-plan.md` | §6 테스트 전략 | 분기 도달 가능성 테스트 추가, 질문 경로 다양성 테스트 추가 |
| `design-strategy.md` | §3-1 (퀴즈 설계) | "12문항 고정 순서" → "7-12문항 적응형" 변경 반영 |
| `design-kit.md` | §8 (애니메이션), 프로그레스바 섹션 | 프로그레스바가 고정 `X/12` 대신 예상 진행률 표시 |
| `research.md` | §4-1 (퀴즈 설계 패턴) | 이미 분기 로직 퀴즈 패턴을 언급 ("분기가 정보 수집 가속, 7문항") — 이 계획이 그 인사이트를 구현 |
| `CLAUDE.md` | 없음 | 변경 불필요 (3축 양극성 시스템, 12시즌, 판정 로직 동일) |

---

## 2. 핵심 변환: 오프셋 페이징 → 인풋 기반 페이징

### 2-1. 현재 방식 (오프셋 페이징)

**파일**: `script.js` 726-798줄

```javascript
// 현재: 고정 순서, 항상 12문항 전체 순회
let currentQ = 0;  // 오프셋 인덱스

function selectOption(idx, btn) {
  const opt = QUESTIONS[currentQ].options[idx];
  scores.temp += opt.temp;
  scores.depth += opt.depth;
  scores.clarity += opt.clarity;
  answers.push(idx);

  setTimeout(() => {
    currentQ++;                          // ← 항상 +1
    if (currentQ < QUESTIONS.length) {   // ← 항상 12개 전체
      renderQuestion();
    } else {
      showLoading();
    }
  }, 420);
}
```

**문제점**:
1. 사용자의 응답과 무관하게 항상 12문항 전체를 순회
2. 초반 응답으로 temp 축이 이미 강하게 결정되어도, temp 관련 추가 질문을 계속 물어봄
3. 불확실한 축에 대해 추가 질문을 할 수 없음
4. research.md 분석: 분기 로직 퀴즈는 7문항으로 동일한 정확도 달성 가능 ("분기가 정보 수집 가속")

### 2-2. 목표 방식 (인풋 기반 페이징)

**핵심 개념**: 사용자의 누적 응답(인풋)에 기반하여 다음 질문을 동적으로 결정

```
┌─ Q1 (tóc tự nhiên) ─── 응답 ──→ scores 갱신 ──→ 불확실 축 분석 ──→ 다음 Q 선택
│                                                                        │
├─ Q4 (tông da) ←────────────────────────────────────────────────────────┘
│    ↓ 응답
│  scores 갱신 → 불확실 축 분석 → ...
│
├─ Q11 (tương phản) ← depth+clarity 불확실
│    ↓ 응답
│  모든 축 확정 → showLoading()  ← 8문항만에 종료 가능
│
└─ (최대 12문항, 최소 7문항)
```

**접근 방식 비교**:

| 접근법 | 설명 | 장점 | 단점 |
|--------|------|------|------|
| **A. 정적 라우팅 맵** | 각 질문에 `getNext(scores) → nextId` | 구현 단순, 예측 가능 | 유연성 제한, 경로 수동 설계 필요 |
| **B. 동적 우선순위 큐** (채택) | 매 응답 후 가장 불확실한 축 평가 → 해당 축 질문 선택 | 자동 적응, 최소 질문 수, 확장 용이 | 경로 예측 어려움, 테스트 복잡 |
| **C. 결정 트리** | 고정 분기 트리 | 검증 용이 | 확장 불가, 질문 추가 시 트리 재설계 |

### 2-3. 채택 방식: 동적 우선순위 기반 인풋 페이징

**알고리즘 개요**:

```
1. 필수 질문 풀(Phase 1)에서 순서대로 시작 (Q1, Q4, Q5 — 각 축 1개씩)
2. Phase 1 완료 후, 매 응답마다:
   a. 각 축의 "확신도"(confidence) 계산
   b. 확신도가 임계값 미만인 축 중 가장 낮은 축 선택
   c. 해당 축의 미출제 질문 중 가중치 높은 것 선택
   d. 모든 축이 임계값 이상이면 → 종료 (showLoading)
3. 최대 12문항 도달 시 강제 종료
4. 최소 7문항 보장 (너무 빨리 끝나면 신뢰도 저하)
```

**트레이드오프**:

| 항목 | 오프셋 페이징 (현재) | 인풋 기반 페이징 (목표) |
|------|---------------------|----------------------|
| 질문 수 | 항상 12개 | 7-12개 (적응형) |
| 정확도 | 고정 (모든 데이터 수집) | 동등 또는 향상 (불확실 축 집중) |
| 사용자 경험 | 일부 질문이 중복 느낌 | "내 답변에 반응하는" 느낌 |
| 이탈률 | Q5-Q7 구간 이탈 위험 | 조기 종료로 이탈 감소 기대 |
| 구현 복잡도 | 매우 단순 | 중간 (확신도 계산 + 질문 선택 로직) |
| goBack() 복잡도 | 단순 (`currentQ--`) | 히스토리 스택 기반 |
| 프로그레스 바 | 확정적 (`X/12`) | 예상 기반 (불확실) |
| 테스트 | 12! 경로 ≈ 1개 | 다수 경로 검증 필요 |
| 결과 재현성 | 동일 응답 = 동일 경로 | 동일 응답 = 동일 결과 (경로는 다를 수 있음) |

---

## 3. QUESTIONS 데이터 구조 재설계

### 3-1. 현재 구조

**파일**: `script.js` 7-140줄 → 목표 `js/data/questions.js`

```javascript
// 현재: id, text, hint, options[4] (각각 temp/depth/clarity 점수)
const QUESTIONS = [
  {
    id: 1,
    text: "Màu tóc tự nhiên của bạn gần với màu nào nhất?",
    hint: "Hãy nghĩ về màu tóc khi chưa nhuộm",
    options: [
      { text: "Đen tuyền hoặc nâu rất đậm",   temp: -1, depth: -2, clarity: 1  },
      { text: "Nâu đậm ánh ấm (chocolate)",    temp:  1, depth: -1, clarity: 0  },
      { text: "Nâu sáng hoặc nâu hạt dẻ",      temp:  1, depth:  1, clarity: 0  },
      { text: "Nâu nhạt ánh vàng hoặc xám",    temp: -1, depth:  1, clarity: -1 }
    ]
  },
  // ... Q2-Q12
];
```

### 3-2. 새 구조

```javascript
// 새 구조: primaryAxis + weight + phase 추가
export const QUESTIONS = [
  {
    id: 1,
    text: "Màu tóc tự nhiên của bạn gần với màu nào nhất?",
    hint: "Hãy nghĩ về màu tóc khi chưa nhuộm",
    primaryAxis: 'depth',    // ← NEW: 이 질문이 주로 측정하는 축
    secondaryAxis: 'temp',   // ← NEW: 부가적으로 측정하는 축 (nullable)
    weight: 3,               // ← NEW: 해당 축에 대한 정보량 가중치 (1-3)
    phase: 1,                // ← NEW: 필수 단계 (1=필수 초기, 2=적응형 후보)
    options: [
      { text: "Đen tuyền hoặc nâu rất đậm",   temp: -1, depth: -2, clarity: 1  },
      { text: "Nâu đậm ánh ấm (chocolate)",    temp:  1, depth: -1, clarity: 0  },
      { text: "Nâu sáng hoặc nâu hạt dẻ",      temp:  1, depth:  1, clarity: 0  },
      { text: "Nâu nhạt ánh vàng hoặc xám",    temp: -1, depth:  1, clarity: -1 }
    ]
  },
  // ...
];
```

### 3-3. 12개 질문의 축 분류

현재 12개 질문의 옵션 점수를 분석하여 각 질문이 주로 측정하는 축을 분류:

| id | 질문 요약 | 최대 temp 범위 | 최대 depth 범위 | 최대 clarity 범위 | primaryAxis | secondaryAxis | weight | phase |
|----|----------|---------------|----------------|-----------------|-------------|---------------|--------|-------|
| 1 | 자연 머리색 | [-1, +1] = 2 | [-2, +1] = 3 | [-1, +1] = 2 | **depth** | temp | 3 | 1 |
| 2 | 햇빛 아래 머리색 | [-2, +2] = 4 | [-1, +1] = 2 | [0, +1] = 1 | **temp** | depth | 2 | 2 |
| 3 | 눈 색 | [-1, +1] = 2 | [-1, +1] = 2 | [-1, +1] = 2 | **temp** | clarity | 2 | 2 |
| 4 | 자연 피부 톤 | [-1, +1] = 2 | [-2, +2] = 4 | [0, 0] = 0 | **depth** | temp | 3 | 1 |
| 5 | 혈관 색 | [-2, +2] = 4 | [-1, 0] = 1 | [0, 0] = 0 | **temp** | — | 3 | 1 |
| 6 | 어울리는 보석 | [-2, +2] = 4 | [0, +1] = 1 | [0, 0] = 0 | **temp** | — | 2 | 2 |
| 7 | 햇빛 반응 | [-1, +1] = 2 | [-2, +2] = 4 | [-1, +1] = 2 | **depth** | clarity | 2 | 2 |
| 8 | 자연 입술색 | [-1, +1] = 2 | [-1, +1] = 2 | [-1, +1] = 2 | **clarity** | temp | 2 | 2 |
| 9 | 어울리는 화이트 | [-1, +1] = 2 | [0, 0] = 0 | [-2, +2] = 4 | **clarity** | temp | 3 | 1 |
| 10 | 칭찬받는 의상색 | [-1, +2] = 3 | [-1, +1] = 2 | [-1, +2] = 3 | **temp** | clarity | 3 | 2 |
| 11 | 대비도 | [0, 0] = 0 | [-1, +1] = 2 | [-2, +2] = 4 | **clarity** | depth | 3 | 2 |
| 12 | 외모 인상 | [-1, +1] = 2 | [-1, +1] = 2 | [-2, +2] = 4 | **clarity** | depth | 2 | 2 |

### 3-4. Phase 1 필수 질문 (4개)

모든 사용자가 반드시 답해야 하는 초기 질문. 각 축에 대해 최소 1개의 강한(weight: 3) 질문 배치:

| 순서 | id | 질문 | primaryAxis | 근거 |
|------|----|------|-------------|------|
| 1st | 1 | 자연 머리색 | depth | 시각적 질문 → 높은 참여율, depth 범위 [-2, +1] |
| 2nd | 5 | 혈관 색 | temp | 명확한 판별력, temp 범위 [-2, +2] |
| 3rd | 9 | 어울리는 화이트 | clarity | clarity 범위 [-2, +2], 직관적 |
| 4th | 4 | 자연 피부 톤 | depth | depth 보강 + temp 부가 정보, depth 범위 [-2, +2] |

> Phase 1 이후 최소 3개 축 모두에 대해 초기 데이터 확보

### 3-5. Phase 2 적응형 후보 질문 (8개)

인풋 기반 페이징 엔진이 축 확신도에 따라 동적으로 선택:

```
temp 축 후보: Q2(w:2), Q3(w:2), Q6(w:2), Q10(w:3)  — 4개
depth 축 후보: Q7(w:2)                                — 1개
clarity 축 후보: Q8(w:2), Q11(w:3), Q12(w:2)          — 3개
```

**코드 스니펫 — 새 QUESTIONS 데이터**:

```javascript
// js/data/questions.js

export const QUESTIONS = [
  // ===== Phase 1: 필수 질문 (항상 이 순서로 출제) =====
  {
    id: 1, phase: 1,
    text: "Màu tóc tự nhiên của bạn gần với màu nào nhất?",
    hint: "Hãy nghĩ về màu tóc khi chưa nhuộm",
    primaryAxis: 'depth', secondaryAxis: 'temp', weight: 3,
    options: [
      { text: "Đen tuyền hoặc nâu rất đậm",   temp: -1, depth: -2, clarity: 1  },
      { text: "Nâu đậm ánh ấm (chocolate)",    temp:  1, depth: -1, clarity: 0  },
      { text: "Nâu sáng hoặc nâu hạt dẻ",      temp:  1, depth:  1, clarity: 0  },
      { text: "Nâu nhạt ánh vàng hoặc xám",    temp: -1, depth:  1, clarity: -1 }
    ]
  },
  {
    id: 5, phase: 1,
    text: "Nhìn mặt trong của cổ tay, mạch máu bạn có màu gì?",
    hint: "Xem dưới ánh sáng tự nhiên",
    primaryAxis: 'temp', secondaryAxis: null, weight: 3,
    options: [
      { text: "Xanh lam hoặc tím rõ rệt",     temp: -2, depth: 0, clarity: 0 },
      { text: "Xanh lục hoặc olive",            temp:  2, depth: 0, clarity: 0 },
      { text: "Hỗn hợp xanh lam và xanh lục",  temp:  0, depth: 0, clarity: 0 },
      { text: "Khó nhìn thấy rõ",               temp:  0, depth: -1, clarity: 0 }
    ]
  },
  {
    id: 9, phase: 1,
    text: "Màu trắng nào làm bạn trông tươi sáng hơn?",
    hint: "So sánh khi mặc áo trắng hoặc giữ vải trắng gần mặt",
    primaryAxis: 'clarity', secondaryAxis: 'temp', weight: 3,
    options: [
      { text: "Trắng tinh (pure white) — rõ ràng, sắc nét", temp: -1, depth: 0, clarity:  2 },
      { text: "Trắng kem (ivory) — mềm mại, ấm áp",         temp:  1, depth: 0, clarity: -1 },
      { text: "Trắng ngà (off-white) — nhẹ nhàng",           temp:  0, depth: 0, clarity: -2 },
      { text: "Không thấy khác biệt rõ",                      temp:  0, depth: 0, clarity:  0 }
    ]
  },
  {
    id: 4, phase: 1,
    text: "Tông da tự nhiên của bạn (khu vực ít tiếp xúc nắng) như thế nào?",
    hint: "Nhìn phần trong cánh tay hoặc bụng",
    primaryAxis: 'depth', secondaryAxis: 'temp', weight: 3,
    options: [
      { text: "Trắng sáng, hơi hồng hoặc xanh nhạt", temp: -1, depth:  2, clarity:  0 },
      { text: "Trắng kem ấm, hơi vàng",                temp:  1, depth:  1, clarity:  0 },
      { text: "Trung bình, nâu mật ong ấm",            temp:  1, depth: -1, clarity:  0 },
      { text: "Nâu sẫm hoặc nâu olive",                temp: -1, depth: -2, clarity:  0 }
    ]
  },

  // ===== Phase 2: 적응형 후보 질문 (엔진이 동적 선택) =====
  {
    id: 2, phase: 2,
    text: "Khi ra ngoài nắng, tóc bạn ánh lên màu gì?",
    hint: "Quan sát dưới ánh sáng tự nhiên",
    primaryAxis: 'temp', secondaryAxis: 'depth', weight: 2,
    options: [
      { text: "Ánh đỏ hoặc đồng ấm",          temp:  2, depth:  0, clarity: 0  },
      { text: "Ánh vàng mật ong",               temp:  1, depth:  1, clarity: 0  },
      { text: "Không thấy ánh gì rõ, vẫn đậm", temp: -1, depth: -1, clarity: 1  },
      { text: "Ánh xám hoặc xanh nhẹ",          temp: -2, depth:  0, clarity: 0  }
    ]
  },
  {
    id: 3, phase: 2,
    text: "Màu mắt của bạn gần nhất với mô tả nào?",
    hint: "Nhìn kỹ trong gương dưới ánh sáng tự nhiên",
    primaryAxis: 'temp', secondaryAxis: 'clarity', weight: 2,
    options: [
      { text: "Đen đậm, tròng mắt khó phân biệt", temp: -1, depth: -1, clarity:  1 },
      { text: "Nâu đậm ấm, ánh hổ phách",          temp:  1, depth: -1, clarity:  0 },
      { text: "Nâu sáng hoặc nâu nhạt mềm mại",    temp:  1, depth:  1, clarity: -1 },
      { text: "Nâu xám hoặc đen mát, viền rõ",      temp: -1, depth:  0, clarity:  1 }
    ]
  },
  {
    id: 6, phase: 2,
    text: "Bạn thấy mình đẹp hơn khi đeo trang sức màu gì?",
    hint: "Nghĩ đến lúc được khen đẹp nhất",
    primaryAxis: 'temp', secondaryAxis: null, weight: 2,
    options: [
      { text: "Vàng gold — làm da sáng lên",       temp:  2, depth:  0, clarity: 0 },
      { text: "Bạc / Bạch kim — trông thanh lịch",  temp: -2, depth:  0, clarity: 0 },
      { text: "Vàng hồng (rose gold)",              temp:  1, depth:  1, clarity: 0 },
      { text: "Cả hai đều được, không khác biệt",   temp:  0, depth:  0, clarity: 0 }
    ]
  },
  {
    id: 7, phase: 2,
    text: "Khi tiếp xúc nắng, da bạn thường phản ứng thế nào?",
    hint: "Sau khoảng 30 phút dưới nắng không kem chống nắng",
    primaryAxis: 'depth', secondaryAxis: 'clarity', weight: 2,
    options: [
      { text: "Dễ bị cháy đỏ, khó rám nắng",       temp: -1, depth:  2, clarity:  1 },
      { text: "Hơi đỏ trước, sau đó rám nhẹ",       temp:  0, depth:  1, clarity:  0 },
      { text: "Ít khi cháy, rám nắng dễ dàng",      temp:  1, depth: -1, clarity:  0 },
      { text: "Không bao giờ cháy, rám rất nhanh",   temp:  1, depth: -2, clarity: -1 }
    ]
  },
  {
    id: 8, phase: 2,
    text: "Màu môi tự nhiên (không son) của bạn gần nhất với?",
    hint: "Nhìn trong gương không trang điểm",
    primaryAxis: 'clarity', secondaryAxis: 'temp', weight: 2,
    options: [
      { text: "Hồng đào nhạt, gần nude",            temp:  1, depth:  1, clarity: -1 },
      { text: "Hồng berry mát, hơi tím",            temp: -1, depth:  0, clarity:  0 },
      { text: "Đỏ hồng tự nhiên, rõ ràng",          temp:  0, depth:  0, clarity:  1 },
      { text: "Nâu hồng hoặc cam đất",              temp:  1, depth: -1, clarity:  0 }
    ]
  },
  {
    id: 10, phase: 2,
    text: "Màu quần áo nào bạn hay được khen \"hợp quá\"?",
    hint: "Nghĩ về những lần được compliment nhiều nhất",
    primaryAxis: 'temp', secondaryAxis: 'clarity', weight: 3,
    options: [
      { text: "San hô, cam đào, vàng ấm",           temp:  2, depth:  1, clarity:  1 },
      { text: "Hồng pastel, xanh lavender, baby blue", temp: -1, depth:  1, clarity: -1 },
      { text: "Đỏ đô, xanh rêu, cam đất, nâu caramel", temp:  1, depth: -1, clarity: -1 },
      { text: "Đỏ tươi, xanh cobalt, đen, trắng tinh",  temp: -1, depth: -1, clarity:  2 }
    ]
  },
  {
    id: 11, phase: 2,
    text: "Mức độ tương phản giữa tóc, da và mắt của bạn?",
    hint: "Nhìn tổng thể khuôn mặt trong gương",
    primaryAxis: 'clarity', secondaryAxis: 'depth', weight: 3,
    options: [
      { text: "Rất cao — tóc rất đậm, da rất sáng",    temp:  0, depth:  0, clarity:  2 },
      { text: "Cao — có sự khác biệt rõ ràng",          temp:  0, depth: -1, clarity:  1 },
      { text: "Trung bình — hài hòa, không quá nổi bật", temp:  0, depth:  0, clarity:  0 },
      { text: "Thấp — tóc, da, mắt gần cùng tông",      temp:  0, depth:  1, clarity: -2 }
    ]
  },
  {
    id: 12, phase: 2,
    text: "Tổng thể, người khác thường mô tả vẻ ngoài bạn là?",
    hint: "Ấn tượng đầu tiên khi gặp bạn",
    primaryAxis: 'clarity', secondaryAxis: 'depth', weight: 2,
    options: [
      { text: "Tươi sáng, trẻ trung, rạng rỡ",       temp:  0, depth:  0, clarity:  2 },
      { text: "Dịu dàng, thanh nhã, nhẹ nhàng",       temp:  0, depth:  1, clarity: -2 },
      { text: "Ấm áp, trưởng thành, sang trọng",      temp:  1, depth: -1, clarity: -1 },
      { text: "Sắc sảo, ấn tượng, cá tính mạnh",     temp: -1, depth: -1, clarity:  2 }
    ]
  }
];

// Phase 1 질문 ID 목록 (순서 보장)
export const PHASE1_IDS = [1, 5, 9, 4];

// 축별 Phase 2 질문 ID 목록 (weight 내림차순)
export const AXIS_QUESTIONS = {
  temp:    [10, 2, 3, 6],   // weight: 3, 2, 2, 2
  depth:   [7],              // weight: 2
  clarity: [11, 8, 12]       // weight: 3, 2, 2
};
```

**트레이드오프 — QUESTIONS 구조 변경**:

| 항목 | 판단 |
|------|------|
| **하위 호환성** | 기존 옵션의 temp/depth/clarity 점수는 변경 없음 → `determineSeason()` 결과 동일 보장 |
| **id 순서 vs 출제 순서** | id는 기존 유지 (1-12), 출제 순서는 phase + 엔진 결정 → 이전 테스트의 `QUESTIONS[i].id === i+1` 검증 깨짐 → 테스트 수정 필요 |
| **depth 축 후보 부족** | Phase 2에 depth 질문이 Q7 하나뿐 → depth 불확실 시 temp/clarity 질문의 부가 depth 점수에 의존. **대안**: Q2(secondaryAxis: depth)를 depth 불확실 시에도 후보로 포함 |
| **새 필드 추가량** | 질문당 3개 필드 추가 (primaryAxis, secondaryAxis, weight, phase) → 데이터 크기 미미 |

---

## 4. 퀴즈 엔진 재설계 (quiz.js)

### 4-1. 현재 quiz.js (오프셋 방식)

**파일**: `script.js` 726-798줄

```javascript
// 현재: 선형 순회
function startQuiz() {
  currentQ = 0;                    // ← 오프셋 리셋
  scores = { temp: 0, depth: 0, clarity: 0 };
  answers = [];
  scoreHistory = [];
  currentSeason = null;
  showScreen('quiz-screen');
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[currentQ];   // ← 오프셋으로 질문 접근
  const pct = Math.round(((currentQ + 1) / QUESTIONS.length) * 100);
  // ...
}

function selectOption(idx, btn) {
  // ... 점수 누적 ...
  setTimeout(() => {
    currentQ++;                    // ← 항상 +1
    if (currentQ < QUESTIONS.length) renderQuestion();
    else showLoading();
  }, 420);
}
```

### 4-2. 새 quiz.js (인풋 기반 엔진)

**파일**: `js/quiz.js`

```javascript
import { QUESTIONS, PHASE1_IDS, AXIS_QUESTIONS } from './data/questions.js';
import { state, resetQuizState } from './state.js';
import { showScreen, showLoading } from './app.js';

// ========================================
// 상수
// ========================================
const MIN_QUESTIONS = 7;      // 최소 질문 수 (신뢰도 확보)
const MAX_QUESTIONS = 12;     // 최대 질문 수 (= 현재와 동일)
const CONFIDENCE_THRESHOLD = 3; // 축당 확신도 임계값

// 질문을 id로 빠르게 찾기 위한 맵
const QUESTION_MAP = new Map();
QUESTIONS.forEach(q => QUESTION_MAP.set(q.id, q));

// ========================================
// 확신도 계산
// ========================================

/**
 * 특정 축에 대한 확신도를 계산합니다.
 *
 * 확신도 = |누적 점수| + (해당 축 응답 횟수 × 0.5)
 *
 * - 누적 점수의 절대값이 클수록 해당 축의 방향이 명확
 * - 같은 축에 대해 여러 번 답할수록 보너스
 *
 * @param {string} axis - 'temp' | 'depth' | 'clarity'
 * @returns {number} 확신도 (0 이상)
 */
function getAxisConfidence(axis) {
  const absScore = Math.abs(state.scores[axis]);

  // 해당 축을 primaryAxis로 가진 질문 중 이미 답한 수
  const answeredCount = state.questionPath.filter(qId => {
    const q = QUESTION_MAP.get(qId);
    return q && q.primaryAxis === axis;
  }).length;

  return absScore + (answeredCount * 0.5);
}

/**
 * 모든 축이 확신도 임계값을 충족하는지 확인합니다.
 */
function allAxesConfident() {
  return ['temp', 'depth', 'clarity'].every(
    axis => getAxisConfidence(axis) >= CONFIDENCE_THRESHOLD
  );
}

// ========================================
// 다음 질문 선택
// ========================================

/**
 * 인풋 기반 페이징의 핵심: 다음 질문을 결정합니다.
 *
 * 알고리즘:
 * 1. Phase 1 질문이 남아있으면 → 순서대로 출제
 * 2. Phase 1 완료 후:
 *    a. 모든 축 확신도 ≥ 임계값 AND 최소 질문 수 충족 → 종료
 *    b. 가장 불확실한 축 선택
 *    c. 해당 축의 미출제 질문 중 weight 가장 높은 것 선택
 *    d. 해당 축 질문이 없으면 → 전체 미출제 중 weight 높은 것
 *    e. 모든 질문 소진 → 종료
 *
 * @returns {object|null} 다음 질문 객체, 또는 null (종료)
 */
function pickNextQuestion() {
  const asked = new Set(state.questionPath);
  const totalAsked = asked.size;

  // --- Phase 1: 필수 질문 순서대로 ---
  for (const id of PHASE1_IDS) {
    if (!asked.has(id)) {
      return QUESTION_MAP.get(id);
    }
  }

  // --- Phase 2: 적응형 선택 ---

  // 최대 질문 수 도달 → 강제 종료
  if (totalAsked >= MAX_QUESTIONS) return null;

  // 모든 축 확신 + 최소 질문 수 충족 → 조기 종료
  if (totalAsked >= MIN_QUESTIONS && allAxesConfident()) return null;

  // 가장 불확실한 축 찾기
  const axes = ['temp', 'depth', 'clarity'];
  const leastConfidentAxis = axes.reduce((lowest, axis) => {
    const conf = getAxisConfidence(axis);
    const lowestConf = getAxisConfidence(lowest);
    return conf < lowestConf ? axis : lowest;
  });

  // 해당 축의 미출제 질문 (weight 내림차순)
  const candidates = (AXIS_QUESTIONS[leastConfidentAxis] || [])
    .filter(id => !asked.has(id))
    .map(id => QUESTION_MAP.get(id))
    .filter(Boolean)
    .sort((a, b) => b.weight - a.weight);

  if (candidates.length > 0) return candidates[0];

  // 해당 축 질문 소진 → secondaryAxis로 관련된 미출제 질문 탐색
  const fallbackCandidates = QUESTIONS
    .filter(q => !asked.has(q.id) && q.phase === 2)
    .filter(q => q.primaryAxis === leastConfidentAxis || q.secondaryAxis === leastConfidentAxis)
    .sort((a, b) => b.weight - a.weight);

  if (fallbackCandidates.length > 0) return fallbackCandidates[0];

  // 모든 관련 질문 소진 → 남은 미출제 질문 중 아무거나
  const remaining = QUESTIONS
    .filter(q => !asked.has(q.id))
    .sort((a, b) => b.weight - a.weight);

  return remaining.length > 0 ? remaining[0] : null;
}

// ========================================
// 퀴즈 플로우
// ========================================

export function startQuiz() {
  resetQuizState();
  showScreen('quiz-screen');
  renderQuestion();
}

export function renderQuestion() {
  const nextQ = state.currentQuestion;
  if (!nextQ) {
    showLoading();
    return;
  }

  // 프로그레스: 예상 진행률
  const asked = state.questionPath.length;
  const estimated = estimateRemainingQuestions();
  const total = asked + estimated;
  const pct = Math.round(((asked + 1) / Math.max(total, asked + 1)) * 100);

  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent =
    `${asked + 1} / ~${total}`;

  document.getElementById('question-text').textContent = nextQ.text;
  document.getElementById('question-hint').textContent = nextQ.hint || '';

  const backBtn = document.getElementById('back-btn');
  backBtn.disabled = state.questionPath.length === 0;

  const list = document.getElementById('options-list');
  list.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  nextQ.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-letter">${letters[idx]}</span><span>${opt.text}</span>`;
    btn.onclick = () => selectOption(idx, btn);
    list.appendChild(btn);
  });
}

export function selectOption(idx, btn) {
  // 더블클릭 방지
  document.querySelectorAll('.option-btn').forEach(b => { b.disabled = true; });
  btn.classList.add('selected');

  const q = state.currentQuestion;
  const opt = q.options[idx];

  // 히스토리 저장 (goBack용)
  state.scoreHistory.push({
    questionId: q.id,
    optionIdx: idx,
    temp: opt.temp,
    depth: opt.depth,
    clarity: opt.clarity
  });

  // 점수 누적
  state.scores.temp += opt.temp;
  state.scores.depth += opt.depth;
  state.scores.clarity += opt.clarity;

  // 경로 기록
  state.questionPath.push(q.id);
  state.answers.push(idx);

  // 다음 질문 결정 (인풋 기반)
  setTimeout(() => {
    const next = pickNextQuestion();
    state.currentQuestion = next;
    if (next) {
      renderQuestion();
    } else {
      showLoading();
    }
  }, 420);
}

/**
 * 남은 예상 질문 수를 추정합니다.
 * 프로그레스 바 표시용.
 */
function estimateRemainingQuestions() {
  const asked = new Set(state.questionPath);
  let remaining = 0;

  // Phase 1 남은 질문 수
  for (const id of PHASE1_IDS) {
    if (!asked.has(id)) remaining++;
  }

  // Phase 2: 불확실 축당 예상 1-2문항
  const axes = ['temp', 'depth', 'clarity'];
  for (const axis of axes) {
    if (getAxisConfidence(axis) < CONFIDENCE_THRESHOLD) {
      const available = (AXIS_QUESTIONS[axis] || []).filter(id => !asked.has(id)).length;
      remaining += Math.min(available, 2); // 축당 최대 2문항 추가 예상
    }
  }

  return Math.max(remaining, 1); // 최소 1개는 남아있다고 표시
}

export function goBack() {
  if (state.questionPath.length === 0) return;

  // 마지막 히스토리 복원
  const last = state.scoreHistory.pop();
  state.scores.temp -= last.temp;
  state.scores.depth -= last.depth;
  state.scores.clarity -= last.clarity;

  // 경로에서 마지막 질문 제거
  state.questionPath.pop();
  state.answers.pop();

  // 이전 질문 복원
  if (state.questionPath.length === 0) {
    // 처음으로 돌아감 → Phase 1 첫 질문
    state.currentQuestion = QUESTION_MAP.get(PHASE1_IDS[0]);
  } else {
    // 마지막에 답한 질문의 "다음"을 다시 계산
    // → 즉, pop된 질문을 다시 보여줌
    state.currentQuestion = QUESTION_MAP.get(last.questionId);
  }

  renderQuestion();
}
```

### 4-3. 트레이드오프 — 퀴즈 엔진

| 항목 | 분석 |
|------|------|
| **결과 동일성** | 동일한 12개 질문에 동일하게 답하면 → 동일한 scores → 동일한 시즌 결과. 단, 질문 순서와 출제 여부가 다를 수 있어 부분 응답 시 경로에 따라 결과 차이 가능 |
| **확신도 임계값 (3)** | CONFIDENCE_THRESHOLD = 3은 보수적 설정. 예: `|temp| = 2` + `temp 질문 2회 답변` = `2 + 1 = 3` → 통과. 임계값을 낮추면(2) 더 빨리 끝나지만 정확도 하락 위험. 높이면(4) 현재와 비슷하게 10-12문항 |
| **최소 7문항** | research.md 인사이트 ("분기 로직 7문항") 기반. 너무 빨리 끝나면 사용자가 "진짜 분석한 거 맞아?" 의심 → 신뢰도 저하 |
| **depth 축 질문 부족** | Phase 2에 depth 전용 질문이 Q7 하나뿐. Q1, Q4 (Phase 1)에서 강한 depth 데이터 수집하므로 대부분의 경우 Phase 2에서 depth 추가 불필요. 극단적 중립 응답(depth=0) 시에만 Q7 출제 |
| **프로그레스 바 불확실성** | `~N`으로 예상치 표시 → 사용자 혼란 가능. 대안: 프로그레스 바 대신 "분석 중..." 텍스트만, 또는 3축 확신도 시각화 |

---

## 5. 상태 관리 변경 (state.js)

### 5-1. 현재 상태

**파일**: `script.js` 706-716줄

```javascript
let currentQ = 0;                    // 오프셋 인덱스
let scores = { temp: 0, depth: 0, clarity: 0 };
let answers = [];                    // [optionIdx, optionIdx, ...]
let scoreHistory = [];               // [{temp, depth, clarity}, ...]
let currentSeason = null;
```

### 5-2. 새 상태

**파일**: `js/state.js`

```javascript
export const state = {
  // 퀴즈 상태
  currentQuestion: null,             // ← NEW: 현재 표시 중인 질문 객체 (오프셋 아님)
  scores: { temp: 0, depth: 0, clarity: 0 },
  answers: [],                       // [optionIdx, ...] — 답한 순서대로
  questionPath: [],                  // ← NEW: [questionId, ...] — 실제 출제된 질문 ID 순서
  scoreHistory: [],                  // ← CHANGED: [{questionId, optionIdx, temp, depth, clarity}, ...]
  currentSeason: null,

  // AI Camera
  cameraStream: null,
  facingMode: 'user',
  capturedImageData: null,
};

export function resetQuizState() {
  state.currentQuestion = null;
  state.scores = { temp: 0, depth: 0, clarity: 0 };
  state.answers = [];
  state.questionPath = [];
  state.scoreHistory = [];
  state.currentSeason = null;
}
```

### 5-3. 상태 변경 상세

| 필드 | 현재 | 변경 | 이유 |
|------|------|------|------|
| `currentQ` | `number` (오프셋) | **삭제** → `currentQuestion` (질문 객체) | 오프셋 인덱스 불필요 — 질문이 순서대로 출제되지 않음 |
| `answers` | `[idx, ...]` | 동일 | 옵션 인덱스 기록은 동일하게 유지 |
| `questionPath` | 없음 | **신규** `[questionId, ...]` | 실제 출제 순서 기록 — goBack, 프로그레스, 디버깅에 필수 |
| `scoreHistory` | `[{temp, depth, clarity}]` | `[{questionId, optionIdx, temp, depth, clarity}]` | goBack 시 어떤 질문으로 돌아갈지 결정하기 위해 questionId 필요 |
| `currentSeason` | 동일 | 동일 | 영향 없음 |

**트레이드오프**:
- `currentQuestion`이 질문 객체 참조 → 메모리 미미 (12개 질문 객체 원본 참조)
- `questionPath`가 추가 배열 → 최대 12개 number → 무시할 수준
- `scoreHistory` 엔트리당 2개 필드 추가 (questionId, optionIdx) → 무시할 수준

---

## 6. 프로그레스 바 & UX 변경

### 6-1. 현재 프로그레스 바

**파일**: `script.js` 738-741줄

```javascript
const pct = Math.round(((currentQ + 1) / QUESTIONS.length) * 100);
document.getElementById('progress-fill').style.width = pct + '%';
document.getElementById('progress-text').textContent = `${currentQ + 1} / ${QUESTIONS.length}`;
// 결과: "5 / 12" (확정적)
```

### 6-2. 방안 비교

| 방안 | 표시 예시 | 장점 | 단점 |
|------|----------|------|------|
| **A. 예상 표시** | `5 / ~9` | 남은 양 감각 있음 | `~`가 불안정 느낌 |
| **B. 답변 수만 표시** | `Câu 5` | 깔끔, 혼란 없음 | 전체 진행률 알 수 없음 |
| **C. 3축 확신도 시각화** | 3개 미니 바 | 과학적 느낌, 몰입도↑ | UI 복잡, 모바일 공간 부족 |
| **D. 확정 최대값 표시** (채택) | `5 / 12` | 현재와 동일한 UX, 혼란 없음 | 조기 종료 시 "7/12"에서 갑자기 끝남 |

### 6-3. 채택: 방안 D (확정 최대값) + 조기종료 안내

```javascript
// js/quiz.js — renderQuestion 내
function renderQuestion() {
  const nextQ = state.currentQuestion;
  if (!nextQ) {
    showLoading();
    return;
  }

  const asked = state.questionPath.length;

  // 항상 "X / 12"로 표시 — 현재 UX와 동일
  const pct = Math.round(((asked + 1) / MAX_QUESTIONS) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = `${asked + 1} / ${MAX_QUESTIONS}`;

  // ... 나머지 렌더링 동일
}
```

**조기 종료 시 UX**: 프로그레스 바를 100%로 채우면서 전환

```javascript
// selectOption 내, 종료 시점
setTimeout(() => {
  const next = pickNextQuestion();
  state.currentQuestion = next;
  if (next) {
    renderQuestion();
  } else {
    // 조기 종료: 프로그레스 바 100%로 채우고 로딩 전환
    document.getElementById('progress-fill').style.width = '100%';
    document.getElementById('progress-text').textContent = 'Hoàn thành!';
    setTimeout(() => showLoading(), 300);
  }
}, 420);
```

**트레이드오프**:
- 방안 D는 "12문항 중 7번째에서 갑자기 끝남" → 사용자가 "왜 끝났지?" 의문
- → **해결**: 로딩 화면에 "Đã thu thập đủ dữ liệu để phân tích chính xác!" 메시지 추가
- 향후 방안 C (3축 시각화)로 업그레이드 가능 — 현재는 최소 변경으로 출발

### 6-4. 로딩 화면 변경

**파일**: `index.html` 222-237줄

```html
<!-- 현재 -->
<h2 class="loading-title">Đang phân tích màu sắc của bạn...</h2>
<p class="loading-sub">Chúng tôi đang tìm mùa màu phù hợp nhất</p>

<!-- 변경: 적응형 퀴즈 완료 메시지 추가 -->
<h2 class="loading-title">Đang phân tích màu sắc của bạn...</h2>
<p class="loading-sub" id="loading-sub">Chúng tôi đang tìm mùa màu phù hợp nhất</p>
```

```javascript
// js/app.js — showLoading() 내 추가
export function showLoading() {
  showScreen('loading-screen');

  // 적응형 퀴즈 완료 메시지
  const answered = state.questionPath.length;
  if (answered < MAX_QUESTIONS) {
    document.getElementById('loading-sub').textContent =
      `Đã thu thập đủ thông tin sau ${answered} câu hỏi — đang phân tích chính xác!`;
  } else {
    document.getElementById('loading-sub').textContent =
      'Chúng tôi đang tìm mùa màu phù hợp nhất';
  }

  // 기존 로딩 애니메이션 동일 ...
}
```

---

## 7. goBack() 히스토리 스택 재설계

### 7-1. 현재 goBack()

**파일**: `script.js` 787-798줄

```javascript
function goBack() {
  if (currentQ === 0) return;
  const last = scoreHistory.pop();
  scores.temp -= last.temp;
  scores.depth -= last.depth;
  scores.clarity -= last.clarity;
  answers.pop();
  currentQ--;              // ← 단순히 -1
  renderQuestion();        // ← QUESTIONS[currentQ] 렌더
}
```

### 7-2. 새 goBack()

**파일**: `js/quiz.js` (위의 4-2에 포함)

```javascript
export function goBack() {
  if (state.questionPath.length === 0) return;

  // 1. 마지막 히스토리 꺼내기
  const last = state.scoreHistory.pop();

  // 2. 점수 되돌리기
  state.scores.temp -= last.temp;
  state.scores.depth -= last.depth;
  state.scores.clarity -= last.clarity;

  // 3. 경로에서 마지막 질문 제거
  state.questionPath.pop();
  state.answers.pop();

  // 4. 되돌아갈 질문 결정
  //    → 방금 pop한 질문을 다시 보여줌
  state.currentQuestion = QUESTION_MAP.get(last.questionId);

  renderQuestion();
}
```

**핵심 차이점**:

| 항목 | 현재 | 새 방식 |
|------|------|--------|
| 되돌아갈 위치 | `currentQ--` (이전 인덱스) | `scoreHistory`에서 pop한 `questionId`로 복원 |
| 복원 대상 | 점수만 | 점수 + 질문 경로 + 답변 |
| 히스토리 구조 | `{temp, depth, clarity}` | `{questionId, optionIdx, temp, depth, clarity}` |
| 다시 답하면? | 같은 질문 보여줌 (오프셋 불변) | 같은 질문 보여줌 → 답하면 `pickNextQuestion()`이 새 경로 계산 |

**트레이드오프**:
- goBack 후 다시 다른 옵션을 선택하면, 이후 출제 경로가 달라질 수 있음 → 의도한 동작 (적응형이므로)
- 사용자가 혼란스러울 수 있음 ("아까는 Q3 다음에 Q7이었는데 지금은 Q11이 나옴") → 하지만 사용자는 질문 번호를 보지 않으므로 체감 영향 없음

---

## 8. 시즌 판정 로직 영향 분석

### 8-1. getBaseSeason / getSubtype / determineSeason

**파일**: `script.js` 822-883줄 → `js/scoring.js`

```javascript
function getBaseSeason(temp, depth, clarity) {
  const affinities = {
    spring: temp + depth + clarity,     // Warm + Light + Clear
    summer: -temp + depth - clarity,    // Cool + Light + Soft
    autumn: temp - depth - clarity,     // Warm + Dark + Soft
    winter: -temp - depth + clarity     // Cool + Dark + Clear
  };
  // ... 최고 affinity 반환
}

function getSubtype(baseSeason, temp, depth, clarity) {
  // ... 지배축 기반 서브타입 반환
}

function determineSeason() {
  const { temp, depth, clarity } = scores;
  const baseSeason = getBaseSeason(temp, depth, clarity);
  const subtype = getSubtype(baseSeason, temp, depth, clarity);
  currentSeason = SEASONS[subtype];
}
```

### 8-2. 영향 분석

**변경 필요 없음**.

판정 로직은 최종 `scores.temp`, `scores.depth`, `scores.clarity` 값만 사용합니다.
인풋 기반 페이징은 질문 선택 순서와 출제 수를 바꾸지만, 각 옵션의 점수 값은 동일합니다.

**단, 주의할 점**:

| 시나리오 | 현재 (12문항 전체) | 인풋 기반 (7-12문항) | 영향 |
|----------|------------------|---------------------|------|
| 동일 사용자가 동일 응답 12개 | scores = (5, -3, 4) | 8문항만 답하면 scores = (3, -2, 3) | **결과 달라질 수 있음** |
| 극단적 응답 (모든 옵션 max) | 항상 동일 | 조기 종료로 일부 점수 미반영 | 점수 스케일 축소 → affinity 순서는 대체로 유지 |
| 중립 응답 (모두 0점 옵션) | scores ≈ (0, 0, 0) | 확신도 낮음 → 12문항 전체 출제 | **현재와 동일** |

**결론**: 판정 로직 코드 변경 불필요. 다만 인풋 기반 페이징으로 전체 질문이 줄어들면 점수 범위가 축소되므로, `getBaseSeason`의 affinity 공식은 점수 규모에 무관하게 작동 (부호+비율 기반) → 12시즌 도달 가능성에는 영향 없음.

**검증 필요**: 테스트에서 7문항만으로도 12시즌 전체가 도달 가능한지 확인 (§11 참조).

---

## 9. AI 분석 경로 영향 분석

### 9-1. AI 분석 흐름

**파일**: `script.js` 1080-1449줄 → `js/ai-analysis.js`

```
카메라/업로드 → capturePhoto()/handleUpload()
  → analyzePhoto()
    → extractFaceColors() → 피부/머리/눈 RGB 추출
    → analyzeColorsToScores() → {temp, depth, clarity} 생성
    → scores = 결과
    → determineSeason()
    → renderResult()
```

### 9-2. 영향 분석

**변경 필요 없음**.

AI 분석은 퀴즈 플로우를 전혀 거치지 않습니다. `analyzeColorsToScores()`가 직접 `scores` 객체를 설정하고 `determineSeason()`을 호출합니다. `currentQ`, `questionPath`, `pickNextQuestion()` 등 퀴즈 엔진 코드와 무관합니다.

```javascript
// script.js 1256-1261줄 — AI 분석 결과 적용
function analyzePhoto() {
  // ...
  scores = analyzeColorsToScores(skin, hair, eye);  // ← 직접 설정
  showLoading();
  // showLoading → determineSeason → renderResult
}
```

state.js 변경 시 `state.scores = ...`로 바꾸면 됨 (implementation-plan.md의 기존 계획과 동일).

---

## 10. URL 공유/복원 영향 분석

### 10-1. 현재 URL 구조

**파일**: `script.js` 1451-1513줄

```javascript
// 공유 URL: #result=brightspring&temp=5&depth=-3&clarity=2
function getResultUrl() {
  return window.location.origin + window.location.pathname +
    `#result=${currentSeason.key}&temp=${scores.temp}&depth=${scores.depth}&clarity=${scores.clarity}`;
}

// 복원: hash 파싱 → SEASONS[key] 직접 매칭 또는 determineSeason() 재계산
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;
  if (hash && hash.includes('result=')) {
    const params = new URLSearchParams(hash.slice(1));
    const key = params.get('result');
    scores.temp = parseInt(params.get('temp'), 10) || 0;
    // ...
    if (key && SEASONS[key]) {
      currentSeason = SEASONS[key];
      renderResult();
      showScreen('result-screen');
    } else if (key) {
      determineSeason();  // ← scores로 재계산
      renderResult();
      showScreen('result-screen');
    }
  }
});
```

### 10-2. 영향 분석

**변경 필요 없음**.

URL hash는 최종 결과(시즌 key)와 최종 점수(temp/depth/clarity)만 포함합니다. 질문 경로나 질문 수는 URL에 포함되지 않습니다. 복원 시 SEASONS[key]로 직접 매칭하므로 퀴즈 엔진과 무관합니다.

**고려 사항**: 인풋 기반 페이징으로 동일 결과를 받은 두 사용자의 scores가 다를 수 있음 (예: 8문항 답변 vs 12문항 답변). 하지만 URL은 결과 키를 기반으로 복원하므로 문제 없음.

---

## 11. 테스트 전략 변경

### 11-1. 영향받는 기존 테스트

**파일**: `test_suite.js` (202 tests)

| 테스트 카테고리 | 현재 테스트 | 영향 | 수정 내용 |
|---------------|-----------|------|----------|
| QUESTIONS 데이터 무결성 | ~20개 | **수정 필요** | `primaryAxis`, `weight`, `phase` 필드 존재 확인 추가. 질문 순서 가정 제거 |
| SEASONS 데이터 무결성 | ~60개 | 영향 없음 | — |
| 12시즌 도달 가능성 | ~20개 | **확장 필요** | 7문항 경로로도 12시즌 전체 도달 가능 검증 |
| 서브타입 로직 | ~30개 | 영향 없음 | `getBaseSeason`/`getSubtype` 변경 없음 |
| AI 분석 | ~20개 | 영향 없음 | — |
| DOM/CSS 일관성 | ~30개 | **수정 필요** | `currentQ` 참조 제거 → `state.questionPath` 기반으로 변경 |
| URL 공유/복원 | ~10개 | 영향 없음 | — |

### 11-2. 새로 추가할 테스트

```javascript
// test_suite.js에 추가할 테스트 카테고리

// --- 인풋 기반 페이징 엔진 ---

// 1. 확신도 계산 검증
test('getAxisConfidence returns |score| + answeredCount*0.5', () => {
  state.scores.temp = 4;
  state.questionPath = [5, 10]; // Q5, Q10: both primaryAxis='temp'
  assert(getAxisConfidence('temp') === 4 + 2*0.5); // = 5
});

// 2. Phase 1 필수 질문 순서 보장
test('pickNextQuestion returns PHASE1_IDS in order first', () => {
  resetQuizState();
  const first = pickNextQuestion();
  assert(first.id === 1);       // PHASE1_IDS[0]

  state.questionPath = [1];
  const second = pickNextQuestion();
  assert(second.id === 5);      // PHASE1_IDS[1]

  state.questionPath = [1, 5];
  const third = pickNextQuestion();
  assert(third.id === 9);       // PHASE1_IDS[2]

  state.questionPath = [1, 5, 9];
  const fourth = pickNextQuestion();
  assert(fourth.id === 4);      // PHASE1_IDS[3]
});

// 3. 적응형 선택: 불확실 축 우선
test('pickNextQuestion targets least confident axis', () => {
  state.questionPath = [1, 5, 9, 4];  // Phase 1 완료
  state.scores = { temp: 4, depth: 0, clarity: 3 }; // depth가 가장 불확실
  const next = pickNextQuestion();
  assert(next.primaryAxis === 'depth' || next.secondaryAxis === 'depth');
});

// 4. 조기 종료 조건
test('pickNextQuestion returns null when all axes confident and min met', () => {
  state.questionPath = [1, 5, 9, 4, 10, 11, 8]; // 7문항 (MIN_QUESTIONS)
  state.scores = { temp: 5, depth: -4, clarity: 4 };
  const next = pickNextQuestion();
  assert(next === null); // 모든 축 확신도 ≥ 3
});

// 5. 최소 질문 수 보장
test('pickNextQuestion continues until MIN_QUESTIONS even if confident', () => {
  state.questionPath = [1, 5, 9, 4, 10]; // 5문항 (< MIN_QUESTIONS=7)
  state.scores = { temp: 6, depth: -5, clarity: 5 }; // 모든 축 확신
  const next = pickNextQuestion();
  assert(next !== null); // 아직 7문항 미달
});

// 6. 최대 질문 수 강제 종료
test('pickNextQuestion returns null at MAX_QUESTIONS', () => {
  state.questionPath = [1, 5, 9, 4, 2, 3, 6, 7, 8, 10, 11, 12]; // 12문항
  state.scores = { temp: 0, depth: 0, clarity: 0 }; // 불확실해도 종료
  const next = pickNextQuestion();
  assert(next === null);
});

// 7. goBack 히스토리 복원
test('goBack restores previous question and scores', () => {
  state.questionPath = [1, 5];
  state.scores = { temp: 2, depth: -2, clarity: 2 };
  state.scoreHistory = [
    { questionId: 1, optionIdx: 1, temp: 1, depth: -1, clarity: 0 },
    { questionId: 5, optionIdx: 1, temp: 2, depth: 0, clarity: 0 }
  ];
  state.answers = [1, 1];

  goBack();

  assert(state.questionPath.length === 1);
  assert(state.scores.temp === 0);  // 2 - 2
  assert(state.scores.depth === -2); // -2 - 0
  assert(state.currentQuestion.id === 5); // 방금 pop한 질문으로 복원
});

// 8. 12시즌 도달 가능성 (7문항 경로)
test('all 12 seasons reachable with 7 questions', () => {
  const SEASONS_KEYS = [
    'brightspring', 'lightspring', 'warmspring',
    'lightsummer', 'coolsummer', 'softsummer',
    'warmautumn', 'deepautumn', 'softautumn',
    'coolwinter', 'deepwinter', 'brightwinter'
  ];
  const reached = new Set();

  // 각 시즌을 유도하는 극단적 점수 조합으로 테스트
  // Phase 1 (4문항) + Phase 2에서 3문항 = 7문항 최소
  // ... 조합별 시뮬레이션 ...

  assert(reached.size === 12);
});

// --- 새 QUESTIONS 구조 검증 ---

// 9. 모든 질문에 필수 필드 존재
test('every question has primaryAxis, weight, phase', () => {
  QUESTIONS.forEach(q => {
    assert(['temp', 'depth', 'clarity'].includes(q.primaryAxis));
    assert([1, 2, 3].includes(q.weight));
    assert([1, 2].includes(q.phase));
    assert(q.options.length === 4);
  });
});

// 10. PHASE1_IDS가 실제 phase:1 질문과 일치
test('PHASE1_IDS matches questions with phase:1', () => {
  const phase1Questions = QUESTIONS.filter(q => q.phase === 1);
  assert(phase1Questions.length === PHASE1_IDS.length);
  PHASE1_IDS.forEach(id => {
    const q = QUESTIONS.find(q => q.id === id);
    assert(q && q.phase === 1);
  });
});

// 11. AXIS_QUESTIONS가 phase:2 질문의 전체를 커버
test('AXIS_QUESTIONS covers all phase:2 questions', () => {
  const allAxisIds = [
    ...AXIS_QUESTIONS.temp,
    ...AXIS_QUESTIONS.depth,
    ...AXIS_QUESTIONS.clarity
  ];
  const phase2Ids = QUESTIONS.filter(q => q.phase === 2).map(q => q.id);
  assert(phase2Ids.every(id => allAxisIds.includes(id)));
});
```

### 11-3. 테스트 수 변경

| 카테고리 | 현재 | 변경 후 | 변동 |
|---------|------|--------|------|
| QUESTIONS 데이터 무결성 | ~20 | ~25 | +5 (새 필드 검증) |
| 12시즌 도달 가능성 | ~20 | ~30 | +10 (7문항 경로 검증) |
| 인풋 기반 페이징 엔진 | 0 | ~15 | +15 (확신도, 선택, 종료, goBack) |
| DOM/CSS 일관성 | ~30 | ~30 | ±0 (참조 변경만) |
| **합계** | **202** | **~232** | **+30** |

---

## 12. 기존 문서 수정 필요 사항

### 12-1. implementation-plan.md

| 섹션 | 현재 내용 | 수정 필요 |
|------|----------|----------|
| §1-2 script.js 구조표 | "726-798: 퀴즈 플로우 (startQuiz, renderQuestion, selectOption, goBack)" | quiz.js 설명에 인풋 기반 엔진 구조 반영 |
| §2 목표 파일 구조 | `js/quiz.js — startQuiz(), renderQuestion(), selectOption(), goBack()` | 함수 목록에 `pickNextQuestion()`, `getAxisConfidence()`, `allAxesConfident()`, `estimateRemainingQuestions()` 추가 |
| STEP 1-3 questions.js | `export const QUESTIONS = [...]` (현재 구조 그대로) | 새 필드 (`primaryAxis`, `secondaryAxis`, `weight`, `phase`) 추가 + `PHASE1_IDS`, `AXIS_QUESTIONS` export 추가 |
| STEP 1-4 state.js | `currentQ: 0` 포함 | `currentQ` → `currentQuestion: null`, `questionPath: []` 추가, `scoreHistory` 구조 변경 |
| STEP 1-5 quiz.js | `function selectOption(idx, btn) { ... currentQ++; ... }` | 전면 재작성 (본 문서 §4-2 참조) |
| STEP 1-7 test_suite.js | 기존 202개 기준 | +30개 인풋 기반 페이징 테스트 추가 |
| STEP 1-8 체크리스트 | "퀴즈 12문항 → 로딩" | "퀴즈 7-12문항 적응형 → 로딩" |
| §4 STEP 2-6 GA4 | `quiz_complete` 이벤트: `{ question_count: 12 }` | `{ question_count: state.questionPath.length, path: state.questionPath.join(',') }` |
| §6 테스트 전략 | 합계 202 | 합계 ~232 |

### 12-2. design-strategy.md

| 섹션 | 수정 필요 |
|------|----------|
| §3 체류 시간 극대화 → 퀴즈 설계 | "12문항 고정" → "7-12문항 적응형" 언급 추가 |
| §2 CX-First → 퀴즈 경험 | 적응형 질문의 "나한테 맞춤된" 느낌이 CX 품질 향상 |

### 12-3. design-kit.md

| 섹션 | 수정 필요 |
|------|----------|
| §8 애니메이션 → 프로그레스 바 | "X/12" 고정 → "X/12 + 조기완료 시 100% 전환" 반영 |
| §6 컴포넌트 → 프로그레스 바 | 조기 종료 시 "Hoàn thành!" 텍스트 표시 사양 추가 |

### 12-4. CLAUDE.md

수정 불필요. 3축 양극성 시스템, 12시즌 판정, AI 분석 등 핵심 아키텍처는 동일하게 유지.

다만 아래 한 줄 업데이트 고려:
```
현재: - **Scoring**: 3-axis bipolar system — `temp` (Cool↔Warm), `depth` (Dark↔Light), `clarity` (Soft↔Clear)
추가: - **Quiz**: Input-based adaptive paging (7-12 questions), Phase 1 mandatory → Phase 2 confidence-driven
```

---

## 13. 전체 파일 변경 맵

### 13-1. 코드 변경 파일

| 파일 | 변경 유형 | 변경 규모 | 설명 |
|------|----------|----------|------|
| `js/data/questions.js` | 수정 | 중간 | QUESTIONS에 `primaryAxis`, `secondaryAxis`, `weight`, `phase` 추가. `PHASE1_IDS`, `AXIS_QUESTIONS` export 추가. 질문 배열 순서를 phase 1 → phase 2로 재배치 |
| `js/state.js` | 수정 | 소규모 | `currentQ` → `currentQuestion`, `questionPath` 추가, `scoreHistory` 구조 확장, `resetQuizState()` 업데이트 |
| `js/quiz.js` | **전면 재작성** | 대규모 | `pickNextQuestion()`, `getAxisConfidence()`, `allAxesConfident()`, `estimateRemainingQuestions()` 신규. `startQuiz()`, `renderQuestion()`, `selectOption()`, `goBack()` 재설계 |
| `js/app.js` | 수정 | 소규모 | `showLoading()`에 적응형 완료 메시지 추가. `MAX_QUESTIONS` import |
| `index.html` | 수정 | 소규모 | `loading-sub`에 id 추가. progress-text 기본값 유지 |
| `test_suite.js` | 수정 | 중간 | +30개 테스트 추가, 기존 quiz 관련 테스트의 `currentQ` 참조 수정 |

### 13-2. 문서 변경 파일

| 파일 | 변경 규모 | 설명 |
|------|----------|------|
| `docs/implementation-plan.md` | 중간 | §1-2, STEP 1-3~1-8, §4 STEP 2-6, §6 테스트 전략 업데이트 |
| `docs/design-strategy.md` | 소규모 | §2, §3 퀴즈 관련 섹션에 적응형 언급 추가 |
| `docs/design-kit.md` | 소규모 | §6, §8 프로그레스 바 관련 업데이트 |
| `CLAUDE.md` | 선택적 | Quiz 방식 1줄 추가 |

### 13-3. 변경하지 않는 파일

| 파일 | 이유 |
|------|------|
| `js/data/seasons.js` | 12시즌 데이터 변경 없음 |
| `js/scoring.js` | `getBaseSeason`, `getSubtype`, `determineSeason` 변경 없음 |
| `js/result.js` | 결과 렌더링 로직 변경 없음 |
| `js/ai-analysis.js` | AI 분석 경로는 퀴즈 엔진과 독립 |
| `js/share.js` | URL hash 구조 변경 없음 |
| `css/*` | 스타일 변경 없음 (프로그레스 바 CSS는 기존 구조 재사용) |
| `.github/workflows/deploy.yml` | 배포 설정 변경 없음 |

---

## 부록: 인풋 기반 페이징 시뮬레이션 예시

### A. "Warm Spring" 유저 시뮬레이션

```
Phase 1:
  Q1 (depth) → 옵션 B "Nâu đậm ánh ấm": temp+1, depth-1, clarity 0
    scores: {temp: 1, depth: -1, clarity: 0}

  Q5 (temp) → 옵션 B "Xanh lục hoặc olive": temp+2
    scores: {temp: 3, depth: -1, clarity: 0}

  Q9 (clarity) → 옵션 B "Trắng kem": temp+1, clarity-1
    scores: {temp: 4, depth: -1, clarity: -1}

  Q4 (depth) → 옵션 C "Trung bình, nâu mật ong": temp+1, depth-1
    scores: {temp: 5, depth: -2, clarity: -1}

Phase 2 — 확신도 분석:
  temp: |5| + 2*0.5 = 6.0  ✅ (≥3)    ← Q5, Q9가 temp 관련 (secondaryAxis)
  depth: |-2| + 2*0.5 = 3.0  ✅ (≥3)   ← Q1, Q4가 depth primaryAxis
  clarity: |-1| + 1*0.5 = 1.5  ❌ (<3)  ← Q9만 clarity

  → clarity가 가장 불확실 → clarity 질문 선택

  Q11 (clarity, w:3) → 옵션 D "Thấp": clarity-2
    scores: {temp: 5, depth: -2, clarity: -3}

  재확인: clarity |-3| + 2*0.5 = 4.0 ✅
  총 5문항 < MIN_QUESTIONS(7) → 계속

  Q10 (temp, w:3) → 옵션 A "San hô": temp+2, depth+1, clarity+1
    scores: {temp: 7, depth: -1, clarity: -2}

  Q8 (clarity, w:2) → 옵션 A "Hồng đào nhạt": temp+1, depth+1, clarity-1
    scores: {temp: 8, depth: 0, clarity: -3}

  → 7문항 도달. 모든 축 확신도 ≥ 3 → 종료!

  determineSeason():
    affinities = { spring: 8+0+(-3)=5, summer: -8+0-(-3)=-5, autumn: 8-0-(-3)=11, winter: -8-0+(-3)=-11 }
    → autumn 승리
    getSubtype('autumn', 8, 0, -3):
      absTemp=8, absDepth=0, absClarity=3
      temp dominant → 'warmautumn'

  결과: Warm Autumn (8문항이 아닌 7문항만에 도달)
```

### B. "중립 응답" 유저 시뮬레이션 (12문항 전체 출제)

```
Phase 1:
  Q1 → 옵션 C: temp+1, depth+1, clarity 0  → scores: {1, 1, 0}
  Q5 → 옵션 C: temp 0                       → scores: {1, 1, 0}
  Q9 → 옵션 D: 전부 0                        → scores: {1, 1, 0}
  Q4 → 옵션 B: temp+1, depth+1               → scores: {2, 2, 0}

Phase 2:
  temp: |2| + 1*0.5 = 2.5 ❌
  depth: |2| + 2*0.5 = 3.0 ✅
  clarity: |0| + 1*0.5 = 0.5 ❌  ← 가장 불확실

  Q11 (clarity, w:3) → 옵션 C: 전부 0 → scores: {2, 2, 0}
  clarity: |0| + 2*0.5 = 1.0 ❌ → 여전히 불확실

  Q8 (clarity, w:2) → 옵션 B: temp-1 → scores: {1, 2, 0}
  temp: |1| + 1*0.5 = 1.5 ❌, clarity: |0| + 3*0.5 = 1.5 ❌

  Q12 (clarity, w:2) → 옵션 A: clarity+2 → scores: {1, 2, 2}
  clarity: |2| + 4*0.5 = 4.0 ✅

  temp 가장 불확실: |1| + 1*0.5 = 1.5 ❌
  Q10 (temp, w:3) → 옵션 B: temp-1, depth+1, clarity-1 → scores: {0, 3, 1}
  temp: |0| + 2*0.5 = 1.0 ❌

  Q2 (temp, w:2) → 옵션 A: temp+2 → scores: {2, 3, 1}
  temp: |2| + 3*0.5 = 3.5 ✅  → 모든 축 확신!
  10문항 ≥ MIN_QUESTIONS(7) → 종료

  → 이 경우 10문항 출제 (극단적 중립은 12문항까지 갈 수 있음)
```

---

## 구현 시 절대 규칙 (재확인)

1. **빌드 도구/번들러 도입 금지** — Vanilla JS + ES Modules
2. **배포 금지** — 사용자 지시 전까지 로컬 작업만
3. **기존 기능 훼손 금지** — 12시즌 판정 결과 동일성 보장
4. **과잉 엔지니어링 금지** — 인풋 기반 페이징 최소 구현 → 검증 후 개선
5. **Phase 순서 준수** — implementation-plan.md Phase 1에서 quiz.js 분리 시 적용
6. **옵션 점수 변경 금지** — 기존 temp/depth/clarity 점수값 유지 (판정 공식 호환)
