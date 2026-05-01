# SkillPath: The Elite Career Architect

## 🚀 Overview
SkillPath is a high-performance AI platform designed to eliminate the guesswork from career progression in tech. By leveraging deep-learning and data-driven analysis, it bridges the gap between a developer's current skill set and their target role.

## ⚠️ The Problem Statement
In the modern tech landscape, both junior and senior engineers face a critical **"Information Asymmetry"** problem:
1.  **The Vocabulary Gap**: Recruiters and ATS (Applicant Tracking Systems) use a specific professional language that often differs from how developers describe their technical experience.
2.  **The "Noise" Problem**: Learning platforms often push generic "beginner-to-advanced" courses that include 80% fluff. Engineers don't know which 20% of skills actually drive hiring decisions at top-tier companies.
3.  **Cultural Calibration**: A "Senior Dev" at a 10-person startup requires a different technical/cultural mix than a "Senior Dev" at a Fortune 500 enterprise. Most career tools ignore this nuance.

## ✅ The Solution
SkillPath provides a **precision-engineered roadmap** for career transitions. It doesn't just list skills; it calculates the "Delta" (the difference) between your current state and a specific job requirement.

### Core Features:
*   **Gap Delta Analysis**: A deep-learning powered comparison engine that ranks your technical deficiencies by market demand.
*   **The 80/20 Syllabus**: Automatically filters out the noise to focus on the high-impact competencies that get you hired.
*   **MVC Profiling (Minimum Viable Competencies)**: Identifies the exact 4-5 skills you need to master to be considered "ready" for a specific interview.
*   **Time-to-Ready Countdown**: Provides a specific "Ready Date" (e.g., "July 12th") based on your current pace and the complexity of the missing skills.
*   **Company-Type Calibration**: Adjusts the learning trajectory based on the target company's scale (Startup, Mid-size, or Enterprise).

## 🛠️ Technology Stack
*   **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS.
*   **Animations & Visuals**: 
    *   **Framer Motion**: Staggered entrances, smooth transitions, and spring-loaded UI elements.
    *   **Three.js / React Three Fiber**: Interactive 3D wireframe environments in the Hero section.
    *   **Lenis**: Global virtual smooth scrolling for a premium, cinematic feel.
*   **Design System**: 
    *   **Glassmorphism**: Subtle blurs, border-glows, and deep-space color palettes.
    *   **Typography**: `Instrument Serif` for a bold, authoritative display and `Geist Mono` for a precise, technical feel.
*   **Backend & AI**: 
    *   **Firebase**: Scalable real-time data orchestration.
    *   **Groq / Llama 3**: High-speed inference for skill extraction and gap analysis.
    *   **Custom Data Pipelines**: Sophisticated JD-to-CV mapping logic.

## 🎨 Design Philosophy: "Cinematic Engineering"
SkillPath is built to feel like a premium tool for elite talent. Every interaction—from the "limelight" navigation spotlight to the staggered history list—is designed to provide satisfying, tactile feedback. 

## 🧠 Backend Engine Architecture: "The Deterministic Delta"

Unlike traditional career tools that rely entirely on slow, non-deterministic AI calls for every request, SkillPath uses a **Hybrid Analysis Pipeline**. This ensures the core analysis is instant, while creative synthesis (like learning plans) is generated on-demand.

### 1. The MVC Data Model (Source of Truth)
At the heart of the backend is `mvc_model.json`, a curated dataset of over 70 role categories. Each category contains:
*   **Weighted Skills**: A list of technical competencies weighted by their frequency in real-world job descriptions.
*   **Educational Baselines**: The standard degree requirements for that specific role.
*   **Role Categorization**: Sophisticated regex-based detection that maps raw Job Descriptions to professional categories.

### 2. The Analysis Pipeline (100% Local)
When a user submits a JD and Resume, the backend executes a five-stage local pipeline:
1.  **Text Extraction**: Robust handling of raw text and PDF parsing via `pdf-parse`.
2.  **Keyword Synthesis**: A high-speed extraction engine that cross-references text against the entire MVC skill database using optimized word-boundary regex.
3.  **Skill Gap Scoring**: A deterministic diffing algorithm that calculates the "Delta" between the JD requirements and the candidate's strengths.
4.  **MVC Profiling**: Automatically identifies the top "Minimum Viable" skills that represent the core 20% of the role's requirements.
5.  **Prioritized Ranking**: Gaps are ranked not just by their presence, but by their statistical importance in the market and their estimated "weeks-to-learn."

### 3. On-Demand AI Synthesis
AI (via Groq/Llama 3) is used strategically to avoid rate limits and latency:
*   **Contextual Resource Generation**: Once a gap is identified, AI generates tailored learning resources, timestamped YouTube links, and project ideas.
*   **Semantic Reasoning**: AI explains *why* a specific skill is a priority for the target company type (e.g., why Kubernetes matters more at a Scale-up vs. a Startup).

**"Talent isn't enough. Strategy is."**
