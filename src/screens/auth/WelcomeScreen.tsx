import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { Button } from '../../components';
import { COLORS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing
} from 'react-native-reanimated';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledAnimatedView = styled(Animated.View);

const { width, height } = Dimensions.get('window');

export const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  
  // Animation values
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);
  const titleTranslateY = useSharedValue(20);
  const subtitleTranslateY = useSharedValue(20);
  const buttonsTranslateY = useSharedValue(30);

  // Animate all elements into view on component mount
  React.useEffect(() => {
    const animationConfig = { duration: 600, easing: Easing.bezier(0.16, 1, 0.3, 1) };
    
    logoOpacity.value = withDelay(100, withTiming(1, animationConfig));
    logoTranslateY.value = withDelay(100, withTiming(0, animationConfig));
    
    titleOpacity.value = withDelay(300, withTiming(1, animationConfig));
    titleTranslateY.value = withDelay(300, withTiming(0, animationConfig));
    
    subtitleOpacity.value = withDelay(500, withTiming(1, animationConfig));
    subtitleTranslateY.value = withDelay(500, withTiming(0, animationConfig));
    
    buttonsOpacity.value = withDelay(700, withTiming(1, animationConfig));
    buttonsTranslateY.value = withDelay(700, withTiming(0, animationConfig));
  }, []);

  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const navigateToSignIn = () => {
    navigation.navigate('Login');
  };

  const navigateToSignUp = () => {
    navigation.navigate('Signup');
  };

  return (
    <StyledView className="flex-1 bg-background">
      <StyledView className="flex-1 items-center justify-center px-8">
        {/* Logo */}
        <StyledAnimatedView style={logoStyle} className="mb-8">
          <StyledView className="w-24 h-24 bg-primary rounded-full items-center justify-center">
            <StyledText className="text-accent font-bold text-4xl">VW</StyledText>
          </StyledView>
        </StyledAnimatedView>
        
        {/* Title */}
        <StyledAnimatedView style={titleStyle} className="mb-2">
          <StyledText className="text-primary font-bold text-3xl text-center">
            Welcome to VividWealth
          </StyledText>
        </StyledAnimatedView>
        
        {/* Subtitle */}
        <StyledAnimatedView style={subtitleStyle} className="mb-12">
          <StyledText className="text-primary/60 text-center text-lg">
            Your journey to financial freedom begins here
          </StyledText>
        </StyledAnimatedView>
        
        {/* Buttons */}
        <StyledAnimatedView style={buttonsStyle} className="w-full space-y-4">
          <Button
            title="Sign In"
            onPress={navigateToSignIn}
            variant="primary"
            size="lg"
          />
          
          <Button
            title="Create Account"
            onPress={navigateToSignUp}
            variant="outline"
            size="lg"
          />
        </StyledAnimatedView>
      </StyledView>
    </StyledView>
  );
}; 