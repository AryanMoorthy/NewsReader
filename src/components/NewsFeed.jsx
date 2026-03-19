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
      {/* REFRESH BUTTON: Calls fetchNews(true) to bypass cache */}
      <button className="btn btn-outline" onClick={() => fetchNews(true)} disabled={loading}>
        <RefreshCw size={16} className={loading ? 'skeleton' : ''} /> Refresh News
      </button>
      
      {/* SORT SELECTOR: Triggers a re-render in App.jsx via getFilteredArticles */}
      <select 
        className="sort-select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>
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
    <div>
      {/* 1. DYNAMIC SECTION TITLE: Changes based on the active view (Category vs Bookmarks) */}
      <h2 className="section-title">
        {showBookmarksOnly ? 'Your Bookmarks' : `${category} Headlines`}
      </h2>
      
      {/* 2. LOADING STATE: Renders 'Skeleton' cards using a temporary array [1..6] */}
      {loading ? (
        <div className="news-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="article-card skeleton-card skeleton"></div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        /* 3. EMPTY STATE: Shown when no articles match the search or bookmarks are empty */
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No articles found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        /* 4. CONTENT STATE: Maps over the filteredArticles array to render individual cards */
        <div className="news-grid">
          {filteredArticles.map((article) => (
            <ArticleCard 
              key={article.id} // Essential for React to track item moves/changes
              article={article} // Prop Drilling: Passing state and handlers down to the child component
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

