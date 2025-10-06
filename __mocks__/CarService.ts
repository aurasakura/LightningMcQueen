import { Car } from '@/constants/Car';

export const mockCars: Car[] = [
  {
    id: 1,
    title: 'Tesla Model 3',
    price: '850 DKK/day',
    image: 'https://example.com/tesla.jpg',
    coords: { latitude: 55.3962, longitude: 10.3906 },
    information: 'Electric sedan with autopilot',
    mileage: '15000 km',
    seats: 5,
    ratings: 4.5,
  },
  {
    id: 2,
    title: 'Kia EV6',
    price: '975 DKK/day',
    image: 'https://example.com/kia.jpg',
    coords: { latitude: 55.3972, longitude: 10.3916 },
    information: 'Modern electric SUV',
    mileage: '12000 km',
    seats: 5,
    ratings: 4.8,
  },
  {
    id: 3,
    title: 'BMW i3',
    price: '700 DKK/day',
    image: 'https://example.com/bmw.jpg',
    coords: { latitude: 55.3952, longitude: 10.3896 },
    information: 'Compact electric car',
    mileage: '18000 km',
    seats: 4,
    ratings: 4.2,
  },
];

export const fetchCars = jest.fn(async (): Promise<Car[]> => {
  return Promise.resolve(mockCars);
});

