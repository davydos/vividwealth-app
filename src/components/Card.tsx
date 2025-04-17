import React from 'react';
import { View, ViewStyle } from 'react-native';
import { styled } from 'nativewind';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outline' | 'flat';
  style?: ViewStyle;
}

const StyledView = styled(View);

export const Card = ({ 
  children, 
  variant = 'elevated', 
  style 
}: CardProps) => {
  const getCardClass = (): string => {
    const baseClasses = 'rounded-lg p-4';
    
    const variantClasses = {
      elevated: 'bg-white shadow',
      outline: 'bg-white border border-gray-200',
      flat: 'bg-gray-50',
    };
    
    return `${baseClasses} ${variantClasses[variant]}`;
  };

  return (
    <StyledView className={getCardClass()} style={style}>
      {children}
    </StyledView>
  );
}; 