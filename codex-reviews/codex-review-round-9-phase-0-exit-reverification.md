# Codex Review — Round 9 — Phase 0 EXIT re-verification

**Type:** Phase-boundary re-verification. NOT a new exploration round.
**Date:** 2026-05-14
**Predicted by:** Codex R8 itself, which ended with: "Log this checkpoint in working record as integrated sign-off, then re-verify." This brief is that re-verification.

---

## What this checkpoint is for

Codex R8 (Phase 0 exit) returned CONDITIONAL with four ordered fixes. Two were mechanical and have been applied to the locked file. Fix #1 (hero contract) was reframed by Jay in a subsequent decision into an explicit accepted-risk call: the hero is treated as an editorial slot inside the locked shell, refilled yearly with whatever AI-UX pattern is most timely, with no lineage / no archive route / no version label / no portfolio-side history; past projects are surfaced natively via github profile + standard README discipline.

Three things now need to be verified before Phase 0 can exit:

1. Whether that hero-slot reframe is a sound resolution of R8 surface 4, or a rationalization.
2. Whether the two mechanical R8 fixes were applied correctly and the locked file now actually meets the standard R8 demanded.
3. Whether the locked composition — structure + type + color + motion, looked at as a single integrated artifact — is safe to freeze.

If all three clear, Phase 0 exits, the token contract freezes, the planning folder graduates to a public repo, and Phase 1 begins.

---

## CRITICAL — scope discipline for this verdict

This is the second checkpoint in three messages. The whole reason it exists is that Jay (correctly) wants a clean-eyed outside review rather than Claude self-reviewing the integrated lock. But it sits at the exact risk surface R5 and R6 caught: the "one more round, but this time it's the real one" instinct that the Phase 0 hard cap was written to stop.

To prevent re-litigation, the brief is structured to **invite verification, not exploration**:

- Locked decisions (Iteration 3 structure, Pair D type, Palette 1 color, motion baseline) are out of scope. If a defect is found, name it and the single specific fix — do not re-open the locked decision tree.
- The hero-slot reframe is committed for the purpose of this checkpoint. If Codex disagrees with the reframe, the verdict should be: name the specific defect and the single specific fix to the reframe — NOT "explore more options" or "reconsider the deferral."
- The verdict format is binary at the surface level: SAFE / NOT SAFE / SAFE WITH CONDITION. For NOT SAFE, one named fix, not a list of alternatives.
- A clean pass is a possible outcome. R8 already did the adversarial heavy-lifting; this round verifies the result. Do not invent process to fill space.

Codex's most useful posture here: skeptical-but-precise. If the work landed, say so. If something specific is broken, name exactly what.

---

## What is being verified

Source-of-truth files in the planning folder:

- `2026-05-14-phase-0-visual-direction.md` — Section 7's Codex R8 entry shows the four-fix list and current applied/pending status. Header lines show the current Phase 0 status.
- `round-3-palette-1-instrument-cool.html` — the locked artifact. Header comment now logs Codex R8 fixes #2 and #3.
- `codex-reviews/codex-review-round-8-phase-0-exit.md` — the R8 brief that produced the four fixes (context).

---

## Surfaces to scrutinize

### Surface 1 — the hero-slot reframe

Codex R8 surface 1 said the locked file froze values around a hatched placeholder where the hero demo goes, and surface 4 said the locked artifact is a competent shell with a missing differentiator. R8's prescribed fix was a hero interaction contract (footprint confirm + three-state low-fi sketch + motion-token needs) before freeze.

Jay declined to fill that contract and instead reframed the hero structurally:

- The hero block is **an editorial slot**, not a placeholder for one specific eventual artifact. The slot is part of the locked shell.
- It is **refilled yearly** with whatever AI-UX pattern is most timely. No lineage between years — 2026 might be a trust surface, 2027 might be agentic routing, 2028 might be something not yet invented. They are not iterations of the same thing; they are independent works in the same slot.
- There is **no portfolio-side archive**. No `/hero/archive` route. No version label. No "refreshed annually" caption. The portfolio shows only the current hero, with the standard `Repo →` affordance the spec's Section 4 already specifies for every demo.
- Past heroes are **standalone github repos** with mini-case-study READMEs (the existing scaffolding from implementation plan Task 7 — tradeoffs, perf budget, a11y, known limitations, what it maps to). Anyone who wants the history browses github, which is where the deep-path reviewer goes anyway.

Codex R8 fix #1 is **not applied** — it is reframed and the underlying risk is **explicitly accepted**, on the record, as Jay's call. The acceptance rationale: the hero interaction has its own design loop in a separate session; the locked shell provides constraints for that work; footprint-fit becomes a Phase 1 risk if it materializes.

The question for this verdict:

**Does the hero-slot reframe actually resolve R8 surfaces 1 and 4, or does the underlying concern reassert at a new level?**

Two specific framings to test:

- **(a) The "the slot itself is the bet" claim.** Does Codex agree that a portfolio committing to "the hero is whatever's most current each year" is a legitimate editorial position — i.e., the differentiation lives in the slot's editorial commitment, not in any specific artifact occupying it — or is that special pleading? Specifically: a recruiter doing the 45-second scan today sees the slot, currently with no live demo. Does the editorial framing close that gap, or does the slot still need a live current occupant for the artifact to be safe to ship?
- **(b) The "github is the archive" claim.** Is it actually true that github + standard READMEs serves the deep-path reviewer's archive-curiosity well enough to replace a portfolio-side archive, or does that argument hold only if the github profile and READMEs are themselves designed surfaces that get separate care? If the latter, is "every pattern repo follows the existing README scaffolding" sufficient, or is more required for this claim to hold?

