import { CATEGORIES } from '../utils/constants'; // List of news categories (e.g., Tech, Sports)

/**
 * FilterBar Component: Displays category navigation tabs and basic article metrics.
 * 
 * @param {string} category - The currently selected news category.
 * @param {function} setCategory - Function to update the category state.
 * @param {function} setShowBookmarksOnly - Injected to reset bookmark view when user clicks a category.
 * @param {number} totalArticles - Count of all articles in the current feed.
 * @param {number} readCount - Count of articles marked as read by the user.
 * @param {number} unreadCount - totalArticles minus readCount.
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
      {/* 1. CATEGORY TABS: Renders a button for each category in the constants file */}
      <div className="tabs">
        {CATEGORIES.map(cat => (
          <div 
            key={cat} 
            className={`tab ${category === cat ? 'active' : ''}`}
            onClick={() => {
              setCategory(cat);
              setShowBookmarksOnly(false);
            }}
          >
            {cat}
          </div>
        ))}
      </div>
      
      {/* 2. STATS DASHBOARD: Quick overview of the user's reading progress */}
      <div className="stats">
        <div className="stat-item">Total: <span>{totalArticles}</span></div>
        <div className="stat-item">Read: <span>{readCount}</span></div>
        <div className="stat-item">Unread: <span>{unreadCount}</span></div>
      </div>
    </div>

  );
};

export default FilterBar;

