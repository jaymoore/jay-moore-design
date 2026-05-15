# Portfolio Redesign — Design Spec

**Author:** Jay Moore
**Date:** 2026-05-13
**Status:** Approved (4 brainstorming rounds + 4 Codex second-opinion reviews)
**Replaces:** jaymoore.net (existing portfolio)

---

## 1. Context and Goals

### Audience and positioning

- **Primary target:** Vercel (Design Engineer track)
- **Secondary target:** Anthropic (Claude Code, Codesign, Growth — DE-leaning roles)
- **Tier C secondary:** Gusto, GitLab, Stripe, Notion, Atlassian (workflow / decision-support SaaS)
- **Positioning:** Design Engineer first, Product Designer grounded second. "LLM-first design methodology. Ships React/HTML/CSS. AI-native lifecycle automation + decision support."

### Real proof points (from `config/profile.yml`)

1. SPM lifecycle automation engine (current, 2026) — TTF-touch 30 min → 60 s; 4.6–4.9% reply rate (industry ~1%); 30+ qualified leads/campaign/client
2. Dispatch Decision Support Dashboard (current, 2026) — Accept/Reject/Consider + confidence + evidence + override
3. Fiserv Gift Card Portal redesign (Lead PD, Nov 2023 – Apr 2024) — −35% support ticket volume; +40% promotion setup speed; +20 NPS points; 3-persona B2B SaaS
4. Kleinfelder B2B platform (Sr. UX, 2016–2020) — ~30% task completion time improvement (compressed timeline only)

### Hiring-signal hierarchy (ranked) — for Vercel DE and Anthropic DE

1. The portfolio site itself as craft proof (perf, custom components, dark mode, typography)
2. Live interactive demos, not case study writeups
3. AI/UX patterns (streaming, tool-use UI, trust surfaces, agentic fallbacks)
4. Iteration velocity, made visible
5. Motion design (tasteful, purposeful, performant)
6. Interaction design (hover, keyboard nav, focus, micro-feedback)
7. Strategy (embedded inline, not as standalone decks)

### Goals

- Ship a Design Engineer–signal-first portfolio that survives inspect-element + Lighthouse scrutiny from Vercel/Anthropic recruiters.
- Cover the PD→DE pivot narrative through an explicit credibility bridge.
- Deliver a real audit trail (public Lighthouse + a11y reports, public repo, view-source on demos).
- Mitigate the "narrow AI specialist" overfitting risk via cross-domain proof (Fiserv Gift Card Portal).
- MVP launch in 14 days; first applications by Day 18; priority Vercel/Anthropic applications by Day 22.

### Non-goals

- A long-form Product Designer case-study portfolio. (Wrong audience.)
- A marketing site with services / testimonials / clients. (Wrong intent signal.)
- Perfection at launch. Polish in public; iterate from recruiter feedback.

---

## 2. Sitemap and IA

```
/                          → Homepage (single scroll)
/about                     → Credibility bridge (PD→DE pivot narrative, timeline, contact)
/lab                       → Experiments index (scrappy, timestamped)
  /lab/[slug]              → Single experiment
/patterns                  → Pattern library (NOT in nav at v1; route exists for deep links)
  /patterns/[slug]         → Single pattern demo
/writing                   → Essay index
  /writing/[slug]          → Single essay
/work/spm-lifecycle        → Primary case study (current, headline rigor)
/work/fiserv-gift-card-portal → Rebuilt Fiserv case study (compressed, with cross-domain hook + NDA protocol)
/audits                    → Public audit reports (Lighthouse + axe, auto-committed weekly)
  /audits/[YYYY-MM-DD].md  → Single audit snapshot
```

### Navigation

Persistent top bar (5 links + Github):

```
Jay Moore · Work · Lab · Writing · About · Github
```

- `/patterns` deliberately NOT in nav at v1. Added when first pattern ships. Avoids "empty room" signal.
- `/audits` accessed via deep link only. Restores rigor narrative without UI fragility.
- Mobile: `Jay Moore [☰]` menu with all 5 links + Github.

---

## 3. Homepage Composition

Single scroll. No carousel, no parallax theatrics. Mobile-first composition.

