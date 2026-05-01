# SkillPath — Frontend

## Design Philosophy

Minimal. Black and white. Editorial. Big type does the work — no decorations, no gradients, no color.
The product is about clarity and precision. The design reflects that.

One rule: if it doesn't need to exist, it doesn't exist.

---

## Design System

### Colors

```css
:root {
  --black:     #0A0A0A;
  --white:     #F5F4F0;
  --gray-100:  #E8E6E1;
  --gray-300:  #BDBAB3;
  --gray-500:  #7A7873;
  --gray-700:  #3D3C3A;
  --accent:    #0A0A0A;   /* same as black — no color accent */

  --bg:        var(--white);
  --fg:        var(--black);
  --border:    var(--gray-100);
  --muted:     var(--gray-500);
  --surface:   #EEECEA;  /* card backgrounds */
}
```

Only two real colors: near-black `#0A0A0A` and off-white `#F5F4F0`.
Gray scale for supporting elements only.

---

### Typography

```css
/* Display — headlines, hero numbers */
font-family: 'Instrument Serif', Georgia, serif;

/* Body + UI — everything else */
font-family: 'Geist Mono', 'JetBrains Mono', monospace;
```

Install via Google Fonts (Instrument Serif) and Vercel Fonts (Geist Mono).

```typescript
// app/layout.tsx
import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

const display = Instrument_Serif({ weight: "400", subsets: ["latin"] });
const mono = localFont({ src: "../public/fonts/GeistMono.woff2" });
```

#### Type Scale

```css
--text-xs:    0.75rem;   /* 12px — labels, metadata */
--text-sm:    0.875rem;  /* 14px — secondary body */
--text-base:  1rem;      /* 16px — body */
--text-lg:    1.25rem;   /* 20px — lead text */
--text-xl:    1.5rem;    /* 24px — section heads */
--text-2xl:   2rem;      /* 32px — page titles */
--text-3xl:   3rem;      /* 48px — hero sub */
--text-4xl:   4.5rem;    /* 72px — hero headline */
--text-5xl:   7rem;      /* 112px — oversized display */
--text-6xl:   10rem;     /* 160px — numbers, countdown */
```

---

### Spacing

```css
--space-1:   0.25rem;
--space-2:   0.5rem;
--space-3:   0.75rem;
--space-4:   1rem;
--space-6:   1.5rem;
--space-8:   2rem;
--space-12:  3rem;
--space-16:  4rem;
--space-24:  6rem;
--space-32:  8rem;
```

Sections use `--space-24` vertical padding. No tight packing.

---

### Borders + Surfaces

```css
--radius-sm:  2px;
--radius-md:  4px;
--radius-lg:  6px;

border: 1px solid var(--border);           /* default card border */
border: 1px solid var(--black);            /* active / selected state */
border-bottom: 1px solid var(--border);    /* divider */
```

No shadows. Borders only.

---

## Pages

### 1. Landing Page `/`

**Purpose:** Communicate the product in one scroll. Drive to `/analyze`.

#### Section: Hero
```
Layout: Full viewport height. Left-aligned text. Right: Three.js canvas.

Content:
  ─────────────────────────────────────
  [large mono label]  SKILL GAP ANALYSIS

  [Instrument Serif, 72px]
  Know exactly what
  you're missing.
  Fix it in weeks.

  [body mono, 18px, gray-500]
  Paste a job description. Upload your resume.
  Get a week-by-week plan using only free resources.

  [button]  → Analyze now
  ─────────────────────────────────────

Three.js (right half):
  - Rotating wireframe sphere or particle field
  - Color: white lines on white bg with opacity 0.15
  - Subtle. Background texture, not focal point.
  - Pauses on hover
```

#### Section: How It Works
```
Layout: 3 columns, full width, separated by vertical borders.

[GSAP: each column fades up on scroll, staggered 150ms]

  ┌──────────────┬──────────────┬──────────────┐
  │  01          │  02          │  03          │
  │              │              │              │
  │  Paste       │  Get your    │  Follow      │
  │  the JD +    │  exact gap   │  the plan.   │
  │  resume.     │  scored.     │  Free.       │
  │              │              │              │
  │  [mono sm]   │  [mono sm]   │  [mono sm]   │
  │  Any job     │  Ranked by   │  Week-by-    │
  │  board.      │  priority.   │  week.       │
  └──────────────┴──────────────┴──────────────┘
```

