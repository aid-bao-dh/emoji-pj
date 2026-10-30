/**
 * Vietnamese Accent Removal & High-Relevance Search Engine
 */

export function removeVietnameseAccents(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

// Iconic priority mapping for fast copy
const ICONIC_EMOJIS = {
  lua: ["🔥", "💥", "⚡", "🚒"],
  lửa: ["🔥", "💥", "⚡", "🚒"],
  fire: ["🔥", "🚒", "🧯"],
  tich: ["✅", "✔️", "☑️", "🆗"],
  tích: ["✅", "✔️", "☑️", "🆗"],
  check: ["✅", "✔️", "☑️"],
  tim: ["❤️", "💖", "💘", "💓", "💕", "🥰", "😍"],
  heart: ["❤️", "💖", "💘", "💓", "💕"],
  sao: ["⭐", "🌟", "✨", "💫", "🤩", "★"],
  star: ["⭐", "🌟", "✨", "★", "💫", "🤩"],
  tay: ["👉", "👈", "👆", "👇", "👍", "✍️", "👏"],
  "chi tay": ["👉", "👈", "👆", "👇", "☝️"],
  "chỉ tay": ["👉", "👈", "👆", "👇", "☝️"],
  "tro tay": ["👉", "👈", "👆", "👇"],
  "trỏ tay": ["👉", "👈", "👆", "👇"],
  chuong: ["🔔", "🛎️"],
  chuông: ["🔔", "🛎️"],
  bell: ["🔔", "🛎️"],
  tien: ["💰", "💵", "💸", "💲", "🤑", "🪙"],
  dollar: ["💵", "💲", "💰", "💸"],
  money: ["💰", "💵", "💸", "💲"],
  sale: ["🏷️", "🔥", "💰", "💸", "🛍️", "🛒"],
  "giam gia": ["🏷️", "🔥", "💰", "💸", "📉"],
  "giảm giá": ["🏷️", "🔥", "💰", "💸"],
  "dien thoai": ["📞", "☎️", "📱", "📲"],
  "điện thoại": ["📞", "☎️", "📱", "📲"],
  phone: ["📞", "📱", "☎️", "📲"],
  call: ["📞", "☎️", "📱", "🤙"],
  xe: ["🛵", "🚗", "🚚", "🚛", "🏎️"],
  ship: ["🛵", "🚚", "🚗", "📦", "✈️"],
  "giao hang": ["🛵", "🚚", "📦"],
  qua: ["🎁", "🎀", "📦"],
  quà: ["🎁", "🎀", "📦"],
  gift: ["🎁", "🎀"],
  like: ["👍", "👍🏻", "👍🏼", "👍🏽", "👍🏾", "👍🏿"],
  thich: ["👍", "❤️", "🥰"],
  thích: ["👍", "❤️", "🥰"],
  ghim: ["📌", "📍"],
  pin: ["📌", "📍"],
  "muc tieu": ["🎯", "🏹"],
  "mục tiêu": ["🎯", "🏹"],
  "vuong mien": ["👑"],
  "vương miện": ["👑"],
  crown: ["👑"],
  "kim cuong": ["💎"],
  "kim cương": ["💎"],
  diamond: ["💎", "💠", "🔹", "🔸"],
  cup: ["🏆", "🥇", "🥈", "🥉"],
  cúp: ["🏆", "🥇", "🥈", "🥉"],
  trophy: ["🏆", "🥇"],
  loa: ["📢", "📣", "🔊"],
  "canh bao": ["⚠️", "🚨"],
  "cảnh báo": ["⚠️", "🚨"],
  "dong ho": ["⏰", "⏳", "⏱️", "⌛", "🕐"],
  "đồng hồ": ["⏰", "⏳", "⏱️", "⌛"],
  "thoi gian": ["⏰", "⏳", "📅", "🗓️"],
  "thời gian": ["⏰", "⏳", "📅", "🗓️"],
  "gach dau dong": ["🔹", "🔸", "🔘", "⚫", "⚪", "🔻", "🔺", "❖", "✦", "✔️", "✅"],
  bullet: ["🔹", "🔸", "🔘", "⚫", "⚪", "🔻", "🔺", "❖", "✦"],
};

/**
 * Pre-indexes emoji list for sub-millisecond scored search
 */
export function buildSearchIndex(emojiList, popularSet = new Set()) {
  return emojiList.map((item) => {
    const rawName = (item.name || "").toLowerCase();
    const rawSlug = (item.slug || "").toLowerCase();
    const keywords = (item.keywords || []).map((k) => k.toLowerCase());
    const vnKeywords = (item.vnKeywords || []).map((k) => k.toLowerCase());

    const allRaw = [rawName, rawSlug, ...keywords, ...vnKeywords].join(" ");
    const allNormalized = removeVietnameseAccents(allRaw);

    const isPopular = popularSet.has(item.emoji);

    return {
      item,
      rawName,
      rawSlug,
      keywords,
      vnKeywords,
      allRaw,
      allNormalized,
      normalizedName: removeVietnameseAccents(rawName),
      normalizedSlug: removeVietnameseAccents(rawSlug),
      normalizedKeywords: keywords.map((k) => removeVietnameseAccents(k)),
      normalizedVnKeywords: vnKeywords.map((k) => removeVietnameseAccents(k)),
      isPopular,
    };
  });
}

/**
 * Performs ultra-fast, relevance-ranked search
 */
export function searchEmojis(query, indexedList, limit = 200) {
  if (!query || !query.trim()) {
    return [];
  }

  const cleanQuery = query.trim().toLowerCase();
  const normalizedQuery = removeVietnameseAccents(cleanQuery);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  const scoredResults = [];
  const iconicBoostList = ICONIC_EMOJIS[cleanQuery] || ICONIC_EMOJIS[normalizedQuery] || [];

  for (let i = 0; i < indexedList.length; i++) {
    const entry = indexedList[i];
    const { item, rawName, rawSlug, normalizedName, normalizedSlug, normalizedKeywords, normalizedVnKeywords, allNormalized, allRaw, isPopular } = entry;

    // 1. Direct emoji match
    if (item.emoji === cleanQuery) {
      scoredResults.push({ item, score: 999999 });
      continue;
    }

    let score = 0;
    let matchesAllTokens = true;

    // Iconic list boost
    const iconicIdx = iconicBoostList.indexOf(item.emoji);
    if (iconicIdx !== -1) {
      score += 10000 - iconicIdx * 500;
    }

    for (let t = 0; t < queryTokens.length; t++) {
      const token = queryTokens[t];
      let tokenScore = 0;

      // Exact match in VN keywords (top priority for Vietnamese users)
      if (normalizedVnKeywords.includes(token)) {
        tokenScore += 3000;
      }

      // Exact match in English keywords
      if (normalizedKeywords.includes(token)) {
        tokenScore += 2500;
      }

      // Exact slug or name match
      if (normalizedSlug === token || rawSlug === token) {
        tokenScore += 2000;
      } else if (normalizedSlug.startsWith(token)) {
        tokenScore += 800;
      }

      // Exact word in name
      const nameWords = normalizedName.split(/\s+/);
      if (nameWords.includes(token)) {
        tokenScore += 1200;
      } else if (normalizedName.startsWith(token)) {
        tokenScore += 600;
      }

      // Prefix match in keywords
      if (tokenScore === 0) {
        if (normalizedVnKeywords.some((k) => k.startsWith(token))) {
          tokenScore += 400;
        } else if (normalizedKeywords.some((k) => k.startsWith(token))) {
          tokenScore += 300;
        }
      }

      // Substring match fallback
      if (tokenScore === 0) {
        if (allNormalized.includes(token) || allRaw.includes(token)) {
          tokenScore += 50;
        } else {
          matchesAllTokens = false;
          break;
        }
      }

      score += tokenScore;
    }

    if (matchesAllTokens && score > 0) {
      // Bonus if all query tokens appear as full consecutive phrase in tags/name
      if (queryTokens.length > 1) {
        if (normalizedVnKeywords.some((k) => k.includes(normalizedQuery))) {
          score += 1500;
        } else if (allNormalized.includes(normalizedQuery)) {
          score += 500;
        }
      }

      // Boost popular Facebook marketing emojis
      if (isPopular) {
        score += 300;
      }

      // Slight penalty for long multi-person zero-width-joiner combinations when searching simple terms
      if (item.emoji.length > 4) {
        score -= 50;
      }

      scoredResults.push({ item, score });
    }
  }

  // Sort by score descending
  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults.slice(0, limit).map((r) => r.item);
}
