import { Text, Pressable, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { styled } from 'nativewind';
import { COLORS } from '../constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) => {
  const getButtonClass = (): string => {
    const baseClasses = 'flex flex-row items-center justify-center rounded-lg';
    const sizeClasses = {
      sm: 'py-2 px-4',
      md: 'py-3 px-6',
      lg: 'py-4 px-8',
    };
    
    const variantClasses = {
      primary: 'bg-primary',
      secondary: 'bg-accent',
      outline: 'bg-transparent border border-primary',
      text: 'bg-transparent',
    };
    
    const disabledClasses = disabled ? 'opacity-50' : '';
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses}`;
  };
  
  const getTextClass = (): string => {
    const baseClasses = 'font-medium text-center';
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };
    
    const variantClasses = {
      primary: 'text-white',
      secondary: 'text-primary',
      outline: 'text-primary',
      text: 'text-primary',
    };
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
  };

  return (
    <StyledPressable
      className={getButtonClass()}
      style={style}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? COLORS.BACKGROUND : COLORS.PRIMARY} 
        />
      ) : (
        <>
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <StyledText className={getTextClass()} style={textStyle}>{title}</StyledText>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </>
      )}
    </StyledPressable>
  );
}; 