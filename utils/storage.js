import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing favorite games
const FAVORITES_STORAGE_KEY = 'FAVORITE_GAMES';

/**
 * Gets favorite games from AsyncStorage
 * @returns {Promise<Array>} List of favorite games
 */
export const getFavorites = async () => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    return favoritesJson != null ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Adds a game to favorites
 * @param {Object} game Game to be added as favorite
 * @returns {Promise<boolean>} Whether the operation was successful
 */
export const addToFavorites = async (game) => {
  try {
    const favorites = await getFavorites();
    
    // Check if the game is already in favorites
    const isAlreadyFavorite = favorites.some(favGame => favGame.id === game.id);
    
    if (!isAlreadyFavorite) {
      const newFavorites = [...favorites, game];
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      console.log('Game added to favorites:', game.title);
      return true;
    }
    
    return false; // Already in favorites
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

/**
 * Removes a game from favorites
 * @param {number} gameId ID of the game to be removed
 * @returns {Promise<boolean>} Whether the operation was successful
 */
export const removeFromFavorites = async (gameId) => {
  try {
    const favorites = await getFavorites();
    const newFavorites = favorites.filter(game => game.id !== gameId);
    
    if (favorites.length !== newFavorites.length) {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      console.log('Game removed from favorites, ID:', gameId);
      return true;
    }
    
    return false; // Not found in favorites
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

/**
 * Checks if a game is in favorites
 * @param {number} gameId Game ID to check
 * @returns {Promise<boolean>} Favorite status
 */
export const isFavorite = async (gameId) => {
  try {
    const favorites = await getFavorites();
    return favorites.some(game => game.id === gameId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};