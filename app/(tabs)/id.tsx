import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import carsData from '../../backend/db.json';
import emitter from '../../backend/events'; // import your emitter

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

export default function CarDetails() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [reservationVisible, setReservationVisible] = useState(false);

  useEffect(() => {
    const selectedCar = carsData.cars.find((c) => c.id === Number(id));
    setCar(selectedCar ?? null);
  }, [id]);

  if (!car) {
    return (
      <View style={styles.center}>
        <Text>Car not found</Text>
      </View>
    );
  }

  const handleRentNow = () => {
    setReservationVisible(true);

    // Emit event to add car to history
    const timestamp = new Date().toLocaleString();
    emitter.emit('reservationMade', { ...car, date: timestamp, status: 'Completed' });
  };

  const openMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${car.coords.latitude},${car.coords.longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (from) router.push(`/${from}` as any);
          else router.back();
        }}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Image source={{ uri: car.image }} style={styles.image} />
      <Text style={styles.title}>{car.title}</Text>
      <Text style={styles.price}>{car.price}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Information:</Text>
        <Text style={styles.value}>{car.information}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Mileage:</Text>
        <Text style={styles.value}>{car.mileage}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          Number of Seats: <Text style={{ fontWeight: 'normal', fontSize: 16 }}>{car.seats}</Text>
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          Ratings: <Text style={{ fontWeight: 'normal', fontSize: 16 }}>{car.ratings} ⭐</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.rentButton} onPress={handleRentNow}>
        <Text style={styles.rentButtonText}>Rent Now</Text>
      </TouchableOpacity>

      <Modal visible={reservationVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reservation Confirmed!</Text>
            <Text style={styles.modalMessage}>
              You have reserved this car for 5 minutes. Head there now and scan the QR Code on the car!
            </Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#2196F3' }]} onPress={openMaps}>
              <Text style={styles.buttonText}>Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#aaa', marginTop: 10 }]}
              onPress={() => setReservationVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#4b7b8a',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 12,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  price: {
    fontSize: 18,
    color: 'green',
    marginBottom: 16,
  },
  infoRow: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    fontWeight: 'normal',
  },
  rentButton: {
    marginTop: 20,
    backgroundColor: '#4b7b8a',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  rentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
