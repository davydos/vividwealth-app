import { ACHIEVEMENTS, earnedAchievements } from '../achievements';

describe('Achievements', () => {
  describe('earnedAchievements', () => {
    it('returns empty array for streak of 0', () => {
      const earned = earnedAchievements(0);
      expect(earned).toEqual([]);
    });

    it('returns empty array for streak of 2 (below first achievement)', () => {
      const earned = earnedAchievements(2);
      expect(earned).toEqual([]);
    });

    it('returns first achievement for streak of 3', () => {
      const earned = earnedAchievements(3);
      expect(earned).toEqual([ACHIEVEMENTS[0]]);
      expect(earned[0].name).toBe('3‑Day Streak');
    });

    it('returns first two achievements for streak of 10', () => {
      const earned = earnedAchievements(10);
      expect(earned).toEqual([ACHIEVEMENTS[0], ACHIEVEMENTS[1]]);
      expect(earned[0].name).toBe('3‑Day Streak');
      expect(earned[1].name).toBe('7‑Day Streak');
    });

    it('returns all achievements for streak of 30', () => {
      const earned = earnedAchievements(30);
      expect(earned).toEqual(ACHIEVEMENTS);
      expect(earned.length).toBe(3);
    });

    it('returns all achievements for streak greater than highest threshold', () => {
      const earned = earnedAchievements(100);
      expect(earned).toEqual(ACHIEVEMENTS);
      expect(earned.length).toBe(3);
    });
  });
}); 