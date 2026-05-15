# Inspiration Portfolios — Design Engineer / Interaction Design (2025–2026)

Curated for Jay Moore's portfolio redesign at jaymoore.net. Target register: Vercel + Anthropic. Verified URLs reachable as of 2026-05-14.

---

## Tier S — Direct inspiration

The closest matches in spirit, audience, and philosophy. Jay's site should feel like it belongs in this set.

### 1. Rauno Freiberg — https://rauno.me
**Who:** Staff Design Engineer at Vercel. Previously The Browser Company (Arc). Author of *Devouring Details*. The single most-referenced figure in this register.
**Steal:**
- The `/craft` page pattern: reverse-chronological grid of dated experiments, each with a tiny static thumbnail and a typed label (`View Production` / `Read Essay` / `View Prototype`). This is the single best "design engineer index" pattern on the web — copy its bones.
- Repeated mantra footer ("Make it fast. Make it beautiful. Make it consistent…") as a typographic signature element instead of decorative chrome.
- Dated portfolio archives surfaced as first-class links (`2023`, `2022`) — the site treats its own history as content.
- Email copy-to-clipboard as a tiny interaction reward.

**Stack:** Next.js, MDX, motion.dev. Custom platform for *Devouring Details*.

### 2. Emil Kowalski — https://emilkowal.ski
**Who:** Design Engineer at Linear, ex-Vercel. Author of Sonner and Vaul. The exemplar for "live OSS demo > case study writeup."
**Steal:**
- Three flagship project cards (Animations on the Web, Sonner, Vaul) each linking to a **functioning live demo**, not a writeup. Jay's hero project list should follow this pattern exactly.
- The `/skill` and `/design` sub-pages — quick-link reference layouts inspired by Rauno, repurposed as a personal knowledge index.
- Article titles that sell the *idea*, not the project ("You Don't Need Animations", "7 Practical Animation Tips").
- Quiet newsletter CTA — singular, low-friction, no overlay.

**Stack:** Next.js, Tailwind, motion.dev (he literally teaches it).

### 3. Paco Coursey — https://paco.me
**Who:** Design Engineer at Linear, ex-Vercel (built their design system + dashboard). Author of `cmdk`, `vaul`, `sonner` (with Emil), `next-themes`.
**Steal:**
- Sectional layout with no navbar — `Building`, `Writing`, `Currently`, `Contact` as scannable headings. Information architecture *is* the navigation.
- Each project entry = single line of text, hyperlinked, with a one-clause descriptor ("⌘K — Composable command menu React component"). The restraint is the flex.
- "Currently" section — keeps the site evergreen without requiring a blog post.

**Stack:** Next.js, MDX. Famously plain.

### 4. Shu Ding — https://shud.in
**Who:** Principal Engineer at Vercel. Created SWR and Satori. Quietly one of the best.
**Steal:**
- The `/projects` page treats projects as a **narrative essay**, not cards — descriptions include role ("core maintainer since 2020"), dates, and impact metrics inline. Reads like a CV from someone who doesn't need a CV.
- Hierarchy by significance, not chronology: major projects get full sections; mini projects get title-link only.
- Three-link nav (About, Thoughts, Projects). Nothing else.

**Stack:** Next.js, custom MDX. Deeply minimal.

### 5. Lee Robinson — https://leerob.com
**Who:** Cursor (DevRel/Education), ex-VP Vercel. The reference point for "developer-educator who designs."
**Steal:**
- Single-column, hyperlink-dense homepage that reads like a long bio paragraph rather than a marketing landing.
- "Last listened to" Spotify integration as a subtle aliveness signal — the site has a heartbeat.
- Heavy internal cross-linking — every mentioned project, talk, or article is a link, not chrome.

