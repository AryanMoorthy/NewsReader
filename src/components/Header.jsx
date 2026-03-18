import { Search, Sun, Moon, Bookmark, BookmarkCheck } from 'lucide-react';
import { COUNTRIES } from '../utils/constants';

/**
 * Header Component
 * Handles the application identity, search functionality, 
 * and global toggles (bookmarks, theme, country).
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
      {/* Brand Title */}
      <h1 className="header-title">
        <span style={{ fontSize: '2.5rem' }}>📰</span> NewsReader
      </h1>
      
      <div className="controls">
        {/* Search Input Field */}
        <div className="search-bar">
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search headlines..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Bookmark Toggle Button */}
        <button 
          className={`btn ${showBookmarksOnly ? '' : 'btn-outline'}`}
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          title="View Bookmarks"
        >
          {showBookmarksOnly ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          {showBookmarksOnly ? 'Bookmarked' : 'Bookmarks'}
        </button>
        
        {/* Theme Toggle Button (Light/Dark Mode) */}
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Dark Mode">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Country Selection Dropdown */}
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
  );
};

export default Header;
