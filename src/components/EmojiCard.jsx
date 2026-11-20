import React, { useState } from 'react';
import { applySkinTone } from '../utils/skinTone.js';

export default function EmojiCard({
  item,
  skinTone,
  emojiMap,
  isFavorite,
  onCopy,
  onToggleFavorite
}) {
  const [copied, setCopied] = useState(false);
  const baseChar = typeof item === 'string' ? item : item.emoji;
  const emojiObj = emojiMap ? emojiMap.get(baseChar) : (typeof item === 'object' ? item : null);
  const displayChar = applySkinTone(baseChar, skinTone, emojiMap);

  const title = emojiObj?.name || '';
  const vnTag = emojiObj?.vnKeywords?.[0] ? `• ${emojiObj.vnKeywords[0]}` : '';

  const handleClick = () => {
    onCopy(displayChar);
    setCopied(true);
    setTimeout(() => setCopied(false), 600);
  };

  return (
    <div
      className={`emoji-card ${copied ? 'copied' : ''}`}
      data-emoji={baseChar}
      title={title}
      onClick={handleClick}
    >
      <span>{displayChar}</span>

      {copied && <span className="copied-badge">✓</span>}

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
        {copied ? 'Đã sao chép!' : `${title} ${vnTag}`}
      </div>
    </div>
  );
}
