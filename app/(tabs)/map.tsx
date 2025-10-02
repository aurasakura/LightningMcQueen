import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { carData } from '../data'; // ✅ import from app/data.ts

export default function MapScreen() {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 55.3962,
        longitude: 10.3906,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      {carData.map((poi) => (
        <Marker key={poi.id} coordinate={poi.coords}>
          <Ionicons name="location" size={30} color="red" />

          <Callout tooltip>
            <View style={styles.callout}>
              <Image source={poi.image} style={styles.image} />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.title}>{poi.title}</Text>
                <Text style={styles.price}>{poi.price}</Text>
              </View>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  callout: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    width: 220,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  price: {
    color: 'green',
    marginTop: 4,
  },
});
