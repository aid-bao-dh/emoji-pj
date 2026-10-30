import React from 'react';
import EmojiCard from './EmojiCard.jsx';
import { applySkinTone } from '../utils/skinTone.js';

export default function EmojiGrid({
  activeCategory,
  searchQuery,
  searchResults,
  favorites,
  recents,
  skinTone,
  emojiMap,
  facebookSpecialCategories,
  groupNameMap,
  allEmojis,
  onCopy,
  onCopyBulk,
  onToggleFavorite,
  onClearSearch
}) {
  // 1. Search Mode
  if (searchQuery.trim()) {
    return (
      <div className="emoji-sections-container">
        <div className="search-meta-bar">
          <span>
            Tìm thấy <strong>{searchResults.length}</strong> emojis cho "<em>{searchQuery}</em>"
          </span>
          <button type="button" className="clear-search-link" onClick={onClearSearch}>
            Xoá tìm kiếm
          </button>
        </div>

        {searchResults.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-text">Không tìm thấy emoji nào phù hợp</div>
            <div className="empty-subtext">
              Thử tìm kiếm với từ khóa khác như "lửa", "tích xanh", "tim", "sao", "sale", "mũi tên"...
            </div>
          </div>
        ) : (
          <section className="category-section">
            <div className="section-header">
              <h2 className="section-title">
                <span>🔎 Kết Quả Tìm Kiếm</span>
                <span className="section-count">{searchResults.length}</span>
              </h2>
              <button
                type="button"
                className="section-copy-all"
                onClick={() => {
                  const chars = searchResults
                    .slice(0, 30)
                    .map((r) => applySkinTone(r.emoji, skinTone, emojiMap))
                    .join('');
                  onCopyBulk(chars);
                }}
              >
                Copy Top 30
              </button>
            </div>
            <div className="emoji-grid">
              {searchResults.map((r) => (
                <EmojiCard
                  key={r.emoji}
                  item={r}
                  skinTone={skinTone}
                  emojiMap={emojiMap}
                  isFavorite={favorites.includes(r.emoji)}
                  onCopy={onCopy}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // 2. Favorites Mode
  if (activeCategory === 'favorites') {
    return (
      <div className="emoji-sections-container">
        {favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⭐</div>
            <div className="empty-text">Chưa có emoji yêu thích nào</div>
            <div className="empty-subtext">
              Rê chuột vào bất kỳ emoji nào và bấm ngôi sao ☆ để lưu vào đây nhé!
            </div>
          </div>
        ) : (
          <section className="category-section">
            <div className="section-header">
              <h2 className="section-title">
                <span>⭐ Emojis Đã Lưu Của Bạn</span>
                <span className="section-count">{favorites.length}</span>
              </h2>
              <button
                type="button"
                className="section-copy-all"
                onClick={() => {
                  const chars = favorites
                    .map((c) => applySkinTone(c, skinTone, emojiMap))
                    .join('');
                  onCopyBulk(chars);
                }}
              >
                Copy Tất Cả
              </button>
            </div>
            <div className="emoji-grid">
              {favorites.map((c) => (
                <EmojiCard
                  key={c}
                  item={c}
                  skinTone={skinTone}
                  emojiMap={emojiMap}
                  isFavorite={true}
                  onCopy={onCopy}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // 3. Recents Mode
  if (activeCategory === 'recents') {
    return (
      <div className="emoji-sections-container">
        {recents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🕒</div>
            <div className="empty-text">Chưa có emoji nào vừa dùng</div>
            <div className="empty-subtext">
              Khi bạn click copy emoji, các emoji đó sẽ tự động xuất hiện tại đây.
            </div>
          </div>
        ) : (
          <section className="category-section">
            <div className="section-header">
              <h2 className="section-title">
                <span>🕒 Emojis Vừa Sử Dụng Gần Đây</span>
                <span className="section-count">{recents.length}</span>
              </h2>
              <button
                type="button"
                className="section-copy-all"
                onClick={() => {
                  const chars = recents.join('');
                  onCopyBulk(chars);
                }}
              >
                Copy Tất Cả
              </button>
            </div>
            <div className="emoji-grid">
              {recents.map((c, idx) => (
                <EmojiCard
                  key={`${c}-${idx}`}
                  item={c}
                  skinTone={skinTone}
                  emojiMap={emojiMap}
                  isFavorite={favorites.includes(c.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, ''))}
                  onCopy={onCopy}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // 4. Curated Facebook Category
  if (facebookSpecialCategories[activeCategory]) {
    const spec = facebookSpecialCategories[activeCategory];
    return (
      <div className="emoji-sections-container">
        <section className="category-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <span>{spec.name}</span>
                <span className="section-count">{spec.emojis.length}</span>
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {spec.description}
              </div>
            </div>
            <button
              type="button"
              className="section-copy-all"
              onClick={() => {
                const chars = spec.emojis
                  .map((c) => applySkinTone(c, skinTone, emojiMap))
                  .join('');
                onCopyBulk(chars);
              }}
            >
              Copy Toàn Bộ
            </button>
          </div>
          <div className="emoji-grid">
            {spec.emojis.map((c) => (
              <EmojiCard
                key={c}
                item={c}
                skinTone={skinTone}
                emojiMap={emojiMap}
                isFavorite={favorites.includes(c)}
                onCopy={onCopy}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  // 5. Standard Unicode Group Category
  if (groupNameMap[activeCategory]) {
    const list = allEmojis.filter((e) => e.group === activeCategory);
    return (
      <div className="emoji-sections-container">
        <section className="category-section">
          <div className="section-header">
            <h2 className="section-title">
              <span>{groupNameMap[activeCategory]}</span>
              <span className="section-count">{list.length}</span>
            </h2>
            <button
              type="button"
              className="section-copy-all"
              onClick={() => {
                const chars = list
                  .slice(0, 30)
                  .map((e) => applySkinTone(e.emoji, skinTone, emojiMap))
                  .join('');
                onCopyBulk(chars);
              }}
            >
              Copy Top 30
            </button>
          </div>
          <div className="emoji-grid">
            {list.map((e) => (
              <EmojiCard
                key={e.emoji}
                item={e}
                skinTone={skinTone}
                emojiMap={emojiMap}
                isFavorite={favorites.includes(e.emoji)}
                onCopy={onCopy}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  // 6. "All" Category Mode
  return (
    <div className="emoji-sections-container">
      {Object.values(facebookSpecialCategories).map((spec) => (
        <section key={spec.id} className="category-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <span>{spec.name}</span>
                <span className="section-count">{spec.emojis.length}</span>
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {spec.description}
              </div>
            </div>
            <button
              type="button"
              className="section-copy-all"
              onClick={() => {
                const chars = spec.emojis
                  .map((c) => applySkinTone(c, skinTone, emojiMap))
                  .join('');
                onCopyBulk(chars);
              }}
            >
              Copy Toàn Bộ
            </button>
          </div>
          <div className="emoji-grid">
            {spec.emojis.map((c) => (
              <EmojiCard
                key={c}
                item={c}
                skinTone={skinTone}
                emojiMap={emojiMap}
                isFavorite={favorites.includes(c)}
                onCopy={onCopy}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      ))}

      {Object.entries(groupNameMap).map(([groupId, groupLabel]) => {
        const items = allEmojis.filter((e) => e.group === groupId);
        return (
          <section key={groupId} className="category-section">
            <div className="section-header">
              <h2 className="section-title">
                <span>{groupLabel}</span>
                <span className="section-count">{items.length}</span>
              </h2>
              <button
                type="button"
                className="section-copy-all"
                onClick={() => {
                  const chars = items
                    .slice(0, 30)
                    .map((e) => applySkinTone(e.emoji, skinTone, emojiMap))
                    .join('');
                  onCopyBulk(chars);
                }}
              >
                Copy Top 30
              </button>
            </div>
            <div className="emoji-grid">
              {items.map((e) => (
                <EmojiCard
                  key={e.emoji}
                  item={e}
                  skinTone={skinTone}
                  emojiMap={emojiMap}
                  isFavorite={favorites.includes(e.emoji)}
                  onCopy={onCopy}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
