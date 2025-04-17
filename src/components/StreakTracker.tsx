import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStreak, incrementStreak } from '../utils/streakManager';
import { earnedAchievements } from '../utils/achievements';

const StreakTracker: React.FC = () => {
  const [streak, setStreak] = useState<number>(0);
  const [badges, setBadges] = useState<Array<{ name: string; icon: string }>>([]);

  useEffect(() => {
    const loadStreak = async () => {
      try {
        // Increment streak if eligible (new day)
        const currentStreak = await incrementStreak();
        setStreak(currentStreak);
        
        // Get earned badges based on current streak
        const earned = earnedAchievements(currentStreak);
        setBadges(earned);
      } catch (error) {
        console.error('Failed to load streak:', error);
      }
    };

    loadStreak();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.streakContainer}>
        <Text style={styles.streakIcon}>🔥</Text>
        <Text style={styles.streakText}>Current Streak: {streak} days</Text>
      </View>
      
      {badges.length > 0 && (
        <View style={styles.badgesContainer}>
          <Text style={styles.badgesTitle}>Earned Badges:</Text>
          <View style={styles.badgesList}>
            {badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

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
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '600',
  },
  badgesContainer: {
    marginTop: 8,
  },
  badgesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default StreakTracker; 