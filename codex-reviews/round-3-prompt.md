You're doing Round 3 of portfolio strategy review for Jay Moore (PD → Design Engineer pivot, Vercel primary target). You did two prior rounds.

Round 1 you said: identity ambiguity is biggest risk. Fix: add /about credibility bridge, more proof depth, quality gates on methodology hero, keep older work as compressed timeline.

Round 2 you said: credibility fragility — too many visible verifiable claims. Fix: trim displayed proof surface (kill auto-Lighthouse footer + per-demo quality gate strip), move /about to top nav, kill methodology hero demo (or prove auditably), fix /lab IA drift, split repo public/private, document shadcn vs custom, add audience pathing, mobile-first, failure-mode essay.

All Round 2 feedback applied. The plan now has 7 sections. Critique the full assembly. Push back hard.

## Round 3 plan summary

### Section 1 — Sitemap + IA
```
/                          Homepage (single scroll)
/about                     IN top nav now
/lab                       Experiments only (timestamped, scrappy)
/patterns                  Pattern library (big demos overflow, NEW, separate from /lab)
/writing                   Essays
/work/spm-lifecycle        Primary case study
/work/fiserv-gift-card-portal   Rebuilt Fiserv case study (corrected from "wallet")
```
Nav: `Jay Moore · Work · Lab · Writing · About · Github` (5 links + Github).

### Section 2 — Homepage composition
Single scroll. Hero (H1 + sub + 2 anchor links) → 3 demos (Trust / Streaming / Decision Routing) → Process Link block (replaces methodology hero, points to /writing/process essay) → Case Study CTA → Timeline strip → Footer.

Audience pathing constraints:
- Recruiter scan path: top bar → About → SPM case study → email. <60 sec.
- Hiring manager deep: hero → demos → view source → /patterns → /writing → repo → email. 10+ min.

### Section 3 — Demo component pattern
Skeleton: Pattern name (H2) + plain English subtitle + LIVE component + Why (2 sentences) + Repo link + View source toggle. **Quality gate strip removed from UI** (moved to repo READMEs only). 2 affordances per demo, not 3.

### Section 4 — Tech stack + craft bar
Next.js 15 + React 19 + Tailwind v4 + shadcn base + custom layer + motion.dev + MDX + Vercel hosting + Vercel Analytics. Public repo: github.com/simplepathmedia/jaymoore-net (site infra). Private content: Fiserv case study markdown/images.

Internal craft bar (NOT displayed): Lighthouse Perf ≥ 90, A11y 100, BP 100, SEO ≥ 90. LCP < 1.5s, CLS < 0.1, INP < 250ms. Initial JS < 150kb gz. Mobile-first.

shadcn vs custom split documented in README. Custom: type system, motion primitives, demo containers, hero composition, dark mode tokens. shadcn-base: form inputs, dialogs, dropdowns, command palette.

CI relaxed: lint + typecheck only. Lighthouse runs weekly, not per-PR.

### Section 5 — Visual system (USER FLAGGED: will iterate heavily before final; deferred design exploration; provisional values)
Geist Sans + Geist Mono. Perfect Fourth (1.333) type scale. 60/30/10 with single accent. 8pt spacing. Mobile-first breakpoints (sm 640, md 768, lg 1024, xl 1280, 2xl 1536). Buttons/inputs 32/36/40/48 height scale. Spring physics motion. Reduced-motion respected.

### Section 6 — Content list (launch seed)
3 homepage demos:
1. Trust surface with confidence + override (maps to Dispatch Decision Support Dashboard)
2. Streaming with cancellation + retry (maps to general LLM UX)
3. Agentic decision routing (maps to SPM lifecycle engine)

/work/spm-lifecycle = primary case study (1500-2500 words)
/work/fiserv-gift-card-portal = compressed rebuild (600-900 words). Real metrics: -35% support tickets, +40% promotion setup speed, +20 NPS points. Multi-persona design (3 user types).

/writing seed (4 essays, ranked):
1. "How I work — LLM-first methodology + quality gates" (REQUIRED, replaces killed methodology hero)
2. "What didn't work — failure modes in LLM-first design" (REQUIRED, senior signal)
3. "Trust surfaces — when AI is wrong" (nice-to-have)
4. "Streaming UI is not chat" (nice-to-have)

/lab seed: 3 scrappy experiments. /patterns starts empty (defer to v1.1).

/about: 6-10 line pivot narrative + compressed timeline + failure-mode link + contact.

### Section 7 — Timeline (2-week MVP)

Two-track approach. Track A = design system exploration (parallel, may extend past v1). Track B = infrastructure + content (sequenced).

- Phase 0 (Days 1-2): Proof matrix, design exploration kickoff, repo + staging
- Phase 1 (Days 3-5): Next.js + Tailwind setup, /about shell, demo skeleton, /lib/patterns scaffold
- Phase 2 (Days 6-9): Demos 1, 2, 3 (one per day + polish)
- Phase 3 (Days 10-12): Case studies + essays + /about content + /lab entry
- Phase 4 (Days 13-14): A11y/perf/mobile QA, DNS cutover, launch announcement
- Phase 5 (post-launch ongoing): Apply to 5 roles by Day 16, 10 by Day 21, iterate from recruiter feedback

Critical path: Phase 0 → Phase 1 (blocks everything) → Phase 2 (sequential demos) → Phase 3 → Phase 4.

Hard rule: don't polish in private past Day 14. Ship + iterate in public.

v1 must work: home + 3 demos + /about + spm case study + fiserv case study + 2 essays + 1 lab entry + mobile + a11y AA. v1.1 can ship: demo 4, /patterns, /writing essays 3+4, "Run live" buttons.

## Your Round 3 critique

1. **Plan coherence check:** Sections 1-7 together. Are there still cross-section contradictions or fuzzy edges?

2. **Timeline realism (HARD push):** 13-14 days for one designer-engineer to ship: foundation + 3 live demos + 2 case studies + 2 essays + /about + /lab entry + dark mode + a11y AA + mobile + DNS cutover. Plus parallel design system iteration. Is this realistic, optimistic, or fantasy? Cite where the timeline likely breaks.

3. **The two-track Track A / Track B split:** Practical or theoretical? Design systems converging asynchronously while content gets built tends to require expensive rework (tokens change, every component re-skins). Is this split really feasible, or will Track A delays cascade?

4. **Apply-early protocol:** Apply to 5 roles by Day 16 with a 2-day-old portfolio. Is that wise, or does first impression risk burn good leads?

5. **"Kill methodology hero" decision:** Round 2 you said prove-or-kill. Plan killed it. But /writing/process essay replaces it with an auditable git-commit-based methodology proof. Does the essay path actually deliver the methodology signal Vercel/Anthropic want, or did killing the hero drop the most distinctive piece of the entire portfolio?

6. **Audience pathing:** Recruiter scan = top bar → About → SPM → email <60s. Is the "no big visual hook above the fold" issue going to lose recruiters who expect IMMEDIATE work demonstration (not text-first)? Are demos far enough up the page?

7. **Risk we still haven't named:** What's the next-level risk that Round 3 should surface and Round 2 missed?

8. **Ready for writing-plans skill (implementation planning) or not?** Plain yes/no + reason.

Lead with the single most important Round 3 push. Keep response under 900 words.
