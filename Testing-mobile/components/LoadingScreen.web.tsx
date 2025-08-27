
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: false,
      }),
    ]).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // Complete loading after 2.5 seconds
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.logoContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <Animated.View style={[
          styles.iconWrapper,
          { transform: [{ rotate }] }
        ]}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🛡️</Text>
          </View>
        </Animated.View>
        
        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
          KidsSafe
        </Animated.Text>
        
        <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
          Hệ thống bảo vệ trẻ em
        </Animated.Text>

        <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
          Đang khởi tạo...
        </Animated.Text>
      </Animated.View>

      <View style={styles.loadingIndicator}>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 40,
    color: '#3b82f6',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: 100,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});
