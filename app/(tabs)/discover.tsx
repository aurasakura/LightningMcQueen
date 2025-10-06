import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Replace YOUR_IP with your actual machine IP
const API_URL = 'http://192.168.1.29:3000/cars';

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

const FILTERS = ['All', 'Price', 'Rating', 'Most Used'] as const;
type Filter = typeof FILTERS[number];

const GAP = 12;
const CARD_W = (Dimensions.get('window').width - GAP * 3) / 2;

export default function DiscoverScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(API_URL);
        const data: Car[] = await res.json();
        setCars(data);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Filtered list based on search query and filter type
  const list = useMemo(() => {
    let base = cars.filter((c) =>
      c.title.toLowerCase().includes(q.trim().toLowerCase())
    );

    switch (filter) {
      case 'Price':
        // SHOW 4 CHEAPEST CARS
        base = [...base]
          .sort((a, b) => {
            const getPriceNumber = (priceStr: string) =>
              Number(priceStr.replace(/\D/g, '')); // removes all non-digit characters
            return getPriceNumber(a.price) - getPriceNumber(b.price);
          })
          .slice(0, 4);
        break;
      case 'Rating':
        base = [...base].sort((a, b) => b.ratings - a.ratings).slice(0, 4);
        break;
      case 'Most Used':
        base = [...base].sort((a, b) => b.usage - a.usage).slice(0, 4);
        break;
    }

    return base;
  }, [cars, q, filter]);

  if (loading) {
    return (
      <View style={s.loadingContainer}>
        <Text>Loading cars...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.wrap}>
      <View style={s.header}>
        <View style={s.avatar} />
        <TouchableOpacity style={s.refresh} onPress={() => setQ('')}>
          <Ionicons name="reload" size={18} color="#0b3b3b" />
        </TouchableOpacity>
      </View>

      <View style={s.search}>
        <Ionicons name="search" size={16} color="#9ca3af" />
        <TextInput
          placeholder="Search cars"
          placeholderTextColor="#9ca3af"
          value={q}
          onChangeText={setQ}
          style={s.input}
        />
      </View>

      <View style={s.chips}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[s.chip, f === filter && s.chipActive]}
          >
            <Text style={[s.chipTxt, f === filter && s.chipTxtActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ gap: GAP, paddingHorizontal: GAP }}
        contentContainerStyle={{ gap: GAP, paddingVertical: 14, paddingBottom: 100 }}
        renderItem={({ item }) => {
          let attributeValue: string | number;
          let attributeLabel: string;

          switch (filter) {
            case 'Price':
              attributeValue = item.price;
              break;
            case 'Rating':
              attributeValue = item.ratings;
              break;
            case 'Most Used':
              attributeValue = item.usage;
              attributeLabel = 'km';
              break;
            default:
              attributeValue = item.price;
          }

          return (
            <TouchableOpacity
              style={s.card}
              onPress={() => router.push({ pathname: '/id', params: { id: item.id, from: 'discover' } })}
            >
              <Image source={{ uri: item.image }} style={s.img} />
              <Text style={s.name}>{item.title}</Text>
              <Text style={s.price}>{attributeValue}{attributeLabel}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#4b7b8a',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  refresh: {
    position: 'absolute',
    right: 14,
    top: 18,
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    marginTop: -18,
    marginHorizontal: 14,
    backgroundColor: '#f3f4f6',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { marginLeft: 8, flex: 1, color: '#111827' },
  chips: { flexDirection: 'row', paddingHorizontal: 14, paddingTop: 10 },
  chip: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  chipTxt: { color: '#374151', fontWeight: '600', fontSize: 13 },
  chipTxtActive: { color: '#fff' },
  card: {
    width: CARD_W,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  img: {
    width: '100%',
    height: CARD_W * 0.55,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    marginBottom: 8,
  },
  name: { fontWeight: '700', color: '#111827', marginBottom: 4 },
  price: { color: '#ea580c', fontWeight: '800', fontSize: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