#### Section: Differentiators
```
Layout: Full-width rows, alternating.
Each row: large number left, feature name + desc right.

  01 ─────────────────────────────────────────
  MVC Profile
  [body] 4 skills. Not 40. We find the ones
         that actually get you callbacks.

  02 ─────────────────────────────────────────
  Ready-by Date
  [body] Not "beginner to advanced."
         A specific date. July 3. Start today.

  03 ─────────────────────────────────────────
  Free. All of it.
  [body] No subscriptions. No paywalls.
         Every resource we link is free.
```

#### Section: CTA
```
  ─────────────────────────────────────
  [Instrument Serif, 72px, centered]
  Ready to close
  the gap?

  [button, full-width max 320px, centered]
  → Start your analysis
  ─────────────────────────────────────
```

---

### 2. Analyze Page `/analyze`

**Purpose:** Collect JD + resume. Single action. No clutter.

```
Layout: Centered column, max-width 680px, large vertical padding.

  [mono label, gray-500]  STEP 1 OF 1

  [Instrument Serif, 48px]
  Paste the job.
  Drop the resume.

  ─────────────────────────────────────
  [textarea — full width, min-height 240px]
  Job description

  Placeholder: "Paste the full job description here..."
  Border: 1px solid var(--border)
  Focus: border-color: var(--black)
  Font: Geist Mono, 14px
  Resize: vertical only
  ─────────────────────────────────────

  [drag-drop zone — full width, height 120px]
  Resume (PDF)

  Default state:
    Dashed border 1px, border-color: var(--gray-300)
    Center text: "Drop PDF here or click to upload"
    Font: mono sm, gray-500

  Hover state:
    border-color: var(--black)
    background: var(--surface)

  Uploaded state:
    Solid border, black
    Shows: filename + filesize
    Shows: × to remove

  ─────────────────────────────────────
  [button — full width, height 56px]
  Analyze →

  Loading state:
    "Analyzing..." + animated mono dots (...)
    Disabled, no spinner — dots only
```

---

### 3. Results Page `/results/[share_token]`

**Purpose:** Show the full analysis. Scannable. Dense but not cluttered.

#### Results Header
```
  [mono sm, gray-500]  ANALYSIS COMPLETE
  [Instrument Serif, 56px]  You're 9 weeks away.
  [mono base, gray-700]  Ready by July 3 — at 1hr/day

  [share button — right aligned, small]  Copy link ↗
```

#### Gap Score Bar
```
  [mono sm]  GAP SCORE
  [large number, Instrument Serif, 80px]  72
  [mono sm, gray-500]  / 100

  [full-width bar]
  ─────────────────────────█░░░░░░░░
  70% match

  [mono xs, gray-500]  30% gap to close
```

#### MVC Profile
```
  ─────────────────────────────────────
  [mono sm label]  THE 4 THINGS THAT MATTER

  [4 chips, black bg, white text]
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │  Python  │ │   SQL    │ │   Git    │ │REST APIs │
  └──────────┘ └──────────┘ └──────────┘ └──────────┘

  [mono sm, gray-500]
  These appear in 83% of similar job descriptions.
  Everything else is a bonus.
  ─────────────────────────────────────
```

#### Skill Gap List
```
  [mono sm label]  SKILL GAPS — RANKED BY PRIORITY

  Each row:
  ┌──────────────────────────────────────────────┐
  │ 01   Python              3 weeks   ████░░░░  │
  │      [gray-500 mono xs] In MVC · High impact │
  ├──────────────────────────────────────────────┤
  │ 02   Docker              2 weeks   ██░░░░░░  │
  │      [gray-500 mono xs] Startup context      │
  └──────────────────────────────────────────────┘
```

#### Learning Plan
```
  [mono sm label]  YOUR PLAN — WEEK BY WEEK

  Week accordion — click to expand:

  ┌──────────────────────────────────────────────┐
  │ WEEK 1   Python fundamentals          [+]    │
  └──────────────────────────────────────────────┘
  ↓ expanded:
  ┌──────────────────────────────────────────────┐
  │ WEEK 1   Python fundamentals          [−]    │
  │                                              │
  │ Resource                                     │
  │ Python for Beginners — freeCodeCamp          │
  │ youtube.com/...                    [Open ↗]  │
  │                                              │
  │ Start at      14:30                          │
  │ Skip          First 14 mins (setup)          │
  │                                              │
  │ Build         CLI todo app                   │
  │ Why           Startups ask for this at       │
  │               junior level interviews        │
  └──────────────────────────────────────────────┘
```

