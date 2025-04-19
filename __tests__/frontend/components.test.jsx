import React from 'react';
import { Text, TouchableOpacity, TextInput, View } from 'react-native';
import { render } from '@testing-library/react-native';

// Define and export components for testing
export const Button = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{title}</Text>
  </TouchableOpacity>
);

export const Card = ({ children }) => <View>{children}</View>;

export const Input = ({ placeholder, value, onChangeText }) => (
  <TextInput placeholder={placeholder} value={value} onChangeText={onChangeText} />
);

export const Loader = () => <View testID="loader" />;

// Use proper React.Component for ErrorBoundary
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

describe.skip('UI Components', () => {
  it('renders Button component', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('renders Card component', () => {
    const { getByText } = render(
      <Card>
        <Text>Test Card</Text>
      </Card>
    );
    expect(getByText('Test Card')).toBeTruthy();
  });

  it('renders Input component', () => {
    const { getByPlaceholderText } = render(
      <Input 
        placeholder="Test Input" 
        value="" 
        onChangeText={() => {}} 
      />
    );
    expect(getByPlaceholderText('Test Input')).toBeTruthy();
  });

  it('renders Loader component', () => {
    const { getByTestId } = render(<Loader />);
    expect(getByTestId('loader')).toBeTruthy();
  });

  it('renders ErrorBoundary component', () => {
    const ThrowError = () => { 
      throw new Error('Test Error'); 
      return null;
    };
    // Suppress console.error output during this test
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText } = render(
      <ErrorBoundary fallback={<Text>Error Fallback</Text>}>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(getByText('Error Fallback')).toBeTruthy();

    consoleErrorMock.mockRestore();
  });
}); 