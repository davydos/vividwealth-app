import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
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
  Layout 
} from 'react-native-reanimated';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);
const StyledAnimatedView = styled(Animated.View);

// Form validation schema
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordFormData = z.infer<typeof emailSchema>;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const { resetPassword } = useAuth();
  
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ForgotPasswordFormData, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field: keyof ForgotPasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleBlur = (field: keyof ForgotPasswordFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof ForgotPasswordFormData, value: string) => {
    try {
      const fieldSchema = emailSchema.shape[field];
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
      emailSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ForgotPasswordFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ForgotPasswordFormData] = err.message;
          }
        });
        setErrors(newErrors);
        
        // Mark all fields as touched
        setTouched({ email: true });
      }
      return false;
    }
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await resetPassword(formData.email);
      setIsSuccess(true);
    } catch (error: any) {
      Alert.alert(
        "Password Reset Failed",
        error.message || "Failed to send password reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

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
            Reset Password
          </StyledText>
          <StyledText className="text-primary/70 text-lg">
            Enter your email to receive a reset link
          </StyledText>
        </StyledAnimatedView>

        {isSuccess ? (
          <StyledAnimatedView 
            entering={FadeIn.duration(600)}
            className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6"
          >
            <StyledText className="text-green-800 font-medium text-base">
              Reset link sent! Please check your email inbox for instructions to reset your password.
            </StyledText>
          </StyledAnimatedView>
        ) : (
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

            <StyledAnimatedView entering={FadeInUp.delay(400).duration(600)} className="mt-6">
              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                loading={isLoading}
                variant="primary"
                size="lg"
              />
            </StyledAnimatedView>
          </StyledView>
        )}

        <StyledAnimatedView 
          entering={FadeIn.delay(500).duration(600)}
          className="flex-row justify-center mt-8"
        >
          <StyledText className="text-primary/70">
            Remember your password?
          </StyledText>
          <StyledTouchableOpacity onPress={navigateToLogin}>
            <StyledText className="text-accent font-medium ml-1">
              Sign In
            </StyledText>
          </StyledTouchableOpacity>
        </StyledAnimatedView>
      </StyledScrollView>
    </StyledKeyboardAvoidingView>
  );
}; 