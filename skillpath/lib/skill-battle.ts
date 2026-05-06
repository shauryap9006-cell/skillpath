/**
 * Skill Battle Engine — Feature 15
 * 
 * Uses the MVC Model (320k+ samples) to simulate "community votes"
 * and generate data-driven verdicts for "Should I learn X or Y?" questions.
 */

import mvcData from './data/mvc_model.json';
import type { MVCProfiles } from '@/types/analysis';

const mvcProfiles: MVCProfiles = mvcData as MVCProfiles;

export interface BattleResult {
  optionA: {
    name: string;
    votes: number;
    premium: number;
    trend: number;
  };
  optionB: {
    name: string;
    votes: number;
    premium: number;
    trend: number;
  };
  verdict: string;
  totalVotes: number;
  winner: 'A' | 'B' | 'TIE';
}

/**
 * Aggregates market data for a specific skill across all roles
 */
function getSkillMarketData(skillName: string) {
  let count = 0;
  let totalPremium = 0;
  let premiumOccurrences = 0;
  let latestTrend = 0;
  let trendSamples = 0;

  const target = skillName.toLowerCase().trim();

  // Iterate through all role profiles in the MVC model
  for (const roleKey in mvcProfiles) {
    const roleData = mvcProfiles[roleKey];
    const skills = Array.isArray(roleData) ? roleData : (roleData?.skills ?? []);

    const found = skills.find((s: any) => s.skill.toLowerCase() === target);
    if (found) {
      count += found.count || 0;
      if (found.premium && found.premium > 0) {
        totalPremium += found.premium;
        premiumOccurrences++;
      }
      // Get the latest trend value (2024)
      if (found.trend && found.trend['2024']) {
        latestTrend += found.trend['2024'];
        trendSamples++;
      }
    }
  }

  return {
    name: skillName,
    votes: count,
    premium: premiumOccurrences > 0 ? Math.round(totalPremium / premiumOccurrences) : 0,
    trend: trendSamples > 0 ? latestTrend / trendSamples : 0
  };
}

/**
 * Generates a Skill Battle result using ML model data
 */
export function conductSkillBattle(skillA: string, skillB: string): BattleResult {
  const dataA = getSkillMarketData(skillA);
  const dataB = getSkillMarketData(skillB);

  // If both have 0 votes, they aren't in our model
  if (dataA.votes === 0 && dataB.votes === 0) {
    return {
      optionA: dataA,
      optionB: dataB,
      verdict: "The market is currently undecided on these niche technologies.",
      totalVotes: 0,
      winner: 'TIE'
    };
  }

  // Determine winner based on adoption (votes) and momentum (trend)
  // Scoring formula: votes (adoption) weight 0.7, trend (momentum) weight 0.3
  const scoreA = (dataA.votes * 0.7) + (dataA.trend * 10000 * 0.3);
  const scoreB = (dataB.votes * 0.7) + (dataB.trend * 10000 * 0.3);

  let winner: 'A' | 'B' | 'TIE' = 'TIE';
  if (scoreA > scoreB * 1.05) winner = 'A';
  else if (scoreB > scoreA * 1.05) winner = 'B';

  const winningName = winner === 'A' ? dataA.name : (winner === 'B' ? dataB.name : null);

  let verdict = "";
  if (winner === 'TIE') {
    verdict = `It's a dead heat. Both ${dataA.name} and ${dataB.name} are essential in the current market.`;
  } else {
    // Generate context-aware one-line verdict
    const winData = winner === 'A' ? dataA : dataB;
    const isHighPremium = winData.premium > 5000;
    const isTrending = winData.trend > 0.1;

    if (isTrending && isHighPremium) {
      verdict = `Learn ${winningName} — it has massive momentum and a high salary premium.`;
    } else if (winData.votes > (winner === 'A' ? dataB.votes : dataA.votes) * 2) {
      verdict = `Learn ${winningName} first — it's the industry standard with ${winData.votes.toLocaleString()} market samples.`;
    } else if (isHighPremium) {
      verdict = `${winningName} is the winner — it offers a significant salary boost in the current climate.`;
    } else {
      verdict = `Go with ${winningName} — the data shows stronger overall adoption for this path.`;
    }
  }

  return {
    optionA: dataA,
    optionB: dataB,
    verdict,
    totalVotes: dataA.votes + dataB.votes,
    winner
  };
}
