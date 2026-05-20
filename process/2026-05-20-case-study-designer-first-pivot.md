# Case Study Pivot — Designer-First Reframe

**Author:** Jay Moore
**Date:** 2026-05-20
**Status:** Approved (sections walked + visual-companion-approved one by one)
**Amends:** `process/2026-05-19-lead-response-loop-design.md` (the original case-study spec) — specifically §2 (case study shape) and §3+§5 voice
**Companion plan:** `process/2026-05-20-case-study-pivot-plan.md` (to be authored next via writing-plans skill)

---

## 1. Why this pivot

The original case study at `/work/lead-response-loop` shipped with engineer-first voice. When Jay walked the rendered page (`http://localhost:3001/work/lead-response-loop` on 2026-05-20), his honest read was:

> "i am a designer first and engineer as an added bonus that allows me to bring a product from design to execution quickly. the point is i dont talk like an engineer and dont understand much of the technical jargon on this website that you put there. i think the website needs to showcase my visual ui first and leave out verbose technical details that seem way overdone"

The page used technical vocabulary Jay doesn't speak. Sections (Approach, Decisions, Evaluation, Build log) read as a software architecture document, not a designer's case study. Visual UI was buried below 1000 lines of engineer prose.

This spec corrects the positioning. Designer leads, engineering proof stays available on demand.

## 2. Positioning

**Target roles:** Senior + Staff. Both Product Designer AND Design Engineer. **Skip Principal.** Single site serves both audiences — a product designer reader and a design engineer reader both find their signal in the first 30 seconds.

**Voice:** plain natural language. No insider jargon ("frozen contract", "P95 latency", "eval harness", "schema-versioned", "decision-support over full automation" as a title). Concrete nouns. Designer-first framing.

**The engineering is the bonus, not the headline.** Jay designs, then ships fast because he also codes. The case study reflects that ordering.

## 3. New page structure

11 sections at `/work/lead-response-loop`:

