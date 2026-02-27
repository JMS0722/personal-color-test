/* ===================================================================
   Personal Color Test — script.js
   3-axis bipolar scoring: temp (Cool↔Warm), depth (Dark↔Light), clarity (Soft↔Clear)
   =================================================================== */

// ===== QUESTIONS DATA =====
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
  {
    id: 2,
    text: "Khi ra ngoài nắng, tóc bạn ánh lên màu gì?",
    hint: "Quan sát dưới ánh sáng tự nhiên",
    options: [
      { text: "Ánh đỏ hoặc đồng ấm",          temp:  2, depth:  0, clarity: 0  },
      { text: "Ánh vàng mật ong",               temp:  1, depth:  1, clarity: 0  },
      { text: "Không thấy ánh gì rõ, vẫn đậm", temp: -1, depth: -1, clarity: 1  },
      { text: "Ánh xám hoặc xanh nhẹ",          temp: -2, depth:  0, clarity: 0  }
    ]
  },
  {
    id: 3,
    text: "Màu mắt của bạn gần nhất với mô tả nào?",
    hint: "Nhìn kỹ trong gương dưới ánh sáng tự nhiên",
    options: [
      { text: "Đen đậm, tròng mắt khó phân biệt", temp: -1, depth: -1, clarity:  1 },
      { text: "Nâu đậm ấm, ánh hổ phách",          temp:  1, depth: -1, clarity:  0 },
      { text: "Nâu sáng hoặc nâu nhạt mềm mại",    temp:  1, depth:  1, clarity: -1 },
      { text: "Nâu xám hoặc đen mát, viền rõ",      temp: -1, depth:  0, clarity:  1 }
    ]
  },
  {
    id: 4,
    text: "Tông da tự nhiên của bạn (khu vực ít tiếp xúc nắng) như thế nào?",
    hint: "Nhìn phần trong cánh tay hoặc bụng",
    options: [
      { text: "Trắng sáng, hơi hồng hoặc xanh nhạt", temp: -1, depth:  2, clarity:  0 },
      { text: "Trắng kem ấm, hơi vàng",                temp:  1, depth:  1, clarity:  0 },
      { text: "Trung bình, nâu mật ong ấm",            temp:  1, depth: -1, clarity:  0 },
      { text: "Nâu sẫm hoặc nâu olive",                temp: -1, depth: -2, clarity:  0 }
    ]
  },
  {
    id: 5,
    text: "Nhìn mặt trong của cổ tay, mạch máu bạn có màu gì?",
    hint: "Xem dưới ánh sáng tự nhiên",
    options: [
      { text: "Xanh lam hoặc tím rõ rệt",     temp: -2, depth: 0, clarity: 0 },
      { text: "Xanh lục hoặc olive",            temp:  2, depth: 0, clarity: 0 },
      { text: "Hỗn hợp xanh lam và xanh lục",  temp:  0, depth: 0, clarity: 0 },
      { text: "Khó nhìn thấy rõ",               temp:  0, depth: -1, clarity: 0 }
    ]
  },
  {
    id: 6,
    text: "Bạn thấy mình đẹp hơn khi đeo trang sức màu gì?",
    hint: "Nghĩ đến lúc được khen đẹp nhất",
    options: [
      { text: "Vàng gold — làm da sáng lên",       temp:  2, depth:  0, clarity: 0 },
      { text: "Bạc / Bạch kim — trông thanh lịch",  temp: -2, depth:  0, clarity: 0 },
      { text: "Vàng hồng (rose gold)",              temp:  1, depth:  1, clarity: 0 },
      { text: "Cả hai đều được, không khác biệt",   temp:  0, depth:  0, clarity: 0 }
    ]
  },
  {
    id: 7,
    text: "Khi tiếp xúc nắng, da bạn thường phản ứng thế nào?",
    hint: "Sau khoảng 30 phút dưới nắng không kem chống nắng",
    options: [
      { text: "Dễ bị cháy đỏ, khó rám nắng",       temp: -1, depth:  2, clarity:  1 },
      { text: "Hơi đỏ trước, sau đó rám nhẹ",       temp:  0, depth:  1, clarity:  0 },
      { text: "Ít khi cháy, rám nắng dễ dàng",      temp:  1, depth: -1, clarity:  0 },
      { text: "Không bao giờ cháy, rám rất nhanh",   temp:  1, depth: -2, clarity: -1 }
    ]
  },
  {
    id: 8,
    text: "Màu môi tự nhiên (không son) của bạn gần nhất với?",
    hint: "Nhìn trong gương không trang điểm",
    options: [
      { text: "Hồng đào nhạt, gần nude",            temp:  1, depth:  1, clarity: -1 },
      { text: "Hồng berry mát, hơi tím",            temp: -1, depth:  0, clarity:  0 },
      { text: "Đỏ hồng tự nhiên, rõ ràng",          temp:  0, depth:  0, clarity:  1 },
      { text: "Nâu hồng hoặc cam đất",              temp:  1, depth: -1, clarity:  0 }
    ]
  },
  {
    id: 9,
    text: "Màu trắng nào làm bạn trông tươi sáng hơn?",
    hint: "So sánh khi mặc áo trắng hoặc giữ vải trắng gần mặt",
    options: [
      { text: "Trắng tinh (pure white) — rõ ràng, sắc nét", temp: -1, depth: 0, clarity:  2 },
      { text: "Trắng kem (ivory) — mềm mại, ấm áp",         temp:  1, depth: 0, clarity: -1 },
      { text: "Trắng ngà (off-white) — nhẹ nhàng",           temp:  0, depth: 0, clarity: -2 },
      { text: "Không thấy khác biệt rõ",                      temp:  0, depth: 0, clarity:  0 }
    ]
  },
  {
    id: 10,
    text: "Màu quần áo nào bạn hay được khen \"hợp quá\"?",
    hint: "Nghĩ về những lần được compliment nhiều nhất",
    options: [
      { text: "San hô, cam đào, vàng ấm",           temp:  2, depth:  1, clarity:  1 },
      { text: "Hồng pastel, xanh lavender, baby blue", temp: -1, depth:  1, clarity: -1 },
      { text: "Đỏ đô, xanh rêu, cam đất, nâu caramel", temp:  1, depth: -1, clarity: -1 },
      { text: "Đỏ tươi, xanh cobalt, đen, trắng tinh",  temp: -1, depth: -1, clarity:  2 }
    ]
  },
  {
    id: 11,
    text: "Mức độ tương phản giữa tóc, da và mắt của bạn?",
    hint: "Nhìn tổng thể khuôn mặt trong gương",
    options: [
      { text: "Rất cao — tóc rất đậm, da rất sáng",    temp:  0, depth:  0, clarity:  2 },
      { text: "Cao — có sự khác biệt rõ ràng",          temp:  0, depth: -1, clarity:  1 },
      { text: "Trung bình — hài hòa, không quá nổi bật", temp:  0, depth:  0, clarity:  0 },
      { text: "Thấp — tóc, da, mắt gần cùng tông",      temp:  0, depth:  1, clarity: -2 }
    ]
  },
  {
    id: 12,
    text: "Tổng thể, người khác thường mô tả vẻ ngoài bạn là?",
    hint: "Ấn tượng đầu tiên khi gặp bạn",
    options: [
      { text: "Tươi sáng, trẻ trung, rạng rỡ",       temp:  0, depth:  0, clarity:  2 },
      { text: "Dịu dàng, thanh nhã, nhẹ nhàng",       temp:  0, depth:  1, clarity: -2 },
      { text: "Ấm áp, trưởng thành, sang trọng",      temp:  1, depth: -1, clarity: -1 },
      { text: "Sắc sảo, ấn tượng, cá tính mạnh",     temp: -1, depth: -1, clarity:  2 }
    ]
  }
];

