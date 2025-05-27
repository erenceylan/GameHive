import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const AnimatedHeader = ({ title }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Title animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false, // Set to false to avoid issues in web
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false, // Set to false to avoid issues in web
      }),
    ]).start();
    
    // Background animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 15000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  // Animated background colors
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#6c5ce7', '#a29bfe', '#6c5ce7'],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      {/* 3D Effect Waves */}
      <View style={styles.wavesContainer}>
        <Animated.View 
          style={[
            styles.wave,
            {
              transform: [
                {
                  translateX: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-width, 0],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View 
          style={[
            styles.wave2,
            {
              transform: [
                {
                  translateX: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -width],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
      
      {/* 3D Effect Title */}
      <Animated.Text 
        style={[
          styles.title,
          {
            transform: [{ translateY }],
            opacity,
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 5,
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
          }
        ]}
      >
        {title}
      </Animated.Text>
      
      {/* 3D Decorative Elements */}
      <Animated.View 
        style={[
          styles.decorElem1,
          {
            transform: [
              {
                rotate: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View 
        style={[
          styles.decorElem2,
          {
            transform: [
              {
                rotate: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['360deg', '0deg'],
                }),
              },
            ],
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 10,
    letterSpacing: 1,
  },
  wavesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
    width: width * 2,
  },
  wave2: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    width: width * 2,
  },
  decorElem1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: -30,
    right: -20,
  },
  decorElem2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -20,
    left: -20,
  },
});

export default AnimatedHeader;