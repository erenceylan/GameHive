export const SOURCE = 'html5games'
export const API_URL = 'https://erenceylan.com/mobile_game/public/api'
export const GAMES_URL = API_URL + '/games/' + SOURCE
export const GAME_URL = API_URL + '/game/'
export const CATEGORIES_URL = API_URL + '/categories/' + SOURCE
export const CATEGORY_URL = API_URL + '/category/'
export const SEARCH_URL = API_URL + '/games/search/' + SOURCE

// AdMob IDs - Replace with your actual IDs in production
export const ADMOB_IDS = {
  BANNER: "ca-app-pub-3940256099942544/6300978111", // Test Banner ID
  INTERSTITIAL: "ca-app-pub-3940256099942544/1033173712", // Test Interstitial ID
  REWARDED: "ca-app-pub-3940256099942544/5224354917", // Test Rewarded ID
  NATIVE: "ca-app-pub-3940256099942544/2247696110", // Test Native ID
};

// AdMob Configuration
export const ADMOB_CONFIG = {
  // Show interstitial after every X game plays
  INTERSTITIAL_INTERVAL: 3,
  
  // Show rewarded ad option after X minutes of gameplay
  REWARDED_INTERVAL_MINUTES: 15,
  
  // Maximum ads per session
  MAX_ADS_PER_SESSION: 10,
  
  // Minimum time between ads (in seconds)
  MIN_TIME_BETWEEN_ADS: 60,
};