// ===== 12-SEASON RESULT DATA =====
// Each base season (Spring/Summer/Autumn/Winter) has 3 subtypes based on dominant axis.
const SEASONS = {
  // ==================== SPRING (Warm + Light + Clear) ====================

  brightspring: {
    key: "brightspring",
    baseseason: "spring",
    emoji: "🌸",
    name: "Xuân Rực Rỡ",
    enName: "Bright Spring",
    subtitle: "Rực rỡ — Tươi sáng — Trong trẻo",
    description: "Bạn tỏa sáng với vẻ đẹp rực rỡ, tươi mới nhất trong họ Xuân! Đặc trưng của bạn là sự tương phản cao và sắc màu trong trẻo. Những gam màu sống động, bão hòa cao sẽ làm bạn thêm nổi bật.",
    gradient: "linear-gradient(135deg, #FF6B6B, #FFD166)",
    primary: "#FF6B6B",
    light: "#FFF5EB",
    palette: [
      "#FF6B6B", "#FFD166", "#00C9A7", "#FF9A56",
      "#4ECDC4", "#FF8C69", "#FFE66D", "#FF5E78",
      "#45B7D1", "#FFAA5C", "#98D8AA", "#FF7EB3"
    ],
    avoid: ["#2C3E50", "#7F8C8D", "#8E44AD", "#1A1A2E", "#4A0E4E", "#808080"],
    makeup: {
      foundation: { text: "Kem nền tông ấm sáng: light beige, peach", colors: ["#FCEBD5", "#F5D0A9", "#F0D5B0"] },
      lip: { text: "Son san hô tươi, đỏ cam sáng, hồng neon", colors: ["#FF6B6B", "#FF5E78", "#FF7EB3"] },
      blush: { text: "Má hồng đào tươi, cam san hô", colors: ["#FF9A56", "#FFA07A", "#FF8C69"] },
      eyeshadow: { text: "Phấn mắt ngọc lam, vàng gold, cam sáng", colors: ["#4ECDC4", "#FFD700", "#FF9A56"] }
    },
    clothing: [
      { cat: "Công sở", colors: ["Camel sáng", "Xanh ngọc", "Cam đào"] },
      { cat: "Dạo phố", colors: ["San hô tươi", "Vàng chanh", "Turquoise"] },
      { cat: "Dự tiệc", colors: ["Đỏ cam rực", "Vàng gold", "Xanh emerald"] },
      { cat: "Casual", colors: ["Trắng kem", "Hồng neon nhẹ", "Xanh mint"] },
      { cat: "Phụ kiện", colors: ["Vàng gold sáng", "Đồng rose", "Ngọc lam"] }
    ],
    hair: [
      { name: "Nâu mật ong sáng", color: "#C8922A" },
      { name: "Nâu đồng ánh vàng", color: "#CD853F" },
      { name: "Auburn sáng", color: "#B8652A" },
      { name: "Nâu caramel sáng", color: "#D4923A" }
    ],
    jewelry: "Vàng gold sáng bóng là lựa chọn số 1. Kim loại ấm sáng làm tôn vẻ rực rỡ. Đá ngọc lam, peridot và citrine rất hợp. Rose gold cũng tuyệt vời.",
    celebrities: ["IU (K-pop)", "Jessica Alba", "Rosé (BLACKPINK)", "Kim Yoo-jung", "Blake Lively", "Son Ye-jin"],
    products: [
      { emoji: "💄", name: "Son Romand Juicy Lasting Tint #09", brand: "Romand", price: "165.000₫", url: "https://shopee.vn/search?keyword=romand+juicy+lasting+tint+09" },
      { emoji: "🧴", name: "Kem nền Maybelline Fit Me #120", brand: "Maybelline", price: "145.000₫", url: "https://shopee.vn/search?keyword=maybelline+fit+me+120" },
      { emoji: "🎨", name: "Bảng mắt 3CE Multi Eye #Butter Cream", brand: "3CE", price: "420.000₫", url: "https://shopee.vn/search?keyword=3ce+multi+eye+butter+cream" },
      { emoji: "💗", name: "Má hồng Canmake Glow Fleur #01", brand: "Canmake", price: "195.000₫", url: "https://shopee.vn/search?keyword=canmake+glow+fleur+01" }
    ]
  },

  lightspring: {
    key: "lightspring",
    baseseason: "spring",
    emoji: "🌸",
    name: "Xuân Nhẹ Nhàng",
    enName: "Light Spring",
    subtitle: "Nhẹ nhàng — Pastel ấm — Tươi mới",
    description: "Bạn sở hữu vẻ đẹp nhẹ nhàng, tươi mới với tông sáng nhất trong họ Xuân! Các gam pastel ấm, sáng và mềm mại sẽ làm nổi bật làn da tươi sáng tự nhiên của bạn.",
    gradient: "linear-gradient(135deg, #FFD166, #FFEAA7)",
    primary: "#E8A838",
    light: "#FFFCF0",
    palette: [
      "#FFE4B5", "#FFDAB9", "#FFD166", "#FFEAA7",
      "#FFC078", "#F4C2A1", "#98D8AA", "#B5EAD7",
      "#FFB6C1", "#FCEBD5", "#E8D5A0", "#BFECD8"
    ],
    avoid: ["#1A1A2E", "#2C3E50", "#4A0E4E", "#800000", "#191970", "#2F4F4F"],
    makeup: {
      foundation: { text: "Kem nền tông sáng ấm: ivory, light peach", colors: ["#FCEBD5", "#FFF0E0", "#F5E0C8"] },
      lip: { text: "Son hồng đào nhạt, peach nude, san hô nhẹ", colors: ["#FFB6C1", "#FFDAB9", "#FFA07A"] },
      blush: { text: "Má hồng đào nhạt, peach mềm", colors: ["#FFC078", "#FFD1A4", "#FFDAB9"] },
      eyeshadow: { text: "Phấn mắt champagne, kem vàng, nâu nhạt", colors: ["#FFE4B5", "#F4C2A1", "#DEB887"] }
    },
    clothing: [
      { cat: "Công sở", colors: ["Be sáng", "Kem ấm", "Hồng đào nhạt"] },
      { cat: "Dạo phố", colors: ["Peach", "Mint nhạt", "Vàng kem"] },
      { cat: "Dự tiệc", colors: ["Champagne", "Hồng phấn", "Vàng ánh"] },
      { cat: "Casual", colors: ["Trắng kem", "Xanh lá non", "Hồng pastel"] },
      { cat: "Phụ kiện", colors: ["Vàng nhạt", "Rose gold", "Ngọc trai kem"] }
    ],
    hair: [
      { name: "Vàng mật ong nhạt", color: "#DAA520" },
      { name: "Nâu vàng sáng", color: "#D4A860" },
      { name: "Nâu caramel nhạt", color: "#C4A56E" },
      { name: "Nâu ánh đồng nhẹ", color: "#C09060" }
    ],
    jewelry: "Vàng nhạt, vàng champagne và rose gold mềm mại rất hợp. Chọn đá nhẹ nhàng: ngọc trai, moonstone, peridot nhạt. Tránh kim loại quá nặng hoặc tối.",
    celebrities: ["Hoa hậu Thùy Tiên", "Amanda Seyfried", "Taylor Swift", "Han So-hee", "Jennifer Lawrence", "Yoona (SNSD)"],
    products: [
      { emoji: "💄", name: "Son Romand Glasting Melting Balm #01", brand: "Romand", price: "175.000₫", url: "https://shopee.vn/search?keyword=romand+glasting+melting+balm+01" },
      { emoji: "🧴", name: "Kem nền Missha Perfect Cover #21", brand: "Missha", price: "185.000₫", url: "https://shopee.vn/search?keyword=missha+perfect+cover+21" },
      { emoji: "🎨", name: "Bảng mắt Etude Play Color #Peach Farm", brand: "Etude", price: "280.000₫", url: "https://shopee.vn/search?keyword=etude+play+color+peach+farm" },
      { emoji: "💗", name: "Má hồng Canmake Glow Fleur #03 Fairy Orange", brand: "Canmake", price: "195.000₫", url: "https://shopee.vn/search?keyword=canmake+glow+fleur+03" }
    ]
  },

  warmspring: {
    key: "warmspring",
    baseseason: "spring",
    emoji: "🌸",
    name: "Xuân Ấm Áp",
    enName: "Warm Spring",
    subtitle: "Ấm áp — Vàng óng — Tràn sức sống",
    description: "Bạn mang vẻ đẹp ấm áp nhất trong họ Xuân! Tông vàng kim, đồng và cam ấm là đặc trưng nổi bật. Những gam màu ấm sáng, gần gũi sẽ tôn lên vẻ rạng rỡ đầy sức sống của bạn.",
    gradient: "linear-gradient(135deg, #FF9A56, #FFD166)",
    primary: "#E8833A",
    light: "#FFF5EB",
    palette: [
      "#FFD166", "#FF9A56", "#F4845F", "#FFB347",
      "#FF8C69", "#E8833A", "#FFC078", "#DEB887",
      "#CD853F", "#78C6A3", "#FFE66D", "#D4923A"
    ],
    avoid: ["#2C3E50", "#7F8C8D", "#8E44AD", "#1A1A2E", "#4A0E4E", "#2F4F4F"],
    makeup: {
      foundation: { text: "Kem nền tông ấm: golden beige, warm sand", colors: ["#F5D0A9", "#E8C39E", "#DCBA8C"] },
      lip: { text: "Son cam đào, cam đất ấm, đỏ cam", colors: ["#E8833A", "#FF8C69", "#D4723A"] },
      blush: { text: "Má hồng cam ấm, đào ánh vàng", colors: ["#FFB347", "#FFA07A", "#F4845F"] },
      eyeshadow: { text: "Phấn mắt vàng gold, đồng, nâu caramel", colors: ["#FFD700", "#CD853F", "#DEB887"] }
    },
    clothing: [
      { cat: "Công sở", colors: ["Camel", "Be ấm", "Cam đất nhẹ"] },
      { cat: "Dạo phố", colors: ["Cam đào", "Vàng mù tạt", "Xanh olive nhẹ"] },
      { cat: "Dự tiệc", colors: ["Vàng gold", "Cam cháy", "Đỏ cam"] },
      { cat: "Casual", colors: ["Trắng kem", "Hồng đào", "Nâu nhạt"] },
      { cat: "Phụ kiện", colors: ["Nâu caramel", "Vàng gold", "Đồng thau"] }
    ],
    hair: [
      { name: "Nâu mật ong đậm", color: "#B8860B" },
      { name: "Nâu vàng ánh đồng", color: "#CD853F" },
      { name: "Nâu caramel", color: "#D2691E" },
      { name: "Auburn nhẹ", color: "#A0522D" }
    ],
    jewelry: "Vàng gold đậm và đồng thau là lựa chọn hoàn hảo. Kim loại ấm, giàu sắc vàng sẽ tôn lên vẻ rạng rỡ. Hổ phách, citrine và vàng champagne rất hợp.",
    celebrities: ["Thanh Hằng", "Jennifer Aniston", "Emma Stone", "Park Min-young", "Gigi Hadid", "Shin Min-a"],
    products: [
      { emoji: "💄", name: "Son MAC Matte #Mocha", brand: "MAC", price: "480.000₫", url: "https://shopee.vn/search?keyword=mac+matte+mocha" },
      { emoji: "🧴", name: "Kem nền Maybelline Fit Me #128", brand: "Maybelline", price: "145.000₫", url: "https://shopee.vn/search?keyword=maybelline+fit+me+128" },
      { emoji: "🎨", name: "Bảng mắt Too Faced Natural Eyes", brand: "Too Faced", price: "520.000₫", url: "https://shopee.vn/search?keyword=too+faced+natural+eyes" },
      { emoji: "💗", name: "Má hồng Milani Baked #05 Luminoso", brand: "Milani", price: "195.000₫", url: "https://shopee.vn/search?keyword=milani+baked+blush+luminoso" }
    ]
  },

  // ==================== SUMMER (Cool + Light + Soft) ====================

  lightsummer: {
    key: "lightsummer",
    baseseason: "summer",
    emoji: "🌊",
    name: "Hạ Nhẹ Nhàng",
    enName: "Light Summer",
    subtitle: "Nhẹ nhàng — Thanh tao — Mát dịu",
    description: "Bạn sở hữu vẻ đẹp nhẹ nhàng, thanh tao nhất trong họ Hạ! Tông sáng mát, pastel dịu nhẹ là đặc trưng. Các gam màu sáng, mát và mềm mại sẽ tôn lên vẻ tinh khiết tự nhiên.",
    gradient: "linear-gradient(135deg, #93C5FD, #FBCFE8)",
    primary: "#7AAFDC",
    light: "#F0F7FF",
    palette: [
      "#B4C7E7", "#FBCFE8", "#A8D8EA", "#E2C2D9",
      "#93C5FD", "#F2B5D4", "#B5E0F0", "#D4A8E0",
      "#C1E1C1", "#DDD6FE", "#FFD1DC", "#A5D8FF"
    ],
    avoid: ["#FF6600", "#FF4500", "#8B4513", "#B8860B", "#800000", "#2F4F4F"],
    makeup: {
      foundation: { text: "Kem nền tông sáng mát: porcelain, light rose", colors: ["#F5E8E0", "#F0D5D0", "#F8E8E0"] },
      lip: { text: "Son hồng nhạt, rose nude, baby pink", colors: ["#FFB6C1", "#F2B5D4", "#E88EAF"] },
      blush: { text: "Má hồng baby pink, hồng mát nhạt", colors: ["#FFD1DC", "#FBCFE8", "#F2B5D4"] },
      eyeshadow: { text: "Phấn mắt pastel hồng, xanh baby, lavender nhạt", colors: ["#FBCFE8", "#A8D8EA", "#DDD6FE"] }
    },
    clothing: [
      { cat: "Công sở", colors: ["Xám nhạt mát", "Blue nhạt", "Hồng phấn"] },
      { cat: "Dạo phố", colors: ["Baby blue", "Hồng pastel", "Lavender nhạt"] },
      { cat: "Dự tiệc", colors: ["Hồng rose", "Xanh sky", "Bạc nhẹ"] },
      { cat: "Casual", colors: ["Trắng tinh", "Xanh nhạt", "Hồng powder"] },
      { cat: "Phụ kiện", colors: ["Bạc nhẹ", "Ngọc trai trắng", "Xám xanh"] }
    ],
    hair: [
      { name: "Nâu tro nhạt", color: "#A09080" },
      { name: "Nâu xám sáng", color: "#9B8B7B" },
      { name: "Vàng tro", color: "#B0A090" },
      { name: "Nâu nhạt mát", color: "#8B7D70" }
    ],
    jewelry: "Bạc nhẹ, vàng trắng và ngọc trai là lựa chọn hoàn hảo. Kim loại sáng, mát nhẹ nhàng tôn lên vẻ thanh tao. Moonstone, aquamarine và rose quartz rất phù hợp.",
    celebrities: ["Bae Suzy", "Cate Blanchett", "Yoona (SNSD)", "Elle Fanning", "Song Hye-kyo", "Shin Se-kyung"],
    products: [
      { emoji: "💄", name: "Son Romand Glasting Melting Balm #02", brand: "Romand", price: "175.000₫", url: "https://shopee.vn/search?keyword=romand+glasting+melting+balm+02" },
      { emoji: "🧴", name: "Kem nền Missha M Perfect #21", brand: "Missha", price: "185.000₫", url: "https://shopee.vn/search?keyword=missha+m+perfect+21" },
      { emoji: "🎨", name: "Bảng mắt Etude Play Color #Lavender Land", brand: "Etude", price: "280.000₫", url: "https://shopee.vn/search?keyword=etude+play+color+lavender" },
      { emoji: "💗", name: "Má hồng Clio Prism Air #02 Pink", brand: "Clio", price: "230.000₫", url: "https://shopee.vn/search?keyword=clio+prism+air+blush+02" }
    ]
  },

  coolsummer: {
    key: "coolsummer",
    baseseason: "summer",
    emoji: "🌊",
    name: "Hạ Mát Mẻ",
    enName: "Cool Summer",
    subtitle: "Mát mẻ — Thanh nhã — Tinh tế",
    description: "Bạn toát lên vẻ thanh nhã, mát mẻ đặc trưng nhất của họ Hạ! Tông mát lạnh là điểm nổi bật. Các gam màu xanh dương, tím và hồng mát sẽ tôn lên vẻ tinh tế sang trọng.",
    gradient: "linear-gradient(135deg, #6C9BCF, #C084FC)",
    primary: "#6C9BCF",
    light: "#EEF4FF",
    palette: [
      "#6C9BCF", "#C084FC", "#FDA4AF", "#93C5FD",
      "#A5B4FC", "#B4C7E7", "#D4A8E0", "#7AAAD4",
      "#8B9DC3", "#DDD6FE", "#E88EAF", "#4A8FD4"
    ],
    avoid: ["#FF6600", "#FF8C00", "#DAA520", "#8B4513", "#FF4500", "#B8860B"],
    makeup: {
      foundation: { text: "Kem nền tông hồng mát: rose beige, cool porcelain", colors: ["#F5E0D5", "#F0D0C0", "#E8C8BC"] },
      lip: { text: "Son hồng berry, hồng mận, rose mát", colors: ["#DB7093", "#C084FC", "#E88EAF"] },
      blush: { text: "Má hồng tím lavender, hồng lạnh", colors: ["#DDA0DD", "#FDA4AF", "#E88EAF"] },
      eyeshadow: { text: "Phấn mắt tím nhạt, xám bạc, xanh slate", colors: ["#C4B5FD", "#B0C4DE", "#8B9DC3"] }
    },
    clothing: [
      { cat: "Công sở", colors: ["Xám xanh", "Navy nhạt", "Hồng bụi"] },
      { cat: "Dạo phố", colors: ["Lavender", "Blue steel", "Hồng mauve"] },
      { cat: "Dự tiệc", colors: ["Tím wisteria", "Xanh sapphire", "Bạc"] },
      { cat: "Casual", colors: ["Trắng tinh", "Xám mát", "Xanh dương nhẹ"] },
      { cat: "Phụ kiện", colors: ["Bạc", "Bạch kim", "Xám lam"] }
    ],
    hair: [
      { name: "Nâu tro", color: "#8B7D7B" },
      { name: "Nâu xám mát", color: "#7B6B63" },
      { name: "Tím than nhẹ", color: "#4A3F55" },
      { name: "Đen mềm (soft black)", color: "#2C2C2C" }
    ],
    jewelry: "Bạc, bạch kim và vàng trắng là sự lựa chọn lý tưởng. Kim loại mát, sáng tôn lên vẻ thanh nhã. Amethyst, sapphire nhạt và tanzanite rất hợp với bạn.",
    celebrities: ["Hoàng Thùy Linh", "Jisoo (BLACKPINK)", "Kate Middleton", "Song Ji-hyo", "Anne Hathaway", "Kim Ji-won"],
    products: [
      { emoji: "💄", name: "Son Romand Juicy Lasting Tint #12", brand: "Romand", price: "165.000₫", url: "https://shopee.vn/search?keyword=romand+juicy+lasting+tint+12" },
      { emoji: "🧴", name: "Kem nền Laneige Neo Cushion #21C", brand: "Laneige", price: "650.000₫", url: "https://shopee.vn/search?keyword=laneige+neo+cushion+21c" },
      { emoji: "🎨", name: "Bảng mắt Romand Better Than Eyes #03", brand: "Romand", price: "215.000₫", url: "https://shopee.vn/search?keyword=romand+better+than+eyes+03" },
      { emoji: "💗", name: "Má hồng Clio Prism Air #04 Pink Fleet", brand: "Clio", price: "230.000₫", url: "https://shopee.vn/search?keyword=clio+prism+air+blush+04" }
    ]
  },

  softsummer: {
    key: "softsummer",
    baseseason: "summer",
    emoji: "🌊",
    name: "Hạ Dịu Dàng",
    enName: "Soft Summer",
    subtitle: "Dịu dàng — Mờ ảo — Êm ái",
    description: "Bạn mang vẻ đẹp dịu dàng, mờ ảo nhất trong họ Hạ! Tông muted, xám nhẹ và mềm mại là đặc trưng. Các gam màu trầm mát, ít bão hòa sẽ tôn lên sự hài hòa tự nhiên của bạn.",
    gradient: "linear-gradient(135deg, #A5B4C8, #C4A8C0)",
    primary: "#8E99A4",
    light: "#F5F0F0",
    palette: [
      "#A5B4C8", "#C4A8C0", "#B0BEC5", "#C9B8C8",
      "#8E99A4", "#C8B8B0", "#A0ADB8", "#B8A8B0",
      "#98A8A0", "#D4C8D0", "#B4B8A8", "#C0B0B8"
    ],
    avoid: ["#FF0000", "#FF6600", "#FFFF00", "#00FF00", "#FF1493", "#FF4500"],
    makeup: {
      foundation: { text: "Kem nền tông trung tính mát: neutral beige, soft rose", colors: ["#E8D8D0", "#E0D0C8", "#D8C8C0"] },
      lip: { text: "Son hồng đất, mauve, berry nhạt", colors: ["#C4A8B0", "#B8909A", "#A08888"] },
      blush: { text: "Má hồng mauve nhẹ, hồng xám", colors: ["#C9B8C8", "#C4A8B0", "#B8A0A8"] },
      eyeshadow: { text: "Phấn mắt xám nâu, taupe, mauve nhạt", colors: ["#A5B4C8", "#B0A898", "#C4A8C0"] }
    },
    clothing: [
      { cat: "Công sở", colors: ["Xám trung tính", "Xanh bụi", "Nâu xám"] },
      { cat: "Dạo phố", colors: ["Mauve", "Xám xanh nhẹ", "Hồng bụi"] },
      { cat: "Dự tiệc", colors: ["Xám bạc", "Tím bụi", "Xanh slate"] },
      { cat: "Casual", colors: ["Xám kem", "Xanh xám nhạt", "Be xám"] },
      { cat: "Phụ kiện", colors: ["Bạc mờ", "Xám khói", "Ngọc trai xám"] }
    ],
    hair: [
      { name: "Nâu tro trung tính", color: "#7A7068" },
      { name: "Nâu xám mềm", color: "#6B6058" },
      { name: "Nâu khói", color: "#786B60" },
      { name: "Xám nâu mát", color: "#706560" }
    ],
    jewelry: "Bạc mờ, vàng trắng nhẹ và pewter rất phù hợp. Kim loại mềm mại, ít sáng bóng tôn lên sự dịu dàng. Labradorite, ngọc trai xám và đá mặt trăng rất hợp.",
    celebrities: ["Jun Ji-hyun", "Sarah Jessica Parker", "Kim Ha-neul", "Leighton Meester", "Han Ga-in", "Gong Hyo-jin"],
    products: [
      { emoji: "💄", name: "Son 3CE Velvet Lip Tint #Near & Dear", brand: "3CE", price: "280.000₫", url: "https://shopee.vn/search?keyword=3ce+velvet+lip+tint+near+dear" },
      { emoji: "🧴", name: "Kem nền Innisfree My Foundation #N21", brand: "Innisfree", price: "280.000₫", url: "https://shopee.vn/search?keyword=innisfree+my+foundation+n21" },
      { emoji: "🎨", name: "Bảng mắt 3CE Multi Eye #Smoother", brand: "3CE", price: "420.000₫", url: "https://shopee.vn/search?keyword=3ce+multi+eye+smoother" },
      { emoji: "💗", name: "Má hồng Canmake Glow Fleur #08 Plum Cherry", brand: "Canmake", price: "195.000₫", url: "https://shopee.vn/search?keyword=canmake+glow+fleur+08" }
    ]
  },

  // ==================== AUTUMN (Warm + Dark + Soft) ====================

  warmautumn: {
    key: "warmautumn",
    baseseason: "autumn",
    emoji: "🍂",
    name: "Thu Ấm Áp",
    enName: "Warm Autumn",
    subtitle: "Ấm áp — Đất — Phong phú",
    description: "Bạn toát lên vẻ ấm áp, phong phú nhất trong họ Thu! Tông ấm đậm, giàu sắc đất là đặc trưng. Những gam màu đất ấm, cam cháy và nâu vàng sẽ tôn lên vẻ sang trọng của bạn.",
    gradient: "linear-gradient(135deg, #C4723A, #D4923A)",
    primary: "#C4723A",
    light: "#FFF3EA",
    palette: [
      "#C4723A", "#CD853F", "#D2691E", "#B8860B",
      "#D4923A", "#A0763C", "#8B6914", "#DAA520",
      "#E8A83A", "#F4A460", "#CC7722", "#BF8040"
    ],
    avoid: ["#FF69B4", "#00BFFF", "#E6E6FA", "#F0F8FF", "#FF1493", "#7FFFD4"],
    makeup: {
      foundation: { text: "Kem nền tông ấm: golden sand, warm honey", colors: ["#DEB887", "#D2B48C", "#C4A882"] },
      lip: { text: "Son cam đất, đỏ gạch ấm, nâu cam", colors: ["#C4723A", "#D2691E", "#A0522D"] },
      blush: { text: "Má hồng cam đất, nâu đào ấm", colors: ["#D4923A", "#CD853F", "#CC7722"] },
      eyeshadow: { text: "Phấn mắt vàng đồng, amber, nâu ấm", colors: ["#B8860B", "#DAA520", "#CD853F"] }
    },
    clothing: [
      { cat: "Công sở", colors: ["Camel đậm", "Nâu ấm", "Olive đậm"] },
      { cat: "Dạo phố", colors: ["Cam đất", "Vàng mù tạt", "Đỏ gạch"] },
      { cat: "Dự tiệc", colors: ["Vàng đồng", "Cam cháy", "Xanh ngọc đậm"] },
      { cat: "Casual", colors: ["Trắng kem", "Be nâu", "Nâu caramel"] },
      { cat: "Phụ kiện", colors: ["Da bò", "Đồng thau", "Vàng cổ điển"] }
    ],
    hair: [
      { name: "Nâu đồng ấm", color: "#8B5E3C" },
      { name: "Nâu vàng đậm", color: "#8B6914" },
      { name: "Auburn", color: "#A0522D" },
      { name: "Nâu mật ong đậm", color: "#8B7332" }
    ],
    jewelry: "Vàng cổ điển và đồng thau là sự lựa chọn hoàn hảo. Kim loại ấm, giàu sắc tôn lên vẻ sang trọng. Hổ phách, citrine và đá mắt hổ rất phù hợp.",
    celebrities: ["Minh Hằng", "Jennifer Aniston", "Beyoncé", "Kim Tae-hee", "Jessica Chastain", "Gong Hyo-jin"],
    products: [
      { emoji: "💄", name: "Son MAC Matte #Marrakesh", brand: "MAC", price: "480.000₫", url: "https://shopee.vn/search?keyword=mac+matte+marrakesh" },
      { emoji: "🧴", name: "Kem nền L'Oréal True Match #W5", brand: "L'Oréal", price: "225.000₫", url: "https://shopee.vn/search?keyword=loreal+true+match+w5" },
      { emoji: "🎨", name: "Bảng mắt Too Faced Natural Matte", brand: "Too Faced", price: "550.000₫", url: "https://shopee.vn/search?keyword=too+faced+natural+matte" },
      { emoji: "💗", name: "Má hồng Milani Baked #02 Rose D'Oro", brand: "Milani", price: "195.000₫", url: "https://shopee.vn/search?keyword=milani+baked+blush+02" }
    ]
  },

  deepautumn: {
    key: "deepautumn",
    baseseason: "autumn",
    emoji: "🍂",
    name: "Thu Sâu Lắng",
    enName: "Deep Autumn",
    subtitle: "Sâu lắng — Đậm — Bí ẩn",
    description: "Bạn sở hữu vẻ đẹp sâu lắng, đậm nhất trong họ Thu! Tông tối ấm, phong phú và bí ẩn là đặc trưng. Các gam màu đậm, giàu sắc ấm sẽ tôn lên vẻ quyến rũ mạnh mẽ.",
    gradient: "linear-gradient(135deg, #8B4513, #4E342E)",
    primary: "#8B4513",
    light: "#FFF0E6",
    palette: [
      "#8B4513", "#4E342E", "#6B3A2A", "#A0522D",
      "#3E2723", "#5D4037", "#795548", "#8D6E63",
      "#556B2F", "#2E4C1F", "#8B0000", "#B8860B"
    ],
    avoid: ["#FF69B4", "#00BFFF", "#E6E6FA", "#F0F8FF", "#FF1493", "#CCCCCC"],
    makeup: {
      foundation: { text: "Kem nền tông ấm sâu: warm caramel, deep honey", colors: ["#C4A882", "#B8986E", "#A08862"] },
      lip: { text: "Son nâu đỏ, đỏ rượu ấm, chocolate", colors: ["#8B4513", "#800000", "#6B3A2A"] },
      blush: { text: "Má hồng nâu đào, cam đất đậm", colors: ["#A0522D", "#8D6E63", "#795548"] },
      eyeshadow: { text: "Phấn mắt nâu đậm, olive sâu, đồng đậm", colors: ["#4E342E", "#556B2F", "#8B6914"] }
    },
    clothing: [
      { cat: "Công sở", colors: ["Nâu sô-cô-la", "Olive đậm", "Đỏ rượu"] },
      { cat: "Dạo phố", colors: ["Đỏ gạch đậm", "Xanh rêu", "Nâu đất"] },
      { cat: "Dự tiệc", colors: ["Đỏ rượu vang", "Vàng đồng đậm", "Xanh ngọc sậm"] },
      { cat: "Casual", colors: ["Kem đậm", "Nâu tối", "Olive"] },
      { cat: "Phụ kiện", colors: ["Da bò đậm", "Đồng cổ", "Vàng antique"] }
    ],
    hair: [
      { name: "Nâu chocolate đậm", color: "#3E2723" },
      { name: "Nâu espresso", color: "#4E342E" },
      { name: "Auburn đậm", color: "#6B3A2A" },
      { name: "Nâu đen ấm", color: "#2C1A0E" }
    ],
    jewelry: "Vàng antique, đồng cổ điển và vàng hồng đậm rất phù hợp. Chọn đá ấm sâu: garnet, emerald đậm, hổ phách tối. Tránh bạc sáng bóng.",
    celebrities: ["Jennie (BLACKPINK)", "Penélope Cruz", "Song Joong-ki", "Eva Mendes", "Priyanka Chopra", "Gong Yoo"],
    products: [
      { emoji: "💄", name: "Son MAC Matte #Chili", brand: "MAC", price: "480.000₫", url: "https://shopee.vn/search?keyword=mac+matte+chili" },
      { emoji: "🧴", name: "Kem nền L'Oréal True Match #W7", brand: "L'Oréal", price: "225.000₫", url: "https://shopee.vn/search?keyword=loreal+true+match+w7" },
      { emoji: "🎨", name: "Bảng mắt Urban Decay Naked Heat", brand: "Urban Decay", price: "650.000₫", url: "https://shopee.vn/search?keyword=urban+decay+naked+heat" },
      { emoji: "💗", name: "Má hồng NARS Blush #Taj Mahal", brand: "NARS", price: "550.000₫", url: "https://shopee.vn/search?keyword=nars+blush+taj+mahal" }
    ]
  },

  softautumn: {
    key: "softautumn",
    baseseason: "autumn",
    emoji: "🍂",
    name: "Thu Dịu Nhẹ",
    enName: "Soft Autumn",
    subtitle: "Dịu nhẹ — Mờ ấm — Hài hòa",
    description: "Bạn mang vẻ đẹp dịu nhẹ, hài hòa nhất trong họ Thu! Tông muted ấm, xám vàng mềm mại là đặc trưng. Các gam màu đất nhẹ, ít bão hòa sẽ tôn lên sự tinh tế nhẹ nhàng.",
    gradient: "linear-gradient(135deg, #C4A882, #A89880)",
    primary: "#A89068",
    light: "#F8F2EA",
    palette: [
      "#C4A882", "#A89880", "#B8A890", "#C0A888",
      "#A09078", "#D4C4A8", "#B8A480", "#C8B898",
      "#98A088", "#B0A090", "#C4B498", "#A8A098"
    ],
    avoid: ["#FF0000", "#0000FF", "#FF1493", "#00FF00", "#FF4500", "#8A2BE2"],
    makeup: {
      foundation: { text: "Kem nền tông trung tính ấm: nude beige, soft sand", colors: ["#D8C8B0", "#D0C0A8", "#C8B8A0"] },
      lip: { text: "Son nude ấm, hồng đất, nâu nhạt", colors: ["#C4A882", "#B89880", "#A89070"] },
      blush: { text: "Má hồng đào nhạt, nâu hồng mờ", colors: ["#C4A888", "#C0A890", "#B8A080"] },
      eyeshadow: { text: "Phấn mắt taupe, nâu xám, olive nhạt", colors: ["#A89880", "#B8A890", "#98A088"] }
    },
    clothing: [
      { cat: "Công sở", colors: ["Nâu xám", "Be ấm", "Olive nhạt"] },
      { cat: "Dạo phố", colors: ["Nâu đất nhạt", "Xanh rêu mờ", "Camel nhạt"] },
      { cat: "Dự tiệc", colors: ["Vàng champagne", "Nâu rose", "Olive ánh vàng"] },
      { cat: "Casual", colors: ["Trắng kem", "Be xám", "Xanh sage"] },
      { cat: "Phụ kiện", colors: ["Da bò nhạt", "Vàng mờ", "Đồng nhẹ"] }
    ],
    hair: [
      { name: "Nâu tro ấm", color: "#8B7B68" },
      { name: "Nâu mật ong nhạt", color: "#9B8B70" },
      { name: "Nâu xám ấm", color: "#807060" },
      { name: "Nâu cát", color: "#A09078" }
    ],
    jewelry: "Vàng mờ, đồng nhẹ và vàng hồng mềm mại rất phù hợp. Kim loại ấm nhẹ, không quá sáng bóng. Jasper, mã não và đá gỗ hóa thạch rất hợp.",
    celebrities: ["Park Shin-hye", "Drew Barrymore", "Shin Min-a", "Jennifer Lopez", "Han Hyo-joo", "Nicole Kidman"],
    products: [
      { emoji: "💄", name: "Son 3CE Velvet Lip Tint #Taupe", brand: "3CE", price: "280.000₫", url: "https://shopee.vn/search?keyword=3ce+velvet+lip+tint+taupe" },
      { emoji: "🧴", name: "Kem nền Innisfree My Foundation #W23", brand: "Innisfree", price: "280.000₫", url: "https://shopee.vn/search?keyword=innisfree+my+foundation+w23" },
      { emoji: "🎨", name: "Bảng mắt 3CE Multi Eye #Overtake", brand: "3CE", price: "420.000₫", url: "https://shopee.vn/search?keyword=3ce+multi+eye+overtake" },
      { emoji: "💗", name: "Má hồng Canmake Glow Fleur #10", brand: "Canmake", price: "195.000₫", url: "https://shopee.vn/search?keyword=canmake+glow+fleur+10" }
    ]
  },

  // ==================== WINTER (Cool + Dark + Clear) ====================

  coolwinter: {
    key: "coolwinter",
    baseseason: "winter",
    emoji: "❄️",
    name: "Đông Mát Lạnh",
    enName: "Cool Winter",
    subtitle: "Mát lạnh — Thanh lịch — Kiêu sa",
    description: "Bạn toát lên vẻ mát lạnh, thanh lịch nhất trong họ Đông! Tông lạnh đậm, sắc nét là đặc trưng. Các gam màu mát, đậm và sắc sảo sẽ tôn lên vẻ kiêu sa quyến rũ.",
    gradient: "linear-gradient(135deg, #5B21B6, #1E3A5F)",
    primary: "#5B21B6",
    light: "#F3EEFF",
    palette: [
      "#5B21B6", "#1E3A5F", "#BE185D", "#4338CA",
      "#7C3AED", "#0EA5E9", "#EC4899", "#2563EB",
      "#6D28D9", "#1D4ED8", "#DB2777", "#3B82F6"
    ],
    avoid: ["#FFD700", "#FFA500", "#F5DEB3", "#FAEBD7", "#DEB887", "#F0E68C"],
    makeup: {
      foundation: { text: "Kem nền tông mát: cool porcelain, pink beige", colors: ["#F5E0D5", "#E8D5C8", "#F0D5C5"] },
      lip: { text: "Son berry đậm, hồng fuchsia, đỏ cherry mát", colors: ["#BE185D", "#DB2777", "#DC2626"] },
      blush: { text: "Má hồng berry mát, tím hồng", colors: ["#EC4899", "#BE185D", "#A855F7"] },
      eyeshadow: { text: "Phấn mắt tím đậm, navy, bạc lấp lánh", colors: ["#5B21B6", "#1E3A5F", "#C0C0C0"] }
    },
    clothing: [
      { cat: "Công sở", colors: ["Navy đậm", "Xám than", "Tím đậm"] },
      { cat: "Dạo phố", colors: ["Cobalt blue", "Hồng fuchsia", "Tím violet"] },
      { cat: "Dự tiệc", colors: ["Tím hoàng gia", "Đỏ cherry", "Navy midnight"] },
      { cat: "Casual", colors: ["Trắng tinh", "Xám mát", "Xanh navy"] },
      { cat: "Phụ kiện", colors: ["Bạc", "Bạch kim", "Tím đá"] }
    ],
    hair: [
      { name: "Đen mát", color: "#0F0F18" },
      { name: "Nâu đen tím", color: "#1A1020" },
      { name: "Nâu tro đậm", color: "#2C2830" },
      { name: "Đen xanh navy", color: "#0D1525" }
    ],
    jewelry: "Bạc, bạch kim và vàng trắng là lựa chọn hoàn hảo. Kim loại mát sáng tạo sự tương phản đẹp. Amethyst, sapphire và tanzanite rất phù hợp phong cách kiêu sa.",
    celebrities: ["Ninh Dương Lan Ngọc", "Angelina Jolie", "Jun Ji-hyun", "Lupita Nyong'o", "Song Hye-kyo", "Lee Young-ae"],
    products: [
      { emoji: "💄", name: "Son YSL Rouge Pur Couture #01", brand: "YSL", price: "850.000₫", url: "https://shopee.vn/search?keyword=ysl+rouge+pur+couture+01" },
      { emoji: "🧴", name: "Kem nền Estée Lauder Double Wear #1C0", brand: "Estée Lauder", price: "950.000₫", url: "https://shopee.vn/search?keyword=estee+lauder+double+wear+1c0" },
      { emoji: "🎨", name: "Bảng mắt Urban Decay Naked 2", brand: "Urban Decay", price: "650.000₫", url: "https://shopee.vn/search?keyword=urban+decay+naked+2" },
      { emoji: "💗", name: "Má hồng NARS Blush #Orgasm", brand: "NARS", price: "550.000₫", url: "https://shopee.vn/search?keyword=nars+blush+orgasm" }
    ]
  },

  deepwinter: {
    key: "deepwinter",
    baseseason: "winter",
    emoji: "❄️",
    name: "Đông Sâu Thẳm",
    enName: "Deep Winter",
    subtitle: "Sâu thẳm — Mạnh mẽ — Đầy sức hút",
    description: "Bạn sở hữu vẻ đẹp sâu thẳm, mạnh mẽ nhất trong họ Đông! Tông tối, tương phản cao và đậm là đặc trưng. Các gam màu đậm, giàu sắc sẽ tôn lên vẻ cuốn hút đầy quyền lực.",
    gradient: "linear-gradient(135deg, #1A1A2E, #4A0E8F)",
    primary: "#2D1B69",
    light: "#F0ECFF",
    palette: [
      "#1A1A2E", "#4A0E8F", "#DC2626", "#0F172A",
      "#14532D", "#800020", "#1E3A5F", "#4C0070",
      "#0D47A1", "#B71C1C", "#1B5E20", "#311B92"
    ],
    avoid: ["#FFD700", "#FFA500", "#FAEBD7", "#F5DEB3", "#DEB887", "#FFFACD"],
    makeup: {
      foundation: { text: "Kem nền tông mát sâu: cool medium, deep cool", colors: ["#E0C8C0", "#D0B8B0", "#C8B0A8"] },
      lip: { text: "Son đỏ đậm, mận đen, rượu vang", colors: ["#DC2626", "#800020", "#4C0070"] },
      blush: { text: "Má hồng berry đậm, mận", colors: ["#B71C1C", "#800020", "#8B0040"] },
      eyeshadow: { text: "Phấn mắt đen khói, navy đậm, tím than", colors: ["#1A1A2E", "#0D47A1", "#311B92"] }
    },
    clothing: [
      { cat: "Công sở", colors: ["Đen", "Navy midnight", "Xám than đậm"] },
      { cat: "Dạo phố", colors: ["Đỏ đậm", "Xanh forest", "Tím aubergine"] },
      { cat: "Dự tiệc", colors: ["Đen sang trọng", "Đỏ rượu", "Xanh ngọc đậm"] },
      { cat: "Casual", colors: ["Trắng tinh", "Đen mềm", "Denim đậm"] },
      { cat: "Phụ kiện", colors: ["Bạc đen", "Bạch kim", "Đen bóng"] }
    ],
    hair: [
      { name: "Đen nhánh", color: "#0A0A0A" },
      { name: "Đen tuyền", color: "#050505" },
      { name: "Nâu đen mát", color: "#1C1C1C" },
      { name: "Đen xanh đậm", color: "#0A0F1A" }
    ],
    jewelry: "Bạch kim, bạc đen và vàng trắng đậm là lựa chọn mạnh mẽ. Kim cương, sapphire đen, onyx và garnet đỏ đậm rất phù hợp. Tạo sự tương phản với đá quý sắc nét.",
    celebrities: ["Lisa (BLACKPINK)", "Lee Dong-wook", "Rihanna", "Kim Soo-hyun", "Zendaya", "Hyun Bin"],
    products: [
      { emoji: "💄", name: "Son MAC Matte #Diva", brand: "MAC", price: "480.000₫", url: "https://shopee.vn/search?keyword=mac+matte+diva" },
      { emoji: "🧴", name: "Kem nền Estée Lauder Double Wear #2C0", brand: "Estée Lauder", price: "950.000₫", url: "https://shopee.vn/search?keyword=estee+lauder+double+wear+2c0" },
      { emoji: "🎨", name: "Bảng mắt NARS Ignited Palette", brand: "NARS", price: "850.000₫", url: "https://shopee.vn/search?keyword=nars+ignited+palette" },
      { emoji: "💗", name: "Má hồng NARS Blush #Sin", brand: "NARS", price: "550.000₫", url: "https://shopee.vn/search?keyword=nars+blush+sin" }
    ]
  },

  brightwinter: {
    key: "brightwinter",
    baseseason: "winter",
    emoji: "❄️",
    name: "Đông Sắc Nét",
    enName: "Bright Winter",
    subtitle: "Sắc nét — Tương phản — Ấn tượng",
    description: "Bạn tỏa sáng với vẻ sắc nét, ấn tượng nhất trong họ Đông! Tông mát, tương phản cực cao và sắc màu sống động là đặc trưng. Các gam màu tươi, bão hòa cao sẽ làm bạn thêm nổi bật.",
    gradient: "linear-gradient(135deg, #7C3AED, #EC4899)",
    primary: "#7C3AED",
    light: "#F5F0FF",
    palette: [
      "#7C3AED", "#EC4899", "#DC2626", "#FFFFFF",
      "#0EA5E9", "#10B981", "#F43F5E", "#6366F1",
      "#2563EB", "#14B8A6", "#E11D48", "#8B5CF6"
    ],
    avoid: ["#FFD700", "#FFA500", "#F5DEB3", "#DEB887", "#F0E68C", "#808080"],
    makeup: {
      foundation: { text: "Kem nền tông mát sáng: cool beige, neutral cool", colors: ["#F5E0D5", "#ECD0C8", "#F0D8D0"] },
      lip: { text: "Son đỏ tươi, hồng hot pink, berry sáng", colors: ["#DC2626", "#EC4899", "#E11D48"] },
      blush: { text: "Má hồng fuchsia, hồng tươi", colors: ["#EC4899", "#F43F5E", "#E11D48"] },
      eyeshadow: { text: "Phấn mắt bạc lấp lánh, tím sáng, xanh cobalt", colors: ["#C0C0C0", "#7C3AED", "#2563EB"] }
    },
    clothing: [
      { cat: "Công sở", colors: ["Đen tuyền", "Trắng tinh", "Cobalt blue"] },
      { cat: "Dạo phố", colors: ["Đỏ tươi", "Hồng hot pink", "Xanh emerald"] },
      { cat: "Dự tiệc", colors: ["Tím electric", "Đỏ ruby", "Bạc lấp lánh"] },
      { cat: "Casual", colors: ["Trắng & đen", "Royal blue", "Xanh teal"] },
      { cat: "Phụ kiện", colors: ["Bạc sáng", "Pha lê", "Kim cương giả"] }
    ],
    hair: [
      { name: "Đen nhánh bóng", color: "#0A0A0A" },
      { name: "Nâu đen mát", color: "#1C1C1C" },
      { name: "Đen xanh", color: "#0D1B2A" },
      { name: "Nâu tro sáng", color: "#3C3838" }
    ],
    jewelry: "Bạc sáng bóng, bạch kim và kim cương là lựa chọn tuyệt vời. Kim loại mát, sáng lấp lánh tạo sự tương phản hoàn hảo. Sapphire xanh, ruby và emerald rất phù hợp.",
    celebrities: ["Kim Go-eun", "Lucy Liu", "Katy Perry", "Lee Na-young", "Megan Fox", "Jeon Do-yeon"],
    products: [
      { emoji: "💄", name: "Son YSL Rouge Volupté Shine #80", brand: "YSL", price: "850.000₫", url: "https://shopee.vn/search?keyword=ysl+rouge+volupte+shine+80" },
      { emoji: "🧴", name: "Kem nền Laneige Neo Cushion #21N", brand: "Laneige", price: "650.000₫", url: "https://shopee.vn/search?keyword=laneige+neo+cushion+21n" },
      { emoji: "🎨", name: "Bảng mắt Romand Better Than Eyes #01", brand: "Romand", price: "215.000₫", url: "https://shopee.vn/search?keyword=romand+better+than+eyes+01" },
      { emoji: "💗", name: "Má hồng NARS Blush #Exhibit A", brand: "NARS", price: "550.000₫", url: "https://shopee.vn/search?keyword=nars+blush+exhibit+a" }
    ]
  }
};

