import React, { useState } from 'react';

export default function EmojiTray({
  isOpen,
  trayItems,
  onClose,
  onRemoveItem,
  onRemoveLast,
  onClear,
  onCopyTray
}) {
  const [withSpaces, setWithSpaces] = useState(false);

  return (
    <div className={`emoji-tray ${isOpen ? '' : 'collapsed'}`}>
      <div className="tray-inner">
        <div className="tray-header-mini">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="tray-title">🧺 Khay Gom Emoji ({trayItems.length}):</span>
            <label className="tray-space-toggle" title="Thêm dấu cách giữa các emoji khi sao chép">
              <input
                type="checkbox"
                checked={withSpaces}
                onChange={(e) => setWithSpaces(e.target.checked)}
              />
              <span>Thêm dấu cách</span>
            </label>
          </div>
          <button type="button" className="tray-close-btn" onClick={onClose} title="Đóng khay">
            ✕
          </button>
        </div>

        <div className="tray-content">
          <div className="tray-emojis-list">
            {trayItems.length === 0 ? (
              <span className="tray-placeholder">Click vào emoji bất kỳ để thêm vào đây...</span>
            ) : (
              trayItems.map((char, idx) => (
                <span
                  key={`${char}-${idx}`}
                  className="tray-chip"
                  onClick={() => onRemoveItem(idx)}
                  title="Bấm để xoá"
                >
                  {char} <span className="tray-chip-del">✕</span>
                </span>
              ))
            )}
          </div>

          <div className="tray-actions">
            {trayItems.length > 0 && (
              <button
                type="button"
                className="btn-undo-tray"
                onClick={onRemoveLast}
                title="Xoá emoji vừa thêm gần nhất"
              >
                ⌫ Xoá cuối
              </button>
            )}
            <button
              type="button"
              className="btn-copy-tray"
              onClick={() => onCopyTray(withSpaces)}
              title="Sao chép toàn bộ emoji trong khay"
            >
              📋 Sao Chép Khay
            </button>
            <button
              type="button"
              className="btn-clear-tray"
              onClick={onClear}
              title="Xoá làm sạch khay"
            >
              🧹 Xoá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
