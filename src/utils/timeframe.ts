/**
 * Calculates a timeframe in days based on the length of the goal string.
 * Returns a value between 30 and 1825 days (5 years).
 * 
 * @param goal - The goal text string
 * @returns Number of days between 30 and 1825
 */
export function calculateTimeframe(goal: string): number {
  // Calculate days based on string length (10 days per character)
  // Minimum of 30 days, maximum of 1825 days (5 years)
  return Math.min(1825, Math.max(30, goal.length * 10));
} 