/* ===== 12-SEASON RESULT DATA ===== */

/**
 * @typedef {Object} SeasonData
 * @property {string} key
 * @property {string} baseseason
 * @property {string} emoji
 * @property {string} name
 * @property {string} enName
 * @property {string} subtitle
 * @property {string} description
 * @property {string} gradient
 * @property {string} primary
 * @property {string} light
 * @property {string[]} palette
 * @property {string[]} avoid
 * @property {{foundation: {text: string, colors: string[]}, lip: {text: string, colors: string[]}, blush: {text: string, colors: string[]}, eyeshadow: {text: string, colors: string[]}}} makeup
 * @property {{cat: string, colors: string[]}[]} clothing
 * @property {{name: string, color: string}[]} hair
 * @property {string} jewelry
 * @property {string[]} celebrities
 * @property {{emoji: string, name: string, brand: string, price: string, url: string}[]} products
 */

// Each base season (Spring/Summer/Autumn/Winter) has 3 subtypes based on dominant axis.
export const SEASONS = {
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
