import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import cars from '../../backend/db.json'; 
import { Car } from '@/constants/Car'; 

export default function FavoritesScreen() {
  const router = useRouter();

  const favoritesData: Car[] = cars.cars.filter((car: Car) => car.id >= 1 && car.id <= 4);

  const renderItem = ({ item }: { item: Car }) => (  
    <View style={styles.card}>
      <Ionicons name="car-outline" size={40} color="black" style={styles.carIcon} />

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>
          🚗 {item.seats} seats   ⭐ {item.ratings} rating   📍{item.usage} km
        </Text>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/map',
              params: { lat: item.coords.latitude, lng: item.coords.longitude },
            })
          }
        >
          <Text style={styles.link}>See Locations Near You →</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.price}>{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Favorites</Text>
      </View>

      <FlatList
        data={favoritesData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    backgroundColor: '#2E8B8B',
    paddingTop: 40,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  carIcon: {
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginVertical: 3,
  },
  link: {
    fontSize: 13,
    color: '#007b83',
    fontWeight: '500',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