// ===== STATE =====
let currentQ = 0;
let scores = { temp: 0, depth: 0, clarity: 0 };
let answers = [];
let scoreHistory = [];
let currentSeason = null;

// AI Camera state
let cameraStream = null;
let facingMode = 'user';
let capturedImageData = null;

// ===== SCREEN MANAGEMENT =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== QUIZ FLOW =====
function startQuiz() {
  currentQ = 0;
  scores = { temp: 0, depth: 0, clarity: 0 };
  answers = [];
  scoreHistory = [];
  currentSeason = null;
  showScreen('quiz-screen');
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[currentQ];
  const pct = Math.round(((currentQ + 1) / QUESTIONS.length) * 100);

  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = `${currentQ + 1} / ${QUESTIONS.length}`;
  document.getElementById('question-text').textContent = q.text;
  document.getElementById('question-hint').textContent = q.hint || '';

  const backBtn = document.getElementById('back-btn');
  backBtn.disabled = currentQ === 0;

  const list = document.getElementById('options-list');
  list.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-letter">${letters[idx]}</span><span>${opt.text}</span>`;
    btn.onclick = () => selectOption(idx, btn);
    list.appendChild(btn);
  });
}

function selectOption(idx, btn) {
  // Disable all buttons to prevent double-click
  document.querySelectorAll('.option-btn').forEach(b => { b.disabled = true; });
  btn.classList.add('selected');

  const opt = QUESTIONS[currentQ].options[idx];

  // Save history for goBack
  scoreHistory.push({ temp: opt.temp, depth: opt.depth, clarity: opt.clarity });

  // Accumulate scores
  scores.temp += opt.temp;
  scores.depth += opt.depth;
  scores.clarity += opt.clarity;
  answers.push(idx);

  setTimeout(() => {
    currentQ++;
    if (currentQ < QUESTIONS.length) {
      renderQuestion();
    } else {
      showLoading();
    }
  }, 420);
}

