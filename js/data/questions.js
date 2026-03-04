/* ===== QUESTIONS DATA (Input-Based Paging) ===== */

/**
 * @typedef {Object} QuestionOption
 * @property {string} text
 * @property {number} temp
 * @property {number} depth
 * @property {number} clarity
 */

/**
 * @typedef {Object} Question
 * @property {number} id
 * @property {number} phase - 1=mandatory, 2=adaptive
 * @property {string} text
 * @property {string} hint
 * @property {'temp'|'depth'|'clarity'} primaryAxis
 * @property {'temp'|'depth'|'clarity'|null} secondaryAxis
 * @property {number} weight - 1-3 information value
 * @property {QuestionOption[]} options
 */

/** @type {Question[]} */
export const QUESTIONS = [
  // ===== Phase 1: Mandatory questions (always in this order) =====
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

  // ===== Phase 2: Adaptive candidates (engine selects dynamically) =====
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

/** Phase 1 question IDs in order (always asked first) */
export const PHASE1_IDS = [1, 5, 9, 4];

/** Phase 2 question IDs grouped by primary axis (weight descending) */
export const AXIS_QUESTIONS = {
  temp:    [10, 2, 3, 6],
  depth:   [7],
  clarity: [11, 8, 12]
};
