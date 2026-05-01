# SkillPath — Backend

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js App Router (API Routes) |
| Runtime | Node.js 20 (Vercel serverless) |
| Database | Firebase (Firestore) |
| Cache | Upstash Redis |
| AI Inference | Groq API |
| PDF Parsing | Docling (Python microservice) |
| Embeddings | sentence-transformers / all-MiniLM-L6-v2 (Python microservice) |
| Job Scraping | Playwright (GitHub Actions cron) |
| Email | Resend |

---

## Architecture Overview

```
Client
  │
  ▼
Next.js API Routes (Vercel Serverless)
  │
  ├── Upstash Redis (cache layer)
  │
  ├── Firebase Firestore (persistence)
  │
  ├── Groq API (LLM inference)
  │    ├── Llama 3.3 70B  → skill extraction, gap scoring, plan generation
  │    ├── Llama 3.1 8B   → normalization, classification
  │    └── Mixtral 8x7B   → fallback when 70B hits rate limit
  │
  └── Python microservices (separate Vercel functions)
       ├── /api/parse-pdf     → Docling PDF → plain text
       └── /api/embed-skills  → MiniLM skill → embedding vector
```

---

## API Routes

### POST `/api/analyze`
Main orchestration route. Calls all sub-pipelines in sequence.

**Request**
```json
{
  "jd_text": "string",
  "resume_file": "base64 PDF string"
}
```

**Pipeline (in order)**
1. Parse resume PDF → `/api/parse-pdf`
2. Extract JD skills → Groq (Llama 3.3 70B)
3. Extract resume skills → Groq (Llama 3.3 70B)
4. Normalize skill names → `/api/embed-skills` (MiniLM cosine similarity)
5. Score and rank gaps → `lib/gap-scorer.ts`
6. Detect company type → Groq (Llama 3.1 8B)
7. Build MVC profile → `lib/mvc-profiler.ts`
8. Calculate ready-by date → `lib/countdown.ts`
9. Generate learning plan → Groq (Llama 3.3 70B) + resource DB
10. Save analysis → Firebase
11. Return share token + full result

**Response**
```json
{
  "share_token": "uuid",
  "gap_score": 72,
  "mvc_skills": ["Python", "SQL", "Git", "REST APIs"],
  "ready_by_date": "2025-07-03",
  "weeks_required": 9,
  "company_type": "startup",
  "skill_gaps": [
    {
      "skill": "Python",
      "priority": 1,
      "weeks_to_learn": 3,
      "in_mvc": true
    }
  ],
  "learning_plan": {
    "weeks": [
      {
        "week": 1,
        "skill": "Python",
        "resources": [
          {
            "title": "Python for Beginners - freeCodeCamp",
            "url": "https://youtube.com/...",
            "start_at": "00:14:30",
            "skip_note": "Skip intro and setup, start at 14:30",
            "project": "Build a CLI todo app",
            "project_url": "https://github.com/...",
            "why": "Interviewers at startups ask for a CLI project at junior level"
          }
        ]
      }
    ]
  }
}
```

**Cache:** Result cached in Redis by `hash(jd_text + resume_text)` for 24h.

---

### GET `/api/results/[share_token]`
Fetch a saved analysis by share token.

**Response:** Full analysis object (same shape as `/api/analyze` response).  
**Cache:** Redis TTL 1h (read-heavy, rarely changes).

---

### POST `/api/parse-pdf`
Python microservice. Accepts base64 PDF, returns extracted plain text.

**Request**
```json
{ "file_base64": "string" }
```

**Response**
```json
{ "text": "string", "page_count": 2, "parser": "docling" }
```

**Fallback:** If Docling fails, retries with pdf-parse. If both fail, returns `{ "error": "parse_failed" }` — frontend shows plain text paste option.

---

### POST `/api/embed-skills`
Python microservice. Accepts array of skill strings, returns normalized skill names after cosine similarity deduplication.

**Request**
```json
{ "skills": ["PostgreSQL", "Postgres", "relational database", "SQL", "React.js", "ReactJS"] }
```

**Response**
```json
{
  "normalized": [
    { "canonical": "PostgreSQL", "variants": ["Postgres", "relational database", "SQL"] },
    { "canonical": "React", "variants": ["React.js", "ReactJS"] }
  ]
}
```