function goBack() {
  if (currentQ === 0) return;

  const last = scoreHistory.pop();
  scores.temp -= last.temp;
  scores.depth -= last.depth;
  scores.clarity -= last.clarity;
  answers.pop();

  currentQ--;
  renderQuestion();
}

// ===== LOADING =====
function showLoading() {
  showScreen('loading-screen');

  const steps = [
    document.getElementById('load-step-1'),
    document.getElementById('load-step-2'),
    document.getElementById('load-step-3')
  ];

  steps.forEach(s => { s.className = 'load-step'; });

  setTimeout(() => { steps[0].classList.add('active'); }, 300);
  setTimeout(() => { steps[0].classList.replace('active', 'done'); steps[1].classList.add('active'); }, 1200);
  setTimeout(() => { steps[1].classList.replace('active', 'done'); steps[2].classList.add('active'); }, 2200);
  setTimeout(() => {
    determineSeason();
    renderResult();
    showScreen('result-screen');
  }, 3200);
}

// ===== SEASON DETERMINATION (2-STAGE: base season → subtype) =====

// Stage 1: Determine base season via affinity formula (unchanged)
function getBaseSeason(temp, depth, clarity) {
  const affinities = {
    spring: temp + depth + clarity,     // Warm + Light + Clear
    summer: -temp + depth - clarity,    // Cool + Light + Soft
    autumn: temp - depth - clarity,     // Warm + Dark + Soft
    winter: -temp - depth + clarity     // Cool + Dark + Clear
  };

  let best = 'spring';
  let bestScore = -Infinity;
  for (const [season, score] of Object.entries(affinities)) {
    if (score > bestScore) {
      bestScore = score;
      best = season;
    }
  }
  return best;
}