```
┌─────────────────────────────────────────────────┐
│ Jay Moore · Work · Lab · Writing · About · Github│  persistent top bar
├─────────────────────────────────────────────────┤
│ "Who this is for" line                          │
│ For AI-native teams. 10 yrs designing complex   │  ← crisp PD→DE pivot statement
│ software, now shipping it in React.             │
├─────────────────────────────────────────────────┤
│ HERO BLOCK                                      │
│ H1: "Design engineer for AI-native workflows."  │
│ Sub: "Ship in code. Trust-first AI UX."         │
│ Two small anchor links:                         │
│   "About my pivot →"      "Live demos ↓"        │
├─────────────────────────────────────────────────┤
│ METHOD IN PRACTICE (static auditable artifact)  │
│ ┌─────────────────────────────────────────┐    │
│ │ How Demo 1 got built                    │    │
│ │ [clickable PR screenshot — opens github]│    │
│ │ "12 commits · 0 failed CI checks ·       │    │
│ │  2-day build"                           │    │
│ │ "Full process →" → /writing/process     │    │
│ └─────────────────────────────────────────┘    │
├─────────────────────────────────────────────────┤
│ DEMO 1 — AI trust pattern (live, embedded)      │  #demos
├─────────────────────────────────────────────────┤
│ DEMO 2 — Streaming with cancellation (live)     │
├─────────────────────────────────────────────────┤
│ CASE STUDY CTA                                  │
│ "Full system: SPM lifecycle engine →"           │
├─────────────────────────────────────────────────┤
│ TIMELINE STRIP                                  │
│ "Since 2014: Fiserv · Kleinfelder · SPM →"     │
├─────────────────────────────────────────────────┤
│ FOOTER                                          │
│ Bio sentence · "Open to Staff/Principal DE,    │
│ US remote" · github · email                    │
└─────────────────────────────────────────────────┘
```

### Composition rules

- Above the fold: pivot statement + H1 + sub. Method in practice block starts visible at end of first viewport.
- Pattern-named demos (not project-named). The pattern IS the IP.
- No marketing CTAs. Two anchor links + per-demo affordances (repo, view source) only.
- No images of past work. Every demo is the working component.
- Scroll budget: ~4–5 viewports on 1440px desktop.

### Audience pathing

Both paths must succeed from the homepage:

- **Recruiter scan path** (target: <60 sec): top bar → About → SPM case study → email. Crisp pivot statement removes ambiguity instantly.
- **Hiring manager deep path** (target: 10+ min): hero → method-in-practice → demos → view source → /patterns → /writing → repo → email.

### Mobile composition rules

1. Hero H1 caps at `text-4xl` (~65 px). Sub at `text-base`.
2. Demo cards stack with 48 px gap (vs 96 px desktop).
3. Top bar collapses to logo + hamburger menu.
4. Demos that cannot work below 640 px → static preview + "Open on larger screen" hint.
5. Touch targets ≥ 44 px. Text never below 14 px.

---

## 4. Demo Component Pattern

Every demo on home + /lab + /patterns uses the same reusable React skeleton.

```
┌──────────────────────────────────────────────────────┐
│ Pattern: Trust surfaces with confidence + override   │  H2 = pattern name
│ When the AI is uncertain, show users the receipts.   │  subtitle, plain English
├──────────────────────────────────────────────────────┤
│                                                      │
│         [LIVE INTERACTIVE COMPONENT]                 │
│         auto-renders on scroll-into-view             │
│                                                      │
├──────────────────────────────────────────────────────┤
│ Why: Decisions need provenance. Override beats       │
│ obedience. Confidence score is the seat belt.        │  2 sentences
├──────────────────────────────────────────────────────┤
│ Repo →    View source ↓                              │  2 affordances
└──────────────────────────────────────────────────────┘
```

### Skeleton fields

| Field | Required | Notes |
|---|---|---|
| Pattern name (H2) | yes | Names the IP, not the project |
| Plain-English subtitle | yes | One sentence. No jargon. |
| Live component | yes | Working interaction, not screenshot or video |
| Why (2 sentences) | yes | The decision, not the process |
| Repo link | yes | Github URL |
| View source toggle | yes | Reveals 20–40 lines of key React |
| Timestamp | optional | "built 2026-05-12, 47 min" |

**Removed from UI surface** (per Codex Round 2): per-demo quality gate strip. Lives in repo READMEs only.

### Behavior rules

1. Auto-render visual on scroll-into-view. No audio. Canned data default; no real network calls.
2. "Run live" button (post-v1) for demos that need real API calls — explicit user action, rate-limited.
3. View source toggle reveals key React inline (~30 lines). Full source in github.
4. No "case study" framing. State the pattern, not the project context.

### Edge cases

- Demo too big for inline → /patterns/[slug] (NOT /lab).
- Demo needs server compute → Vercel Edge Function.
- Demo browser-incompatible → graceful fallback + "Open in Chrome for live demo."
- Demo has accessibility tradeoff → state it explicitly in the Why.

### Anti-patterns (banned)

- Lottie/JSON animations as "demos."
- Embedded Figma frames.
- iframe to CodeSandbox / v0.
- Autoplay background gradient videos.
- Click-to-load gates that block first paint.

