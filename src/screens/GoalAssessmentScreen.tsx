import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { calculateTimeframe } from '../utils/timeframe';

export const GoalAssessmentScreen = () => {
  const [goal, setGoal] = useState('');

  const handleNext = async () => {
    if (!goal.trim()) {
      Alert.alert('Error', 'Please enter a goal');
      return;
    }

    try {
      // Calculate timeframe based on goal
      const timeframe = calculateTimeframe(goal);
      
      // Save goal and timeframe to SecureStore
      await SecureStore.setItemAsync('user_goal', goal);
      await SecureStore.setItemAsync('goal_timeframe', String(timeframe));
      
      console.log('Goal saved:', goal);
      console.log('Timeframe (days):', timeframe);
      
      // Clear input after saving
      setGoal('');
      
      // Show confirmation
      Alert.alert(
        'Goal Saved',
        `Your goal has been saved. Estimated timeframe: ${timeframe} days.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving goal:', error);
      Alert.alert('Error', 'Failed to save your goal. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>What goal do you want to achieve?</Text>
      
      <TextInput
        style={styles.input}
        value={goal}
        onChangeText={setGoal}
        placeholder="Enter your goal here"
        multiline
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 30,
    fontSize: 16,
    minHeight: 100,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 