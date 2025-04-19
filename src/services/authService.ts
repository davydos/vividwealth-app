import { UserCredentials, AuthResponse, AuthUser } from '../shared/src/types/auth';
import * as secureStorage from '../utils/secureStorage';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

export async function login(email: string, password: string): Promise<AuthUser> {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    if (!response.data.success || !response.data.token || !response.data.user) {
      throw new Error(response.data.message || 'Login failed');
    }
    
    // Store the token in secure storage
    await secureStorage.saveAuthToken(response.data.token);
    
    // Store user data
    await secureStorage.saveUserData(response.data.user);
    
    return response.data.user;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw error;
  }
}

export async function signup(userData: UserCredentials): Promise<AuthUser> {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/signup`, userData);
    
    if (!response.data.success || !response.data.token || !response.data.user) {
      throw new Error(response.data.message || 'Signup failed');
    }
    
    // Store the token in secure storage
    await secureStorage.saveAuthToken(response.data.token);
    
    // Store user data
    await secureStorage.saveUserData(response.data.user);
    
    return response.data.user;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Signup failed');
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  // Clear local storage
  await secureStorage.clearAuthData();
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // Get user from secure storage
    const userData = await secureStorage.getUserData();
    if (!userData) return null;
    
    // Get token from secure storage
    const token = await secureStorage.getAuthToken();
    if (!token) return null;
    
    // Verify token is still valid with a request to the backend
    // This could be expanded to use a /verify endpoint if needed
    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
} 