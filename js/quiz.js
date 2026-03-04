/* ===== QUIZ ENGINE (Input-Based Adaptive Paging) ===== */
import { QUESTIONS, PHASE1_IDS, AXIS_QUESTIONS } from './data/questions.js';
import { state, resetQuizState } from './state.js';
import { showScreen, showLoading } from './app.js';

// ========================================
// Constants
// ========================================
const MIN_QUESTIONS = 7;
const MAX_QUESTIONS = 12;
const CONFIDENCE_THRESHOLD = 3;

/** @type {Map<number, import('./data/questions.js').Question>} */
const QUESTION_MAP = new Map();
QUESTIONS.forEach(q => QUESTION_MAP.set(q.id, q));

// ========================================
// Confidence Calculation
// ========================================

/**
 * Calculate confidence for a given axis.
 * confidence = |accumulated score| + (answered count for this axis * 0.5)
 * @param {'temp'|'depth'|'clarity'} axis
 * @returns {number}
 */
function getAxisConfidence(axis) {
  const absScore = Math.abs(state.scores[axis]);
  const answeredCount = state.questionPath.filter(qId => {
    const q = QUESTION_MAP.get(qId);
    return q !== undefined && q.primaryAxis === axis;
  }).length;
  return absScore + (answeredCount * 0.5);
}

/**
 * Check if all three axes meet the confidence threshold.
 * @returns {boolean}
 */
function allAxesConfident() {
  return /** @type {const} */ (['temp', 'depth', 'clarity']).every(
    axis => getAxisConfidence(axis) >= CONFIDENCE_THRESHOLD
  );
}

// ========================================
// Next Question Selection
// ========================================

/**
 * Core input-based paging algorithm: determine the next question.
 *
 * 1. Phase 1 remaining → in order
 * 2. Phase 2:
 *    a. max reached → null
 *    b. all confident + min met → null
 *    c. least confident axis → best available question
 *    d. no axis questions left → any remaining
 *    e. all exhausted → null
 *
 * @returns {import('./data/questions.js').Question|null}
 */
function pickNextQuestion() {
  const asked = new Set(state.questionPath);
  const totalAsked = asked.size;

  // Phase 1: mandatory questions in order
  for (const id of PHASE1_IDS) {
    if (!asked.has(id)) {
      const q = QUESTION_MAP.get(id);
      return q !== undefined ? q : null;
    }
  }

  // Phase 2: adaptive selection

  // Max questions reached → force end
  if (totalAsked >= MAX_QUESTIONS) return null;

  // All axes confident + min questions met → early end
  if (totalAsked >= MIN_QUESTIONS && allAxesConfident()) return null;

  // Find least confident axis
  const axes = /** @type {const} */ (['temp', 'depth', 'clarity']);
  let leastConfidentAxis = axes[0];
  let lowestConf = getAxisConfidence(axes[0]);
  for (let i = 1; i < axes.length; i++) {
    const conf = getAxisConfidence(axes[i]);
    if (conf < lowestConf) {
      lowestConf = conf;
      leastConfidentAxis = axes[i];
    }
  }

  // Candidates from least confident axis (weight descending)
  const axisIds = AXIS_QUESTIONS[leastConfidentAxis] || [];
  const candidates = axisIds
    .filter(id => !asked.has(id))
    .map(id => QUESTION_MAP.get(id))
    .filter(/** @param {import('./data/questions.js').Question|undefined} q */ q => q !== undefined)
    .sort((a, b) => b.weight - a.weight);

  if (candidates.length > 0) return candidates[0];

  // Fallback: questions with secondaryAxis matching
  const fallbackCandidates = QUESTIONS
    .filter(q => !asked.has(q.id) && q.phase === 2)
    .filter(q => q.primaryAxis === leastConfidentAxis || q.secondaryAxis === leastConfidentAxis)
    .sort((a, b) => b.weight - a.weight);

  if (fallbackCandidates.length > 0) return fallbackCandidates[0];

  // Last resort: any remaining question
  const remaining = QUESTIONS
    .filter(q => !asked.has(q.id))
    .sort((a, b) => b.weight - a.weight);

  return remaining.length > 0 ? remaining[0] : null;
}

// ========================================
// Quiz Flow
// ========================================

export function startQuiz() {
  resetQuizState();
  state.currentQuestion = pickNextQuestion();
  showScreen('quiz-screen');
  renderQuestion();
}

export function renderQuestion() {
  const nextQ = state.currentQuestion;
  if (!nextQ) {
    showLoading();
    return;
  }

  const asked = state.questionPath.length;
  const pct = Math.round(((asked + 1) / MAX_QUESTIONS) * 100);

  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = `${asked + 1} / ${MAX_QUESTIONS}`;

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

/**
 * @param {number} idx
 * @param {HTMLButtonElement} btn
 */
export function selectOption(idx, btn) {
  // Prevent double-click
  document.querySelectorAll('.option-btn').forEach(b => { /** @type {HTMLButtonElement} */ (b).disabled = true; });
  btn.classList.add('selected');

  const q = state.currentQuestion;
  if (!q) return;
  const opt = q.options[idx];

  // Save history for goBack
  state.scoreHistory.push({
    questionId: q.id,
    optionIdx: idx,
    temp: opt.temp,
    depth: opt.depth,
    clarity: opt.clarity
  });

  // Accumulate scores
  state.scores.temp += opt.temp;
  state.scores.depth += opt.depth;
  state.scores.clarity += opt.clarity;

  // Record path
  state.questionPath.push(q.id);
  state.answers.push(idx);

  // Determine next question (input-based)
  setTimeout(() => {
    const next = pickNextQuestion();
    state.currentQuestion = next;
    if (next) {
      renderQuestion();
    } else {
      // Early completion: fill progress bar to 100%
      document.getElementById('progress-fill').style.width = '100%';
      document.getElementById('progress-text').textContent = 'Hoàn thành!';
      setTimeout(() => showLoading(), 300);
    }
  }, 420);
}

export function goBack() {
  if (state.questionPath.length === 0) return;

  const last = state.scoreHistory.pop();
  if (!last) return;

  state.scores.temp -= last.temp;
  state.scores.depth -= last.depth;
  state.scores.clarity -= last.clarity;

  state.questionPath.pop();
  state.answers.pop();

  // Restore the question that was just popped
  const restoredQuestion = QUESTION_MAP.get(last.questionId);
  state.currentQuestion = restoredQuestion !== undefined ? restoredQuestion : null;

  renderQuestion();
}