---

## 5. Tech Stack and Craft Bar

### Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 App Router | Vercel-native alignment signal. RSC = perf default. |
| Runtime | React 19 | Latest. Use Actions + `useOptimistic`. |
| Styling | Tailwind v4 | Global default. CSS-first `@theme`. |
| Components | shadcn/ui base + custom layer | Pragmatic. Custom where craft matters. |
| Motion | motion.dev | Lightweight, layout animations, spring physics. |
| Content | MDX colocated with routes | No CMS. Writing/lab = `.mdx` files. |
| Fonts | next/font (2 max) | Geist Sans + Geist Mono |
| Icons | lucide-react | One library, consistent 1.5px stroke |
| Hosting | Vercel | Deliberate exception to global Cloudflare default — target alignment |
| Analytics | Vercel Analytics | Lightweight, privacy-friendly, free signal |
| Repo | Public: `github.com/jaymoore/jay-moore-design` | Open-source the site infra. View-source IS the resume. |

### Internal craft bar (not displayed in UI)

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | ≥ 90 |
| LCP | < 1.5 s |
| CLS | < 0.1 |
| INP | < 250 ms |
| Initial JS (home) | < 150 kb gz |
| Total page weight (home) | < 800 kb |

### Public audit trail

GitHub Action `audit.yml`:
- Weekly cron (Sundays 02:00 UTC)
- Runs Lighthouse CI on `/`, `/about`, `/work/*`
- Runs axe-core a11y check
- Commits markdown report to `/audits/[YYYY-MM-DD].md`
- Updates `/audits/README.md` with 4-week rolling summary

This restores the rigor narrative without UI theater. Available to anyone who deep-links to `/audits/`.

### Repo public/private split

**Public (`github.com/jaymoore/jay-moore-design`):**
- Site infrastructure (Next.js app, components, /lib/patterns)
- Public content (writing, lab, /about, /patterns)
- `/audits/` reports
- README with shadcn-vs-custom split documentation

**Private:**
- `/work/fiserv-gift-card-portal` markdown and images (stored via private submodule or build-time fetch)
- Any client-sensitive material

### shadcn vs custom split (documented in repo README)

| Custom-built (from scratch) | shadcn-base (used as-is) |
|---|---|
| Type system + scale | Form inputs (Input, Textarea) |
| Motion primitives | Dropdown menu |
| Demo container component | Dialog / Modal |
| Hero composition | Command palette |
| Dark mode token system | Tooltip |
| Pattern card layout | Tabs |
| Method-in-practice block | Toast / Sonner |

### Accessibility floor

- WCAG AA minimum, AAA on body text contrast
- Keyboard navigation on every interaction
- Focus rings visible (custom, obvious)
- `prefers-reduced-motion` respected globally
- `prefers-color-scheme` honored, with manual override
- Screen reader pass per demo (verified)
- Skip-to-content link
- One H1 per page, correct heading hierarchy

### Repo hygiene

- Conventional commits (feat / fix / chore / docs / refactor)
- Branch protection on `main`
- CI: lint + typecheck on PR
- Weekly Lighthouse + axe via `audit.yml`
- Vercel preview per PR
- License: MIT
- Clean commit history (no 200 "wip" commits)

### Deliberately skipped

- Storybook (overkill)
- E2E tests (Playwright) — visual reviews suffice for this scope
- i18n
- PWA / service worker
- A/B testing
- Auto-Lighthouse-in-footer (Round 2: credibility fragility)
- Per-demo quality gate strip in UI (Round 2: same)
- Bundle visualization committed to repo (theater)

---

## 6. Visual System

**Status:** provisional. Will iterate via Track A design exploration before final approval. Token contract freeze is **user-approval-gated, not date-gated** — Jay requires multiple rounds of visual exploration before locking look-and-feel.

### Token contract

**Frozen after user approval of visual direction** (cannot change post-freeze):
- Token names
- Token count per category
- Type scale ratio
- Breakpoint values

**Iterable any time:**
- Token values (specific colors, font choice, motion curves, exact px)
- Component-level visual treatment

**Approval gate, not date gate:** Jay requires multiple rounds of visual design exploration before approving the token contract. The 14-day MVP timeline (Section 8) starts counting from the day visual direction is approved, NOT from project kickoff. Track A may run for days or weeks before Phase 1 build begins.

### Type system

- Display + body: **Geist Sans** (Vercel-native alignment signal)
- Mono: **Geist Mono**
- Scale: **Perfect Fourth (1.333 ratio)**

