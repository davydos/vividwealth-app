import React from 'react';
import { View, Pressable, Text, ViewStyle } from 'react-native';
import { styled } from 'nativewind';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { COLORS } from '../constants';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledAnimatedView = styled(Animated.View);

export const Toggle = ({
  value,
  onValueChange,
  label,
  disabled = false,
  containerStyle,
}: ToggleProps) => {
  // Create animated value for the toggle position
  const offsetX = useSharedValue(value ? 18 : 0);

  // Create animated style for the toggle
  const toggleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetX.value }],
    };
  });

  // Handle toggle press
  const handleToggle = () => {
    if (disabled) return;
    
    // Animate the toggle position
    offsetX.value = withSpring(value ? 0 : 18, {
      damping: 15,
      stiffness: 120,
    });
    
    // Call the onValueChange callback with the new value
    onValueChange(!value);
  };

  // Get toggle container class
  const getToggleContainerClass = (): string => {
    const baseClasses = 'w-10 h-6 rounded-full flex justify-center px-0.5';
    
    if (disabled) {
      return `${baseClasses} bg-gray-300`;
    }
    
    return value 
      ? `${baseClasses} bg-accent` 
      : `${baseClasses} bg-gray-300`;
  };

  // Get toggle circle class
  const getToggleCircleClass = (): string => {
    return 'w-5 h-5 rounded-full bg-white shadow';
  };

  return (
    <StyledView className="flex flex-row items-center" style={containerStyle}>
      {label && (
        <StyledText className="text-primary font-medium mr-2 text-sm">
          {label}
        </StyledText>
      )}
      
      <StyledPressable
        className={getToggleContainerClass()}
        onPress={handleToggle}
        disabled={disabled}
      >
        <StyledAnimatedView 
          className={getToggleCircleClass()} 
          style={toggleStyle}
        />
      </StyledPressable>
    </StyledView>
  );
}; 