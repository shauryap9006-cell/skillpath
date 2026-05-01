/**
 * Gap Scorer — diffs required vs demonstrated skills and calculates match %.
 */

export interface GapResult {
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
  gapScore: number; // 0-100, where 100 = perfect match
}

/**
 * Compare JD-required skills against resume-demonstrated skills.
 * Returns the match percentage and categorized skill lists.
 */
export function scoreGap(
  jdSkills: string[],
  resumeSkills: string[]
): GapResult {
  const normalize = (s: string) => s.toLowerCase().trim();

  const jdNorm = jdSkills.map(normalize);
  const resumeNorm = resumeSkills.map(normalize);

  const resumeSet = new Set(resumeNorm);

  const matched: string[] = [];
  const missing: string[] = [];

  for (let i = 0; i < jdNorm.length; i++) {
    if (resumeSet.has(jdNorm[i])) {
      matched.push(jdSkills[i]);
    } else {
      missing.push(jdSkills[i]);
    }
  }

  const jdSet = new Set(jdNorm);
  const extra = resumeSkills.filter((s) => !jdSet.has(normalize(s)));

  const gapScore =
    jdSkills.length > 0
      ? Math.round((matched.length / jdSkills.length) * 100)
      : 100;

  return {
    matchedSkills: matched,
    missingSkills: missing,
    extraSkills: extra,
    gapScore,
  };
}
