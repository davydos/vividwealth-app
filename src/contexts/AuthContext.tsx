import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User, UserRole, AuthState } from '../types';
import * as secureStorage from '../utils/secureStorage';
import * as firebaseService from '../services/firebase';

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'apple') => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Map Firebase user to app user
const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || undefined,
    photoURL: firebaseUser.photoURL || undefined,
    role: UserRole.FREE, // Default role for new users
    createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
    updatedAt: new Date(firebaseUser.metadata.lastSignInTime || Date.now()),
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check if user is already logged in using secure storage and Firebase
    const checkAuthStatus = async () => {
      try {
        // Subscribe to Firebase auth state changes
        const unsubscribe = firebaseService.subscribeToAuthChanges(async (firebaseUser) => {
          if (firebaseUser) {
            // User is logged in, map Firebase user to app user
            const appUser = mapFirebaseUserToAppUser(firebaseUser);
            
            // Get user token and save it to secure storage
            const token = await firebaseUser.getIdToken();
            await secureStorage.saveAuthToken(token);
            await secureStorage.saveUserData(appUser);
            
            setAuthState({
              user: appUser,
              isLoading: false,
              error: null,
            });
          } else {
            // No user is signed in, check secure storage as fallback
            const userData = await secureStorage.getUserData();
            const token = await secureStorage.getAuthToken();
            
            if (userData && token) {
              // We have user data in secure storage, use it
              setAuthState({
                user: userData,
                isLoading: false,
                error: null,
              });
            } else {
              // No user data in secure storage either
              setAuthState({
                user: null,
                isLoading: false,
                error: null,
              });
            }
          }
        });
        
        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error('Error checking auth status:', error);
        setAuthState({
          user: null,
          isLoading: false,
          error: 'Failed to load user session',
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Sign in with Firebase
      const userCredential = await firebaseService.signInWithEmail(email, password);
      const firebaseUser = userCredential.user;
      
      // Get user token and save it to secure storage
      const token = await firebaseUser.getIdToken();
      await secureStorage.saveAuthToken(token);
      
      // Map Firebase user to app user
      const appUser = mapFirebaseUserToAppUser(firebaseUser);
      await secureStorage.saveUserData(appUser);
      
      setAuthState({
        user: appUser,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Invalid email or password',
      }));
    }
  };

  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      // Sign out from Firebase
      await firebaseService.logOut();
      
      // Clear secure storage
      await secureStorage.clearAuthData();
      
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to logout',
      }));
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Sign up with Firebase
      const userCredential = await firebaseService.signUpWithEmail(email, password);
      const firebaseUser = userCredential.user;
      
      // Update user profile with display name
      await firebaseUser.updateProfile({
        displayName: displayName,
      });
      
      // Get user token and save it to secure storage
      const token = await firebaseUser.getIdToken();
      await secureStorage.saveAuthToken(token);
      
      // Map Firebase user to app user
      const appUser = mapFirebaseUserToAppUser({
        ...firebaseUser,
        displayName: displayName,
      });
      await secureStorage.saveUserData(appUser);
      
      setAuthState({
        user: appUser,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to create account',
      }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Send password reset email with Firebase
      await firebaseService.resetPassword(email);
      
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Reset password error:', error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to reset password',
      }));
      
      return Promise.reject(error);
    }
  };

  const socialLogin = async (provider: 'google' | 'apple') => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Sign in with social provider
      const userCredential = provider === 'google'
        ? await firebaseService.signInWithGoogle()
        : await firebaseService.signInWithApple();
      
      const firebaseUser = userCredential.user;
      
      // Get user token and save it to secure storage
      const token = await firebaseUser.getIdToken();
      await secureStorage.saveAuthToken(token);
      
      // Map Firebase user to app user
      const appUser = mapFirebaseUserToAppUser(firebaseUser);
      await secureStorage.saveUserData(appUser);
      
      setAuthState({
        user: appUser,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || `Failed to login with ${provider}`,
      }));
    }
  };

  const value = {
    authState,
    login,
    logout,
    signUp,
    resetPassword,
    socialLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 