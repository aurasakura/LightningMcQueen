# Testing Documentation

## Overview
This documentation describes the testing suite for the Car Rental App. Testing includes unit tests and integration tests to ensure application features work correctly.

## Test Setup

### Dependencies
Testing uses:
- **Jest**: Test runner and framework
- **React Native Testing Library**: For testing React Native components
- **jest-expo**: Jest preset for Expo apps
- **TypeScript**: Type support for tests

### Configuration Files
- `jest.setup.js`: Setup file for mocks and global configuration
- `babel.config.js`: Babel configuration for transpiling test files
- `package.json`: Jest configuration in the "jest" property

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Test Structure

### 1. Unit Tests - Map Screen (`__tests__/map.test.tsx`)

#### Testing Coverage:
- ✅ Component rendering
- ✅ Loading states
- ✅ Error handling
- ✅ Filter functionality
- ✅ Car selection and modals
- ✅ Data fetching
- ✅ Filter logic

#### Test Scenarios:

**Rendering and Loading States**
- Display loading indicator while data is being loaded
- Display map after data is successfully loaded
- Display error message when fetch fails
- Display "no cars" message when there are no cars available

**Filter Functionality**
- Open filter modal when filter button is pressed
- Close filter modal when cancel button is pressed
- Apply filters and update displayed cars
- Reset filters to default values

**Data Fetching**
- fetchCars is called on component mount
- Handle empty array response
- Handle null response gracefully

**Error Handling**
- Handle network timeout
- Handle invalid data format
- Graceful degradation on error

### 2. Integration Tests - Find More Details Flow (`__tests__/findMoreDetails.integration.test.tsx`)

#### Testing Coverage:
- ✅ Complete user flow: Map → Details → Back
- ✅ Navigation with parameters
- ✅ Data flow and state management
- ✅ User interactions on detail page
- ✅ Error handling throughout the flow

#### Test Scenarios:

**Complete User Flow**
- Navigate from map to detail page with correct parameters
- Display car details after navigation
- Display all car information fields
- Handle back navigation with "from" parameter

**Data Flow**
- Fetch and store car data
- Retrieve car from storage when viewing details
- Handle car not found scenario

**User Interactions**
- Show reservation modal when "Rent Now" is clicked
- Save car to history when renting
- Close reservation modal

**Navigation Flow**
- Pass correct car id through navigation params
- Maintain navigation context with "from" parameter

**End-to-End Scenario**
- Full journey: Map → Details → Rent → Back

## Mocks

### Service Mocks (`__mocks__/`)

**CarService.ts**
- Mock `fetchCars()` function
- Provides mock car data for testing
- Can be configured to return various responses

**Storage.ts**
- Mock `saveCarsToStorage()`
- Mock `getCarsFromStorage()`
- Simulates AsyncStorage behavior

### Global Mocks (`jest.setup.js`)

1. **AsyncStorage**: Mock for data persistence
2. **react-native-maps**: Mock MapView, Marker, Callout
3. **expo-router**: Mock useRouter, useLocalSearchParams
4. **@expo/vector-icons**: Mock Ionicons
5. **Linking**: Mock openURL
6. **@react-native-community/slider**: Mock Slider component
7. **Expo modules**: Mock __ExpoImportMetaRegistry

## Test Coverage

### Current Coverage (based on last run):

```
File                | % Stmts | % Branch | % Funcs | % Lines
--------------------|---------|----------|---------|----------
map.tsx             |   67.64 |    78.57 |   47.36 |   68.65
id.tsx              |   89.28 |    66.66 |    87.5 |   88.88
```

### Files Tested:
- ✅ `app/(tabs)/map.tsx` - Map screen with filter functionality
- ✅ `app/(tabs)/id.tsx` - Car detail screen
- ✅ `services/CarService.ts` - Car data fetching (via mocks)
- ✅ `api/Storage.ts` - Storage operations (via mocks)

## Key Features Tested

### Map Screen
1. **Initial Load**: Loading indicator → Data fetch → Display map
2. **Filter System**: 
   - Filter by price range (min/max)
   - Filter by seats
   - Filter by ratings
   - Reset filters
3. **Car Selection**: Click marker → Show modal with car details
4. **Error Handling**: Network errors, empty data, invalid data
5. **Navigation**: "Find More Details" button navigates with correct params

### Detail Screen  
1. **Data Loading**: Load car from storage based on id parameter
2. **Display**: Show all car information (title, price, image, info, mileage, seats, ratings)
3. **Rent Now**: Open reservation modal, save to history
4. **Navigation**: Back button with "from" parameter support
5. **Error Handling**: Car not found, storage errors