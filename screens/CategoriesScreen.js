import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Constants from '../constants/Constants';
import BottomTabBar from '../components/BottomTabBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');
const cardWidth = (width - 50) / 2; // Two cards per row with margin

export function CategoriesScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Route parameters
  const selectedCategoryId = route.params?.categoryId;
  const selectedCategoryTitle = route.params?.categoryTitle;

  const [selectedCategory, setSelectedCategory] = useState(selectedCategoryId);
  const [showingCategoryGames, setShowingCategoryGames] = useState(!!selectedCategoryId);
  const [categoryTitle, setCategoryTitle] = useState(selectedCategoryTitle || "Categories");

  // State for getting categories from API
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for category games
  const [categoryGames, setCategoryGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch games when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryGames(1);
      setCurrentPage(1);
      setShowingCategoryGames(true);
    }
  }, [selectedCategory]);

  // Fetch categories from API
  const fetchCategories = () => {
    setIsLoading(true);

    fetch(Constants.CATEGORIES_URL)
      .then(response => response.json())
      .then(json => {
        console.log("Categories from API:", json);

        if (json && Array.isArray(json)) {
          // API returned categories directly as an array
          setCategories(json);
        } else if (json && json.data && Array.isArray(json.data)) {
          // Get categories from API (inside data)
          setCategories(json.data);
        } else {
          // Default categories in case of error
          setCategories([
            { id: 1, title: 'Arcade' },
            { id: 2, title: 'Action' },
            { id: 3, title: 'Puzzle' },
            { id: 4, title: 'Skill' },
            { id: 5, title: 'Girls' },
            { id: 6, title: 'Quiz' },
            { id: 7, title: 'Math' },
            { id: 8, title: 'Brain' },
            { id: 9, title: 'Sports' },
            { id: 10, title: 'Strategy' }
          ]);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
        // Default categories in case of error
        setCategories([
          { id: 1, title: 'Arcade' },
          { id: 2, title: 'Action' },
          { id: 3, title: 'Puzzle' },
          { id: 4, title: 'Skill' },
          { id: 5, title: 'Girls' },
          { id: 6, title: 'Quiz' },
          { id: 7, title: 'Math' },
          { id: 8, title: 'Brain' },
          { id: 9, title: 'Sports' },
          { id: 10, title: 'Strategy' }
        ]);
        setIsLoading(false);
      });
  };

  // Get all category games at once
  const fetchCategoryGames = (page = 1) => {
    if (!selectedCategory) return;

    setGamesLoading(true);
    console.log(`API request for category games: ${Constants.CATEGORY_URL}${selectedCategory}?page=${page}`);

    // If it's the first page, clear the categories first
    if (page === 1) {
      setCategoryGames([]);
    }

    fetch(`${Constants.CATEGORY_URL}${selectedCategory}?page=${page}`)
      .then(response => response.json())
      .then(json => {
        // Check API structure and get data accordingly
        let gamesList = [];
        let lastPageNum = 1;

        if (json && json.data && Array.isArray(json.data)) {
          // Response containing simple data array
          gamesList = json.data;
          lastPageNum = json.last_page || 1;
        } else if (json && json.games && json.games.data && Array.isArray(json.games.data)) {
          // Response containing nested games.data structure
          gamesList = json.games.data;
          lastPageNum = json.games.last_page || 1;
        }

        console.log(`Category ${selectedCategory} Page ${page}: ${gamesList.length} games loaded`);

        // New data access approach
        if (page === 1) {
          // On the first page, completely replace the data
          setCategoryGames(gamesList);
        } else {
          // On subsequent pages, filter by unique IDs
          setCategoryGames(prevGames => {
            // Collect IDs of existing games
            const existingIds = new Set();
            prevGames.forEach(game => existingIds.add(game.id));

            // Filter non-repeating games
            const uniqueGames = gamesList.filter(game => !existingIds.has(game.id));

            // Add unique new games
            return [...prevGames, ...uniqueGames];
          });
        }

        setLastPage(lastPageNum);
        setGamesLoading(false);
        setRefreshing(false);
      })
      .catch(error => {
        console.error("Error fetching category games:", error);
        setGamesLoading(false);
        setRefreshing(false);
      });
  };

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchCategoryGames(1);
  };

  // Load more games
  const loadMoreCategoryGames = () => {
    if (gamesLoading || currentPage >= lastPage) return;
    setCurrentPage(prevPage => prevPage + 1);
    fetchCategoryGames(currentPage + 1);
  };

  // Get the appropriate icon for each category
  const getCategoryIcon = (categoryName, categoryId) => {
    if (!categoryName) return 'gamepad';

    // Simple, more consistent mapping of category names to icons
    const categoryIcons = {
      'arcade': 'gamepad',
      'action': 'running',
      'puzzle': 'puzzle-piece',
      'skill': 'hand-paper',
      'girls': 'heart',
      'quiz': 'question',
      'math': 'calculator',
      'brain': 'brain',
      'sports': 'futbol',
      'strategy': 'chess',
      'racing': 'car',
      'words': 'font',
      'multiplayer': 'users',
      'drawing': 'paint-brush',
      'adventure': 'mountain',
      'music': 'music',
      'board': 'chess-board',
      'card': 'address-card',
      'casual': 'smile',
      'educational': 'book',
      'platform': 'street-view',
      'rpg': 'dragon',
      'shooting': 'crosshairs',
      'simulation': 'plane',
      'tower': 'chess-rook',
      'defense': 'shield-alt',
      'hyper': 'bolt',
      'mmo': 'users',
      'ar': 'mobile',
      '3d': 'cube',
      '2d': 'square',
      'kids': 'child',
      'family': 'home',
      'classic': 'star',
      'retro': 'gamepad',
    };

    // Try to get the icon by exact match
    const lowerCaseName = categoryName.toLowerCase();
    if (categoryIcons[lowerCaseName]) {
      return categoryIcons[lowerCaseName];
    }

    // If no exact match, try to find partial matches
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (lowerCaseName.includes(key)) {
        return icon;
      }
    }

    // If still no match, use ID-based fallbacks to ensure every category has a unique icon
    // Using simpler, more widely-supported FontAwesome icons
    const fallbackIcons = [
      'gamepad', 'star', 'heart', 'smile', 'trophy',
      'flag', 'puzzle-piece', 'car', 'music', 'futbol',
      'book', 'crown', 'rocket', 'ghost', 'fire'
    ];

    return fallbackIcons[(categoryId || 0) % fallbackIcons.length];
  };

  // Get color for category based on ID
  const getCategoryColor = (id) => {
    const colors = [
      '#FF6B6B', // Red
      '#FF9F43', // Orange
      '#54A0FF', // Blue
      '#5F27CD', // Purple
      '#FF78C5', // Pink
      '#1DD1A1', // Green
      '#FECA57', // Yellow
      '#FF5252', // Red
      '#00B0FF', // Light blue
      '#9C27B0', // Dark purple
      '#2ECC71', // Green
    ];

    return colors[id % colors.length];
  };

  // Render a category card
  const renderCategoryItem = ({ item }) => {
    const color = getCategoryColor(item.id);
    const iconName = getCategoryIcon(item.title, item.id);

    return (
      <TouchableOpacity
        style={[styles.categoryCard, { backgroundColor: color }]}
        onPress={() => handleCategorySelect(item.id, item.title)}
        activeOpacity={0.85}
      >
        <View style={styles.categoryIconContainer}>
          <FontAwesome name={iconName} size={28} color="#FFFFFF" />
        </View>
        <Text style={styles.categoryTitle}>{item.title}</Text>

        {/* Decorative elements */}
        <View style={styles.categoryDecoration1} />
        <View style={styles.categoryDecoration2} />
      </TouchableOpacity>
    );
  };

  // Modern game card rendering
  const renderGameItem = ({ item }) => {
    // If there's no image URL, create a colorful background
    const hasImage = item.thumbnail && item.thumbnail.length > 0;
    const hue = (item.id * 37) % 360; // Use prime number for better distribution
    const bgStyle = hasImage ? {} : { backgroundColor: `hsl(${hue}, 80%, 70%)` };

    return (
      <TouchableOpacity
        style={styles.gameCard}
        onPress={() => navigation.navigate("Game", { gameId: item.id })}
        activeOpacity={0.85}
      >
        <View style={styles.imageContainer}>
          {hasImage ? (
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.gameImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.gameImage, bgStyle, styles.imagePlaceholder]}>
              <Text style={styles.gameImagePlaceholderText}>
                {item.title.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          )}

          {/* Play Button Overlay */}
          <View style={styles.playOverlay}>
            <TouchableOpacity
              style={styles.playIconButton}
              onPress={() => navigation.navigate("Play", { gameId: item.id })}
            >
              <FontAwesome name="play" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.gameInfo}>
          <Text style={styles.gameTitle} numberOfLines={2}>{item.title}</Text>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigation.navigate("Play", { gameId: item.id })}
          >
            <Text style={styles.playButtonText}>Play Now</Text>
            <FontAwesome name="play-circle" size={14} color="#FFFFFF" style={styles.playButtonIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Category selection handler
  const handleCategorySelect = (categoryId, categoryTitle) => {
    setSelectedCategory(categoryId);
    setCategoryTitle(categoryTitle);
    fetchCategoryGames(1);
  };

  // Empty render function for category header (removed as requested)
  const renderCategoryHeader = () => null;

  // Render games header
  const renderGamesHeader = () => (
    <View style={styles.gamesHeaderContainer}>
      <Text style={styles.gamesHeaderTitle}>{categoryTitle} Games</Text>
      <FontAwesome
        name={getCategoryIcon(categoryTitle, selectedCategory)}
        size={22}
        color="#6C5CE7"
        style={styles.gamesHeaderIcon}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6C5CE7" barStyle="light-content" />

      {/* Modern Header */}
      <View style={styles.header}>
        {showingCategoryGames && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setSelectedCategory(null);
              setShowingCategoryGames(false);
              setCategoryTitle("Categories");
              setCategoryGames([]);
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{categoryTitle}</Text>

        {/* Decorative elements */}
        <View style={styles.headerDecoration1} />
        <View style={styles.headerDecoration2} />
      </View>

      {/* Loading state */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C5CE7" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : showingCategoryGames ? (
        // Modern games grid
        <FlatList
          data={categoryGames}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.gameList}
          ListHeaderComponent={renderGamesHeader}
          ListFooterComponent={
            gamesLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color="#6C5CE7" />
                <Text style={styles.loaderText}>Loading more games...</Text>
              </View>
            ) : null
          }
          onEndReached={loadMoreCategoryGames}
          onEndReachedThreshold={0.2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#6C5CE7"]}
            />
          }
          ListEmptyComponent={
            !gamesLoading ? (
              <View style={styles.emptyContainer}>
                <FontAwesome name="sad-tear" size={50} color="#CCCCCC" style={styles.emptyIcon} />
                <Text style={styles.emptyText}>No games found in this category</Text>
                <Text style={styles.emptySubText}>Try another category!</Text>
              </View>
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6C5CE7" />
                <Text style={styles.loadingText}>Loading games...</Text>
              </View>
            )
          }
        />
      ) : (
        // Modern category grid
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.categoryList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderCategoryHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchCategories()}
              colors={["#6C5CE7"]}
            />
          }
        />
      )}

      {/* Bottom Menu */}
      <BottomTabBar active="categories" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Modern Header
  header: {
    backgroundColor: '#6C5CE7',
    padding: 18,
    paddingTop: Platform.OS === 'android' ? 22 : 18,
    paddingBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'relative',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 4,
  },
  headerIconContainer: {
    position: 'absolute',
    left: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDecoration1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -30,
    right: -30,
  },
  headerDecoration2: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -20,
    left: -20,
  },

  // Category List
  categoryList: {
    paddingHorizontal: 10,
    paddingBottom: 80, // Space for bottom menu
    paddingTop: 10,
  },
  categoryHeaderContainer: {
    width: width - 40,
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 5,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(108, 92, 231, 0.2)',
  },
  categoryHeaderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginBottom: 4,
  },
  categoryHeaderSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  categoryCard: {
    width: cardWidth,
    height: 120,
    margin: 8,
    borderRadius: 18,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  categoryDecoration1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    top: -30,
    right: -30,
  },
  categoryDecoration2: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    bottom: -20,
    left: -20,
  },

  // Games List
  gameList: {
    paddingHorizontal: 10,
    paddingBottom: 80, // Space for bottom menu
    paddingTop: 10,
  },
  gamesHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 40,
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(108, 92, 231, 0.2)',
  },
  gamesHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginRight: 8,
  },
  gamesHeaderIcon: {
    marginLeft: 5,
  },
  gameCard: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  imageContainer: {
    width: '100%',
    height: cardWidth * 0.62, // Aspect ratio for game images
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameImagePlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  playOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  playIconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(108, 92, 231, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  gameInfo: {
    padding: 12,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    height: 40, // Fixed height for two lines
    color: '#333',
  },
  playButton: {
    flexDirection: 'row',
    backgroundColor: '#6C5CE7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 5,
  },
  playButtonIcon: {
    marginLeft: 3,
  },

  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50, // Adjust for bottom tab
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  loaderContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loaderText: {
    marginTop: 10,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 300,
  },
  emptyIcon: {
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default CategoriesScreen;