**Logic:** Embeds all skills with MiniLM. Clusters by cosine similarity > 0.82. Returns canonical name (most common variant in O*NET taxonomy).

---

### GET `/api/trends`
Returns skill frequency trend data from JD archive.

**Query params:** `role=backend-engineer&limit=20`

**Response**
```json
{
  "role": "backend-engineer",
  "trending_up": [
    { "skill": "Kubernetes", "change_pct": 34, "current_freq": 0.71 }
  ],
  "trending_down": [
    { "skill": "jQuery", "change_freq": -28, "current_freq": 0.04 }
  ],
  "mvc_skills": ["Python", "SQL", "Docker", "REST APIs"]
}
```

**Cache:** Redis TTL 7 days (updated weekly by cron).

---

## Groq Prompt Design

### Prompt: Extract JD Skills
```
Model: llama-3.3-70b-versatile
Temperature: 0
Max tokens: 800

System:
You are a technical recruiter. Extract every required skill, tool, technology, 
and qualification from the job description below.
Return ONLY a JSON array of strings. No explanation. No markdown. No preamble.
Normalize names: use "React" not "React.js", "PostgreSQL" not "Postgres".
Example output: ["Python", "SQL", "Docker", "REST APIs", "Git"]

User:
{jd_text}
```

---

### Prompt: Extract Resume Skills
```
Model: llama-3.3-70b-versatile
Temperature: 0
Max tokens: 800

System:
You are a technical recruiter. Extract every demonstrated skill, tool, technology, 
and qualification from the resume below.
Include skills mentioned in: work experience, projects, education, certifications.
Return ONLY a JSON array of strings. No explanation. No markdown. No preamble.
Normalize names: use "React" not "React.js", "PostgreSQL" not "Postgres".

User:
{resume_text}
```

---

### Prompt: Score and Rank Gaps
```
Model: llama-3.3-70b-versatile
Temperature: 0
Max tokens: 1200

System:
You are a career advisor. Given a list of skill gaps and a company type, 
rank each gap by hiring importance.
Return ONLY a JSON array. No explanation. No markdown.
For each skill output:
- skill: string
- priority: integer (1 = highest)
- weeks_to_learn: integer (honest estimate for 1hr/day)
- reason: one sentence why this is high/low priority

Company type: {company_type}

User:
Skill gaps: {gap_list}
```

---

### Prompt: Detect Company Type
```
Model: llama-3.1-8b-instant
Temperature: 0
Max tokens: 20

System:
Classify the company from this job description.
Return ONLY one word: startup, scaleup, enterprise, or agency.

User:
{jd_text_first_500_chars}
```

---

### Prompt: Generate Learning Plan
```
Model: llama-3.3-70b-versatile
Temperature: 0.2
Max tokens: 2000

System:
You are a curriculum designer. Generate a week-by-week learning plan for the skill gaps below.
Use ONLY the free resources provided. Do not invent resources.
For each week output: week number, skill, resource title, URL, start_at timestamp, 
skip_note, project to build, why this project matters for interviews.
Return ONLY a JSON object. No markdown. No explanation.
Available resources: {resource_db_subset}

User:
Skill gaps (ranked): {ranked_gaps}
Company type: {company_type}
```

---

## Database Schema

```sql
-- analyses: one row per user submission
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_token UUID UNIQUE DEFAULT gen_random_uuid(),
  jd_text TEXT NOT NULL,
  resume_text TEXT NOT NULL,
  gap_score INTEGER,
  company_type TEXT,
  mvc_skills JSONB,
  ready_by_date DATE,
  weeks_required INTEGER,
  skill_gaps JSONB,
  learning_plan JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- skills: normalized skill registry
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  embedding VECTOR(384),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- resources: curated free learning resources per skill
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID REFERENCES skills(id),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT,
  start_at TEXT,
  skip_note TEXT,
  project TEXT,
  project_url TEXT,
  interview_note TEXT,
  quality_score INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- jd_archive: scraped job descriptions for MVC analysis
CREATE TABLE jd_archive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  company_type TEXT,
  raw_text TEXT NOT NULL,
  extracted_skills JSONB,
  source TEXT,
  scraped_at TIMESTAMPTZ DEFAULT now()
);

-- skill_trends: weekly frequency per skill per role
CREATE TABLE skill_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill TEXT NOT NULL,
  role TEXT NOT NULL,
  frequency_pct NUMERIC,
  jd_count INTEGER,
  week_of DATE NOT NULL,
  UNIQUE(skill, role, week_of)
);
```