---

## Components

### Button
```tsx
// components/ui/Button.tsx
// Two variants: primary (black fill) and ghost (border only)

primary:
  background: var(--black)
  color: var(--white)
  border: 1px solid var(--black)
  padding: 12px 28px
  font: Geist Mono, 14px, weight 500
  letter-spacing: 0.04em
  text-transform: uppercase
  transition: opacity 150ms
  hover: opacity 0.8

ghost:
  background: transparent
  color: var(--black)
  border: 1px solid var(--black)
  same padding + font as above
  hover: background var(--surface)

disabled:
  opacity: 0.35
  cursor: not-allowed
```

### Chip (skill tag)
```tsx
// Two states: filled (MVC skill) and outline (regular skill)

filled:
  background: var(--black)
  color: var(--white)
  padding: 5px 12px
  font: Geist Mono 12px
  border-radius: var(--radius-sm)

outline:
  background: transparent
  color: var(--black)
  border: 1px solid var(--gray-300)
  same padding + font
```

### Progress Bar
```tsx
// Used for gap score and skill priority

height: 4px
background: var(--gray-100)     // track
fill: var(--black)               // progress
border-radius: 2px
transition: width 600ms ease-out  // animates on mount
```

### Accordion (learning plan weeks)
```tsx
// Framer Motion for expand/collapse

header:
  display: flex, justify-between
  padding: 16px 0
  border-bottom: 1px solid var(--border)
  font: Geist Mono 13px uppercase letter-spacing 0.06em
  cursor: pointer

body (animated):
  overflow: hidden
  initial: height 0, opacity 0
  open: height auto, opacity 1
  transition: 250ms ease
```

### Textarea
```tsx
// JD input

border: 1px solid var(--border)
border-radius: var(--radius-md)
padding: 16px
font: Geist Mono 14px
background: var(--white)
color: var(--black)
resize: vertical
min-height: 240px
focus: outline none, border-color var(--black)
placeholder: color var(--gray-300)
```

### Drop Zone
```tsx
// Resume upload

border: 1px dashed var(--gray-300)
border-radius: var(--radius-md)
height: 120px
display: flex, align-center, justify-center
cursor: pointer
transition: all 150ms

hover / drag-over:
  border: 1px dashed var(--black)
  background: var(--surface)

uploaded:
  border: 1px solid var(--black)
  background: var(--surface)
  shows filename left, × right
```

---

## Animation

### Three.js Hero (landing only)
```typescript
// components/landing/Hero.tsx
// Rotating wireframe icosahedron — background texture only

import * as THREE from "three";

const geometry = new THREE.IcosahedronGeometry(2, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x0A0A0A,
  wireframe: true,
  opacity: 0.12,
  transparent: true,
});

// Slow rotation: x += 0.001, y += 0.002 per frame
// Pause on mouse hover
// Canvas fills right half of hero on desktop, full bg on mobile
```

### GSAP Scroll Animations
```typescript
// hooks/useGSAP.ts
// Used on: How It Works columns, Differentiator rows

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Pattern: fade up on enter
gsap.from(element, {
  y: 40,
  opacity: 0,
  duration: 0.6,
  ease: "power2.out",
  stagger: 0.15,
  scrollTrigger: {
    trigger: container,
    start: "top 80%",
  },
});
```

### Framer Motion
```typescript
// Used for: page transitions, accordion, results reveal

// Page transition wrapper — app/layout.tsx
const pageVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

// Results stagger — each card enters 80ms after previous
const containerVariants = {
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Loading dots on analyze button
// "Analyzing" + animated "..." cycling every 400ms
```

---

## Responsive

| Breakpoint | Value | Changes |
|---|---|---|
| mobile | < 640px | Single column, hero text 40px, no Three.js canvas |
| tablet | 640–1024px | Two column grid, Three.js canvas 40% width |
| desktop | > 1024px | Full layout, Three.js canvas 50% width |

```css
/* Fluid hero headline */
font-size: clamp(2.5rem, 6vw, 4.5rem);

/* Fluid display numbers (countdown, score) */
font-size: clamp(3rem, 10vw, 7rem);
```

