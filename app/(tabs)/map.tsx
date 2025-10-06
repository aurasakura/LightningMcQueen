// app/(tabs)/map.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Linking,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';

import carsData from '../../backend/db.json';
import { saveCarToHistory } from '../../api/Storage';
import emitter from '../../backend/events';

type Car = {
  id: number;
  title: string;
  price: string;
  image: string;
  coords: { latitude: number; longitude: number };
  information: string;
  mileage: string;
  seats: number;
  ratings: number;
  usage: number;
};

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [reservationVisible, setReservationVisible] = useState(false);
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('5000');
  const [minSeats, setMinSeats] = useState('1');
  const [minRatings, setMinRatings] = useState('1');

  const router = useRouter();

  useEffect(() => {
    try {
      setAllCars(carsData.cars);
      setFilteredCars(carsData.cars);
    } catch (err) {
      console.error('Error loading cars:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const openMaps = (lat: number, lng: number) => {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
  };

  const applyFilters = () => {
    const filtered = allCars.filter((car) => {
      const priceNum = parseInt(car.price.replace(/\D/g, ''), 10);
      return (
        priceNum >= parseInt(minPrice, 10) &&
        priceNum <= parseInt(maxPrice, 10) &&
        car.seats >= parseInt(minSeats, 10) &&
        car.ratings >= parseInt(minRatings, 10)
      );
    });
    setFilteredCars(filtered);
    setFilterVisible(false);
  };

  const handleRentNow = async () => {
    if (!selectedCar) return;
    try {
      setReservationVisible(true);
      await saveCarToHistory(selectedCar);
      emitter.emit('reservationMade', selectedCar);
    } catch (err) {
      console.error('Error reserving car:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading cars...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Filter Button */}
      <TouchableOpacity
        onPress={() => setFilterVisible(true)}
        style={styles.filterButton}
      >
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

      {/* Map */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 55.3962,
          longitude: 10.3906,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {filteredCars.map((car) => (
          <Marker
            key={car.id}
            coordinate={car.coords}
            onPress={() => setSelectedCar(car)}
          >
            <Ionicons name="location" size={30} color="red" />
          </Marker>
        ))}
      </MapView>

      {/* Car Modal */}
      <Modal visible={!!selectedCar} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setSelectedCar(null)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            {selectedCar && (
              <>
                <Image
                  source={{ uri: selectedCar.image }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedCar.title}</Text>
                <Text style={styles.modalPrice}>{selectedCar.price}</Text>

                {/* Only two buttons on map modal */}
                <TouchableOpacity
                  onPress={() => {
                    const carId = selectedCar.id;
                    setSelectedCar(null); // Close modal immediately
                    router.push({
                      pathname: `/id`,
                      params: { id: carId, from: 'map' },
                    });
                  }}
                  style={[styles.button, { backgroundColor: '#2196F3' }]}
                >
                  <Text style={styles.buttonText}>Find More Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    openMaps(
                      selectedCar.coords.latitude,
                      selectedCar.coords.longitude
                    )
                  }
                  style={[styles.button, { backgroundColor: '#00aaff' }]}
                >
                  <Text style={styles.buttonText}>Find Location</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>



      {/* Reservation Modal */}
      <Modal visible={reservationVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reservation Confirmed!</Text>
            <Text style={{ marginVertical: 10 }}>
              You have reserved this car. Head there now and scan the QR Code!
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (selectedCar)
                  openMaps(
                    selectedCar.coords.latitude,
                    selectedCar.coords.longitude
                  );
                setReservationVisible(false);
              }}
              style={[styles.button, { backgroundColor: '#2196F3' }]}
            >
              <Text style={styles.buttonText}>Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setReservationVisible(false)}
              style={[styles.button, { backgroundColor: '#aaa', marginTop: 10 }]}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={filterVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <Text style={styles.modalTitle}>Filter Cars</Text>
            <ScrollView>
              <Text>Min Price: {minPrice}</Text>
              <Slider
                minimumValue={0}
                maximumValue={5000}
                step={50}
                value={Number(minPrice)}
                onValueChange={(val) => setMinPrice(val.toString())}
              />
              <Text>Max Price: {maxPrice}</Text>
              <Slider
                minimumValue={0}
                maximumValue={5000}
                step={50}
                value={Number(maxPrice)}
                onValueChange={(val) => setMaxPrice(val.toString())}
              />
              <Text>Min Seats: {minSeats}</Text>
              <Slider
                minimumValue={1}
                maximumValue={8}
                step={1}
                value={Number(minSeats)}
                onValueChange={(val) => setMinSeats(val.toString())}
              />
              <Text>Min Ratings: {minRatings}</Text>
              <Slider
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={Number(minRatings)}
                onValueChange={(val) => setMinRatings(val.toString())}
              />
            </ScrollView>
            <TouchableOpacity
              onPress={applyFilters}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
  filterButtonText: { color: '#fff', fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: width * 0.9,
    alignItems: 'center',
  },
  modalImage: { width: '100%', height: 150, borderRadius: 12 },
  modalTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 4, textAlign: 'center' },
  modalPrice: { color: 'green', marginBottom: 12, fontSize: 16 },
  button: {
    backgroundColor: '#4b7b8a',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  filterModal: {
    width: width * 0.85,
    maxHeight: '80%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
  },
});
