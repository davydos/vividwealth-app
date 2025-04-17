import * as SecureStore from 'expo-secure-store';

// Key constants for storing different types of data
const KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
};

/**
 * Save authentication token to secure storage
 */
export const saveAuthToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error saving auth token:', error);
    throw error;
  }
};

/**
 * Get authentication token from secure storage
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Save refresh token to secure storage
 */
export const saveRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
  } catch (error) {
    console.error('Error saving refresh token:', error);
    throw error;
  }
};

/**
 * Get refresh token from secure storage
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Save user data to secure storage
 */
export const saveUserData = async (userData: object): Promise<void> => {
  try {
    await SecureStore.setItemAsync(KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

/**
 * Get user data from secure storage
 */
export const getUserData = async (): Promise<any | null> => {
  try {
    const userData = await SecureStore.getItemAsync(KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Clear all authentication related data from secure storage
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.USER_DATA);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
}; 