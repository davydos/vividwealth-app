import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  TextInputProps, 
  ViewStyle 
} from 'react-native';
import { styled } from 'nativewind';
import { COLORS } from '../constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
  touched?: boolean;
}

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  secureTextEntry,
  touched,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const getInputContainerClass = (): string => {
    const baseClasses = 'flex flex-row items-center border rounded-lg px-4 py-3';
    
    if (error && touched) {
      return `${baseClasses} border-red-500`;
    }
    
    if (isFocused) {
      return `${baseClasses} border-accent`;
    }
    
    return `${baseClasses} border-gray-300`;
  };

  return (
    <StyledView className="mb-4" style={containerStyle}>
      {label && (
        <StyledText className="text-primary font-medium mb-1 text-sm">
          {label}
        </StyledText>
      )}
      
      <StyledView className={getInputContainerClass()}>
        {leftIcon && (
          <StyledView className="mr-2">
            {leftIcon}
          </StyledView>
        )}
        
        <StyledTextInput
          className="flex-1 text-primary text-base"
          placeholderTextColor={COLORS.TEXT.TERTIARY}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        
        {secureTextEntry ? (
          <StyledTouchableOpacity 
            className="ml-2" 
            onPress={togglePasswordVisibility}
          >
            <Text>{isPasswordVisible ? '🙈' : '👁️'}</Text>
          </StyledTouchableOpacity>
        ) : rightIcon && (
          <StyledTouchableOpacity 
            className="ml-2" 
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </StyledTouchableOpacity>
        )}
      </StyledView>
      
      {error && touched && (
        <StyledText className="text-red-500 text-xs mt-1">
          {error}
        </StyledText>
      )}
    </StyledView>
  );
}; 