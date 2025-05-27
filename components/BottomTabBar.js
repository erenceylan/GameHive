import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { ADMOB_BANNER_ID } from '../constants/Constants';

const BottomTabBar = ({ active }) => {
  const navigation = useNavigation();

  // Define tab colors that match the header colors for each screen
  const tabColors = {
    home: '#6C5CE7',      // Purple for Home
    categories: '#e75cc4', // Purple for Categories
    search: '#FF7979',     // Pink/Red for Search
    favorites: '#FF9F43'   // Orange for Favorites
  };

  // Get active tab color
  const getActiveColor = (tab) => {
    return active === tab ? tabColors[tab] : '#555';
  };

  // Get active tab style
  const getActiveTabStyle = (tab) => {
    if (active === tab) {
      return {
        borderTopWidth: 3,
        borderTopColor: tabColors[tab],
        backgroundColor: `${tabColors[tab]}15` // 15% opacity background
      };
    }
    return null;
  };

  const renderAdBanner = () => {
    return (
        <View style={styles.adContainer}>
          <BannerAd
              unitId={ADMOB_BANNER_ID}
              size={BannerAdSize.FULL_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true, // GDPR için IP takibinden kaçın
              }}
              onAdLoaded={() => console.log('Banner Ad Yüklendi')}
              onAdFailedToLoad={(error) =>
                  console.error('Banner Ad Yüklenemedi:', error)
              }
          />
        </View>
    );
  };

  return (
      <SafeAreaView style={styles.wrapper}>
        {/* Reklamı menünün üstünde gösteriyoruz */}
        {renderAdBanner()}

        {/* Tab Bar */}
        <View style={styles.container}>
          <TouchableOpacity
              style={[styles.tabItem, getActiveTabStyle('home')]}
              onPress={() => navigation.navigate('Home')}
          >
            <View style={styles.iconContainer}>
              <FontAwesome name="home" size={22} color={getActiveColor('home')} />
            </View>
            <Text style={[styles.tabText, active === 'home' && { color: tabColors.home, fontWeight: 'bold' }]}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.tabItem, getActiveTabStyle('categories')]}
              onPress={() => navigation.navigate('Categories')}
          >
            <View style={styles.iconContainer}>
              <FontAwesome name="gamepad" size={22} color={getActiveColor('categories')} />
            </View>
            <Text style={[styles.tabText, active === 'categories' && { color: tabColors.categories, fontWeight: 'bold' }]}>
              Categories
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.tabItem, getActiveTabStyle('search')]}
              onPress={() => navigation.navigate('Search')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="search" size={24} color={getActiveColor('search')} />
            </View>
            <Text style={[styles.tabText, active === 'search' && { color: tabColors.search, fontWeight: 'bold' }]}>
              Search
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.tabItem, getActiveTabStyle('favorites')]}
              onPress={() => navigation.navigate('Favorites')}
          >
            <View style={styles.iconContainer}>
              <FontAwesome
                  name="star"
                  size={22}
                  color={getActiveColor('favorites')}
                  solid={active === 'favorites'}
              />
            </View>
            <Text
                style={[
                  styles.tabText,
                  active === 'favorites' && { color: tabColors.favorites, fontWeight: 'bold' }
                ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  adContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 10, // Reklamın menülerin üstünde görünmesi için
    elevation: 10, // Android destekli gölgelendirme
    paddingVertical: 5,
  },
  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10, // Android için gölge desteği
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 3,
    color: '#555',
    fontWeight: '500',
  },
});

export default BottomTabBar;