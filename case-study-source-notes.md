# Case Study Source Notes — Phase 0 Visual Direction

**Status:** raw material for the v1.1 case study at `/writing/portfolio-process` (or similar). Captured 2026-05-14 while the decisions are fresh. Not a draft — the *moments* the case study will pick from.
**Intended frame:** "How I make high-stakes design decisions under time pressure." Not "how I designed my portfolio's visual system." See "Frame discipline" at the bottom.
**Source of truth:** `2026-05-14-phase-0-visual-direction.md` (full working record). These notes summarize, not replace.

---

## The seven moments

### 1. The Section 0 reframe (Codex R5 + Jay's own constraint)

**What happened:** Phase 0 started as a craft-beauty exploration. Codex R5 caught the drift: bills are real, time-to-hire governs, the portfolio is a job-getting instrument first and a craft artifact second. Jay absorbed it as a written reframe at the top of the working record. Every subsequent decision was tested against the reframe.

**Why it matters narratively:** this is the **spine** of the case study. Without this beat, the whole thing reads as process for process's sake. With it, every later decision (the hard cap, the override of Codex R9 option A, the deferral of /writing/trust-surfaces) has a coherent reason. **Lead with this.**

**One-line case-study version:** "Most portfolios optimize for craft-beauty. I optimized for shipped-and-defensible, because bills are real."

---

### 2. The HUD kill (Round 2 Iteration 3)

**What happened:** Direction C had a HUD overlay that Jay liked. Round 2 tested three iterations: HUD-on, HUD-pared, no-HUD. Jay's verdict on the no-HUD control: "the HUD feels too much like cosplay." HUD died. The rigor signal got carried by type + grid + a left-edge vertical coordinate system instead — no chrome.

**Why it matters narratively:** clean **kill-criteria** example. Shows the practice of building a control variant *for the express purpose of testing your favorite option against it*. The thing Jay liked got killed by the discipline he set up beforehand. That's not subjective taste — that's a kill rule firing.

**One-line case-study version:** "I built a no-HUD control specifically to test the HUD I liked. The control won. The HUD was cosplay."

---

### 3. The Round 3 palette exploration + the return to Palette 1

**What happened:** Three palette treatments rendered (instrument-cool / warm-orange / near-monochrome). All rejected. Jay asked for a 4th combination (cool base + orange accent). Built it. Then: "well, let's just stick with blue Palette 1." Three controls confirmed the baseline was strongest the whole time.

**Why it matters narratively:** the **"exploration earns the simple answer"** beat. Without the controls, "I picked the baseline" reads as low-effort. With the controls in evidence, "I picked the baseline" reads as a tested conclusion. The case study can show the four artifacts (Palettes 1/2/3 + the 4th combination) and let the reader see the work.

**One-line case-study version:** "I built three controls and a fourth combination to test the baseline against. The baseline won. That's not laziness — that's confirmation."

---

### 4. Contrast verification at the lock review

**What happened:** Before locking Palette 1, ran the WCAG sweep. Found three things the eyeball had missed: light accent `#2d6ae0` was 4.09 on bg-2 (under AA 4.5 floor); `--fg-faint` was 3.01 in both modes (under AA small-text); `::selection` hardcoded white text failed in dark mode (2.77 white-on-light-blue). All fixed in place at lock.

**Why it matters narratively:** **"floor-skimming is not the bar."** Concrete demonstration that AA isn't a checkbox — it's a measurement. Shows the gap between "looks fine" and "passes." The case study can include the actual contrast numbers as a small embedded table — that's the kind of inspect-element-survivable rigor recruiters scan for.

**One-line case-study version:** "I ran the contrast numbers before I locked the palette. Three real fails surfaced. None were visible to the eye. All were measurable."

---

### 5. The AAA-vs-amend-spec decision (Codex R8 fix #2)

**What happened:** R8 caught that the spec required AAA on body but `--fg-soft` shipped at ~6.7 (AA only). Two paths: deepen the token, or amend the spec down to "AA everywhere, AAA on body only." Jay picked deepen. Reasoning made explicit on the record: amending the written standard down to match shipped work is the opposite of the signal the portfolio sells.

