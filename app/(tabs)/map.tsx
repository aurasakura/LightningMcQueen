import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Dimensions, Linking, ScrollView, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import {Car} from "@/constants/Car";
import {fetchCars} from "@/services/CarService";

// Points of interest
// const pointsOfInterest: {
//   id: number;
//   title: string;
//   price: string;
//   image: any; // require local image
//   coords: { latitude: number; longitude: number };
// }[] = [
//   { id: 1, title: 'Tesla Model 3', price: '€45,000', image: require('../../assets/TeslaModel3.jpg'), coords: { latitude: 55.3987, longitude: 10.3852 } },
//   { id: 2, title: 'Nissan Leaf', price: '€32,000', image: require('../../assets/NissanLeaf.jpg'), coords: { latitude: 55.4021, longitude: 10.3924 } },
//   { id: 3, title: 'BMW i3', price: '€38,000', image: require('../../assets/BMWi3.jpeg'), coords: { latitude: 55.3945, longitude: 10.3981 } },
// //   { id: 4, title: 'Volkswagen ID.4', price: '€42,000', image: require('./assets/volkswagen.png'), coords: { latitude: 55.3892, longitude: 10.3847 } },
// //   { id: 5, title: 'Hyundai Kona Electric', price: '€36,000', image: require('./assets/hyundai.png'), coords: { latitude: 55.4003, longitude: 10.3963 } },
// //   { id: 6, title: 'Audi e-tron', price: '€70,000', image: require('./assets/audi.png'), coords: { latitude: 55.3978, longitude: 10.3899 } },
// //   { id: 7, title: 'Polestar 2', price: '€50,000', image: require('./assets/polestar.png'), coords: { latitude: 55.3916, longitude: 10.3815 } },
// //   { id: 8, title: 'Kia EV6', price: '€45,000', image: require('./assets/kia.png'), coords: { latitude: 55.3933, longitude: 10.3942 } },
// //   { id: 9, title: 'Ford Mustang Mach-E', price: '€55,000', image: require('./assets/ford.png'), coords: { latitude: 55.3995, longitude: 10.3876 } },
// //   { id: 10, title: 'Renault Zoe', price: '€30,000', image: require('./assets/renault.png'), coords: { latitude: 55.4012, longitude: 10.3909 } },
// ];
async function loadCars(): Promise<Car[]> {
  try {
    const cars = await fetchCars();
    if (!cars || !Array.isArray(cars)) {
      throw new Error("Invalid car data received");
    }
    return cars;
  } catch (error) {
    console.error("Final error loading cars:", error);
    return [];
  }
}
import { carData } from '../../backend/_data';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';

export default function MapScreen() {
  const [pointsOfInterest, setPointsOfInterest] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadCars();
        if (data) {
          setPointsOfInterest(data);
        } else {
          setPointsOfInterest([]);
        }
      } catch (err) {
        console.error("Error loading cars:", err);
        setError("Failed to load car data. Please try again later.");
        setPointsOfInterest([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 8 }}>Loading map data...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
    );
  }
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
