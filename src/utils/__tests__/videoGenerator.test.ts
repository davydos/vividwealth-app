import { buildVideoPrompt } from '../videoGenerator';
import { generateVideo, checkVideoStatus } from '../videoGenerationClient';

// Mock timeout to speed up tests
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
});

describe('videoGenerationClient', () => {
  test('generateVideo returns a pending video with an id', async () => {
    const options = {
      goal: 'learn piano',
      timeframeDays: 180,
    };
    
    const result = await generateVideo(options);
    
    expect(result).toHaveProperty('id');
    expect(result.status).toBe('pending');
    expect(result.prompt).toContain('learn piano');
    expect(result.prompt).toContain('180 days');
  });
  
  test('checkVideoStatus returns status for a video id', async () => {
    const result = await checkVideoStatus('test-video-id');
    
    expect(result).toHaveProperty('id', 'test-video-id');
    expect(['pending', 'processing', 'completed', 'failed']).toContain(result.status);
    
    if (result.status === 'completed') {
      expect(result.url).toBeDefined();
    }
  });
}); 