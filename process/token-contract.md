# Token Contract — Phase 0 Exit Deliverable

**Status:** FROZEN — locked 2026-05-14 at Phase 0 exit.
**Consumes:** Task 2 of the implementation plan (`2026-05-13-portfolio-redesign.md`) — Tailwind v4 token setup in `app/globals.css`.
**Source of truth for values:** `round-3-palette-1-instrument-cool.html` (the locked artifact under Codex R7/R8/R9 verification).

---

## Freeze semantics (per spec Section 6)

**LOCKED — cannot change without reopening the contract:**

- Token names (every name in this contract is canonical)
- Token count per category (no adding a new color slot, no dropping a duration rung)
- Type scale ratio (Perfect Fourth, 1.333)
- Breakpoint values (Tailwind v4 defaults — see "Tailwind v4 defaults" below)

**ITERABLE — values can change post-launch without reopening the contract:**

- Specific hex values (e.g. accent could nudge if a recruiter run flags something)
- Specific duration ms (e.g. `--duration-normal` could tune from 250ms to 220ms)
- Specific motion easing curve values

Anything stricter than this needs an explicit decision logged against the contract.

---

## Phase 0 audit trail (one-line each)

- **Structure** (Iteration 3 — no-HUD, 3-block scan spine) — locked Round 2.
- **Type** (Pair D — Hanken Grotesk display × Spline Sans Mono mono) — locked Round 3 pre-step.
- **Color** (Palette 1 — cool slate base, steel-blue accent) — locked Round 3 main.
- **Contrast correction** (light accent + fg-faint both modes + selection bug) — Codex R8 lock review.
- **AAA on body** (`--fg-soft` deepened) — Codex R8 fix #2.
- **Motion baseline tokenized** (4 durations + ease-snappy + reduced-motion policy) — Codex R8 fix #3.
- **Hero slot caption** (editorial position made scan-legible) — Codex R9 fix, surface 1, Jay's option B over Codex's A.
- **Stagger tokens** (delays tokenized; contract no longer half-claimed) — Codex R9 fix, surface 2.

---

## Name mapping — locked file → contract

The locked file used bare names for inspection clarity. The contract uses Tailwind v4 prefixed names so `@theme` exposes them as utilities (`bg-bg`, `text-accent`, etc.). **Values unchanged, names build-friendly.**

| Locked file | Contract (Tailwind v4) | Tailwind v4 utility |
|---|---|---|
| `--display` | `--font-sans` | `font-sans` |
| `--mono` | `--font-mono` | `font-mono` |
| `--bg` | `--color-bg` | `bg-bg` |
| `--bg-2` | `--color-bg-2` | `bg-bg-2` |
| `--panel` | `--color-panel` | `bg-panel` |
| `--fg` | `--color-fg` | `text-fg` |
| `--fg-soft` | `--color-fg-soft` | `text-fg-soft` |
| `--fg-faint` | `--color-fg-faint` | `text-fg-faint` |
| `--grid` | `--color-grid` | `bg-grid` |
| `--line` | `--color-line` | `border-line` |
| `--line-strong` | `--color-line-strong` | `border-line-strong` |
| `--accent` | `--color-accent` | `text-accent` / `bg-accent` |
| `--accent-deep` | `--color-accent-deep` | `text-accent-deep` (hover) |
| `--accent-wash` | `--color-accent-wash` | `bg-accent-wash` |
| `--selection-fg` | `--color-selection-fg` | (used in `::selection`) |
| `--ok` | `--color-ok` | `text-ok` / `bg-ok` |
| `--shadow` | `--shadow` | `shadow-(--shadow)` arbitrary |
| `--duration-fast/normal/slow/lazy` | unchanged | `duration-(--duration-fast)` arbitrary |
| `--ease-snappy` | unchanged | `ease-(--ease-snappy)` arbitrary |
| `--stagger-base`, `--stagger-step` | unchanged | (CSS-only, used in `animation-delay: calc(...)`) |

---

