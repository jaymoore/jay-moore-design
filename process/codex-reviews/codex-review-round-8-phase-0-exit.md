# Codex Review — Round 8 — Phase 0 EXIT checkpoint

**Type:** Phase-boundary checkpoint. This is the LAST gate of Phase 0.
**Date:** 2026-05-14
**Scope:** The whole locked visual direction — not a single round's plan. This is the gate before the token contract freezes and before `visual-direction-approved/` is created.

---

## What this checkpoint is for

Rounds 5, 6, 7 each reviewed a single round's *plan* before it ran. This one is different. Phase 0 visual exploration is now **complete** — structure, type, and color are all locked. Round 8's job is to stress-test the **integrated result and the decision to freeze it**, before:

1. the token contract freezes (names + values become contract, consumed by Task 2 of the implementation plan),
2. the planning folder graduates to a standalone public repo,
3. Phase 1 (build) begins.

This is the expensive-to-reverse boundary. Once the contract freezes and the repo graduates, reopening visual direction means churn against committed code. So the question is not "is each piece fine" — it's **"is it safe to freeze and build on this, and what will we regret."**

Do not give a victory lap. Codex R5 and R6 both caught process-cost / over-iteration drift; R7 caught three coupled plan defects. The useful output here is the same: name what is NOT safe, and what the fix is.

---

## What is locked (the thing under review)

All three rendered in `round-3-palette-1-instrument-cool.html` (the locked file). The two other relevant files: `round-3-prestep-type-specimens.html` (type pre-step) and `2026-05-14-phase-0-visual-direction.md` (the full working record — read Sections 0, 2, 4, 5).

**Structure — Iteration 3, "the no-HUD control" (locked Round 2):**
- Single nav row, no HUD. The "instrument" signal carried by type + grid + a left-edge vertical coordinate system, NOT by chrome. (The HUD was killed — Jay: "cosplay.")
- 3-block scan spine: Block 1 positioning + pivot / Block 2 one hero demo + one-line method proof / Block 3 where to go for depth.
- Decompressed, whitespace-separated, no section boxes. Strongest grid intensity (~80px).
- Hero demo staged as a **placeholder** at a locked ~16:10 footprint in Block 2. The real interaction is being designed in a SEPARATE pass and does not exist yet.
- Light-primary with dark toggle. Method record local-to-demo. Vertical scroll.

