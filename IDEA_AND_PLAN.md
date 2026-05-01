# SkillPath — Idea & Plan

## The Insight

Job descriptions are the market's most honest signal about what skills employers currently pay for. Resumes are the most honest signal about what a candidate actually has. Nobody has directly connected these two signals to produce a personalized, free, actionable learning path.

The gap is not a technical problem. It's a product problem. The tools that exist (LinkedIn Learning, Coursera, Udemy) solve "browse courses." SkillPath solves "tell me exactly what I'm missing for this specific job and how to fix it this week."

---

## The Problem

Fresh graduates and career switchers face three specific failures when preparing for a job switch:

1. **Wrong signal.** They learn broadly instead of targeting the specific gap for a specific role.
2. **Paid walls.** Every tool that offers personalized guidance requires a subscription before showing anything useful.
3. **No plan.** Even when they know what to learn, they have no structured path — just a pile of links.

The result: months of unfocused studying, failed applications, and wasted money on courses that weren't the bottleneck.

---

## The Product

SkillPath takes three inputs:
- A job description (pasted as text)
- A resume (uploaded as PDF)
- Nothing else

It outputs:
- A gap score (what you're missing vs what the role requires)
- An MVC profile (the 4–5 skills that actually gate the interview)
- A "ready by" date (specific calendar date based on 1hr/day)
- A week-by-week learning plan (free resources, specific timestamps, exact projects)

No account. No payment. No browsing.

---

## Why It Wins

### 1. Free-first is a distribution strategy
Every competitor puts personalization behind a paywall. SkillPath gives the highest-value output (the gap analysis + plan) for free. This drives word-of-mouth. A user who gets a 9-week plan that works will share it with every friend preparing for the same role.

### 2. Specificity is the moat
Generic AI tools can generate a list of skills. Only SkillPath:
- Strips JD wish lists down to real interview gates (MVC profile)
- Gives a specific ready-by date (not "beginner to advanced in 6 months")
- Provides timestamps and projects, not just links

These require a curated resource database and JD archive — both of which compound over time and are hard to replicate quickly.

### 3. B2B revenue does not require user scale
Bootcamps, universities, and L&D teams will pay $200–500 for skill trend reports. These are high-margin, low-volume sales. A 10-person bootcamp making curriculum decisions needs this data. First B2B sale is achievable before 1,000 users.

---

## Tech Approach

All AI inference runs on Groq's free API (Llama 3.3 70B). No paid AI costs at MVP stage.
PDF parsing runs locally via Docling. Skill matching runs locally via sentence-transformers.
Database and auth via Firebase free tier. Deployment via Vercel free tier.

Total infrastructure cost at launch: ~$0/month until meaningful scale.

---

## Go-To-Market

### Phase 1: Reddit seeding (Week 6–7)
Post in r/cscareerquestions, r/learnprogramming, r/datascience:
"I built a free tool that tells you exactly what skills you're missing for a specific job — here's my story [with the tool link embedded naturally]."

Target: 500 users from first 3 posts.

### Phase 2: SEO (Week 8+)
Target long-tail queries:
- "how to become a data analyst with no experience"
- "skills needed for product manager role"
- "what skills are missing from my resume"

Each results page is a static, indexable URL. Every analysis is SEO surface area.

### Phase 3: B2B outreach (Week 10+)
Cold email 20 bootcamp curriculum directors with a sample trend report for their target role.
Offer: first report free, $300/mo for ongoing data.

---

## 14-Week Plan Summary

| Phase | Weeks | Goal |
|---|---|---|
| Build MVP | 1–4 | Working product end-to-end |
| Polish + launch | 5–6 | Public release, mobile responsive |
| Growth | 7–9 | 500 users, SEO indexed |
| B2B seed | 10–14 | First paid B2B sale, 1,000 users |
