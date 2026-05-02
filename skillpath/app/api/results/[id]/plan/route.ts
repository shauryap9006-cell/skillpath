import { NextRequest, NextResponse } from "next/server";
import { callGroqJSON } from "@/lib/groq";
import { adminDb } from "@/lib/firebase-admin";
import {
  PLAN_GENERATION_SYSTEM,
  buildPlanGenerationPrompt,
} from "@/prompts/generate-plan";
import type { LearningPlan } from "@/types/analysis";

import { getAuthUser } from "@/lib/auth-helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    if (!adminDb) {
      return NextResponse.json({ error: "database_unavailable" }, { status: 500 });
    }

    // 1. Fetch existing analysis
    const doc = await adminDb.collection("analyses").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const data = doc.data();

    // If plan already exists, just return it
    if (data?.learning_plan) {
      return NextResponse.json(data.learning_plan);
    }

    // 2. Generate plan using the most powerful model
    console.log(`[On-Demand Plan] Generating plan for ${id}...`);
    const learningPlan = await callGroqJSON<LearningPlan>(
      PLAN_GENERATION_SYSTEM,
      buildPlanGenerationPrompt(data?.skill_gaps || [], data?.company_type || "enterprise"),
      { model: "llama-3.3-70b-versatile", temperature: 0.2, maxTokens: 3000 }
    );

    // 3. Save it back to Firestore
    await adminDb.collection("analyses").doc(id).update({
      learning_plan: learningPlan
    });

    console.log(`[On-Demand Plan] ✓ Plan generated and saved for ${id}`);

    return NextResponse.json(learningPlan);
  } catch (error) {
    console.error("Plan generation error:", error);
    return NextResponse.json(
      { error: "generation_failed", message: "Failed to generate learning plan." },
      { status: 500 }
    );
  }
}
