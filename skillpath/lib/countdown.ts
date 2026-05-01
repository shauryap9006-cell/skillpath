/**
 * Countdown Calculator — determines the "Ready by [Date]" 
 * based on total learning hours and a configurable study pace.
 */

export interface CountdownResult {
  readyByDate: string;       // ISO date string, e.g. "2025-07-03"
  weeksRequired: number;
  totalHours: number;
  hoursPerDay: number;
}

/**
 * Calculate the "ready by" date from a list of ranked gaps.
 * 
 * @param gaps - Array of skill gaps with weeks_to_learn estimates
 * @param hoursPerDay - Study pace (default: 1 hr/day)
 * @returns The projected ready-by date and totals
 */
export function calculateCountdown(
  gaps: Array<{ skill: string; weeks_to_learn: number }>,
  hoursPerDay: number = 1
): CountdownResult {
  // Assume parallel learning factor of 2 (learning 2 things at once)
  const rawTotalWeeks = gaps.reduce((sum, g) => sum + g.weeks_to_learn, 0);
  const totalWeeks = Math.ceil(rawTotalWeeks / 2);

  // 1 week = 7 hours at 1hr/day
  const totalHours = totalWeeks * 7 * hoursPerDay;

  // Actual days needed = totalHours / hoursPerDay
  const daysNeeded = Math.ceil(totalHours / hoursPerDay);

  const today = new Date();
  const readyDate = new Date(today);
  readyDate.setDate(readyDate.getDate() + daysNeeded);

  return {
    readyByDate: readyDate.toISOString().split("T")[0],
    weeksRequired: totalWeeks,
    totalHours,
    hoursPerDay,
  };
}
