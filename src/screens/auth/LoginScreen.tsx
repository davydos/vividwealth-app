import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { styled } from 'nativewind';
import { Button, Input } from '../../components';
import { COLORS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../contexts';
import { z } from 'zod';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);
const StyledAnimatedView = styled(Animated.View);
const StyledAnimatedText = styled(Animated.Text);
const StyledAnimatedTouchableOpacity = styled(Animated.createAnimatedComponent(TouchableOpacity));

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const { login, socialLogin } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LoginFormData, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  // Animation values for button press feedback
  const googleScale = useSharedValue(1);
  const appleScale = useSharedValue(1);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleBlur = (field: keyof LoginFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof LoginFormData, value: string) => {
    try {
      const fieldSchema = loginSchema.shape[field];
      fieldSchema.parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.errors[0]?.message || `Invalid ${field}`,
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof LoginFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof LoginFormData] = err.message;
          }
        });
        setErrors(newErrors);
        
        // Mark all fields as touched
        const allTouched: Partial<Record<keyof LoginFormData, boolean>> = {};
        Object.keys(formData).forEach((key) => {
          allTouched[key as keyof LoginFormData] = true;
        });
        setTouched(allTouched);
      }
      return false;
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      // If we get here, login was successful, navigation handled by AuthContext
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.message || "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    
    // Button press animation
    if (provider === 'google') {
      googleScale.value = withSequence(
        withTiming(0.95, { duration: 100, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(1, { duration: 100, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      );
    } else {
      appleScale.value = withSequence(
        withTiming(0.95, { duration: 100, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(1, { duration: 100, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      );
    }

    try {
      await socialLogin(provider);
      // If we get here, login was successful, navigation handled by AuthContext
    } catch (error: any) {
      Alert.alert(
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login Failed`,
        error.message || `Failed to login with ${provider}. Please try again.`
      );
    } finally {
      setSocialLoading(null);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  // Animated styles for social buttons
  const googleButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: googleScale.value }],
  }));

  const appleButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: appleScale.value }],
  }));

  return (
    <StyledKeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StyledScrollView 
        className="flex-1" 
        contentContainerClassName="p-6 pb-12"
        keyboardShouldPersistTaps="handled"
      >
        <StyledAnimatedView 
          entering={FadeIn.delay(200).duration(600)}
          className="mt-12 mb-8"
        >
          <StyledText className="text-primary font-bold text-3xl mb-2">
            Welcome Back
          </StyledText>
          <StyledText className="text-primary/70 text-lg">
            Sign in to continue to VividWealth
          </StyledText>
        </StyledAnimatedView>

        <StyledView className="mb-6">
          <StyledAnimatedView entering={FadeInDown.delay(300).duration(600)}>
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              onBlur={() => handleBlur('email')}
              error={errors.email}
              touched={!!touched.email}
            />
          </StyledAnimatedView>

          <StyledAnimatedView entering={FadeInDown.delay(400).duration(600)}>
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              onBlur={() => handleBlur('password')}
              error={errors.password}
              touched={!!touched.password}
            />
          </StyledAnimatedView>

          <StyledAnimatedView 
            entering={FadeIn.delay(500).duration(600)}
            className="self-end mb-6"
          >
            <StyledTouchableOpacity
              onPress={navigateToForgotPassword}
            >
              <StyledText className="text-accent font-medium">
                Forgot Password?
              </StyledText>
            </StyledTouchableOpacity>
          </StyledAnimatedView>

          <StyledAnimatedView entering={FadeInUp.delay(600).duration(600)}>
            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              variant="primary"
              size="lg"
            />
          </StyledAnimatedView>
        </StyledView>

        <StyledAnimatedView 
          entering={FadeIn.delay(700).duration(600)}
          className="flex-row items-center my-6"
        >
          <StyledView className="flex-1 h-px bg-gray-200" />
          <StyledText className="mx-4 text-gray-500">or continue with</StyledText>
          <StyledView className="flex-1 h-px bg-gray-200" />
        </StyledAnimatedView>

        <StyledAnimatedView 
          entering={FadeInUp.delay(800).duration(600)}
          className="flex-row space-x-4"
        >
          <StyledAnimatedTouchableOpacity
            style={googleButtonStyle}
            className="flex-1 flex-row items-center justify-center py-4 border border-gray-200 rounded-lg bg-white"
            onPress={() => handleSocialLogin('google')}
            disabled={isLoading || socialLoading !== null}
          >
            {socialLoading === 'google' ? (
              <ActivityIndicator size="small" color={COLORS.PRIMARY} />
            ) : (
              <>
                <StyledText className="text-xl mr-2">G</StyledText>
                <StyledText className="font-medium">Google</StyledText>
              </>
            )}
          </StyledAnimatedTouchableOpacity>

          <StyledAnimatedTouchableOpacity
            style={appleButtonStyle}
            className="flex-1 flex-row items-center justify-center py-4 border border-gray-200 rounded-lg bg-white"
            onPress={() => handleSocialLogin('apple')}
            disabled={isLoading || socialLoading !== null}
          >
            {socialLoading === 'apple' ? (
              <ActivityIndicator size="small" color={COLORS.PRIMARY} />
            ) : (
              <>
                <StyledText className="text-xl mr-2">🍎</StyledText>
                <StyledText className="font-medium">Apple</StyledText>
              </>
            )}
          </StyledAnimatedTouchableOpacity>
        </StyledAnimatedView>

        <StyledAnimatedView 
          entering={FadeIn.delay(900).duration(600)}
          className="flex-row justify-center mt-8"
        >
          <StyledText className="text-primary/70">
            Don't have an account?
          </StyledText>
          <StyledTouchableOpacity onPress={navigateToSignup}>
            <StyledText className="text-accent font-medium ml-1">
              Sign Up
            </StyledText>
          </StyledTouchableOpacity>
        </StyledAnimatedView>
      </StyledScrollView>
    </StyledKeyboardAvoidingView>
  );
}; 