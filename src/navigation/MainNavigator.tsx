import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationRoutes, MainTabParamList } from '../types';
import { COLORS } from '../constants';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

// Import DashboardScreen
import DashboardScreen from '../screens/DashboardScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import UserProfileSettings from '../screens/UserProfileSettings';

// Temporarily create placeholder screens
const StudioScreen = () => null;
const ProfileScreen = () => null;
const SettingsScreen = () => null;

const Tab = createBottomTabNavigator<MainTabParamList>();
const StyledView = styled(View);
const StyledText = styled(Text);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.ACCENT,
        tabBarInactiveTintColor: COLORS.TEXT.TERTIARY,
        tabBarStyle: {
          backgroundColor: COLORS.BACKGROUND,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
      id="main-tab"
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <StyledView className={`items-center justify-center rounded-full p-1 ${focused ? 'bg-accent/20' : ''}`}>
              <StyledText className="text-xl">🏠</StyledText>
            </StyledView>
          ),
        }}
      />
      <Tab.Screen 
        name="Studio" 
        component={StudioScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <StyledView className={`items-center justify-center rounded-full p-1 ${focused ? 'bg-accent/20' : ''}`}>
              <StyledText className="text-xl">🎬</StyledText>
            </StyledView>
          ),
        }}
      />
      <Tab.Screen 
        name="Subscription" 
        component={SubscriptionScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <StyledView className={`items-center justify-center rounded-full p-1 ${focused ? 'bg-accent/20' : ''}`}>
              <StyledText className="text-xl">✨</StyledText>
            </StyledView>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <StyledView className={`items-center justify-center rounded-full p-1 ${focused ? 'bg-accent/20' : ''}`}>
              <StyledText className="text-xl">👤</StyledText>
            </StyledView>
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <StyledView className={`items-center justify-center rounded-full p-1 ${focused ? 'bg-accent/20' : ''}`}>
              <StyledText className="text-xl">⚙️</StyledText>
            </StyledView>
          ),
        }}
      />
      <Tab.Screen 
        name="UserProfileSettings" 
        component={UserProfileSettings}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <StyledView className={`items-center justify-center rounded-full p-1 ${focused ? 'bg-accent/20' : ''}`}>
              <StyledText className="text-xl">👤</StyledText>
            </StyledView>
          ),
          tabBarLabel: 'Profile Settings',
        }}
      />
    </Tab.Navigator>
  );
}; 