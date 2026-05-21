# Design System — Jay Moore Design

The written companion to [`style-guide.html`](./style-guide.html). Distills the locked Phase 0 visual system into a single navigable spec. Read this when you need the rules; read the HTML when you need to see them applied.

**Scope.** Tokens, components, patterns, motion, accessibility, theme, voice. Covers everything currently shipping on `main`.

**Authority.** The frozen source of truth is [`process/token-contract.md`](../../process/token-contract.md). This doc reads from it; do not edit values here independently.

**Reference image.** The user-shared homepage screenshot dated 2026-05-15 is the visual authority for layout and component composition. The Phase 0 HTML mockups under `process/round-3/` are exploration artifacts, **not** spec.

---

## 1. Foundations

### 1.1 Color

15 semantic tokens. Light declared at `:root`; dark overrides on `html.dark`. Every shipped accent passes WCAG AA in both modes; body text passes AAA; meta/caption text passes AA against every shipped surface in both modes.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--color-bg` | `#f1f3f5` | `#0b0d10` | Body background, cool slate |
| `--color-bg-2` | `#e7eaed` | `#131619` | Surface alt, method strip |
| `--color-panel` | `#ffffff` | `#161a1e` | Raised surfaces, demo cards |
| `--color-fg` | `#16191d` | `#e6e8ec` | Body text — AAA |
| `--color-fg-soft` | `#42474e` | `#a8aeb7` | Secondary body, long-form — AAA |
| `--color-fg-faint` | `#676c72` | `#8e949e` | Meta labels, captions — AA against all surface tokens both modes (dark lifted from `#777d87` on 2026-05-21 to clear AA against `--color-bg-2` and `--color-panel`) |
| `--color-grid` | `rgba(28, 25, 23, 0.045)` | `rgba(238, 236, 231, 0.045)` | Body grid lines, fg-tinted 4.5% alpha |
| `--color-line` | `#d7dbe0` | `#242a30` | Default border |
| `--color-line-strong` | `#bfc4cb` | `#353c44` | Emphasized border |
| `--color-accent` | `#1f57bd` | `#5b9bff` | Links, active state — AA |
| `--color-accent-deep` | `#1a4496` | `#3f7fe6` | Hover, pressed |
| `--color-accent-wash` | `#e6eefb` | `#11203a` | Tinted backgrounds |
| `--color-selection-fg` | `#ffffff` | `#0b0d10` | `::selection` foreground |
| `--color-ok` | `#2f9e6b` | `#56c08d` | Status indicator only |

**Discipline.**

- 60-30-10 enforced: `--color-bg` dominant, `--color-fg-soft` + `--color-line` secondary, `--color-accent` reserved for active state and hover.
- `--color-ok` is reserved for genuine status (live indicators, brand dot, success flags). Never use as a generic green.
- `--color-accent-deep` is the hover/pressed shade; never use for default text.
- `--color-fg-faint` is for captions and meta labels at small sizes; never body.

### 1.2 Typography

**Display:** Hanken Grotesk (regular, medium, semibold). Provides body, headings, and the wordmark. Loaded via `next/font/google` with `--font-sans` CSS variable.

**Mono:** Spline Sans Mono (regular, medium). Reserved for data, labels, coordinates, and structural accents — never body. Loaded via `next/font/google` with `--font-mono` CSS variable.

**Scale:** Perfect Fourth (1.333). Ten rungs from 11px to 87px.

| Token | px | rem | Usage |
|---|---|---|---|
| `--text-2xs` | 11 | 0.6875 | Mono captions, repo metadata |
| `--text-xs` | 12 | 0.75 | Tertiary UI, footer |
| `--text-sm` | 14 | 0.875 | Secondary body, nav, controls |
| `--text-base` | 16 | 1 | Body default |
| `--text-lg` | 21 | 1.3125 | Subtitles, lede |
| `--text-xl` | 28 | 1.75 | H3 |
| `--text-2xl` | 37 | 2.3125 | H2 |
| `--text-3xl` | 49 | 3.0625 | Pattern names, large section heads |
| `--text-4xl` | 65 | 4.0625 | Hero H2 desktop / H1 mobile |
| `--text-5xl` | 87 | 5.4375 | Hero H1 desktop |

**Letter-spacing.** Display sizes (text-3xl and up): `-0.01em` to `-0.02em`. Body (text-base, text-sm): default. Mono uppercase (`text-2xs`): `0.05em` to `0.08em`.

**Line-height.** Display: 1.0–1.1. Body: 1.5–1.6. Mono labels: 1.4.

### 1.3 Spacing

