/**
 * MVC Profiler — finds the 4-5 "deal-breaker" skills
 * by cross-referencing the user's missing skills against
 * our trained MVC model (frequency data from 5000+ JDs).
 */

import type { MVCProfiles } from "@/types/analysis";
import mvcData from "@/data/mvc_model.json";

// Mapping of internal role slugs to user-friendly labels for UI display
const ROLE_LABELS: Record<string, string> = {
  "executive": "Executive",
  "engineering-leadership": "Engineering Leadership",
  "product-leadership": "Product Leadership",
  "marketing-leadership": "Marketing Leadership",
  "finance-leadership": "Finance Leadership",
  "operations-leadership": "Operations Leadership",
  "data-leadership": "Data Leadership",
  "it-leadership": "IT Leadership",
  "hr-leadership": "HR Leadership",
  "ai-researcher": "AI Researcher",
  "ml-engineer": "ML Engineer",
  "recruiter": "Recruiter",
  "growth-hacker": "Growth Hacker",
  "solutions-architect": "Solutions Architect",
  "blockchain-developer": "Blockchain Developer",
  "game-developer": "Game Developer",
  "cybersecurity": "Cybersecurity",
  "robotics-engineer": "Robotics Engineer",
  "hardware-engineer": "Hardware Engineer",
  "network-engineer": "Network Engineer",
  "database-admin": "Database Admin",
  "mobile-developer": "Mobile Developer",
  "frontend-developer": "Frontend Developer",
  "backend-developer": "Backend Developer",
  "fullstack-developer": "Fullstack Developer",
  "devops": "DevOps",
  "qa-engineer": "QA Engineer",
  "embedded-systems": "Embedded Systems",
  "cloud-infra": "Cloud Infrastructure",
  "data-engineer": "Data Engineer",
  "product-manager": "Product Manager",
  "technical-program-manager": "Technical Program Manager",
  "scrum-master": "Scrum Master",
  "project-manager": "Project Manager",
  "operations-manager": "Operations Manager",
  "business-analyst": "Business Analyst",
  "finance": "Finance",
  "risk-compliance": "Risk & Compliance",
  "supply-chain": "Supply Chain",
  "data-professional": "Data Professional",
  "sales-engineer": "Sales Engineer",
  "sales-manager": "Sales Manager",
  "sales": "Sales",
  "performance-marketer": "Performance Marketer",
  "brand-manager": "Brand Manager",
  "marketing": "Marketing",
  "customer-success": "Customer Success",
  "support": "Support",
  "consultant": "Consultant",
  "hr": "HR",
  "legal": "Legal",
  "designer": "Designer",
  "content-creator": "Content Creator",
  "technical-writer": "Technical Writer",
  "graphic-designer": "Graphic Designer",
  "healthcare-analyst": "Healthcare Analyst",
  "healthcare-practitioner": "Healthcare Practitioner",
  "scientist": "Scientist",
  "educator": "Educator",
  "it-admin": "IT Admin",
  "software-engineer": "Software Engineer",
  "other": "Other"
};

/**
 * Returns a formatted label for a given role slug.
 */
