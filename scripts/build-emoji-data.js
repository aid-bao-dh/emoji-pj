import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emojiData = require("unicode-emoji-json/data-by-emoji.json");
const emojiLib = require("emojilib");

// Vietnamese common translations & search tags
const wordDict = {
  // Emotions & Faces
  grinning: "cười toe toét",
  smiling: "mỉm cười",
  smile: "cười vui",
  face: "mặt biểu cảm",
  tears: "nước mắt khóc vui",
  joy: "vui sướng hài hước",
  laughing: "cười lớn haha cười nghiêng ngả",
  sweat: "mồ hôi lo lắng",
  wink: "nháy mắt thả thính",
  blush: "ngượng ngùng e thẹn",
  heart: "trái tim tim thả tim yêu thương love",
  eyes: "mắt nhìn xem",
  kissing: "hôn môi tình cảm",
  tongue: "lè lưỡi tinh nghịch trêu",
  relieved: "nhẹ nhõm thở phào",
  cool: "ngầu chất ngầu phong cách đỉnh",
  sunglasses: "kính râm ngầu chất",
  smirk: "cười khẩy đắc ý",
  unamused: "chán nản không vui",
  pensive: "trầm ngâm suy tư",
  confused: "bối rối khó hiểu",
  crying: "khóc lóc đau lòng xúc động",
  sad: "buồn rầu sầu tủi",
  angry: "tức giận giận dữ phẫn nộ cáu",
  rage: "thịnh nộ điên tiết bốc hỏa",
  screaming: "hét lên la hét kinh ngạc",
  fear: "sợ hãi hoảng sợ",
  sleepy: "buồn ngủ ngáp ngủ",
  drooling: "chảy dãi thèm thuồng",
  thinking: "suy nghĩ suy ngẫm tính toán",
  shushing: "suỵt im lặng giữ bí mật",
  party: "tiệc tùng quẩy sinh nhật ăn mừng liên hoan",
  partying: "ăn mừng quẩy tiệc chúc mừng",
  pleading: "năn nỉ cầu xin xin van",
  hugging: "ôm ấm áp yêu thương",

  // Gestures & Body
  hand: "bàn tay ngón tay cử chỉ tay",
  thumbs: "ngón cái like thích",
  up: "lên trên tăng trưởng",
  down: "xuống dưới giảm",
  left: "bên trái sang trái",
  right: "bên phải sang phải",
  pointing: "chỉ trỏ chỉ tay trỏ tay xem ngay",
  clap: "vỗ tay hoan hô tán thưởng vỗ",
  clapping: "vỗ tay biểu dương",
  wave: "vẫy tay chào chào hỏi tạm biệt",
  waving: "vẫy chào",
  raised: "giơ lên giơ tay",
  pray: "cầu nguyện chắp tay cảm ơn biết ơn xin lỗi vái",
  praying: "chắp tay lạy",
  folded: "chắp tay",
  handshake: "bắt tay hợp tác đối tác chốt đơn thỏa thuận",
  punch: "nắm đấm đấm",
  fist: "nắm tay quyết tâm đoàn kết chiến thắng",
  victory: "chiến thắng v số 1 thành công",
  peace: "hòa bình",
  flexed: "gồng bắp tay khỏe mạnh lực lưỡng",
  biceps: "cơ bắp sức mạnh cố lên",
  writing: "viết ghi chép soạn bài bút",

  // Marketing & Post essentials
  fire: "lửa cháy hot bùng nổ sốt giật gân bốc lửa ưu đãi xả kho",
  flame: "ngọn lửa rực cháy thiêu đốt",
  sparkles: "lấp lánh sáng sao lung linh mới tinh vip sang xịn",
  sparkle: "lấp lánh tỏa sáng",
  star: "ngôi sao đánh giá 5 sao sao sáng vip xịn uy tín chất lượng",
  glowing: "phát sáng nổi bật lung linh",
  check: "tích xanh dấu kiểm hoàn thành đúng chuẩn ok duyệt cam kết chính hãng",
  mark: "đánh dấu tích",
  cross: "dấu gạch chéo sai hủy bỏ cấm không được",
  bell: "chuông thông báo nhắc nhở reng reo",
  megaphone: "loa thông báo rao tin tức loan báo phát thanh",
  loudspeaker: "loa phát thanh quảng cáo truyền thông",
  pin: "ghim chú ý đính kèm quan trọng lưu ý xem",
  pushpin: "ghim bấm lưu ý tiêu điểm ghim bài",
  round: "tròn chấm tròn",
  bullet: "gạch đầu dòng điểm mục chấm gạch",
  circle: "chấm tròn vòng tròn nút tròn",
  square: "ô vuông khối vuông",
  diamond: "hình thoi kim cương quý",
  target: "mục tiêu đích ngắm bắn trúng tâm điểm chuẩn xác",
  rocket: "tên lửa cất cánh phóng tăng tốc đột phá bay cao tiến bước",
  zap: "sét tia chớp nhanh thần tốc siêu tốc nhanh chóng",
  lightning: "tia sét sấm chớp điện lực chớp nhoáng",
  collision: "bùng nổ va chạm nổ tung chấn động siêu phẩm",
  bomb: "bom nổ sập giá rẻ sập sàn",
  trophy: "cúp vô địch giải nhất top 1 dẫn đầu vinh danh",
  crown: "vương miện đỉnh cao hoàng gia đẳng cấp vip vua chúa sang trọng",
  gem: "đá quý kim cương sang trọng cao cấp quý phái luxury",
  money: "tiền tài lộc phát tài giàu có lộc lá tiền tệ",
  bag: "túi xách túi tiền giỏ",
  dollar: "tiền đô la usd giá bán giá tiền chi phí",
  banknote: "tiền giấy polyme tiền mặt thanh toán",
  gift: "quà tặng hộp quà tri ân khuyến mãi quà tặng tặng kèm",
  ribbon: "ruy băng nơ trang trí quà",
  shopping: "mua sắm giỏ hàng đơn hàng mua bán chốt đơn mua ngay",
  cart: "giỏ hàng xe đẩy mua hàng shopping mua sắm",
  telephone: "điện thoại bàn liên hệ hotline cskh tổng đài",
  phone: "điện thoại gọi điện alo liên lạc số điện thoại sđt",
  mobile: "điện thoại di động smartphone cầm tay",
  email: "thư điện tử hòm thư liên hệ mail gmail gửi thư",
  envelope: "phong bì thư tín tin nhắn",
  link: "đường dẫn liên kết web link xem thêm click",
  warning: "cảnh báo lưu ý chú ý nguy hiểm khẩn cấp quan trọng",
  alarm: "báo thức hẹn giờ canh giờ gấp",
  clock: "đồng hồ thời gian giờ phút hạn chót deadline đúng giờ",
  hourglass: "đồng hồ cát đếm ngược thời gian sắp hết gấp nhanh tay",
  calendar: "lịch ngày tháng hẹn lịch sự kiện thời gian diễn ra",
  package: "gói hàng kiện hàng chuyển phát đơn hàng đóng gói",
  truck: "xe tải giao hàng vận chuyển giao nhanh giao hàng tiết kiệm",
  motorcycle: "xe máy giao hàng ship cod giao nhanh hỏa tốc ship hàng",
  car: "ô tô xe hơi xe",
  airplane: "máy bay du lịch công tác bay nhanh",

  // Foods, drinks & misc
  coffee: "cà phê cafe sáng tỉnh táo coffee",
  tea: "trà trà sữa đồ uống",
  cake: "bánh ngọt bánh kem sinh nhật tiệc",
  beer: "bia nhậu cụng ly chúc mừng zô",
  wine: "rượu vang tiệc sang chảnh sang trọng",
  food: "đồ ăn món ngon ẩm thực ăn uống",
  burger: "bánh mì burger thức ăn nhanh hamburger",
  pizza: "pizza thơm ngon",
  sun: "mặt trời nắng ấm ban ngày rực rỡ buổi sáng",
  moon: "mặt trăng đêm tối lãng mạn buổi tối",
  flower: "bông hoa sắc đẹp tươi tắn phái đẹp quà tặng",
  rose: "hoa hồng tình yêu quyến rũ hoa xinh",
};

