/**
 * Supported news categories for the GNews API.
 * These align with the API's supported 'category' query parameter.
 * 'All' is mapped to 'general' inside App.jsx logic.
 */
export const CATEGORIES = [
  'All', 
  'World', 
  'Nation', 
  'Business', 
  'Technology', 
  'Science', 
  'Sports', 
  'Health', 
  'Entertainment'
];

/**
 * Supported countries for localized news fetching.
 * Each object contains:
 * - code: The 2-letter ISO 3166-1 alpha-2 country code used by the API.
 * - name: The human-readable display name for the UI dropdown.
 */
export const COUNTRIES = [
  { code: 'us', name: 'USA' },
  { code: 'in', name: 'India' },
  { code: 'gb', name: 'UK' },
  { code: 'au', name: 'Australia' },
  { code: 'ca', name: 'Canada' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' }
];

/**
 * Fallback data (Dummy Articles)
 * Used as a 'Safe Fallback' strategy when:
 * 1. The GNews API skip limit is reached (100 requests/day for free tier).
 * 2. The user is offline or the network request fails.
 * 3. The VITE_NEWS_API_KEY is missing from the .env file.
 */
export const DUMMY_DATA = [
  {
    title: "Global Markets Rally as Tech Stocks Surge",
    description: "Technology companies led a broad market rally today, pushing major indices to new record highs amid strong earnings reports and optimistic economic forecasts.",
    // Syntax: Using high-quality placeholder images from Unsplash
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a223680?q=80&w=800&auto=format&fit=crop",
    // Logic: Generates a real-time ISO string for publication date
    publishedAt: new Date().toISOString(),
    source: { name: "Financial Times" },
    url: "#",
    isBreaking: false
  },
  {
    title: "Breakthrough in Renewable Energy Storage",
    description: "Researchers have announced a potential major breakthrough in solid-state battery technology that could double the range of electric vehicles while halving charging times.",
    urlToImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop",
    // Logic: Current time minus 1 hour (3,600,000 milliseconds)
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: { name: "Science Daily" },
    url: "#",
    isBreaking: true
  },
  {
    title: "New AI Model Outperforms Humans in Complex Coding Tasks",
    description: "A newly released artificial intelligence model has demonstrated unprecedented capabilities in software development, successfully completing complex coding tasks.",
    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    // Logic: Current time minus 2 hours
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: { name: "TechCrunch" },
    url: "#",
    isBreaking: false
  },
  {
    title: "Championship Finals Set for This Weekend",
    description: "After a grueling playoff series, the two top teams are set to face off this Sunday in what promises to be one of the most exciting championship games.",
    urlToImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop",
    // Logic: Current time minus 24 hours (86,400,000 milliseconds)
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    source: { name: "ESPN" },
    url: "#",
    isBreaking: false
  }
];

