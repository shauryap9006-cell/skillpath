# SkillPath — Features

## Free Tier (All users, no account)

### 1. JD Paste Input
User pastes any job description as plain text. No formatting required. Accepts JDs from LinkedIn, Indeed, Glassdoor, company sites.

### 2. Resume Upload
PDF upload, max 5MB. Parsed server-side via Docling. Handles single-column, multi-column, and design-heavy layouts. Plain text paste available as fallback.

### 3. AI Skill Extraction
- Groq (Llama 3.3 70B) extracts required skills from JD as a normalized JSON array
- Same model extracts demonstrated skills from resume text
- all-MiniLM-L6-v2 deduplicates synonyms (Postgres = PostgreSQL = relational database)

### 4. Gap Scoring + Ranking
- Diffs required vs demonstrated skill sets
- Weights each gap by: frequency in JD, estimated weeks-to-learn, company type context
- Outputs a ranked priority list — highest-impact gap first

### 5. Minimum Viable Candidate (MVC) Profile ⭐
- Cross-references gap against 50+ similar JDs from archive
- Identifies 4–5 skills appearing in 80%+ of similar postings
- Displays: "You need these 4 things to get callbacks. Everything else is a bonus."
- Collapses a 30-item JD wish list into 4 real gates

### 6. Time-to-Ready Countdown ⭐
- Calculates total gap in learning hours using per-skill estimates
- Assumes 1hr/day study pace (adjustable)
- Outputs a specific calendar date: "Ready by July 3"
- Updates live as user checks off completed skills

### 7. Week-by-Week Learning Plan
- Maps each skill gap to a curated free resource
- Resources sourced from: YouTube, freeCodeCamp, official documentation, GitHub
- Sequenced by dependency order (no jumping into advanced topics without foundations)
- Grouped into labeled weeks

### 8. Context-Aware Resource Depth ⭐
Each resource entry contains:
- Exact URL
- Timestamp to start from ("start at 14:30")
- Content to skip ("skip intro, first useful content at 8:00")
- Specific project to build after watching
- Why this project matters ("this is what interviewers ask about at mid-level")

### 9. Company-Type Calibration ⭐
- Detects company type from JD text: startup / scale-up / enterprise / agency
- Recalibrates gap score based on context
- "5 years Python" at a startup ≠ "5 years Python" at Goldman Sachs
- Adjusts recommended learning depth accordingly

### 10. Shareable Results URL
- Every analysis generates a unique public UUID-based URL
- Viewable without login
- No expiry
- Designed for sharing with mentors, peers, career coaches

---

## B2B / Data Tier

### 11. JD Trend Tracker
- Playwright scraper collects 1,000+ JDs per role weekly
- Tracks skill frequency changes over time
- Output: "Kubernetes mentions in backend JDs up 34% YoY"
- Powers MVC profile and skill decay detection

### 12. Skill Decay Warnings
- Compares user's resume skills against current JD frequency data
- Fires alert when a skill is declining: "jQuery: only 2% of front-end JDs mention this now. Replace with React."
- Turns the tool from one-time analyzer to ongoing career monitor

### 13. Aggregate Reports API
- Exports anonymized skill trend data per role as PDF or JSON
- Sold to: bootcamps, universities, L&D teams
- Pricing: $200–500 per report or $300/mo API access
- Data: rising skills, declining skills, MVC profiles per role

---

## Differentiators (marked ⭐)

These 4 features do not exist in any competing product today:

| Feature | What makes it unique |
|---|---|
| MVC Profile | Compresses 30+ JD requirements to 4 real interview gates |
| Time-to-ready countdown | Specific calendar date, not a vague "beginner to advanced" timeline |
| Context-aware resource depth | Timestamps + skip notes + project — not just a link |
| Company-type calibration | Gap score adjusts for company stage, not just role title |
