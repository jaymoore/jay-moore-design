# Visual Design Iteration Notes

> Source: copied from agent memory (`portfolio_visual_design_iteration.md`) on 2026-05-14. Travels with the project so visual decisions are preserved when the new portfolio repo is initialized.

Jay requires multiple rounds of visual design iteration before finalizing look-and-feel for portfolio work. Do NOT compress visual exploration into a single round or auto-pick a direction.

**Why:** Portfolio is Jay's highest-stakes job-search asset. Jay explicitly flagged that Section 5 (design system) of the design spec will be scrutinized at the end of planning, with multiple visual directions explored before approval. "This portfolio site is my most important asset to my job search and the design must be top notch."

**How to apply:**

- Treat Phase 0 design exploration as user-approval-gated, not date-gated
- Generate 3+ visual directions for any major design decision (type system, color palette, motion language, overall aesthetic)
- Token contract freeze (Section 6 of `2026-05-13-portfolio-redesign-design.md`) waits on user approval, not a fixed day
- Build phase start date shifts to accommodate visual rounds
- Codex's "don't polish in private, ship + iterate" advice still holds for content/code, but visual direction is the one place pre-launch iteration is required
- Same rule applies to future high-stakes design work (proof-point demos, case studies, /writing OG images)

## Phase 0 visual anchor — Devouring Details

On 2026-05-14, after reviewing the curated inspiration list (`inspiration-portfolios.md`), Jay named **[Devouring Details](https://devouringdetails.com/)** as his favorite reference for the jaymoore.net look and feel.

This is the **visual anchor** for Phase 0 exploration. All proposed mockups and token contracts should either match this register or explicitly name and justify their deviation.

**Visual fingerprint** (verified by scraping the live site on 2026-05-14):

- **Accent:** single saturated **orange**, used surgically (intro logo dot, primary CTA, highlight bar, inline call-out chips). Everything else grayscale.
- **Grayscale:** Radix-style numeric scale — `gray2` (subtle bg), `gray3` (hover), `gray4` (border), `gray8` (track), `gray9` (muted text), `gray10` (filled bar), `gray11` (secondary text), `gray12` (primary text). Background pure `#FFF`.
- **Type:** uppercase `font-mono` at `13px` for chip labels and metadata; tight `-tracking-[0.4px]` negative letter-spacing on hero copy.
- **Layout primitives:** Tailwind v4 with extensive CSS custom properties — `--section-gap`, `--row-gap`, `--sheet-padding`, `--section-padding`, `--media-gap`, `--media-radius`, `--card-bg`, `--nav-lh`. **Token-driven layout, not utility-first.**
- **Radius scale:** even numbers — `rounded-4`, `rounded-6`, `rounded-12`, `rounded-16`, `rounded-full`. Default mid-card is `rounded-12`.
- **Motion:** custom `ease-swift` easing for hover transitions, `duration-200`.
- **Media overlays:** play buttons use `backdrop-blur-[6px]` → `backdrop-blur-[10px]`, `bg-[#FFFFFF25]`, `size-14` desktop / `size-10` mobile.
- **Layout:** two-column persistent left-rail nav + scrollable bite-sized content sections with `scroll-my-16` snap targets.
- **Content taxonomy:** Principles → Prototypes → Resources. Worth borrowing for organizing demos vs. essays vs. links.
- **Spacing:** strict 8pt grid; 4px only inside finer components.

**Implications for Section 6 (token contract):**

- Lock token contract on **single orange + Radix gray scale** as the default proposal. Alternative palettes get explored as deliberate deviations.
- Define spacing primitives as **`@theme` CSS variables** (`--section-gap`, `--row-gap`, `--sheet-padding`, `--section-padding`, `--media-gap`) — mirroring Devouring Details' approach — not as raw Tailwind utility numbers.
- Default radius scale is even numbers (4/6/12/16).
- Default body type pairing should mirror DD's serif/sans + uppercase mono metadata combo. Geist Sans + Geist Mono in the current spec is in the same family; consider whether to keep or swap.

**Caveat:** Devouring Details is a content-document (manual) register; jaymoore.net is a portfolio register. Steal the visual *language* (color, type, spacing, motion easing), not necessarily the *information architecture* (which is doc-TOC-shaped, not project-grid-shaped).

## Related documents in this workbench

- `inspiration-portfolios.md` — curated reference set (18 portfolios across three tiers, plus 5 cross-cutting patterns)
- `2026-05-13-portfolio-redesign-design.md` — full design spec (Section 6 = visual system, provisional values)
- `2026-05-13-portfolio-redesign.md` — implementation plan (Task 2 consumes approved token values)
- `codex-reviews/` — four rounds of Codex second-opinion review prompts
