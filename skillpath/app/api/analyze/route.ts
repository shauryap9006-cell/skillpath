/**
 * POST /api/analyze
 * 
 * 100% LOCAL pipeline — no AI calls for core matching:
 * 1. Extract skills from JD & Resume using keyword matching (Instant)
 * 2. Score gaps locally
 * 3. Detect company type locally
 * 4. Build MVC profile from trained dataset
 * 5. Rank gaps using dataset frequency
 * 6. AI Summary: Groq (Llama 3.1) for Professional Profile
 * 7. Save to Firestore
 * 
 * This is INSTANT — no rate limits for extraction, minimal latency for summary.
 */

import { NextRequest, NextResponse } from "next/server";
import { scoreGap } from "@/lib/gap-scorer";
import { getMVCProfile, getRoleStandardSkills, extractSkills, rankGapsLocally, getRoleLabel } from "@/lib/mvc-profiler";
import { calculateCountdown } from "@/lib/countdown";
import { detectCompanyType } from "@/lib/company-detector";
import { adminDb } from "@/lib/firebase-admin";
import type { SkillGap } from "@/types/analysis";
import crypto from "crypto";
import Groq from "groq-sdk";
import pdf from "pdf-parse";
import { getAuthUser } from "@/lib/auth-helpers";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "fallback_key_not_set" });

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "unauthorized", message: "Please sign in to analyze your resume." }, { status: 401 });
    }
    let jd_text = "";
    let resume_text = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      let formData;
      try {
        formData = await req.formData();
      } catch (err) {
        return NextResponse.json({ error: "bad_request", message: "Malformed form data." }, { status: 400 });
      }
      console.log("[Pipeline] Received FormData keys:", Array.from(formData.keys()));

      jd_text = (formData.get("jd_text") as string) || "";

      const resumeFile = formData.get("resume_file") as File | null;
      const rawResumeText = (formData.get("resume_text") as string) || "";

      if (resumeFile && resumeFile.size > 0) {
        console.log(`[Pipeline] Processing File: ${resumeFile.name}, Size: ${resumeFile.size} bytes`);
        const buffer = Buffer.from(await resumeFile.arrayBuffer());
        try {
          const data = await pdf(buffer);
          resume_text = data.text;
          console.log(`[Pipeline] Extracted ${resume_text.length} chars from PDF`);
        } catch (pdfError) {
          console.error("[Pipeline] PDF Extraction Error:", pdfError);
          resume_text = rawResumeText;
        }
      } else {
        resume_text = rawResumeText;
        console.log(`[Pipeline] Using raw resume text (${resume_text.length} chars)`);
      }
    } else {
      let body;
      try {
        body = await req.json();
      } catch (err) {
        return NextResponse.json({ error: "bad_request", message: "Malformed JSON body." }, { status: 400 });
      }
      jd_text = body.jd_text;
      resume_text = body.resume_text;
      console.log("[Pipeline] Received JSON input");
    }

    console.log(`[Pipeline] Final JD Length: ${jd_text?.length}, Resume Length: ${resume_text?.length}`);

    if (!jd_text?.trim()) {
      return NextResponse.json(
        { error: "insufficient_input", message: "Job description text is missing." },
        { status: 400 }
      );
    }

    if (!resume_text?.trim()) {
      return NextResponse.json(
        {
          error: "insufficient_input",
          message: "Could not extract text from your resume. If you uploaded a PDF, please ensure it's not a scanned image, or try pasting the text manually."
        },
        { status: 400 }
      );
    }

    console.log("[Pipeline] Starting LOCAL analysis...");

    // ---- Step 1: Detect company type (local) ----
    const companyType = detectCompanyType(jd_text);

    // ---- Step 2: Extract skills via keyword matching (local, instant) ----
    const jdKeywordSkills = extractSkills(jd_text);
    const modelSkills = getRoleStandardSkills(jd_text);

    // Combine keyword-extracted + model standard skills (unique)
    const jdSkills = Array.from(new Set([...jdKeywordSkills, ...modelSkills]));
    const resumeSkills = extractSkills(resume_text);

    console.log(`[Pipeline] JD skills: ${jdSkills.length}, Resume skills: ${resumeSkills.length}`);

    // ---- Step 3: Diff and score (local) ----
    const gapResult = scoreGap(jdSkills, resumeSkills);

    // ---- Step 4: MVC Profile (local) ----
    const { mvcSkills, roleCategory, requiredDegree } = getMVCProfile(gapResult.missingSkills, jd_text);

    // ---- Step 5: Rank gaps locally (no AI!) ----
    const rankedGaps = rankGapsLocally(gapResult.missingSkills, mvcSkills, companyType, roleCategory);

    // ---- Step 6: Calculate ready-by date (local) ----
    const countdown = calculateCountdown(rankedGaps);

    // ---- Step 7: Save to Firestore ----
    const shareToken = crypto.randomUUID();
    const uniqueMvcSkills = Array.from(new Set(mvcSkills.map(s => s.trim())));

    const analysisDoc = {
      share_token: shareToken,
      gap_score: gapResult.gapScore,
      mvc_skills: uniqueMvcSkills,
      required_degree: requiredDegree,
      ready_by_date: countdown.readyByDate,
      weeks_required: countdown.weeksRequired,
      company_type: companyType,
      role_category: roleCategory,
      role_label: getRoleLabel(roleCategory),
      jd_skills: jdSkills,
      resume_skills: resumeSkills,
      skill_gaps: rankedGaps,
      jd_preview: jd_text.slice(0, 100),
      jd_text,
      resume_text,
      created_at: new Date().toISOString(),
    };

    if (adminDb) {
      try {
        await adminDb.collection("analyses").doc(shareToken).set(analysisDoc);
        console.log("[Pipeline] ✓ Analysis saved:", shareToken);
      } catch (dbError) {
        console.error("[Pipeline] ❌ Firestore save error:", dbError);
      }
    } else {
      console.warn("[Pipeline] ⚠️ Database not available. Result not persisted.");
    }

    console.log("[Pipeline] ✓ Done! Gap score:", gapResult.gapScore, "| Weeks:", countdown.weeksRequired);
    return NextResponse.json(analysisDoc);
  } catch (error) {
    console.error("Analysis pipeline error:", error);
    return NextResponse.json(
      { error: "analysis_failed", message: error instanceof Error ? error.message : "An error occurred during analysis." },
      { status: 500 }
    );
  }
}
