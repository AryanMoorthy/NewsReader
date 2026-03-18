import { Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Clock, CheckCircle2, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * ArticleCard Component
 * Represents a single news article with interactive elements.
 * Features:
 * - Direct link to the source article
 * - Relative publication time
 * - View expandable description and reading time estimate
 * - Toggle read status and bookmarking
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
  // Use article.title as the key for persistence (read status, bookmarks, expansion)
  const uId = article.id;
  const title = article.title;
  const isRead = readArticles.includes(title);
  const isBookmarked = bookmarkedArticles.includes(title);
  const isExpanded = expandedArticles.includes(title);
  
  /**
   * Estimates the reading time based on the text length.
   * Assumes an average reading speed of 200 words per minute.
   */
  const calculateReadingTime = (text) => {
    if (!text) return 1;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  return (
    <div className={`article-card ${isRead ? 'read' : ''}`}>
      {/* Breaking News Badge */}
      {article.isBreaking && (
        <div className="badge-breaking">🔴 BREAKING</div>
      )}
      
      {/* Article Image with fallback handling */}
      {article.urlToImage && (
        <img 
          src={article.urlToImage} 
          alt={article.title} 
          className="article-image"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      
      <div className="article-content">
        {/* Source and Timestamp Metadata */}
        <div className="article-meta">
          <span className="article-source">{article.source?.name || 'Unknown Source'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} />
            {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : 'Unknown'}
          </span>
        </div>
        
        {/* Article Title Linked to Source */}
        <h3 className={`article-title ${isRead ? 'read' : ''}`}>
          <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            {article.title}
          </a>
        </h3>
        
        {/* Description Section with Expand/Collapse toggle */}
        {article.description && (
          <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            {isExpanded ? (
              <p className="article-desc" style={{ marginBottom: '0.5rem' }}>{article.description}</p>
            ) : (
              <p className="article-desc" style={{ marginBottom: '0.5rem' }}>
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
              {isExpanded ? (
                <><ChevronUp size={16} /> Show Less</>
              ) : (
                <><ChevronDown size={16} /> Expand ({calculateReadingTime(article.description)} min read)</>
              )}
            </button>
          </div>
        )}
        
        {/* Bottom Actions: Mark Read and Bookmark */}
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
