/**
 * FB Emoji Pro - Full Facebook Emoji Collection Logic
 */

import { allEmojis, facebookSpecialCategories, groupNameMap } from "./data/emojis.js";
import { buildSearchIndex, searchEmojis, removeVietnameseAccents } from "./utils/search.js";
import { copyToClipboard, showToast, isSoundEnabled, toggleSound } from "./utils/clipboard.js";

// Local Storage Keys
const STORAGE_KEYS = {
  FAVORITES: "fb_emoji_favorites_v2",
  RECENTS: "fb_emoji_recents_v2",
  THEME: "fb_emoji_theme_v2",
  SOUND: "fb_emoji_sound_v2",
  TRAY_OPEN: "fb_emoji_tray_open_v2",
  TRAY_ITEMS: "fb_emoji_tray_items_v2",
};

// Skin tone options
const SKIN_TONES = [
  { label: "Mặc định", value: "", symbol: "🟡" },
  { label: "Sáng", value: "\u{1F3FB}", symbol: "🏻" },
  { label: "Sáng vừa", value: "\u{1F3FC}", symbol: "🏼" },
  { label: "Trung bình", value: "\u{1F3FD}", symbol: "🏽" },
  { label: "Ngăm đen", value: "\u{1F3FE}", symbol: "🏾" },
  { label: "Tối màu", value: "\u{1F3FF}", symbol: "🏿" },
];

// App State
const state = {
  activeCategory: "fb_hot",
  searchQuery: "",
  skinTone: "",
  favorites: JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || "[]"),
  recents: JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENTS) || "[]"),
  trayItems: JSON.parse(localStorage.getItem(STORAGE_KEYS.TRAY_ITEMS) || "[]"),
  isTrayOpen: localStorage.getItem(STORAGE_KEYS.TRAY_OPEN) === "true",
  theme: localStorage.getItem(STORAGE_KEYS.THEME) || "light",
  sound: localStorage.getItem(STORAGE_KEYS.SOUND) !== "false",
};

// Map lookup by emoji char
const emojiByChar = new Map();
allEmojis.forEach((e) => emojiByChar.set(e.emoji, e));

// Build Search Index with Popular Boost
const popularSet = new Set();
Object.values(facebookSpecialCategories).forEach((cat) => {
  cat.emojis.forEach((e) => popularSet.add(e));
});
const searchIndex = buildSearchIndex(allEmojis, popularSet);

// DOM Elements
let el = {};

function initDOM() {
  el = {
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    soundToggleBtn: document.getElementById("soundToggleBtn"),
    searchInput: document.getElementById("searchInput"),
    searchClearBtn: document.getElementById("searchClearBtn"),
    searchStatusText: document.getElementById("searchStatusText"),
    searchCount: document.getElementById("searchCount"),
    clearSearchLink: document.getElementById("clearSearchLink"),
    skinToneOptions: document.getElementById("skinToneOptions"),
    categoryNav: document.getElementById("categoryNav"),
    emojiSectionsContainer: document.getElementById("emojiSectionsContainer"),

    // Tray
    toggleTrayBtn: document.getElementById("toggleTrayBtn"),
    trayCountBadge: document.getElementById("trayCountBadge"),
    emojiTray: document.getElementById("emojiTray"),
    closeTrayBtn: document.getElementById("closeTrayBtn"),
    trayEmojis: document.getElementById("trayEmojis"),
    copyTrayBtn: document.getElementById("copyTrayBtn"),
    clearTrayBtn: document.getElementById("clearTrayBtn"),
  };
}

/**
 * Apply Skin tone to emoji correctly according to Unicode standard (UTS #51)
 */
function applySkinTone(emojiChar, skinTone) {
  if (!skinTone) return emojiChar;
  const item = emojiByChar.get(emojiChar);
  if (!item || !item.skinTone) return emojiChar;

  // Clean any previous skin tone modifier
  const clean = emojiChar.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '');

  // For ZWJ (Zero Width Joiner) sequences like 👨‍🍳, 👩‍🏫, 🧜‍♀️, 🏃‍♀️, 🧑‍🤝‍🧑:
  // The skin tone modifier must be placed after the person base and BEFORE the ZWJ (\u200D)
  if (clean.includes('\u200D')) {
    const parts = clean.split('\u200D');
    const newParts = parts.map((part, idx) => {
      // Apply tone to the first character or to subsequent human base characters
      if (idx === 0 || part === '🧑' || part === '👨' || part === '👩') {
        return part.replace(/\uFE0F/g, '') + skinTone;
      }
      return part;
    });
    return newParts.join('\u200D');
  }

  // For simple emojis, remove \uFE0F (Variation Selector 16) if present, then append modifier
  return clean.replace(/\uFE0F/g, '') + skinTone;
}

