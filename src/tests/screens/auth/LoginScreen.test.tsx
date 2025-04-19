import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../../../screens/auth/LoginScreen';
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

describe('LoginScreen', () => {
  const mockLogin = jest.fn();
  const mockSocialLogin = jest.fn();
  
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      socialLogin: mockSocialLogin,
      authState: { isLoading: false, error: null, user: null },
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });
  
  it('validates form fields', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<LoginScreen />);
    
    // Invalid email format
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'invalid-email');
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(queryByText('Please enter a valid email')).toBeTruthy();
    });
    
    // Empty password
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'valid@example.com');
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(queryByText('Password must be at least 8 characters')).toBeTruthy();
    });
  });
  
  it('submits the form with valid credentials', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
  
  it('shows error alert when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Login Failed',
        'Invalid credentials'
      );
    });
  });
  
  it('handles social login (Google)', async () => {
    const { getByText } = render(<LoginScreen />);
    
    // Find Google login button by "Continue with Google" text
    // Note: actual implementation might be different, adjust as needed
    const googleButton = getByText(/Continue with Google/i);
    fireEvent.press(googleButton);
    
    await waitFor(() => {
      expect(mockSocialLogin).toHaveBeenCalledWith('google');
    });
  });
  
  it('navigates to forgot password screen', () => {
    const mockNavigate = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      socialLogin: mockSocialLogin,
      authState: { isLoading: false, error: null, user: null },
    });
    
    const { getByText } = render(<LoginScreen />);
    
    fireEvent.press(getByText('Forgot Password?'));
    
    expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
  });
}); 