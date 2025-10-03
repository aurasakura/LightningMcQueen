import AsyncStorage from '@react-native-async-storage/async-storage';
import {Car} from "@/constants/Car";

const STORAGE_KEY = '@cars_data';

export const saveCarsToStorage = async (cars: Car[]) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
    } catch (e) {
        console.error('Error saving cars to storage:', e);
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