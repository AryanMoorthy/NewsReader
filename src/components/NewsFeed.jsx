import { AlertCircle, RefreshCw } from 'lucide-react'; // Icons for error and refresh actions
import ArticleCard from './ArticleCard'; // The individual unit for each news story

/**
 * ActionBar Component: A helper component for manual news refresh and sorting.
 * 
 * @param {function} fetchNews - Function to trigger a fresh API request.
 * @param {boolean} loading - Current loading state to disable the button.
 * @param {string} sortBy - Current sort preference ('latest'/'oldest').
 * @param {function} setSortBy - Function to update sorting state.
 */
export const ActionBar = ({ fetchNews, loading, sortBy, setSortBy }) => {
  return (
    <div className="filters-row" style={{ marginTop: '-1rem' }}>
      {/* REFRESH BUTTON: Multi-layered button with smooth transition */}
      <button className="btn" onClick={() => fetchNews(true)} disabled={loading}>
        <RefreshCw size={18} className={loading ? 'skeleton' : ''} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> 
        Refresh News
      </button>
      
      {/* SORT SELECTOR: Wrapped in a premium select structure */}
      <div className="select-wrapper">
        <select 
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >

          <option value="latest">Latest Updates</option>
          <option value="oldest">Historical First</option>
        </select>
      </div>
    </div>
  );
};

/**
 * NewsFeed Component: The main architectural grid for displaying news articles.
 * Handles three distinct UI states: Loading, Empty, and Content.
 */
const NewsFeed = ({ 
  loading, 
  filteredArticles, 
  category, 
  showBookmarksOnly, 
  readArticles, 
  toggleReadStatus, 
  bookmarkedArticles, 
  toggleBookmark, 
  expandedArticles, 
  toggleExpand 
}) => {
  return (
    <div className="news-feed-container">
      {/* 1. DYNAMIC SECTION TITLE: Changes based on the active view (Category vs Bookmarks) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          {showBookmarksOnly ? 'Reading List' : `${category} Feed`}
        </h2>
        {!loading && <span className="read-time" style={{ opacity: 0.6 }}>{filteredArticles.length} articles found</span>}
      </div>
      
      {/* 2. LOADING STATE: Renders 'Skeleton' cards using a temporary array [1..6] */}
      {loading ? (
        <div className="news-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="article-card skeleton-card skeleton"></div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        /* 3. EMPTY STATE: Shown when no articles match the search or bookmarks are empty */
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <AlertCircle size={64} />
          </div>
          <h3>Quiet in here...</h3>
          <p>We couldn't find any articles matching those criteria.</p>
          <button className="btn btn-outline" onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
            Clear all filters
          </button>
        </div>
      ) : (
        /* 4. CONTENT STATE: Maps over the filteredArticles array to render individual cards */
        <div className="news-grid" style={{ animation: 'fadeIn 0.5s ease-out' }}>
          {filteredArticles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              readArticles={readArticles}
              toggleReadStatus={toggleReadStatus}
              bookmarkedArticles={bookmarkedArticles}
              toggleBookmark={toggleBookmark}
              expandedArticles={expandedArticles}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};


export default NewsFeed;