| # | Section | Voice | Notes |
|---|---|---|---|
| 00 | **Lede** | Designer, ~55 words | "I designed and built a system that turns missed calls into bookings for HVAC and plumbing businesses..." (V2 final). Ends with `Try the live demo below.` |
| 01 | **HERO · Simulator** | — | The existing interactive simulator (`app/work/lead-response-loop/simulator/`) promoted from Section 04 to immediately below the lede. Full-width. |
| 02 | **Phone mockups** | Visual | Three minimal-chrome (option B fidelity) phone mockups side-by-side below the simulator: Prospect → Owner → Prospect-after-YES. Generated from the simulator's rendered output. |
| 03 | **TL;DR · 3 tiles** | Visual | Kept from current build (qualification accuracy 96% / P95 latency 1.6s / Beta partner status onboarding). |
| 04 | **Problem** | Designer, ~95 words, 3 paragraphs | Rewritten in plain language. Final line: "So I designed something that does." Emphasis on full-fg color. |
| 05 | **Interaction design** | Designer, 4 bullets + Figma visuals | "The simulator itself, as designed object." Four bullets (Both phones at once / Timing in plain view / Owner's notification ranked for five seconds / Loud failure). Each bullet gets a Figma-designed visual placeholder, arranged in a **zig-zag** layout (Option C from the visual-companion ix-item-layout pass). Visuals authored by Jay later, slotted into placeholders. |
| 06 | **Design decisions** | Designer, 3 calls | V2 final. Title + one short paragraph each. "Show the owner. Don't auto-send." / "Reply in under a minute." / "SMS, not a dashboard." Plain-language tradeoffs. |
| 07 | **Outcomes** | Designer, ~60 words, 1 paragraph + 3 tiles | "It works. Real callers next." Honest in-build framing. Tile sub-lines read "waiting on beta partner" instead of "onboarding pending". |
| 08 | **Roadmap** | Designer, 4 items, plain language | "What's next." Each item ~1 sentence. "Web form follow-up", "Owner dashboard", "Weekly summary email", "AI receptionist". |
| 09 | **Engineering proof** | Technical, but only on demand | "The technical detail, for anyone who wants it." Wrapped in a `<details>` disclosure, closed by default. Inside: 4 blocks — Stack, Testing, Reliability, Repos. Compact paragraphs only; no full Approach prose, no Evaluation table, no Build log entries (those live in the GitHub repos). |
| 10 | **Where next** | — | Existing two-card footer. Already updated in commit `ad22bbc` (Homepage card body rewritten). No change. |

### Sections REMOVED from the previous build

- **Approach** (the multi-agent loop framing, frozen-output-contract narrative). Folded into the Engineering Proof disclosure as a single Reliability paragraph.
- **Evaluation** (the confusion-matrix table, FP/FN policy, SLO targets). Folded into the Engineering Proof disclosure as a single Testing paragraph.
- **Build log** (13 anchored chronological entries). Removed entirely. Git log on the repos carries the same information for anyone who wants it.

### Per-section voice rules (apply uniformly)

- No technical jargon in main body. Specifically: `schema`, `idempotent`, `webhook`, `retry queue`, `P95`, `eval`, `latency budget`, `auto-route`, `frozen contract`, `tool-use` — all banned outside the Engineering Proof disclosure.
- Plain English alternatives mandatory: `system` not `architecture`, `text someone` not `dispatch SMS`, `mistakes/where things went wrong` not `failure modes`, `test set I built` not `eval harness`.
- Sentences short. Each fact gets its own sentence where it makes the prose scan faster.
- Use first-person ("I designed", "I shipped") liberally. Designer voice is personal.

## 4. Phone mockup component

A new component for Section 02. Three phones side-by-side, minimal chrome (rounded-rect card, small speaker dot at top), each containing a small SMS-thread or notification card.

**Reused content** from current simulator code:
- Phone 1 (Prospect): `TEXT_BACK_BODY` constant (the auto-text), then a sample prospect reply ("water heater leaking everywhere can someone come today")
- Phone 2 (Owner): the `formatOwnerBody` output for the "urgent" canned scenario
- Phone 3 (Prospect after YES): Cal.com booking link + a confirmation event row

**Component name:** `PhoneMockupStrip` (lives at `app/work/lead-response-loop/phone-mockups.tsx`)

## 5. Interaction-design item component

A new `IxItem` component for Section 05. Takes a title, body, image-src/alt, and side ("left" | "right"). Renders a 2-column grid (image | text on "left", text | image on "right"). Mobile collapses to a single column with image above text.

**Figma placeholder assets** committed initially as `public/case-study/ix-{1,2,3,4}.png` with simple "placeholder" content. Jay swaps with real Figma exports later. The component reads them from `/case-study/ix-N.png`.

## 6. Engineering Proof disclosure

`<details>` element with a styled `<summary>`. Closed by default. Inside: 4 blocks (Stack, Testing, Reliability, Repos). Each block: small title + 2-4 sentence body. Compact spacing. No interactive elements beyond the disclosure toggle itself.

## 7. What stays unchanged

- Existing simulator (`app/work/lead-response-loop/simulator/`) — code unchanged. Position changes (moves from Section 04 to Section 01 hero).
- TL;DR tile values + chrome — unchanged.
- Where Next two-card footer — unchanged (already polished in `ad22bbc`).
- Password gate (`password-gate.tsx`, `actions.ts`) — unchanged.
- Page header (eyebrow "Case study" + h1 "Lead Response Loop.") — unchanged.
- Global typography + token system — unchanged.
- Metrics snapshot fetch (`metrics.ts`, snapshot JSON, GitHub Action) — unchanged.

## 8. What gets DELETED from `case-study-content.tsx`

- The `Approach` section JSX (current §03)
- The `Evaluation` section JSX (current §06) including the `EVAL_ROWS` constant + table markup
- The `Decision` helper component + all 4 current Decision instances (replaced with simpler 3-decision pattern; `Decision` component itself can be rewritten or replaced with a smaller `Choice` component)
- The `BUILD_LOG` constant + the entire build-log section JSX (current §08)
- The `ArtifactPanel` component (no longer used — all artifact-style placeholders are gone)
- The `Placeholder` component (no remaining placeholders in the new structure)
- The `OUTCOMES_TILES` literal pattern within the Outcomes section is replaced — the tiles come from a fixed `OUTCOMES_TILES_V2` constant or stay inline since they're all "0 · waiting on beta partner" placeholders until real data lands

## 9. Component file map (after the pivot)

```
app/work/lead-response-loop/
├── page.tsx                    (unchanged)
├── password-gate.tsx           (unchanged)
├── actions.ts                  (unchanged)
├── case-study-content.tsx      (heavy rewrite — see §10)
├── phone-mockups.tsx           (new — Section 02)
├── ix-item.tsx                 (new — Section 05 reusable item with image)
├── metrics.ts                  (unchanged)
├── metrics-snapshot.json       (unchanged)
└── simulator/                  (unchanged — code stays as-is)

public/case-study/
├── ix-1-both-phones.png        (new — Figma placeholder, Jay replaces)
├── ix-2-timing.png             (new — Figma placeholder)
├── ix-3-notification.png       (new — Figma placeholder)
└── ix-4-loud-failure.png       (new — Figma placeholder)
```

## 10. What's left open for the implementation plan

- Phone-mockup styling spec (rounded radius, padding, speaker-dot size, font sizes inside the screen, "header" text treatment)
- IxItem mobile breakpoint behavior (single-column stack order — image above or below text on narrow viewports?)
- Engineering Proof disclosure: should it stay closed by default for ALL visitors, or auto-open if a `?eng` query string is present (for sharing the engineering view to a DE recruiter directly)?
- Figma placeholder image dimensions + format (PNG vs SVG)
- Whether to keep `EVAL_ROWS` constant in the source (it's referenced from the Engineering Proof's Testing paragraph but no longer renders a table)
- Disposal of removed file content: are `Decision` / `ArtifactPanel` / `Placeholder` / `BUILD_LOG` / `EVAL_ROWS` deleted outright or retained for git-log searchability?

## 11. Approvals + history

- **2026-05-20** — Jay flagged engineer-first voice issue on rendered page
- **2026-05-20** — Brainstorming session via visual companion. 7 sequential approvals:
  - Q1 target roles (Senior + Staff Designer + DE, skip Principal)
  - Q2 visual assets (simulator + phone-frame mockups, generated)
  - Q3 engineering sections (Path B: condense + reframe, with interaction design called out)
  - Q4 hero layout (Option A: simulator full-width hero, mockups below)
  - Q5 interaction-design moment (C: simulator itself as designed object)
  - Q6 phone fidelity (B: minimal restrained chrome)
  - Layout per ix-item (C: zig-zag with Figma visuals)
- **2026-05-20** — All section content drafts approved one by one via visual companion (above-fold mockup, sections 04+05, section 06 v2, chunk 3 v2)
- **Pending** — Codex second-opinion pass on this spec
- **Pending** — Jay review of this written spec
- **Pending** — Implementation plan via writing-plans skill