// Curated Facebook Special Categories for post writing
const facebookSpecialCategories = {
  fb_hot: {
    id: "fb_hot",
    name: "🔥 Hot & Bán Hàng",
    description: "Các emoji thu hút chú ý, giật tít, tạo độ hot, sale, ưu đãi cho bài viết Facebook",
    emojis: ["🔥", "💥", "⚡", "✨", "🌟", "⭐", "🚀", "🎯", "👑", "💎", "🏆", "🥇", "🎁", "🎉", "🎊", "🔔", "📢", "📣", "🚨", "⚠️", "💰", "💵", "💸", "💲", "🏷️", "🛍️", "🛒", "📦", "💯", "🆕", "🆓", "🆙", "🆗", "⏰", "⏳", "⏱️", "📅", "🗓️", "💌", "📮"],
  },
  fb_bullets: {
    id: "fb_bullets",
    name: "🎯 Gạch Đầu Dòng & Bullets",
    description: "Ký hiệu phân mục, gạch đầu dòng giúp bài viết ngăn nắp, thoáng mắt, dễ đọc",
    emojis: [
      "🔹",
      "🔸",
      "🔘",
      "⚫",
      "⚪",
      "🔻",
      "🔺",
      "▫️",
      "▪️",
      "◽",
      "◻️",
      "💠",
      "✦",
      "✧",
      "❖",
      "✔️",
      "✅",
      "☑️",
      "❌",
      "✖️",
      "➕",
      "➖",
      "➡️",
      "⬅️",
      "⬆️",
      "⬇️",
      "▶️",
      "⏩",
      "📌",
      "📍",
      "🚩",
      "🎯",
      "💫",
      "⚜️",
      "❇️",
      "✳️",
      "🟢",
      "🟡",
      "🔴",
      "🔵",
      "🟤",
      "🟣",
      "🟠",
      "🟩",
      "🟨",
      "🟥",
      "🟦",
      "🟫",
      "🟪",
      "🟧",
    ],
  },
  fb_symbols: {
    id: "fb_symbols",
    name: "✦ Ký Tự Đặc Biệt Facebook",
    description: "Ngôi sao, hoa văn, mũi tên trang trí, ký tự phân cách bài viết đặc sắc",
    emojis: [
      "★",
      "☆",
      "✪",
      "✫",
      "✬",
      "✭",
      "✮",
      "✯",
      "✰",
      "✦",
      "✧",
      "✩",
      "❖",
      "◈",
      "◊",
      "◆",
      "◇",
      "■",
      "□",
      "▲",
      "△",
      "▼",
      "▽",
      "●",
      "○",
      "◉",
      "⦿",
      "►",
      "◄",
      "✓",
      "✔",
      "✕",
      "✖",
      "✗",
      "✘",
      "➔",
      "➜",
      "➝",
      "➞",
      "➟",
      "➠",
      "➡",
      "➢",
      "➣",
      "➤",
      "➥",
      "➦",
      "➧",
      "➨",
      "➩",
      "➪",
      "➫",
      "➬",
      "➭",
      "➮",
      "➯",
      "➱",
      "➲",
      "➳",
      "✿",
      "❀",
      "❁",
      "❂",
      "❃",
      "❄",
      "❅",
      "❆",
      "❇",
      "❈",
      "❉",
      "❊",
      "❦",
      "❧",
      "❣",
      "❤",
      "❥",
      "✍",
      "✎",
      "✏",
      "✐",
      "✑",
      "✒",
      "☎",
    ],
  },
  fb_cta: {
    id: "fb_cta",
    name: "👉 Mũi Tên & Kêu Gọi (CTA)",
    description: "Điều hướng mắt người đọc, click link, inbox, xem chi tiết, kêu gọi hành động",
    emojis: ["👉", "👈", "👆", "👇", "➡️", "⬅️", "⬆️", "⬇️", "↗️", "↘️", "⏩", "▶️", "⤵️", "⤴️", "🔀", "🔁", "🔗", "🌐", "📥", "📤", "🛒", "🛍️", "📦", "🎁", "💬", "📩", "✉️", "🚀", "🎯", "⚡", "☝️", "✍️", "👇🏻", "👉🏻", "👈🏻", "👆🏻"],
  },
  fb_trust: {
    id: "fb_trust",
    name: "✅ Cam Kết & Uy Tín",
    description: "Khẳng định chất lượng, bảo hành, cam kết chính hãng, chứng nhận uy tín",
    emojis: ["✅", "✔️", "☑️", "💯", "🏆", "🥇", "🥈", "🥉", "🎖️", "🏅", "👑", "⭐", "🌟", "✨", "💎", "🛡️", "🔒", "🔑", "🏷️", "🆗", "🤝", "👏", "👍", "💪", "🎯", "🔝", "🆙", "📜", "⚖️", "📌"],
  },
  fb_contact: {
    id: "fb_contact",
    name: "📞 Liên Hệ & Địa Chỉ",
    description: "Số điện thoại, hotline, địa chỉ cửa hàng, website, bản đồ, ship hàng",
    emojis: ["☎️", "📞", "📱", "📲", "💬", "🗨️", "📩", "✉️", "📧", "📮", "🌐", "🏠", "🏡", "🏢", "🏬", "📍", "📌", "🗺️", "🧭", "🚗", "🛵", "🚚", "🚛", "✈️", "📦", "📫", "📬", "💻", "🖥️", "⏰"],
  },
  fb_reactions: {
    id: "fb_reactions",
    name: "❤️ Reaction & Cảm Xúc FB",
    description: "Các cảm xúc Facebook Like, Tim, Haha, Wow, Buồn, Phẫn nộ, chúc mừng",
    emojis: ["👍", "❤️", "😆", "😂", "🤣", "😮", "😲", "😢", "😭", "😡", "🥰", "😍", "🤩", "🥳", "😎", "🤗", "🤔", "🤫", "🥺", "🤤", "🙏", "👏", "🤝", "🙌", "💖", "💗", "💓", "💞", "💕", "💘"],
  },
};

