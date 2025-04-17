import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export const GoalAssessmentScreen = () => {
  const [goal, setGoal] = useState('');

  const handleNext = () => {
    // Handle next action here
    console.log('Goal:', goal);
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