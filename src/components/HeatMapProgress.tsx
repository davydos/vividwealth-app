import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { getStreak } from '../utils/streakManager';

const DAYS_TO_SHOW = 35; // 7×5 grid
const NUM_COLUMNS = 7;

const HeatMapProgress: React.FC = () => {
  const [streak, setStreak] = useState<number>(0);
  const [days, setDays] = useState<Array<{ date: Date; active: boolean }>>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current streak
        const currentStreak = await getStreak();
        setStreak(currentStreak);
        
        // Generate daily data for the last 35 days
        const daysData = [];
        const today = new Date();
        
        for (let i = 0; i < DAYS_TO_SHOW; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          
          // For now, we're simplifying by assuming if a day is within
          // the streak range, it was active
          const active = i < currentStreak;
          
          daysData.unshift({ date, active });
        }
        
        setDays(daysData);
      } catch (error) {
        console.error('Failed to load heatmap data:', error);
      }
    };

    loadData();
  }, []);

  // Get day names for the column headers
  const getDayLabels = () => {
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return dayNames.map((day, index) => (
      <Text key={index} style={styles.dayLabel}>
        {day}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Progress Heatmap</Text>
      
      <View style={styles.dayLabelsContainer}>
        {getDayLabels()}
      </View>
      
      <View style={styles.heatmap}>
        {days.map((day, index) => (
          <View
            key={index}
            style={[
              styles.dayCell,
              { backgroundColor: day.active ? '#4caf50' : '#e0e0e0' }
            ]}
          />
        ))}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#e0e0e0' }]} />
          <Text style={styles.legendText}>Inactive</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4caf50' }]} />
          <Text style={styles.legendText}>Active</Text>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const cellSize = (width - 60) / NUM_COLUMNS;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  dayLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  dayLabel: {
    width: cellSize,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
  heatmap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: cellSize,
    height: cellSize,
    margin: 2,
    borderRadius: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default HeatMapProgress; 