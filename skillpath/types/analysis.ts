// ---- Analysis Types ----

export interface SkillGap {
  skill: string;
  priority: number;
  weeks_to_learn: number;
  reason: string;
  in_mvc: boolean;
}

export interface Resource {
  title: string;
  url: string;
  start_at?: string;
  skip_note?: string;
  project?: string;
  project_url?: string;
  why?: string;
  source?: string;
}

export interface SkillResources {
  focus_summary: string;
  estimated_weeks: number;
  resources: Resource[];
}

export interface WeekPlan {
  week: number;
  skill: string;
  resources: Resource[];
}

export interface LearningPlan {
  weeks: WeekPlan[];
}

export interface AnalysisResult {
  share_token: string;
  gap_score: number;
  mvc_skills: string[];
  ready_by_date: string;
  weeks_required: number;
  company_type: string;
  role_category?: string;
  role_label?: string;
  jd_skills: string[];
  resume_skills: string[];
  skill_gaps: SkillGap[];
  learning_plan?: LearningPlan;
  jd_preview: string;
  created_at: string;
  generated_resources?: Record<string, SkillResources>;
}

export interface AnalysisRequest {
  jd_text: string;
  resume_text: string;
}

// ---- Skill Types ----

export interface NormalizedSkill {
  canonical: string;
  variants: string[];
}

// ---- MVC Types ----

export interface MVCSkillEntry {
  skill: string;
  count: number;
}

export interface MVCRoleData {
  skills: MVCSkillEntry[];
  required_degree?: string;
}

export interface MVCProfiles {
  [role: string]: MVCRoleData | MVCSkillEntry[];
}
