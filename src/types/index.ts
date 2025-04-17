export enum UserRole {
  FREE = 'free',
  PREMIUM = 'premium',
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
}

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export enum NavigationRoutes {
  SPLASH = 'Splash',
  ONBOARDING = 'Onboarding',
  AUTH = 'Auth',
  MAIN = 'Main',
  DASHBOARD = 'Dashboard',
  STUDIO = 'Studio',
  PROFILE = 'Profile',
  SETTINGS = 'Settings',
}

// Export navigation types
export * from './navigation'; 