| Token | Size (px) | Use |
|---|---|---|
| `text-2xs` | 11 | Captions, repo metadata |
| `text-xs` | 12 | Tertiary UI, footer |
| `text-sm` | 14 | Secondary body, nav |
| `text-base` | 16 | Body default |
| `text-lg` | 21 | Subtitles |
| `text-xl` | 28 | H3 |
| `text-2xl` | 37 | H2 |
| `text-3xl` | 49 | Pattern names |
| `text-4xl` | 65 | Hero H2 |
| `text-5xl` | 87 | Hero H1 (desktop only) |

Line-height: display 1.05–1.1; body 1.55; UI labels 1.2.
Letter-spacing: display −0.02em; body 0; labels 0.05em.
Max measure: 65ch.

### Color system (60/30/10)

Neutral base (stone scale). Single accent color (TBD via Track A exploration). Semantic states (success, warning, error) used sparingly.

Tokens (initial values; iterable):

| Token | Light | Dark |
|---|---|---|
| `bg` | `#fafaf9` | `#0a0a0a` |
| `surface` | `#ffffff` | `#171717` |
| `surface-2` | `#f5f5f4` | `#262626` |
| `border` | `#e7e5e4` | `#262626` |
| `border-strong` | `#d6d3d1` | `#404040` |
| `text` | `#0a0a0a` | `#fafaf9` |
| `text-muted` | `#57534e` | `#a3a3a3` |
| `text-subtle` | `#a8a29e` | `#737373` |
| `accent` | TBD | TBD |

### Spacing (8pt grid)

`space-2` 8, `space-4` 16, `space-6` 24, `space-8` 32, `space-12` 48, `space-16` 64, `space-24` 96, `space-32` 128. 4 px only for fine details inside components.

### Layout grid (mobile-first)

| Breakpoint | Width | Container | Columns |
|---|---|---|---|
| (default) | < 640 | 100% − 32 px gutter | 1 |
| `sm` | 640 | 600 max | 1 |
| `md` | 768 | 720 max | 1 |
| `lg` | 1024 | 960 max | up to 2 |
| `xl` | 1280 | 1120 max | up to 2 |
| `2xl` | 1536 | 1280 max | up to 2 |

Content column max-width: 720 px for prose and demos.

### Component primitives sizing (per global rules)

Shared height scale: **32 / 36 / 40 / 48 px**. Inputs default 40 px. Buttons default 40 px. Primary CTAs 48 px.

Radius: `radius-sm` 6, `radius-md` 10, `radius-lg` 16. No `rounded-full`.

### Surface treatment

- Borders: 1 px hairline. No 2 px.
- Shadows: minimal. One soft shadow token for raised demo cards.
- No glass/blur on body content (top bar exception when scrolled).
- No gradients in UI (one allowed in hero accent).
- No backdrop patterns / noise textures.

### Focus states

```
outline: 2px solid var(--accent);
outline-offset: 2px;
border-radius: inherit;
```

Always visible. Never `outline: none` without replacement. Tab through entire site < 30 s.

### Motion principles

Library: **motion.dev**.

Defaults: spring for layout (`stiffness: 300, damping: 30`); tween for opacity. Custom easing `[0.32, 0.72, 0, 1]` (snappy out-expo).

Duration ladder: `fast` 150 ms · `normal` 250 ms · `slow` 400 ms · `lazy` 600 ms.

Rules:
1. Transform-only (no animating width/height/top/left).
2. Layout animations via `layoutId`.
3. Spring entrances on scroll-into-view.
4. Stagger children 50–80 ms.
5. `prefers-reduced-motion` → kill transforms, keep opacity transitions.

AI/streaming-specific motion:
- Token streaming: char- or word-by-word with `<TypingCursor />` blinking 530 ms.
- "Thinking" state: bouncing dots or skeleton (no spinners).
- Confidence reveal: opacity + slight Y, ~200 ms.
- Tool-use surface mounting: spring layout swap.

Loading: skeleton > spinner. Skeleton matches final layout exactly (no jump).

### Anti-patterns (banned)

Marquee, mouse-following backgrounds, section-scroll-snap on body, parallax hero, custom cursors, autoplay video without explicit user trigger.

### Iconography

lucide-react only. Stroke width 1.5 px. Sizes 16, 20, 24 px. No emoji in UI (allowed in /writing essays).

### Day-3 freeze contingency (no clear winner)

If Day 2 exploration produces no clear token-set winner:
- Choose the most conservative option (least risky type/spacing/motion)
- Mark 3 deferred visual debts for v1.1
- Continue build
- Do NOT reopen contract unless a11y/perf breaks

---

## 7. Content List (Launch Seed)

### Homepage demos (2 at v1)

