import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  // Example points of interest
    const pointsOfInterest: { id: number; title: string; coords: { latitude: number; longitude: number } }[] = [
    { id: 1, title: 'Tesla Model 3', coords: { latitude: 55.3987, longitude: 10.3852 } },
    { id: 2, title: 'Nissan Leaf', coords: { latitude: 55.4021, longitude: 10.3924 } },
    { id: 3, title: 'BMW i3', coords: { latitude: 55.3945, longitude: 10.3981 } },
    { id: 4, title: 'Volkswagen ID.4', coords: { latitude: 55.3892, longitude: 10.3847 } },
    { id: 5, title: 'Hyundai Kona Electric', coords: { latitude: 55.4003, longitude: 10.3963 } },
    { id: 6, title: 'Audi e-tron', coords: { latitude: 55.3978, longitude: 10.3899 } },
    { id: 7, title: 'Polestar 2', coords: { latitude: 55.3916, longitude: 10.3815 } },
    { id: 8, title: 'Kia EV6', coords: { latitude: 55.3933, longitude: 10.3942 } },
    { id: 9, title: 'Ford Mustang Mach-E', coords: { latitude: 55.3995, longitude: 10.3876 } },
    { id: 10, title: 'Renault Zoe', coords: { latitude: 55.4012, longitude: 10.3909 } },
    ];

  // Default map center (you can adjust)
  const defaultRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.center}>
        <Text>Map is not supported on Web. Please use a mobile device.</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      mapType="terrain"
      initialRegion={defaultRegion}
    >
      {pointsOfInterest.map((poi) => (
        <Marker
          key={poi.id}
          coordinate={poi.coords}
          title={poi.title}
        >
          <Ionicons name="location" size={40} color="red" />
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
