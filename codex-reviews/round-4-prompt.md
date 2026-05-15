Round 4 portfolio review for Jay Moore (PD → Design Engineer pivot, Vercel primary target). You did 3 prior rounds.

Round 3 you said: NOT READY for writing-plans. Headline: "optimizing for breadth over conviction." Required: cut one major deliverable, freeze token contract by Day 2, remove /patterns from nav (empty room), add static "Method in practice" artifact, wave-based applications, public audits via GitHub Action, NDA protocol on Fiserv, cross-domain hook on Fiserv (narrative overfitting risk).

ALL 9 RECOMMENDED CHANGES APPLIED. Producing v3. Read it and decide: ready for writing-plans, or NOT yet.

## v3 plan changes since Round 3

### Section 1 — Sitemap + IA (v3)
- `/patterns` route still exists, **dropped from nav** until first pattern ships
- New `/audits/` public folder (deep link only, not in nav) for weekly Lighthouse + axe reports auto-committed by GitHub Action
- Nav unchanged: `Jay Moore · Work · Lab · Writing · About · Github` (5 + Github)

### Section 2 — Homepage composition (v3)
- **3 demos → 2 demos** (Trust + Streaming). Demo 3 (Decision Routing) → v1.1
- **NEW "Method in practice" static artifact block** between hero and demos: screenshot of real PR for Demo 1 + 3-5 commits with terse messages + caption "Built in N commits across 2 days. Quality gates at each step." → links to /writing/process. NOT a live demo. NOT a video. Static proof.
- Hero text shortened (3 lines → 2). First demo visible higher.
- Scroll budget tightened ~4-5 viewports (was 5-7)

### Section 3 — Demo pattern (v3)
Unchanged.

### Section 4 — Tech stack (v3)
- New GitHub Action `audit.yml`: weekly cron, Lighthouse CI + axe-core on home + /about + /work/*, commits markdown reports to `/audits/[YYYY-MM-DD].md`
- README expanded: explicit "Public artifacts" vs "Under NDA / private" sections + "Audit cadence" link

### Section 5 — Visual system (v3)
- Token contract freeze by Day 2 of build. **Locked** (cannot change post-Day-2): token NAMES, token COUNT, scale ratios, breakpoint values. **Iterable** (can change anytime): token VALUES, component visual treatment, font choice details.
- Provisional values unchanged. User will iterate visual design before final approval but token contract holds.

### Section 6 — Content list (v3)
- 2 homepage demos (Trust + Streaming only). Demo 3 → v1.1.
- "Method in practice" block content spec'd: pick Demo 1 as documented build, show real PR screenshot + commits.
- /work/fiserv-gift-card-portal: **hook added at top** — "This case study isn't AI-related. Multi-persona B2B SaaS — Lead PD, 6 months, 3 user types. Senior product design judgment lives independent of AI methodology."
- /work/fiserv-gift-card-portal: **NDA protocol line added at bottom** — "Shareable: outcomes, role, scope, persona structure, public metrics. Under NDA: internal data, raw research, roadmap. Reach out for additional context."
- v1 launch checklist updated: 2 demos, /audits/ folder with first run, /patterns route exists but not in nav.

### Section 7 — Timeline (v3)

- Day 2 = token contract freeze (NEW)
- Phase 2 reduced to 2 demos with extra polish buffer
- **NEW Phase 4.5 (Days 15-18) — Polish window:** real-world feedback collection, 3-5 friend reviews, visual polish based on feedback. Do NOT apply to top tier before this window completes.
- **Phase 5 wave-based applications (NEW):**
  - Wave 1 (Days 18-21): 5-8 lower-stakes apps (warm contacts + Tier C SaaS like Gusto/GitLab/Notion). NOT Vercel/Anthropic/OpenAI.
  - Wave 2 (Days 22-35): Priority targets (Vercel, Anthropic, OpenAI) after Wave 1 friction surfaced + fixed.
  - Wave 3 (Day 35+): Reach + adjacent (Stripe, Figma, niche AI startups).
- Hard rule: don't apply to top tier with 48-hr-old portfolio.

### Definition of v1 ship (locked)
- Home with 2 demos + Method in practice block
- /about full content
- /work/spm-lifecycle full case study
- /work/fiserv-gift-card-portal compressed (with hooks)
- /writing/process + /writing/what-didnt-work
- /lab 1 entry
- /audits/ folder with first run
- Dark mode + mobile + a11y AA

### Deferred to v1.1
- Demo 3 (Decision Routing)
- /patterns nav entry + first pattern
- /writing/trust-surfaces + /writing/streaming-is-not-chat
- "Run live" buttons (canned data only at v1)

## Your Round 4 critique

1. **Did the cuts go far enough?** v1 still has 2 demos + 2 case studies + 2 essays + /about + /lab + /audits + Method in practice block. Is that still too much? Should we cut more, or is this finally lean enough?

2. **Method in practice block — is it the right replacement?** A static PR screenshot + commit messages + 1 caption + 1 link. Does this actually deliver enough methodology signal to make killing the hero demo worth it? Or is it too quiet/easily-missed and we should just kill the hero AND the replacement?

3. **Token contract freeze on Day 2:** Realistic for a designer who flagged that visual design will iterate heavily? Or will Day 2's contract feel premature and force token redesign by Day 5?

4. **Wave 1 calibration set risk:** Applying to Gusto/GitLab/Notion-tier first might be a category error — they're Tier C SaaS, where your AI/UX positioning is LESS strong than at Vercel/Anthropic. Could Wave 1 produce false-negative recruiter signal that misleads iteration?

5. **Days 15-18 polish window self-discipline:** The hardest discipline. Will Jay actually stop polishing and ship Day 14, or will Phase 4.5 silently become Phase 4.5-25?

6. **Hidden Day 2 risk:** Token contract freeze assumes Day 2 design exploration produces a viable v1 token set. If Day 2 produces 3 mockups but no clear winner, what happens? Plan doesn't address.

7. **Anything else this plan still misses?**

8. **Ready for writing-plans skill now? YES or NO + reason.**

Keep under 700 words. Be direct.
