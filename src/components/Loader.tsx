import React from 'react';
import { View, Text, ActivityIndicator, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { styled } from 'nativewind';
import { COLORS } from '../constants';

interface LoaderProps {
  type?: 'default' | 'fullscreen' | 'inline' | 'skeleton';
  message?: string;
  style?: ViewStyle;
  color?: string;
}

const StyledView = styled(View);
const StyledText = styled(Text);

export const Loader = ({
  type = 'default',
  message,
  style,
  color = COLORS.ACCENT,
}: LoaderProps) => {
  // This would need to be replaced with an actual Lottie animation file
  const loadingAnimation = require('../assets/animations/loading.json');

  const getContainerClass = (): string => {
    switch (type) {
      case 'fullscreen':
        return 'flex-1 items-center justify-center bg-background';
      case 'inline':
        return 'flex-row items-center py-2';
      case 'skeleton':
        return 'rounded-md bg-gray-200 overflow-hidden';
      default:
        return 'items-center justify-center py-4';
    }
  };

  if (type === 'skeleton') {
    return (
      <StyledView 
        className={`${getContainerClass()} animate-pulse`} 
        style={style}
      />
    );
  }

  return (
    <StyledView className={getContainerClass()} style={style}>
      {loadingAnimation ? (
        <LottieView
          source={loadingAnimation}
          autoPlay
          loop
          style={{ width: type === 'inline' ? 24 : 80, height: type === 'inline' ? 24 : 80 }}
        />
      ) : (
        <ActivityIndicator size={type === 'inline' ? 'small' : 'large'} color={color} />
      )}
      
      {message && (
        <StyledText 
          className={`text-primary font-medium ${type === 'inline' ? 'ml-2' : 'mt-2'}`}
        >
          {message}
        </StyledText>
      )}
    </StyledView>
  );
}; 