---

## Tailwind Config

```typescript
// tailwind.config.ts
export default {
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        black:    "#0A0A0A",
        white:    "#F5F4F0",
        surface:  "#EEECEA",
        "gray-100": "#E8E6E1",
        "gray-300": "#BDBAB3",
        "gray-500": "#7A7873",
        "gray-700": "#3D3C3A",
      },
      fontFamily: {
        display: ["Instrument Serif", "Georgia", "serif"],
        mono:    ["Geist Mono", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-sm":  ["3rem",   { lineHeight: "1.1" }],
        "display-md":  ["4.5rem", { lineHeight: "1.05" }],
        "display-lg":  ["7rem",   { lineHeight: "1" }],
        "display-xl":  ["10rem",  { lineHeight: "0.95" }],
      },
    },
  },
};
```

---

## File Map

```
components/
├── ui/
│   ├── Button.tsx
│   ├── Chip.tsx
│   ├── ProgressBar.tsx
│   ├── Accordion.tsx
│   ├── Textarea.tsx
│   └── DropZone.tsx
├── landing/
│   ├── Hero.tsx          ← Three.js canvas here
│   ├── HowItWorks.tsx    ← GSAP scroll
│   ├── Differentiators.tsx
│   └── CtaSection.tsx
├── analyze/
│   ├── JDInput.tsx
│   ├── ResumeUpload.tsx
│   └── AnalyzeButton.tsx
└── results/
    ├── ResultsHeader.tsx  ← "You're 9 weeks away"
    ├── GapScore.tsx
    ├── MVCProfile.tsx
    ├── SkillGapList.tsx
    ├── LearningPlan.tsx   ← accordion
    └── ShareButton.tsx
```

---

## Package installs

```bash
npm install framer-motion gsap three @react-three/fiber @react-three/drei
npm install tailwindcss @tailwindcss/typography
npx shadcn-ui@latest init
```

---

## Reference Design Patterns

Adapted from a cinematic landing page reference. These patterns are ported into SkillPath's black-and-white system — no color, no video overlays, same technique.

---

### Liquid-Glass Utility (CSS)

Used on: Navbar, cards, chip badges, CTA buttons.
Two variants — `liquid-glass` (subtle) and `liquid-glass-strong` (heavy blur, primary CTA only).

```css
/* styles/glass.css */

.liquid-glass {
  background: rgba(10, 10, 10, 0.02);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
}

.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(10, 10, 10, 0.45) 0%,
    rgba(10, 10, 10, 0.15) 20%,
    rgba(10, 10, 10, 0.00) 40%,
    rgba(10, 10, 10, 0.00) 60%,
    rgba(10, 10, 10, 0.15) 80%,
    rgba(10, 10, 10, 0.45) 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* Heavier variant — primary CTA, hero stat cards */
.liquid-glass-strong {
  background: rgba(10, 10, 10, 0.03);
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  box-shadow:
    4px 4px 4px rgba(0, 0, 0, 0.08),
    inset 0 1px 1px rgba(255, 255, 255, 0.08);
}

.liquid-glass-strong::before {
  background: linear-gradient(
    180deg,
    rgba(10, 10, 10, 0.50) 0%,
    rgba(10, 10, 10, 0.20) 20%,
    rgba(10, 10, 10, 0.00) 40%,
    rgba(10, 10, 10, 0.00) 60%,
    rgba(10, 10, 10, 0.20) 80%,
    rgba(10, 10, 10, 0.50) 100%
  );
}
```

**Where to apply in SkillPath:**

| Element | Class |
|---|---|
| Navbar bar | `liquid-glass` |
| Stat cards on hero (gap score, ready-by) | `liquid-glass-strong` |
| Skill chip badges (MVC, gap list) | `liquid-glass` |
| Primary CTA button "Analyze →" | `liquid-glass-strong` |
| How It Works column cards | `liquid-glass` |

> Note: The reference used white rgba values on a dark background. SkillPath flips this — dark rgba on a light background — same technique, same border shimmer, inverted palette.

---

### BlurText Component (word-by-word entrance)

Used on: Hero headline `"Know exactly what you're missing."` — each word blurs in on scroll enter.

