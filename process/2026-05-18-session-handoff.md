# Session handoff — 2026-05-18

Snapshot of where the build stands at the end of this session. Read before resuming work.

## Tip of `main`

```
b2652f4 fix: keep homepage coordinate labels inside content grid
c0c6bed fix: collapse Placeholder size prop to "large" | "body"
ff128c3 feat: /work/spm-lifecycle case study scaffold + password gate
561dd50 fix: promote /about section eyebrows to h2 (a11y)
15fce55 feat: add /about page (credibility bridge)
ccd57eb fix: apply design-review findings to DepthList
70f50de feat: extract DepthList with scroll-reveal motion + hover shadow
8880070 fix: respect prefers-reduced-motion in trust-surface morph
513d488 feat: homepage 3-block scan spine + trust-surface demo
…
```

## Routes shipped

| Route | Status | Notes |
|---|---|---|
| `/` | ○ Static | Homepage 3-block scan spine. TopBar + Footer chrome, body grid, trust-surface demo with text ↔ canvas morph, depth list with scroll-reveal slide, coordinate labels constrained to content grid. |
| `/about` | ○ Static | Credibility-bridge page. Two-column editorial (narrative + sticky sidebar). Real content drafted with Jay's voice. |
| `/work/spm-lifecycle` | ƒ Dynamic | Case study scaffold, **password-gated**. Real metrics in TL;DR card; everything else placeholders. |

`/_not-found` exists by default.

## Components on main

| Component | Where |
|---|---|
| `TopBar` | `components/top-bar.tsx` — green status dot + Jay Moore wordmark, Start/Demo/Depth/Github nav, pill `ThemeToggle`, mobile hamburger drawer (`inert` when closed) |
| `ThemeToggle` | `components/theme-toggle.tsx` — pill, `h-8`, outline circle + current-mode label, `aria-pressed` |
| `ThemeProvider` | `components/theme-provider.tsx` — `useSyncExternalStore` + `MutationObserver` on `html.dark` class, FOUC-prevention init script in `layout.tsx` |
| `SkipToContent` | `components/skip-to-content.tsx` — `sr-only` until focused |
| `Footer` | `components/footer.tsx` — `bg-bg` opaque, mono `text-2xs` row, identity left, `github · linkedin · jay@jaymoore.net` right |
| `TrustSurface` | `components/trust-surface.tsx` — 16:10 specimen on homepage Block 2. Modes: ready → text → canvas. Motion library `layoutId` morph between prose and structured cards. Respects `prefers-reduced-motion` via `MotionConfig reducedMotion="user"` |
| `DepthList` | `components/depth-list.tsx` — 3-item Block 3 list. Whole-row `<Link>`, hover `shadow-(--shadow)`, scroll-reveal slide motion (`viewport.once: false`) |

## Design system

- Phase 0 token contract: `process/token-contract.md` (frozen — names/count/scale locked; values iterable)
- Icon conventions: `process/icon-conventions.md` (lucide-react, 1.5 stroke, curated set + skip list)
- Written design system spec: `design/design-system.md`
- Visual style guide: `design/style-guide.html` (single-file standalone — open via `file://`)
- About-page exploration mockups: `design/about-option-a.html` / `-b.html` / `-c.html` (option A chosen)
- Content drafts: `design/content/about.md`

## Open threads — SPM case study (next session)

Two distinct work items, both **deferred to separate sessions**:

### 1. Case study content

Status: scaffold built, placeholders italic-bracketed-faint marked TBD. Real metrics ARE in (`TTF-touch 30 min → 60 s` / `Reply rate 4.6–4.9%` / `Industry baseline ~1%`).

Sections needing content (all in `app/work/spm-lifecycle/case-study-content.tsx`):
- Hero lede
- 01 / TL;DR one-line summary
- 02 / Problem — TL;DR sentence + 2–3 paragraphs
- 03 / Approach — TL;DR + narrative + 3 artifact panels (diagram, code, screenshot)
- 04 / Demo — TL;DR sentence (the live demo embed itself is a separate work item)
- 05 / Outcomes — TL;DR + narrative metrics + reflections

