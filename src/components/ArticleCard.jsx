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
      {/* 1. BADGE: Visual indicator for urgent/breaking news (probabilistic flag from App.jsx) */}
      {article.isBreaking && (
        <div className="badge-breaking">🔴 BREAKING</div>
      )}
      
      {/* 2. IMAGE: Displays article thumbnail with error fallback logic */}
      {article.urlToImage && (
        <img 
          src={article.urlToImage} 
          alt={article.title} 
          className="article-image"
          // Syntax: Inline error handler to hide broken images
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      
      <div className="article-content">
        {/* 3. METADATA: Source name and relative publication time */}
        <div className="article-meta">
          <span className="article-source">{article.source?.name || 'Unknown Source'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} />
            {/* Logic: date-fns formatting with suffix (e.g., 'ago') */}
            {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : 'Unknown'}
          </span>
        </div>
        
        {/* 4. TITLE: Clickable link that opens in a new tab */}
        <h3 className={`article-title ${isRead ? 'read' : ''}`}>
          <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            {article.title}
          </a>
        </h3>
        
        {/* 5. DESCRIPTION: Truncated by default, toggleable to full view */}
        {article.description && (
          <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            {isExpanded ? (
              <p className="article-desc" style={{ marginBottom: '0.5rem' }}>{article.description}</p>
            ) : (
              <p className="article-desc" style={{ marginBottom: '0.5rem' }}>
                {/* Logic: Limit string length to 100 characters for grid consistency */}
                {article.description.length > 100 
                  ? `${article.description.slice(0, 100)}...` 
                  : article.description}
              </p>
            )}
            <button 
              className="action-btn" 
              style={{ color: 'var(--primary)', padding: 0 }}
              onClick={() => toggleExpand(title)}
            >
              {/* Ternary: Switch labels based on expansion state */}
              {isExpanded ? (
                <><ChevronUp size={16} /> Show Less</>
              ) : (
                <><ChevronDown size={16} /> Expand ({calculateReadingTime(article.description)} min read)</>
              )}
            </button>
          </div>
        )}
        
        {/* 6. USER INTERACTIONS: Mark as read and Save (Bookmark) */}
        <div className="article-footer">
          <button 
            className={`action-btn ${isRead ? 'read-active' : ''}`}
            onClick={() => toggleReadStatus(title)}
            title={isRead ? "Mark as UNREAD" : "Mark as READ"}
          >
            {isRead ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            {isRead ? 'Read' : 'Mark as read'}
          </button>
          
          <button 
            className={`action-btn ${isBookmarked ? 'active' : ''}`}
            onClick={() => toggleBookmark(title)}
            title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;