**Demo 1 — Trust surface with confidence + override**
- Live AI suggestion card with confidence score + evidence + Accept/Reject/Override
- Maps to Dispatch Decision Support Dashboard
- Repo: `jaymoore/pattern-trust-surface`
- Target signal: Anthropic Claude Code, Anthropic Codesign, OpenAI Health

**Demo 2 — Streaming with cancellation + retry**
- Chat-style streaming response, cancel mid-stream, retry with diff
- Maps to general LLM UX patterns
- Repo: `jaymoore/pattern-streaming-ui`
- Target signal: Vercel (v0 is streaming-first), Anthropic, OpenAI

**Demo 3 — Agentic decision routing** → deferred to v1.1
Too complex for 14-day MVP (multi-step flow, harder a11y story, slowest to polish).

### "Method in practice" homepage block

- Title: "How Demo 1 got built"
- Visual: clickable screenshot of merged PR for Demo 1 (opens github)
- Metric line: "12 commits · 0 failed CI checks · 2-day build"
- Caption: "Hypothesis → prototype → quality gates. Full process →"
- Link: `/writing/process`
- NOT a live demo. NOT a video. Static auditable proof.

### /work/spm-lifecycle (primary case study)

Full PD-rigor case study. Target length: 1500–2500 words + 4–6 visuals.

Sections:
1. **Problem** — Agency lifecycle: TTF-touch averaging 30+ min, reply rates ~1%, 0-shot generation drifts off-brand
2. **Hypothesis** — Multi-agent pipeline with deterministic scoring + LLM enrichment + human override
3. **Architecture** — system diagram: capture → enrich → score → route → send → measure
4. **Key decisions (3–4 max):**
   - Decision support over automation (Accept/Reject/Consider for sends)
   - Confidence + evidence visible to operators
   - Override stored as training data (loop closure)
   - Latency budget: 60 s upper bound
5. **Hero metrics:** TTF-touch 30 min → 60 s; reply rate 4.6–4.9% (industry baseline ~1%); 30+ qualified leads/campaign/client
6. **Live artifact** — embedded slice of actual dashboard
7. **Tradeoffs + known limitations** — explicit
8. **What's next** — roadmap honesty

### /work/fiserv-gift-card-portal (rebuilt, compressed)

Cross-domain proof piece. Target length: 600–900 words + 4–5 visuals.

**Hook at top** (mitigates narrative overfitting risk):
> "This case study isn't AI-related. Multi-persona B2B SaaS — Lead PD, 6 months, 3 user types. Senior product design judgment lives independent of AI methodology."

Sections:
1. Context — Lead Product Designer; Nov 2023 – Apr 2024; 3 personas (business owners, marketers, support agents)
2. Problem — existing portal hard to use, no customization, minimal analytics
3. Approach — 3 key decisions:
   - Role-specific dashboards (not one universal interface)
   - Quick-action panel with embedded knowledge content for support
   - Real-time analytics with segmentation for marketers
4. **Hero metrics:** −35% support ticket volume; +40% promotion setup speed; +20 NPS points
5. Artifacts — 3 dashboard hero shots; key marketer flow before/after; mobile views
6. Closing: "Hands-on Figma + spec methodology. For current LLM-first method on a multi-agent system, see SPM lifecycle engine →"

**NDA protocol line at bottom:**
> "Shareable: outcomes, role, scope, persona structure, public metrics. Under NDA: internal data, raw research, roadmap. Reach out for additional context."

### /about (credibility bridge)

Target length: 400–600 words.

Sections:
1. **One-line headline:** "Design engineer for AI-native workflows. Pivoting after 10 yrs in product design."
2. **The pivot (6–10 lines):**
   - Last 10 years: workflow design, decision support, enterprise B2B
   - What changed: LLM-first methodology, shipping React in production for clients
   - Why DE now: the seam between design + engineering on AI-native products
   - What I'm looking for: Staff/Principal DE at AI-frontier or workflow SaaS
3. **Timeline (compressed):**
   - SPM (2024–present) — AI-native lifecycle + decision support, operator
   - Fiserv (2021–2024) — Sr. PD, Gift Card Portal → link to `/work/fiserv-gift-card-portal`
   - Kleinfelder (2016–2020) — Sr. UX, B2B platform, ~30% task time improvement
   - Earlier work: one line
4. **Failure-mode link:** "I write about what doesn't work too →" → `/writing/what-didnt-work`
5. **Availability:** "Open to Staff/Principal DE roles, US remote."
6. **Contact:** email · github · linkedin
7. **No photo.** Work first.

### /writing seed essays

Each essay must include at least one concrete artifact link (PR, repo, demo, screenshot). Not just opinion.

