export const ACHIEVEMENTS = [
  { days: 3, name: '3‑Day Streak', icon: '🔥' },
  { days: 7, name: '7‑Day Streak', icon: '💎' },
  { days: 30, name: '30‑Day Streak', icon: '🏆' },
];

export function earnedAchievements(streak: number) {
  return ACHIEVEMENTS.filter(a => streak >= a.days);
} 