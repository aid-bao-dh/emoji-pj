import React from 'react';

export default function EmojiTray({
  isOpen,
  trayItems,
  onClose,
  onRemoveItem,
  onClear,
  onCopyTray
}) {
  return (
    <div className={`emoji-tray ${isOpen ? '' : 'collapsed'}`}>
      <div className="tray-inner">
        <div className="tray-header-mini">
          <span className="tray-title">🧺 Khay Gom Emoji Đang Chọn ({trayItems.length}):</span>
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
            <button
              type="button"
              className="btn-copy-tray"
              onClick={onCopyTray}
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