**1. `/writing/process` — "How I work: LLM-first methodology + quality gates"** (REQUIRED at v1)
- Replaces killed methodology hero demo
- Documents the actual build of Demo 1
- Embedded commit log + timestamps + quality gates
- ~1500–2000 words
- Concrete artifact: PR link for Demo 1

**2. `/writing/what-didnt-work` — "Failure modes in LLM-first design"** (REQUIRED at v1)
- Senior signal: shows you know where methodology breaks
- Real failures from SPM and Dispatch
- Concrete examples: hallucinated tool calls, latency cliffs, trust collapse from one wrong output, prompt drift
- ~1200–1800 words
- Concrete artifact: deprecated branch, before/after PR, or failure-mode `/lab` entry

**3. `/writing/trust-surfaces` — "When the AI is wrong"** (nice-to-have, v1.1)
- Pairs with Demo 1
- ~800–1200 words

**4. `/writing/streaming-is-not-chat`** (nice-to-have, v1.1)
- Pairs with Demo 2
- ~800–1200 words

### /lab seed (1 entry minimum at v1)

Scrappy, timestamped, lower polish bar than homepage demos.

Candidates:
- "Token streaming with citation footnotes" — 1-hr experiment
- "AI form-fill with explainability" — half-day experiment
- "Confidence-as-progress bar" — visual experiment

### /patterns

Empty at v1 (route exists, not in nav). First entry ships post-launch — likely Demo 3 (Decision Routing) when promoted from v1.1.

### /audits

First weekly audit report committed during Phase 4 (launch). Public deep link.

### Top bar (final)

`Jay Moore · Work · Lab · Writing · About · Github`

Mobile: `Jay Moore [☰]` with the 5 + Github.

---

## 8. Timeline and Build Sequence

Two-track approach. Track A = design system exploration (parallel, **user-approval-gated**). Track B = infrastructure + content (sequenced). **Day numbers below count from visual direction approval (Phase 0 exit), NOT from project kickoff.** Phase 0 may run multiple visual rounds before exiting. MVP launch: Day 14 post-approval. First applications: Day 18 post-approval.

### Phase 0 — Pre-build (open-ended, user-approval-gated)

Jay requires multiple visual rounds before approving look-and-feel. Phase 0 exits only when Jay approves a visual direction.

| Workstream | Output |
|---|---|
| Proof matrix | Each target role JD mapped to one public artifact |
| Design exploration round 1 — 3+ visual directions | Mockups for type, color, motion, overall aesthetic |
| Design exploration round 2 — refine 1-2 finalists | Refined direction(s) |
| Design exploration round N — until Jay approves | Approved visual direction + candidate token contract |
| **Phase 0 exit gate** | **Jay approves visual direction; token contract locks** |
| Domain + Vercel + repo + staging URL | `staging.jaymoore.net` live |
| Content audit | Pull Fiserv writeup; outline SPM lifecycle case study |

Once Jay approves the visual direction, Phase 1 begins on Day 1 (post-approval). All subsequent day numbers count from that day.

### Phase 1 — Foundation (Days 1–3 post-approval)

Token contract is already locked at Phase 0 exit. Phase 1 implements it.

| Day | Item |
|---|---|
| 1 | Next.js 15 + Tailwind v4 + TypeScript + MDX setup; Vercel deploy verified |
| 1 | Token contract implemented in Tailwind `@theme` (approved direction from Phase 0) |
| 2 | Top bar + footer + /about route shell |
| 2 | Demo component skeleton (per Section 4) |
| 3 | `/lib/patterns/` folder scaffold |
| 3 | A11y baseline (skip-to-content link, focus rings, semantic HTML) |

### Phase 2 — Demos (Days 4–7 post-approval)

Two demos, end-to-end. Codex Round 3 correction: real demos are 1.5–2.5 days each.

| Days | Item |
|---|---|
| 4–5 | Demo 1 (Trust surface) — live component, repo, view-source toggle, full a11y, mobile QA |
| 6–7 | Demo 2 (Streaming) — Edge function for live mode, canned data fallback, full polish |

### Phase 3 — Case studies and content (Days 8–10 post-approval)

| Day | Item |
|---|---|
| 8 | `/work/spm-lifecycle` — full case study, embeds, hero metrics |
| 9 | `/work/fiserv-gift-card-portal` — compressed rebuild with cross-domain hook + NDA protocol |
| 10 | `/writing/process` + `/writing/what-didnt-work` essays |
| 10 | `/about` content (6–10 lines + timeline + availability) |
| 10 | `/lab` seed entry (1 min) |

### Phase 4 — QA + launch (Days 11–12 post-approval)