// Stage 2: Within a base season, pick subtype by dominant axis
// Each season has 3 axes of interest; the axis with the largest absolute value wins.
function getSubtype(baseSeason, temp, depth, clarity) {
  const absTemp = Math.abs(temp);
  const absDepth = Math.abs(depth);
  const absClarity = Math.abs(clarity);

  switch (baseSeason) {
    case 'spring':
      // clarity dominant → brightspring, depth dominant → lightspring, temp dominant → warmspring
      if (absClarity >= absDepth && absClarity >= absTemp) return 'brightspring';
      if (absDepth >= absTemp) return 'lightspring';
      return 'warmspring';

    case 'summer':
      // depth dominant → lightsummer, temp dominant → coolsummer, clarity dominant → softsummer
      if (absDepth >= absTemp && absDepth >= absClarity) return 'lightsummer';
      if (absTemp >= absClarity) return 'coolsummer';
      return 'softsummer';

    case 'autumn':
      // temp dominant → warmautumn, depth dominant → deepautumn, clarity dominant → softautumn
      if (absTemp >= absDepth && absTemp >= absClarity) return 'warmautumn';
      if (absDepth >= absClarity) return 'deepautumn';
      return 'softautumn';

    case 'winter':
      // temp dominant → coolwinter, depth dominant → deepwinter, clarity dominant → brightwinter
      if (absTemp >= absDepth && absTemp >= absClarity) return 'coolwinter';
      if (absDepth >= absClarity) return 'deepwinter';
      return 'brightwinter';
  }
}

