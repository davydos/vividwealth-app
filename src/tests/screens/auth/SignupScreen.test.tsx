import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignupScreen } from '../../../screens/auth/SignupScreen';
import { useAuth } from '../../../contexts';
import { Alert } from 'react-native';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock auth context
jest.mock('../../../contexts', () => ({
  useAuth: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('SignupScreen', () => {
  const mockSignUp = jest.fn();
  
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      authState: { isLoading: false, error: null, user: null },
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<SignupScreen />);
    
    expect(getByText('Create Account')).toBeTruthy();
    expect(getByPlaceholderText('Enter your full name')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Create a password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm your password')).toBeTruthy();
  });
  
  it('validates form fields', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<SignupScreen />);
    
    // Empty name
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(queryByText('Name must be at least 2 characters')).toBeTruthy();
    });
    
    // Invalid email format
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'invalid-email');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(queryByText('Please enter a valid email')).toBeTruthy();
    });
    
    // Password too short
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'valid@example.com');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'short');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(queryByText('Password must be at least 8 characters')).toBeTruthy();
    });
    
    // Passwords don't match
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'differentpassword');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(queryByText("Passwords don't match")).toBeTruthy();
    });
  });
  
  it('submits the form with valid data', async () => {
    const { getByText, getByPlaceholderText } = render(<SignupScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User');
    });
  });
  
  it('shows success alert on successful registration', async () => {
    mockSignUp.mockResolvedValueOnce({});
    
    const { getByText, getByPlaceholderText } = render(<SignupScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Account Created",
        "Your account has been created successfully. Please sign in to continue.",
        expect.anything()
      );
    });
  });
  
  it('shows error alert when signup fails', async () => {
    mockSignUp.mockRejectedValueOnce(new Error('Email already in use'));
    
    const { getByText, getByPlaceholderText } = render(<SignupScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Registration Failed",
        "Email already in use"
      );
    });
  });
  
  it('toggles referral code field visibility', () => {
    const { getByText, queryByPlaceholderText } = render(<SignupScreen />);
    
    // Referral field should be hidden initially
    expect(queryByPlaceholderText('Enter referral code')).toBeFalsy();
    
    // Toggle referral field
    fireEvent.press(getByText('Have a referral code?'));
    
    // Referral field should be visible
    expect(queryByPlaceholderText('Enter referral code')).toBeTruthy();
  });
  
  it('navigates to login screen', () => {
    const mockNavigate = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      authState: { isLoading: false, error: null, user: null },
    });
    
    const { getByText } = render(<SignupScreen />);
    
    fireEvent.press(getByText('Already have an account? Sign In'));
    
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
}); 