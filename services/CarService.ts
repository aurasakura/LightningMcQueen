import {Car} from "@/constants/Car";
import {getCarsFromStorage, saveCarsToStorage} from "@/api/Storage";
import axios from "axios";
const LOCAL_IP = '192.168.123.24';
const API_URL = `http://${LOCAL_IP}:3000/cars`;

export const fetchCars = async (): Promise<Car[]> => {
    try {

        // const cachedCars = await getCarsFromStorage();
        // console.log("Cached cars:", cachedCars);
        // if (cachedCars && Array.isArray(cachedCars)) return cachedCars;

        console.log("Fetching from API...");
        const response = await axios.get(API_URL);
        const cars = response.data;
        console.log("API data:", cars);

        await saveCarsToStorage(cars);
        return cars || [];
    } catch (error) {
        console.error("Failed to fetch cars:", error);
        return [];
    }
};