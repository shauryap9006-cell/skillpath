// lib/profile-utils.ts
import { PIN_COLORS } from './readiness';

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function nameToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PIN_COLORS[Math.abs(hash) % PIN_COLORS.length];
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function computeWeeksRemaining(
  skills: { state: string; weeks_to_learn?: number }[]
): number {
  const remaining = skills.filter(s => s.state !== 'learned');
  if (!remaining.length) return 0;
  const total = remaining.reduce((sum, s) => sum + (s.weeks_to_learn || 1), 0);
  return Math.ceil(total / Math.max(1, remaining.length));
}
