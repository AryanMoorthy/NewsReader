/**
 * Supported news categories for the GNews API.
 * These align with the API's supported category parameters.
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
 * Each object contains a country code and a display name.
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
 * Fallback data used when the API limit is reached or the key is missing.
 * Provides a consistent UI experience even during outages.
 */
export const DUMMY_DATA = [
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
