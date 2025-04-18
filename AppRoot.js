import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import App from './App';

// This component wraps our App to provide any global providers or error boundaries
export default function AppRoot() {
  try {
    console.log('AppRoot rendering');
    return <App />;
  } catch (error) {
    console.error('Error rendering App:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Something went wrong. Please restart the app.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    padding: 20,
  },
  errorText: {
    color: '#721c24',
    fontSize: 18,
    textAlign: 'center',
  },
}); 