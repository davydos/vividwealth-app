import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

/**
 * Save authentication token to secure storage
 */
export async function saveAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}

/**
 * Get authentication token from secure storage
 */
export async function getAuthToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

/**
 * Save user data to secure storage
 */
export async function saveUserData(userData: any): Promise<void> {
  await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
}

/**
 * Get user data from secure storage
 */
export async function getUserData(): Promise<any | null> {
  const userData = await SecureStore.getItemAsync(USER_DATA_KEY);
  if (!userData) return null;
  return JSON.parse(userData);
}

/**
 * Clear all authentication related data from secure storage
 */
export async function clearAuthData(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_DATA_KEY);
} 