import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Text,
  RefreshControl,
  ImageBackground,
  Alert
} from "react-native";
import { Dimensions } from "react-native";
import * as Constants from "../constants/Constants";
import BottomTabBar from "../components/BottomTabBar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { addToFavorites, removeFromFavorites, isFavorite, getFavorites } from "../utils/storage";
import AdManager from '../utils/AdManager';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { ADMOB_IDS } from '../constants/Constants';

export function HomeScreen() {
  const navigation = useNavigation();
  const win = Dimensions.get("window");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteGames, setFavoriteGames] = useState([]);

  const fetchGames = (page = 1) => {
    setIsLoading(true);
    console.log(`API request for games: ${Constants.GAMES_URL}?page=${page}`);
    
    fetch(`${Constants.GAMES_URL}?page=${page}`)
      .then(response => response.json())
      .then(json => {
        if (page === 1) {
          setData(json.data || []);
        } else {
          setData([...data, ...(json.data || [])]);
        }
        setLastPage(json.last_page || 1);
        console.log(`Page ${page}: ${json.data ? json.data.length : 0} games loaded. Total: ${page === 1 ? (json.data ? json.data.length : 0) : data.length + (json.data ? json.data.length : 0)}`);
        setIsLoading(false);
        setRefreshing(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchGames(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // Reset ad session when returning to home
    AdManager.resetSession();
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        const favorites = await getFavorites();
        setFavoriteGames(favorites);
      };
      
      loadFavorites();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchGames(1);
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Children's Games</Text>
          <Text style={styles.headerSubtitle}>The best games are here!</Text>
          
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerDecoration}>
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />
            <View style={styles.decorCircle3} />
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const hasImage = item.thumbnail && item.thumbnail.length > 0;
    const hue = (item.id * 10) % 360;
    const bgStyle = hasImage ? {} : { backgroundColor: `hsl(${hue}, 80%, 70%)` };
    
    const title = item.title ? item.title.toLowerCase() : '';
    const description = item.description ? item.description.toLowerCase() : '';
    
    const isFavorited = favoriteGames.some(game => game.id === item.id);
    
    const categoryKeywords = {
      'action': ['action', 'battle', 'fight', 'shooter', 'gun', 'warrior', 'combat'],
      'puzzle': ['puzzle', 'match', 'brain', 'logic', 'solve', 'connect', 'tetris'],
      'racing': ['racing', 'race', 'car', 'drive', 'speed', 'drift', 'track'],
      'skill': ['skill', 'throw', 'jump', 'balance', 'precision', 'aim'],
      'arcade': ['arcade', 'retro', 'classic', 'score', 'coin', 'pac-man', 'platform'],
      'educational': ['learn', 'educational', 'math', 'words', 'science', 'knowledge'],
      'sport': ['sport', 'football', 'soccer', 'basketball', 'baseball', 'golf', 'tennis'],
      'quiz': ['quiz', 'question', 'trivia', 'knowledge', 'answer']
    };
    
    let foundCategory = null;
    
    Object.keys(categoryKeywords).forEach(category => {
      const keywords = categoryKeywords[category];
      for (const keyword of keywords) {
        if ((title && title.includes(keyword)) || 
            (description && description.includes(keyword))) {
          foundCategory = category;
          break;
        }
      }
    });
    
    if (!foundCategory) {
      if (item.id % 5 === 0) foundCategory = 'arcade';
      else if (item.id % 5 === 1) foundCategory = 'action';
      else if (item.id % 5 === 2) foundCategory = 'puzzle';
      else if (item.id % 5 === 3) foundCategory = 'skill';
      else foundCategory = 'sport';
    }
    
    const categoryName = foundCategory ? foundCategory.charAt(0).toUpperCase() + foundCategory.slice(1) : 'Arcade';
    
    return (
      <TouchableOpacity 
        style={styles.gameCard}
        onPress={() => {
          navigation.navigate("Game", {
            gameId: item.id
          });
        }}
      >
        {hasImage ? (
          <Image 
            source={{ uri: item.thumbnail }}
            style={styles.gameImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.gamePlaceholder, bgStyle]}>
            <Text style={styles.gamePlaceholderText}>{item.title.charAt(0)}</Text>
          </View>
        )}
        
        <View style={styles.gameInfo}>
          <Text style={styles.gameTitle} numberOfLines={2}>{item.title}</Text>
          
          <View style={styles.gameBottomRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{categoryName}</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={() => {
                  navigation.navigate("Play", {
                    gameId: item.id
                  });
                }}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.favoriteButton, isFavorited && styles.favoriteButtonActive]}
                onPress={async () => {
                  if (isFavorited) {
                    const success = await removeFromFavorites(item.id);
                    if (success) {
                      setFavoriteGames(favoriteGames.filter(game => game.id !== item.id));
                    }
                  } else {
                    const success = await addToFavorites(item);
                    if (success) {
                      setFavoriteGames([...favoriteGames, item]);
                    }
                  }
                }}
              >
                <Text style={styles.favoriteButtonIcon}>{isFavorited ? '❌' : '⭐'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLoader = () => {
    return isLoading && !refreshing ? (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color="#ff7979" />
      </View>
    ) : null;
  };

  const loadMoreItem = () => {
    if (currentPage < lastPage && !isLoading) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ff7979" barStyle="light-content" />

      {renderHeader()}

      <View style={styles.bannerContainer}>
        <BannerAd
          unitId={ADMOB_IDS.BANNER}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        numColumns={2}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={renderLoader}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6C5CE7"]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Henüz oyun bulunamadı</Text>
            </View>
          ) : null
        }
      />

      <BottomTabBar
        active="home"
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa"
  },
  header: {
    width: '100%',
    height: 150,
    backgroundColor: '#6C5CE7',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    zIndex: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    zIndex: 2,
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  settingsIcon: {
    fontSize: 24,
  },
  headerDecoration: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  decorCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: -40,
    right: -30,
  },
  decorCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -20,
    left: 20,
  },
  decorCircle3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    top: 20,
    left: -20,
  },
  list: {
    padding: 8,
    paddingBottom: 70
  },
  gameCard: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '45%',
    minWidth: 140,
    maxWidth: Dimensions.get("window").width / 2 - 16,
    height: Dimensions.get("window").height > 700 ? 180 : 160
  },
  gameImage: {
    width: "100%",
    height: Dimensions.get("window").height > 700 ? 140 : 120,
    backgroundColor: "#e0e0e0"
  },
  gamePlaceholder: {
    width: "100%",
    height: Dimensions.get("window").height > 700 ? 140 : 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0"
  },
  gamePlaceholderText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff"
  },
  gameInfo: {
    padding: 12
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    height: 40,
    marginBottom: 5,
  },
  gameBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  categoryBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#FF9F43',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 5,
  },
  playButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  favoriteButtonActive: {
    backgroundColor: '#FFE0E0',
    borderColor: '#FF9F43',
  },
  favoriteButtonIcon: {
    fontSize: 12,
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: "center"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    height: 300
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center"
  },
  bannerContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 5,
    marginBottom: 5,
  },
});