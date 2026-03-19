import { Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Clock, CheckCircle2, Circle } from 'lucide-react'; // Visual icons for actions
import { formatDistanceToNow } from 'date-fns'; // Utility to convert ISO dates to "2 hours ago" format

/**
 * ArticleCard Component: Renders an individual news item with interactive controls.
 * 
 * Props (Destructured):
 * @param {object} article - Full article data object (title, url, image, etc.).
 * @param {array} readArticles - List of titles already marked as read.
 * @param {function} toggleReadStatus - Injected handler from App.jsx.
 * @param {array} bookmarkedArticles - List of titles saved to bookmarks.
 * @param {function} toggleBookmark - Injected handler from App.jsx.
 * @param {array} expandedArticles - Titles currently showing full descriptions.
 * @param {function} toggleExpand - Toggle logic for long text.
 */
const ArticleCard = ({ 
  article, 
  readArticles, 
  toggleReadStatus, 
  bookmarkedArticles, 
  toggleBookmark, 
  expandedArticles, 
  toggleExpand 
}) => {
  // DERIVED STATE: Check status of current article for visual feedback
  const title = article.title;
  const isRead = readArticles.includes(title);
  const isBookmarked = bookmarkedArticles.includes(title);
  const isExpanded = expandedArticles.includes(title);
  
  /**
   * Helper Logic: Estimates the reading time based on description length.
   * Assumes an average reading speed of 200 words per minute.
   */
  const calculateReadingTime = (text) => {
    if (!text) return 1;
    const words = text.split(/\s+/).length; // Syntax: Split string by whitespace regex
    return Math.max(1, Math.ceil(words / 200)); // Rounds up to the nearest minute
  };

  return (
    <div className={`article-card ${isRead ? 'read' : ''}`}>
      {/* 1. IMAGE: Premium container with overlay and better error handling */}
      <div className="article-image-container">
        {article.isBreaking && (
          <div className="badge-breaking">🔥 BREAKING</div>
        )}
        
        {article.urlToImage ? (
          <>
            <img 
              src={article.urlToImage} 
              alt={article.title} 
              className="article-image"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="article-image-overlay" />
          </>
        ) : (
          <div className="article-image-placeholder" />
        )}
      </div>
      
      <div className="article-content">
        {/* 2. METADATA: Refined source and time */}
        <div className="article-meta">
          <span className="article-source">{article.source?.name || 'News'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} />
            {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : 'Just now'}
          </span>
        </div>
        
        {/* 3. TITLE: Direct link */}
        <h3 className={`article-title ${isRead ? 'read' : ''}`}>
          <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            {article.title}
          </a>
        </h3>
        
        {/* 4. DESCRIPTION: Revamped 'Expand' behavior */}
        {article.description && (
          <div className="article-body">
            <p className="article-desc">
              {isExpanded ? article.description : (
                article.description.length > 90 
                  ? `${article.description.slice(0, 90)}...` 
                  : article.description
              )}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <button 
                className={`expand-btn ${isExpanded ? 'active' : ''}`}
                onClick={() => toggleExpand(title)}
              >
                {isExpanded ? 'Show Less' : `Read More`}
                <ChevronDown className="chevron" size={16} />
              </button>
              <span className="read-time">{calculateReadingTime(article.description)} min read</span>
            </div>
          </div>
        )}
        
        {/* 5. USER INTERACTIONS: Revamped Action Group */}
        <div className="article-footer">
          <div className="action-group">
            <button 
              className={`action-btn ${isRead ? 'read-active' : ''}`}
              onClick={() => toggleReadStatus(title)}
              title={isRead ? "Mark as unread" : "Mark as read"}
            >
              {isRead ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>
            
            <button 
              className={`action-btn ${isBookmarked ? 'active' : ''}`}
              onClick={() => toggleBookmark(title)}
              title={isBookmarked ? "Remove bookmark" : "Save article"}
            >
              {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
          </div>
          
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Full Article
          </a>
        </div>
      </div>
    </div>

  );
};

export default ArticleCard;

