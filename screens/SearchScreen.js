import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Constants from '../constants/Constants';
import BottomTabBar from '../components/BottomTabBar';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [noResults, setNoResults] = useState(false);
  
  // Search function adapted to the backend code
  const fetchData = async () => {
    if (input.length > 2) {
      setIsLoading(true);
      try {
        // Create URL according to backend structure
        const url = `${Constants.SEARCH_URL}?search=${input}&page=${currentPage}`;
        console.log("Search URL:", url);
        
        // Fetch operation
        const response = await fetch(url);
        
        // Get JSON content
        const json = await response.json();
        console.log("Search results:", json);
        
        // Process response from backend - json itself contains a data property
        if (json && json.data) {
          // Process data according to API structure
          if (currentPage === 1) {
            setData(json.data);
          } else {
            setData(prev => [...prev, ...json.data]);
          }
          
          // Update pagination information
          if (json.last_page) {
            setLastPage(json.last_page);
          }
          
          setNoResults(json.data.length === 0);
        } else {
          if (currentPage === 1) {
            setData([]);
            setNoResults(true);
          }
        }
      } catch (error) {
        console.error("Search error:", error);
        if (currentPage === 1) {
          setData([]);
          setNoResults(true);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setData([]);
      setNoResults(false);
    }
  };
  
  // Search with debounce when search text changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchData();
    }, 500); // Wait 500ms - let the user finish typing
    
    return () => clearTimeout(debounceTimeout);
  }, [input, currentPage]);
  
  // Loading indicator
  const renderLoader = () => {
    return (
      isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ff7979" />
          <Text style={styles.loaderText}>Loading more games...</Text>
        </View>
      ) : null
    );
  };
  
  // Load the next page
  const loadMoreItem = () => {
    if (lastPage <= currentPage) return;
    setCurrentPage(currentPage + 1);
  };
  
  // Same design as the game card view on the home page
  const renderItem = ({ item }) => {
    // Debug message - to see what kind of data is coming
    console.log("Item to render:", item);
    
    const hasImage = item.thumbnail && item.thumbnail.length > 0;
    // Create color based on game ID
    const hue = (item.id * 37) % 360;
    const bgStyle = { backgroundColor: `hsl(${hue}, 70%, 60%)` };
    
    return (
      <TouchableOpacity 
        style={styles.gameCard}
        onPress={() => {
          navigation.navigate("Game", { gameId: item.id });
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
            <Text style={styles.gamePlaceholderText}>
              {item.title ? item.title.charAt(0).toUpperCase() : "?"}
            </Text>
          </View>
        )}
        
        <View style={styles.gameInfo}>
          <Text style={styles.gameTitle} numberOfLines={1}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ff7979" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Games</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for game name or category..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={(text) => {
            setInput(text);
            setCurrentPage(1);
          }}
          returnKeyType="search"
          onSubmitEditing={fetchData}
          autoFocus={true}
        />
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={fetchData}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.resultsContainer}>
        {isLoading && data.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff7979" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : noResults ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found</Text>
            <Text style={styles.noResultsSubText}>Try again with different keywords</Text>
          </View>
        ) : (
          data.length > 0 ? (
            <FlatList
              horizontal={false}
              contentContainerStyle={styles.resultsList}
              numColumns={2}
              columnWrapperStyle={styles.gameRow}
              ListFooterComponent={renderLoader}
              onEndReached={loadMoreItem}
              onEndReachedThreshold={0.2}
              keyExtractor={item => item.id.toString()}
              data={data}
              renderItem={renderItem}
            />
          ) : (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                {input.length > 0 ? 
                  'No games found matching your search criteria' : 
                  'Type at least 3 characters to start searching'}
              </Text>
            </View>
          )
        )}
      </View>
      
      <BottomTabBar active="search" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#FF7979',
    paddingVertical: 15,
    alignItems: 'center',
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
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginTop: 5,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButton: {
    height: 50,
    backgroundColor: '#FF7979',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    marginBottom: 70, // Alt menü için boşluk
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noResultsSubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  resultsList: {
    padding: 10,
  },
  gameRow: {
    justifyContent: 'space-between',
  },
  // Anasayfadaki ile aynı kart stilleri
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
    // Esnek genişlik: Küçük ekranlarda da uyumlu
    width: '45%',
    minWidth: 140,
    maxWidth: Dimensions.get("window").width / 2 - 16,
    // Esnek yükseklik: Ekran yüksekliğine göre değişir
    height: Dimensions.get("window").height > 700 ? 180 : 160
  },
  gameImage: {
    width: "100%",
    // Ekran boyutuna göre uyarlanmış yükseklik
    height: Dimensions.get("window").height > 700 ? 140 : 120,
    backgroundColor: "#e0e0e0"
  },
  gamePlaceholder: {
    width: "100%",
    // Ekran boyutuna göre uyarlanmış yükseklik
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
  },
  loaderContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
  loaderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
  },
  // Eskiden kalan titleContainer stili kaldırıldı - duplike
  instructionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 50,
  },
  instructionsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  }
});

export default SearchScreen;