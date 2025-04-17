import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import Animated, { 
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledAnimatedView = styled(Animated.View);

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({ errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default elegant fallback UI
      return (
        <StyledView className="flex-1 bg-background items-center justify-center p-6">
          <StyledAnimatedView 
            entering={FadeIn.duration(600)}
            className="w-20 h-20 rounded-full bg-accent/20 items-center justify-center mb-6"
          >
            <StyledText className="text-4xl">!</StyledText>
          </StyledAnimatedView>
          
          <StyledAnimatedView 
            entering={SlideInUp.delay(300).duration(600)}
            className="w-full"
          >
            <StyledText className="text-3xl font-bold text-primary text-center mb-2">
              Oops, Something Went Wrong
            </StyledText>
            
            <StyledText className="text-base text-primary/70 text-center mb-8">
              We're sorry for the inconvenience. Please try again.
            </StyledText>
            
            {__DEV__ && this.state.error && (
              <StyledView className="bg-primary/5 p-4 rounded-lg mb-8">
                <StyledText className="text-sm font-medium text-primary mb-2">
                  Error Details (Dev Only):
                </StyledText>
                <StyledScrollView 
                  className="max-h-32" 
                  showsVerticalScrollIndicator={true}
                >
                  <StyledText className="text-xs text-primary/80">
                    {this.state.error.toString()}
                  </StyledText>
                </StyledScrollView>
              </StyledView>
            )}
            
            <StyledTouchableOpacity 
              className="bg-accent py-4 rounded-lg w-full items-center"
              onPress={this.resetError}
            >
              <StyledText className="text-primary font-medium">
                Try Again
              </StyledText>
            </StyledTouchableOpacity>
          </StyledAnimatedView>
        </StyledView>
      );
    }

    return this.props.children;
  }
} 