## The contract — paste into `app/globals.css`

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* ============================================================
     TYPE
     ============================================================ */

  --font-sans: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
  --font-mono: 'Spline Sans Mono', ui-monospace, 'SF Mono', Menlo, monospace;

  /* Type scale — Perfect Fourth (1.333). Carried from spec Section 6;
     not a Phase 0 variable (Phase 0 locked the typefaces; the scale
     was already approved as part of the visual system). */
  --text-2xs: 0.6875rem;   /* 11px — captions, repo metadata */
  --text-xs:  0.75rem;     /* 12px — tertiary UI, footer */
  --text-sm:  0.875rem;    /* 14px — secondary body, nav */
  --text-base: 1rem;       /* 16px — body default */
  --text-lg:  1.3125rem;   /* 21px — subtitles */
  --text-xl:  1.75rem;     /* 28px — H3 */
  --text-2xl: 2.3125rem;   /* 37px — H2 */
  --text-3xl: 3.0625rem;   /* 49px — pattern names */
  --text-4xl: 4.0625rem;   /* 65px — hero H2 (mobile hero H1) */
  --text-5xl: 5.4375rem;   /* 87px — hero H1 (desktop only) */

  /* ============================================================
     COLOR — LIGHT (default; dark override below in html.dark)
     ============================================================ */

  --color-bg:           #f1f3f5;  /* body background, cool slate */
  --color-bg-2:         #e7eaed;  /* surface alt (method strip, dimensional rest) */
  --color-panel:        #ffffff;  /* raised surfaces — demo cards */
  --color-fg:           #16191d;  /* body text — AAA (15.85) */
  --color-fg-soft:      #42474e;  /* secondary body — AAA (8.42 on bg, 7.75 on bg-2) */
  --color-fg-faint:     #676c72;  /* faint meta labels — AA (4.76) */
  --color-grid:         rgba(28, 25, 23, 0.045);  /* body grid lines, fg-tinted 4.5% alpha */
  --color-line:         #d7dbe0;  /* default border */
  --color-line-strong:  #bfc4cb;  /* emphasized border */
  --color-accent:       #1f57bd;  /* links, live dot, hl word — AA (5.51 worst, AAA on panel) */
  --color-accent-deep:  #1a4496;  /* accent hover/pressed — AAA (8.17 on bg) */
  --color-accent-wash:  #e6eefb;  /* tinted backgrounds (build-phase use) */
  --color-selection-fg: #ffffff;  /* foreground for ::selection on accent */
  --color-ok:           #2f9e6b;  /* status indicator only — not a generic green */

  --shadow: 0 1px 2px rgba(16,19,23,.04), 0 8px 24px rgba(16,19,23,.07);

  /* ============================================================
     RADIUS — carried from spec Section 6; not a Phase 0 variable
     ============================================================ */

  --radius-sm: 0.375rem;   /*  6px — small chips */
  --radius-md: 0.625rem;   /* 10px — default surfaces */
  --radius-lg: 1rem;       /* 16px — large cards */
  /* No rounded-full anywhere — spec discipline.
     Two documented exceptions, both grounded in the user-provided image reference:
       1. The brand status dot in the TopBar (--color-ok, 6px). Status indicators
          are conventionally circular; making it a square would read as a system
          glyph, not a live signal.
       2. The theme toggle pill (rounded-full container + inner outline circle).
          The pill shape is the recognized affordance for binary mode controls
          in the image reference. */

  /* ============================================================
     MOTION — durations + easing + stagger
     Locked at Phase 0 exit (Codex R8 fix #3 + R9 fix surface 2)
     ============================================================ */

  --duration-fast:   150ms;  /* hover, focus, small UI state changes */
  --duration-normal: 250ms;  /* component transitions (build-phase default) */
  --duration-slow:   400ms;  /* theme swap, larger surface changes */
  --duration-lazy:   600ms;  /* scroll-into-view entrances */
  --ease-snappy: cubic-bezier(.32,.72,0,1);  /* the spec's [0.32,0.72,0,1] out-expo */

  --stagger-base: 50ms;  /* initial reveal offset — keeps first section from firing at exact load time */
  --stagger-step: 80ms;  /* inter-element gap in reveal cascade */
}

/* ============================================================
   COLOR — DARK (toggle via html.dark per implementation plan)
   ============================================================ */

html.dark {
  --color-bg:           #0b0d10;
  --color-bg-2:         #131619;
  --color-panel:        #161a1e;
  --color-fg:           #e6e8ec;  /* AAA (15.86) */
  --color-fg-soft:      #a8aeb7;  /* AAA (8.71 on bg, 7.83 on panel) */
  --color-fg-faint:     #777d87;  /* AA (4.70) */
  --color-grid:         rgba(238, 236, 231, 0.045);
  --color-line:         #242a30;
  --color-line-strong:  #353c44;
  --color-accent:       #5b9bff;  /* AA (6.31 worst) */
  --color-accent-deep:  #3f7fe6;  /* AA (4.99 on bg) */
  --color-accent-wash:  #11203a;
  --color-selection-fg: #0b0d10;  /* near-black on light-blue accent — 7.02 AAA */
  --color-ok:           #56c08d;

  --shadow: 0 2px 8px rgba(0,0,0,.5);
}

/* ============================================================
   BASE PATTERNS — operational rules that make the contract live
   ============================================================ */

