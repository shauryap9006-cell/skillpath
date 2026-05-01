# SkillPath — File Structure

```
skillpath/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout, fonts, providers
│   ├── page.tsx                  # Landing page
│   ├── analyze/
│   │   └── page.tsx              # JD + resume input form
│   ├── results/
│   │   └── [id]/
│   │       └── page.tsx          # Analysis results (shareable URL)
│   └── api/
│       ├── analyze/
│       │   └── route.ts          # POST: run full gap analysis pipeline
│       ├── extract-jd/
│       │   └── route.ts          # POST: extract skills from JD text
│       ├── extract-resume/
│       │   └── route.ts          # POST: parse PDF + extract skills
│       ├── learning-plan/
│       │   └── route.ts          # POST: generate week-by-week plan
│       └── trends/
│           └── route.ts          # GET: skill frequency trend data
│
├── components/
│   ├── ui/                       # shadcn/ui base components
│   ├── landing/
│   │   ├── Hero.tsx              # Three.js 3D hero section
│   │   ├── HowItWorks.tsx        # GSAP scroll animation section
│   │   ├── Differentiators.tsx   # Feature cards with Framer Motion
│   │   └── Footer.tsx
│   ├── analyze/
│   │   ├── JDInput.tsx           # Job description text area
│   │   ├── ResumeUpload.tsx      # PDF drag-and-drop uploader
│   │   └── AnalyzeButton.tsx     # Submit with loading state
│   └── results/
│       ├── GapScoreCard.tsx      # Overall match score
│       ├── MVCProfile.tsx        # Minimum viable candidate 4–5 skills
│       ├── CountdownTimer.tsx    # "Ready by July 3" display
│       ├── LearningPlan.tsx      # Week-by-week plan accordion
│       ├── SkillGapList.tsx      # Ranked skill gaps with weights
│       ├── ResourceCard.tsx      # Single resource (URL+timestamp+project)
│       └── ShareButton.tsx       # Copy shareable link
│
├── lib/
│   ├── groq.ts                   # Groq API client + model config
│   ├── firebase.ts               # Firebase client (server + browser)
│   ├── pdf-parser.ts             # Docling PDF → plain text
│   ├── skill-normalizer.ts       # MiniLM embedding + cosine similarity
│   ├── gap-scorer.ts             # Diff logic, weighting, ranking
│   ├── plan-generator.ts         # Week-by-week plan from resource DB
│   ├── mvc-profiler.ts           # MVC frequency analysis from JD archive
│   ├── countdown.ts              # Ready-by date calculator
│   └── company-detector.ts       # Groq zero-shot startup/enterprise/agency
│
├── prompts/
│   ├── extract-jd-skills.ts      # Prompt: JD → skill array (JSON)
│   ├── extract-resume-skills.ts  # Prompt: resume text → skill array (JSON)
│   ├── score-gaps.ts             # Prompt: gap list → ranked + weighted
│   └── generate-plan.ts          # Prompt: gaps + resources → weekly plan
│
├── data/
│   ├── resources.json            # 200-entry skill → free resource map
│   ├── skill-taxonomy.json       # O*NET skill normalization reference
│   └── jd-archive/               # Scraped JDs for MVC analysis (gitignored)
│
├── scripts/
│   ├── scrape-jds.ts             # Playwright JD scraper (cron)
│   ├── update-trends.ts          # Weekly skill frequency recalculator
│   └── seed-resources.ts         # Seed resources.json → Firebase
│
├── types/
│   ├── analysis.ts               # Analysis, SkillGap, LearningPlan types
│   ├── skill.ts                  # Skill, SkillMatch, NormalizedSkill types
│   └── resource.ts               # Resource, ResourceType types
│
├── hooks/
│   ├── useAnalysis.ts            # Fetch + poll analysis by ID
│   └── useGSAP.ts                # GSAP scroll trigger setup helper
│
├── firebase/
│   └── rules/
│       ├── firestore.rules
│       └── storage.rules
│
├── public/
│   ├── og-image.png
│   └── favicon.ico
│
├── .env.local                    # GROQ_API_KEY, SUPABASE_URL, etc.
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Key Environment Variables

```env
GROQ_API_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_ADMIN_CREDENTIALS=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
YOUTUBE_API_KEY=
RESEND_API_KEY=
```

---

## Database Collections (Firebase)

```
analyses          id, jd_text, resume_text, gap_score, mvc_skills, ready_by_date, plan_json, share_token, created_at
skills            id, name, normalized_name, category, embedding_vector
resources         id, skill_id, title, url, type, timestamp_start, project_url, quality_score
jd_archive        id, role, company_type, raw_text, extracted_skills, scraped_at
skill_trends      id, skill_id, role, frequency_pct, week_of
```
