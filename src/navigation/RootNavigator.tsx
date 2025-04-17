import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationRoutes, RootStackParamList } from '../types';
import { COLORS } from '../constants';
import { useAuth } from '../contexts';

// Import navigators and screens
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';

const Stack = createStackNavigator<RootStackParamList>();

// Create proper theme with font configuration
const theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.PRIMARY,
    background: COLORS.BACKGROUND,
    card: COLORS.BACKGROUND,
    text: COLORS.TEXT.PRIMARY,
    border: COLORS.TEXT.TERTIARY,
    notification: COLORS.ACCENT,
  },
};

export const RootNavigator = () => {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const checkOnboardingStatus = async () => {
      // In a real app, this would check AsyncStorage or SecureStore
      // For now, we'll always show onboarding
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000); // Allow splash screen to show for 3 seconds

      return () => clearTimeout(timer);
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = () => {
    setHasSeenOnboarding(true);
  };

  const handleSplashComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleSplashComplete} />;
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }} id="root-stack">
        {!hasSeenOnboarding ? (
          <Stack.Screen 
            name={NavigationRoutes.ONBOARDING} 
            component={OnboardingScreen} 
            initialParams={{ onComplete: handleOnboardingComplete }}
          />
        ) : !authState.user ? (
          <Stack.Screen name={NavigationRoutes.AUTH} component={AuthNavigator} />
        ) : (
          <Stack.Screen name={NavigationRoutes.MAIN} component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 