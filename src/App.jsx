import { useState, useEffect } from 'react'; // React hooks for managing state and side effects
import { AlertCircle } from 'lucide-react'; // Icon component for error messages
import './index.css'; // Global CSS styles

// Import modular UI components to keep App.jsx clean and focused on state management
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import NewsFeed, { ActionBar } from './components/NewsFeed';
import TrendingSection from './components/TrendingSection';

// Import centralized constants and fallback data
import { DUMMY_DATA } from './utils/constants';

/**
 * Main Application Component (App)
 * 
 * This component serves as the 'Brain' of the application. It:
 * 1. Manages global state (articles, loading, theme, bookmarks, etc.)
 * 2. Handles API communication with GNews
 * 3. Implements a caching layer to save on API quota
 * 4. Coordinates the flow of data between sub-components
 */

// Retrieve the API key from environment variables (defined in .env file)
// Uses Vite's import.meta.env for accessing environment variables
const API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'YOUR_KEY';

function App() {
  /**
   * --- APPLICATION STATE (useState Hook) ---
   * useState returns a stateful value and a function to update it.
   */
  
  // Main news data state: stores the list of articles from the API
  const [articles, setArticles] = useState([]);
  
  // Loading state: tracks if data is currently being fetched
  const [loading, setLoading] = useState(true);
  
  // Error state: stores error messages if API fetch fails
  const [error, setError] = useState(null);
  
  // UI Filtering and Sorting state
  const [category, setCategory] = useState('All'); // Current news category
  const [searchTerm, setSearchTerm] = useState(''); // Text entered in the search bar
  const [sortBy, setSortBy] = useState('latest'); // Sorting order (latest vs oldest)
  const [country, setCountry] = useState('in'); // Targeted country code (e.g., 'in' for India)
  
  // API Optimization: Caching state
  // Stores { 'country-category': { data: Array, timestamp: Number } }
  // Used to prevent redundant API calls for the same category within a short time.
  const [newsCache, setNewsCache] = useState({});
  
  // Persistence: Bookmarks & Read History
  // Uses lazy initialization: the function passed to useState runs only on the first render
  const [readArticles, setReadArticles] = useState(() => {
    // Read list of read articles from LocalStorage for persistence across reloads
    const saved = localStorage.getItem('news_read_articles');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [bookmarkedArticles, setBookmarkedArticles] = useState(() => {
    // Read bookmarked articles from LocalStorage
    const saved = localStorage.getItem('news_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check LocalStorage first, then fall back to the user's system preference
    const saved = localStorage.getItem('news_theme');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Temporary UI states
  const [expandedArticles, setExpandedArticles] = useState([]); // List of article titles currently expanded
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false); // Toggle for 'My Bookmarks' view

  /**
   * --- SIDE EFFECTS (useEffect Hook) ---
   * useEffect performs side effects (DOM updates, API calls, subscriptions).
   */

  // Effect: Sync Dark Mode state with the <body> element's class list
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Save theme preference to LocalStorage
    localStorage.setItem('news_theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]); // Re-runs ONLY when isDarkMode changes

  // Effect: Sync 'Read Articles' list to LocalStorage whenever it's updated
  useEffect(() => {
    localStorage.setItem('news_read_articles', JSON.stringify(readArticles));
  }, [readArticles]);

  // Effect: Sync 'Bookmarks' list to LocalStorage whenever it's updated
  useEffect(() => {
    localStorage.setItem('news_bookmarks', JSON.stringify(bookmarkedArticles));
  }, [bookmarkedArticles]);

  // Effect: Automatically re-fetch news data whenever category or country changes
  useEffect(() => {
    fetchNews();
  }, [category, country]);

  /**
   * --- DATA FETCHING & CACHING LOGIC ---
   */

  /**
   * fetchNews: Asynchronous function to retrieve articles from GNews API or cache.
   * Uses async/await syntax for cleaner asynchronous code flow.
   * @param {boolean} forceRefresh - If true, ignores the cache and makes a network request.
   */
  const fetchNews = async (forceRefresh = false) => {
    const cacheKey = `${country}-${category}`;
    const cachedData = newsCache[cacheKey];
    const cacheTTL = 10 * 60 * 1000; // 10 minute 'Time To Live' (TTL) for cache

    // CACHE CHECK: If valid cache exists and we aren't forcing a refresh, use cached data
    if (!forceRefresh && cachedData && (Date.now() - cachedData.timestamp < cacheTTL)) {
      setArticles(cachedData.data);
      setLoading(false);
      return; // Exit function early
    }

    setLoading(true); // Start loading spinner
    setError(null); // Clear previous errors
    
    try {
      // API Mapping: 'All' category maps to 'general' in GNews API
      const catParam = category === 'All' ? 'general' : category.toLowerCase();
      
      // Perform the network request using the fetch() API
      const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=${catParam}&lang=en&country=${country}&max=10&apikey=${API_KEY}`);
      
      // Check if the HTTP response status is not 200-299
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Parse the JSON body of the response
      const data = await response.json();
      
      if (data.articles) {
        // DATA CLEANUP: Remove any articles that are missing titles or URLs
        const validArticles = data.articles.filter(a => a.title && a.url);
        
        // DATA ENRICHMENT: Add unique IDs and normalize field names
        const mappedArticles = validArticles.map((article, index) => ({
          ...article, // Keep existing fields
          urlToImage: article.image, // Normalize 'image' to 'urlToImage' for component compatibility
          // Create a composite unique ID using title, index, and timestamp
          id: `${article.title.substring(0, 10)}-${index}-${Date.now()}`,
          // Randomly tag the first article as 'Breaking' for visual variety (probabilistic filter)
          isBreaking: index === 0 && Math.random() > 0.7 
        }));
        
        // Update the articles state with the processed list
        setArticles(mappedArticles);
        
        // CACHE UPDATE: Save the resulting articles to the local cache object
        setNewsCache(prev => ({
          ...prev,
          [cacheKey]: {
            data: mappedArticles,
            timestamp: Date.now()
          }
        }));
      } else {
        // Handle unexpected API response structure
        throw new Error(data.errors?.[0] || 'Failed to fetch news');
      }
    } catch (err) {
      console.warn('API Fetch failed, using dummy fallback.', err);
      
      // FALLBACK STRATEGY: Use hardcoded dummy data if the API limit is reached or network is down
      const fakeApiResponse = DUMMY_DATA.map((article, index) => ({
        ...article,
        id: `article-${index}-${Date.now()}`,
        isBreaking: index === 0 || index === 2
      }));
      setArticles(fakeApiResponse); // Show mock data to avoid empty screen
      setError('Using simulated data (API limit reached or key missing).');
    } finally {
      setLoading(false); // Stop loading spinner regardless of success or failure
    }
  };

  /**
   * --- DATA FILTERING & SORTING LOGIC ---
   */

  /**
   * getFilteredArticles: Processes the raw articles list based on user interactions.
   * Uses .filter() and .sort() array methods.
   */
  const getFilteredArticles = () => {
    let filtered = [...articles]; // Create a shallow copy to avoid mutating the original state

    // Filter by Bookmarks: Only keep articles whose titles are in the bookmarkedArticles array
    if (showBookmarksOnly) {
      filtered = filtered.filter(a => bookmarkedArticles.includes(a.title));
    }

    // Filter by Search Term (Case-insensitive)
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        a => 
          (a.title && a.title.toLowerCase().includes(lowerSearch)) || 
          (a.description && a.description.toLowerCase().includes(lowerSearch))
      );
    }

    // Sort by Date (latest vs oldest)
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortBy === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  // Execute processing logic
  const filteredArticles = getFilteredArticles();
  
  // Trending logic: Take the top 3 most recent articles from the entire set
  const trendingArticles = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  // Derived Values (computed during render)
  const totalArticles = articles.length;
  const readCount = articles.filter(a => readArticles.includes(a.title)).length;
  const unreadCount = totalArticles - readCount;

  /**
   * --- EVENT HANDLERS ---
   */
  
  // Toggle dark mode Boolean state
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  
  /**
   * toggleReadStatus: Adds or removes an article title from the 'read' list.
   * Uses the spread operator ([...prev]) to ensure state immutability.
   */
  const toggleReadStatus = (title) => {
    setReadArticles(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  // Toggle bookmark status (similar logic to read status)
  const toggleBookmark = (title) => {
    setBookmarkedArticles(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  // Toggle 'expanded' view for article descriptions
  const toggleExpand = (title) => {
    setExpandedArticles(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  /**
   * --- RENDER LAYER (JSX) ---
   * JSX is a syntax extension for JavaScript that looks like HTML.
   */
  return (
    <div className="app-container">
      {/* 1. Header component: Contains search, theme toggle, and country picker */}
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

      {/* 2. Filter Bar: Contains category buttons (e.g., Sports, Tech) and stats */}
      <FilterBar 
        category={category}
        setCategory={setCategory}
        setShowBookmarksOnly={setShowBookmarksOnly}
        totalArticles={totalArticles}
        readCount={readCount}
        unreadCount={unreadCount}
      />

      {/* 3. Action Bar: Sub-component of NewsFeed for refresh and sort order */}
      <ActionBar 
        fetchNews={fetchNews}
        loading={loading}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* 4. Global Error Notifications: Rendered conditionally using logical AND (&&) */}
      {error && (
        <div className="error-message">
          <AlertCircle size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          {error}
        </div>
      )}

      {/* 5. Trending Section: Displays the 'billboard' of latest breaking news */}
      <TrendingSection 
        trendingArticles={trendingArticles}
        loading={loading}
        error={error}
        category={category}
        searchTerm={searchTerm}
        showBookmarksOnly={showBookmarksOnly}
      />

      {/* 6. Main News Feed: Renders the grid of article cards */}
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

// Export the component as the default export so it can be imported in main.jsx
export default App;

