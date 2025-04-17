import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, LogBox } from 'react-native';
import { styled } from 'nativewind';
import { RootNavigator } from './src/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { COLORS } from './src/constants';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/contexts';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Ignore specific harmless warnings
LogBox.ignoreLogs([
  // Add any warnings you want to ignore
  'Warning: componentWillReceiveProps has been renamed',
  'ViewPropTypes will be removed',
]);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Create a client for React Query
const queryClient = new QueryClient();

// Styled components
const StyledView = styled(View);
const StyledGestureHandlerRootView = styled(GestureHandlerRootView);

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Preload fonts
        // In a real app, we'd load the Satoshi font
        // await Font.loadAsync({
        //   'Satoshi-Regular': require('./src/assets/fonts/Satoshi-Regular.otf'),
        //   'Satoshi-Medium': require('./src/assets/fonts/Satoshi-Medium.otf'),
        //   'Satoshi-Bold': require('./src/assets/fonts/Satoshi-Bold.otf'),
        //   'Satoshi-Black': require('./src/assets/fonts/Satoshi-Black.otf'),
        // });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <StyledGestureHandlerRootView className="flex-1">
      <ErrorBoundary>
        <StyledView className="flex-1" onLayout={onLayoutRootView}>
          <StatusBar style="dark" />
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </QueryClientProvider>
        </StyledView>
      </ErrorBoundary>
    </StyledGestureHandlerRootView>
  );
} 