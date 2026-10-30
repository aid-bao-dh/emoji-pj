import React from 'react';
import { applySkinTone } from '../utils/skinTone.js';

export default function EmojiCard({
  item,
  skinTone,
  emojiMap,
  isFavorite,
  onCopy,
  onToggleFavorite
}) {
  const baseChar = typeof item === 'string' ? item : item.emoji;
  const emojiObj = emojiMap ? emojiMap.get(baseChar) : (typeof item === 'object' ? item : null);
  const displayChar = applySkinTone(baseChar, skinTone, emojiMap);

  const title = emojiObj?.name || '';
  const vnTag = emojiObj?.vnKeywords?.[0] ? `• ${emojiObj.vnKeywords[0]}` : '';

  return (
    <div
      className="emoji-card"
      data-emoji={baseChar}
      title={title}
      onClick={() => onCopy(displayChar)}
    >
      <span>{displayChar}</span>

      <button
        type="button"
        className={`fav-btn ${isFavorite ? 'is-favorite' : ''}`}
        title={isFavorite ? 'Bỏ thích' : 'Yêu thích'}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(baseChar);
        }}
      >
        {isFavorite ? '★' : '☆'}
      </button>

      <div className="emoji-tooltip">
        {title} {vnTag}
      </div>
    </div>
  );
}

