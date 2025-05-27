import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomTabBar from "../components/BottomTabBar";
import { getFavorites, removeFromFavorites } from "../utils/storage";

const { width } = Dimensions.get("window");
const cardWidth = width / 2 - 20; // Measurement for 2x2 grid

export function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Function to load favorites
  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoriteGames = await getFavorites();
      setFavorites(favoriteGames);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reload favorites whenever the page is focused
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  // Refresh operation
  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  // Remove from favorites operation
  const handleRemoveFromFavorites = async (gameId) => {
    const success = await removeFromFavorites(gameId);
    if (success) {
      // Reload favorites
      loadFavorites();
    }
  };

  // Render game card
  const renderGameCard = ({ item }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => navigation.navigate("Game", { gameId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.gameImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigation.navigate("Play", { gameId: item.id })}
          >
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleRemoveFromFavorites(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF9F43" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9F43" />
          <Text style={styles.loadingText}>Loading Favorites...</Text>
        </View>
      ) : favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderGameCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.gameList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any favorite games yet</Text>
          <Text style={styles.emptySubText}>You can add games to your favorites by clicking the star icon on game pages.</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.exploreButtonText}>Explore Games</Text>
          </TouchableOpacity>
        </View>
      )}

      <BottomTabBar active="favorites" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FF9F43",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameList: {
    padding: 10,
    paddingBottom: 80, // Alt menü için boşluk
  },
  gameCard: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: cardWidth * 0.6, // 16:9 oran
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  gameImage: {
    width: "100%",
    height: "100%",
  },
  gameInfo: {
    padding: 10,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    height: 40,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  playButton: {
    backgroundColor: "#FF9F43",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flex: 1,
    marginRight: 8,
  },
  playButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  favoriteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  favoriteButtonIcon: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: "#FF9F43",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default FavoritesScreen;