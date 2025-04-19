// Setup file for Jest tests
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage for tests
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

// Silence React Native warnings
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  ignoreLogs: jest.fn(),
}));

// Basic mocks for React Native components and modules
jest.mock('react-native', () => {
  return {
    NativeModules: {
      UIManager: {
        RCTView: () => {},
      },
      SettingsManager: {},
    },
    NativeAnimatedModule: {},
    Text: jest.fn().mockImplementation(() => null),
    TextInput: jest.fn().mockImplementation(() => null),
    View: jest.fn().mockImplementation(() => null),
    TouchableOpacity: jest.fn().mockImplementation(() => null),
  };
});

// Clean up timers after each test
afterEach(() => {
  jest.clearAllTimers();
});

// Restore real timers when all tests are done
afterAll(() => {
  jest.useRealTimers();
}); 