function determineSeason() {
  const { temp, depth, clarity } = scores;
  const baseSeason = getBaseSeason(temp, depth, clarity);
  const subtype = getSubtype(baseSeason, temp, depth, clarity);
  currentSeason = SEASONS[subtype];
}

// ===== RESULT RENDERING =====
function renderResult() {
  const s = currentSeason;

  // Apply season theme
  document.documentElement.style.setProperty('--season-primary', s.primary);
  document.documentElement.style.setProperty('--season-light', s.light);
  document.documentElement.style.setProperty('--season-gradient', s.gradient);

  // Header
  document.getElementById('result-emoji').textContent = s.emoji;
  document.getElementById('result-season').textContent = s.name;
  document.getElementById('result-en-name').textContent = s.enName;
  document.getElementById('result-subtitle').textContent = s.subtitle;
  document.getElementById('result-desc').textContent = s.description;

  // Base season badge
  const baseLabels = { spring: '🌸 Spring', summer: '🌊 Summer', autumn: '🍂 Autumn', winter: '❄️ Winter' };
  const baseBadge = document.getElementById('result-baseseason-badge');
  baseBadge.textContent = baseLabels[s.baseseason] || '';
  baseBadge.className = 'result-baseseason-badge baseseason-' + s.baseseason;

  // Result header background
  const header = document.getElementById('result-header');
  header.style.background = `${s.light}`;

  // 3-Axis bar chart
  renderAxisChart();

  // Color palette
  renderPalette(s);

  // Makeup guide
  renderMakeup(s);

  // Clothing
  renderClothing(s);

  // Hair
  renderHair(s);

  // Jewelry
  document.getElementById('jewelry-text').textContent = s.jewelry;

  // Celebrities
  renderCelebrities(s);

  // Products
  renderProducts(s);

  // Update URL hash
  updateUrlHash();
}

