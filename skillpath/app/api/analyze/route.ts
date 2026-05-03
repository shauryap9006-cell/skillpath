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

export const runtime = 'nodejs';
export const maxDuration = 30;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";

import { scoreGap } from "@/lib/gap-scorer";
import { getMVCProfile, getRoleStandardSkills, extractSkills, rankGapsLocally, getRoleLabel } from "@/lib/mvc-profiler";
import { calculateCountdown } from "@/lib/readiness";
import { detectCompanyType } from "@/lib/company-detector";
import { adminDb } from "@/lib/firebase-admin";
import { extractTextFromPDF } from "@/lib/pdf-extract";
import type { SkillGap } from "@/types/analysis";
import crypto from "crypto";
import Groq from "groq-sdk";
import { getAuthUser } from "@/lib/auth-helpers";
import { ANALYZE_SUMMARY_SYSTEM, buildAnalyzeSummaryPrompt } from "@/prompts/analyze-summary";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "fallback_key_not_set" });

export async function POST(req: NextRequest) {
  try {
    if (!adminDb) {
      throw new Error("Critical: Firebase database connection is not established. Check FIREBASE_SERVICE_ACCOUNT_KEY.");
    }

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
        const buffer = await resumeFile.arrayBuffer();
        try {
          console.log("[Pipeline] Using pdfjs-dist extraction (Robust)");
          resume_text = await extractTextFromPDF(buffer);
          console.log(`[Pipeline] Extracted ${resume_text.length} chars from PDF`);
        } catch (pdfError) {
          console.error("[Pipeline] PDF Extraction Error:", pdfError);
          // If we have a backup text, use it, otherwise throw
          if (rawResumeText) {
            resume_text = rawResumeText;
          } else {
            throw new Error("Failed to extract text from PDF: " + (pdfError instanceof Error ? pdfError.message : "Unknown error"));
          }
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

    // ---- Step 7: AI Synthesis Summary (Groq) ----
    console.log("[Pipeline] Synthesizing professional summary...");
    let aiSummary = "";
    try {
      const summaryResponse = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: ANALYZE_SUMMARY_SYSTEM },
          { role: "user", content: buildAnalyzeSummaryPrompt(
            gapResult.gapScore,
            rankedGaps.filter(g => g.in_mvc).map(g => g.skill),
            countdown.readyByDate,
            companyType,
            getRoleLabel(roleCategory)
          )}
        ],
        temperature: 0.3,
        max_tokens: 150,
      });
      aiSummary = summaryResponse.choices[0]?.message?.content?.trim() || "";
      console.log("[Pipeline] ✓ Summary synthesized");
    } catch (aiError) {
      console.error("[Pipeline] AI Summary Error:", aiError);
      aiSummary = `You are ${countdown.weeksRequired} weeks away from being a competitive candidate for this ${getRoleLabel(roleCategory)} role.`;
    }

    // ---- Step 8: Save to Firestore ----
    const shareToken = crypto.randomUUID();
    const uniqueMvcSkills = Array.from(new Set(mvcSkills.map(s => s.trim())));

    const analysisDoc = {
      share_token: shareToken,
      gap_score: gapResult.gapScore,
      summary: aiSummary,
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
    
    const response = NextResponse.json(analysisDoc);
    response.headers.set('X-Pipeline-Status', 'Success');
    response.headers.set('X-Database-Status', adminDb ? 'Connected' : 'Disconnected');
    return response;
  } catch (error) {
    console.error("Analysis pipeline crash:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred during analysis.";
    const response = NextResponse.json(
      { 
        error: "analysis_failed", 
        message: message,
        hint: process.env.NODE_ENV === 'development' 
          ? "Check your local server logs." 
          : message.includes("PDF") 
            ? "Your PDF might be too large or complex. Try pasting the resume text directly."
            : message.includes("GROQ") || message.includes("apiKey")
              ? "Check your GROQ_API_KEY in deployment settings."
              : message.includes("database") || message.includes("adminDb")
                ? "Firestore connection failed. Check your FIREBASE_SERVICE_ACCOUNT_KEY."
                : message.includes("unauthorized")
                  ? "Authentication failed. Try signing out and back in."
                  : "Check your Firebase and Groq environment variables."
      },
      { status: 500 }
    );
    response.headers.set('X-Pipeline-Error', message.slice(0, 50));
    return response;
  }
}
