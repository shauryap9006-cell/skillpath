# SkillPath — Assets Required

## AI & Models

| Asset | Purpose | Cost | How to get |
|---|---|---|---|
| Groq API | Primary LLM inference (Llama 3.3 70B, Mixtral, Gemma 2) | Free (14,400 req/day) | console.groq.com |
| all-MiniLM-L6-v2 | Skill synonym matching, normalization | Free, local | pip install sentence-transformers |
| SkillNER | JD pre-processing, skill token extraction | Free, local | pip install skillner |
| jjzha/jobbert-base-cased | BERT NER for JD skills | Free, HF Inference API | huggingface.co |
| Docling (IBM) | PDF resume parsing, multi-column layout | Free, local | pip install docling |

---

## APIs

| Asset | Purpose | Cost | Limit |
|---|---|---|---|
| Groq API | LLM calls | Free | 30 req/min, 14,400/day |
| YouTube Data API v3 | Video metadata for resource curation | Free | 10,000 req/day |
| Hugging Face Inference API | jobbert NER model | Free | Rate limited |

---

## Infrastructure

| Asset | Purpose | Cost |
|---|---|---|
| Next.js | Full-stack framework | Free |
| Vercel | Deployment, serverless functions | Free hobby tier |
| Firebase | Firestore DB, auth, file storage | Free |
| Upstash Redis | Response caching (24h JD, 7d trends) | Free (10,000 cmd/day) |

---

## Frontend Libraries

| Library | Purpose | Install |
|---|---|---|
| Framer Motion | Page transitions, micro-animations | npm install framer-motion |
| GSAP | Scroll animations, timeline sequences | npm install gsap |
| Three.js | Hero 3D section | npm install three |
| @react-three/fiber | Three.js React wrapper | npm install @react-three/fiber |
| @react-three/drei | Three.js helpers | npm install @react-three/drei |
| Tailwind CSS | Styling | npm install tailwindcss |
| shadcn/ui | UI components | npx shadcn-ui@latest init |

---

## Data Sources (manual setup)

| Asset | Purpose | Cost | Source |
|---|---|---|---|
| Curated resource DB | 200-entry skill → free resource map | Manual (1 weekend) | YouTube, freeCodeCamp, official docs |
| O*NET Database | Skill-to-role taxonomy ground truth | Free | onetonline.org |
| LinkedIn JD Dataset | 33,000+ JDs for MVC frequency analysis | Free | Kaggle |
| Stack Overflow Survey | Skill-salary correlation data | Free | survey.stackoverflow.co |
| Levels.fyi (scraped) | Compensation by role + skill stack | Manual cache | levels.fyi |

---

## Monetization & Comms

| Asset | Purpose | Cost |
|---|---|---|
| Stripe | B2B payments, one-time reports | 2.9% + 30¢ per transaction |
| Resend | Transactional emails | Free (3,000/mo) |

---

## Dev Tools

| Asset | Purpose |
|---|---|
| Playwright | JD scraping (LinkedIn, Indeed) |
| pdf-parse | Fallback PDF parser (simple resumes) |
| PostHog | Analytics, event tracking |
| GitHub Actions | Cron job for weekly JD scraper |
