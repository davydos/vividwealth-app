/**
 * Utility functions for generating video content based on user goals
 */

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