function renderAxisChart() {
  const { temp, depth, clarity } = scores;
  const maxPossible = 15; // approximate max per axis across 12 questions

  // Normalize to 0–100 range where 50 = center
  const normalize = (val) => {
    const pct = (val / maxPossible) * 50;
    return 50 + Math.max(-50, Math.min(50, pct));
  };

  const tempPct = normalize(temp);
  const depthPct = normalize(depth);
  const clarityPct = normalize(clarity);

  renderAxisBar('axis-temp', tempPct);
  renderAxisBar('axis-depth', depthPct);
  renderAxisBar('axis-clarity', clarityPct);
}

function renderAxisBar(id, pct) {
  const bar = document.getElementById(id);
  const center = 50;

  if (pct >= center) {
    bar.style.left = center + '%';
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = (pct - center) + '%'; }, 100);
  } else {
    bar.style.left = pct + '%';
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = (center - pct) + '%'; }, 100);
  }
}

function renderPalette(s) {
  const grid = document.getElementById('palette-grid');
  grid.innerHTML = '';
  s.palette.forEach(hex => {
    const div = document.createElement('div');
    div.className = 'swatch';
    div.style.backgroundColor = hex;
    div.innerHTML = `<span class="swatch-hex">${hex}</span>`;
    grid.appendChild(div);
  });

  const avoid = document.getElementById('palette-avoid');
  avoid.innerHTML = '';
  s.avoid.forEach(hex => {
    const div = document.createElement('div');
    div.className = 'swatch-avoid';
    div.style.backgroundColor = hex;
    avoid.appendChild(div);
  });
}

function renderMakeup(s) {
  const grid = document.getElementById('makeup-grid');
  grid.innerHTML = '';

  const items = [
    { label: 'Kem nền', data: s.makeup.foundation },
    { label: 'Son môi', data: s.makeup.lip },
    { label: 'Má hồng', data: s.makeup.blush },
    { label: 'Phấn mắt', data: s.makeup.eyeshadow }
  ];

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'makeup-item';
    div.innerHTML = `
      <div class="makeup-label">${item.label}</div>
      <div class="makeup-value">${item.data.text}</div>
      <div class="makeup-colors">
        ${item.data.colors.map(c => `<div class="makeup-dot" style="background:${c}"></div>`).join('')}
      </div>
    `;
    grid.appendChild(div);
  });
}

function renderClothing(s) {
  const list = document.getElementById('clothing-list');
  list.innerHTML = '';

  s.clothing.forEach(cat => {
    const div = document.createElement('div');
    div.className = 'clothing-item';
    div.innerHTML = `
      <span class="clothing-cat">${cat.cat}</span>
      <div class="clothing-colors">
        ${cat.colors.map(c => `<span class="clothing-tag">${c}</span>`).join('')}
      </div>
    `;
    list.appendChild(div);
  });
}

function renderHair(s) {
  const list = document.getElementById('hair-list');
  list.innerHTML = '';

  s.hair.forEach(h => {
    const div = document.createElement('div');
    div.className = 'hair-tag';
    div.innerHTML = `<div class="hair-dot" style="background:${h.color}"></div>${h.name}`;
    list.appendChild(div);
  });
}

function renderCelebrities(s) {
  const list = document.getElementById('celeb-list');
  list.innerHTML = '';

  s.celebrities.forEach(name => {
    const span = document.createElement('span');
    span.className = 'celeb-tag';
    span.textContent = name;
    list.appendChild(span);
  });
}

function renderProducts(s) {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';

  s.products.forEach(p => {
    const a = document.createElement('a');
    a.className = 'product-item';
    a.href = p.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = `
      <span class="product-emoji">${p.emoji}</span>
      <span class="product-name">${p.name}</span>
      <span class="product-brand">${p.brand}</span>
      <span class="product-price">${p.price}</span>
    `;
    grid.appendChild(a);
  });
}

// ===== AI CAMERA & PHOTO ANALYSIS =====

async function startAI() {
  scores = { temp: 0, depth: 0, clarity: 0 };
  currentSeason = null;
  capturedImageData = null;

  // Reset UI
  document.getElementById('photo-preview').style.display = 'none';
  document.getElementById('scan-overlay').style.display = 'none';
  document.getElementById('ai-actions').style.display = 'none';
  document.getElementById('detected-colors').style.display = 'none';
  document.getElementById('ai-controls').style.display = 'flex';
  document.getElementById('ai-tips').style.display = 'block';
  document.getElementById('ai-nocamera').style.display = 'none';
  document.querySelector('.face-guide').style.display = 'flex';

  showScreen('ai-screen');
  await startCamera();
}

async function startCamera() {
  const video = document.getElementById('camera-video');
  try {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
    }
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: facingMode,
        width: { ideal: 640 },
        height: { ideal: 854 }
      },
      audio: false
    });
    video.srcObject = cameraStream;
    video.style.display = 'block';

    // Show switch camera button on mobile (multiple cameras)
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(d => d.kind === 'videoinput');
    if (videoInputs.length > 1) {
      document.getElementById('switch-camera-btn').style.display = 'inline-flex';
    }
  } catch (err) {
    // Camera not available — show upload fallback
    video.style.display = 'none';
    document.getElementById('ai-controls').style.display = 'none';
    document.querySelector('.face-guide').style.display = 'none';
    document.getElementById('ai-nocamera').style.display = 'block';
  }
}

async function switchCamera() {
  facingMode = facingMode === 'user' ? 'environment' : 'user';
  await startCamera();
}

function exitAI() {
  stopCamera();
  showScreen('intro-screen');
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
  }
  document.getElementById('camera-video').srcObject = null;
}