```tsx
// components/ui/BlurText.tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface BlurTextProps {
  text: string;
  className?: string;
}

export function BlurText({ text, className }: BlurTextProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const words = text.split(" ");

  return (
    <p
      ref={ref}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start", // left-align for SkillPath (reference used center)
        rowGap: "0.1em",
      }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={
            inView
              ? { filter: "blur(0px)", opacity: 1, y: 0 }
              : { filter: "blur(10px)", opacity: 0, y: 50 }
          }
          transition={{
            duration: 0.7,
            delay: (i * 100) / 1000,  // 100ms stagger per word
            ease: "easeOut",
            times: [0, 0.5, 1],
          }}
          style={{
            display: "inline-block",
            marginRight: "0.28em",
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
```

**Usage in Hero:**
```tsx
<BlurText
  text="Know exactly what you're missing. Fix it in weeks."
  className="font-display italic text-black leading-[0.9] tracking-[-3px]"
  style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
/>
```

---

### Navbar Pattern

Adapted from reference: three-zone navbar (logo · links · spacer). Liquid-glass pill for nav links. Sticky top.

```tsx
// components/landing/Navbar.tsx

<nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16">

  {/* Left: logo mark */}
  <div className="liquid-glass w-12 h-12 rounded-full flex items-center justify-center">
    <span className="font-display italic text-black text-lg">s</span>
  </div>

  {/* Center: nav links pill — desktop only */}
  <div className="hidden md:flex liquid-glass rounded-full px-1.5 py-1.5 items-center gap-1">
    {["Home", "How It Works", "Features", "Analyze"].map(link => (
      <a key={link} className="px-3 py-2 text-sm font-mono text-black/80 hover:text-black transition-colors">
        {link}
      </a>
    ))}
    <button className="bg-black text-white rounded-full px-4 py-2 text-sm font-mono whitespace-nowrap ml-1">
      Start Free →
    </button>
  </div>

  {/* Right: invisible spacer to balance logo */}
  <div className="w-12 h-12 opacity-0 pointer-events-none" />

</nav>
```

---

### Hero Stat Cards

Two stat cards below the hero CTA. Use `liquid-glass-strong`. Adapted for SkillPath data (analyses run + avg weeks to ready).

```tsx
// Inside Hero.tsx — stats row

const stats = [
  { icon: "⏱", value: "9 Weeks", label: "Average time to job-ready" },
  { icon: "◎",  value: "4 Skills", label: "Average MVC profile size" },
];

<div className="flex items-stretch gap-4 mt-8">
  {stats.map(stat => (
    <div
      key={stat.value}
      className="liquid-glass-strong rounded-[1.25rem] p-5 w-[220px] flex flex-col gap-3"
    >
      <span className="text-black/40 text-lg">{stat.icon}</span>
      <div>
        <p className="font-display italic text-black text-4xl tracking-[-1px] leading-none">
          {stat.value}
        </p>
        <p className="text-xs font-mono text-black/50 mt-2">{stat.label}</p>
      </div>
    </div>
  ))}
</div>
```

---

### Framer Motion Entrance Pattern

Reference used `{ filter: blur(10px), opacity: 0, y: 20 }` as the base entrance for all above-fold elements. Adopt this as the SkillPath standard entrance — consistent across all hero elements.

```typescript
// Standard entrance variant — use on all hero-section elements
const enterVariant = {
  hidden: {
    filter: "blur(10px)",
    opacity: 0,
    y: 20,
  },
  visible: (delay = 0) => ({
    filter: "blur(0px)",
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: "easeOut",
    },
  }),
};

// Usage:
// Badge:      custom={0.4}
// Subheading: custom={0.8}
// CTAs:       custom={1.1}
// Stat cards: custom={1.3}
```

---

### Tailwind Config Addition (from reference)

Add to existing `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    borderRadius: {
      DEFAULT: "9999px", // bare `rounded` → pill (matches reference)
    },
    fontFamily: {
      display: ["Instrument Serif", "Georgia", "serif"], // already present
      body:    ["Barlow", "sans-serif"],  // add for marketing copy sections
      mono:    ["Geist Mono", "monospace"], // already present
    },
  },
}
```

Add `Barlow` to Google Fonts import alongside `Instrument Serif`:

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

Use `font-body` (Barlow 300/400) for landing page marketing copy — subheadlines, feature descriptions, partner names. Keep `font-mono` (Geist Mono) for all product UI, labels, inputs, data.
