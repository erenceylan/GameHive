export const SOURCE = 'html5games'
export const API_URL = 'https://erenceylan.com/mobile_game/public/api'
export const GAMES_URL = API_URL + '/games/' + SOURCE
export const GAME_URL = API_URL + '/game/'
export const CATEGORIES_URL = API_URL + '/categories/' + SOURCE
export const CATEGORY_URL = API_URL + '/category/'
export const SEARCH_URL = API_URL + '/games/search/' + SOURCE

// Ad configuration (for future implementation)
export const AD_CONFIG = {
  INTERSTITIAL_INTERVAL: 3,
  REWARDED_INTERVAL_MINUTES: 15,
  MAX_ADS_PER_SESSION: 10,
  MIN_TIME_BETWEEN_ADS: 60,
}