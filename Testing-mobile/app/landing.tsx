
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';

export default function LandingPage() {
  const navigateToApp = (appType: 'citizen' | 'operator') => {
    if (appType === 'citizen') {
      router.push('/(tabs)/');
    } else if (appType === 'operator') {
      router.push('/(tabs)/operator');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* App Logo */}
        <View style={styles.iconContainer}>
          <Image 
            source={require('../assets/images/kidssafe-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>KidsSafe</Text>
        <Text style={styles.subtitle}>Hệ thống bảo vệ trẻ em</Text>
        <Text style={styles.description}>Chọn ứng dụng để bắt đầu</Text>

        {/* App Selection Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.appButton, styles.citizenButton]}
            onPress={() => navigateToApp('citizen')}
          >
            <Text style={styles.buttonIcon}>👥</Text>
            <Text style={styles.buttonText}>Ứng Dụng Công Dân</Text>
            <Text style={styles.buttonSubtext}>Báo cáo sự cố</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.appButton, styles.operatorButton]}
            onPress={() => navigateToApp('operator')}
          >
            <Text style={styles.buttonIcon}>⚙️</Text>
            <Text style={styles.buttonText}>Ứng Dụng Điều Hành</Text>
            <Text style={styles.buttonSubtext}>Quản lý hệ thống</Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Tất cả ứng dụng được tích hợp và chia sẻ dữ liệu thời gian thực
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 32,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#3b82f6',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  logoImage: {
    width: 80,
    height: 80,
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
    fontWeight: '600',
    color: '#3b82f6',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  appButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  citizenButton: {
    backgroundColor: '#3b82f6',
  },
  operatorButton: {
    backgroundColor: '#10b981',
  },
  buttonIcon: {
    fontSize: 24,
    color: 'white',
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  infoIcon: {
    marginRight: 8,
    fontSize: 16,
    color: '#3b82f6',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#3b82f6',
    textAlign: 'center',
  },
});
