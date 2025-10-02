// app/(tabs)/_layout.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Tabs, useSegments, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  const segments = useSegments();
  const activeTab = segments[segments.length - 1];
  const router = useRouter();

  const buttons = [
    { name: 'discover', label: 'Discover', icon: 'compass-outline' },
    { name: 'history', label: 'History', icon: 'time-outline' },
    { name: 'map', label: 'Map', icon: 'map-outline' },
    { name: 'favorites', label: 'Favorites', icon: 'heart-outline' },
    { name: 'profile', label: 'Profile', icon: 'person-outline' },
  ] as const;

  return (
    <View style={{ flex: 1 }}>
      {/* Tabs navigator with hidden tab bar */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="discover" />
        <Tabs.Screen name="history" />
        <Tabs.Screen name="map" />
        <Tabs.Screen name="favorites" />
        <Tabs.Screen name="profile" />
      </Tabs>

      {/* Custom footer */}
      <View style={styles.footer}>
        {buttons.map((btn) => {
          const isActive = btn.name === activeTab;
          return (
            <TouchableOpacity
              key={btn.name}
              style={styles.button}
              onPress={() => {
                if (activeTab !== btn.name) {
                  // React Native: use router.replace to switch instantly
                  router.replace(`/(tabs)/${btn.name}`);
                }
              }}
            >
              <Ionicons
                name={btn.icon}
                size={28}
                color={isActive ? '#ffdd59' : '#fff'}
              />
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {btn.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#4b7b8a',
    paddingVertical: Platform.OS === 'ios' ? 18 : 14,
    height: 80,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: { alignItems: 'center' },
  label: { color: '#fff', fontSize: 12, marginTop: 4 },
  activeLabel: { color: '#ffdd59', fontWeight: 'bold' },
});
