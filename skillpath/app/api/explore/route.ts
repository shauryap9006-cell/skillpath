/**
 * POST /api/explore
 *
 * Explore pipeline — generates a full skill map for any role.
 * 3 chained Groq calls with individual timeouts and fallback logic.
 */

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { callGroqJSON } from "@/lib/groq";
import { getDb } from "@/lib/firebase-admin";
import crypto from "crypto";
import {
  EXPLORE_PARSE_SYSTEM,
  buildExploreParsePrompt,
  EXPLORE_SKILL_MAP_SYSTEM,
  buildExploreSkillMapPrompt,
  EXPLORE_LEARNING_PATH_SYSTEM,
  buildExploreLearningPathPrompt,
} from "@/prompts/explore-role";

/** Race a promise against a timeout */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms)
    ),
  ]);
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "invalid_json", message: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    const { job_title } = body;
    if (!job_title || typeof job_title !== 'string' || !job_title.trim()) {
      return NextResponse.json(
        { error: "missing_field", message: "Job title is required." },
        { status: 400 }
      );
    }

    const sanitizedTitle = job_title.trim().slice(0, 200);
    console.log(`[Explore] Pipeline starting for: "${sanitizedTitle}"`);

    // ---- Step 1: Parse role, seniority, company type (15s timeout) ----
    let parsed: { role: string; seniority: string; company_type: string };
    try {
      parsed = await withTimeout(
        callGroqJSON<{ role: string; seniority: string; company_type: string }>(
          EXPLORE_PARSE_SYSTEM,
          buildExploreParsePrompt(sanitizedTitle),
          { model: "llama-3.1-8b-instant", temperature: 0 }
        ),
        15_000,
        "Role parsing"
      );

      // Validate parsed output
      if (!parsed.role) {
        parsed = { role: sanitizedTitle, seniority: "entry", company_type: "unknown" };
      }
      console.log(`[Explore] ✓ Parsed: ${parsed.role} (${parsed.seniority}, ${parsed.company_type})`);
    } catch (e) {
      console.warn("[Explore] Role parsing failed, using raw input:", e instanceof Error ? e.message : e);
      parsed = { role: sanitizedTitle, seniority: "entry", company_type: "unknown" };
    }

    // ---- Step 2: Generate skill map (20s timeout) ----
    let skillMap: any;
    try {
      skillMap = await withTimeout(
        callGroqJSON(
          EXPLORE_SKILL_MAP_SYSTEM,
          buildExploreSkillMapPrompt(parsed.role, parsed.seniority, parsed.company_type),
          { model: "llama-3.3-70b-versatile", temperature: 0, maxTokens: 2048 }
        ),
        20_000,
        "Skill map generation"
      );

      // Validate skill map
      if (!skillMap.categories || !skillMap.mvc_skills) {
        throw new Error("Invalid skill map format");
      }
      console.log("[Explore] ✓ Skill map generated");
    } catch (e) {
      console.error("[Explore] Skill map generation failed:", e instanceof Error ? e.message : e);
      return NextResponse.json({
        error: "generation_failed",
        message: "Failed to generate skill map. The AI service may be temporarily overloaded. Please try again in a few seconds.",
        stage: "skill_map",
      }, { status: 502 });
    }

    // ---- Step 3: Generate learning path (20s timeout) ----
    let learningPath: any = { weeks: [] };
    try {
      learningPath = await withTimeout(
        callGroqJSON(
          EXPLORE_LEARNING_PATH_SYSTEM,
          buildExploreLearningPathPrompt(parsed.role, parsed.seniority, parsed.company_type, skillMap),
          { model: "llama-3.3-70b-versatile", temperature: 0, maxTokens: 2048 }
        ),
        20_000,
        "Learning path generation"
      );
      console.log("[Explore] ✓ Learning path generated");
    } catch (e) {
      // Learning path is non-critical — proceed without it
      console.warn("[Explore] Learning path generation failed (non-critical):", e instanceof Error ? e.message : e);
      learningPath = { weeks: [] };
    }

    // ---- Build response document ----
    const shareToken = crypto.randomUUID();
    const explorationDoc = {
      share_token: shareToken,
      job_title_raw: sanitizedTitle,
      role: parsed.role,
      seniority: parsed.seniority,
      company_type: parsed.company_type,
      mvc_skills: skillMap.mvc_skills || [],
      skill_map: skillMap,
      learning_path: learningPath,
      total_weeks: skillMap.total_weeks_from_zero || 0,
      created_at: new Date().toISOString(),
    };

    // ---- Step 4: Save to Firestore (Await to prevent 404 race condition) ----
    try {
      const db = getDb();
      await db.collection("explorations").doc(shareToken).set(explorationDoc);
      console.log(`[Explore] ✓ Saved: ${shareToken}`);
    } catch (dbError: any) {
      console.error("[Explore] Firestore save failed:", dbError.message);
    }

    const duration = Date.now() - startTime;
    console.log(`[Explore] ✓ Complete in ${duration}ms | Token: ${shareToken}`);

    return NextResponse.json(explorationDoc);

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Explore] Pipeline crash after ${duration}ms:`, error);
    return NextResponse.json({
      error: "exploration_failed",
      message: error instanceof Error ? error.message : "An unexpected error occurred during exploration.",
    }, { status: 500 });
  }
}