**Type — Pair D (locked Round 3 pre-step):**
- Hanken Grotesk (display) × Spline Sans Mono (mono).
- Chosen over a Geist × Geist Mono candidate (Vercel's hand — looked at, ruled out as derivative-risk).
- Noted in the record: Pair D is Jay's THIRD consecutive warm-over-cold call. A "warmth budget" caveat was logged.

**Color — Palette 1, "instrument-cool" (locked Round 3):**
- Cool slate base (`--bg #f1f3f5` light / `#0b0d10` dark), steel-blue accent.
- Chosen after seeing three controls: warm-orange, near-monochrome, and a 4th combination (cool base + burnt orange). Jay's framing: "Read A — the exploration did its job; the controls confirmed the baseline."
- Contrast-corrected at lock (the as-rendered draft had three WCAG fails): light accent `#2d6ae0 → #1f57bd`; accent-deep `#1f4fad → #1a4496`; `--fg-faint` `#868d96 → #676c72` (light) / `#5b616b → #777d87` (dark); `::selection` made theme-aware.
- Documented freeze state: **"AA-clean, AAA-aspirational."** Everything clears WCAG AA in both modes. The Round 3 gate's "AAA on demo/method long-form" was NOT literally hit — `--fg-soft` (the actual long-form body color) is ~6.7 (AA, not AAA). The call was: chasing AAA site-wide is a direction change, not a token fix, so it's logged as a post-hire iteration target.

---

## Surfaces to scrutinize

Pressure-test each. For any that is not safe, name the specific fix.

### 1. The placeholder-hero sequencing risk

The entire visual direction — structure, type, color — was judged with a hatched **placeholder** where the hero demo goes. The hero demo is, per the spec and the bet, the single most important element on the page ("demos are the hero object"). The real interaction (a trust surface: confidence / evidence / override) is being designed in a separate pass and **does not exist yet**.

The question: **is it safe to freeze the token contract and graduate the repo before the hero interaction exists?** Risks to weigh — the real interaction may need a different footprint than the locked ~16:10; may read badly in steel-blue; may be too dense for the "calm, decompressed" treatment; may need motion tokens that don't exist yet. Counter-argument: the placeholder holds a deliberate realistic footprint exactly so the rest can be judged without it, and a token contract is values, not layout, so the hero can be built against frozen tokens. Which side wins? If freeze-now is unsafe, what is the minimum that must exist first — a sketch, a footprint confirmation, a low-fi wireframe?

### 2. "AA-clean, AAA-aspirational" — sound freeze state, or deferred-debt trap?

The craft bar in CLAUDE.md says "WCAG AA minimum (AAA on body contrast)." The locked palette is AA-clean everywhere but does NOT hit AAA on long-form body (`--fg-soft` ~6.7). The working record logs this as an accepted post-hire target.

Is that a sound call, or is it the kind of "we'll fix it later" that never gets fixed and surfaces in a recruiter's own axe/Lighthouse run? Note the specific tension: this portfolio's whole thesis is *surviving inspect-element + Lighthouse scrutiny from Vercel/Anthropic*. Does shipping a known sub-AAA-on-body state undercut that thesis, given the craft bar explicitly named AAA on body? If this must be fixed before freeze, the fix is deepening `--fg-soft` in both modes — small, but it shifts the secondary text tier site-wide and should be a deliberate decision, not a silent one.

### 3. Coherence of one-at-a-time locks

Structure locked in Round 2 (type + color held provisional). Type locked in the Round 3 pre-step (grayscale, no color, no real layout). Color locked in Round 3 (structure + type held constant as "background"). At no point was the **integrated final composition** — final structure + final type + final color values, together — reviewed clean-eyed as a single artifact whose only question is "is this whole thing good." The locked file technically shows all three, but it was being evaluated as a *color* treatment.

Is a dedicated integrated review needed before freeze? Or do the three locks compose safely because each was locked against the others-as-context? If an integrated pass is needed, it is cheap (one read of one file) and should happen before the contract freezes — but call it explicitly if so.

### 4. Did Phase 0 serve the Section 0 reframe — and is the OUTPUT differentiated enough?

Section 0 of the working record names the governing constraint: **the portfolio is a job-getting instrument first; time-to-hire wins; every decision is tested against "does this get a skeptical recruiter to reply faster."**

Phase 0 ran: 3 rounds + a type pre-step + 4 palette treatments + 4 Codex checkpoints (rounds 5–8). The OUTPUT of all that: a cool-slate base, a steel-blue accent, Hanken Grotesk + Spline Sans Mono, a no-HUD 3-block layout with a left-edge coordinate system.

Two honest questions, both uncomfortable, both the point of a ruthless checkpoint:
  - **(a) Did the process earn its cost?** Or was this the Enneagram-1+5 over-process that Section 0 was explicitly written to prevent, and that R5/R6 already caught versions of? Be specific: which rounds added real signal, and which were the "one more round" instinct?
  - **(b) Is the output actually differentiated, or is it competent-and-safe?** A skeptical Vercel/Anthropic reviewer sees a lot of cool-base/mono/restrained portfolios. The working record's own Section 3 finding was that the spec's visual system was "a competent average of the cohort" and Phase 0's job was "to add a specific bet." Did the locked direction add a specific, legible bet — or did it land back on the competent average with extra steps? If it's under-differentiated, is that fatal (fix before freeze) or acceptable (the differentiation is the hero demo + the live-interaction thesis, and the chrome SHOULD be quiet)?

### 5. Phase 0 blind spots — what wasn't explored that should have been

Motion language was explicitly deferred (Section 5, decision 5 — "open, deferred, not a Round 3 variable"). Is deferring motion to build-phase safe, or does motion need at least a locked principle before the contract freezes, given motion tokens (`--duration-*`) are part of the contract? Anything else Phase 0 structurally did not look at — responsive behavior beyond one breakpoint, the dark mode as a first-class surface vs an afterthought, favicon/OG/meta visual identity, the `/work` and `/about` page templates (Phase 0 only ever rendered the homepage) — that will bite in Phase 1 if not flagged now?

### 6. Graduation readiness

Concretely: is it sound to (a) freeze the token contract — names AND values — into the form Task 2 of the implementation plan consumes, (b) copy the planning folder to a standalone repo and `gh repo create` it public, (c) start Task 1? If not all three, which, and what has to happen first? Note the hard rule: nothing pushes to GitHub until Jay says graduate — this checkpoint informs that call, it does not make it.

---

## Verdict format requested

Same as prior rounds. For each of the 6 surfaces: **SAFE** / **NOT SAFE** / **SAFE WITH CONDITION**. For anything not clean, the specific fix and whether it blocks the freeze or can run concurrently with Phase 1. Then a single overall verdict: **is Phase 0 safe to exit and freeze, yes or no**, and if conditional, the ordered list of what must happen first.

Be blunt on surface 4. That is the one most likely to be soft-pedaled and most worth hearing straight.