Tailwind v4 default 4px scale is inherited. **Convention:** layout uses even steps only — `space-2`, `space-4`, `space-6`, `space-8`, `space-12`, `space-16`, `space-24`, `space-32`. Odd steps (`space-1`, `space-3`, `space-5`) reserved for inside-component fine-tuning only.

| Step | px | Common use |
|---|---|---|
| `space-2` | 8 | Layout floor; minimum gap |
| `space-4` | 16 | Tight rhythm between related items |
| `space-6` | 24 | Nav gap, container padding |
| `space-8` | 32 | Component padding, section eyebrow gap |
| `space-12` | 48 | Subsection separation |
| `space-16` | 64 | Section vertical padding |
| `space-24` | 96 | Hero gutter, page-level breathing |
| `space-32` | 128 | Full-page section breaks |

**Container max-width:** `1120px`. Applied to TopBar, Footer, and the homepage container. Set as arbitrary value (`max-w-[1120px]`) — not a token.

### 1.4 Radius

Three rungs.

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Small chips, focus-ring inheritance |
| `--radius-md` | 10px | Default surfaces |
| `--radius-lg` | 16px | Large cards, panels |

**Discipline.** `rounded-full` is forbidden in general use. **Two documented exceptions:** the brand status dot (`.brand-dot`, 6px circle) and the theme toggle pill. Both are grounded in the user image reference.

### 1.5 Motion

Four durations, one easing curve, two stagger tokens.

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | 150ms | Hover, focus, small UI state |
| `--duration-normal` | 250ms | Component transitions |
| `--duration-slow` | 400ms | Theme swap, larger surfaces |
| `--duration-lazy` | 600ms | Scroll-into-view entrances |
| `--ease-snappy` | `cubic-bezier(.32, .72, 0, 1)` | Out-expo, the only easing |
| `--stagger-base` | 50ms | Initial reveal offset |
| `--stagger-step` | 80ms | Inter-element cascade gap |

**Reduced motion** is honored at the operational layer in `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Every state remains reachable; only the travel is removed.

### 1.6 Shadow

One elevation token.

| Token | Light | Dark |
|---|---|---|
| `--shadow` | `0 1px 2px rgba(16,19,23,.04), 0 8px 24px rgba(16,19,23,.07)` | `0 2px 8px rgba(0,0,0,.5)` |

Used on raised panels (demo cards). Most surfaces stay flat — shadows are rare.

---

## 2. Components

Every component currently shipping on `main`.

### 2.1 TopBar (`components/top-bar.tsx`)

Sticky persistent nav, 64px tall, max-w-1120px container, `border-b border-line` hairline.

**Left:** brand mark = `.brand-dot` (6px filled `--color-ok` + 3px halo via `color-mix`) + `Jay Moore` wordmark (Hanken `text-sm`).

**Right (desktop):** four-item nav (`Start` / `Demo` / `Depth` / `Github↗`) + pill theme toggle. Active state via `text-accent`; no underline. External link follows lucide `ArrowUpRight` with `currentColor` stroke.

**Right (mobile):** rolled 3-line hamburger with hover bg, animates to X on open. `inert` drawer renders below the bar with the same nav stacked + a labeled Theme row. Full-row hit areas via `block w-full bg-bg px-6 py-4`.

**A11y:** `aria-current="page"` on active link, `aria-expanded` + `aria-controls` on hamburger, `aria-label` on hamburger and brand link. Escape closes drawer. `inert` on closed drawer prevents focus into hidden items.

### 2.2 ThemeToggle (`components/theme-toggle.tsx`)

Pill button. 32px height (matches global button scale), `rounded-full`, `border-line`. Outline circle (`size-3`, `border-current`) + lowercase current-mode label (`light` / `dark`).

**A11y:** `aria-pressed={theme === "dark"}` + `aria-label="Toggle theme"`. Visible label speaks; state via `aria-pressed`.

### 2.3 ThemeProvider (`components/theme-provider.tsx`)

Client component. `useSyncExternalStore` + `MutationObserver` treat `html.dark` class as source of truth. System-preference change updates the class when no manual override stored.

**FOUC prevention:** inline blocking `<script>` in `app/layout.tsx` body runs before React hydration to apply `html.dark` from localStorage / `prefers-color-scheme`. `suppressHydrationWarning` on `<html>` tolerates the script's class addition.

### 2.4 SkipToContent (`components/skip-to-content.tsx`)

Server component. Anchor pointing to `#main`. `sr-only` until focused; reveals pinned top-left with `--shadow` over `--color-panel`.

### 2.5 Footer (`components/footer.tsx`)

