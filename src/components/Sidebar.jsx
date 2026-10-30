import React from 'react';

export default function Sidebar({
  categories,
  activeCategory,
  onSelectCategory,
  isCollapsed,
  onToggleCollapse
}) {
  return (
    <aside className={`category-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <span className="sidebar-heading">Danh Mục</span>
        <button
          type="button"
          className="btn-collapse-sidebar"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          <span>{isCollapsed ? '▶' : '◀'}</span>
        </button>
      </div>

      <nav className="sidebar-nav">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`sidebar-cat-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
              title={`${cat.icon} ${cat.label} (${cat.count})`}
            >
              <span className="cat-item-icon">{cat.icon}</span>
              <span className="cat-item-label">{cat.label}</span>
              <span className="cat-item-count">{cat.count}</span>

              {/* Tooltip shown only when sidebar is collapsed */}
              <div className="cat-item-tooltip">
                <span>{cat.icon} {cat.label}</span>
                <span style={{ opacity: 0.75, fontSize: '0.72rem' }}>({cat.count})</span>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

