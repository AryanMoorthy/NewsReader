import { CATEGORIES } from '../utils/constants';

/**
 * FilterBar Component
 * Displays the category tabs for navigation and provides basic 
 * stats about the articles (Total, Read, Unread).
 */
const FilterBar = ({ 
  category, 
  setCategory, 
  setShowBookmarksOnly, 
  totalArticles, 
  readCount, 
  unreadCount 
}) => {
  return (
    <div className="filters-row">
      {/* Category Tabs */}
      <div className="tabs">
        {CATEGORIES.map(cat => (
          <div 
            key={cat}
            className={`tab ${category === cat ? 'active' : ''}`}
            onClick={() => {
              setCategory(cat);
              // When changing category, reset bookmarks-only view
              setShowBookmarksOnly(false);
            }}
          >
            {cat}
          </div>
        ))}
      </div>
      
      {/* Article Statistics */}
      <div className="stats">
        <div className="stat-item">Total: <span>{totalArticles}</span></div>
        <div className="stat-item">Read: <span style={{color: 'var(--success)'}}>{readCount}</span></div>
        <div className="stat-item">Unread: <span>{unreadCount}</span></div>
      </div>
    </div>
  );
};

export default FilterBar;