// Category label translations
const groupNameMap = {
  "Smileys & Emotion": "😃 Mặt cười & Cảm xúc",
  "People & Body": "👋 Người & Cử chỉ",
  "Animals & Nature": "🐶 Động vật & Thiên nhiên",
  "Food & Drink": "🍔 Đồ ăn & Thức uống",
  "Travel & Places": "✈️ Du lịch & Địa điểm",
  Activities: "⚽ Hoạt động & Thể thao",
  Objects: "💡 Đồ vật & Thiết bị",
  Symbols: "🔣 Biểu tượng & Ký hiệu",
  Flags: "🏳️ Cờ các quốc gia",
};

// Process all emojis
const processedEmojis = [];
const emojiIndexMap = new Map();

for (const [char, info] of Object.entries(emojiData)) {
  const libKeywords = emojiLib[char] || [];
  const name = info.name || "";
  const slug = info.slug || "";
  const group = info.group || "Symbols";

  // Gather keywords from wordDict
  const vnTags = new Set();
  const searchCorpus = `${name} ${slug} ${libKeywords.join(" ")}`.toLowerCase();

  for (const [k, v] of Object.entries(wordDict)) {
    if (searchCorpus.includes(k)) {
      v.split(/\s+/).forEach((word) => {
        if (word.length > 1) vnTags.add(word);
      });
    }
  }

  // Specific high-priority tag mappings for iconic emojis
  if (char === "🔥") ["lua", "chay", "hot", "lua hot", "boc lua", "giam gia", "khuyen mai"].forEach((w) => vnTags.add(w));
  if (char === "✅" || char === "✔️" || char === "☑️") ["tich", "tich xanh", "check", "dung", "cam ket", "chinh hang", "hoan thanh"].forEach((w) => vnTags.add(w));
  if (char === "⭐" || char === "🌟" || char === "✨") ["sao", "ngoi sao", "star", "danh gia", "5 sao", "sao sang", "vip"].forEach((w) => vnTags.add(w));
  if (char === "👉" || char === "👈" || char === "👆" || char === "👇") ["tay", "chi tay", "tro tay", "ban tay", "ngon tay", "huong", "sang phai", "sang trai", "tro"].forEach((w) => vnTags.add(w));
  if (char === "❤️" || char === "💖" || char === "💘") ["tim", "trai tim", "love", "yeu", "tha tim", "thich"].forEach((w) => vnTags.add(w));
  if (char === "🔔" || char === "🛎️") ["chuong", "thong bao", "nhac nho", "reng"].forEach((w) => vnTags.add(w));
  if (char === "💰" || char === "💵" || char === "💸" || char === "💲") ["tien", "do", "dollar", "gia", "gia re", "sale", "giam gia", "chi phi", "voucher"].forEach((w) => vnTags.add(w));
  if (char === "📞" || char === "☎️" || char === "📱") ["dien thoai", "sdt", "hotline", "goi", "lien he", "call", "alo"].forEach((w) => vnTags.add(w));
  if (char === "🛵" || char === "🚚" || char === "🚗") ["xe", "ship", "giao hang", "xe may", "van chuyen", "freeship"].forEach((w) => vnTags.add(w));
  if (char === "🎁" || char === "🎀") ["qua", "hop qua", "tang", "khuyen mai", "tri an", "qua tang"].forEach((w) => vnTags.add(w));
  if (char === "📍" || char === "📌") ["dia chi", "shop", "cua hang", "ghim", "vi tri", "map"].forEach((w) => vnTags.add(w));

  const allKeywords = Array.from(new Set([...libKeywords, ...slug.split("_"), ...name.toLowerCase().split(/\s+/), ...Array.from(vnTags)])).filter((w) => w.length > 1);

  const emojiItem = {
    emoji: char,
    name: name,
    slug: slug,
    group: group,
    groupVi: groupNameMap[group] || group,
    keywords: allKeywords,
    vnKeywords: Array.from(vnTags),
    skinTone: !!info.skin_tone_support,
  };

  processedEmojis.push(emojiItem);
  emojiIndexMap.set(char, emojiItem);
}

