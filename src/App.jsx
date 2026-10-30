import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import EmojiGrid from './components/EmojiGrid.jsx';
import EmojiTray from './components/EmojiTray.jsx';
import Toast from './components/Toast.jsx';

import { allEmojis, facebookSpecialCategories, groupNameMap } from './data/emojis.js';
import { buildSearchIndex, searchEmojis } from './utils/search.js';
import { copyToClipboard, toggleSound, playCopySound } from './utils/clipboard.js';

// Local Storage Keys
const STORAGE_KEYS = {
  FAVORITES: 'fb_emoji_favorites_react_v1',
  RECENTS: 'fb_emoji_recents_react_v1',
  THEME: 'fb_emoji_theme_react_v1',
  SOUND: 'fb_emoji_sound_react_v1',
  TRAY_OPEN: 'fb_emoji_tray_open_react_v1',
  TRAY_ITEMS: 'fb_emoji_tray_items_react_v1',
  SIDEBAR_COLLAPSED: 'fb_emoji_sidebar_collapsed_react_v1',
  SKIN_TONE: 'fb_emoji_skin_tone_react_v1'
};

export default function App() {
  // State
  const [activeCategory, setActiveCategory] = useState('fb_hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [skinTone, setSkinTone] = useState(() => {
    return localStorage.getItem('fb_emoji_skin_tone_react_v1') || '';
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    } catch {
      return [];
    }
  });

  const [recents, setRecents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENTS) || '[]');
    } catch {
      return [];
    }
  });

  const [trayItems, setTrayItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRAY_ITEMS) || '[]');
    } catch {
      return [];
    }
  });

  const [isTrayOpen, setIsTrayOpen] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.TRAY_OPEN) === 'true';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === 'true';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  });

  const [sound, setSound] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SOUND) !== 'false';
  });

  const [toasts, setToasts] = useState([]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(recents.slice(0, 60)));
  }, [recents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRAY_ITEMS, JSON.stringify(trayItems));
  }, [trayItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRAY_OPEN, isTrayOpen);
  }, [isTrayOpen]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKIN_TONE, skinTone);
  }, [skinTone]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND, sound);
    toggleSound(sound);
  }, [sound]);

  // Toast helper
  const showToast = useCallback((message, emoji = '📋') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, emoji }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2200);
  }, []);

  // Pre-indexed emoji lookups
  const emojiMap = useMemo(() => {
    const map = new Map();
    allEmojis.forEach((e) => map.set(e.emoji, e));
    return map;
  }, []);

  const popularSet = useMemo(() => {
    const set = new Set();
    Object.values(facebookSpecialCategories).forEach((cat) => {
      cat.emojis.forEach((e) => set.add(e));
    });
    return set;
  }, []);

  const searchIndex = useMemo(() => {
    return buildSearchIndex(allEmojis, popularSet);
  }, [popularSet]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchEmojis(searchQuery, searchIndex, 300);
  }, [searchQuery, searchIndex]);

  // Sidebar Categories definition with dynamic counts
  const categories = useMemo(() => {
    return [
      { id: 'favorites', icon: '⭐', label: 'Đã lưu', count: favorites.length },
      { id: 'recents', icon: '🕒', label: 'Vừa dùng', count: recents.length },
      {
        id: 'fb_hot',
        icon: '🔥',
        label: 'Hot Bán Hàng',
        count: facebookSpecialCategories.fb_hot.emojis.length
      },
      {
        id: 'fb_bullets',
        icon: '🎯',
        label: 'Gạch đầu dòng',
        count: facebookSpecialCategories.fb_bullets.emojis.length
      },
      {
        id: 'fb_symbols',
        icon: '✦',
        label: 'Ký Tự Đặc Biệt',
        count: facebookSpecialCategories.fb_symbols.emojis.length
      },
      {
        id: 'fb_cta',
        icon: '👉',
        label: 'Mũi tên & CTA',
        count: facebookSpecialCategories.fb_cta.emojis.length
      },
      {
        id: 'fb_trust',
        icon: '✅',
        label: 'Cam kết uy tín',
        count: facebookSpecialCategories.fb_trust.emojis.length
      },
      {
        id: 'fb_contact',
        icon: '📞',
        label: 'Hotline & Shop',
        count: facebookSpecialCategories.fb_contact.emojis.length
      },
      {
        id: 'fb_reactions',
        icon: '❤️',
        label: 'Reaction FB',
        count: facebookSpecialCategories.fb_reactions.emojis.length
      },
      { id: 'all', icon: '🌐', label: 'Tất cả Emojis', count: allEmojis.length },
      ...Object.entries(groupNameMap).map(([id, label]) => {
        const parts = label.split(' ');
        const icon = parts[0];
        const name = parts.slice(1).join(' ');
        return {
          id,
          icon,
          label: name,
          count: allEmojis.filter((e) => e.group === id).length
        };
      })
    ];
  }, [favorites.length, recents.length]);

  // Keyboard shortcut: Cmd/Ctrl + B to toggle sidebar
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Actions
  const handleCopy = useCallback(
    async (char) => {
      const baseChar = char.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '');
      setRecents((prev) => [char, ...prev.filter((c) => c !== char && c !== baseChar)].slice(0, 60));

      const success = await copyToClipboard(char);
      if (success) {
        showToast(`Đã copy ${char}`, char);
      }

      if (isTrayOpen) {
        setTrayItems((prev) => [...prev, char]);
      }
    },
    [isTrayOpen, showToast]
  );

  const handleCopyBulk = useCallback(
    async (chars) => {
      if (!chars) return;
      const success = await copyToClipboard(chars);
      if (success) {
        showToast(`Đã sao chép hàng emoji!`, '📋');
      }
    },
    [showToast]
  );

  const handleToggleFavorite = useCallback(
    (baseChar) => {
      setFavorites((prev) => {
        const clean = baseChar.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '');
        if (prev.includes(clean)) {
          showToast(`Đã xoá ${clean} khỏi Yêu thích`, '⭐');
          return prev.filter((c) => c !== clean);
        } else {
          showToast(`Đã thêm ${clean} vào Yêu thích`, '⭐');
          return [clean, ...prev];
        }
      });
    },
    [showToast]
  );

  const handleCopyTray = useCallback(async () => {
    if (trayItems.length === 0) {
      showToast('Khay đang trống!', '⚠️');
      return;
    }
    const combined = trayItems.join('');
    const success = await copyToClipboard(combined);
    if (success) {
      showToast(`Đã sao chép chuỗi emoji: ${combined}`, '📋');
    }
  }, [trayItems, showToast]);

  const handleClearTray = useCallback(() => {
    setTrayItems([]);
    showToast('Đã làm trống khay emoji', '🧹');
  }, [showToast]);

  const handleRemoveTrayItem = useCallback((index) => {
    setTrayItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        skinTone={skinTone}
        setSkinTone={setSkinTone}
        trayCount={trayItems.length}
        isTrayOpen={isTrayOpen}
        onToggleTray={() => setIsTrayOpen((prev) => !prev)}
        sound={sound}
        onToggleSound={() => setSound((prev) => !prev)}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
      />

      {/* Main Layout: Collapsible Sidebar + Content */}
      <div className="app-layout">
        <Sidebar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={(id) => {
            setActiveCategory(id);
            setSearchQuery('');
            if (window.innerWidth <= 900) {
              setIsSidebarCollapsed(true);
            }
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        <main className="app-main">
          <EmojiGrid
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            searchResults={searchResults}
            favorites={favorites}
            recents={recents}
            skinTone={skinTone}
            emojiMap={emojiMap}
            facebookSpecialCategories={facebookSpecialCategories}
            groupNameMap={groupNameMap}
            allEmojis={allEmojis}
            onCopy={handleCopy}
            onCopyBulk={handleCopyBulk}
            onToggleFavorite={handleToggleFavorite}
            onClearSearch={() => setSearchQuery('')}
          />
        </main>
      </div>

      {/* Floating Bottom Multi-Copy Tray */}
      <EmojiTray
        isOpen={isTrayOpen}
        trayItems={trayItems}
        onClose={() => setIsTrayOpen(false)}
        onRemoveItem={handleRemoveTrayItem}
        onClear={handleClearTray}
        onCopyTray={handleCopyTray}
      />

      {/* Floating Toast Notifications */}
      <Toast toasts={toasts} />
    </div>
  );
}

