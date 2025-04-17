/**
 * Utility functions for generating video content based on user goals
 */
import Constants from 'expo-constants';

/**
 * Builds a prompt for AI video generation based on a user's goal and timeframe
 * 
 * @param goal - The user's goal text
 * @param timeframeDays - The timeframe for achieving the goal in days
 * @returns A formatted prompt string for video generation
 */
export function buildVideoPrompt(goal: string, timeframeDays: number): string {
  return `Create a realistic luxury-style visualization video showing a user achieving the goal "${goal}" over ${timeframeDays} days.`;
}

/**
 * Generates a text prompt for video generation based on user's goal and timeframe
 * 
 * @param goal - The user's goal text
 * @param timeframeDays - The timeframe for achieving the goal in days
 * @returns Promise resolving to a formatted prompt string
 */
export async function generateTextPrompt(goal: string, timeframe: number): Promise<string> {
  // Enhance the prompt with relevant details based on the goal type and timeframe
  const enhancedPrompt = `Create a motivational visualization showing the journey of achieving "${goal}" over ${timeframe} days, with luxury aesthetics and inspiring scenes.`;
  return enhancedPrompt;
}

/**
 * Generates a visualization for a goal using guided visualization and affirmations
 * 
 * @param goal - The user's goal text
 * @param timeframeDays - The timeframe for achieving the goal in days
 * @returns Promise resolving to a video URL string
 */
export async function generateVisualization(goal: string, timeframeDays: number): Promise<string> {
  return fetchVisualizationVideo(goal, timeframeDays);
}

/**
 * Fetches a visualization video from the video API service
 * 
 * @param goal - The user's goal text
 * @param timeframe - The timeframe for achieving the goal in days
 * @returns Promise resolving to a video URL string
 */
export async function fetchVisualizationVideo(goal: string, timeframe: number): Promise<string> {
  const API_URL = Constants.expoConfig.extra.VIDEO_API_URL;
  const prompt = await generateTextPrompt(goal, timeframe);
  const { videoUrl } = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  }).then(r => r.json());
  return videoUrl;
} 