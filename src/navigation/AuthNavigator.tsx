import React from 'react';
import { 
  createStackNavigator, 
  CardStyleInterpolators 
} from '@react-navigation/stack';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '@/screens/auth/ForgotPasswordScreen';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

const Auth = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Auth.Navigator
      initialRouteName="Login"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
      }}
    >
      <Auth.Screen name="Login" component={LoginScreen} />
      <Auth.Screen name="Signup" component={SignupScreen} />
      <Auth.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Auth.Navigator>
  );
} 