Server component. One mono `text-2xs` row inside `max-w-1120px`. `border-t border-line` matches TopBar's bottom hairline. Asymmetric padding (`pt-8 pb-12`).

**Left:** identity line (Hanken sentence-case in `text-fg-soft`).
**Right:** three external links (`github · linkedin · jay@jaymoore.net`) separated by middle-dot text nodes. Hover shifts to `text-accent`.

**A11y:** `target="_blank" rel="noopener noreferrer"` on external links. Visible text serves as accessible name.

---

## 3. Patterns

Cross-component conventions. Deviating drifts the identity.

### 3.1 Active state — color only

Active nav items change color, never layout. Inactive and active items occupy identical box dimensions. No underline shift on hover, focus, or route change.

### 3.2 Hairline as grid

`border-line` at 1px separates sections. No enclosed boxes for primary content. Sections are rhythm + space + the hairline above. Hairlines tie the composition to the page grid; they're structural, not decorative.

### 3.3 External link — arrow follows the label

External links append a 16px lucide `ArrowUpRight` at `strokeWidth 1.5`. The SVG uses `stroke="currentColor"`, so hover brightening the label also brightens the arrow. Coupled, not detached.

### 3.4 Masthead — typeface alternation

Identity treatments alternate Hanken display sans with Spline mono accents. Mono carries data, labels, coordinates, and meta — never body. The alternation IS the structural signal of "instrument" identity.

### 3.5 Light-primary

The site is designed light-first. Dark is provided via `html.dark` class toggle (not `prefers-color-scheme` media query) so users can override OS preference and have it persist. Tailwind v4's `dark:*` variant is rebound to the class via:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

### 3.6 Status dot — live signal

`--color-ok` on a 6px filled circle with a 3px `color-mix(in srgb, var(--color-ok) 18%, transparent)` outer halo. Reserved for genuine status — the brand dot only at v1.

---

## 4. Accessibility

WCAG 2.1 AA is the floor. AAA on body and long-form body. Every interactive element is keyboard reachable with a visible focus ring; reduced motion is honored at the operational layer.

### 4.1 Focus

Global rule applied to every element via the universal `*:focus-visible` selector:

```css
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: inherit;
}
```

2px accent outline, 2px gap from the element edge, inherits border-radius so the ring matches the element's shape.

### 4.2 Selection

Theme-aware foreground via `::selection`:

```css
::selection {
  background: var(--color-accent);
  color: var(--color-selection-fg);
}
```

Selection-fg is `#ffffff` (light) / `#0b0d10` (dark). Contrast verified both modes.

### 4.3 Reduced motion

