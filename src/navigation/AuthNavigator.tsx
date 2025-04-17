import React from 'react';
import { createStackNavigator, TransitionPresets, CardStyleInterpolator } from '@react-navigation/stack';
import { Animated } from 'react-native';
import { NavigationRoutes, AuthStackParamList } from '../types';

// Import screens 
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';

const Stack = createStackNavigator<AuthStackParamList>();

// Custom transition configuration for luxury feel
const fadeTransition: {
  cardStyleInterpolator: CardStyleInterpolator;
} = {
  ...TransitionPresets.SlideFromRightIOS,
  cardStyleInterpolator: ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
};

export const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
        ...TransitionPresets.SlideFromRightIOS,
      }}
      initialRouteName="Welcome"
      id="auth-stack"
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen} 
        options={{
          ...fadeTransition,
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
}; 