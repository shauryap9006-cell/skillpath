# SkillPath — Roadmap

## Phase 1 — MVP (Weeks 1–4)

**Goal:** Working product. User pastes JD + uploads resume → gets gap analysis + learning plan.

### Week 1
- [ ] Project setup: Next.js + Tailwind + Framer Motion + GSAP + Three.js
- [ ] Firebase schema: users, analyses, skills, resources
- [ ] PDF parsing pipeline with Docling
- [ ] Groq API integration (Llama 3.3 70B)

### Week 2
- [ ] JD skill extraction prompt (Groq)
- [ ] Resume skill extraction prompt (Groq)
- [ ] Skill normalization with all-MiniLM-L6-v2
- [ ] Gap scoring + ranking logic

### Week 3
- [ ] MVC profile generator (minimum viable candidate)
- [ ] Time-to-ready countdown calculator
- [ ] Week-by-week learning plan generator
- [ ] Curated free resource database (200 entries, manual)

### Week 4
- [ ] Context-aware resource depth (timestamps + projects)
- [ ] Shareable results URL (no auth required)
- [ ] Company-type detection via Groq zero-shot
- [ ] UI: landing page + analysis form + results page

---

## Phase 2 — Polish + B2B Seed (Weeks 5–8)

**Goal:** Ship publicly. Start collecting JD trend data.

### Week 5–6
- [ ] GSAP scroll animations on landing page
- [ ] Three.js hero section
- [ ] Framer Motion page transitions
- [ ] Mobile responsive across all pages

### Week 7–8
- [ ] JD scraper (Playwright) — LinkedIn + Indeed
- [ ] Skill frequency tracker (weekly cron job)
- [ ] JD trend dashboard (internal)
- [ ] SEO: meta tags, OG images, sitemap

---

## Phase 3 — Growth + B2B (Weeks 9–14)

**Goal:** First B2B sale. 1,000 users.

### Week 9–11
- [ ] B2B report generator (PDF export of trend data)
- [ ] Stripe integration for B2B one-time report payments
- [ ] Resend email integration (analysis ready notifications)
- [ ] Skill decay warning system

### Week 12–14
- [ ] Peer benchmark data layer (anonymized)
- [ ] Public API for JD trend data (B2B)
- [ ] Analytics dashboard (PostHog)
- [ ] Performance optimization (Redis caching via Upstash)

---

## Milestones

| Milestone | Target Date |
|---|---|
| MVP live (internal) | End of Week 4 |
| Public launch | End of Week 6 |
| First 100 users | Week 8 |
| First B2B sale | Week 12 |
| 1,000 users | Week 14 |
