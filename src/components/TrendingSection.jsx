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
      <h2 className="section-title">🔥 Trending News</h2>
      <div className="trending-grid">
        {/* Iterates through the top 3 latest articles passed as a prop from App.jsx */}
        {trendingArticles.map((article, idx) => (
          <div 
            key={`trending-${idx}`} // Composite key using index for trending list
            className="article-card" 
            style={{ cursor: 'pointer' }} 
            // Syntax: External link handling via window.open()
            onClick={() => window.open(article.url, '_blank')}
          >
            {/* 1. VISUAL: Shorter image for the horizontal grid layout */}
            {article.urlToImage && (
              <img src={article.urlToImage} alt="" className="article-image" style={{ height: '120px' }} />
            )}
            <div className="article-content" style={{ padding: '1rem' }}>
              {/* 2. SOURCE BADGE */}
              <div className="article-source" style={{ display: 'inline-block', marginBottom: '0.5rem', fontSize: '0.7rem' }}>
                {article.source.name}
              </div>
              {/* 3. TRENDING TITLE */}
              <h3 className="article-title" style={{ fontSize: '1rem', marginBottom: 0 }}>
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

