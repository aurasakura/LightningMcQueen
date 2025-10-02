import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Dimensions, Linking, ScrollView, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { carData } from '../../backend/_data';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';

export default function MapScreen() {
  const [selectedPoi, setSelectedPoi] = useState<typeof carData[0] | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredCars, setFilteredCars] = useState(carData);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minSeats, setMinSeats] = useState('');
  const [minRatings, setMinRatings] = useState('');
  const router = useRouter();

  const closeModal = () => setSelectedPoi(null);

  const openMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const applyFilters = () => {
    const filtered = carData.filter(car => {
      const priceNum = parseInt(car.price.replace(/\D/g, '')); // extract number
      const seatsNum = car.seats ?? 0;
      const ratingsNum = car.ratings ?? 0;

      return (
        (!minPrice || priceNum >= parseInt(minPrice)) &&
        (!maxPrice || priceNum <= parseInt(maxPrice)) &&
        (!minSeats || seatsNum >= parseInt(minSeats)) &&
        (!minRatings || ratingsNum >= parseInt(minRatings))
      );
    });
    setFilteredCars(filtered);
    setFilterVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 55.3962,
          longitude: 10.3906,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {filteredCars.map((poi) => (
          <Marker
            key={poi.id}
            coordinate={poi.coords}
            onPress={() => setSelectedPoi(poi)}
          >
            <Ionicons name="location" size={30} color="red" />
          </Marker>
        ))}
      </MapView>

      {/* Filter Modal */}
      <Modal visible={filterVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <Text style={styles.modalTitle}>Filter Cars</Text>
            <ScrollView>
              {/* Min Price */}
              <Text>Min Price (DKK/day): {minPrice || 0}</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={5000}
                step={50}
                value={Number(minPrice) || 0}
                onValueChange={(value) => setMinPrice(value.toString())}
                minimumTrackTintColor="#1EB1FC"
                maximumTrackTintColor="#d3d3d3"
              />

              {/* Max Price */}
              <Text>Max Price (DKK/day): {maxPrice || 0}</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={5000}
                step={50}
                value={Number(maxPrice) || 0}
                onValueChange={(value) => setMaxPrice(value.toString())}
                minimumTrackTintColor="#1EB1FC"
                maximumTrackTintColor="#d3d3d3"
              />

              {/* Min Seats */}
              <Text>Min Seats: {minSeats || 0}</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={8}
                step={1}
                value={Number(minSeats) || 1}
                onValueChange={(value) => setMinSeats(value.toString())}
                minimumTrackTintColor="#1EB1FC"
                maximumTrackTintColor="#d3d3d3"
              />

              {/* Min Ratings */}
              <Text>Min Ratings: {minRatings || 0}</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={Number(minRatings) || 1}
                onValueChange={(value) => setMinRatings(value.toString())}
                minimumTrackTintColor="#1EB1FC"
                maximumTrackTintColor="#d3d3d3"
              />
            </ScrollView>

            {/* Apply Filters */}
            <TouchableOpacity style={styles.button} onPress={applyFilters}>
              <Text style={styles.buttonText}>Apply Filters</Text>
            </TouchableOpacity>

            {/* Reset Filters */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#ff5c5c' }]}
              onPress={() => {
                setMinPrice('0');
                setMaxPrice('5000');
                setMinSeats('1');
                setMinRatings('1');
              }}
            >
              <Text style={styles.buttonText}>Reset Filters</Text>
            </TouchableOpacity>

            {/* Close Modal */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#aaa' }]}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Car Modal */}
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
                    onPress={() => {
                      closeModal();
                      router.push({ pathname: `/id`, params: { id: selectedPoi.id, from: 'map' } });
                    }}
                  >
                    <Text style={styles.buttonText}>Find More Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#2196F3' }]}
                    onPress={() => openMaps(selectedPoi.coords.latitude, selectedPoi.coords.longitude)}
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
  filterButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: '#4b7b8a',
    padding: 10,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModal: {
    width: width * 0.85,
    maxHeight: '80%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 8,
    marginVertical: 6,
  },
  modalContent: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: width * 0.9,
    alignItems: 'center',
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
