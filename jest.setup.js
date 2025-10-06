// Jest setup file
// @testing-library/react-native v12.4+ has built-in matchers, no need to import extend-expect

// Setup global mocks for Expo
global.__ExpoImportMetaRegistry = {};

// Mock structuredClone if not available
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    multiGet: jest.fn(() => Promise.resolve([])),
    multiSet: jest.fn(() => Promise.resolve()),
    multiRemove: jest.fn(() => Promise.resolve()),
  },
}));

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  return {
    __esModule: true,
    default: (props) => React.createElement(View, props),
    Marker: (props) => React.createElement(View, props),
    Callout: (props) => React.createElement(View, props),
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  Link: ({ children }) => children,
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  
  return {
    Ionicons: (props) => React.createElement(Text, props, props.name),
  };
});

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(() => Promise.resolve()),
}));

// Mock @react-native-community/slider
jest.mock('@react-native-community/slider', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  const MockSlider = (props) => {
    return React.createElement(View, {
      testID: props.testID || 'slider',
      onValueChange: props.onValueChange,
    });
  };
  
  return {
    __esModule: true,
    default: MockSlider,
  };
});

// Mock Expo modules
jest.mock('expo', () => ({
  ...jest.requireActual('expo'),
  __ExpoImportMetaRegistry: {},
}));

// Mock expo-linking
jest.mock('expo-linking', () => ({
  openURL: jest.fn(() => Promise.resolve()),
  createURL: jest.fn((path) => `exp://localhost/${path}`),
  useURL: jest.fn(() => null),
}));

// Suppress console warnings in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

