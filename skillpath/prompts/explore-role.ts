/**
 * Prompts for the "Dream Job Explorer" feature.
 * This feature allows users to explore a role's skill map without a JD or Resume.
 */

// 1. Parse job title + detect context
export const EXPLORE_PARSE_SYSTEM = `
Extract the role, seniority level, and company type from the job title input.
Return ONLY a JSON object. No explanation. No markdown.
Output format:
{
  "role": "Data Analyst",
  "seniority": "entry" | "mid" | "senior",
  "company_type": "startup" | "scaleup" | "enterprise" | "agency" | "unknown"
}
If seniority is not specified, default to "entry".
If company type is not specified, default to "unknown".
`;

export function buildExploreParsePrompt(input: string): string {
  return input;
}

// 2. Generate full skill map
export const EXPLORE_SKILL_MAP_SYSTEM = `
You are a senior technical recruiter with 10 years of experience hiring for tech roles.
Generate a complete, accurate skill map for the role and context below.

Rules:
- Return ONLY a JSON object. No explanation. No markdown. No preamble.
- Group skills into categories: technical_core, technical_tools, analytical, soft_skills
- For each skill include:
    - name: string
    - importance: "essential" | "high" | "medium" | "growing"
    - weeks_to_learn: integer (honest estimate, 1hr/day, from beginner)
    - frequency_pct: integer (0–100, how often this appears in real JDs for this role)
    - note: one short sentence of context (optional, only if genuinely useful)
- Order each category by importance descending, then frequency_pct descending
- Do not pad with irrelevant skills. Be precise.
- Calibrate for seniority and company type.

Output format:
{
  "role": "Data Analyst",
  "seniority": "entry",
  "company_type": "startup",
  "mvc_skills": ["SQL", "Python", "Excel", "Tableau"],
  "categories": {
    "technical_core": [...],
    "technical_tools": [...],
    "analytical": [...],
    "soft_skills": [...]
  },
  "total_weeks_from_zero": 17,
  "fastest_growing_skill": "dbt",
  "most_demanded_skill": "SQL"
}
`;

export function buildExploreSkillMapPrompt(role: string, seniority: string, companyType: string): string {
  return `Role: ${role}\nSeniority: ${seniority}\nCompany type: ${companyType}`;
}

// 3. Generate role-specific learning path
export const EXPLORE_LEARNING_PATH_SYSTEM = `
Generate a week-by-week learning path to go from zero to hireable for this role.
For each week output: week number, skill, resource title, URL, start_at timestamp,
skip_note, project to build, why this project matters for interviews at this role/company type.
Sequence skills by dependency — foundations before advanced.
Return ONLY a JSON object. No markdown. No explanation.

Output format:
{
  "weeks": [
    {
      "week": 1,
      "skill": "SQL Basics",
      "resources": [
        {
          "title": "SQL for Beginners",
          "url": "https://...",
          "start_at": "0:00",
          "skip_note": "Skip the setup part",
          "project": "Build a library DB",
          "why": "Shows you can model real-world data"
        }
      ]
    }
  ]
}
`;

export function buildExploreLearningPathPrompt(role: string, seniority: string, companyType: string, skillMap: any): string {
  return `Role: ${role}\nSeniority: ${seniority}\nCompany type: ${companyType}\nSkill map: ${JSON.stringify(skillMap)}`;
}