/**
 * LocalStorage Helpers
 */
function saveFavorites() {
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites));
}

function saveRecents() {
  localStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(state.recents.slice(0, 60)));
}

function saveTray() {
  localStorage.setItem(STORAGE_KEYS.TRAY_ITEMS, JSON.stringify(state.trayItems));
}

function addRecent(char) {
  const baseChar = char.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "");
  state.recents = [char, ...state.recents.filter((c) => c !== char && c !== baseChar)].slice(0, 60);
  saveRecents();
  if (state.activeCategory === "recents") {
    renderMainView();
  }
}

function toggleFavorite(char) {
  const baseChar = char.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "");
  const index = state.favorites.indexOf(baseChar);
  if (index > -1) {
    state.favorites.splice(index, 1);
    showToast(`Đã xoá ${baseChar} khỏi Yêu thích`, "⭐");
  } else {
    state.favorites.unshift(baseChar);
    showToast(`Đã thêm ${baseChar} vào Yêu thích`, "⭐");
  }
  saveFavorites();
  renderCategoryNav();
  renderMainView();
}

/**
 * Handle Emoji Click:
 * 1. Instant copy to clipboard!
 * 2. If Tray is open, append to tray as well.
 */
async function handleEmojiClick(char) {
  const displayChar = applySkinTone(char, state.skinTone);
  addRecent(displayChar);

  // Instant copy
  const success = await copyToClipboard(displayChar);
  if (success) {
    showToast(`Đã copy ${displayChar}`, displayChar);
  }

  // If tray is open, also add to tray
  if (state.isTrayOpen) {
    addToTray(displayChar);
  }
}

/**
 * Emoji Tray management
 */
function setTrayOpen(isOpen) {
  state.isTrayOpen = isOpen;
  localStorage.setItem(STORAGE_KEYS.TRAY_OPEN, isOpen);
  if (isOpen) {
    el.emojiTray.classList.remove("collapsed");
    el.toggleTrayBtn.classList.add("active");
  } else {
    el.emojiTray.classList.add("collapsed");
    el.toggleTrayBtn.classList.remove("active");
  }
}

function addToTray(char) {
  state.trayItems.push(char);
  saveTray();
  renderTray();
}

function removeFromTray(index) {
  state.trayItems.splice(index, 1);
  saveTray();
  renderTray();
}

function clearTray() {
  state.trayItems = [];
  saveTray();
  renderTray();
  showToast("Đã làm trống khay emoji", "🧹");
}

function renderTray() {
  const count = state.trayItems.length;
  if (count > 0) {
    el.trayCountBadge.innerText = count;
    el.trayCountBadge.style.display = "inline-block";
  } else {
    el.trayCountBadge.style.display = "none";
  }

  if (state.trayItems.length === 0) {
    el.trayEmojis.innerHTML = `<span class="tray-placeholder">Click vào emoji bất kỳ để thêm vào đây...</span>`;
    return;
  }

  el.trayEmojis.innerHTML = state.trayItems
    .map(
      (char, idx) => `
    <span class="tray-chip" data-idx="${idx}" title="Bấm để xoá">
      ${char} <span class="tray-chip-del">✕</span>
    </span>
  `,
    )
    .join("");

  el.trayEmojis.querySelectorAll(".tray-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const idx = parseInt(chip.getAttribute("data-idx"), 10);
      removeFromTray(idx);
    });
  });
}

/**
 * Render Category Navigation Tabs
 */
