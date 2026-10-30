import React, { useRef, useEffect } from 'react';
import { SKIN_TONES } from '../utils/skinTone.js';

export default function Header({
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
  skinTone,
  setSkinTone,
  trayCount,
  isTrayOpen,
  onToggleTray,
  sound,
  onToggleSound,
  theme,
  onToggleTheme
}) {
  const inputRef = useRef(null);

  // Keyboard shortcut listener: Cmd/Ctrl + K or / to focus search
  useEffect(() => {
    function handleKeyDown(e) {
      if (
        (e.key === '/' && document.activeElement !== inputRef.current) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }

      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, setSearchQuery]);

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-left">
          <button
            type="button"
            className="btn-sidebar-toggle"
            onClick={onToggleSidebar}
            title="Thu gọn / Mở rộng menu (⌘B)"
          >
            <span className="toggle-icon">☰</span>
          </button>
          <a href="#" className="brand" title="Kho Emoji Facebook Đầy Đủ">
            <div className="brand-icon">🔥</div>
            <div className="brand-info">
              <h1>
                FB Emoji Pro <span className="brand-badge">2000+ EMOJIS</span>
              </h1>
              <p className="brand-desc">Bộ emoji Facebook đầy đủ • Tìm kiếm &amp; Copy siêu tốc</p>
            </div>
          </a>
        </div>

        {/* Fast Search Bar */}
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Tìm emoji theo tiếng Việt hoặc tiếng Anh (lửa, tích xanh, tim, sao, mũi tên...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            spellCheck="false"
          />
          {searchQuery ? (
            <button
              type="button"
              className="search-clear-btn"
              style={{ display: 'block' }}
              onClick={() => {
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              title="Xoá tìm kiếm"
            >
              ✕
            </button>
          ) : (
            <span className="search-shortcut" title="Phím tắt tìm kiếm">
              ⌘K / /
            </span>
          )}
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Skin Tone Selector */}
          <div className="skin-tone-group" title="Chọn màu da tay & cử chỉ">
            <span className="skin-tone-label">Màu da:</span>
            <div className="tone-options">
              {SKIN_TONES.map((tone) => (
                <button
                  key={tone.label}
                  type="button"
                  className={`tone-circle-btn ${skinTone === tone.value ? 'active' : ''}`}
                  onClick={() => setSkinTone(tone.value)}
                  title={tone.label}
                  style={{ backgroundColor: tone.color }}
                  aria-label={tone.label}
                />
              ))}
            </div>
          </div>

          {/* Copy Multi Tray Toggle */}
          <button
            type="button"
            className={`btn-tray-toggle ${isTrayOpen ? 'active' : ''}`}
            onClick={onToggleTray}
            title="Bật/Tắt Khay gom nhiều emoji cùng lúc"
          >
            <span>🧺 Khay Copy</span>
            {trayCount > 0 && (
              <span className="tray-count-badge" style={{ display: 'inline-block' }}>
                {trayCount}
              </span>
            )}
          </button>

          {/* Sound Feedback Toggle */}
          <button
            type="button"
            className="btn-icon"
            onClick={onToggleSound}
            title={sound ? 'Tắt âm thanh click' : 'Bật âm thanh click'}
          >
            {sound ? '🔊' : '🔇'}
          </button>

          {/* Dark/Light Theme Toggle */}
          <button
            type="button"
            className="btn-icon"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}

