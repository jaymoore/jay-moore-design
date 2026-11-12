# Session handoff — 2026-08-25

Shipped: password gate removed from all case studies, Personal Nurse hidden from the home list. Merged to main and live on jaymoore.net.

## Next 3 actions

1. Decide whether Personal Nurse comes back to the home list. The route still lives at `/work/personal-nurse` and is publicly reachable; it is only unlinked. Re-add by uncommenting the entry marked `// ponytail:` in `components/depth-list.tsx` and renumbering items back to 01–05.
2. Decide on indexing. All three case-study pages still set `robots: { index: false }` in their `page.tsx`. Now that they are public, flip to `index: true` if you want recruiters to find them through search.
3. Sept 28, 2026 (calendar reminder set): transfer jaymoore.net registration from GoDaddy to Cloudflare. Carried over from the 2026-07-28 handoff, still pending until the ICANN 60-day lock clears.

## What happened / decisions

- Removed the password gate from all three case studies. Deleted `password-gate.tsx` and `actions.ts` under each of `app/work/lead-response-loop/`, `app/work/listing-launch/`, and `app/work/personal-nurse/`; each `page.tsx` now renders `CaseStudyContent` directly with no cookie check.
- Dropped the "Password-gated." phrase from the case-study blurbs in `components/depth-list.tsx` and `app/about/page.tsx`.
- Hid the Personal Nurse entry from the home depth list and renumbered the remaining items to 01 through 04. The route was deliberately kept, not deleted.
- Merged PR #18 as squash commit `82b06bb` on main; the feature branch `feat/personal-nurse-case-study` was deleted.
- Two GitHub accounts are configured for `gh`. The active one was `simplepathmedia`, which has read-only access to `jaymoore/jay-moore-design` and could not merge. Jay re-authenticated as `jaymoore` to complete the merge. Expect this to recur next time a merge is needed.
- Found during closeout: `screen-family-quiet.png` and `screen-family-escalation.png` are referenced by `case-study-content.tsx` but were never committed, so both returned 404 in production. Committed in this session's closeout.
- The env var `CASE_STUDY_PASSWORD` is now unused by any code. It can be removed from Vercel project settings and `.env.local` whenever convenient.

## Open questions / blockers

- Untracked directories left uncommitted on purpose: `.claude/`, `.superpowers/`, `design/fonts/`, `design/jm-logo/`, `design/specimen-iterations/`, `process/case-study-hero-1/`, `process/claude-design-seed-prompt.md`, `process/linkedin-post-guide.md`, `resume/`. This is a public repo, so `resume/` in particular is worth a look before it is ever committed.

## Files touched

- `app/work/lead-response-loop/page.tsx`, `app/work/listing-launch/page.tsx`, `app/work/personal-nurse/page.tsx` (gate removed)
- Deleted: `password-gate.tsx` and `actions.ts` in all three case-study folders
- `components/depth-list.tsx`, `app/about/page.tsx` (copy and list changes)
- `app/work/personal-nurse/case-study-content.tsx` plus re-exported screen PNGs (pending edits that predated this session, carried in the same commit)
- `public/case-study/personal-nurse/screen-family-quiet.png`, `screen-family-escalation.png` (newly committed)
