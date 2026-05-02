import type { TrackedSkill, SkillState } from '@/types/active-job';

export function computeReadiness(skills: TrackedSkill[]): number {
  if (!skills || skills.length === 0) return 0;

  // Log what we're receiving
  console.log('[computeReadiness] skills:', skills.map(s => `${s.skill}:${s.state}`));

  const stateValue = (state: SkillState): number => {
    if (state === 'learned')     return 1.0;
    if (state === 'in_progress') return 0.5;
    return 0;
  };

  const totalWeight = skills.reduce((sum, s) => {
    // Guard against priority=0 or negative
    const w = Math.max(1, 6 - (s.priority || 3)); 
    return sum + w;
  }, 0);

  const earned = skills.reduce((sum, s) => {
    const w = Math.max(1, 6 - (s.priority || 3));
    const v = stateValue(s.state);
    console.log(`  ${s.skill}: priority=${s.priority} weight=${w} state=${s.state} value=${v}`);
    return sum + w * v;
  }, 0);

  const score = totalWeight === 0 ? 0 : Math.round((earned / totalWeight) * 100);
  console.log(`[computeReadiness] earned=${earned} total=${totalWeight} score=${score}`);
  return score;
}

export const PIN_COLORS = [
  '#7F77DD', // lavender
  '#1D9E75', // teal
  '#D4537E', // pink
  '#BA7517', // amber
  '#378ADD', // blue
  '#D85A30', // coral
];

export function nextPinColor(usedColors: string[]): string {
  const available = PIN_COLORS.filter(c => !usedColors.includes(c));
  if (available.length === 0) return PIN_COLORS[Math.floor(Math.random() * PIN_COLORS.length)];
  return available[0];
}