function capturePhoto() {
  const video = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');
  const preview = document.getElementById('photo-preview');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');

  // Mirror for front camera
  if (facingMode === 'user') {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0);
  if (facingMode === 'user') {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  capturedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  preview.src = canvas.toDataURL('image/jpeg', 0.9);
  preview.style.display = 'block';
  video.style.display = 'none';
  document.querySelector('.face-guide').style.display = 'none';
  document.getElementById('ai-controls').style.display = 'none';
  document.getElementById('ai-tips').style.display = 'none';
  document.getElementById('ai-actions').style.display = 'flex';

  stopCamera();
}

function handleUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.getElementById('camera-canvas');
      // Fit into reasonable size
      const maxDim = 800;
      let w = img.width, h = img.height;
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      capturedImageData = ctx.getImageData(0, 0, w, h);

      const preview = document.getElementById('photo-preview');
      preview.src = canvas.toDataURL('image/jpeg', 0.9);
      preview.style.display = 'block';
      document.getElementById('camera-video').style.display = 'none';
      document.querySelector('.face-guide').style.display = 'none';
      document.getElementById('ai-controls').style.display = 'none';
      document.getElementById('ai-tips').style.display = 'none';
      document.getElementById('ai-nocamera').style.display = 'none';
      document.getElementById('ai-actions').style.display = 'flex';
      stopCamera();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function retakePhoto() {
  capturedImageData = null;
  document.getElementById('photo-preview').style.display = 'none';
  document.getElementById('ai-actions').style.display = 'none';
  document.getElementById('detected-colors').style.display = 'none';
  document.getElementById('scan-overlay').style.display = 'none';
  document.getElementById('ai-controls').style.display = 'flex';
  document.getElementById('ai-tips').style.display = 'block';
  document.querySelector('.face-guide').style.display = 'flex';
  startCamera();
}

function analyzePhoto() {
  if (!capturedImageData) return;

  // Show scanning animation
  document.getElementById('scan-overlay').style.display = 'block';
  document.getElementById('ai-actions').style.display = 'none';

  // Extract colors after brief scan animation
  setTimeout(() => {
    const colors = extractFaceColors(capturedImageData);

    // Show detected colors
    document.getElementById('detected-skin').style.background = rgbStr(colors.skin);
    document.getElementById('detected-hair').style.background = rgbStr(colors.hair);
    document.getElementById('detected-eye').style.background = rgbStr(colors.eye);
    document.getElementById('detected-colors').style.display = 'block';
    document.getElementById('scan-overlay').style.display = 'none';

    // Analyze and compute scores
    scores = analyzeColorsToScores(colors);

    // Small delay to show detected colors before result
    setTimeout(() => {
      determineSeason();
      renderResult();
      showScreen('result-screen');
    }, 1500);
  }, 2500);
}

// ===== COLOR EXTRACTION ENGINE =====

function extractFaceColors(imageData) {
  const w = imageData.width;
  const h = imageData.height;

  // Face region estimation (assuming face is centered in oval guide)
  // Face area: center 55% width, 60% height of image
  const faceCX = Math.round(w / 2);
  const faceCY = Math.round(h * 0.42); // face is slightly above center
  const faceW = Math.round(w * 0.55);
  const faceH = Math.round(h * 0.55);

  // Sampling regions relative to face center
  // Skin: left cheek + right cheek (avoid nose/mouth center)
  const skinLeft = sampleRegion(imageData,
    faceCX - Math.round(faceW * 0.28), faceCY + Math.round(faceH * 0.05),
    Math.round(faceW * 0.12), Math.round(faceH * 0.12));
  const skinRight = sampleRegion(imageData,
    faceCX + Math.round(faceW * 0.16), faceCY + Math.round(faceH * 0.05),
    Math.round(faceW * 0.12), Math.round(faceH * 0.12));
  const skin = avgColors(skinLeft, skinRight);

  // Hair: above forehead
  const hair = sampleRegion(imageData,
    faceCX - Math.round(faceW * 0.15), faceCY - Math.round(faceH * 0.42),
    Math.round(faceW * 0.3), Math.round(faceH * 0.1));

  // Eye: between eyebrow and nose, left+right of center
  const eyeLeft = sampleRegion(imageData,
    faceCX - Math.round(faceW * 0.18), faceCY - Math.round(faceH * 0.08),
    Math.round(faceW * 0.1), Math.round(faceH * 0.06));
  const eyeRight = sampleRegion(imageData,
    faceCX + Math.round(faceW * 0.08), faceCY - Math.round(faceH * 0.08),
    Math.round(faceW * 0.1), Math.round(faceH * 0.06));
  const eye = avgColors(eyeLeft, eyeRight);

  return { skin, hair, eye };
}

function sampleRegion(imageData, cx, cy, rw, rh) {
  const w = imageData.width;
  const h = imageData.height;
  const data = imageData.data;

  let totalR = 0, totalG = 0, totalB = 0, count = 0;
  const x0 = Math.max(0, cx - Math.floor(rw / 2));
  const y0 = Math.max(0, cy - Math.floor(rh / 2));
  const x1 = Math.min(w, cx + Math.ceil(rw / 2));
  const y1 = Math.min(h, cy + Math.ceil(rh / 2));

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // Skip very dark shadows and blown-out highlights
      const brightness = (r + g + b) / 3;
      if (brightness > 25 && brightness < 245) {
        totalR += r;
        totalG += g;
        totalB += b;
        count++;
      }
    }
  }

  if (count === 0) return { r: 128, g: 128, b: 128 };
  return {
    r: Math.round(totalR / count),
    g: Math.round(totalG / count),
    b: Math.round(totalB / count)
  };
}

function avgColors(c1, c2) {
  return {
    r: Math.round((c1.r + c2.r) / 2),
    g: Math.round((c1.g + c2.g) / 2),
    b: Math.round((c1.b + c2.b) / 2)
  };
}

function rgbStr(c) {
  return `rgb(${c.r},${c.g},${c.b})`;
}

function rgbToHsl(c) {
  const r = c.r / 255, g = c.g / 255, b = c.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
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

// ===== COLOR ANALYSIS → 3-AXIS SCORES =====

function analyzeColorsToScores(colors) {
  const skinHSL = rgbToHsl(colors.skin);
  const hairHSL = rgbToHsl(colors.hair);
  const eyeHSL = rgbToHsl(colors.eye);

  let temp = 0, depth = 0, clarity = 0;

  // === TEMP (Cool ↔ Warm) ===
  // 1. Skin undertone: warm = yellow/orange hues, cool = pink/blue hues
  const skinHue = skinHSL.h;
  if (skinHue >= 18 && skinHue <= 55) temp += 3;
  else if (skinHue >= 10 && skinHue < 18) temp += 1;
  else if (skinHue >= 300 || skinHue < 10) temp -= 2;

  // 2. Red-Blue ratio (higher = warmer)
  const rbRatio = colors.skin.r / Math.max(colors.skin.b, 1);
  if (rbRatio > 1.5) temp += 2;
  else if (rbRatio > 1.25) temp += 1;
  else if (rbRatio < 1.05) temp -= 2;
  else if (rbRatio < 1.15) temp -= 1;

  // 3. Green channel relative to blue (warm skins have more green)
  const gbRatio = colors.skin.g / Math.max(colors.skin.b, 1);
  if (gbRatio > 1.15) temp += 1;
  else if (gbRatio < 0.95) temp -= 1;

  // 4. Hair warmth
  const hairHue = hairHSL.h;
  if (hairHue >= 15 && hairHue <= 45) temp += 1;
  else if (hairHue >= 200 || hairHue < 10) temp -= 1;

  // === DEPTH (Dark ↔ Light) ===
  // Weighted average of all features (not just skin) to capture overall impression
  // Calibrated for Asian faces where hair is almost always very dark
  const overallL = skinHSL.l * 0.45 + hairHSL.l * 0.35 + eyeHSL.l * 0.20;
  if (overallL > 0.55) depth += 5;
  else if (overallL > 0.48) depth += 3;
  else if (overallL > 0.42) depth += 1;
  else if (overallL > 0.35) depth -= 1;
  else if (overallL > 0.28) depth -= 3;
  else depth -= 5;

  // === CLARITY (Soft ↔ Clear) ===
  // Primary: skin-hair lightness contrast
  // High contrast (pale skin + dark hair) → clear (winter/spring signal)
  // Reduced weight to avoid over-classifying dark-haired Asians as clear
  const contrast = Math.abs(skinHSL.l - hairHSL.l);
  if (contrast > 0.55) clarity += 2;
  else if (contrast > 0.4) clarity += 1;
  else if (contrast < 0.15) clarity -= 1;

  // Secondary: skin saturation (vivid = clear, muted = soft)
  if (skinHSL.s > 0.45) clarity += 1;
  else if (skinHSL.s < 0.18) clarity -= 1;

  // Tertiary: eye-skin contrast
  const eyeContrast = Math.abs(eyeHSL.l - skinHSL.l);
  if (eyeContrast > 0.4) clarity += 1;
  else if (eyeContrast < 0.08) clarity -= 1;

  // When hair AND eyes are both very dark (common in Vietnamese/Asian faces),
  // high skin-hair contrast is the baseline, not a vivid/clear indicator
  if (hairHSL.l < 0.15 && eyeHSL.l < 0.25 && contrast > 0.4) {
    clarity -= 1;
  }

  // Overall mutedness: low average saturation → strong soft signal
  // This is key for distinguishing Summer (muted) from Winter (bold) on Asian faces
  const avgSat = (skinHSL.s + hairHSL.s + eyeHSL.s) / 3;
  if (avgSat < 0.13) clarity -= 2;
  else if (avgSat < 0.20) clarity -= 1;

  // Clamp to reasonable range
  temp = Math.max(-12, Math.min(12, temp));
  depth = Math.max(-12, Math.min(12, depth));
  clarity = Math.max(-12, Math.min(12, clarity));

  return { temp, depth, clarity };
}

// ===== URL SHARING =====
function getResultUrl() {
  if (!currentSeason) return window.location.origin + '/';
  return window.location.origin + window.location.pathname +
    `#result=${currentSeason.key}&temp=${scores.temp}&depth=${scores.depth}&clarity=${scores.clarity}`;
}

function updateUrlHash() {
  if (!currentSeason) return;
  window.location.hash = `result=${currentSeason.key}&temp=${scores.temp}&depth=${scores.depth}&clarity=${scores.clarity}`;
}

function shareFacebook() {
  const url = encodeURIComponent(getResultUrl());
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

function copyLink() {
  const btn = document.querySelector('.copy-btn');
  navigator.clipboard.writeText(getResultUrl()).then(() => {
    btn.textContent = '✅ Đã sao chép!';
    setTimeout(() => { btn.textContent = '🔗 Sao chép link'; }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = getResultUrl();
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✅ Đã sao chép!';
    setTimeout(() => { btn.textContent = '🔗 Sao chép link'; }, 2000);
  });
}

function retakeQuiz() {
  window.location.hash = '';
  showScreen('intro-screen');
}

// ===== URL RESTORATION ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;
  if (hash && hash.includes('result=')) {
    const params = new URLSearchParams(hash.slice(1));
    const key = params.get('result');
    scores.temp = parseInt(params.get('temp'), 10) || 0;
    scores.depth = parseInt(params.get('depth'), 10) || 0;
    scores.clarity = parseInt(params.get('clarity'), 10) || 0;

    if (key && SEASONS[key]) {
      // Direct match (12-season key)
      currentSeason = SEASONS[key];
      renderResult();
      showScreen('result-screen');
    } else if (key) {
      // Fallback: old 4-season URL (e.g. "spring") — recalculate from scores
      determineSeason();
      renderResult();
      showScreen('result-screen');
    }
  }
});
