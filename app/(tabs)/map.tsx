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
      {pointsOfInterest.map((poi) => (
        <Marker key={poi.id} coordinate={poi.coords}>
          {/* Icon marker */}
          <Ionicons name="location" size={30} color="red" />

          {/* Popup */}
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
    elevation: 5, // Android shadow
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