**Stack:** Next.js, MDX, Vercel. (His repo is the most-cloned starter in this category — worth cloning to study even if you don't keep it.)

### 6. Devouring Details — https://devouringdetails.com
**Who:** Rauno's interactive interaction-design manual. Not a portfolio per se, but the *visual register* Jay should aim for.
**Steal:**
- Two-column layout: persistent left-rail TOC + scrollable bite-sized content. This is the right pattern for any reference-quality demo writeup Jay publishes.
- Custom video placeholders (Rauno wrote an essay on building them) — better than static screenshots, lighter than autoplay video.
- Three-unit content split: **Principles → Prototypes → Resources**. Steal this taxonomy for organizing demos vs. essays vs. links.

---

## Tier A — Specific techniques worth stealing

Strong sites where one or two specific patterns are worth lifting wholesale.

### 7. Maxime Heckel — https://maximeheckel.com + https://blog.maximeheckel.com
**Who:** Engineer at Linear, shader/WebGPU specialist, Figma Config 2025 speaker.
**Steal:**
- **Top-of-page scroll progress bar (0.00 → 1.00)** rendered as numeric, not a colored bar. Reads as instrument, not chrome — perfect for the design-engineer register.
- Inline interactive shader/WebGPU demos *inside* article bodies. The article is the demo. This is exactly the "live demos > writeups" philosophy Jay wrote into his spec.
- Inspiration gallery with resize/move/rotate manipulability — turns a moodboard into a toy.

**Stack:** Next.js, MDX, custom WebGL/WebGPU.

### 8. Matt Wierzbicki (matsu) — https://matsu.design
**Who:** Polish product designer / design engineer / creator (Figma plugins, component libraries).
**Steal:**
- **Numerical social proof** ("15,000+" users) treated as a typographic feature, not a brag-stat module.
- Project carousel with high-fidelity product imagery — for any project that *is* primarily visual (a Figma plugin, a UI kit), this is a stronger pattern than embedding the live thing.
- Dark sticky `MW` initial nav over light page — minimal but highly identifiable.

**Stack:** Likely Next.js + Tailwind.

### 9. Olivier Larose — https://www.olivierlarose.com
**Who:** Freelance creative developer, Framer Motion power user, runs a tutorial blog.
**Steal:**
- Project card structure: **image + project name + category tag + client/agency + year + one-paragraph narrative + linked website**. This is the canonical "agency-grade case study card" — adapt for jaymoore.net's project list.
- Symbol-as-brand-mark accents (`☼`, `⚗✨`) used sparingly as personality without committing to a logo. Useful if Jay wants identity without a wordmark.
- Companion blog (blog.olivierlarose.com) hosts the tutorial detail — keeps the portfolio surface clean.

**Stack:** Next.js, Framer Motion (motion.dev's predecessor — same family).

### 10. Mariana Castilho — https://mrncst.design (was unreachable at fetch time; alt: layers.to/mrncst)
**Who:** Senior Product Designer at Vercel. Co-teaches "UI Engineering 101 for Designers" on Maven. Direct peer of the Vercel design engineering team.
**Steal:**
- The "designer who learned to ship code" framing — note how she positions her teaching alongside her product work. Jay should similarly weave demos and teaching into the same surface.
- (Site occasionally bounces — verify before launch. layers.to/mrncst is a stable secondary surface worth referencing.)

**Stack:** Next.js + Vercel.

### 11. Lynn Fisher — https://lynnandtonic.com
**Who:** Designer for the Web. Famous for an annual full redesign — currently on **v. XIX**.
**Steal:**
- **Annual redesign as content.** Each prior version is preserved at `/archive/[year]/` and is itself a portfolio piece. This is the most "design engineer" thing on the web — taste-as-changelog. Jay should ship a `/archive` route from day one even with only one version inside.
- A `/gifs` section as a low-stakes outlet for craft-not-yet-shippable. Frees the main portfolio from having to carry every experiment.

**Stack:** Hand-rolled, CSS-heavy. Not the right *stack* match for Jay, but the right *philosophy*.

### 12. Brittany Chiang — https://brittanychiang.com (current v5)
**Who:** Front-end engineer, ex-Klaviyo/HubSpot. Her v4 (`v4.brittanychiang.com`) is the most-cloned dev portfolio in history; her v5 is the more interesting reference.
**Steal:**
- **Inter, dark blue palette, pixel-perfect alignment** — the reference point for "accessible + restrained" in this niche.
- The footer Easter egg ("Click to time travel!" → rotating Tardis GIF) — one tiny personality moment after a serious site, in the footer where it can't hurt the hiring-manager scan.
- Open-source repo with 20k+ stars — the *site itself* has been a de-facto demo. Jay's repo being public has the same compounding effect.

**Stack:** Next.js, Tailwind, Inter.

---

## Tier B — Honorable mentions (skim once)

Distinctive enough to be worth a single pass, but more genre-adjacent than directly applicable.

### 13. Bruno Simon — https://bruno-simon.com
**Who:** Three.js master, runs Three.js Journey.
**Why skim:** The famous 3D driving-game portfolio. WebGPU + Rapier physics. **Anti-pattern for Jay** (this is exactly the "WebGL maximalism for its own sake" register Vercel/Anthropic *don't* want), but worth seeing once to know what you're explicitly choosing not to do.

### 14. Henry Heffernan — https://henryheffernan.com
**Who:** Creative dev. Famous for the "Windows 98 portfolio" (henryheffernan.com).
**Why skim:** Same caveat as Bruno — high-concept, low-restraint. The lesson is that a single overwhelming gimmick can become your entire identity (good for them, wrong fit for Jay).

### 15. Pedro Duarte — https://ped.ro
**Who:** Figma (ex-Raycast, ex-Modulz). Worked on Radix UI.
**Why skim:** Bare-bones four-link nav (Home, Writing, Speaking, Shooting), opens with "Yo!" — the lower bound of how minimal a respected design engineer's site can be. Useful as a calibration point.

### 16. Samuel Kraft — https://samuelkraft.com
**Why skim:** Design engineer at Bitrefill (design system + search/discovery). Clean vertical scroll, neutral palette, project cards with image + description + link. A solid "control case" for the conventional design engineer portfolio — worth comparing against Rauno/Paco to see what restraint plus *zero unique signature* looks like.

### 17. Matthew Ström-Awn — https://mattstromawn.com
**Why skim:** Design lead. 80+ writing pieces. Embodies "well-designed interfaces look boring." Useful if Jay wants to lean writing-heavy alongside demos. The opposite of Bruno Simon — and equally extreme.

### 18. Amelia Wattenberger — https://wattenberger.com
**Why skim:** Principal Research Engineer (ex-GitHub Next, now Sutter Hill / Augment). Known for data-viz essays. Tags projects by interest area (AI, data viz, lasers, SVG). Useful pattern: **tag projects by topic instead of forcing a single chronological list** — gives multiple entry points for different hiring-manager personas.

---

## Synthesis — Cross-cutting patterns in the best-tier sites

Five load-bearing patterns that show up in nearly every Tier S site. These are the design decisions Jay should make consciously before tokens lock.

1. **Navigation as headings, not chrome.** Paco, Lee, Shu Ding, and Pedro all treat sections (`Building`, `Writing`, `Currently`) as scannable page headings rather than a top navbar. The page *is* the menu. This frees the viewport for content and signals confidence — if the work can carry itself, you don't need persistent wayfinding. Hard rule for Jay's homepage: try shipping it without a navbar before you add one.

2. **Single accent against neutral grayscale.** Brittany's dark blue, Rauno's near-monochrome with one warm accent, Emil's near-pure neutral. None of the top tier uses more than one chromatic accent. The "Vercel/Anthropic register" is **60% neutral / 30% near-neutral / 10% one accent**. Pick the accent before anything else and use it surgically.

3. **The `/craft` (or equivalent) page is the load-bearing artifact.** Rauno's `/craft`, Emil's project list, Shu Ding's `/projects`, Paco's `Building` section — all share the same DNA: dated, chronological, granular (a single component counts as an entry), with each item resolving to either a live demo or a writeup with embedded demo. **This page matters more than the homepage.** Hiring managers spend ~40 seconds on the homepage and ~5 minutes here. Build it first.

4. **Live demo > screenshot > writeup.** In ranked priority: an inline interactive (Maxime, Devouring Details, Emil's Vaul demo) beats an animated GIF/video beats a still screenshot beats a paragraph of prose. Every project card should resolve to the highest-tier proof Jay can produce for that project. If a project only has a writeup, downgrade it visually.

5. **Aliveness signals — small but consequential.** Lee's "last listened to," Rauno's email-copy, Brittany's Tardis Easter egg, Lynn's annual redesign archive. One tiny "this site is maintained by a human who is alive *right now*" element separates the top tier from the impressive-but-stale clones of v4.brittanychiang.com. Jay should build in exactly one such signal — not three (clutter), not zero (corporate). Suggested: a `/now`-style line, a real-time "currently reading" pulled from somewhere automated, or a visible last-deploy timestamp.

A sixth pattern worth flagging because it's *absent* from the best tier: **none of these sites use a hero section with a giant headline + CTA + scroll-down arrow.** That genre belongs to SaaS marketing. Design engineer portfolios open with a paragraph, a three-line bio, or a project list. Jay should resist any visual-design exploration round that pulls toward the SaaS-hero template.

---

## Sources

Key references used to verify the list:
- [A Collection of Design Engineers — Maggie Appleton](https://maggieappleton.com/design-engineers)
- [Design Engineering at Vercel](https://vercel.com/blog/design-engineering-at-vercel)
- [Top 40 Designer Portfolio Sites 2026 — Typewolf](https://www.typewolf.com/portfolio-sites)
- [Devouring Details](https://devouringdetails.com/)
- [Rauno Freiberg — Craft](https://rauno.me/craft)
- [Lynn Fisher archive](https://lynnandtonic.com/)
- [Vercel — Design Engineering solutions](https://vercel.com/solutions/design-engineering)
