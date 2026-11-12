# Plan: hidden email and marketing samples page

Date: 2026-11-12. Written from a vault session; build happens in a session started in this repo.

## Why

jaymoore.net is a product design portfolio with no email work on it. This page gives reviewers for email and marketing design roles something concrete to look at: responsive email templates, locked templates a team can maintain, mobile-first layout, typography and email-safe HTML and CSS.

Status: shipped 2026-11-12 in PR #19. Live at https://jaymoore.net/work/email-samples (noindex, unlinked).

## Honesty rules (non-negotiable)

- Every sample is labeled concept work, in the page intro and on each sample.

- Fictional organizations only. No real client names, no imitation of a real organization's branding, no sent counts, open rates, or "delivered for" lines.

- No claim of Marq experience. The template anatomy piece shows locked-template thinking; it does not say Marq.

- Nothing on the page may contradict Jay's resume, which says he builds and sends Constant Contact campaigns for Simple Path Media.

## Route and visibility

- `app/work/email-samples/page.tsx`, same pattern as `app/work/listing-launch/page.tsx`: `robots: { index: false, follow: false }`.

- Not linked anywhere. Checked 2026-11-12: `components/top-bar.tsx` links only `/#start`, `/#demo`, `/#depth` and GitHub; `components/footer.tsx` links GitHub, LinkedIn and email; there is no sitemap or robots route in `app/`. `components/depth-list.tsx` is the only place that lists `/work/*` routes; do not add this page there.

- Shareable URL after merge: https://jaymoore.net/work/email-samples

## Samples (three, no more)

1. **Responsive newsletter, real email HTML.** 600px table layout, inline CSS, a mobile media query that stacks columns, bulletproof button, alt text on every image, dark-mode-safe colors. Fictional org: a health research institute's monthly newsletter (generic name, own palette). Rendered in an `iframe` with `srcdoc` so its CSS stays isolated from Tailwind. Desktop and mobile width toggle (600px and 375px). A "View HTML" panel showing the source, because the email-safe HTML claim is only credible with the code visible.

2. **Template anatomy.** The same newsletter shown as a template: locked regions (header, footer, brand bar, type styles) versus editable slots (headline, hero image, story blocks, CTA), with short notes on why each is locked. This answers "modular, locked-down templates the wider team can maintain".

3. **Social asset set with a brand rule sheet.** Three sizes (1080 by 1080, 1080 by 1350, 1200 by 628) for one fictional event announcement, built in HTML and CSS, next to a short rule sheet: logo clear space, type scale, color pairs with contrast ratios, what a non-designer may change.

## Page chrome

- Uses the frozen token contract (`process/token-contract.md`) and `app/globals.css` tokens. The email and social pieces use their own inline styles by necessity.

- Short intro: what this page is, that everything is concept work, and one line on the stack (hand-built HTML email, tested at 600px and 375px).

- Light and dark mode for the chrome. WCAG AA on all chrome text.

## Before writing code

- `AGENTS.md`: Next 16.2.6 differs from training data. Read the relevant guides in `node_modules/next/dist/docs/` first.

- Load this repo's own Claude memory (start the session in this folder).

## Git and review

1. Branch `feat/email-samples-page` from `main`. Stage only the new files; the working tree has untracked folders that stay untouched.

2. `npm run lint`, `npm run typecheck`, `npm run build` must pass.

3. Local preview approval by Jay on desktop and phone before the PR.

4. Open a PR. Do not merge until Jay says so. Vercel PR previews are auth-protected, so the public link works only after merge.