---

## Caching Strategy (Upstash Redis)

| Key pattern | TTL | Invalidation |
|---|---|---|
| `analysis:{hash}` | 24h | Never (immutable result) |
| `result:{share_token}` | 1h | On read |
| `trends:{role}` | 7d | On weekly cron run |
| `mvc:{role}` | 7d | On weekly cron run |
| `resources:{skill}` | 30d | On manual resource DB update |

Hash = `sha256(jd_text + resume_text)` — same inputs always return cached result.

---

## Python Microservices

Both deployed as Vercel Python serverless functions.

### `/api/parse-pdf` — `api/parse_pdf.py`
```python
from docling.document_converter import DocumentConverter
import base64, tempfile, os

def handler(request):
    data = request.json()
    pdf_bytes = base64.b64decode(data["file_base64"])

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
        f.write(pdf_bytes)
        tmp_path = f.name

    try:
        converter = DocumentConverter()
        result = converter.convert(tmp_path)
        text = result.document.export_to_markdown()
        return { "text": text, "parser": "docling" }
    except Exception:
        # fallback
        import pdfplumber
        with pdfplumber.open(tmp_path) as pdf:
            text = "\n".join(p.extract_text() or "" for p in pdf.pages)
        return { "text": text, "parser": "pdfplumber" }
    finally:
        os.unlink(tmp_path)
```

### `/api/embed-skills` — `api/embed_skills.py`
```python
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")
SIMILARITY_THRESHOLD = 0.82

def handler(request):
    skills = request.json()["skills"]
    embeddings = model.encode(skills, convert_to_tensor=True)
    
    clusters = []
    used = set()

    for i, skill in enumerate(skills):
        if i in used:
            continue
        cluster = {"canonical": skill, "variants": []}
        for j in range(i + 1, len(skills)):
            if j in used:
                continue
            sim = util.cos_sim(embeddings[i], embeddings[j]).item()
            if sim >= SIMILARITY_THRESHOLD:
                cluster["variants"].append(skills[j])
                used.add(j)
        clusters.append(cluster)
        used.add(i)

    return { "normalized": clusters }
```

---

## Cron Jobs (GitHub Actions)

### Weekly JD Scraper — runs every Monday 00:00 UTC
```yaml
# .github/workflows/scrape-jds.yml
on:
  schedule:
    - cron: "0 0 * * 1"
jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npx playwright install chromium
      - run: npx tsx scripts/scrape-jds.ts
        env:
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

**`scripts/scrape-jds.ts` logic:**
1. For each target role (15 roles defined in config)
2. Scrape 100 JDs from Indeed
3. Extract skills via Groq (Llama 3.1 8B, batch mode)
4. Insert into `jd_archive`
5. Recalculate `skill_trends` frequency
6. Invalidate Redis `trends:*` keys

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| Groq rate limit (429) | Retry with Mixtral 8x7B. If also limited, queue and return `{ "status": "queued" }` |
| PDF parse failure | Fallback to pdfplumber. If fails, return error code and show plain text input |
| Firebase write failure | Return result to user, log error, retry write async |
| MiniLM embed timeout | Skip normalization, use raw Groq-extracted skill names |
| Empty JD / resume | Return `{ "error": "insufficient_input" }` with specific field |

---

## Rate Limiting

Applied at `/api/analyze` via Upstash Redis:
- 5 analyses per IP per hour (free tier protection)
- Returns `429` with `retry_after` header
- Implemented with `@upstash/ratelimit` package

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
});
```

---

## Environment Variables

```env
# Groq
GROQ_API_KEY=

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_CREDENTIALS=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# YouTube (resource curation)
YOUTUBE_API_KEY=

# Email
RESEND_API_KEY=

# Internal
CRON_SECRET=   # validates GitHub Actions → API calls
```
