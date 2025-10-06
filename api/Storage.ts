import AsyncStorage from '@react-native-async-storage/async-storage';
import { Car } from "@/constants/Car";

const STORAGE_KEY = '@cars_data';
const HISTORY_KEY = '@car_history';

export const saveCarsToStorage = async (cars: Car[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
  } catch (e) {
    console.error('Error saving cars to storage:', e);
    throw e;
  }
};

// Save a car to history with status and timestamp
export const saveCarToHistory = async (car: Car) => {
  try {
    const current = await getCarsHistoryFromStorage();
    const history = current ?? [];

    const carWithMetadata = {
      ...car,
      status: 'Reserved',
      date: new Date().toLocaleString(),
    };

    const alreadyExists = history.some((c) => c.id === car.id);
    const newList = alreadyExists
      ? history.map((c) => (c.id === car.id ? carWithMetadata : c))
      : [carWithMetadata, ...history];

    const trimmed = newList.slice(0, 20);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Error saving car to history:', e);
    throw e;
  }
};

export const getCarsHistoryFromStorage = async (): Promise<Car[] | null> => {
  try {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error getting cars from storage:', e);
    throw e;
  }
};

export const getCarsFromStorage = async (): Promise<Car[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting cars from storage:', e);
    throw e;
  }
};
