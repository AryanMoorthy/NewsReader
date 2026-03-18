/**
 * TrendingSection Component
 * Shows a horizontal grid of top news stories.
 * Only displayed on the 'All' category when not in search or bookmark mode.
 */
const TrendingSection = ({ trendingArticles, loading, error, category, searchTerm, showBookmarksOnly }) => {
  // Hide if loading, if there's an error, if not in 'All' category, or if search/bookmark mode is active
  if (loading || error || category !== 'All' || searchTerm || showBookmarksOnly || trendingArticles.length === 0) {
    return null;
  }

  return (
    <div className="trending-section">
      <h2 className="section-title">🔥 Trending News</h2>
      <div className="trending-grid">
        {trendingArticles.map((article, idx) => (
          <div 
            key={`trending-${idx}`} 
            className="article-card" 
            style={{ cursor: 'pointer' }} 
            onClick={() => window.open(article.url, '_blank')}
          >
            {/* Visual representation of the trending article */}
            {article.urlToImage && (
              <img src={article.urlToImage} alt="" className="article-image" style={{ height: '120px' }} />
            )}
            <div className="article-content" style={{ padding: '1rem' }}>
              <div className="article-source" style={{ display: 'inline-block', marginBottom: '0.5rem', fontSize: '0.7rem' }}>
                {article.source.name}
              </div>
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
