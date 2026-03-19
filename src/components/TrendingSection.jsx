/**
 * TrendingSection Component: A billboard-style display for top stories.
 * This component is used as a highlight section before the main grid on the home page.
 */
const TrendingSection = ({ trendingArticles, loading, error, category, searchTerm, showBookmarksOnly }) => {
  /**
   * CONDITIONAL GUARD CLAUSE:
   * Trends should only appear in the 'All' category view when NOT searching or viewing bookmarks.
   * If any of these conditions are met, the component returns 'null' (renders nothing).
   */
  if (loading || error || category !== 'All' || searchTerm || showBookmarksOnly || trendingArticles.length === 0) {
    return null;
  }

  return (
    <div className="trending-section">
      <h2 className="section-title">✨ Trending Now</h2>
      <div className="trending-grid">
        {/* Iterates through the top 3 latest articles passed as a prop from App.jsx */}
        {trendingArticles.map((article, idx) => (
          <div 
            key={`trending-${idx}`} 
            className="article-card" 
            onClick={() => window.open(article.url, '_blank')}
          >
            <div className="article-image-container" style={{ height: '140px' }}>
              {article.urlToImage && (
                <img src={article.urlToImage} alt="" className="article-image" />
              )}
              <div className="article-image-overlay" />
            </div>
            <div className="article-content" style={{ padding: '1.25rem' }}>
              <div className="article-meta">
                <span>{article.source.name}</span>
              </div>
              <h3 className="article-title" style={{ fontSize: '1rem', fontWeight: '800' }}>
                {article.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default TrendingSection;