@layer base {
  :root { color-scheme: light; }
  html.dark { color-scheme: dark; }

  html {
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Selection — theme-aware foreground (Codex R8 bug fix) */
  ::selection {
    background: var(--color-accent);
    color: var(--color-selection-fg);
  }

  /* Focus — always visible, accent-colored, generous offset */
  *:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: inherit;
  }

  /* Reduced motion — comprehensive collapse (Codex R8 fix #3) */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

---

## Tailwind v4 defaults — what we're NOT redeclaring

These are intentional inheritances. The build relies on Tailwind v4's defaults and does NOT shadow them. Listed here so it's explicit, not silent.

- **Spacing scale** — Tailwind v4's default 4px-based scale (`space-1` 4px, `space-2` 8px, `space-3` 12px, ...). The 8pt grid discipline from spec Section 6 is enforced by *which* steps to use, not by redefining the scale. Convention: only even steps (`space-2`, `space-4`, `space-6`, `space-8`, `space-12`, `space-16`, `space-24`, `space-32`). Odd steps for fine details inside components only.

- **Breakpoints** — Tailwind v4 defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. Match spec Section 6.

- **Container max-widths** — handled in component-level CSS (`max-w-[720px]` for prose/demos, `max-w-[1120px]` for top bar / footer). Not a global token.

- **Z-index scale** — Tailwind v4 defaults. Top bar uses `z-40` (matches Task 3 of implementation plan).

### One override: the `dark:*` variant

Tailwind v4's default `dark:*` variant is `@media (prefers-color-scheme: dark)`. This contract uses a manual `html.dark` class toggle (per spec + the implementation plan). The two are misaligned out of the box — any `dark:*` utility would fire on OS preference, not on the contract's class.

The fix is one line at the top of `app/globals.css`:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Compiles `dark:bg-foo` to `.dark\:bg-foo:where(.dark, .dark *)` — fires only when `html.dark` is set, by anything. Same family as the `::selection` / `focus-visible` / reduced-motion operational rules already locked. Token names and values unchanged; this is wiring, not a token.

---

## Task 2 reconciliation notes

Task 2 of the implementation plan was written when the visual system was provisional. Two updates needed when Task 2 runs, both small:

1. **Font swap.** Task 2 currently shows `import { GeistSans } from "geist/font/sans"`. Replace with `next/font/google` import of `Hanken_Grotesk` and `Spline_Sans_Mono`:

   ```ts
   import { Hanken_Grotesk } from "next/font/google";
   import { Spline_Sans_Mono } from "next/font/google";

   const hankenGrotesk = Hanken_Grotesk({
     subsets: ["latin"],
     variable: "--font-sans",
     display: "swap",
   });

   const splineSansMono = Spline_Sans_Mono({
     subsets: ["latin"],
     variable: "--font-mono",
     display: "swap",
   });
   ```

   Then on `<html>`: `className={`${hankenGrotesk.variable} ${splineSansMono.variable}`}`.

   Remove the `geist` npm dependency (Task 1 Step 3 installed it; uninstall when Task 2 runs).

2. **Dark mode selector.** Task 2 used `html.dark`. Contract matches. No change needed; this is just confirmation that the contract didn't drift.

---

## What this contract does NOT cover (deliberately)

- **Component-level visual treatments.** This contract is the token layer. How buttons compose, how the demo card looks, what the rail item looks like — those are component decisions in Task 6 onwards. They consume tokens from this contract but aren't part of the contract.

- **The hero interaction.** Jay's separate-session design work. The contract holds a slot of locked footprint; what runs inside the slot is editorial content per the Phase 0 hero-slot decision.

- **OG image / favicon design.** Phase 0 didn't cover these. Implementation plan Task 20 handles favicon; OG images are deferred.

- **Page templates beyond the homepage.** `/about`, `/work`, `/writing` page-level layouts are Task 5, 11–17 of the implementation plan. They consume tokens but their composition isn't part of this contract.

---

## Sign-off

This contract is the deliverable Phase 0 was designed to produce. Every token name, every value, every operational rule (focus, selection, reduced-motion) is justified by a logged decision in `2026-05-14-phase-0-visual-direction.md`.

When Phase 1 begins:

1. Copy the planning folder to the standalone repo per CLAUDE.md graduation workflow.
2. Run Task 1 of the implementation plan (Next.js scaffolding).
3. **Run Task 2 — paste the `@theme` + `html.dark` + `@layer base` blocks above into `app/globals.css` exactly as written. Apply the two Task 2 reconciliation notes (font swap, geist uninstall).**
4. Continue with Task 3 onwards.

The contract is the bridge. Phase 0 ends here.
