import { useState, useEffect } from 'react';
import { 
  Search, Sun, Moon, RefreshCw, Bookmark, BookmarkCheck,
  ChevronDown, ChevronUp, Clock, AlertCircle, CheckCircle2, Circle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import './index.css';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'YOUR_KEY';
const CATEGORIES = ['All', 'World', 'Nation', 'Business', 'Technology', 'Science', 'Sports', 'Health', 'Entertainment'];
const COUNTRIES = [
  { code: 'us', name: 'USA' },
  { code: 'in', name: 'India' },
  { code: 'gb', name: 'UK' },
  { code: 'au', name: 'Australia' },
  { code: 'ca', name: 'Canada' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' }
];

// Dummy data for fallback if API is not working initially
const DUMMY_DATA = [
  {
    title: "Global Markets Rally as Tech Stocks Surge",
    description: "Technology companies led a broad market rally today, pushing major indices to new record highs amid strong earnings reports and optimistic economic forecasts.",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a223680?q=80&w=800&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    source: { name: "Financial Times" },
    url: "#",
    isBreaking: false
  },
  {
    title: "Breakthrough in Renewable Energy Storage",
    description: "Researchers have announced a potential major breakthrough in solid-state battery technology that could double the range of electric vehicles while halving charging times. The new materials used are abundant and readily available.",
    urlToImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: { name: "Science Daily" },
    url: "#",
    isBreaking: true
  },
  {
    title: "New AI Model Outperforms Humans in Complex Coding Tasks",
    description: "A newly released artificial intelligence model has demonstrated unprecedented capabilities in software development, successfully completing complex coding tasks that typically require senior engineers.",
    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: { name: "TechCrunch" },
    url: "#",
    isBreaking: false
  },
  {
    title: "Championship Finals Set for This Weekend",
    description: "After a grueling playoff series, the two top teams are set to face off this Sunday in what promises to be one of the most exciting championship games in recent history.",
    urlToImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    source: { name: "ESPN" },
    url: "#",
    isBreaking: false
  }
];

function App() {
  // State
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [country, setCountry] = useState('in'); // Default to India as per user's preference
  
  // Persisted state using lazy initialization
  const [readArticles, setReadArticles] = useState(() => {
    const saved = localStorage.getItem('news_read_articles');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [bookmarkedArticles, setBookmarkedArticles] = useState(() => {
    const saved = localStorage.getItem('news_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('news_theme');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [expandedArticles, setExpandedArticles] = useState([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Effects
  useEffect(() => {
    // Apply theme
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('news_theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    // Save preferences
    localStorage.setItem('news_read_articles', JSON.stringify(readArticles));
  }, [readArticles]);

  useEffect(() => {
    localStorage.setItem('news_bookmarks', JSON.stringify(bookmarkedArticles));
  }, [bookmarkedArticles]);

  useEffect(() => {
    fetchNews();
  }, [category, country]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      // API call to GNews API endpoint
      const catParam = category === 'All' ? 'general' : category.toLowerCase();
      const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=${catParam}&lang=en&country=${country}&max=10&apikey=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.articles) {
        // Filter out articles with missing essential data
        const validArticles = data.articles.filter(
          a => a.title && a.url
        );
        
        // Add artificial ID and breaking flags, and map 'image' to 'urlToImage' for compatibility
        const mappedArticles = validArticles.map((article, index) => ({
          ...article,
          urlToImage: article.image, // GNews uses 'image'
          id: `article-${index}-${Date.now()}`,
          isBreaking: index === 0 && Math.random() > 0.7 // Randomly assign breaking to top article
        }));
        
        setArticles(mappedArticles);
      } else {
        throw new Error(data.errors?.[0] || 'Failed to fetch news');
      }
    } catch (err) {
      console.warn('API Fetch failed, using dummy data fallback.', err);
      // Fallback to dummy data
      const fakeApiResponse = DUMMY_DATA.map((article, index) => ({
        ...article,
        id: `article-${index}-${Date.now()}`,
        isBreaking: index === 0 || index === 2
      }));
      setArticles(fakeApiResponse);
      setError('Using simulated data (API key missing or rate limit reached).');
    } finally {
      setLoading(false);
    }
  };

  // Derived State & Filtering
  const getFilteredArticles = () => {
    let filtered = [...articles];

    // Filter by bookmarks mode
    if (showBookmarksOnly) {
      filtered = filtered.filter(a => bookmarkedArticles.includes(a.title)); // using title as pseudo-id
    }

    // Filter by search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        a => 
          (a.title && a.title.toLowerCase().includes(lowerSearch)) || 
          (a.description && a.description.toLowerCase().includes(lowerSearch))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortBy === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const filteredArticles = getFilteredArticles();
  
  // Calculate trending (top 3 selected by some metric, here just the first 3 of the latest)
  const trendingArticles = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  // Stats
  const totalArticles = articles.length;
  const readCount = articles.filter(a => readArticles.includes(a.title)).length;
  const unreadCount = totalArticles - readCount;

  // Handlers
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  
  const toggleReadStatus = (title) => {
    setReadArticles(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const toggleBookmark = (title) => {
    setBookmarkedArticles(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const toggleExpand = (title) => {
    setExpandedArticles(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const calculateReadingTime = (text) => {
    if (!text) return 1;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1 className="header-title">
          <span style={{ fontSize: '2.5rem' }}>📰</span> NewsReader
        </h1>
        
        <div className="controls">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search headlines..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className={`btn ${showBookmarksOnly ? '' : 'btn-outline'}`}
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            title="View Bookmarks"
          >
            {showBookmarksOnly ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            {showBookmarksOnly ? 'Bookmarked' : 'Bookmarks'}
          </button>
          
          <button className="icon-btn" onClick={toggleTheme} title="Toggle Dark Mode">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <select 
            className="country-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            title="Change Country"
            style={{
              padding: '0.4rem 0.6rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              outline: 'none',
              marginLeft: '0.5rem'
            }}
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Stats & Filters */}
      <div className="filters-row">
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
        
        <div className="stats">
          <div className="stat-item">Total: <span>{totalArticles}</span></div>
          <div className="stat-item">Read: <span style={{color: 'var(--success)'}}>{readCount}</span></div>
          <div className="stat-item">Unread: <span>{unreadCount}</span></div>
        </div>
      </div>

      <div className="filters-row" style={{ marginTop: '-1rem' }}>
        <button className="btn btn-outline" onClick={fetchNews} disabled={loading}>
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

      {error && (
        <div className="error-message">
          <AlertCircle size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          {error}
        </div>
      )}

      {/* Trending Section (only show on 'All' when not searching/bookmarking) */}
      {!loading && !error && category === 'All' && !searchTerm && !showBookmarksOnly && trendingArticles.length > 0 && (
        <div className="trending-section">
          <h2 className="section-title">🔥 Trending News</h2>
          <div className="trending-grid">
            {trendingArticles.map((article, idx) => (
              <div key={`trending-${idx}`} className="article-card" style={{ cursor: 'pointer' }} onClick={() => window.open(article.url, '_blank')}>
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
      )}

      {/* Main News Feed */}
      <div>
        <h2 className="section-title">
          {showBookmarksOnly ? 'Your Bookmarks' : `${category} Headlines`}
        </h2>
        
        {loading ? (
          <div className="news-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="article-card skeleton-card skeleton"></div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3>No articles found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="news-grid">
            {filteredArticles.map((article) => {
              const uId = article.id; // Using the uniquely generated ID
              const isRead = readArticles.includes(article.title);
              const isBookmarked = bookmarkedArticles.includes(article.title);
              const isExpanded = expandedArticles.includes(article.title);
              
              return (
                <div key={uId} className={`article-card ${isRead ? 'read' : ''}`}>
                  {article.isBreaking && (
                    <div className="badge-breaking">🔴 BREAKING</div>
                  )}
                  
                  {article.urlToImage && (
                    <img 
                      src={article.urlToImage} 
                      alt={article.title} 
                      className="article-image"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  
                  <div className="article-content">
                    <div className="article-meta">
                      <span className="article-source">{article.source?.name || 'Unknown Source'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : 'Unknown'}
                      </span>
                    </div>
                    
                    <h3 className={`article-title ${isRead ? 'read' : ''}`}>
                      <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                        {article.title}
                      </a>
                    </h3>
                    
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
                          onClick={() => toggleExpand(uId)}
                        >
                          {isExpanded ? (
                            <><ChevronUp size={16} /> Show Less</>
                          ) : (
                            <><ChevronDown size={16} /> Expand ({calculateReadingTime(article.description)} min read)</>
                          )}
                        </button>
                      </div>
                    )}
                    
                    <div className="article-footer">
                      <button 
                        className={`action-btn ${isRead ? 'read-active' : ''}`}
                        onClick={() => toggleReadStatus(uId)}
                        title={isRead ? "Mark as UNREAD" : "Mark as READ"}
                      >
                        {isRead ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        {isRead ? 'Read' : 'Mark as read'}
                      </button>
                      
                      <button 
                        className={`action-btn ${isBookmarked ? 'active' : ''}`}
                        onClick={() => toggleBookmark(uId)}
                        title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                      >
                        {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