| Day | Item |
|---|---|
| 11 | A11y audit (keyboard nav, screen reader, contrast) |
| 11 | Performance audit (Lighthouse on each route; fix <90 perf) |
| 11 | Mobile QA on real devices (iPhone, Android, small tablet) |
| 11 | Cross-browser check (Chrome, Safari, Firefox, Edge) |
| 11 | SEO basics (OG images, meta descriptions, sitemap.xml) |
| 11 | GitHub Action `audit.yml` set up; first run committed to `/audits/` |
| 12 | DNS cutover: `staging.jaymoore.net` → `jaymoore.net`; old site archived |
| 12 | Test all email/contact paths, github links |
| 12 | Launch announcement (LinkedIn + one email to recent contacts) |

### Phase 4.5 — Polish window with hard exit gate (Days 13–16 post-approval)

Codex Round 4 fix: exit-by-criteria, not by date.

**Exit criteria (any one ships):**
- 4 days elapsed (hard cap = Day 16 post-approval)
- 10 polish tickets logged and closed
- Top-3 reviewer frictions resolved (from real visitor analytics + 3–5 friend reviews)

**Activities:**
- Days 13–14: real-world feedback collection (analytics, friend reviews)
- Days 13–15: visual polish based on feedback
- Day 15: fix anything broken under real traffic
- Day 16: ship Wave 1 regardless

### Phase 5 — Wave-based applications (Day 16+ post-approval)

Codex Round 4 fix: Wave 1 must be thesis-aligned, not just lower-stakes.

**Wave 1 (Days 16–19 post-approval) — Calibration set**
- 5–8 applications
- Lower brand stakes BUT thesis-aligned: smaller AI-native SaaS where design+AI workflow is legible
- Candidates: Customer.io, Braze, Klaviyo, Mailchimp/HubSpot Foundry, smaller AI startups from existing scanner reports
- NOT Vercel, NOT Anthropic, NOT OpenAI (saved for Wave 2)
- Collect every recruiter response, screening question, rejection reason

**Wave 2 (Days 20–33 post-approval) — Priority targets**
- Vercel, Anthropic, OpenAI applications
- Apply only after Wave 1 surfaces + fixes any major friction
- Track A design system can iterate concurrently if feedback warrants

**Wave 3 (Day 33+ post-approval) — Reach + adjacent**
- Gusto, GitLab, Stripe, Figma, Notion, niche AI startups
- Continuous iteration

### Critical path

```
Phase 0 — Visual design exploration (open-ended, user-approval-gated)
  [Multiple rounds; exits when Jay approves a visual direction]
  [All subsequent day numbers count from Phase 0 exit]
  ↓
Phase 1 — Foundation (3 days post-approval)
  ↓
Phase 2 — 2 demos (4 days, buffered)
  ↓
Phase 3 — Case studies + content (3 days)
  ↓
Phase 4 — QA + launch (2 days)
  ↓
Phase 4.5 — Polish window (≤ 4 days, exit by criteria)
  ↓
Wave 1 — Day 16 post-approval
  ↓
Wave 2 — Day 20+ post-approval
```

### Risk and mitigation

| Risk | Mitigation |
|---|---|
| Phase 0 visual exploration extends indefinitely (Jay never approves) | Codex-recommended discipline: cap any single round at 1 week; after 3 rounds without approval, force a "good-enough" pick using most conservative option. Visual debts list grows for v1.1. |
| Demos take longer than 2 days each | SPM case-study scope hard-capped; Demo 3 already deferred to v1.1 |
| Writing takes longer than Day 10 post-approval | Compress essays to 1200/1500 words; iterate post-launch |
| Phase 4.5 turns into endless polish | Hard exit criteria enforced (4 days OR top-3 frictions resolved) |
| Wave 1 noisy feedback because non-thesis-aligned | Wave 1 retargeted to thesis-aligned mid-tier (Customer.io, Braze, etc.) |
| Track A design changes cascade into Track B rework | Token contract locked at Phase 0 exit — values iterable, structure locked from Phase 1 onward |
| Vercel Edge function for Demo 2 flakes | Fall back to canned data only; "Run live" deferred to v1.1 |
| Old portfolio (jaymoore.net) is current job-search asset; long Phase 0 leaves stale site live | Continue using existing jaymoore.net during Phase 0; cut over only at Phase 4 launch |

### Apply-early protocol (Codex constraint)

By Day 19 post-approval: 5–8 Wave 1 applications sent. By Day 26 post-approval: every Wave 1 recruiter response logged, friction patterns identified, design + content adjustments applied. Wave 2 priority targets begin Day 20 post-approval.

**Hard rule:** do NOT polish in private past Day 16 post-approval. Ship. Iterate. The job market is the design review for content/code; visual direction was approved before build started.

