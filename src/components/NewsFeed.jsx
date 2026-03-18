import { AlertCircle, RefreshCw } from 'lucide-react';
import ArticleCard from './ArticleCard';

/**
 * ActionBar Component
 * Small utility component for the refresh button and sort selector.
 */
export const ActionBar = ({ fetchNews, loading, sortBy, setSortBy }) => {
  return (
    <div className="filters-row" style={{ marginTop: '-1rem' }}>
      <button className="btn btn-outline" onClick={() => fetchNews(true)} disabled={loading}>
        <RefreshCw size={16} className={loading ? 'skeleton' : ''} /> Refresh News
      </button>
      
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
 * NewsFeed Component
 * The main container for articles. Handles:
 * - Loading states (skeleton cards)
 * - Empty states (no articles found)
 * - Rendering the grid of ArticleCards
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
      {/* Dynamic Section Title */}
      <h2 className="section-title">
        {showBookmarksOnly ? 'Your Bookmarks' : `${category} Headlines`}
      </h2>
      
      {/* Loading Skeleton State */}
      {loading ? (
        <div className="news-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="article-card skeleton-card skeleton"></div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        /* Empty State */
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No articles found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        /* Actual Content Grid */
        <div className="news-grid">
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
