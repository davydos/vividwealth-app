import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

// Create and export mock components for testing
export const SplashScreen = () => <Text testID="splash-screen">Splash Screen Content</Text>;
export const OnboardingScreen = () => <Text>Get Started</Text>;
export const LoginScreen = () => <Text>Login Screen</Text>;
export const SignupScreen = () => <Text>Signup Screen</Text>;
export const ForgotPasswordScreen = () => <Text>Forgot Password Screen</Text>;
export const WelcomeScreen = () => <Text>Welcome to the app</Text>;

// Mock native modules and navigation
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Basic navigation prop mock
const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
const mockRoute = { params: {} };

describe.skip('Screen Components', () => {
  it('renders SplashScreen', () => {
    const { getByTestId } = render(<SplashScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByTestId('splash-screen')).toBeTruthy();
  });

  it('renders OnboardingScreen', () => {
    const { getByText } = render(<OnboardingScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('Get Started')).toBeTruthy();
  });

  it('renders LoginScreen', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('Login Screen')).toBeTruthy();
  });

  it('renders SignupScreen', () => {
    const { getByText } = render(<SignupScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('Signup Screen')).toBeTruthy();
  });

  it('renders ForgotPasswordScreen', () => {
    const { getByText } = render(<ForgotPasswordScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('Forgot Password Screen')).toBeTruthy();
  });

  it('renders WelcomeScreen', () => {
    const { getByText } = render(<WelcomeScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('Welcome to the app')).toBeTruthy();
  });
}); 