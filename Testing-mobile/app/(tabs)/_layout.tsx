import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Citizen',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 28, color }}>👤</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="operator"
        options={{
          title: 'Operator',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 28, color }}>🎧</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 28, color }}>ℹ️</Text>
          ),
        }}
      />
    </Tabs>
  );
}