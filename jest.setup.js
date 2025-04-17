// Setup file for Jest tests
import '@testing-library/jest-native/extend-expect';

// Mock Animated
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock AsyncStorage for tests
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence the warnings for React Native usage
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  ignoreLogs: jest.fn(),
})); 