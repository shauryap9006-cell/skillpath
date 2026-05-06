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
  const normalize = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  const jdNorm = jdSkills.map(s => ({ original: s, clean: normalize(s) }));
  const resumeNorm = resumeSkills.map(s => ({ original: s, clean: normalize(s) }));

  const matched: string[] = [];
  const missing: string[] = [];
  const matchedClean = new Set<string>();

  // Use fuzzy substring matching for robustness
  for (const jd of jdNorm) {
    let found = false;
    for (const res of resumeNorm) {
      if (
        jd.clean === res.clean || 
        (jd.clean.length > 3 && res.clean.includes(jd.clean)) || 
        (res.clean.length > 3 && jd.clean.includes(res.clean))
      ) {
        found = true;
        break;
      }
    }

    if (found) {
      matched.push(jd.original);
      matchedClean.add(jd.clean);
    } else {
      missing.push(jd.original);
    }
  }

  const extra = resumeSkills.filter(s => !matchedClean.has(normalize(s)));

  // Loophole Fix: Ensure 100% isn't given for empty JDs
  const totalWeight = Math.max(jdSkills.length, 5); 
  let gapScore = Math.round((matched.length / totalWeight) * 100);

  // Loophole Fix: Strategic Bonus for high-value extra skills
  // (We limit the bonus to 10% max to prevent over-inflation)
  if (extra.length > 0) {
      gapScore = Math.min(100, gapScore + Math.min(10, extra.length * 2));
  }

  return {
    matchedSkills: matched,
    missingSkills: missing,
    extraSkills: extra,
    gapScore,
  };
}
