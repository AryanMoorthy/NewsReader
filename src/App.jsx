import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import './index.css';

// Import modular UI components to keep App.jsx clean and focused on state management
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import NewsFeed, { ActionBar } from './components/NewsFeed';
import TrendingSection from './components/TrendingSection';

// Import centralized constants and fallback data
import { DUMMY_DATA } from './utils/constants';

/**
 * Main Application Component
 * 
 * This component serves as the 'Brain' of the application. It:
 * 1. Manages global state (articles, loading, theme, bookmarks, etc.)
 * 2. Handles API communication with GNews
 * 3. Implements a caching layer to save on API quota
 * 4. Coordinates the flow of data between sub-components
 */

// Retrieve the API key from environment variables
const API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'YOUR_KEY';

function App() {
  /**
   * --- APPLICATION STATE ---
   */
  
  // Main news data state
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI Filtering and Sorting state
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [country, setCountry] = useState('in'); // Defaulting to India
  
  // API Optimization: Caching state
  // Stores { 'country-category': { data, timestamp } }
  const [newsCache, setNewsCache] = useState({});
  
  // Persistence: Bookmarks & Read History (using lazy initialization from LocalStorage)
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
  
  // Temporary UI states
  const [expandedArticles, setExpandedArticles] = useState([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  /**
   * --- SIDE EFFECTS (useEffect) ---
   */

  // Effect: Sync Theme with Body class and LocalStorage
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('news_theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Effect: Sync Read/Bookmark preferences to LocalStorage for persistence
  useEffect(() => {
    localStorage.setItem('news_read_articles', JSON.stringify(readArticles));
  }, [readArticles]);

  useEffect(() => {
    localStorage.setItem('news_bookmarks', JSON.stringify(bookmarkedArticles));
  }, [bookmarkedArticles]);

  // Effect: Re-fetch news whenever the category or country changes
  useEffect(() => {
    fetchNews();
  }, [category, country]);

  /**
   * --- DATA FETCHING & CACHING LOGIC ---
   */

  /**
   * Fetches news from GNews API or retrieves it from cache.
   * @param {boolean} forceRefresh - If true, bypasses the cache and makes a network request.
   */
  const fetchNews = async (forceRefresh = false) => {
    const cacheKey = `${country}-${category}`;
    const cachedData = newsCache[cacheKey];
    const cacheTTL = 10 * 60 * 1000; // 10 minute cache duration

    // Check if valid cache exists and we aren't forcing a refresh
    if (!forceRefresh && cachedData && (Date.now() - cachedData.timestamp < cacheTTL)) {
      console.log(`Using cached data for ${cacheKey}`);
      setArticles(cachedData.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Map category 'All' to 'general' for GNews API compatibility
      const catParam = category === 'All' ? 'general' : category.toLowerCase();
      
      // Perform the network request
      const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=${catParam}&lang=en&country=${country}&max=10&apikey=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.articles) {
        // Validation: Remove malformed entries
        const validArticles = data.articles.filter(a => a.title && a.url);
        
        // Enrichment: Add unique IDs and map 'image' field for UI consistency
        const mappedArticles = validArticles.map((article, index) => ({
          ...article,
          urlToImage: article.image, 
          id: `${article.title.substring(0, 10)}-${index}-${Date.now()}`,
          isBreaking: index === 0 && Math.random() > 0.7 
        }));
        
        setArticles(mappedArticles);
        
        // Cache the successful result
        setNewsCache(prev => ({
          ...prev,
          [cacheKey]: {
            data: mappedArticles,
            timestamp: Date.now()
          }
        }));
      } else {
        throw new Error(data.errors?.[0] || 'Failed to fetch news');
      }
    } catch (err) {
      console.warn('API Fetch failed, using dummy fallback.', err);
      // Fallback Strategy: Use offline-friendly dummy data
      const fakeApiResponse = DUMMY_DATA.map((article, index) => ({
        ...article,
        urlToImage: article.urlToImage,
        id: `article-${index}-${Date.now()}`,
        isBreaking: index === 0 || index === 2
      }));
      setArticles(fakeApiResponse);
      setError('Using simulated data (API limit reached or key missing).');
    } finally {
      setLoading(false);
    }
  };

  /**
   * --- DATA FILTERING & SORTING LOGIC ---
   */

  /**
   * Processed view of the raw articles list.
   * Handles bookmark filtering, text search, and time-based sorting.
   */
  const getFilteredArticles = () => {
    let filtered = [...articles];

    if (showBookmarksOnly) {
      filtered = filtered.filter(a => bookmarkedArticles.includes(a.title));
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        a => 
          (a.title && a.title.toLowerCase().includes(lowerSearch)) || 
          (a.description && a.description.toLowerCase().includes(lowerSearch))
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortBy === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const filteredArticles = getFilteredArticles();
  
  // Extract top 3 latest articles for the trending highlight section
  const trendingArticles = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  // Derived Statistics
  const totalArticles = articles.length;
  const readCount = articles.filter(a => readArticles.includes(a.title)).length;
  const unreadCount = totalArticles - readCount;

  /**
   * --- EVENT HANDLERS ---
   */
  
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  
  const toggleReadStatus = (title) => {
    setReadArticles(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const toggleBookmark = (title) => {
    setBookmarkedArticles(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const toggleExpand = (title) => {
    setExpandedArticles(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  /**
   * --- RENDER LAYER ---
   */
  return (
    <div className="app-container">
      {/* 1. Header & Navigation Controls */}
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showBookmarksOnly={showBookmarksOnly}
        setShowBookmarksOnly={setShowBookmarksOnly}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        country={country}
        setCountry={setCountry}
      />

      {/* 2. Topic Filters & Stats Dashboard */}
      <FilterBar 
        category={category}
        setCategory={setCategory}
        setShowBookmarksOnly={setShowBookmarksOnly}
        totalArticles={totalArticles}
        readCount={readCount}
        unreadCount={unreadCount}
      />

      {/* 3. Action Bar (Refresh & Sort) */}
      <ActionBar 
        fetchNews={fetchNews}
        loading={loading}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* 4. Global Error Notifications */}
      {error && (
        <div className="error-message">
          <AlertCircle size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          {error}
        </div>
      )}

      {/* 5. Trending News Billboard (Conditional) */}
      <TrendingSection 
        trendingArticles={trendingArticles}
        loading={loading}
        error={error}
        category={category}
        searchTerm={searchTerm}
        showBookmarksOnly={showBookmarksOnly}
      />

      {/* 6. Main News Grid Feed */}
      <NewsFeed 
        loading={loading}
        filteredArticles={filteredArticles}
        category={category}
        showBookmarksOnly={showBookmarksOnly}
        readArticles={readArticles}
        toggleReadStatus={toggleReadStatus}
        bookmarkedArticles={bookmarkedArticles}
        toggleBookmark={toggleBookmark}
        expandedArticles={expandedArticles}
        toggleExpand={toggleExpand}
      />
    </div>
  );
}

export default App;
