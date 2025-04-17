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
import { z } from 'zod';
import { useAuth } from '../../contexts';
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
const signupSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState<SignupFormData>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof SignupFormData, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);

  const handleChange = (name: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleBlur = (name: keyof SignupFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name: string, value: string) => {
    const schema = signupSchema.pick({ [name]: true });
    
    // Safely extract shape from the schema definition
    const baseSchema = schema._def?.schema || schema;
    const fieldSchema = baseSchema._def?.shape?.[name];
    
    try {
      schema.parse({ [name]: value });
      setErrors(prev => ({ ...prev, [name]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || "";
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
      }
      return false;
    }
  };

  const validateForm = (): boolean => {
    try {
      signupSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof SignupFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof SignupFormData] = err.message;
          }
        });
        setErrors(newErrors);
        
        // Mark all fields as touched
        const allTouched: Partial<Record<keyof SignupFormData, boolean>> = {};
        Object.keys(formData).forEach((key) => {
          if (key !== 'referralCode' || showReferralField) {
            allTouched[key as keyof SignupFormData] = true;
          }
        });
        setTouched(allTouched);
      }
      return false;
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.displayName);
      
      // If successful, show success message and navigate to login
      Alert.alert(
        "Account Created",
        "Your account has been created successfully. Please sign in to continue.",
        [
          { 
            text: "Sign In", 
            onPress: () => navigation.navigate('Login') 
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.message || "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReferralField = () => {
    setShowReferralField(!showReferralField);
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
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <StyledAnimatedView 
          entering={FadeIn.delay(200).duration(600)}
          className="mt-12 mb-8"
        >
          <StyledText className="text-primary font-bold text-3xl mb-2">
            Create Account
          </StyledText>
          <StyledText className="text-primary/70 text-lg">
            Join VividWealth and start your journey
          </StyledText>
        </StyledAnimatedView>

        <StyledView className="mb-6">
          <StyledAnimatedView entering={FadeInDown.delay(300).duration(600)}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={formData.displayName}
              onChangeText={(value) => handleChange('displayName', value)}
              onBlur={() => handleBlur('displayName')}
              error={errors.displayName}
              touched={!!touched.displayName}
            />
          </StyledAnimatedView>

          <StyledAnimatedView entering={FadeInDown.delay(400).duration(600)}>
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

          <StyledAnimatedView entering={FadeInDown.delay(500).duration(600)}>
            <Input
              label="Password"
              placeholder="Create a password"
              secureTextEntry
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              onBlur={() => handleBlur('password')}
              error={errors.password}
              touched={!!touched.password}
            />
          </StyledAnimatedView>

          <StyledAnimatedView entering={FadeInDown.delay(600).duration(600)}>
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              onBlur={() => handleBlur('confirmPassword')}
              error={errors.confirmPassword}
              touched={!!touched.confirmPassword}
            />
          </StyledAnimatedView>

          {showReferralField ? (
            <StyledAnimatedView entering={FadeInDown.delay(700).duration(400)} layout={Layout.springify()}>
              <Input
                label="Referral Code (Optional)"
                placeholder="Enter referral code"
                value={formData.referralCode}
                onChangeText={(value) => handleChange('referralCode', value)}
                onBlur={() => handleBlur('referralCode')}
                error={errors.referralCode}
                touched={!!touched.referralCode}
              />
            </StyledAnimatedView>
          ) : (
            <StyledAnimatedView entering={FadeIn.delay(700).duration(600)}>
              <StyledTouchableOpacity
                className="self-start mb-6"
                onPress={toggleReferralField}
              >
                <StyledText className="text-accent font-medium">
                  Have a referral code?
                </StyledText>
              </StyledTouchableOpacity>
            </StyledAnimatedView>
          )}

          <StyledAnimatedView entering={FadeInUp.delay(800).duration(600)}>
            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={isLoading}
              variant="primary"
              size="lg"
            />
          </StyledAnimatedView>
        </StyledView>

        <StyledAnimatedView 
          entering={FadeIn.delay(900).duration(600)}
          className="flex-row justify-center mt-8"
        >
          <StyledText className="text-primary/70">
            Already have an account?
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