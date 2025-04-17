import React, { useState } from 'react';
import { View, Text, FlatList, Dimensions, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { Button } from '../components';
import { COLORS } from '../constants';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { NavigationRoutes } from '../types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

const { width } = Dimensions.get('window');

type OnboardingScreenRouteProp = RouteProp<{
  Onboarding: { onComplete: () => void }
}, 'Onboarding'>;

const onboardingData = [
  {
    id: '1',
    title: 'Welcome to VividWealth',
    description: 'Your journey to financial freedom begins here.',
    emoji: '✨',
  },
  {
    id: '2',
    title: 'Personalized Insights',
    description: 'Get tailored financial recommendations based on your goals.',
    emoji: '📊',
  },
  {
    id: '3',
    title: 'Secure & Private',
    description: 'Your financial data is always protected and private.',
    emoji: '🔒',
  },
];

export const OnboardingScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = React.useRef<FlatList>(null);
  const route = useRoute<OnboardingScreenRouteProp>();
  
  const handleComplete = () => {
    route.params?.onComplete();
  };

  const handleNext = () => {
    if (activeIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => {
    return (
      <StyledView className="w-full items-center justify-center px-8" style={{ width }}>
        <StyledView className="w-24 h-24 bg-accent/20 rounded-full items-center justify-center mb-8">
          <StyledText className="text-5xl">{item.emoji}</StyledText>
        </StyledView>
        
        <StyledText className="text-primary font-bold text-3xl text-center mb-4">
          {item.title}
        </StyledText>
        
        <StyledText className="text-primary/70 text-center text-lg">
          {item.description}
        </StyledText>
      </StyledView>
    );
  };

  return (
    <StyledView className="flex-1 bg-background">
      <StyledView className="flex-row justify-end p-4">
        <StyledPressable onPress={handleSkip}>
          <StyledText className="text-accent font-medium text-base">
            Skip
          </StyledText>
        </StyledPressable>
      </StyledView>
      
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        keyExtractor={(item) => item.id}
      />
      
      <StyledView className="flex-row justify-center my-8">
        {onboardingData.map((_, index) => (
          <StyledView 
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === activeIndex ? 'bg-accent' : 'bg-gray-300'
            }`}
          />
        ))}
      </StyledView>
      
      <StyledView className="px-8 mb-12">
        <Button 
          title={activeIndex === onboardingData.length - 1 ? "Get Started" : "Next"} 
          onPress={handleNext}
          variant={activeIndex === onboardingData.length - 1 ? "secondary" : "primary"}
        />
      </StyledView>
    </StyledView>
  );
}; 