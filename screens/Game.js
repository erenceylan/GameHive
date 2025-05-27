import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Constants from "../constants/Constants";
import BottomTabBar from "../components/BottomTabBar";
import { addToFavorites, removeFromFavorites, isFavorite } from "../utils/storage";
import { Dimensions } from "react-native";

export function Game({ route }) {
  const { gameId } = route.params;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetch(Constants.GAME_URL + gameId)
        .then(response => response.json())
        .then(json => {
          if (json && json.data) {
            setGame(json.data);
            navigation.setOptions({
              title: json.data.title // Game details başlığına oyun adı atama
            });
          } else if (json && !json.data) {
            setGame(json);
            navigation.setOptions({
              title: json.title
            });
          } else {
            setError("Game data not found");
          }
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching game details:", error);
          setError("An error occurred while loading the game");
          setLoading(false);
        });

    const checkFavoriteStatus = async () => {
      const favorited = await isFavorite(gameId);
      setIsFavorited(favorited);
    };

    checkFavoriteStatus();
  }, [gameId, navigation]);

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading game details...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />

        <View style={styles.header}>
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{game.title}</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.imageContainer}>
            {game.thumbnail ? (
                <Image
                    source={{ uri: game.thumbnail }}
                    style={styles.image}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>
                    {game.title ? game.title.charAt(0).toUpperCase() : "?"}
                  </Text>
                </View>
            )}

            <TouchableOpacity
                style={[styles.favoriteButton, isFavorited && styles.favoriteButtonActive]}
                onPress={async () => {
                  if (isFavorited) {
                    const success = await removeFromFavorites(game.id);
                    if (success) {
                      setIsFavorited(false);
                      Alert.alert("Removed from Favorites", `"${game.title}" has been removed from your favorites.`);
                    }
                  } else {
                    const success = await addToFavorites(game);
                    if (success) {
                      setIsFavorited(true);
                      Alert.alert("Added to Favorites", `"${game.title}" has been added to your favorites.`);
                    }
                  }
                }}
            >
              <Text style={styles.favoriteButtonText}>
                {isFavorited ? '❌ Remove from Favorites' : '⭐ Add to Favorites'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Game Description</Text>
              <Text style={styles.description}>
                {game.description || "No description is available for this game."}
              </Text>
            </View>

            <TouchableOpacity
                style={styles.playButton}
                onPress={() => navigation.navigate("Play", { gameId: game.id })}>
              <Text style={styles.playButtonText}>PLAY GAME</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BottomTabBar activeTab="home" />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#74b9ff',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    height: Dimensions.get('window').height > 700 ? 250 : 200,
    backgroundColor: '#e0e0e0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: Dimensions.get('window').height > 700 ? 72 : 60,
    fontWeight: 'bold',
    color: '#fff',
  },
  favoriteButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  favoriteButtonActive: {
    backgroundColor: 'rgba(255, 69, 58, 0.8)',
  },
  favoriteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionContainer: {
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  playButton: {
    backgroundColor: '#74b9ff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: Math.max(150, Dimensions.get('window').height * 0.05),
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});