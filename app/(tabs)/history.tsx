import React, { useEffect, useState } from 'react'; 
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCarsHistoryFromStorage } from '@/api/Storage';
import { Car } from '@/constants/Car';
import emitter from '../../backend/events';

// Extend Car type to include optional status and date
interface HistoryCar extends Car {
  status?: 'Cancelled' | 'Completed';
  date?: string;
}

export default function HistoryScreen() {
  const [historyData, setHistoryData] = useState<HistoryCar[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCarsHistoryFromStorage();
      setHistoryData(data ?? []); // handle null safely
    };

    fetchData();

    // Listener for live updates
    const listener = (car: Car) => {
      const timestamp = new Date().toLocaleString();
      const newCar: HistoryCar = { ...car, date: timestamp, status: 'Completed' };
      setHistoryData(prev => [newCar, ...prev]);
    };

    emitter.addListener('reservationMade', listener);

    return () => {
      emitter.removeListener('reservationMade', listener);
    };
  }, []);

  const renderItem = ({ item }: { item: HistoryCar }) => {
    const isCancelled = item.status === 'Cancelled';
    return (
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={isCancelled ? 'car' : 'car-outline'}
            size={isCancelled ? 44 : 40}
            color="black"
          />
          {!isCancelled && (
            <Ionicons
              name="cash-outline"
              size={16}
              color="black"
              style={styles.cashIcon}
            />
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.date ?? 'N/A'}</Text>
        </View>

        <View style={styles.right}>
          <Text
            style={[
              styles.price,
              isCancelled && styles.cancelled,
            ]}
          >
            {item.price}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Activity History</Text>
      </View>

      <FlatList
        data={historyData}
        keyExtractor={(item, index) => `${item.id}-${index}-${item.date}`}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBar: {
    backgroundColor: '#2E8B8B',
    paddingTop: 40,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  iconContainer: {
    marginRight: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cashIcon: { position: 'absolute', bottom: 0, right: -2 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 12, color: '#666', marginVertical: 2 },
  right: { alignItems: 'flex-end' },
  price: { fontSize: 14, fontWeight: 'bold' },
  cancelled: { color: 'red', fontWeight: '600' },
});