Pickup plan:
- Brainstorming session for the case-study narrative (like /about's content session)
- Jay drops content into `design/content/spm-lifecycle.md`
- Each `<Placeholder>` callsite gets swapped to a real `<Prose>` (or whatever sized component the content needs)
- Each `<ArtifactPanel>` gets a real diagram/code/screenshot

### 2. Live demo embed

Status: 16:10 placeholder slot reserved at section 04, same chrome family as the trust-surface slot on the homepage (`bg-panel` + border + diagonal stripe gradient + chip).

Pickup plan:
- Brainstorming session for what the lifecycle demo does (similar process to the trust-surface brainstorm: state names, layout options, controls)
- Build the interaction (likely a client component, possibly with motion)
- Replace the placeholder div in `case-study-content.tsx` with the real component

## Password gate — admin notes

`/work/spm-lifecycle` is gated by a custom in-page `PasswordGate`. Backed by:
- `app/work/spm-lifecycle/page.tsx` — async server component dispatcher, reads `spm-case-study-auth` cookie
- `app/work/spm-lifecycle/password-gate.tsx` — client component with `useActionState`
- `app/work/spm-lifecycle/actions.ts` — server action `unlockCaseStudy`
- `.env.example` documents `CASE_STUDY_PASSWORD`

**Production setup:**

Set `CASE_STUDY_PASSWORD` in the deployment dashboard (Vercel / Cloudflare) before sharing the URL. If unset, fallback is the literal string `"preview"` so the route doesn't 500 — but anyone could guess that. Don't ship without the env var set.

**Cookie behavior:**

30-day persistent unlock per browser/device, `httpOnly` + `sameSite=lax` + `secure` in production + path-scoped to `/work/spm-lifecycle`.

**Local dev:**

Copy `.env.example` to `.env.local` and set `CASE_STUDY_PASSWORD=` to something memorable. Or accept the `preview` fallback and use that password in the gate form. Dev server doesn't hot-reload env changes — restart after editing `.env.local`.

## Process gates established this session

Saved as feedback memories. Auto-load in future sessions:

- **frontend-design** before any visible UI work; **brainstorming** for novel interactions; **design-review** before merging PRs that ship visible UI
- **codex-second-opinion** before every commit (skip with documented justification when codex stalls — happens occasionally)
- **show-before-commit** — always show diff/work and wait for Jay's explicit "ship" before `git commit`
- Spec authority: `.md` docs + Jay's image references are spec. Phase 0 HTML mockups in `process/round-3/` are NOT spec.

## Floating local files (not committed)

These follow across branches but aren't part of any committed work:

- `CLAUDE.md` (project-level) — Jay's local motion-design notes addition
- `.claude/context/rauno-interfaces/` — reference material Jay dropped in
- `design/fonts/` — Jay's local TTF downloads of Hanken + Spline
- `design/specimen-iterations/` — Jay's working files
- `process/case-study-hero-1/` — Jay's notes
- `process/claude-design-seed-prompt.md` — Jay's prompt notes

Auto-mode classifier blocks stashing them. Jay handles when ready.

## What was NOT touched

- The actual SPM case study content
- The live demo interaction
- Vercel / Cloudflare deployment configuration (`vercel.json` / `wrangler.jsonc`)
- The `npm install` of remaining Task 1 dependencies (`motion` was pulled forward; `@next/mdx`, `gray-matter`, `@vercel/analytics`, etc. still unscheduled)
- Lighthouse + axe weekly action (Task 24)
- `/lab` or `/writing` routes
- The Fiserv case study (separate work, content-private per CLAUDE.md)

## How to come back

1. `git checkout main && git pull`
2. `cat process/2026-05-18-session-handoff.md` (this file)
3. Decide: case study content OR live demo (or something else entirely)
4. Branch off main with a descriptive name
5. Tell the agent which thread you're picking up; it'll route through the established gates (brainstorming → frontend-design → build → show → codex → commit → design-review → merge)

Dev server: `npm run dev`. Port 3000 may be taken by another project; Next will pick the next available (3001/3002/3003).
