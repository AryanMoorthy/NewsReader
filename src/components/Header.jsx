import { Search, Sun, Moon, Bookmark, BookmarkCheck } from 'lucide-react'; // Icon library for visual elements
import { COUNTRIES } from '../utils/constants'; // Predefined list of supported countries

/**
 * Header Component: The top navigation bar of the application.
 * 
 * Props (Destructured):
 * @param {string} searchTerm - The current search query string from App.jsx state.
 * @param {function} setSearchTerm - Function to update the search query.
 * @param {boolean} showBookmarksOnly - Toggle state for bookmark view.
 * @param {function} setShowBookmarksOnly - Function to toggle bookmark view.
 * @param {boolean} isDarkMode - Current theme state.
 * @param {function} toggleTheme - Function to switch between light and dark modes.
 * @param {string} country - Current selected country code (e.g., 'us', 'in').
 * @param {function} setCountry - Function to update the selected country.
 */
const Header = ({ 
  searchTerm, 
  setSearchTerm, 
  showBookmarksOnly, 
  setShowBookmarksOnly, 
  isDarkMode, 
  toggleTheme, 
  country, 
  setCountry 
}) => {
  return (
    <header className="header">
      {/* 1. BRAND IDENTITY Section */}
      <div className="header-title">
        <span style={{ fontSize: '2rem' }}>🌐</span> NewsFeed
      </div>
      
      <div className="controls">
        {/* 2. SEARCH BAR: Updates App.jsx state via onChange event */}
        <div className="search-bar">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search fresh news..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* 3. BOOKMARK TOGGLE: Switches between the main feed and saved articles */}
        <button 
          className={`icon-btn ${showBookmarksOnly ? 'active' : ''}`}
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          title={showBookmarksOnly ? "Show All News" : "Show Bookmarks"}
        >
          {showBookmarksOnly ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
        
        {/* 4. THEME TOGGLE: Switches CSS variables by updating the body class in App.jsx */}
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* 5. COUNTRY SELECTOR: Styled wrapper for the native select */}
        <div className="select-wrapper">
          <select 
            className="sort-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            title="Change Country"
          >

            {/* Mapping: Iterates through the COUNTRIES array to generate <option> tags */}
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
    </header>

  );
};

export default Header;

