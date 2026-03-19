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
      <h1 className="header-title">
        <span style={{ fontSize: '2.5rem' }}>📰</span> NewsReader
      </h1>
      
      <div className="controls">
        {/* 2. SEARCH BAR: Updates App.jsx state via onChange event */}
        <div className="search-bar">
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search headlines..." 
            value={searchTerm}
            // Syntax: Captures every keystroke to filter articles in real-time
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* 3. BOOKMARK TOGGLE: Switches between the main feed and saved articles */}
        <button 
          // Syntax: Dynamic class assignment based on the boolean state
          className={`btn ${showBookmarksOnly ? '' : 'btn-outline'}`}
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          title="View Bookmarks"
        >
          {/* Ternary Operator: Renders different icons/text based on the state */}
          {showBookmarksOnly ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          {showBookmarksOnly ? 'Bookmarked' : 'Bookmarks'}
        </button>
        
        {/* 4. THEME TOGGLE: Switches CSS variables by updating the body class in App.jsx */}
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Dark Mode">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* 5. COUNTRY SELECTOR: Triggers a new API fetch in App.jsx when changed */}
        <select 
          className="country-select"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          title="Change Country"
          // Inline styles for quick visual adjustments (overrides CSS class if needed)
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
          {/* Mapping: Iterates through the COUNTRIES array to generate <option> tags */}
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Header;