If the reframe holds, surface 1/4 closes. If it doesn't hold, name the specific defect and the single fix. Possible fixes (do not enumerate beyond this — Jay will pick from the named one):

- "Add a current live demo to the slot before freeze, even minimal" (rejects the reframe; reasserts the contract requirement).
- "Reframe holds but the slot needs a one-line caption at v1 that makes the editorial position legible to the scan reader" (accepts reframe; demands a thin visible signal).
- "Reframe holds but the README scaffolding needs to be enforced as a hard rule, not a soft convention, on every pattern repo" (accepts reframe; demands a discipline guardrail).

### Surface 2 — were the two R8 mechanical fixes applied correctly?

The locked file (`round-3-palette-1-instrument-cool.html`) header comment logs both fixes. Verify against the file itself.

**Fix #2 — AAA on long-form body.** R8 said `--fg-soft` shipped at ~6.7 (AA) and the spec + Round 3 gate required AAA on body. Jay chose to deepen the token rather than amend the spec.

- Light `--fg-soft: #4f555d → #42474e`. Claimed contrast on bg `#f1f3f5`: 8.42; on bg-2 `#e7eaed`: 7.75; on panel `#ffffff`: 9.36. AAA (≥7.0) on every surface.
- Dark `--fg-soft: #9197a0 → #a8aeb7`. Claimed contrast on bg `#0b0d10`: 8.71; on bg-2 `#131619`: 8.13; on panel `#161a1e`: 7.83. AAA on every surface.
- Hierarchy claimed intact: body ~15.8, soft ~8.5, faint ~4.7, three distinct tiers in both modes.

Verify the numbers (a contrast calculation is straightforward and the issue would catch immediately if the math is wrong). Verify the hierarchy claim — is "three distinct tiers" actually true at these values, or has the body-to-soft gap narrowed enough to flatten the visual hierarchy? If the hierarchy is too flat, name the specific fix; do not propose a return to the AA-only state, which would re-open the contradiction.

**Fix #3 — motion baseline tokenized.** R8 said durations and easing were hardcoded inline = undefined as contract values. The locked file now defines in `:root`:

- `--duration-fast: 150ms`
- `--duration-normal: 250ms`
- `--duration-slow: 400ms`
- `--duration-lazy: 600ms`
- `--ease-snappy: cubic-bezier(.32,.72,0,1)`

Every transition and the section-rise animation reference these tokens. The reduced-motion block has been made comprehensive (`*, *::before, *::after` collapsing all animation/transition durations, plus the explicit section/footer reset and scroll-behavior auto).

Verify:
- The token set is complete enough to serve as a contract — i.e., nothing the locked file currently does in motion is left untokenized.
- The four-rung ladder is defensible. R8 itself said three; the file locks four (the rationale logged in the file's `:root` comment is that `--duration-normal` is the spec's component-transition default, which Phase 1 will consume regardless, so omitting it from the freeze just forces Phase 1 to re-add it). Is that rationale sound, or is `--duration-normal` actually unused-and-speculative-and-should-be-cut?
- The reduced-motion block actually covers what it claims — page reveal, nav-hover, hero transitions all degrade to instant, no state becomes unreachable.

### Surface 3 — the integrated sign-off

This is the clean-eyed pass that no single round did. Structure (Iteration 3), type (Pair D — Hanken Grotesk × Spline Sans Mono), color (Palette 1 — cool slate base, steel-blue accent, contrast-corrected at lock, AAA on body after fix #2), motion (R8 baseline, tokenized) — looked at as one composition.

The question is not "is each piece fine" — that was the per-decision lock work. The question is: **does looking at the integrated artifact surface anything the individual locks missed?**

Specific things to check:

- **Coherence.** Do structure, type, color, and motion read as a single intentional system, or do you see the seams between decisions made at different times with the others held provisional?
- **Hierarchy under the contrast fix.** With `--fg-soft` deepened, the secondary text tier got heavier. Verify visually (the file is inspectable in both themes) that the body → soft → faint hierarchy still reads as three distinct tiers and the soft tier hasn't collapsed toward body. Both modes.
- **Empty slot under real review.** Sit with the locked file open and read it the way a Vercel/Anthropic recruiter scanning in 45 seconds would. The hero slot is currently a hatched placeholder. Given the surface-1 reframe (the slot IS part of the editorial position), does the artifact-with-empty-slot ship as-is, or does the integrated read surface a problem the single-lock reviews couldn't?
- **Dark mode as a first-class surface.** R8 surface 5 noted dark-mode-as-afterthought as a concurrent-with-Phase-1 risk. With everything now corrected and tokenized, verify dark mode actually reads as designed-intentional, not inverted-from-light.
- **One thing each round didn't ask.** Anything obvious in the integrated view that just wasn't on any prior surface's checklist? (Genuinely open question — this is the value of clean eyes.)

If the integration holds, surface 3 closes and Phase 0 exits. If it surfaces something, name the specific defect and the single fix.

---

## Verdict format requested

For each of the three surfaces:

- **SAFE** / **NOT SAFE** / **SAFE WITH CONDITION**
- For anything not SAFE: the single specific fix, and whether it blocks the freeze.

Then a single overall verdict: **is Phase 0 safe to exit and freeze, yes or no.** If conditional, the ordered list of what must happen first, with each item being a small concrete action — not "iterate further" or "explore alternatives."

Be precise rather than thorough. R8 already did the thorough work. This round verifies, with one shot at catching anything that integration-blindness hid.
