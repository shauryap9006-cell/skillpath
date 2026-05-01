// Prompt: Generate week-by-week learning plan
export const PLAN_GENERATION_SYSTEM = `You are a curriculum designer. Generate a week-by-week learning plan for the skill gaps below.
Return ONLY a JSON object with a "weeks" array. No markdown. No explanation.
Each week should focus on one primary skill.

Each element in the "weeks" array MUST have this exact shape:
{
  "week": <number>,
  "skill": "<skill name>",
  "resources": [
    {
      "title": "<resource title>",
      "url": "<real free URL: YouTube, freeCodeCamp, MDN, or official docs>",
      "start_at": "<optional: where to start in the resource>",
      "skip_note": "<optional: what to skip>",
      "project": "<a hands-on project to build>",
      "why": "<why this project matters for interviews>"
    }
  ]
}

Each week MUST contain a "resources" array with at least one resource object.`;

export function buildPlanGenerationPrompt(
  rankedGaps: Array<{ skill: string; priority: number; weeks_to_learn: number }>,
  companyType: string
): string {
  return `Skill gaps (ranked): ${JSON.stringify(rankedGaps)}\nCompany type: ${companyType}`;
}
