import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { adminDb } from "@/lib/firebase-admin";
import crypto from "crypto";
import {
  EXPLORE_PARSE_SYSTEM,
  buildExploreParsePrompt,
  EXPLORE_SKILL_MAP_SYSTEM,
  buildExploreSkillMapPrompt,
  EXPLORE_LEARNING_PATH_SYSTEM,
  buildExploreLearningPathPrompt,
} from "@/prompts/explore-role";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function callGroqJSON<T>(system: string, user: string, model = "llama-3.1-8b-instant"): Promise<T> {
  const response = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
    temperature: 0,
  });
  return JSON.parse(response.choices[0]?.message?.content || "{}") as T;
}

export async function POST(req: NextRequest) {
  try {
    const { job_title } = await req.json();

    if (!job_title) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    console.log(`[Explore] Pipeline starting for: "${job_title}"`);

    // 1. Parse role + seniority + company type
    const parsed = await callGroqJSON<any>(EXPLORE_PARSE_SYSTEM, buildExploreParsePrompt(job_title));
    console.log(`[Explore] Parsed:`, parsed);

    // 2. Generate skill map (Use 70b for high quality mapping)
    const skillMap = await callGroqJSON<any>(
      EXPLORE_SKILL_MAP_SYSTEM,
      buildExploreSkillMapPrompt(parsed.role, parsed.seniority, parsed.company_type),
      "llama-3.3-70b-versatile"
    );
    console.log(`[Explore] Skill map generated`);

    // 3. Generate learning path (Use 70b)
    const learningPath = await callGroqJSON<any>(
      EXPLORE_LEARNING_PATH_SYSTEM,
      buildExploreLearningPathPrompt(parsed.role, parsed.seniority, parsed.company_type, skillMap),
      "llama-3.3-70b-versatile"
    );
    console.log(`[Explore] Learning path generated`);

    // 4. Save to Firestore (using "explorations" collection)
    const shareToken = crypto.randomUUID();
    const explorationDoc = {
      share_token: shareToken,
      job_title_raw: job_title,
      role: parsed.role,
      seniority: parsed.seniority,
      company_type: parsed.company_type,
      mvc_skills: skillMap.mvc_skills,
      skill_map: skillMap,
      learning_path: learningPath,
      total_weeks: skillMap.total_weeks_from_zero,
      created_at: new Date().toISOString(),
    };

    if (adminDb) {
      await adminDb.collection("explorations").doc(shareToken).set(explorationDoc);
      console.log(`[Explore] ✓ Exploration saved:`, shareToken);
    }

    return NextResponse.json(explorationDoc);
  } catch (error) {
    console.error("[Explore] Error:", error);
    return NextResponse.json(
      { error: "Exploration failed", message: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
