import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigationRoutes } from './index';

// Root Stack param list
export type RootStackParamList = {
  [NavigationRoutes.SPLASH]: undefined;
  [NavigationRoutes.ONBOARDING]: {
    onComplete: () => void;
  };
  [NavigationRoutes.AUTH]: undefined;
  [NavigationRoutes.MAIN]: undefined;
};

// Auth Stack param list
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

// Main Tab param list
export type MainTabParamList = {
  Dashboard: undefined;
  Studio: undefined;
  Subscription: undefined;
  Profile: undefined;
  Settings: undefined;
  UserProfileSettings: undefined;
};

// Helper type for Stack Screen props
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  StackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  StackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  BottomTabScreenProps<MainTabParamList, T>;

// Augment the @react-navigation/native namespace to support type checking
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 