// Add special Facebook text symbols as first-class searchable items
const specialSymbolsList = facebookSpecialCategories.fb_symbols.emojis;
specialSymbolsList.forEach((sym) => {
  if (!emojiIndexMap.has(sym)) {
    const item = {
      emoji: sym,
      name: "Facebook Special Symbol " + sym,
      slug: "symbol_" + sym,
      group: "Symbols",
      groupVi: "🔣 Biểu tượng & Ký hiệu",
      keywords: ["symbol", "bullet", "star", "arrow", "ky tu", "gach dau dong", "hoa van", "dau sao", "mui ten"],
      vnKeywords: ["ky tu", "dau sao", "mui ten", "gach dau dong", "hoa van"],
      skinTone: false,
    };
    processedEmojis.push(item);
    emojiIndexMap.set(sym, item);
  }
});

// Output
const outputFilePath = path.join(__dirname, "../src/data/emojis.js");

const jsContent = `/**
 * Generated Facebook & Unicode Emoji Dataset
 * Total emojis: ${processedEmojis.length}
 */

export const facebookSpecialCategories = ${JSON.stringify(facebookSpecialCategories, null, 2)};

export const groupNameMap = ${JSON.stringify(groupNameMap, null, 2)};

export const allEmojis = ${JSON.stringify(processedEmojis, null, 2)};

export default allEmojis;
`;

fs.writeFileSync(outputFilePath, jsContent, "utf-8");
console.log(`Successfully generated emoji data: ${processedEmojis.length} emojis to ${outputFilePath}`);
