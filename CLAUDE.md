# Jay Moore Design — Planning

Pre-build planning for the new portfolio at `jaymoore.net`. No code yet. Markdown only.

## Mission

Replace the existing portfolio at `jaymoore.net` with a Design Engineer–signal-first site targeting Vercel (primary) and Anthropic (secondary). Survives inspect-element + Lighthouse scrutiny. Live demos > case study writeups. Public repo, public audit trail.

## Status

**Phase 0 — Visual design exploration.** Spec and implementation plan are committed. Awaiting multiple rounds of visual direction exploration before Phase 1 (build) begins. See `visual-design-iteration-notes.md`.

## Files

| File | Purpose |
|---|---|
| `2026-05-13-portfolio-redesign-design.md` | Design spec — sitemap, IA, demo pattern, tech stack, visual system, content list, timeline. 4 brainstorming rounds + 4 Codex reviews. |
| `2026-05-13-portfolio-redesign.md` | Implementation plan — 25 tasks covering Phase 1–4 of the spec (post-visual-approval). |
| `visual-design-iteration-notes.md` | Hard rule: visual direction needs multiple rounds, user-approval-gated. |
| `codex-reviews/` | Four rounds of Codex second-opinion prompts used during brainstorming. |

## Stack (when graduated)

- Next.js 15 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4 (`@theme` tokens in `globals.css`)
- MDX content (`@next/mdx`)
- motion.dev (spring physics, transform-only animations)
- shadcn/ui base + custom hero/demo layer
- Geist Sans + Geist Mono (provisional; Phase 0 may override)
- Hosted on Vercel + Vercel Analytics
- GitHub Actions: lint + typecheck on PR; weekly Lighthouse + axe → `/audits/`

## Workflow

### Phase 0 — Visual exploration (current)

Iterate visual direction outside this folder (Figma, Excalidraw, raw HTML mockups). Multiple rounds required. Exit gate: Jay approves direction → token contract locks → Phase 1 starts.

### Graduation to standalone repo

When Phase 0 approves:
1. Copy this folder out: `cp -R ~/00-Dev-jaymoore/portfolio-workbench/jay-moore-design-planning ~/00-Dev-jaymoore/jay-moore-design`
2. `cd ~/00-Dev-jaymoore/jay-moore-design`
3. Create public repo: `gh repo create jaymoore/jay-moore-design --public --description "Jay Moore's portfolio. Design Engineer for AI-native workflows."`
4. `git init && git branch -M main`
5. `git remote add origin git@github-jaymoore:jaymoore/jay-moore-design.git`
6. Begin Task 1 of the implementation plan (Next.js scaffolding inside the new repo)
7. The planning markdown files travel with the repo; live alongside the code

### Rules

- Planning docs are the source of truth until graduation. Do not split into multiple specs.
- Updates to spec or plan: edit in place, no versioning, no append-only changelog. The git history at the destination repo will track changes.
- Visual exploration artifacts (mockups, sketches) live outside this folder until one is approved; the approved set lands here as `visual-direction-approved/` before graduation.

## Related

- Original sources at `~/00-Dev/career-ops/docs/superpowers/specs/` and `~/00-Dev/career-ops/docs/superpowers/plans/` — career-ops repo retains its copies (do not delete unless intentional)
- Agent memory: `~/.claude/projects/-Users-jay-00-Dev-career-ops/memory/portfolio_visual_design_iteration.md` (the rule about multiple visual rounds)
