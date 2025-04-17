import { buildVideoPrompt, generateVisualization } from '../videoGenerator';

// Speed up tests by bypassing setTimeout
jest.mock('global', () => ({
  ...global,
  setTimeout: (callback: Function) => callback(),
}));

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
    
    // Assert
    expect(url).toBeDefined();
    expect(typeof url).toBe('string');
    expect(url).toMatch(/^https:\/\/example\.com\/visualizations\/goal-\d+\.mp4$/);
  });
}); 