function renderCategoryNav() {
  const categories = [
    { id: "favorites", label: "⭐ Đã lưu", count: state.favorites.length },
    { id: "recents", label: "🕒 Vừa dùng", count: state.recents.length },
    { id: "fb_hot", label: "🔥 Hot Bán Hàng", count: facebookSpecialCategories.fb_hot.emojis.length },
    { id: "fb_bullets", label: "🎯 Gạch đầu dòng", count: facebookSpecialCategories.fb_bullets.emojis.length },
    { id: "fb_symbols", label: "✦ Ký Tự Đặc Biệt", count: facebookSpecialCategories.fb_symbols.emojis.length },
    { id: "fb_cta", label: "👉 Mũi tên & CTA", count: facebookSpecialCategories.fb_cta.emojis.length },
    { id: "fb_trust", label: "✅ Cam kết uy tín", count: facebookSpecialCategories.fb_trust.emojis.length },
    { id: "fb_contact", label: "📞 Hotline & Shop", count: facebookSpecialCategories.fb_contact.emojis.length },
    { id: "fb_reactions", label: "❤️ Reaction FB", count: facebookSpecialCategories.fb_reactions.emojis.length },
    { id: "all", label: "🌐 Tất cả Emojis", count: allEmojis.length },
    ...Object.entries(groupNameMap).map(([id, label]) => ({
      id,
      label,
      count: allEmojis.filter((e) => e.group === id).length,
    })),
  ];

  el.categoryNav.innerHTML = categories
    .map(
      (cat) => `
    <button class="cat-tab-btn ${state.activeCategory === cat.id ? "active" : ""}" data-cat="${cat.id}">
      <span>${cat.label}</span>
      <span style="font-size:0.75rem;opacity:0.75;">(${cat.count})</span>
    </button>
  `,
    )
    .join("");

  el.categoryNav.querySelectorAll(".cat-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeCategory = btn.getAttribute("data-cat");
      state.searchQuery = "";
      el.searchInput.value = "";
      el.searchClearBtn.style.display = "none";
      renderCategoryNav();
      renderMainView();
    });
  });
}

/**
 * Render Skin Tone Selector
 */
function renderSkinTones() {
  el.skinToneOptions.innerHTML = SKIN_TONES.map(
    (t) => `
    <button class="tone-btn ${state.skinTone === t.value ? "active" : ""}" data-tone="${t.value}" title="${t.label}">
      ${t.symbol}
    </button>
  `,
  ).join("");

  el.skinToneOptions.querySelectorAll(".tone-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.skinTone = btn.getAttribute("data-tone");
      renderSkinTones();
      renderMainView();
    });
  });
}

/**
 * Render Individual Emoji Card
 */
function renderEmojiCard(item) {
  const baseChar = typeof item === "string" ? item : item.emoji;
  const emojiObj = emojiByChar.get(baseChar) || (typeof item === "object" ? item : null);
  const displayChar = applySkinTone(baseChar, state.skinTone);
  const isFav = state.favorites.includes(baseChar);
  const title = emojiObj ? emojiObj.name || "" : "";
  const vnTag = emojiObj && emojiObj.vnKeywords && emojiObj.vnKeywords[0] ? `• ${emojiObj.vnKeywords[0]}` : "";

  return `
    <div class="emoji-card" data-emoji="${baseChar}" title="${title}">
      <span>${displayChar}</span>
      <button class="fav-btn ${isFav ? "is-favorite" : ""}" data-fav="${baseChar}" title="${isFav ? "Bỏ thích" : "Yêu thích"}">
        ${isFav ? "★" : "☆"}
      </button>
      <div class="emoji-tooltip">${title} ${vnTag}</div>
    </div>
  `;
}

/**
 * Render Category Sections or Search Results
 */