**Why it matters narratively:** **values-on-the-record moment.** Not a craft decision — a values decision about *what the artifact is for*. The portfolio's whole thesis is surviving recruiter Lighthouse/axe runs. Editing the standard to match the shipped product breaks that thesis. This beat shows the discipline of letting the standard govern the work, not the other way around.

**One-line case-study version:** "The spec said AAA on body. The values shipped at AA. I had two options: meet the standard, or edit the standard. I met it."

---

### 6. The hero-slot reframe + Codex R9 rejection + Jay's option B override

**What happened:** R8 said the locked file froze around a placeholder; the bet wasn't in the artifact yet. Jay reframed: the hero isn't a placeholder, it's an editorial slot, refreshed yearly with whatever AI-UX pattern is most timely; archive is github, not the portfolio. R9 rejected the reframe — editorial framing alone is invisible to a 45-second recruiter scan; the box still reads as "core proof pending." R9 picked option A (build the live demo before freeze). Jay picked option B from the R9 brief's named list (visible caption converting the box to an "intentional slot"). Override documented as deliberate trade-off.

**Why it matters narratively:** **the most sophisticated beat in the trail.** Three moves stacked: (a) a structural reframe of a problem, (b) an adversarial verdict that the reframe was insufficient — *correctly* — and (c) a deliberate override that took the verdict's diagnosis but chose a different prescription. The override is logged with reasoning, not laundered. This is the senior-design-engineer signal the whole case study builds toward.

**One-line case-study version:** "Codex was right about the diagnosis and wrong about the prescription. I documented the override rather than hide the disagreement."

---

### 7. The motion-delays gap caught in R9

**What happened:** R8 had tokenized the motion baseline. The locked file's header comment said "motion contract is complete." R9 found that the four reveal-stagger delays (`.05s/.13s/.21s/.29s`) were still hardcoded inline — the contract claimed to cover motion but didn't cover delays. Half-tokenizing is worse than not tokenizing because it implies completeness. Fixed at R9 with two stagger tokens.

**Why it matters narratively:** **the cleanest concrete example of what adversarial review catches that self-review misses.** Specifically: self-review confirms the things you remember to check. Adversarial review checks the things you forgot you weren't checking. The motion baseline felt complete. It wasn't. The case study can use this as the punchline of the "why adversarial review" argument — short, specific, falsifiable, before/after.

**One-line case-study version:** "I declared the motion contract complete. The second-opinion review found four delays I'd forgotten were still hardcoded. Half-tokenizing is worse than not tokenizing."

---

## Probable case-study structure (notes only)

Not a draft. The eventual essay probably picks 4 of these 7 moments and threads them. Best candidates:

- **Moment 1** as the hook (Section 0 reframe — sets the constraint).
- **Moment 2** OR **Moment 3** as the structured-exploration example (HUD kill is cleaner; palette return is more visually narratable — pick one).
- **Moment 6** as the senior-signaling beat (the override of an adversarial verdict).
- **Moment 7** as the closer (concrete proof that adversarial review pays).

Moments 4 and 5 are good supporting beats but probably don't earn their own section — they belong as inline examples within the "contrast/AAA discipline" sub-beat under whichever structural-exploration moment is chosen.

Target length: 1500–2000 words. Two-three illustrative artifacts (small contrast-numbers table, the option-A-vs-B reasoning quote, maybe a before/after of the hero caption).

---

## Frame discipline

The case study is **about the methodology**, with the portfolio as the demo case. Not the other way around.

- DON'T write: "How I designed my portfolio's visual system." → self-referential, inward-looking, the subject is decorative.
- DO write: "How I make high-stakes design decisions under time pressure." → the subject is a transferable practice; the portfolio is the worked example.

If the title or hook drifts toward the first frame in editing, stop and reframe. Vercel/Anthropic readers care about the methodology; the visual system is just the artifact that demonstrates it.

---

## When to write it

**Not now.** Phase 0 is done. The next move is graduation, then Phase 1. The case study belongs at Phase 4.5 polish or v1.1 — *after* the portfolio is live and the case study can link to the running artifact.

Writing it before launch is a manifesto. Writing it after launch is evidence.
