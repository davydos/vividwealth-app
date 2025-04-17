import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStreak, incrementStreak, resetStreak } from '../streakManager';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Streak Manager', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStreak', () => {
    it('returns 0 when no streak exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const streak = await getStreak();
      expect(streak).toBe(0);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('userStreak');
    });

    it('returns the stored streak value', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
      const streak = await getStreak();
      expect(streak).toBe(5);
    });
  });

  describe('incrementStreak', () => {
    // Save original Date implementation
    const RealDate = global.Date;

    // Mock today's date
    beforeEach(() => {
      // Mock date to 2025-05-15
      const mockDate = new Date(2025, 4, 15);
      global.Date = jest.fn(() => mockDate) as any;
      global.Date.now = jest.fn(() => mockDate.getTime());
      global.Date.prototype = RealDate.prototype;
    });

    // Restore original Date implementation
    afterEach(() => {
      global.Date = RealDate;
    });

    it('starts a new streak when no previous streak exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === 'userStreak') return Promise.resolve(null);
        if (key === 'lastStreakDate') return Promise.resolve(null);
        return Promise.resolve(null);
      });

      const streak = await incrementStreak();
      
      expect(streak).toBe(1);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userStreak', '1');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('lastStreakDate', '2025-05-15');
    });

    it('does not increment streak if already updated today', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === 'userStreak') return Promise.resolve('3');
        if (key === 'lastStreakDate') return Promise.resolve('2025-05-15');
        return Promise.resolve(null);
      });

      const streak = await incrementStreak();
      
      expect(streak).toBe(3);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('continues streak if last update was yesterday', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === 'userStreak') return Promise.resolve('3');
        if (key === 'lastStreakDate') return Promise.resolve('2025-05-14');
        return Promise.resolve(null);
      });

      const streak = await incrementStreak();
      
      expect(streak).toBe(4);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userStreak', '4');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('lastStreakDate', '2025-05-15');
    });

    it('resets streak if last update was older than yesterday', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === 'userStreak') return Promise.resolve('10');
        if (key === 'lastStreakDate') return Promise.resolve('2025-05-12');
        return Promise.resolve(null);
      });

      const streak = await incrementStreak();
      
      expect(streak).toBe(1);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userStreak', '1');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('lastStreakDate', '2025-05-15');
    });
  });

  describe('resetStreak', () => {
    it('removes streak data from storage', async () => {
      await resetStreak();
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userStreak');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('lastStreakDate');
    });
  });
}); 