import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import * as Constants from '../../constants/Constants';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Function to get the appropriate icon for each category
const getCategoryIcon = (categoryName) => {
  let iconName = 'gamepad';
  let iconColor = '#FFFFFF';
  let iconSize = 20;
  
  if (!categoryName) return <FontAwesome5 name={iconName} size={iconSize} color={iconColor} />;
  
  switch (categoryName.toLowerCase()) {
    case 'arcade':
      iconName = 'gamepad';
      break;
    case 'action':
      iconName = 'bolt';
      break;
    case 'puzzle':
      iconName = 'puzzle-piece';
      break;
    case 'skill':
      iconName = 'bullseye';
      break;
    case 'girls':
      iconName = 'heart';
      break;
    case 'quiz':
      iconName = 'question-circle';
      break;
    case 'math':
      iconName = 'calculator';
      break;
    case 'brain':
      iconName = 'brain';
      break;
    case 'sports':
      iconName = 'futbol';
      break;
    case 'strategy':
      iconName = 'chess';
      break;
    case 'racing':
      iconName = 'car';
      break;
    case 'words':
      iconName = 'font';
      break;
    case 'multiplayer':
      iconName = 'users';
      break;
    case 'drawing':
      iconName = 'paint-brush';
      break;
    case 'adventure':
      iconName = 'mountain';
      break;
    case 'music':
      iconName = 'music';
      break;
    default:
      iconName = 'gamepad';
  }
  
  return <FontAwesome5 name={iconName} size={iconSize} color={iconColor} />;
};

const CategoryCard = ({ category, onPress, isSelected }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Category name (will come from API)
  const categoryTitle = category.title || category.name;
  
  // Category-based colors (modern and vibrant colors)
  let bgColor;
  
  // Determine color based on category ID or title
  if (category.title) {
    // Category from API
    switch (category.title.toLowerCase()) {
      case 'arcade':
        bgColor = '#FF6B6B'; // Vibrant red
        break;
      case 'action':
        bgColor = '#FF9F43'; // Orange
        break;
      case 'puzzle':
        bgColor = '#54A0FF'; // Blue
        break;
      case 'skill':
        bgColor = '#5F27CD'; // Purple
        break;
      case 'girls':
        bgColor = '#FF78C5'; // Pink
        break;
      case 'quiz':
        bgColor = '#1DD1A1'; // Green
        break;
      case 'math':
        bgColor = '#FECA57'; // Yellow
        break;
      case 'racing':
        bgColor = '#FF5252'; // Red
        break;
      case 'strategy':
        bgColor = '#00B0FF'; // Light blue
        break;
      case 'brain':
        bgColor = '#9C27B0'; // Dark purple
        break;
      case 'sports':
        bgColor = '#2ECC71'; // Green
        break;
      case 'words':
        bgColor = '#3498DB'; // Blue
        break;
      case 'multiplayer':
        bgColor = '#F39C12'; // Amber
        break;
      case 'drawing':
        bgColor = '#F06292'; // Pink
        break;
      case 'adventure':
        bgColor = '#26C6DA'; // Turquoise
        break;
      case 'music':
        bgColor = '#7E57C2'; // Purple
        break;
      default:
        // Random color for other categories
        const hue = (category.id * 40) % 360;
        bgColor = `hsl(${hue}, 80%, 65%)`;
    }
  } else {
    // Fallback for local categories
    const hue = typeof category.id === 'number' 
      ? (category.id * 40) % 360
      : (category.id?.toString().charCodeAt(0) * 40) % 360 || 0;
    bgColor = `hsl(${hue}, 80%, 65%)`;
  }

  // Animation effect for selected categories
  useEffect(() => {
    if (isSelected) {
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Animated.View 
        style={[
          styles.container,
          { backgroundColor: bgColor },
          isSelected && styles.selectedContainer,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        {/* Modern Category Card Content */}
        <View style={styles.contentContainer}>
          {/* Category Icon */}
          <View style={styles.iconContainer}>
            {getCategoryIcon(categoryTitle)}
          </View>
          
          {/* Category Name */}
          <Text style={styles.categoryName} numberOfLines={1} ellipsizeMode="tail">
            {categoryTitle}
          </Text>
        </View>
        
        {/* Decorative Elements */}
        <View style={[styles.decoration, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
        <View style={[styles.decoration2, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // Dynamic width based on screen width
    width: width <= 320 ? width * 0.42 : width * 0.44,
    // Dynamic height based on screen height
    height: Dimensions.get('window').height <= 640 ? 90 : 100,
    margin: 6,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 7,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  selectedContainer: {
    borderWidth: 2.5,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 9,
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'relative',
    zIndex: 2,
  },
  iconContainer: {
    // Modern glass effect design
    width: Dimensions.get('window').height <= 640 ? 42 : 48,
    height: Dimensions.get('window').height <= 640 ? 42 : 48,
    borderRadius: Dimensions.get('window').height <= 640 ? 21 : 24,
    backgroundColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  iconText: {
    // Larger, cleaner font
    fontSize: Dimensions.get('window').height <= 640 ? 20 : 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  categoryName: {
    color: '#FFF',
    fontWeight: '700',
    // Larger font size for better readability
    fontSize: Dimensions.get('window').width <= 360 ? 14 : 16,
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.3,
    // Modern text shadow
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // Enhanced decorative elements
  decoration: {
    position: 'absolute',
    width: Dimensions.get('window').width <= 360 ? 80 : 90,
    height: Dimensions.get('window').width <= 360 ? 80 : 90,
    borderRadius: Dimensions.get('window').width <= 360 ? 40 : 45,
    right: -25,
    top: -25,
    opacity: 0.8,
  },
  decoration2: {
    position: 'absolute',
    width: Dimensions.get('window').width <= 360 ? 60 : 70,
    height: Dimensions.get('window').width <= 360 ? 60 : 70,
    borderRadius: Dimensions.get('window').width <= 360 ? 30 : 35,
    left: -15,
    bottom: -15,
    opacity: 0.7,
  }
});

export default CategoryCard;