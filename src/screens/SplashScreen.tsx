import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { COLORS } from '../constants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledAnimatedView = styled(Animated.View);
const StyledAnimatedText = styled(Animated.Text);

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  // Animation values
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.3);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    // Start animations
    const timingConfig = {
      duration: 800,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    };

    // Sequence for logo
    logoScale.value = withTiming(1, timingConfig);
    logoOpacity.value = withTiming(1, timingConfig);
    
    // Ring animation (slightly delayed and gives a "pulse" effect)
    ringScale.value = withDelay(
      400,
      withSequence(
        withTiming(1.1, { duration: 600, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
        withTiming(1, { duration: 300 })
      )
    );
    ringOpacity.value = withDelay(400, withTiming(0.7, { duration: 500 }));
    
    // Text animations (fade in after logo)
    textOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));

    // Transition to next screen after animations
    if (onFinish) {
      const timer = setTimeout(() => {
        onFinish();
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <StyledView className="flex-1 items-center justify-center bg-background">
      {/* Animated ring effect */}
      <StyledAnimatedView
        style={[ringStyle, { position: 'absolute' }]}
        className="w-36 h-36 rounded-full bg-accent/20"
      />
      
      {/* Logo */}
      <StyledAnimatedView style={logoStyle} className="mb-8">
        <StyledView className="w-32 h-32 bg-primary rounded-full items-center justify-center">
          <StyledText className="text-accent font-bold text-4xl">VW</StyledText>
        </StyledView>
      </StyledAnimatedView>
      
      {/* Text */}
      <StyledAnimatedText style={textStyle} className="text-primary font-bold text-3xl mt-6">
        VividWealth
      </StyledAnimatedText>
      
      {/* Subtitle */}
      <StyledAnimatedText style={subtitleStyle} className="text-primary/70 text-base mt-2">
        Financial Excellence, Reimagined
      </StyledAnimatedText>
    </StyledView>
  );
}; 