export function getRoleLabel(slug: string): string {
  return ROLE_LABELS[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}


const mvcProfiles: MVCProfiles = mvcData as MVCProfiles;

/**
 * Detect the role category from the JD text.
 */
function detectRoleCategory(jdText: string): string {
  const t = jdText.toLowerCase();

  // 1. Executive / C-Suite
  if (t.includes("chief executive") || t.includes(" ceo") || t.includes("founder") || t.includes("managing director") || t.includes("president")) return "executive";
  if (t.includes("chief technology") || t.includes(" cto") || t.includes("chief architect") || t.includes("vp engineering") || t.includes("head of engineering")) return "engineering-leadership";
  if (t.includes("chief product") || t.includes(" cpo") || t.includes("vp product") || t.includes("head of product")) return "product-leadership";
  if (t.includes("chief marketing") || t.includes(" cmo") || t.includes("vp marketing") || t.includes("head of marketing")) return "marketing-leadership";
  if (t.includes("chief financial") || t.includes(" cfo") || t.includes("vp finance") || t.includes("head of finance")) return "finance-leadership";
  if (t.includes("chief operating") || t.includes(" coo") || t.includes("vp operations") || t.includes("head of operations")) return "operations-leadership";
  if (t.includes("chief data") || t.includes(" cdo") || t.includes("chief ai") || t.includes("vp data") || t.includes("head of data") || t.includes("head of ai")) return "data-leadership";
  if (t.includes("chief information") || t.includes(" cio") || t.includes("chief security") || t.includes(" ciso")) return "it-leadership";
  if (t.includes("chief people") || t.includes("chief hr") || t.includes("vp people") || t.includes("vp hr") || t.includes("head of hr") || t.includes("head of people")) return "hr-leadership";

  // 2. Highly Specific Niche Roles
  if (t.includes("machine learning scientist") || t.includes("ai researcher") || t.includes("deep learning") || t.includes("llm researcher")) return "ai-researcher";
  if (t.includes("machine learning engineer") || t.includes("ml engineer") || t.includes("mle") || t.includes("mlops")) return "ml-engineer";
  if (t.includes("talent acquisition") || t.includes("recruiter") || t.includes("headhunter")) return "recruiter";
  if (t.includes("growth hacker") || t.includes("growth engineer")) return "growth-hacker";
  if (t.includes("solutions architect") || t.includes("cloud architect") || t.includes("enterprise architect")) return "solutions-architect";
  if (t.includes("blockchain") || t.includes("solidity") || t.includes("web3") || t.includes("crypto") || t.includes("smart contract")) return "blockchain-developer";
  if (t.includes("game") || t.includes("unity") || t.includes("unreal") || t.includes("gameplay")) return "game-developer";
  if (t.includes("cyber") || t.includes("security engineer") || t.includes("infosec") || t.includes("penetration") || t.includes("pentester")) return "cybersecurity";
  if (t.includes("robotics") || t.includes("ros engineer") || t.includes("mechatronics")) return "robotics-engineer";
  if (t.includes("hardware engineer") || t.includes("vlsi") || t.includes("circuit design") || t.includes("electrical engineer")) return "hardware-engineer";
  if (t.includes("network engineer") || t.includes("network administrator") || t.includes("cisco")) return "network-engineer";
  if (t.includes("database administrator") || t.includes("dba") || t.includes("database engineer")) return "database-admin";

  // 3. Specialized Engineering
  if (t.includes("mobile") || t.includes("ios") || t.includes("android") || t.includes("swift") || t.includes("kotlin") || t.includes("flutter")) return "mobile-developer";
  if (t.includes("frontend") || t.includes("front-end") || t.includes("react") || t.includes("next.js") || t.includes("vue") || t.includes("angular")) return "frontend-developer";
  if (t.includes("backend") || t.includes("back-end") || t.includes("node.js") || t.includes("go engineer") || t.includes("django")) return "backend-developer";
  if (t.includes("full stack") || t.includes("fullstack") || t.includes("full-stack")) return "fullstack-developer";
  if (t.includes("devops") || t.includes("sre") || t.includes("site reliability") || t.includes("platform engineer")) return "devops";
  if (t.includes("qa") || t.includes("quality assurance") || t.includes("test engineer") || t.includes("automation") || t.includes("sdet")) return "qa-engineer";
  if (t.includes("embedded") || t.includes("firmware") || t.includes("microcontroller") || t.includes("rtos")) return "embedded-systems";
  if (t.includes("cloud") || t.includes("infrastructure") || t.includes("aws") || t.includes("azure") || t.includes("kubernetes")) return "cloud-infra";
  if (t.includes("data engineer") || t.includes("etl") || t.includes("data pipeline") || t.includes("analytics engineer")) return "data-engineer";

  // 4. Specialized Business / Management
  if (t.includes("product manager") || t.includes("product owner") || t.includes("product lead")) return "product-manager";
  if (t.includes("technical program manager") || t.includes("tpm")) return "technical-program-manager";
  if (t.includes("scrum master") || t.includes("agile coach")) return "scrum-master";
  if (t.includes("project manager") || t.includes("pmp") || t.includes("program manager")) return "project-manager";
  if (t.includes("operations manager") || t.includes("operations lead") || t.includes("biz ops") || t.includes("business operations")) return "operations-manager";
  if (t.includes("business analyst") || t.includes("business systems analyst")) return "business-analyst";
  if (t.includes("financial planning") || t.includes("finance manager") || t.includes("accounting") || t.includes("fp&a") || t.includes("analyst finance")) return "finance";
  if (t.includes("risk analyst") || t.includes("risk manager") || t.includes("compliance officer")) return "risk-compliance";
  if (t.includes("supply chain") || t.includes("logistics") || t.includes("procurement")) return "supply-chain";

  // 5. Data / Analytics
  if (t.includes("data analyst") || t.includes("data scientist") || t.includes("machine learning") || t.includes("bi analyst")) return "data-professional";

  // 6. Sales
  if (t.includes("sales engineer") || t.includes("presales") || t.includes("solution engineer")) return "sales-engineer";
  if (t.includes("sales manager") || t.includes("sales director") || t.includes("vp sales") || t.includes("head of sales")) return "sales-manager";
  if (t.includes("sales") || t.includes("account executive") || t.includes("sdr") || t.includes("bdr")) return "sales";

  // 7. Marketing
  if (t.includes("demand generation") || t.includes("performance marketing") || t.includes("paid media") || t.includes("seo") || t.includes("email marketing")) return "performance-marketer";
  if (t.includes("brand manager") || t.includes("brand strategist") || t.includes("brand director")) return "brand-manager";
  if (t.includes("marketing manager") || t.includes("marketing director") || t.includes("vp marketing") || t.includes("marketing") || t.includes("growth") || t.includes("social media manager")) return "marketing";

  // 8. Customer-Facing
  if (t.includes("customer success") || t.includes("customer success manager") || t.includes("csm") || t.includes("account manager")) return "customer-success";
  if (t.includes("customer support") || t.includes("support engineer") || t.includes("technical support") || t.includes("helpdesk")) return "support";

  // 9. Consulting / Strategy
  if (t.includes("management consultant") || t.includes("strategy consultant") || t.includes("consultant") || t.includes("consulting") || t.includes("strategy analyst")) return "consultant";

  // 10. People / HR
  if (t.includes("hr") || t.includes("human resources") || t.includes("people operations") || t.includes("people partner") || t.includes("compensation")) return "hr";

  // 11. Legal
  if (t.includes("legal") || t.includes("lawyer") || t.includes("attorney") || t.includes("counsel") || t.includes("compliance") || t.includes("paralegal")) return "legal";

  // 12. Design / Creative
  if (t.includes("product designer") || t.includes("ux designer") || t.includes("ui designer") || t.includes("designer") || t.includes("ux") || t.includes("ui") || t.includes("figma")) return "designer";
  if (t.includes("content creator") || t.includes("content writer") || t.includes("video editor") || t.includes("copywriter")) return "content-creator";
  if (t.includes("technical writer") || t.includes("documentation engineer") || t.includes("api writer")) return "technical-writer";
  if (t.includes("motion designer") || t.includes("graphic designer") || t.includes("animator") || t.includes("creative director")) return "graphic-designer";

  // 13. Healthcare / Science
  if (t.includes("healthcare analyst") || t.includes("clinical analyst") || t.includes("health informatics")) return "healthcare-analyst";
  if (t.includes("nurse") || t.includes("physician") || t.includes("clinician") || t.includes("pharmacist") || t.includes("therapist")) return "healthcare-practitioner";
  if (t.includes("research scientist") || t.includes("scientist") || t.includes("bioinformatics") || t.includes("chemist")) return "scientist";

  // 14. Education / Training
  if (t.includes("teacher") || t.includes("instructor") || t.includes("professor") || t.includes("lecturer") || t.includes("trainer") || t.includes("coach")) return "educator";

  // 15. IT / System Administration
  if (t.includes("it manager") || t.includes("sysadmin") || t.includes("system administrator") || t.includes("systems engineer") || t.includes("it specialist")) return "it-admin";

  // 16. Generic Fallback
  if (t.includes("software") || t.includes("developer") || t.includes("engineer") || t.includes("programmer") || t.includes("coder")) return "software-engineer";

  return "other";
}


/**
 * Instantly get the standard skills for a role based on JD text,
 * bypassing the need for AI extraction. Returns the top 15-20 skills.
 */
export function getRoleStandardSkills(jdText: string): string[] {
  const roleCategory = detectRoleCategory(jdText);
  const roleData = mvcProfiles[roleCategory] ?? mvcProfiles["other"];
  const skills = Array.isArray(roleData) ? roleData : (roleData?.skills ?? []);
  
  return skills.map(entry => entry.skill);
}

/**
 * Extract skills from text using keyword matching.
 * Uses word boundary regex for accuracy.
 * Dynamically builds the skill list from the MVC dataset.
 */
export function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  
  // 1. Build a unique list of all skills we track in our model
  const allKnownSkills = new Set<string>();
  Object.values(mvcProfiles).forEach(roleData => {
    const skills = Array.isArray(roleData) ? roleData : (roleData?.skills ?? []);
    skills.forEach(s => allKnownSkills.add(s.skill.toLowerCase()));
  });

  const found: string[] = [];
  for (const skill of allKnownSkills) {
    if (skill.includes(" ")) {
      if (lower.includes(skill)) {
        found.push(skill);
      }
    } else {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(lower)) {
        found.push(skill);
      }
    }
  }
  return Array.from(new Set(found));
}