Comprehensive collapse — see [§1.5 Motion](#15-motion). Page reveal, hover transitions, theme swap, and any future scroll-into-view all degrade to instant. Every state remains reachable.

### 4.4 Keyboard navigation

- Skip-to-content link is the first focusable element.
- Tab order follows DOM order.
- `Escape` closes the mobile drawer.
- All toggles and links work without a mouse.
- No focus traps except the explicitly-required ones (none currently shipped).

### 4.5 ARIA conventions

- `aria-current="page"` on the active nav link.
- `aria-expanded` + `aria-controls` on the hamburger button.
- `aria-pressed` on the theme toggle (boolean state).
- `aria-label` only when the visible text doesn't fully describe the action (hamburger, theme toggle).
- `aria-label` **never** overrides existing visible text for SR users; visible text speaks first.
- `aria-hidden="true"` on decorative SVG, status dot, and middle-dot separator spans.
- `inert` on the closed mobile drawer so its children aren't focusable.

---

## 5. Theme

### 5.1 Modes

Light-primary; dark provided via `html.dark` class. Class is the source of truth; React state mirrors it via `useSyncExternalStore` + `MutationObserver`.

### 5.2 Source of truth

Resolution cascade on every load:

1. `localStorage.getItem("theme")` if set (manual override).
2. Otherwise: `window.matchMedia("(prefers-color-scheme: dark)")`.
3. Otherwise: light.

System preference changes only flip the class when no manual choice is stored.

### 5.3 FOUC prevention

Blocking inline `<script>` in `app/layout.tsx` body, first child:

```js
(function(){
  try {
    var t = localStorage.getItem('theme');
    var d = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (t !== 'light' && d)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
```

Runs synchronously before React hydrates. Body paints with the correct class on first frame. `suppressHydrationWarning` on `<html>` tolerates the class.

### 5.4 Tailwind variant rebind

Tailwind v4's `dark:*` variant defaults to a media query. Rebound to the class in `globals.css`:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

`dark:bg-foo` now fires only when `html.dark` is set. Any app code using `dark:*` follows the contract automatically.

---

## 6. Site metadata, OG, and PWA assets

How the site identifies itself to browsers, search engines, link-preview crawlers, and home-screen installers.

### 6.1 Favicon set

App Router file-convention assets in `app/`. Next.js auto-injects the `<link>` tags; no manual `<head>` work required.

| File | Output `<link>` | Sizes | Source |
|---|---|---|---|
| `app/favicon.ico` | `rel="icon"` `type="image/x-icon"` | 48×48 (multi-resolution) | `design/jm-logo/favicon/favicon.ico` |
| `app/icon.svg` | `rel="icon"` `type="image/svg+xml"` | `sizes="any"` | `design/jm-logo/favicon/favicon.svg` |
| `app/icon.png` | `rel="icon"` `type="image/png"` | 96×96 | `design/jm-logo/favicon/favicon-96x96.png` |
| `app/apple-icon.png` | `rel="apple-touch-icon"` | 180×180 | `design/jm-logo/favicon/apple-touch-icon.png` |

### 6.2 Web app manifest

`public/site.webmanifest` references two PWA install icons at `public/web-app-manifest-{192,512}.png`. Linked from `<head>` via `metadata.manifest` in `app/layout.tsx`.

| Key | Value | Note |
|---|---|---|
| `name` | `Jay Moore` | Long install label |
| `short_name` | `JM` | Home-screen tile label |
| `theme_color` | `#f1f3f5` | Matches `--color-bg` light |
| `background_color` | `#f1f3f5` | Matches `--color-bg` light |
| `display` | `standalone` | PWA install mode |
| icon `purpose` | `maskable` | Safe area baked in; works with Android adaptive icons |

### 6.3 Viewport `theme-color`

Two media-scoped values surfaced via `viewport.themeColor` in `app/layout.tsx`. Controls browser chrome tint (Safari status bar, Chrome address bar on Android) when the page is open.

| Media query | Value | Token equivalent |
|---|---|---|
| `(prefers-color-scheme: light)` | `#f1f3f5` | `--color-bg` light |
| `(prefers-color-scheme: dark)` | `#0b0d10` | `--color-bg` dark |

This is the only place where dark-mode chrome is tied to OS preference rather than the `html.dark` class. Browser chrome can't read the class — the OS query is the only signal available.

### 6.4 Open Graph image

Generated dynamically at `/opengraph-image` via `next/og` (`app/opengraph-image.tsx`). Edge runtime. Dimensions locked at 1200×630. Type `image/png`.

**Composition**

| Element | Value |
|---|---|
| Background | `--color-bg` light (`#f1f3f5`) with grid texture at `rgba(28, 25, 23, 0.06)`, 80px cell |
| Vertical accent rail | 2px wide, `--color-accent` (`#1f57bd`), 110px top inset, 110px bottom inset |
| Top caption | Spline Sans Mono, 20px, uppercase, `0.08em` tracking, `--color-fg-faint` |
| H1 | Hanken Grotesk Semibold, 96px, `−0.025em` tracking, `1.02` line-height. "AI-native" in `--color-accent` |
| Subtitle | Hanken Grotesk Regular, 28px, `--color-fg-soft` |
| Bottom meta strip | Spline Sans Mono, 18px uppercase, separated by `border-top: 1px solid --color-line` |
| Bottom-right wordmark | Spline Sans Mono, 20px, `--color-fg`, preceded by 10px filled circle in `--color-accent` |

**Fonts**

Resolved at request time from the Google Fonts CSS API (`User-Agent: curl/8.0.0` forces TTF over WOFF2 since Satori has limited WOFF2 support). Three faces requested: Hanken Grotesk 400, Hanken Grotesk 600, Spline Sans Mono 400.

**Failure mode**

Font fetch wrapped in `try/catch` with 4-second `AbortSignal.timeout`. Any single failure returns the surviving subset; total failure returns `fonts: []` and Satori falls back to its bundled default. The route never 500s on font issues — the worst case is a visually-degraded but functional PNG.

### 6.5 Metadata declarations

All in `app/layout.tsx` `metadata` export:

```ts
metadataBase: new URL("https://jaymoore.net"),
title: { default: SITE_TITLE, template: "%s · Jay Moore" },
description: SITE_DESCRIPTION,
alternates: { canonical: "/" },
openGraph: {
  type: "website",
  siteName: "Jay Moore",
  url: "https://jaymoore.net",
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  locale: "en_US",
},
twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
robots: { index: true, follow: true },
manifest: "/site.webmanifest",
```

Next.js auto-populates `og:image`, `og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt`, and `twitter:image` from the `app/opengraph-image.tsx` file convention. Do not set them manually.

### 6.6 Apex redirect

`next.config.ts` returns a host-based 308 redirect:

```ts
{
  source: "/:path*",
  has: [{ type: "host", value: "www.jaymoore.net" }],
  destination: "https://jaymoore.net/:path*",
  permanent: true,
}
```

Eliminates duplicate-content split between apex and `www`. `jaymoore.net` is canonical; `www.jaymoore.net` 308s to the same path on apex.

---

## 7. Iconography

Library: [`lucide-react`](https://lucide.dev/) installed as a runtime dependency. Full conventions in [`process/icon-conventions.md`](../../process/icon-conventions.md).

| Default prop | Value |
|---|---|
| `strokeWidth` | `1.5` |
| `size` | `16` inline with text, `20` standalone |
| `aria-hidden` | `"true"` when decorative |
| `aria-label` | required when the icon is the only content |

**Principle.** The Round 3 locked artifact uses zero icons. Letterforms do the work. Icons replace text that wouldn't fit; they never decorate. Site-wide v1 instance count expected around five.

**Curated v1 set.** `ArrowUpRight`, `ArrowRight`, `Github`, `Linkedin`, `Mail`, `GitBranch`, `Workflow`, `LineChart`, `Activity`, `Shield`, `Clock`.

**Skip list.** `Sparkles`, `Wand2`, `Bot`, `Cpu`, brand glyphs from third-party services. The first four read as generic AI shorthand; the last break the cool-slate palette.

---

## 8. Voice

### 8.1 Tone

Terse, restrained, instrument-coded. Jay's own voice, applied consistently.

- One idea per paragraph; one paragraph per beat.
- Active voice. Concrete nouns. No hedging.
- No marketing tropes ("join the movement," "level up," "unlock," "discover").
- No fragment-manifesto stacks ("Make it fast. Make it beautiful.") — that is Rauno's move; we don't borrow it.
- Mono labels orient, never shout.

### 8.2 Capitalization

- Body, headings, link labels: sentence case (`Design engineer for AI-native workflows`).
- Mono coordinate labels and tags: lowercase (`now / prior / open to`).
- Mono section eyebrows: uppercase with letter-spacing tracking (`01 / POSITIONING`).
- Brand wordmark: `Jay Moore` — title case, never all caps.
- Theme toggle current-mode label: lowercase (`light` / `dark`).

### 8.3 Abbreviations

- Expand abbreviations in body and headings (`Simple Path Media`, not `SPM`).
- Mono coordinate labels may abbreviate when row width matters.
- Acronyms uppercase (`AI`, `UI`, `UX`, `API`).

---

## 9. Process

How this system was built and how it changes.

### 9.1 Authority

- **Frozen:** `process/token-contract.md`. Token names, count, type scale ratio, breakpoint values. Cannot change without reopening the contract.
- **Iterable:** specific hex values, specific ms values, easing curves. Can tune post-launch.

### 9.2 Visual reference

The user-shared homepage screenshot is the visual authority for layout and component composition. The Phase 0 HTML mockups in `process/round-3/` are exploration artifacts, **not** spec.

### 9.3 Change protocol

1. Proposed change goes through the `frontend-design` skill (or `brainstorming` for novel interactions).
2. Implementation goes through `codex-second-opinion` before commit.
3. User approves the diff (`show-before-commit` rule).
4. Commit lands.
5. If visible UI: `design-review` skill runs before merge.
6. Token changes require updating `process/token-contract.md` first, then `app/globals.css`, then this doc.

### 9.4 Related docs

| Doc | Role |
|---|---|
| [`process/token-contract.md`](../../process/token-contract.md) | Frozen tokens + operational rules |
| [`process/icon-conventions.md`](../../process/icon-conventions.md) | Icon library, defaults, curated set, skip list |
| [`process/2026-05-14-phase-0-visual-direction.md`](../../process/2026-05-14-phase-0-visual-direction.md) | Phase 0 working record |
| [`app/globals.css`](../../app/globals.css) | Live application of the contract |
| [`app/layout.tsx`](../../app/layout.tsx) | Metadata, viewport, manifest wiring |
| [`app/opengraph-image.tsx`](../../app/opengraph-image.tsx) | Dynamic OG image (next/og) |
| [`next.config.ts`](../../next.config.ts) | Host-based www → apex 308 redirect |
| [`public/site.webmanifest`](../../public/site.webmanifest) | PWA install manifest |
| [`design/design-system/style-guide.html`](./style-guide.html) | Visual companion to this doc |
