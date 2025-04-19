import { buildVideoPrompt, generateVisualization } from '../videoGenerator';

// Mock Expo Constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      VIDEO_API_URL: 'https://example.com/api/videos'
    }
  }
}));

// Speed up tests by mocking setTimeout directly
jest.useFakeTimers();

// Mock fetch API
global.fetch = jest.fn().mockImplementation(() => 
  Promise.resolve({
    json: () => Promise.resolve({ videoUrl: 'https://example.com/visualizations/goal-12345.mp4' }),
  })
);

describe('videoGenerator', () => {
  test('buildVideoPrompt formats prompt correctly', () => {
    const goal = 'save $10,000';
    const timeframeDays = 365;
    
    const prompt = buildVideoPrompt(goal, timeframeDays);
    
    expect(prompt).toBe(
      'Create a realistic luxury-style visualization video showing a user achieving the goal "save $10,000" over 365 days.'
    );
  });

  test('generateVisualization creates prompt with affirmations and returns video URL', async () => {
    // Set up
    const goal = 'learn piano';
    const timeframeDays = 180;
    
    // Act
    const url = await generateVisualization(goal, timeframeDays);
    
    // Advance all timers to resolve any pending promises
    jest.runAllTimers();
    
    // Assert
    expect(url).toBeDefined();
    expect(typeof url).toBe('string');
    expect(url).toMatch(/^https:\/\/example\.com\/visualizations\/goal-\d+\.mp4$/);
  });
}); 