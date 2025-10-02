import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Dimensions, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { carData } from '../../backend/_data'; // import your car data
import { useRouter } from 'expo-router';

export default function MapScreen() {
  const [selectedPoi, setSelectedPoi] = useState<typeof carData[0] | null>(null);
  const router = useRouter();

  const closeModal = () => setSelectedPoi(null);

  const openMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  return (
    <View style={{ flex: 1 }}>
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
          <Marker
            key={poi.id}
            coordinate={poi.coords}
            onPress={() => setSelectedPoi(poi)}
          >
            <Ionicons name="location" size={30} color="red" />
          </Marker>
        ))}
      </MapView>

      {/* Centered Modal */}
      <Modal
        visible={!!selectedPoi}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={closeModal} activeOpacity={1}>
          <View style={styles.modalContent}>
            {selectedPoi && (
              <>
                <Image source={selectedPoi.image} style={styles.modalImage} />

                <View style={styles.modalInfo}>
                  <Text style={styles.modalTitle}>{selectedPoi.title}</Text>
                  <Text style={styles.modalPrice}>{selectedPoi.price}</Text>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push(`/id?id=${selectedPoi.id}`)}
                  >
                    <Text style={styles.buttonText}>Find More Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#2196F3' }]}
                    onPress={() =>
                      openMaps(selectedPoi.coords.latitude, selectedPoi.coords.longitude)
                    }
                  >
                    <Text style={styles.buttonText}>Find Location</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flexDirection: 'row', // horizontal layout
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: width * 0.9,
    alignItems: 'center', // vertical center of image and text/buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  modalInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  modalPrice: {
    color: 'green',
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4b7b8a',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
