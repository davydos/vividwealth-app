import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { StackScreenProps } from '@react-navigation/stack';
import { MainTabParamList } from '../types/navigation';

const StyledView = styled(View);
const StyledText = styled(Text);

// Interface for component props
export interface UserProfileSettingsProps extends StackScreenProps<MainTabParamList, 'UserProfileSettings'> {}

const UserProfileSettings: React.FC<UserProfileSettingsProps> = () => {
  return (
    <StyledView className="flex-1 items-center justify-center bg-background">
      <StyledText className="text-text-primary text-lg font-medium">
        User Profile Settings coming soon
      </StyledText>
    </StyledView>
  );
};

export default UserProfileSettings; 