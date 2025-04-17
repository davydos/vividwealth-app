import { calculateTimeframe } from '../timeframe';

describe('calculateTimeframe', () => {
  test('returns minimum 30 days for empty goals', () => {
    expect(calculateTimeframe('')).toBe(30);
  });

  test('returns minimum 30 days for short goals', () => {
    expect(calculateTimeframe('a')).toBe(30);
    expect(calculateTimeframe('ab')).toBe(30);
  });

  test('returns days proportional to goal length', () => {
    expect(calculateTimeframe('This is a medium goal')).toBe(210); // 21 chars * 10 = 210 days
    expect(calculateTimeframe('Short goal')).toBe(100); // 10 chars * 10 = 100 days
  });

  test('returns maximum 1825 days (5 years) for very long goals', () => {
    const veryLongGoal = 'a'.repeat(200); // 200 chars * 10 = 2000 days, but should be capped at 1825
    expect(calculateTimeframe(veryLongGoal)).toBe(1825);
  });

  test('handles goals with special characters and spaces', () => {
    expect(calculateTimeframe('Learn to play piano!')).toBe(190); // 19 chars * 10 = 190 days
    expect(calculateTimeframe('Start a business in 2023')).toBe(240); // 24 chars * 10 = 240 days
  });
}); 