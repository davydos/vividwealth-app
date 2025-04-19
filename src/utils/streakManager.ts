import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_KEY = 'userStreak';
const LAST_DATE_KEY = 'lastStreakDate';

export async function getStreak(): Promise<number> {
  const value = await AsyncStorage.getItem(STREAK_KEY);
  return value ? parseInt(value, 10) : 0;
}

export async function incrementStreak(): Promise<number> {
  const today = new Date().toISOString().slice(0,10);
  const last = await AsyncStorage.getItem(LAST_DATE_KEY);
  let streak = await getStreak();
  
  // If already updated today, return current streak
  if (last === today) return streak;
  
  // If last update was yesterday, increment streak
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
  if (last === yesterday) {
    streak += 1;
  } else {
    // Reset streak for any other case
    streak = 1;
  }
  
  await AsyncStorage.setItem(STREAK_KEY, streak.toString());
  await AsyncStorage.setItem(LAST_DATE_KEY, today);
  return streak;
}

export async function resetStreak(): Promise<void> {
  await AsyncStorage.removeItem(STREAK_KEY);
  await AsyncStorage.removeItem(LAST_DATE_KEY);
} 