**Tension acknowledged:** Codex's "ship + iterate, don't polish in private" advice still holds for content + code + interaction. The exception is visual direction — Jay requires pre-launch iteration there. Phase 0 absorbs that risk; everything post-approval ships on schedule.

---

## 9. Definition of v1 Ship

Must work:
- Home with 2 demos + "Method in practice" block + pivot statement + timeline strip
- `/about` (full content, with availability line)
- `/work/spm-lifecycle` (full case study)
- `/work/fiserv-gift-card-portal` (compressed, with cross-domain hook + NDA protocol)
- `/writing/process` + `/writing/what-didnt-work` (both with ≥1 concrete artifact link each)
- `/lab` (1 entry)
- `/audits/` folder with first weekly run committed
- `/patterns` route exists (not in nav)
- Dark mode (system default + manual toggle)
- Mobile responsive (verified on real devices)
- A11y AA verified

Defer to v1.1:
- Demo 3 (Decision Routing)
- `/patterns` nav entry + first pattern
- `/writing/trust-surfaces` + `/writing/streaming-is-not-chat`
- "Run live" buttons on demos (canned data only at v1)
- Auto-generated OG images for `/writing`

---

## 10. Risks and Open Questions

### Resolved risks (from 4 Codex review rounds)

| Round | Risk | Resolution |
|---|---|---|
| R1 | Identity ambiguity (PD vs DE vs UI craftsman) | Added /about credibility bridge; promoted to top nav |
| R2 | Credibility fragility (too many visible verifiable claims) | Killed methodology hero; dropped per-demo quality strip; moved metrics to /audits |
| R2 | /lab IA drift (experiments vs overflow) | Separated /patterns from /lab |
| R3 | Narrative overfitting (narrow AI specialist) | Fiserv cross-domain hook + explicit B2B/multi-persona framing |
| R3 | Empty /patterns nav signal | Removed from nav until first pattern ships |
| R3 | Endless-polish risk | Phase 4.5 exit gate by criteria, not date |
| R4 | Methodology-block decorativeness | Added metric line + clickable PR link |
| R4 | Wave 1 false-negative recruiter signal | Retargeted Wave 1 to thesis-aligned mid-tier |
| R4 | Day-2 token freeze brittleness | Pushed to Day 3 EOD with Day 2 checkpoint + no-winner contingency |

### Open questions

1. **Visual direction** — to be resolved through multiple rounds of Phase 0 exploration. User-approval-gated, not date-gated. All token values (accent color, type details, motion curves) decided in Phase 0.
2. **Fiserv private content storage** — submodule vs separate private repo vs build-time fetch from gist. Decide during Phase 0.
3. **"Run live" button infrastructure for Demo 2** — Vercel Edge Function vs serverless OpenAI proxy with own key. Decide Phase 2.
4. **`config/profile.yml` proof-point #3 needs update** — current "wallet + cart abandonment" entry is stale; replace with Gift Card Portal metrics. Cleanup before Wave 1 applications.

---

## 11. Appendix — Decision Audit Trail

Four brainstorming rounds with the user, four Codex second-opinion reviews. Key inflection points:

| Decision | Round | Source |
|---|---|---|
| DE-first positioning | Brainstorm Q2 | User picked B with A close second (Vercel = primary current target) |
| Approach 1 + surgical case-study deep links | Brainstorm Q3 | User picked recommendation |
| Kill methodology hero demo | Codex R2 | "Built in 8 min" reads as theatrical without rigorous proof |
| Add /about to top nav | Codex R2 | Hidden /about = lack-of-confidence read on a pivot |
| Drop visible quality gate strip | Codex R2 | Credibility fragility from too many verifiable claims |
| 3 demos → 2 demos | Codex R3 | Drop Demo 3 (Decision Routing) to v1.1 |
| Remove /patterns from nav | Codex R3 | Empty top-level route = unfinished signal |
| Add "Method in practice" block | Codex R3 | Recovers methodology differentiation without theater |
| Wave-based applications | Codex R3 | Don't burn Vercel on 48-hr-old portfolio |
| Token freeze Day 3 (not Day 2) | Codex R4 | Day-2 hard freeze brittle |
| Wave 1 = thesis-aligned mid-tier | Codex R4 | Tier C SaaS would punish AI narrative |
| Phase 4.5 exit by criteria | Codex R4 | Time labels alone don't enforce discipline |
| Method block needs metric + click affordance | Codex R4 | Static screenshot alone reads decorative |
| Each /writing essay needs ≥1 concrete artifact link | Codex R4 | Senior signal — not just opinion |
| "Who this is for" homepage line | Codex R4 | Pivot statement currently implied, not stated |
| Availability line in footer + /about | Codex R4 | Lightweight conversion path |
