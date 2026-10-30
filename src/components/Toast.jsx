import React from 'react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-item toast-show">
          <span className="toast-emoji">{toast.emoji}</span>
          <span className="toast-text">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

