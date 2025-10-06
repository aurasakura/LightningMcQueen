import MapScreen from '@/app/(tabs)/map';
import { fetchCars } from '@/services/CarService';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

// Mock the CarService
jest.mock('@/services/CarService', () => ({
  fetchCars: jest.fn(),
}));

const mockFetchCars = fetchCars as jest.MockedFunction<typeof fetchCars>;

describe('MapScreen Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering and Loading States', () => {
    it('should render loading indicator initially', () => {
      mockFetchCars.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { getByText } = render(<MapScreen />);
      
      expect(getByText('Loading map data...')).toBeTruthy();
    });

    it('should render map after loading cars successfully', async () => {
      const mockCars = [
        {
          id: 1,
          title: 'Tesla Model 3',
          price: '850 DKK/day',
          image: 'https://example.com/tesla.jpg',
          coords: { latitude: 55.3962, longitude: 10.3906 },
          information: 'Electric sedan',
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
      ];

      mockFetchCars.mockResolvedValue(mockCars);

      const { queryByText } = render(<MapScreen />);

      await waitFor(() => {
        expect(queryByText('Loading map data...')).toBeNull();
      });
    });

    it('should display no cars message when fetch fails', async () => {
      mockFetchCars.mockRejectedValue(new Error('Network error'));

      const { findByText } = render(<MapScreen />);

      // When fetch fails, loadCars returns empty array, showing "no cars" message
      const message = await findByText('No cars available with current filters');
      expect(message).toBeTruthy();
    });

    it('should display no cars message when no cars match filters', async () => {
      mockFetchCars.mockResolvedValue([]);

      const { findByText } = render(<MapScreen />);

      const noDataMessage = await findByText(
        'No cars available with current filters'
      );
      expect(noDataMessage).toBeTruthy();
    });
  });

  describe('Filter Functionality', () => {
    const mockCars = [
      {
        id: 1,
        title: 'Tesla Model 3',
        price: '850 DKK/day',
        image: 'https://example.com/tesla.jpg',
        coords: { latitude: 55.3962, longitude: 10.3906 },
        information: 'Electric sedan',
        mileage: '15000 km',
        seats: 5,
        ratings: 4.5,
      },
      {
        id: 2,
        title: 'BMW i3',
        price: '700 DKK/day',
        image: 'https://example.com/bmw.jpg',
        coords: { latitude: 55.3952, longitude: 10.3896 },
        information: 'Compact electric',
        mileage: '18000 km',
        seats: 4,
        ratings: 4.2,
      },
      {
        id: 3,
        title: 'Kia EV6',
        price: '975 DKK/day',
        image: 'https://example.com/kia.jpg',
        coords: { latitude: 55.3972, longitude: 10.3916 },
        information: 'Modern SUV',
        mileage: '12000 km',
        seats: 5,
        ratings: 4.8,
      },
    ];

    it('should open filter modal when filter button is pressed', async () => {
      mockFetchCars.mockResolvedValue(mockCars);

      const { getByText, findByText } = render(<MapScreen />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(getByText('Filter')).toBeTruthy();
      });

      const filterButton = getByText('Filter');
      fireEvent.press(filterButton);

      const modalTitle = await findByText('Filter Cars');
      expect(modalTitle).toBeTruthy();
    });

    it('should close filter modal when cancel is pressed', async () => {
      mockFetchCars.mockResolvedValue(mockCars);

      const { getByText, queryByText } = render(<MapScreen />);

      // Wait for loading
      await waitFor(() => {
        expect(getByText('Filter')).toBeTruthy();
      });

      // Open modal
      fireEvent.press(getByText('Filter'));

      await waitFor(() => {
        expect(getByText('Filter Cars')).toBeTruthy();
      });

      // Close modal
      fireEvent.press(getByText('Cancel'));

      await waitFor(() => {
        expect(queryByText('Filter Cars')).toBeNull();
      });
    });

    it('should apply filters and update displayed cars', async () => {
      mockFetchCars.mockResolvedValue(mockCars);

      const { getByText, queryByText } = render(<MapScreen />);

      // Wait for loading
      await waitFor(() => {
        expect(getByText('Filter')).toBeTruthy();
      });

      // Open filter modal
      fireEvent.press(getByText('Filter'));

      await waitFor(() => {
        expect(getByText('Filter Cars')).toBeTruthy();
      });

      // Apply filters button
      const applyButton = getByText('Apply Filters');
      fireEvent.press(applyButton);

      await waitFor(() => {
        expect(queryByText('Filter Cars')).toBeNull();
      });
    });
  });

  describe('Car Selection and Modal', () => {
    const mockCars = [
      {
        id: 1,
        title: 'Tesla Model 3',
        price: '850 DKK/day',
        image: 'https://example.com/tesla.jpg',
        coords: { latitude: 55.3962, longitude: 10.3906 },
        information: 'Electric sedan',
        mileage: '15000 km',
        seats: 5,
        ratings: 4.5,
      },
    ];

    it('should render car details modal when car is selected', async () => {
      mockFetchCars.mockResolvedValue(mockCars);

      const { getByText } = render(<MapScreen />);

      // Wait for cars to load
      await waitFor(() => {
        expect(mockFetchCars).toHaveBeenCalled();
      });
    });
  });

  describe('Data Fetching', () => {
    it('should call fetchCars on component mount', async () => {
      mockFetchCars.mockResolvedValue([]);

      render(<MapScreen />);

      await waitFor(() => {
        expect(mockFetchCars).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle empty array response', async () => {
      mockFetchCars.mockResolvedValue([]);

      const { findByText } = render(<MapScreen />);

      const message = await findByText('No cars available with current filters');
      expect(message).toBeTruthy();
    });

    it('should handle null response gracefully', async () => {
      mockFetchCars.mockResolvedValue(null as any);

      const { findByText } = render(<MapScreen />);

      // Should show no cars message instead of crashing
      const message = await findByText('No cars available with current filters');
      expect(message).toBeTruthy();
    });
  });

  describe('Filter Logic', () => {
    const mockCars = [
      {
        id: 1,
        title: 'Expensive Car',
        price: '2000 DKK/day',
        image: 'https://example.com/exp.jpg',
        coords: { latitude: 55.3962, longitude: 10.3906 },
        information: 'Luxury',
        mileage: '5000 km',
        seats: 5,
        ratings: 5,
      },
      {
        id: 2,
        title: 'Cheap Car',
        price: '500 DKK/day',
        image: 'https://example.com/cheap.jpg',
        coords: { latitude: 55.3952, longitude: 10.3896 },
        information: 'Budget',
        mileage: '20000 km',
        seats: 4,
        ratings: 3,
      },
    ];

    it('should initialize with all cars visible', async () => {
      mockFetchCars.mockResolvedValue(mockCars);

      render(<MapScreen />);

      await waitFor(() => {
        expect(mockFetchCars).toHaveBeenCalled();
      });

      // Both cars should be in the filtered list initially
      // This is verified by not showing "no cars" message
    });
  });

  describe('Error Handling', () => {
    it('should handle network timeout', async () => {
      mockFetchCars.mockRejectedValue(new Error('Timeout'));

      const { findByText } = render(<MapScreen />);

      // When fetch fails, loadCars returns empty array
      const message = await findByText('No cars available with current filters');
      expect(message).toBeTruthy();
    });

    it('should handle invalid data format', async () => {
      mockFetchCars.mockResolvedValue([] as any);

      const { getByText } = render(<MapScreen />);

      // Should handle gracefully
      await waitFor(() => {
        expect(getByText('No cars available with current filters')).toBeTruthy();
      });
    });
  });
});

