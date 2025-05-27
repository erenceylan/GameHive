import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // Two cards per row with margin

const ModernCategoryCard = ({ category, onPress, isActive = false }) => {
  // Get the appropriate icon name based on category
  const getIconName = (categoryName) => {
    if (!categoryName) return 'gamepad';
    
    switch (categoryName.toLowerCase()) {
      case 'arcade': return 'gamepad';
      case 'action': return 'bolt';
      case 'puzzle': return 'puzzle-piece';
      case 'skill': return 'bullseye';
      case 'girls': return 'heart';
      case 'quiz': return 'question-circle';
      case 'math': return 'calculator';
      case 'brain': return 'brain';
      case 'sports': return 'futbol';
      case 'strategy': return 'chess';
      case 'racing': return 'car';
      case 'words': return 'font';
      case 'multiplayer': return 'users';
      case 'drawing': return 'paint-brush';
      case 'adventure': return 'mountain';
      case 'music': return 'music';
      default: return 'gamepad';
    }
  };
  
  // Generate color based on category ID
  const getCardColor = (id) => {
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
  
  const backgroundColor = getCardColor(category.id);
  const iconName = getIconName(category.title || category.name);
  const categoryName = category.title || category.name || 'Game';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor },
        isActive && styles.activeContainer
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome5 
          name={iconName} 
          size={30} 
          color="#FFFFFF" 
          style={styles.icon}
        />
      </View>
      
      {/* Category Name */}
      <Text style={styles.title}>{categoryName}</Text>
      
      {/* Decorative Elements */}
      <View style={styles.decoration1} />
      <View style={styles.decoration2} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: 120,
    margin: 8,
    borderRadius: 16,
    padding: 16,
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
  activeContainer: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    transform: [{ scale: 1.03 }]
  },
  iconContainer: {
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
  icon: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  decoration1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    top: -30,
    right: -30,
  },
  decoration2: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    bottom: -20,
    left: -20,
  }
});

export default ModernCategoryCard;