/**
 * Given the user's missing skills, return the top 4-5 "must have" skills
 * and the required degree for the role.
 */
export function getMVCProfile(
  missingSkills: string[],
  jdText: string
): { mvcSkills: string[]; roleCategory: string; requiredDegree?: string } {
  const roleCategory = detectRoleCategory(jdText);
  const roleData = mvcProfiles[roleCategory] ?? mvcProfiles["other"];
  
  const skills = Array.isArray(roleData) ? roleData : (roleData?.skills ?? []);
  const requiredDegree = Array.isArray(roleData) ? undefined : roleData?.required_degree;

  const topSkills = skills.map((entry) => entry.skill.toLowerCase());
  const missingNorm = missingSkills.map((s) => s.toLowerCase());
  const mvcHits = missingNorm.filter((s) => topSkills.includes(s));

  if (mvcHits.length < 2) {
    return {
      mvcSkills: skills.slice(0, 20).map((e) => e.skill),
      roleCategory,
      requiredDegree,
    };
  }

  return {
    mvcSkills: mvcHits.slice(0, 20),
    roleCategory,
    requiredDegree,
  };
}

/**
 * Rank skill gaps locally using MVC model frequency data.
 */
export function rankGapsLocally(
  missingSkills: string[],
  mvcSkills: string[],
  companyType: string,
  roleCategory: string
): any[] {
  const mvcSet = new Set(mvcSkills.map(s => s.toLowerCase()));
  const roleData = mvcProfiles[roleCategory] ?? mvcProfiles["other"];
  const skills = Array.isArray(roleData) ? roleData : (roleData?.skills ?? []);
  
  const freqMap: Record<string, number> = {};
  skills.forEach(item => {
    freqMap[item.skill.toLowerCase()] = item.count;
  });
  
  return missingSkills.map((skill, index) => {
    const sNorm = skill.toLowerCase();
    const isMvc = mvcSet.has(sNorm);
    const frequency = freqMap[sNorm] || 0;
    
    let weeks = 2;
    if (["python", "java", "c++", "c#", "rust", "go", "machine learning", "deep learning", "kubernetes", "terraform"].includes(sNorm)) {
      weeks = 4;
    } else if (["react", "angular", "vue", "typescript", "docker", "aws", "azure"].includes(sNorm)) {
      weeks = 3;
    } else if (["git", "agile", "html", "css"].includes(sNorm)) {
      weeks = 1;
    }
    
    let reason = `${skill} is a relevant skill for this career path.`;
    if (isMvc) {
      const freqPercent = frequency > 0 ? `found in ${Math.round((frequency/10000)*100)}% of JDs` : "a must-have skill";
      reason = `${skill} is a core "Minimum Viable Candidate" skill (${freqPercent}).`;
    }
    
    return {
      skill,
      priority: isMvc ? 1 : 2,
      frequency,
      weeks_to_learn: weeks,
      reason,
      in_mvc: isMvc,
    };
  })
  .sort((a, b) => {
    if (a.in_mvc && !b.in_mvc) return -1;
    if (!a.in_mvc && b.in_mvc) return 1;
    if (a.frequency !== b.frequency) return b.frequency - a.frequency;
    return 0;
  })
  .map((gap, i) => ({ ...gap, priority: i + 1 }));
}
