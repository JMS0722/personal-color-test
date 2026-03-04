/* ===== SHARED STATE ===== */

/**
 * @typedef {Object} ScoreHistoryEntry
 * @property {number} questionId
 * @property {number} optionIdx
 * @property {number} temp
 * @property {number} depth
 * @property {number} clarity
 */

/**
 * @typedef {Object} AppState
 * @property {import('./data/questions.js').Question|null} currentQuestion
 * @property {{temp: number, depth: number, clarity: number}} scores
 * @property {number[]} answers
 * @property {number[]} questionPath
 * @property {ScoreHistoryEntry[]} scoreHistory
 * @property {import('./data/seasons.js').SeasonData|null} currentSeason
 * @property {MediaStream|null} cameraStream
 * @property {string} facingMode
 * @property {ImageData|null} capturedImageData
 */

/** @type {AppState} */
export const state = {
  currentQuestion: null,
  scores: { temp: 0, depth: 0, clarity: 0 },
  answers: [],
  questionPath: [],
  scoreHistory: [],
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