function renderMainView() {
  const container = el.emojiSectionsContainer;
  container.innerHTML = "";

  // 1. Search Mode
  if (state.searchQuery.trim()) {
    const results = searchEmojis(state.searchQuery, searchIndex, 300);
    el.searchCount.innerHTML = `Tìm thấy <strong>${results.length}</strong> emojis cho "<em>${escapeHTML(state.searchQuery)}</em>"`;
    el.searchStatusText.style.display = "flex";

    if (results.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <div class="empty-text">Không tìm thấy emoji nào phù hợp</div>
          <div class="empty-subtext">Thử tìm kiếm với từ khóa khác như "lửa", "tích xanh", "tim", "sao", "sale", "mũi tên"...</div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <section class="category-section">
        <div class="section-header">
          <h2 class="section-title">
            <span>🔎 Kết Quả Tìm Kiếm</span>
            <span class="section-count">${results.length}</span>
          </h2>
          <button class="section-copy-all" data-copy-chars="${results
            .slice(0, 30)
            .map((r) => r.emoji)
            .join("")}">
            Copy Top 30
          </button>
        </div>
        <div class="emoji-grid">
          ${results.map((r) => renderEmojiCard(r)).join("")}
        </div>
      </section>
    `;
    bindCardEvents(container);
    return;
  }

  el.searchStatusText.style.display = "none";

  // 2. Favorites Category
  if (state.activeCategory === "favorites") {
    if (state.favorites.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⭐</div>
          <div class="empty-text">Chưa có emoji yêu thích nào</div>
          <div class="empty-subtext">Rê chuột vào bất kỳ emoji nào và bấm ngôi sao ☆ để lưu vào đây nhé!</div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <section class="category-section">
        <div class="section-header">
          <h2 class="section-title">
            <span>⭐ Emojis Đã Lưu Của Bạn</span>
            <span class="section-count">${state.favorites.length}</span>
          </h2>
          <button class="section-copy-all" data-copy-chars="${state.favorites.join("")}">
            Copy Tất Cả
          </button>
        </div>
        <div class="emoji-grid">
          ${state.favorites.map((c) => renderEmojiCard(c)).join("")}
        </div>
      </section>
    `;
    bindCardEvents(container);
    return;
  }

  // 3. Recents Category
  if (state.activeCategory === "recents") {
    if (state.recents.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🕒</div>
          <div class="empty-text">Chưa có emoji nào vừa dùng</div>
          <div class="empty-subtext">Khi bạn click copy emoji, các emoji đó sẽ tự động xuất hiện tại đây.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <section class="category-section">
        <div class="section-header">
          <h2 class="section-title">
            <span>🕒 Emojis Vừa Sử Dụng Gần Đây</span>
            <span class="section-count">${state.recents.length}</span>
          </h2>
          <button class="section-copy-all" data-copy-chars="${state.recents.join("")}">
            Copy Tất Cả
          </button>
        </div>
        <div class="emoji-grid">
          ${state.recents.map((c) => renderEmojiCard(c)).join("")}
        </div>
      </section>
    `;
    bindCardEvents(container);
    return;
  }

  // 4. Curated Facebook Category
  if (facebookSpecialCategories[state.activeCategory]) {
    const spec = facebookSpecialCategories[state.activeCategory];
    container.innerHTML = `
      <section class="category-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span>${spec.name}</span>
              <span class="section-count">${spec.emojis.length}</span>
            </h2>
            <div style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">${spec.description}</div>
          </div>
          <button class="section-copy-all" data-copy-chars="${spec.emojis.join("")}">
            Copy Toàn Bộ
          </button>
        </div>
        <div class="emoji-grid">
          ${spec.emojis.map((c) => renderEmojiCard(c)).join("")}
        </div>
      </section>
    `;
    bindCardEvents(container);
    return;
  }

  // 5. Standard Unicode Group Category
  if (groupNameMap[state.activeCategory]) {
    const list = allEmojis.filter((e) => e.group === state.activeCategory);
    container.innerHTML = `
      <section class="category-section">
        <div class="section-header">
          <h2 class="section-title">
            <span>${groupNameMap[state.activeCategory]}</span>
            <span class="section-count">${list.length}</span>
          </h2>
          <button class="section-copy-all" data-copy-chars="${list
            .slice(0, 30)
            .map((e) => e.emoji)
            .join("")}">
            Copy Top 30
          </button>
        </div>
        <div class="emoji-grid">
          ${list.map((e) => renderEmojiCard(e)).join("")}
        </div>
      </section>
    `;
    bindCardEvents(container);
    return;
  }

  // 6. "All" Category: render all special categories first, then all unicode groups
  let html = "";

  Object.values(facebookSpecialCategories).forEach((spec) => {
    html += `
      <section class="category-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span>${spec.name}</span>
              <span class="section-count">${spec.emojis.length}</span>
            </h2>
            <div style="font-size:0.82rem;color:var(--text-muted);margin-top:2px;">${spec.description}</div>
          </div>
          <button class="section-copy-all" data-copy-chars="${spec.emojis.join("")}">
            Copy Toàn Bộ
          </button>
        </div>
        <div class="emoji-grid">
          ${spec.emojis.map((c) => renderEmojiCard(c)).join("")}
        </div>
      </section>
    `;
  });

  Object.entries(groupNameMap).forEach(([groupId, groupLabel]) => {
    const items = allEmojis.filter((e) => e.group === groupId);
    html += `
      <section class="category-section">
        <div class="section-header">
          <h2 class="section-title">
            <span>${groupLabel}</span>
            <span class="section-count">${items.length}</span>
          </h2>
          <button class="section-copy-all" data-copy-chars="${items
            .slice(0, 30)
            .map((e) => e.emoji)
            .join("")}">
            Copy Top 30
          </button>
        </div>
        <div class="emoji-grid">
          ${items.map((e) => renderEmojiCard(e)).join("")}
        </div>
      </section>
    `;
  });

  container.innerHTML = html;
  bindCardEvents(container);
}

/**
 * Bind Click & Favorite Events
 */
function bindCardEvents(container) {
  // Emoji card click -> instant copy
  container.querySelectorAll(".emoji-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".fav-btn")) return;
      const emoji = card.getAttribute("data-emoji");
      handleEmojiClick(emoji);
    });
  });

  // Favorite button click
  container.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const emoji = btn.getAttribute("data-fav");
      toggleFavorite(emoji);
    });
  });

  // Copy row / section
  container.querySelectorAll(".section-copy-all").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const chars = btn.getAttribute("data-copy-chars");
      if (chars) {
        await copyToClipboard(chars);
        showToast(`Đã sao chép hàng emoji!`, "📋");
      }
    });
  });
}

/**
 * Setup Search & Shortcuts
 */
function setupSearch() {
  let debounceTimer = null;

  el.searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    const val = e.target.value;
    el.searchClearBtn.style.display = val ? "block" : "none";

    debounceTimer = setTimeout(() => {
      state.searchQuery = val;
      renderMainView();
    }, 40);
  });

  el.searchClearBtn.addEventListener("click", () => {
    clearSearch();
  });

  el.clearSearchLink.addEventListener("click", () => {
    clearSearch();
  });

  // Global Keyboard Shortcuts
  window.addEventListener("keydown", (e) => {
    // Focus search with '/' or 'Cmd/Ctrl + K'
    if ((e.key === "/" && document.activeElement !== el.searchInput) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
      e.preventDefault();
      el.searchInput.focus();
      el.searchInput.select();
    }

    // Clear search with Esc
    if (e.key === "Escape") {
      if (el.searchInput.value) {
        clearSearch();
      }
    }
  });
}

function clearSearch() {
  el.searchInput.value = "";
  el.searchClearBtn.style.display = "none";
  state.searchQuery = "";
  renderMainView();
  el.searchInput.focus();
}

/**
 * Setup Theme, Sound & Tray Handlers
 */
function setupControls() {
  // Theme
  document.documentElement.setAttribute("data-theme", state.theme);
  updateThemeIcon();

  el.themeToggleBtn.addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
    document.documentElement.setAttribute("data-theme", state.theme);
    updateThemeIcon();
  });

  // Sound
  toggleSound(state.sound);
  updateSoundIcon();

  el.soundToggleBtn.addEventListener("click", () => {
    state.sound = !state.sound;
    localStorage.setItem(STORAGE_KEYS.SOUND, state.sound);
    toggleSound(state.sound);
    updateSoundIcon();
    showToast(state.sound ? "Âm thanh bật" : "Âm thanh tắt", state.sound ? "🔊" : "🔇");
  });

  // Tray Toggle
  el.toggleTrayBtn.addEventListener("click", () => {
    setTrayOpen(!state.isTrayOpen);
  });

  el.closeTrayBtn.addEventListener("click", () => {
    setTrayOpen(false);
  });

  // Copy Tray
  el.copyTrayBtn.addEventListener("click", async () => {
    if (state.trayItems.length === 0) {
      showToast("Khay đang trống!", "⚠️");
      return;
    }
    const combined = state.trayItems.join("");
    const success = await copyToClipboard(combined);
    if (success) {
      showToast(`Đã sao chép chuỗi emoji: ${combined}`, "📋");
    }
  });

  // Clear Tray
  el.clearTrayBtn.addEventListener("click", () => {
    clearTray();
  });
}

function updateThemeIcon() {
  el.themeToggleBtn.innerHTML = state.theme === "dark" ? "☀️" : "🌙";
  el.themeToggleBtn.setAttribute("title", state.theme === "dark" ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối");
}

function updateSoundIcon() {
  el.soundToggleBtn.innerHTML = state.sound ? "🔊" : "🔇";
  el.soundToggleBtn.setAttribute("title", state.sound ? "Tắt âm thanh click" : "Bật âm thanh click");
}

function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[tag] || tag,
  );
}

/**
 * Initialize Application
 */
function init() {
  initDOM();
  setupControls();
  setupSearch();
  renderCategoryNav();
  renderSkinTones();
  renderTray();
  setTrayOpen(state.isTrayOpen);
  renderMainView();
}

document.addEventListener("DOMContentLoaded", init);
