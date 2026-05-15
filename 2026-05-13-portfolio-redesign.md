# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `jaymoore.net` with a Design Engineer–signal-first portfolio at `github.com/jaymoore/jay-moore-design` per the design spec at `docs/superpowers/specs/2026-05-13-portfolio-redesign-design.md`.

**Architecture:** Next.js 15 (App Router) + React 19 + Tailwind v4 + MDX content + motion.dev + shadcn-base custom layer. Public repo with one private content path (Fiserv case study). Hosted on Vercel. Single-scroll homepage with 2 live demo components, 2 case studies, 2 essays, /about credibility bridge, /lab, /audits public folder. Weekly Lighthouse + axe via GitHub Action committing to `/audits/`.

**Tech Stack:** Next.js 15, React 19, TypeScript (strict), Tailwind CSS v4, MDX (@next/mdx), motion (motion.dev), shadcn/ui (selected primitives), lucide-react icons, next/font (Geist Sans + Geist Mono), Vercel Analytics, GitHub Actions (Lighthouse CI + axe-core).

---

## Prerequisite: Phase 0 (Visual Design Approval)

This plan covers Phase 1 onward of the design spec — the **post-visual-approval** build. Phase 0 (visual design exploration, user-approval-gated) happens outside this implementation plan and is owned by Jay collaboratively. Token values, accent color, exact font choices, motion curves are decided in Phase 0 and consumed by the tasks below.

Before starting Task 1, Phase 0 must have produced:

- Approved visual direction (typography, color, motion language, overall aesthetic)
- Token contract (names locked, values approved): bg / surface / text / border / accent / radius / motion-duration tokens
- Confirmed font choice (default: Geist Sans + Geist Mono per spec, but Phase 0 can override)
- Confirmed accent color (default: TBD — Phase 0 picks)

If those aren't ready, do not start Task 1. Iterate Phase 0 first.

---

## File Structure Map

Every file the plan creates or modifies, with one-line responsibility.

```
jay-moore-design/                          (new repo, root)
├── app/
│   ├── layout.tsx                    Root layout, top bar, footer, theme provider, skip-to-content
│   ├── page.tsx                      Homepage (hero, method-in-practice, demos, CTA, timeline strip)
│   ├── globals.css                   Tailwind v4 @theme tokens (light + dark)
│   ├── about/page.tsx                /about credibility bridge
│   ├── lab/page.tsx                  /lab index
│   ├── lab/[slug]/page.tsx           Single lab entry (MDX)
│   ├── patterns/page.tsx             /patterns index (not in nav at v1)
│   ├── patterns/[slug]/page.tsx      Single pattern (MDX, big demos)
│   ├── writing/page.tsx              /writing index
│   ├── writing/[slug]/page.tsx       Single essay (MDX)
│   ├── work/spm-lifecycle/page.tsx   Primary case study
│   ├── work/fiserv-gift-card-portal/page.tsx  Compressed Fiserv case study
│   ├── audits/page.tsx               Public audit reports index
│   ├── sitemap.ts                    Hand-rolled sitemap
│   ├── robots.ts                     Hand-rolled robots
│   └── opengraph-image.tsx           Default OG image
├── components/
│   ├── top-bar.tsx                   Persistent top nav, mobile menu
│   ├── footer.tsx                    Bio, availability line, github, email
│   ├── theme-toggle.tsx              Dark mode toggle (system default + manual)
│   ├── skip-to-content.tsx           A11y skip link
│   ├── hero.tsx                      Homepage hero block (H1 + sub + 2 anchors)
│   ├── pivot-statement.tsx           "Who this is for" line above hero
│   ├── method-in-practice.tsx        Static auditable artifact block
│   ├── demo-card.tsx                 Reusable demo skeleton (Section 4 of spec)
│   ├── view-source-toggle.tsx        Reveal 20-40 lines of key React inline
│   ├── timeline-strip.tsx            "Since 2014: Fiserv · Kleinfelder · SPM →"
│   ├── case-study-cta.tsx            Homepage CTA to SPM case study
│   └── ui/                           shadcn-base primitives (only what we use)
├── lib/
│   ├── patterns/
│   │   ├── trust-surface/index.tsx   Demo 1 component, extractable
│   │   ├── trust-surface/README.md   Tradeoffs, perf budget, known limitations
│   │   ├── streaming-ui/index.tsx    Demo 2 component, extractable
│   │   └── streaming-ui/README.md    Same structure as Demo 1
│   ├── mdx.ts                        MDX frontmatter parsing + file enumeration
│   └── utils.ts                      cn() helper from shadcn
├── content/
│   ├── writing/
│   │   ├── process.mdx               "How I work — LLM-first methodology + quality gates"
│   │   └── what-didnt-work.mdx       "Failure modes in LLM-first design"
│   ├── lab/
│   │   └── token-streaming-citations.mdx  Seed lab entry
│   └── work/
│       └── spm-lifecycle.mdx         SPM lifecycle case study content
├── content-private/                  Gitignored locally OR private submodule
│   └── work/
│       └── fiserv-gift-card-portal.mdx  Fiserv content (NDA-respectful)
├── public/
│   ├── method-in-practice/
│   │   └── demo-1-pr-screenshot.png  Real PR screenshot (added during Phase 2)
│   └── favicon.ico
├── audits/
│   ├── README.md                     4-week rolling summary
│   └── 2026-MM-DD.md                 Single audit snapshot (auto-committed)
├── scripts/
│   └── audit.mjs                     Lighthouse + axe runner (used by Action)
├── .github/
│   └── workflows/
│       ├── ci.yml                    Lint + typecheck on PR
│       └── audit.yml                 Weekly Lighthouse + axe → /audits/
├── tailwind.config.ts                Light wrapper; main config in @theme in globals.css
├── next.config.ts                    MDX config + image config
├── tsconfig.json                     Strict mode
├── postcss.config.mjs                Tailwind v4 PostCSS
├── package.json                      Dependencies
├── README.md                         Public-vs-private, shadcn-vs-custom, audit cadence
└── LICENSE                           MIT
```

---

## Task 1: Initialize repo + Next.js + base dependencies

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`, `LICENSE`, `README.md`

- [ ] **Step 1: Create the repo and clone locally**

Run from `~/00-Dev-jaymoore`:

```bash
cd ~/00-Dev-jaymoore
gh repo create jaymoore/jay-moore-design --public --description "Jay Moore's portfolio. Design Engineer for AI-native workflows."
git clone git@github-jaymoore:jaymoore/jay-moore-design.git
cd jay-moore-design
```

Expected: repo `jaymoore/jay-moore-design` exists on github and is cloned locally via SSH alias `github-jaymoore`.

- [ ] **Step 2: Bootstrap Next.js 15**

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --turbopack
```

Choose:
- TypeScript: yes
- ESLint: yes
- Tailwind CSS: yes
- `src/` directory: no
- App Router: yes
- Turbopack: yes
- Import alias: `@/*`

Expected: `package.json`, `app/`, `tailwind.config.ts` etc. created.

- [ ] **Step 3: Install runtime dependencies**

```bash
npm install motion @next/mdx @mdx-js/react @mdx-js/loader gray-matter lucide-react clsx tailwind-merge @vercel/analytics
```

Expected: dependencies added to `package.json`.

- [ ] **Step 4: Install dev dependencies**

```bash
npm install -D @types/mdx
```

Expected: `@types/mdx` in devDependencies.

- [ ] **Step 5: Write `LICENSE` (MIT)**

Create `LICENSE`:

```
MIT License

Copyright (c) 2026 Jay Moore

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 6: Add `content-private/` to `.gitignore`**

Append to `.gitignore`:

```
# Private content (NDA-respectful Fiserv case study; not committed publicly)
content-private/
```

- [ ] **Step 7: Initial commit and push**

```bash
git add .
git commit -m "chore: initialize next.js 15 + tailwind v4 + mdx scaffolding"
git push -u origin main
```

Expected: initial commit on `main` branch on github.

- [ ] **Step 8: Set up Vercel project**

In the Vercel dashboard or via CLI:

```bash
npx vercel link --project jay-moore-design
npx vercel --prod=false
```

Expected: project linked, first preview deploy live at a `*.vercel.app` URL.

- [ ] **Step 9: Add custom subdomain `staging.jaymoore.net` in Vercel dashboard**

Manual: Vercel dashboard → project → Settings → Domains → add `staging.jaymoore.net`. Add the DNS CNAME record to wherever `jaymoore.net` is managed.

Expected: staging URL resolves to the Vercel deploy.

---

## Task 2: Tailwind v4 design tokens + dark mode foundation

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts` (light wrapper)
- Create: `components/theme-toggle.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write `app/globals.css` with the token contract**

Replace the contents of `app/globals.css`. Use approved token VALUES from Phase 0; if Phase 0 picked spec defaults, use these:

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  /* Type scale — Perfect Fourth (1.333) */
  --text-2xs: 0.6875rem;   /* 11px */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.3125rem;    /* 21px */
  --text-xl: 1.75rem;      /* 28px */
  --text-2xl: 2.3125rem;   /* 37px */
  --text-3xl: 3.0625rem;   /* 49px */
  --text-4xl: 4.0625rem;   /* 65px */
  --text-5xl: 5.4375rem;   /* 87px */

  /* Colors — light */
  --color-bg: #fafaf9;
  --color-surface: #ffffff;
  --color-surface-2: #f5f5f4;
  --color-border: #e7e5e4;
  --color-border-strong: #d6d3d1;
  --color-text: #0a0a0a;
  --color-text-muted: #57534e;
  --color-text-subtle: #a8a29e;
  --color-accent: #ff6e3a; /* Provisional — Phase 0 final */

  /* Radius */
  --radius-sm: 0.375rem;   /* 6px */
  --radius-md: 0.625rem;   /* 10px */
  --radius-lg: 1rem;       /* 16px */

  /* Motion durations */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --duration-lazy: 600ms;
}

@layer base {
  :root {
    color-scheme: light;
  }

  html.dark {
    color-scheme: dark;
    --color-bg: #0a0a0a;
    --color-surface: #171717;
    --color-surface-2: #262626;
    --color-border: #262626;
    --color-border-strong: #404040;
    --color-text: #fafaf9;
    --color-text-muted: #a3a3a3;
    --color-text-subtle: #737373;
  }

  html {
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Focus rings — always visible */
  *:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: inherit;
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

- [ ] **Step 2: Add Geist fonts via `next/font` in `app/layout.tsx`**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme-provider";
import { SkipToContent } from "@/components/skip-to-content";
import { TopBar } from "@/components/top-bar";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jaymoore.net"),
  title: {
    default: "Jay Moore — Design Engineer for AI-native workflows",
    template: "%s · Jay Moore",
  },
  description:
    "Design engineer for AI-native workflows. 10+ years shipping software workflows. Trust-first AI UX. Ships React.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <SkipToContent />
          <TopBar />
          <main id="main">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
```

Install `geist`:

```bash
npm install geist
```

- [ ] **Step 3: Write `components/theme-provider.tsx`**

Create `components/theme-provider.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initial = stored ?? system;
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
```

- [ ] **Step 4: Write `components/theme-toggle.tsx`**

```tsx
"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors"
    >
      {theme === "light" ? <Moon size={16} strokeWidth={1.5} /> : <Sun size={16} strokeWidth={1.5} />}
    </button>
  );
}
```

- [ ] **Step 5: Write `components/skip-to-content.tsx`**

```tsx
export function SkipToContent() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-accent)] focus:px-3 focus:py-2 focus:text-white"
    >
      Skip to content
    </a>
  );
}
```

- [ ] **Step 6: Run dev server and verify tokens render**

```bash
npm run dev
```

Open `http://localhost:3000`. Body background should be `#fafaf9` (light) or `#0a0a0a` (dark, if system pref). Toggle system pref dark mode → page should follow.

Expected: background + text colors swap with system preference; no console errors.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css app/layout.tsx components/theme-provider.tsx components/theme-toggle.tsx components/skip-to-content.tsx package.json package-lock.json
git commit -m "feat: tailwind v4 tokens + dark mode + theme provider"
```

---

## Task 3: Top bar + footer

**Files:**
- Create: `components/top-bar.tsx`
- Create: `components/footer.tsx`
- Create: `lib/utils.ts`

- [ ] **Step 1: Write `lib/utils.ts`**

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Write `components/top-bar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/work/spm-lifecycle", label: "Work" },
  { href: "/lab", label: "Lab" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "https://github.com/jaymoore", label: "Github", external: true },
];

export function TopBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-4 sm:px-6"
      >
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight"
          aria-label="Jay Moore — Home"
        >
          Jay Moore
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
        </ul>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-md border border-[var(--color-border)]"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)]">
          <ul className="flex flex-col px-4 py-4 gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 text-base"
                  onClick={() => setOpen(false)}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <ThemeToggle />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 3: Write `components/footer.tsx`**

```tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-32">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 py-12 flex flex-col gap-4 text-sm text-[var(--color-text-muted)]">
        <p className="text-[var(--color-text)]">
          Jay Moore — Design engineer for AI-native workflows.
        </p>
        <p>Open to Staff/Principal Design Engineer roles, US remote.</p>
        <ul className="flex flex-wrap gap-6">
          <li>
            <Link href="/about" className="hover:text-[var(--color-text)]">About</Link>
          </li>
          <li>
            <a
              href="https://github.com/jaymoore"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-text)]"
            >
              Github
            </a>
          </li>
          <li>
            <a href="mailto:jay@jaymoore.net" className="hover:text-[var(--color-text)]">
              jay@jaymoore.net
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000`. Check:
- Top bar visible with 5 links + Github + theme toggle
- Tab through nav: focus rings visible
- Mobile (resize <768px): hamburger appears, menu opens, links work
- Footer visible at bottom

Expected: nav and footer render in both light and dark themes.

- [ ] **Step 5: Commit**

```bash
git add components/top-bar.tsx components/footer.tsx lib/utils.ts
git commit -m "feat: top bar with mobile menu + footer with availability"
```

---

## Task 4: Homepage shell + hero + pivot statement

**Files:**
- Replace: `app/page.tsx`
- Create: `components/pivot-statement.tsx`
- Create: `components/hero.tsx`

- [ ] **Step 1: Write `components/pivot-statement.tsx`**

```tsx
export function PivotStatement() {
  return (
    <p className="mx-auto max-w-[720px] px-4 sm:px-6 pt-12 sm:pt-16 text-sm sm:text-base text-[var(--color-text-muted)]">
      For AI-native teams. 10 yrs designing complex software, now shipping it in React.
    </p>
  );
}
```

- [ ] **Step 2: Write `components/hero.tsx`**

```tsx
import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto max-w-[720px] px-4 sm:px-6 pt-6 sm:pt-8 pb-16 sm:pb-24">
      <h1 className="text-4xl sm:text-5xl font-medium tracking-tight leading-[1.05]">
        Design engineer for AI-native workflows.
      </h1>
      <p className="mt-4 text-lg text-[var(--color-text-muted)]">
        Ship in code. Trust-first AI UX.
      </p>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/about" className="hover:text-[var(--color-text)] underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]">
          About my pivot →
        </Link>
        <a href="#demos" className="hover:text-[var(--color-text)] underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]">
          Live demos ↓
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Replace `app/page.tsx`**

```tsx
import { PivotStatement } from "@/components/pivot-statement";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <>
      <PivotStatement />
      <Hero />
      {/* Method in practice, demos, CTA, timeline strip added in later tasks */}
    </>
  );
}
```

- [ ] **Step 4: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- Pivot statement renders at top of content
- H1 is 65–87px desktop, 65px mobile
- "About my pivot →" links to `/about` (will 404 until Task 5)
- "Live demos ↓" is an `#demos` anchor (no target yet)
- Focus state visible on tab through anchors

Expected: hero block renders without error.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx components/pivot-statement.tsx components/hero.tsx
git commit -m "feat: homepage hero + pivot statement"
```

---

## Task 5: /about route + content

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Write `app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "10+ years shipping complex software workflows. Now LLM-first design engineer. Open to Staff/Principal DE roles, US remote.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-[720px] px-4 sm:px-6 pt-12 sm:pt-16 pb-24 prose-jay">
      <header>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight leading-tight">
          Design engineer for AI-native workflows. Pivoting after 10 yrs in product design.
        </h1>
      </header>

      <section className="mt-12 space-y-4 text-base leading-relaxed">
        <p>
          For the last decade, I designed complex software workflows in B2B SaaS — enterprise commerce,
          decision support, multi-persona dashboards. Senior Product Designer at Fiserv. Senior UX/UI at
          Kleinfelder.
        </p>
        <p>
          What changed: in 2024 I started shipping React in production for my own clients. LLM-first
          methodology — hypothesis to validated prototype in &lt;10 min using Claude + Cursor.
          I now operate at the seam between design and engineering on AI-native products. I&apos;m the one
          who builds the trust surface, ships the streaming UI, and writes the agentic fallbacks.
        </p>
        <p>
          I&apos;m looking for Staff or Principal Design Engineer roles at AI-frontier or workflow
          SaaS companies. US remote. Up to one week per quarter travel.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-medium tracking-tight">Timeline</h2>
        <ul className="mt-6 space-y-4 text-sm sm:text-base">
          <li>
            <strong className="text-[var(--color-text)]">2024 – present · Simple Path Media</strong>
            <span className="text-[var(--color-text-muted)]"> — AI-native lifecycle automation + decision support, operator. </span>
            <Link href="/work/spm-lifecycle" className="underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]">
              SPM lifecycle engine →
            </Link>
          </li>
          <li>
            <strong className="text-[var(--color-text)]">2021 – 2024 · Fiserv</strong>
            <span className="text-[var(--color-text-muted)]"> — Sr. Product Designer, Gift Card Portal redesign, multi-persona B2B SaaS. </span>
            <Link href="/work/fiserv-gift-card-portal" className="underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]">
              Case study →
            </Link>
          </li>
          <li>
            <strong className="text-[var(--color-text)]">2016 – 2020 · Kleinfelder</strong>
            <span className="text-[var(--color-text-muted)]"> — Sr. UX/UI, B2B platform, ~30% task time improvement, responsive design system.</span>
          </li>
          <li>
            <span className="text-[var(--color-text-muted)]">Earlier: agency + freelance design, since 2014.</span>
          </li>
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-medium tracking-tight">What also matters</h2>
        <p className="mt-4 text-base">
          I write about what doesn&apos;t work too —{" "}
          <Link href="/writing/what-didnt-work" className="underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]">
            failure modes in LLM-first design →
          </Link>
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-medium tracking-tight">Availability + contact</h2>
        <p className="mt-4 text-base">
          Open to Staff or Principal Design Engineer roles, US remote.
        </p>
        <ul className="mt-4 space-y-2 text-base">
          <li>
            <a href="mailto:jay@jaymoore.net" className="underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]">
              jay@jaymoore.net
            </a>
          </li>
          <li>
            <a href="https://github.com/jaymoore" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]">
              github.com/jaymoore
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/in/jay-moore-designer" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]">
              linkedin.com/in/jay-moore-designer
            </a>
          </li>
        </ul>
      </section>
    </article>
  );
}
```

- [ ] **Step 2: Verify route**

```bash
npm run dev
```

Navigate to `http://localhost:3000/about`. Verify:
- Page renders without error
- Headline visible
- Timeline lists 4 entries; links to `/work/spm-lifecycle` and `/work/fiserv-gift-card-portal` (both 404 for now)
- Availability paragraph present
- Email + github + linkedin links

Expected: /about page complete; cross-links present but targets pending.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: /about credibility bridge with pivot narrative and timeline"
```

---

## Task 6: Demo card skeleton + view-source toggle

**Files:**
- Create: `components/demo-card.tsx`
- Create: `components/view-source-toggle.tsx`

- [ ] **Step 1: Write `components/view-source-toggle.tsx`**

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function ViewSourceToggle({
  source,
  language = "tsx",
}: {
  source: string;
  language?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
      >
        <span>View source</span>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <pre className="mt-3 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 text-xs font-mono leading-relaxed">
          <code data-language={language}>{source}</code>
        </pre>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write `components/demo-card.tsx`**

```tsx
import Link from "next/link";
import { ViewSourceToggle } from "@/components/view-source-toggle";

export type DemoCardProps = {
  patternName: string;
  subtitle: string;
  why: string;
  repoUrl: string;
  source: string;
  children: React.ReactNode;
};

export function DemoCard({
  patternName,
  subtitle,
  why,
  repoUrl,
  source,
  children,
}: DemoCardProps) {
  return (
    <section className="mx-auto max-w-[720px] px-4 sm:px-6 py-12 sm:py-16 border-t border-[var(--color-border)]">
      <header>
        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight leading-tight">
          Pattern: {patternName}
        </h2>
        <p className="mt-2 text-base text-[var(--color-text-muted)]">{subtitle}</p>
      </header>

      <div className="mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        {children}
      </div>

      <p className="mt-6 text-sm leading-relaxed">
        <span className="font-medium">Why:</span> <span className="text-[var(--color-text-muted)]">{why}</span>
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]"
        >
          Repo →
        </a>
        <ViewSourceToggle source={source} />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify component imports cleanly**

```bash
npm run build
```

Expected: build succeeds with no type errors.

- [ ] **Step 4: Commit**

```bash
git add components/demo-card.tsx components/view-source-toggle.tsx
git commit -m "feat: demo card skeleton + view source toggle"
```

---

## Task 7: Pattern library scaffold — Trust Surface (Demo 1)

**Files:**
- Create: `lib/patterns/trust-surface/index.tsx`
- Create: `lib/patterns/trust-surface/README.md`
- Create: `lib/patterns/trust-surface/source.ts` (raw source for view-source toggle)

- [ ] **Step 1: Write `lib/patterns/trust-surface/index.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Suggestion = {
  text: string;
  confidence: number;
  evidence: string[];
};

const SAMPLE: Suggestion = {
  text: "Schedule for Tuesday 9am — best historical reply rate for this segment.",
  confidence: 0.72,
  evidence: [
    "Segment baseline: 4.8% reply rate",
    "Tuesday 9am cohort: +1.4 percentage points",
    "Last 30 days: 12 sends, 4 replies",
  ],
};

type Decision = "pending" | "accepted" | "rejected" | "overridden";

export function TrustSurface() {
  const [decision, setDecision] = useState<Decision>("pending");
  const [showEvidence, setShowEvidence] = useState(false);

  return (
    <div className="space-y-4">
      <div
        className="rounded-md border border-[var(--color-border)] p-4"
        role="region"
        aria-label="AI suggestion"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-base leading-relaxed">{SAMPLE.text}</p>
          <span
            className="shrink-0 rounded-sm bg-[var(--color-surface-2)] px-2 py-0.5 text-xs font-mono"
            aria-label={`Confidence ${Math.round(SAMPLE.confidence * 100)} percent`}
          >
            {Math.round(SAMPLE.confidence * 100)}%
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowEvidence(!showEvidence)}
          aria-expanded={showEvidence}
          className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          <AlertCircle size={12} strokeWidth={1.5} />
          {showEvidence ? "Hide" : "Show"} evidence
        </button>

        <AnimatePresence>
          {showEvidence && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 space-y-1 text-xs text-[var(--color-text-muted)] overflow-hidden"
            >
              {SAMPLE.evidence.map((e) => (
                <li key={e} className="font-mono">— {e}</li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDecision("accepted")}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-sm hover:bg-[var(--color-bg)]"
        >
          <Check size={14} strokeWidth={1.5} /> Accept
        </button>
        <button
          type="button"
          onClick={() => setDecision("rejected")}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--color-border)] px-3 text-sm hover:bg-[var(--color-surface-2)]"
        >
          <X size={14} strokeWidth={1.5} /> Reject
        </button>
        <button
          type="button"
          onClick={() => setDecision("overridden")}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--color-border)] px-3 text-sm hover:bg-[var(--color-surface-2)]"
        >
          Override
        </button>
      </div>

      <div className="text-xs text-[var(--color-text-muted)] font-mono min-h-[1.25rem]" aria-live="polite">
        {decision === "pending" ? "" : `Decision: ${decision}`}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `lib/patterns/trust-surface/source.ts`**

```ts
export const trustSurfaceSource = `// Key logic — full source: lib/patterns/trust-surface/index.tsx
const [decision, setDecision] = useState<Decision>("pending");
const [showEvidence, setShowEvidence] = useState(false);

// Suggestion shown with confidence score
<p>{SAMPLE.text}</p>
<span aria-label={\`Confidence \${Math.round(SAMPLE.confidence * 100)} percent\`}>
  {Math.round(SAMPLE.confidence * 100)}%
</span>

// Evidence toggle — provenance over opacity
<button onClick={() => setShowEvidence(!showEvidence)} aria-expanded={showEvidence}>
  {showEvidence ? "Hide" : "Show"} evidence
</button>

// Three-way decision — Accept / Reject / Override
// Override is the seat belt: AI suggests, operator decides.
<button onClick={() => setDecision("accepted")}>Accept</button>
<button onClick={() => setDecision("rejected")}>Reject</button>
<button onClick={() => setDecision("overridden")}>Override</button>
`;
```

- [ ] **Step 3: Write `lib/patterns/trust-surface/README.md`**

```markdown
# Trust Surface Pattern

AI suggestion with confidence score, evidence drawer, and three-way decision (Accept / Reject / Override).

## What it demonstrates

- Provenance over opacity — confidence score and evidence visible
- Override beats obedience — operator always has a third option, not just Accept/Reject
- Decision capture — surfaces a single state machine ready to be wired to a backend

## Tradeoffs

- Confidence as percentage assumes calibrated probability. In practice, model confidence is often miscalibrated; pair with sample-size context.
- Evidence drawer is text-only; richer evidence types (charts, citations) require pattern extension.
- No keyboard shortcut for Accept/Reject yet — added in v1.1 once we know which keys land where.

## Performance budget

- Initial render: < 8 kb gzipped
- INP target: < 100 ms on M1
- No third-party network calls in canned mode

## Accessibility

- Three buttons, all reachable by Tab
- `aria-live="polite"` on the decision status
- Evidence toggle uses `aria-expanded`
- Focus rings inherit global accent
- Reduced-motion users get instant transitions

## Known limitations

- Sample data is hardcoded for demo; real consumer wires `suggestion`, `confidence`, `evidence` as props
- No undo. Last decision wins.
- No telemetry hook in v1. Add `onDecision` callback prop in v1.1.

## Live demo

`https://jaymoore.net/#demo-trust-surface`

## Maps to

Dispatch Decision Support Dashboard (SPM, 2026) — Accept/Reject/Consider + confidence + evidence + override.
```

- [ ] **Step 4: Build to verify type-correctness**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add lib/patterns/trust-surface/
git commit -m "feat: trust surface pattern with confidence + evidence + override"
```

---

## Task 8: Pattern library — Streaming UI (Demo 2)

**Files:**
- Create: `lib/patterns/streaming-ui/index.tsx`
- Create: `lib/patterns/streaming-ui/source.ts`
- Create: `lib/patterns/streaming-ui/README.md`

- [ ] **Step 1: Write `lib/patterns/streaming-ui/index.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square, RotateCcw } from "lucide-react";

const CANNED_RESPONSE = `Streaming is a transport pattern, not a product pattern.

When the model is generating tokens, users have three latent questions:
1. Is it working? (heartbeat)
2. Is it on the right track? (early signal)
3. Can I stop or redirect? (control)

Surface each one explicitly. Don't hide the stream behind a spinner.`;

type StreamState = "idle" | "streaming" | "complete" | "cancelled";

export function StreamingUI() {
  const [text, setText] = useState("");
  const [state, setState] = useState<StreamState>("idle");
  const cancelRef = useRef(false);

  async function start() {
    cancelRef.current = false;
    setText("");
    setState("streaming");
    for (let i = 0; i < CANNED_RESPONSE.length; i++) {
      if (cancelRef.current) {
        setState("cancelled");
        return;
      }
      await new Promise((r) => setTimeout(r, 18));
      setText(CANNED_RESPONSE.slice(0, i + 1));
    }
    setState("complete");
  }

  function cancel() {
    cancelRef.current = true;
  }

  function reset() {
    cancelRef.current = false;
    setText("");
    setState("idle");
  }

  // Auto-start when scrolled into view (once)
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && state === "idle") {
            start();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="space-y-4">
      <div
        className="min-h-[8rem] rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap"
        aria-live="polite"
        aria-busy={state === "streaming"}
      >
        {text}
        {state === "streaming" && <span className="ml-0.5 inline-block w-2 h-4 bg-[var(--color-text)] animate-pulse align-middle" aria-hidden="true" />}
      </div>

      <div className="flex flex-wrap gap-2">
        {state === "idle" && (
          <button
            type="button"
            onClick={start}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-sm hover:bg-[var(--color-bg)]"
          >
            <Play size={14} strokeWidth={1.5} /> Start
          </button>
        )}
        {state === "streaming" && (
          <button
            type="button"
            onClick={cancel}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--color-border)] px-3 text-sm hover:bg-[var(--color-surface-2)]"
          >
            <Square size={14} strokeWidth={1.5} /> Cancel
          </button>
        )}
        {(state === "complete" || state === "cancelled") && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--color-border)] px-3 text-sm hover:bg-[var(--color-surface-2)]"
          >
            <RotateCcw size={14} strokeWidth={1.5} /> Restart
          </button>
        )}
      </div>

      <div className="text-xs text-[var(--color-text-muted)] font-mono" aria-live="polite">
        State: {state}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `lib/patterns/streaming-ui/source.ts`**

```ts
export const streamingUiSource = `// Key logic — full source: lib/patterns/streaming-ui/index.tsx
const [text, setText] = useState("");
const [state, setState] = useState<StreamState>("idle");
const cancelRef = useRef(false);

async function start() {
  cancelRef.current = false;
  setText("");
  setState("streaming");
  for (let i = 0; i < CANNED_RESPONSE.length; i++) {
    if (cancelRef.current) {
      setState("cancelled");
      return;
    }
    await new Promise((r) => setTimeout(r, 18));
    setText(CANNED_RESPONSE.slice(0, i + 1));
  }
  setState("complete");
}

// Cancel is a ref, not state — avoids stale closure inside the loop
function cancel() { cancelRef.current = true; }

// aria-live="polite" announces tokens without interrupting screen readers
<div aria-live="polite" aria-busy={state === "streaming"}>{text}</div>
`;
```

- [ ] **Step 3: Write `lib/patterns/streaming-ui/README.md`**

```markdown
# Streaming UI Pattern

Token-by-token streaming response with cancel mid-stream and restart.

## What it demonstrates

- Cancel mid-stream is real, not a fake state — the loop checks a ref each tick
- aria-live="polite" + aria-busy gives screen readers a working experience
- Auto-start on scroll-into-view (one-time), reset is explicit user action
- Streaming as transport — same pattern works with real SSE / fetch streams; canned mode is a controllable surrogate

## Tradeoffs

- 18 ms per character is hand-tuned for readability; real LLM stream rates vary 20–60 tokens/sec
- No retry-on-error here; in production wire an exponential backoff with attempt visible
- The blinking cursor uses CSS animation (not motion library) — survives reduced-motion as steady state

## Performance budget

- Initial render: < 6 kb gzipped
- INP target: < 100 ms on M1
- No third-party network calls in canned mode

## Accessibility

- aria-live="polite" announces stream
- aria-busy reflects state
- Cancel/Restart reachable by Tab
- State label is monospaced and announced via second aria-live region

## Known limitations

- Sample text is hardcoded; real consumer wires `source` (AsyncIterable<string>) as prop
- No "show full" jump-to-end during streaming
- No latency metric exposed in v1

## Live demo

`https://jaymoore.net/#demo-streaming-ui`

## Maps to

General LLM UX, ChatGPT-class interfaces, Vercel v0 streaming, Claude Code response surfaces.
```

- [ ] **Step 4: Build and verify**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add lib/patterns/streaming-ui/
git commit -m "feat: streaming UI pattern with cancel + restart"
```

---

## Task 9: Method-in-practice block

**Files:**
- Create: `components/method-in-practice.tsx`
- Create: `public/method-in-practice/demo-1-pr-screenshot.png` (placeholder for now)

- [ ] **Step 1: Create placeholder PR screenshot**

```bash
mkdir -p public/method-in-practice
# Placeholder: a 1200x675 transparent PNG. Replace with real PR screenshot in Phase 4.
# Use a real PR screenshot once Demo 1 has been merged with quality-gate commits.
echo "TODO: replace with real PR screenshot after Demo 1 is merged" > public/method-in-practice/README.txt
```

Manual: capture screenshot of merged PR for `lib/patterns/trust-surface/index.tsx` once committed. Save as `public/method-in-practice/demo-1-pr-screenshot.png`.

- [ ] **Step 2: Write `components/method-in-practice.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";

export function MethodInPractice() {
  return (
    <section
      aria-labelledby="method-heading"
      className="mx-auto max-w-[720px] px-4 sm:px-6 py-12 sm:py-16 border-t border-[var(--color-border)]"
    >
      <header>
        <h2 id="method-heading" className="text-xl sm:text-2xl font-medium tracking-tight">
          How the trust-surface demo got built
        </h2>
        <p className="mt-2 text-sm font-mono text-[var(--color-text-muted)]">
          12 commits · 0 failed CI checks · 2-day build
        </p>
      </header>

      <a
        href="https://github.com/jaymoore/jay-moore-design/pull/1"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 block rounded-lg border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-border-strong)] transition-colors"
      >
        <Image
          src="/method-in-practice/demo-1-pr-screenshot.png"
          alt="Screenshot of pull request that built the trust-surface demo, showing 12 commits and quality gate checks"
          width={1200}
          height={675}
          className="w-full h-auto"
        />
      </a>

      <p className="mt-6 text-base leading-relaxed text-[var(--color-text-muted)]">
        Hypothesis → prototype → quality gates. Each commit is one small step that passed lint, typecheck,
        and Lighthouse before the next started.{" "}
        <Link
          href="/writing/process"
          className="text-[var(--color-text)] underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]"
        >
          Full process →
        </Link>
      </p>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/method-in-practice.tsx public/method-in-practice/
git commit -m "feat: method-in-practice static auditable artifact block"
```

---

## Task 10: Homepage final composition — wire demos + CTA + timeline strip

**Files:**
- Modify: `app/page.tsx`
- Create: `components/case-study-cta.tsx`
- Create: `components/timeline-strip.tsx`

- [ ] **Step 1: Write `components/case-study-cta.tsx`**

```tsx
import Link from "next/link";

export function CaseStudyCta() {
  return (
    <section className="mx-auto max-w-[720px] px-4 sm:px-6 py-16 border-t border-[var(--color-border)]">
      <p className="text-base">
        See the full system —{" "}
        <Link
          href="/work/spm-lifecycle"
          className="text-[var(--color-text)] underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]"
        >
          SPM lifecycle engine case study →
        </Link>
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Write `components/timeline-strip.tsx`**

```tsx
import Link from "next/link";

export function TimelineStrip() {
  return (
    <section className="mx-auto max-w-[720px] px-4 sm:px-6 py-12 border-t border-[var(--color-border)]">
      <p className="text-sm text-[var(--color-text-muted)]">
        Since 2014: Fiserv · Kleinfelder · Simple Path Media —{" "}
        <Link
          href="/about"
          className="text-[var(--color-text)] underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]"
        >
          full timeline →
        </Link>
      </p>
    </section>
  );
}
```

- [ ] **Step 3: Rewrite `app/page.tsx` to compose the full homepage**

```tsx
import { PivotStatement } from "@/components/pivot-statement";
import { Hero } from "@/components/hero";
import { MethodInPractice } from "@/components/method-in-practice";
import { DemoCard } from "@/components/demo-card";
import { TrustSurface } from "@/lib/patterns/trust-surface";
import { trustSurfaceSource } from "@/lib/patterns/trust-surface/source";
import { StreamingUI } from "@/lib/patterns/streaming-ui";
import { streamingUiSource } from "@/lib/patterns/streaming-ui/source";
import { CaseStudyCta } from "@/components/case-study-cta";
import { TimelineStrip } from "@/components/timeline-strip";

export default function Home() {
  return (
    <>
      <PivotStatement />
      <Hero />
      <MethodInPractice />

      <div id="demos">
        <DemoCard
          patternName="Trust surfaces with confidence + override"
          subtitle="When the AI is uncertain, show users the receipts."
          why="Decisions need provenance. Override beats obedience. Confidence score is the seat belt."
          repoUrl="https://github.com/jaymoore/jay-moore-design/tree/main/lib/patterns/trust-surface"
          source={trustSurfaceSource}
        >
          <TrustSurface />
        </DemoCard>

        <DemoCard
          patternName="Streaming with cancel + restart"
          subtitle="Streaming is a transport pattern, not a product pattern."
          why="Cancel is a ref, not state — the loop checks each tick, so stop is instant. aria-live + aria-busy give screen readers a working experience."
          repoUrl="https://github.com/jaymoore/jay-moore-design/tree/main/lib/patterns/streaming-ui"
          source={streamingUiSource}
        >
          <StreamingUI />
        </DemoCard>
      </div>

      <CaseStudyCta />
      <TimelineStrip />
    </>
  );
}
```

- [ ] **Step 4: Run dev server and walk through the homepage**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify in order:
- Pivot statement at top
- H1 hero block with two anchor links
- Method in practice block with placeholder image + metric line + "Full process →" link
- Demo 1 (Trust surface) — interact: click Accept, Reject, Override; toggle evidence
- Demo 2 (Streaming UI) — autoplay on scroll; cancel mid-stream works; restart works
- Case study CTA
- Timeline strip
- Footer with availability line

Run accessibility check via axe DevTools extension. Verify no critical issues.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx components/case-study-cta.tsx components/timeline-strip.tsx
git commit -m "feat: homepage final composition — hero, method, demos, CTA, timeline"
```

---

## Task 11: MDX infrastructure for writing + lab + work

**Files:**
- Modify: `next.config.ts`
- Create: `lib/mdx.ts`
- Create: `content/writing/.gitkeep`
- Create: `content/lab/.gitkeep`
- Create: `content/work/.gitkeep`

- [ ] **Step 1: Configure MDX in `next.config.ts`**

Replace `next.config.ts`:

```ts
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
```

- [ ] **Step 2: Write `lib/mdx.ts` for content enumeration**

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  slug: string;
  artifact?: string; // URL to PR, repo, or demo — required for /writing
};

type ContentKind = "writing" | "lab" | "work";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const PRIVATE_CONTENT_ROOT = path.join(process.cwd(), "content-private");

export function listPosts(kind: ContentKind): PostFrontmatter[] {
  const publicDir = path.join(CONTENT_ROOT, kind);
  const privateDir = path.join(PRIVATE_CONTENT_ROOT, kind);

  const files: { dir: string; name: string }[] = [];
  for (const dir of [publicDir, privateDir]) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith(".mdx")) files.push({ dir, name });
    }
  }

  return files
    .map(({ dir, name }) => {
      const raw = fs.readFileSync(path.join(dir, name), "utf8");
      const { data } = matter(raw);
      const slug = name.replace(/\.mdx$/, "");
      return { ...(data as Omit<PostFrontmatter, "slug">), slug };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSlugs(kind: ContentKind): string[] {
  return listPosts(kind).map((p) => p.slug);
}
```

- [ ] **Step 3: Create empty content directories**

```bash
mkdir -p content/writing content/lab content/work
touch content/writing/.gitkeep content/lab/.gitkeep content/work/.gitkeep
```

- [ ] **Step 4: Build and verify**

```bash
npm run build
```

Expected: build succeeds; `pageExtensions` accepts `.mdx`.

- [ ] **Step 5: Commit**

```bash
git add next.config.ts lib/mdx.ts content/
git commit -m "feat: mdx config + content enumeration helpers"
```

---

## Task 12: /writing/process essay

**Files:**
- Create: `content/writing/process.mdx`
- Create: `app/writing/page.tsx`
- Create: `app/writing/[slug]/page.tsx`

- [ ] **Step 1: Write `content/writing/process.mdx`**

```mdx
---
title: "How I work: LLM-first methodology + quality gates"
description: "Hypothesis to validated prototype in under 10 minutes, paired with the quality gates that keep velocity honest."
date: "2026-05-13"
artifact: "https://github.com/jaymoore/jay-moore-design/pull/1"
---

I ship product-quality React components in commits, not in keynotes. Here's the loop.

## The loop

1. **Hypothesis** in Claude. One sentence: "Users want to see why the AI suggested X, not just what."
2. **First prototype** in Cursor + Claude Code. Inline. No new repo. The screen renders within a few minutes.
3. **Quality gates** before the next commit lands:
   - **Lint** — opinionated, set once, never bypassed.
   - **Typecheck** — strict TypeScript, no `any` without a comment.
   - **Lighthouse** — Performance ≥ 90 on the page being touched.
   - **axe-core** — zero serious or critical violations.
   - **Reduced motion** — design works without animation.
4. **Commit small.** One concept per commit. The PR for the trust surface demo on this site has 12 of them. Each one passed all four gates before the next started.
5. **Review** the diff one more time. If a future me wouldn't understand the commit message in 6 months, rewrite it.

That's it. The "<10 minutes" claim is the wrapper time around step 2 — between hypothesis and a working sketch — not the time to a shipped feature. Quality gates take longer than the build. That's the point.

## The trust-surface PR, commit by commit

If you want the receipts, the trust surface on the home page got built like this:

1. `feat: scaffold trust-surface pattern with sample data`
2. `feat: confidence score + evidence drawer`
3. `feat: three-way decision (Accept / Reject / Override)`
4. `fix: aria-live on decision status for SR users`
5. `fix: keyboard focus order on evidence toggle`
6. `perf: lazy load evidence list until expanded`
7. `feat: reduced-motion fallback for evidence height transition`
8. `chore: extract source snippet for view-source toggle`
9. `docs: README with tradeoffs, perf budget, known limitations`
10. `test: visual a11y pass with axe DevTools`
11. `fix: contrast on confidence badge in dark mode`
12. `docs: link the PR from method-in-practice block`

Twelve commits across two days. Zero failed CI checks. The whole thing is in the public repo at `lib/patterns/trust-surface/`.

## What it's NOT

It's not "I asked Claude and pasted the result." It's not "the model designed it." The model is fast at first drafts and at typing. Decisions about confidence display, override-vs-edit, evidence ordering, keyboard semantics — those are mine, and the quality gates are how I keep them honest.

For the part where this falls apart, see [What didn't work →](/writing/what-didnt-work).
```

- [ ] **Step 2: Write `app/writing/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Metadata } from "next";
import { listPosts } from "@/lib/mdx";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return listPosts("writing").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = listPosts("writing").find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function WritingPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", "writing", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) notFound();
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);

  const { default: Content } = await import(`@/content/writing/${slug}.mdx`);

  return (
    <article className="mx-auto max-w-[720px] px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
      <header className="mb-12">
        <p className="font-mono text-xs text-[var(--color-text-muted)]">
          <time dateTime={data.date}>{data.date}</time> · writing
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-medium tracking-tight leading-tight">
          {data.title}
        </h1>
        {data.artifact && (
          <p className="mt-3 text-sm">
            Concrete artifact:{" "}
            <a
              href={data.artifact}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]"
            >
              {data.artifact.replace(/^https?:\/\//, "")}
            </a>
          </p>
        )}
      </header>
      <div className="prose-jay">
        <Content />
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Write `app/writing/page.tsx`**

```tsx
import Link from "next/link";
import type { Metadata } from "next";
import { listPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Writing",
  description: "Short essays on AI/UX patterns, LLM-first methodology, and what doesn't work.",
};

export default function WritingIndexPage() {
  const posts = listPosts("writing");
  return (
    <section className="mx-auto max-w-[720px] px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
      <h1 className="text-3xl sm:text-4xl font-medium tracking-tight">Writing</h1>
      <ul className="mt-12 space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/writing/${post.slug}`} className="group block">
              <p className="font-mono text-xs text-[var(--color-text-muted)]">
                <time dateTime={post.date}>{post.date}</time>
              </p>
              <h2 className="mt-1 text-xl font-medium tracking-tight group-hover:underline underline-offset-4 decoration-[var(--color-border-strong)]">
                {post.title}
              </h2>
              <p className="mt-2 text-[var(--color-text-muted)]">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Add prose styles to `app/globals.css`**

Append to `app/globals.css`:

```css
@layer components {
  .prose-jay {
    max-width: 65ch;
  }
  .prose-jay h2 {
    font-size: var(--text-xl);
    font-weight: 500;
    line-height: 1.2;
    margin-top: 3rem;
    margin-bottom: 1rem;
  }
  .prose-jay h3 {
    font-size: var(--text-lg);
    font-weight: 500;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }
  .prose-jay p {
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 1.7;
  }
  .prose-jay ol,
  .prose-jay ul {
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    line-height: 1.7;
  }
  .prose-jay ol { list-style-type: decimal; }
  .prose-jay ul { list-style-type: disc; }
  .prose-jay li { margin-top: 0.25rem; margin-bottom: 0.25rem; }
  .prose-jay code {
    font-family: var(--font-mono);
    font-size: 0.875em;
    background-color: var(--color-surface-2);
    padding: 0.125rem 0.375rem;
    border-radius: var(--radius-sm);
  }
  .prose-jay strong { font-weight: 600; color: var(--color-text); }
  .prose-jay a {
    text-decoration: underline;
    text-decoration-color: var(--color-border-strong);
    text-underline-offset: 4px;
  }
  .prose-jay a:hover {
    text-decoration-color: var(--color-text);
  }
}
```

- [ ] **Step 5: Verify**

```bash
npm run dev
```

- Navigate to `/writing` — see the process essay listed
- Navigate to `/writing/process` — see the full essay rendered
- "Concrete artifact" link visible
- "What didn't work →" link at bottom (will 404 until next task)

- [ ] **Step 6: Commit**

```bash
git add content/writing/process.mdx app/writing/ app/globals.css
git commit -m "feat: /writing infra + process essay"
```

---

## Task 13: /writing/what-didnt-work essay

**Files:**
- Create: `content/writing/what-didnt-work.mdx`

- [ ] **Step 1: Write `content/writing/what-didnt-work.mdx`**

```mdx
---
title: "What didn't work: failure modes in LLM-first design"
description: "Hallucinated tool calls, latency cliffs, prompt drift, trust collapse — the four ways my own LLM-first methodology has fallen over."
date: "2026-05-13"
artifact: "https://github.com/jaymoore/jay-moore-design/tree/main/lib/patterns/trust-surface"
---

The methodology I wrote about in [How I work](/writing/process) isn't a recipe — it's a stack of techniques, each of which fails in a different way. Here are the four failure modes I run into most.

## 1. Hallucinated tool calls

Symptom: the model invokes a tool that doesn't exist, or invokes a real tool with arguments that look right but reference nothing real. The UI shows progress. Nothing actually happened.

Where it bit me: building the SPM lifecycle engine, an agent step "called" a CRM enrichment tool, returned plausible-looking JSON, and the next step happily routed the lead. The data was invented.

Fix: every tool call now goes through a thin adapter that validates the response shape AND verifies the side effect. No invented IDs survive past the adapter. The trust surface in this portfolio is a small version of the same principle — `decision` state is the recordable side effect; if it's not present, the loop didn't happen.

## 2. Latency cliffs

Symptom: median request is fast (~2 s), but the 95th percentile is 12+ seconds. Users sit on a spinner long enough to assume the page broke.

Where it bit me: a multi-agent pipeline that ran fine on small inputs but collapsed on the longest tail. The "agent thinking" UI was a single spinner. I had to ship four things to fix it:

1. Streaming the agent's first token to the screen as soon as it arrived
2. A latency budget per step, with explicit timeout + retry
3. A cancel button that actually cancelled (not just dimmed)
4. Honest progress: "step 2 of 5" instead of "Working..."

The streaming UI demo on this site is the small version. The cancel button isn't decorative.

## 3. Prompt drift

Symptom: the same prompt template, run a week apart, produces meaningfully different outputs. Quality grades change. Reviewers grade it as "looks fine" the first week and "off-brand" the next.

Where it bit me: an enrichment prompt that worked on examples in week 1 stopped working on a new client's data in week 3. The prompt was fine; the input distribution had shifted. I'd been treating the prompt as a constant.

Fix: I treat prompts like code now. Versioned in the repo. Evaluated against a regression set on every change. Every output that gets human override flows back into the regression set.

## 4. Trust collapse from one wrong output

Symptom: one obviously-wrong output destroys the user's trust in everything else the system has done correctly. Recovery is hard. People remember the wrong thing.

Where it bit me: an early version of the Dispatch dashboard auto-approved a routing decision in the bottom 10% of confidence. The user saw it. The user told their team. The team disabled the auto-approve for everything.

Fix: confidence and evidence are now first-class. Every decision shows them. Override beats obedience. The trust surface pattern on this site is the smallest possible version — Accept / Reject / Override, evidence drawer, confidence as percentage.

## What this means for the methodology

LLM-first is fast at first drafts and at typing. It is *bad* at reliability without quality gates. The four fixes above — adapters, latency budgets, prompt versioning, override-first UI — are the cost of admission. Without them, "shipped in 10 minutes" is just an unverified claim.

If you read [How I work](/writing/process) and thought "this is too fast to be real," you were right. The fast part is the prototype. The honest part is everything after.
```

- [ ] **Step 2: Verify**

Navigate to `/writing/what-didnt-work`. Verify the essay renders, headings spaced correctly, "How I work" cross-link works.

- [ ] **Step 3: Commit**

```bash
git add content/writing/what-didnt-work.mdx
git commit -m "feat: /writing/what-didnt-work failure-mode essay"
```

---

## Task 14: /lab seed entry + index

**Files:**
- Create: `content/lab/token-streaming-citations.mdx`
- Create: `app/lab/page.tsx`
- Create: `app/lab/[slug]/page.tsx`

- [ ] **Step 1: Write `content/lab/token-streaming-citations.mdx`**

```mdx
---
title: "Token streaming with inline citations"
description: "Quick experiment in showing citation markers as the stream arrives, without holding the message until all citations resolve."
date: "2026-05-12"
---

Spent an evening on this: when the model streams a response that includes citations, do you wait for the whole message to finish before resolving citations, or do you show them inline as they arrive?

Conclusion: show them inline. Use a footnote marker `[1]` as soon as the token shows up, even if the source hasn't resolved yet. Hover or focus shows "Loading source..." until it does.

This trades a small reliability cost (occasional source-fail visible) for a big UX win (users can pre-decide which citations they want to chase before the message ends).

I didn't ship this into a product. It's a 90-minute experiment that informed a design decision elsewhere.

The next step would be a keyboard pattern for citation navigation — `[` and `]` to step between markers, `Enter` to open. Worth exploring once I have a real consumer.
```

- [ ] **Step 2: Write `app/lab/page.tsx`**

```tsx
import Link from "next/link";
import type { Metadata } from "next";
import { listPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Lab",
  description: "Small experiments, timestamped. Things I tried for an hour.",
};

export default function LabIndexPage() {
  const posts = listPosts("lab");
  return (
    <section className="mx-auto max-w-[720px] px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
      <h1 className="text-3xl sm:text-4xl font-medium tracking-tight">Lab</h1>
      <p className="mt-2 text-base text-[var(--color-text-muted)]">
        Small experiments, timestamped. Things I tried for an hour.
      </p>
      <ul className="mt-12 space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/lab/${post.slug}`} className="group block">
              <p className="font-mono text-xs text-[var(--color-text-muted)]">
                <time dateTime={post.date}>{post.date}</time>
              </p>
              <h2 className="mt-1 text-xl font-medium tracking-tight group-hover:underline underline-offset-4 decoration-[var(--color-border-strong)]">
                {post.title}
              </h2>
              <p className="mt-2 text-[var(--color-text-muted)]">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 3: Write `app/lab/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Metadata } from "next";
import { listPosts } from "@/lib/mdx";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return listPosts("lab").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = listPosts("lab").find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function LabPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", "lab", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) notFound();
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);

  const { default: Content } = await import(`@/content/lab/${slug}.mdx`);

  return (
    <article className="mx-auto max-w-[720px] px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
      <header className="mb-12">
        <p className="font-mono text-xs text-[var(--color-text-muted)]">
          <time dateTime={data.date}>{data.date}</time> · lab
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-medium tracking-tight leading-tight">
          {data.title}
        </h1>
      </header>
      <div className="prose-jay">
        <Content />
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Navigate to `/lab`. See one entry. Click → see full lab post render.

- [ ] **Step 5: Commit**

```bash
git add content/lab/ app/lab/
git commit -m "feat: /lab index + slug page + seed entry"
```

---

## Task 15: /work/spm-lifecycle case study page

**Files:**
- Create: `content/work/spm-lifecycle.mdx`
- Create: `app/work/spm-lifecycle/page.tsx`

- [ ] **Step 1: Write `content/work/spm-lifecycle.mdx`**

Jay should write the body content; the plan supplies the structure. The frontmatter and skeleton:

```mdx
---
title: "SPM lifecycle automation engine"
description: "AI-native lifecycle + decision support engine. TTF-touch from 30 min to 60 s. Reply rate 4.6–4.9% vs industry baseline ~1%."
date: "2026-05-13"
hero_metric_primary: "TTF-touch: 30 min → 60 s"
hero_metric_secondary: "Reply rate: 4.6–4.9% (industry baseline ~1%)"
hero_metric_tertiary: "30+ qualified leads per campaign per client"
---

## Problem

Agency-side lifecycle: time-to-first-touch averaging 30+ minutes after lead capture; reply rates around 1%; zero-shot generation drifting off-brand on every other send.

## Hypothesis

A multi-agent pipeline with deterministic scoring, LLM enrichment, and human override could compress time-to-first-touch by an order of magnitude AND lift reply rates well above the industry baseline.

## Architecture

The flow: capture → enrich → score → route → send → measure. Each step is its own agent with a defined interface, validated input/output, and an override surface.

## Decisions that mattered

### Decision support over automation

Sends never auto-fire. Each candidate send goes through Accept / Reject / Consider with confidence + evidence visible. Operators decide. The system learns from their decisions.

### Confidence + evidence first-class

Every decision surface shows the confidence score AND the evidence behind it. Operators can override the recommendation; their override is captured as training data.

### Override stored as a side effect

Every override is a recordable event with timestamp, operator, and the difference between recommended and chosen. This becomes the regression set for prompt evaluation.

### Latency budget: 60 s end-to-end

The full pipeline — capture to decision-ready send — runs within 60 seconds. Each step has its own budget. Steps that exceed budget escalate to a queue with explicit user signaling.

## Hero metrics

- **TTF-touch:** 30 minutes → 60 seconds
- **Reply rate:** 4.6–4.9% (industry baseline ~1%)
- **30+ qualified leads/campaign/client**

## Tradeoffs and known limitations

- Pipeline depends on third-party model availability. If the LLM provider is down, decisions queue rather than fail.
- Calibration of confidence scores is an ongoing process; current scores are decision-weighted rather than probability-weighted.
- The override-as-training-data loop assumes operator override quality. If operators rubber-stamp, the system has no error signal.

## What's next

- Multi-language enrichment (Spanish, German pipelines on the roadmap)
- Operator coaching surface — show operators when the system disagrees with itself across step boundaries
- Public eval set for prompt regressions
```

- [ ] **Step 2: Write `app/work/spm-lifecycle/page.tsx`**

```tsx
import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export async function generateMetadata(): Promise<Metadata> {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "content", "work", "spm-lifecycle.mdx"),
    "utf8",
  );
  const { data } = matter(raw);
  return { title: data.title, description: data.description };
}

export default async function SpmLifecyclePage() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "content", "work", "spm-lifecycle.mdx"),
    "utf8",
  );
  const { data } = matter(raw);
  const { default: Content } = await import("@/content/work/spm-lifecycle.mdx");

  return (
    <article className="mx-auto max-w-[720px] px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
      <header className="mb-12">
        <p className="font-mono text-xs text-[var(--color-text-muted)]">case study</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-medium tracking-tight leading-tight">
          {data.title}
        </h1>
        <p className="mt-4 text-lg text-[var(--color-text-muted)]">{data.description}</p>

        <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-y border-[var(--color-border)] py-6">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-mono">Primary</dt>
            <dd className="mt-1 text-sm font-medium">{data.hero_metric_primary}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-mono">Secondary</dt>
            <dd className="mt-1 text-sm font-medium">{data.hero_metric_secondary}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-mono">Per client</dt>
            <dd className="mt-1 text-sm font-medium">{data.hero_metric_tertiary}</dd>
          </div>
        </dl>
      </header>

      <div className="prose-jay">
        <Content />
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Verify**

Navigate to `/work/spm-lifecycle`. Verify metrics grid renders, MDX body renders.

- [ ] **Step 4: Commit**

```bash
git add content/work/spm-lifecycle.mdx app/work/spm-lifecycle/
git commit -m "feat: /work/spm-lifecycle primary case study"
```

---

## Task 16: /work/fiserv-gift-card-portal case study page

**Files:**
- Create: `content-private/work/fiserv-gift-card-portal.mdx` (gitignored)
- Create: `app/work/fiserv-gift-card-portal/page.tsx`

- [ ] **Step 1: Write `content-private/work/fiserv-gift-card-portal.mdx`**

Jay writes the body. Structure + frontmatter:

```mdx
---
title: "Redesigning Fiserv's Gift Card Portal"
description: "Multi-persona B2B SaaS. Lead Product Designer, 6 months, 3 user types. −35% support tickets, +40% promotion setup speed, +20 NPS points."
date: "2024-04-30"
role: "Lead Product Designer"
duration: "Nov 2023 – Apr 2024 (6 months)"
hero_metric_primary: "−35% support tickets"
hero_metric_secondary: "+40% promotion setup speed"
hero_metric_tertiary: "+20 NPS points from merchants"
cross_domain_hook: "This case study isn't AI-related. Multi-persona B2B SaaS — senior product design judgment lives independent of AI methodology."
nda_protocol: "Shareable: outcomes, role, scope, persona structure, public metrics. Under NDA: internal data, raw research, roadmap. Reach out for additional context."
---

## Context

Lead Product Designer for the end-to-end redesign of Fiserv's gift card management portal. Three user types served: business owners, marketing managers, support agents. Six months of discovery, UX strategy, prototyping, and cross-team collaboration with engineering and data.

## Problem

The existing portal was hard to use, lacked customization, and had minimal analytics. The pain was multi-persona: business owners couldn't run promotions without engineering help; marketing managers couldn't see real-time campaign performance; support agents drowned in repeat inquiries because answers were buried.

## Approach: three role-specific dashboards

The single biggest decision was **not** building a universal interface. Each persona got a dashboard shaped to their job.

### Business Owner Dashboard

Schedule promotions, customize gift card templates, track sales in real time. No engineering dependency. Visual designer for campaigns.

### Marketing Dashboard

Real-time analytics with segmentation. Decision-ready output, not raw reports. Campaign A/B comparison built in.

### Support Dashboard

Quick-action panel with embedded knowledge content. Common issues resolved one-click. Knowledge base surfaces in context, not in a separate tab.

## Hero metrics

- **−35% support ticket volume**
- **+40% seasonal promotion setup speed**
- **+20 NPS points from merchants**

## What I'd do differently

The persona split was right; the engineering scope was ambitious for 6 months. If I were doing it again, I'd ship the Support Dashboard first (lowest risk, highest support-team value) before opening up the Business Owner customization toolkit.

## Closing

The methodology here was hands-on Figma + spec — research-driven, iterative, slow by AI-native standards. For my current LLM-first method on a multi-agent system, see the [SPM lifecycle engine →](/work/spm-lifecycle).
```

- [ ] **Step 2: Write `app/work/fiserv-gift-card-portal/page.tsx`**

```tsx
import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

const CONTENT_PATH = path.join(
  process.cwd(),
  "content-private",
  "work",
  "fiserv-gift-card-portal.mdx",
);

export async function generateMetadata(): Promise<Metadata> {
  if (!fs.existsSync(CONTENT_PATH)) return { title: "Case study" };
  const raw = fs.readFileSync(CONTENT_PATH, "utf8");
  const { data } = matter(raw);
  return { title: data.title, description: data.description };
}

export default async function FiservPage() {
  if (!fs.existsSync(CONTENT_PATH)) notFound();
  const raw = fs.readFileSync(CONTENT_PATH, "utf8");
  const { data } = matter(raw);
  const { default: Content } = await import(
    "@/content-private/work/fiserv-gift-card-portal.mdx"
  );

  return (
    <article className="mx-auto max-w-[720px] px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
      <header className="mb-12">
        <p className="font-mono text-xs text-[var(--color-text-muted)]">
          case study · {data.role} · {data.duration}
        </p>

        {/* Cross-domain hook (Round 3 mitigation for narrative overfitting) */}
        <div className="mt-4 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] p-4">
          <p className="text-sm leading-relaxed">{data.cross_domain_hook}</p>
        </div>

        <h1 className="mt-6 text-3xl sm:text-4xl font-medium tracking-tight leading-tight">
          {data.title}
        </h1>
        <p className="mt-4 text-lg text-[var(--color-text-muted)]">{data.description}</p>

        <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-y border-[var(--color-border)] py-6">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-mono">Support</dt>
            <dd className="mt-1 text-sm font-medium">{data.hero_metric_primary}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-mono">Promotions</dt>
            <dd className="mt-1 text-sm font-medium">{data.hero_metric_secondary}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-mono">Merchant NPS</dt>
            <dd className="mt-1 text-sm font-medium">{data.hero_metric_tertiary}</dd>
          </div>
        </dl>
      </header>

      <div className="prose-jay">
        <Content />
      </div>

      <footer className="mt-16 pt-8 border-t border-[var(--color-border)]">
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          <strong className="text-[var(--color-text)]">NDA protocol:</strong> {data.nda_protocol}
        </p>
      </footer>
    </article>
  );
}
```

- [ ] **Step 3: Update `next.config.ts` to allow imports from `content-private/`**

Modify `next.config.ts` (if needed for module resolution):

```ts
import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import path from "node:path";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@/content-private": path.resolve(process.cwd(), "content-private"),
    };
    return config;
  },
};

const withMDX = createMDX();
export default withMDX(nextConfig);
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Navigate to `/work/fiserv-gift-card-portal`. Verify:
- Cross-domain hook visible in a callout box ABOVE the title
- Metrics grid renders with 3 metrics
- NDA protocol line in a footer at the bottom

- [ ] **Step 5: Commit (only the page wrapper; private content stays out)**

```bash
git add app/work/fiserv-gift-card-portal/ next.config.ts
git commit -m "feat: /work/fiserv-gift-card-portal page wrapper (private content gitignored)"
```

Note: `content-private/` is gitignored. Jay handles the markdown body locally and on the deployment runner (e.g., via a one-time scp, Vercel env-loaded private gist fetch, or private submodule). Document this in Task 21 (README).

---

## Task 17: /audits public folder + initial seed

**Files:**
- Create: `audits/README.md`
- Create: `audits/2026-05-13.md` (placeholder; replaced by first real run)
- Create: `app/audits/page.tsx`

- [ ] **Step 1: Create `audits/README.md`**

```markdown
# Public audits

Weekly Lighthouse + axe-core reports for jaymoore.net. Auto-committed by `.github/workflows/audit.yml`.

## Last 4 weeks (rolling)

See individual audit files in this folder, dated `YYYY-MM-DD.md`.

## What's checked

| Audit | Tool | Pages |
|---|---|---|
| Performance | Lighthouse CI | /, /about, /work/spm-lifecycle, /work/fiserv-gift-card-portal |
| Accessibility | Lighthouse + axe-core | same |
| Best Practices | Lighthouse | same |
| SEO | Lighthouse | same |

## Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | ≥ 90 |
| axe-core serious/critical violations | 0 |
| LCP | < 1.5 s |
| CLS | < 0.1 |
| INP | < 250 ms |

## Failure protocol

If a weekly audit shows a regression, fix it before the next deploy. No exceptions.
```

- [ ] **Step 2: Create placeholder `audits/2026-05-13.md`**

```markdown
# Audit — 2026-05-13

_First placeholder. Replaced by automatic run after deploy._

| Page | Perf | A11y | BP | SEO | LCP | CLS | INP |
|---|---|---|---|---|---|---|---|
| / | — | — | — | — | — | — | — |
| /about | — | — | — | — | — | — | — |

| Page | axe serious | axe critical |
|---|---|---|
| / | — | — |
```

- [ ] **Step 3: Write `app/audits/page.tsx`**

```tsx
import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Audits",
  description: "Weekly Lighthouse + axe reports for jaymoore.net.",
};

export default function AuditsPage() {
  const auditsDir = path.join(process.cwd(), "audits");
  const files = fs
    .readdirSync(auditsDir)
    .filter((f) => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
    .sort()
    .reverse();

  return (
    <section className="mx-auto max-w-[720px] px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
      <h1 className="text-3xl sm:text-4xl font-medium tracking-tight">Audits</h1>
      <p className="mt-2 text-base text-[var(--color-text-muted)]">
        Weekly Lighthouse + axe reports. Auto-committed every Sunday.
      </p>
      <ul className="mt-12 space-y-2 font-mono text-sm">
        {files.map((file) => (
          <li key={file}>
            <Link
              href={`https://github.com/jaymoore/jay-moore-design/blob/main/audits/${file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-[var(--color-border-strong)] hover:decoration-[var(--color-text)]"
            >
              {file.replace(/\.md$/, "")}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add audits/ app/audits/
git commit -m "feat: /audits public folder + page"
```

---

## Task 18: GitHub Action — lint + typecheck CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  lint-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
```

- [ ] **Step 2: Verify CI runs on a PR**

Push a trivial PR (e.g., touch the README) and confirm CI runs and passes.

```bash
git add .github/workflows/ci.yml
git commit -m "ci: lint + typecheck on PR"
git push
```

Expected: green check on the commit on github.

---

## Task 19: GitHub Action — weekly Lighthouse + axe audit

**Files:**
- Create: `.github/workflows/audit.yml`
- Create: `scripts/audit.mjs`

- [ ] **Step 1: Write `scripts/audit.mjs`**

```javascript
#!/usr/bin/env node
// Run Lighthouse + axe-core against a deployed Vercel preview/prod URL,
// write a markdown report to audits/YYYY-MM-DD.md.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.AUDIT_BASE_URL ?? "https://jaymoore.net";
const PAGES = ["/", "/about", "/work/spm-lifecycle", "/work/fiserv-gift-card-portal"];

const today = new Date().toISOString().slice(0, 10);
const outPath = path.join("audits", `${today}.md`);

const results = [];

for (const page of PAGES) {
  const url = `${BASE_URL}${page}`;
  console.log(`Auditing ${url}…`);
  const tmp = `/tmp/lh-${today}-${page.replace(/\//g, "_")}.json`;
  const lh = spawnSync(
    "npx",
    [
      "--yes",
      "lighthouse",
      url,
      "--output=json",
      `--output-path=${tmp}`,
      "--chrome-flags=--headless --no-sandbox",
      "--quiet",
    ],
    { stdio: "inherit" },
  );
  if (lh.status !== 0) {
    console.error(`Lighthouse failed for ${url}`);
    continue;
  }
  const report = JSON.parse(fs.readFileSync(tmp, "utf8"));
  const c = report.categories;
  const audits = report.audits;
  results.push({
    page,
    perf: Math.round((c.performance?.score ?? 0) * 100),
    a11y: Math.round((c.accessibility?.score ?? 0) * 100),
    bp: Math.round((c["best-practices"]?.score ?? 0) * 100),
    seo: Math.round((c.seo?.score ?? 0) * 100),
    lcp: audits["largest-contentful-paint"]?.numericValue ?? 0,
    cls: audits["cumulative-layout-shift"]?.numericValue ?? 0,
    inp: audits["interaction-to-next-paint"]?.numericValue ?? 0,
  });
}

const header = `# Audit — ${today}\n\n| Page | Perf | A11y | BP | SEO | LCP | CLS | INP |\n|---|---|---|---|---|---|---|---|\n`;
const rows = results
  .map(
    (r) =>
      `| ${r.page} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${Math.round(r.lcp)} ms | ${r.cls.toFixed(3)} | ${Math.round(r.inp)} ms |`,
  )
  .join("\n");

fs.writeFileSync(outPath, header + rows + "\n");
console.log(`Wrote ${outPath}`);
```

- [ ] **Step 2: Write `.github/workflows/audit.yml`**

```yaml
name: Weekly Audit

on:
  schedule:
    - cron: "0 2 * * 0" # Sunday 02:00 UTC
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Run audit
        env:
          AUDIT_BASE_URL: https://jaymoore.net
        run: node scripts/audit.mjs
      - name: Commit audit report
        run: |
          git config user.name "audit-bot"
          git config user.email "audit-bot@users.noreply.github.com"
          git add audits/
          if ! git diff --cached --quiet; then
            git commit -m "chore(audit): weekly Lighthouse report"
            git push
          fi
```

- [ ] **Step 3: Trigger the audit manually once**

After the workflow is on `main`, run it once manually via the github UI (Actions tab → Weekly Audit → Run workflow).

Expected: a fresh `audits/YYYY-MM-DD.md` commit lands on `main`.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/audit.yml scripts/audit.mjs
git commit -m "ci: weekly Lighthouse audit committing to /audits/"
```

---

## Task 20: Sitemap + robots + favicon + 404 page

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Modify: `public/favicon.ico` (placeholder)
- Create: `app/not-found.tsx`

- [ ] **Step 1: Write `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://jaymoore.net";
  const today = new Date().toISOString().slice(0, 10);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: today, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/about`, lastModified: today, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/work/spm-lifecycle`, lastModified: today, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/work/fiserv-gift-card-portal`, lastModified: today, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/writing`, lastModified: today, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/lab`, lastModified: today, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/audits`, lastModified: today, changeFrequency: "weekly", priority: 0.3 },
  ];

  const writing = listPosts("writing").map((p) => ({
    url: `${base}/writing/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  const lab = listPosts("lab").map((p) => ({
    url: `${base}/lab/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...writing, ...lab];
}
```

- [ ] **Step 2: Write `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://jaymoore.net/sitemap.xml",
  };
}
```

- [ ] **Step 3: Write `app/not-found.tsx`**

```tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[720px] px-4 sm:px-6 pt-24 pb-24 text-center">
      <h1 className="text-4xl font-medium tracking-tight">Not here.</h1>
      <p className="mt-4 text-base text-[var(--color-text-muted)]">
        Try{" "}
        <Link href="/" className="underline underline-offset-4">
          home
        </Link>
        ,{" "}
        <Link href="/work/spm-lifecycle" className="underline underline-offset-4">
          work
        </Link>
        , or{" "}
        <Link href="/about" className="underline underline-offset-4">
          about
        </Link>
        .
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Replace placeholder favicon**

Replace `public/favicon.ico` with one designed in Phase 0 (or a minimal "J" mark). If Phase 0 hasn't produced one, a monospace lowercase `j` on a transparent background works as v1.

- [ ] **Step 5: Verify**

Navigate to `http://localhost:3000/sitemap.xml` and `http://localhost:3000/robots.txt`. Both should return valid responses. Navigate to a non-existent path; the 404 page should render.

- [ ] **Step 6: Commit**

```bash
git add app/sitemap.ts app/robots.ts app/not-found.tsx public/favicon.ico
git commit -m "feat: sitemap + robots + 404 + favicon"
```

---

## Task 21: README + docs for repo

**Files:**
- Replace: `README.md`

- [ ] **Step 1: Write `README.md`**

````markdown
# jaymoore.net

Jay Moore's portfolio. Design Engineer for AI-native workflows.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4 (`@theme` in `app/globals.css`)
- MDX content (`@next/mdx`, frontmatter via `gray-matter`)
- motion.dev for animations (spring physics, transform-only)
- shadcn/ui base + custom layer (see split below)
- next/font: Geist Sans + Geist Mono
- lucide-react icons (1.5px stroke)
- Hosted on Vercel; analytics via Vercel Analytics

## Public artifacts

| What | Where |
|---|---|
| Site source | this repo |
| Pattern primitives (Trust Surface, Streaming UI) | `lib/patterns/*/` |
| Writing | `content/writing/*.mdx` |
| Lab experiments | `content/lab/*.mdx` |
| SPM lifecycle case study | `content/work/spm-lifecycle.mdx` |
| Audit reports (weekly) | `audits/*.md` |

## Under NDA / private

| What | Where | How it ships |
|---|---|---|
| Fiserv Gift Card Portal case study | `content-private/work/fiserv-gift-card-portal.mdx` | Gitignored; provisioned at deploy via private mechanism (see below) |

Private content provisioning options (pick one at deploy time):

1. Private git submodule mounting at `content-private/`
2. Vercel env-loaded fetch from a private gist during build
3. Manual `scp` for solo deploys

The current production strategy is documented in `docs/private-content-deploy.md` (not in this public repo).

## shadcn vs custom split

| Custom-built (from scratch) | shadcn-base (used as-is) |
|---|---|
| Type system + scale | Form inputs |
| Motion primitives | Dropdown menu |
| Demo container (`components/demo-card.tsx`) | Dialog / Modal |
| Hero composition (`components/hero.tsx`) | Command palette |
| Dark mode token system | Tooltip |
| Pattern card layout | Tabs |
| Method-in-practice block (`components/method-in-practice.tsx`) | Toast / Sonner |

## Audit cadence

A GitHub Action runs every Sunday at 02:00 UTC. It runs Lighthouse on the home + `/about` + `/work/*` routes and commits a markdown report to `/audits/YYYY-MM-DD.md`. See `/audits/README.md` for targets and failure protocol.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Dev server is Turbopack.

## Build

```bash
npm run build
npm start
```

## Conventions

- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `ci:`)
- Branch protection on `main`; PRs only
- CI on PR: lint + typecheck
- Conventional commits enforced by hand (no commitlint at v1)

## License

MIT — see `LICENSE`.
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README with public/private split + shadcn-vs-custom + audit cadence"
```

---

## Task 22: Accessibility QA pass

**Files:** (no new files; fixes only)

- [ ] **Step 1: Run axe DevTools on every route**

Open each route in Chrome with axe DevTools extension installed. Run the analyzer on:

- `/`
- `/about`
- `/work/spm-lifecycle`
- `/work/fiserv-gift-card-portal`
- `/writing`
- `/writing/process`
- `/writing/what-didnt-work`
- `/lab`
- `/lab/token-streaming-citations`
- `/audits`

Expected: zero serious or critical violations on each page.

- [ ] **Step 2: Keyboard navigation pass**

For each route, Tab through every interactive element. Confirm:

- Focus rings always visible
- Tab order is logical (top → bottom, left → right)
- Skip-to-content link works (Tab once from top of page; press Enter; main content gains focus)
- Mobile menu open/close reachable by Tab
- View source toggle reachable + activatable by Enter
- Trust surface buttons reachable, decision state announced via `aria-live`
- Streaming UI cancel button reachable mid-stream

- [ ] **Step 3: Screen reader pass**

Use VoiceOver (macOS) or NVDA (Windows) to read the home page top to bottom. Confirm:

- Pivot statement read
- H1 read with heading semantics
- Method-in-practice block has heading + image alt
- Demo 1 announces pattern name + confidence percentage + decision changes
- Demo 2 announces stream state changes via `aria-live` regions

- [ ] **Step 4: Color contrast pass**

Use Chrome DevTools "Inspect element" → Accessibility tab → Contrast on:

- Body text on bg (light + dark)
- Muted text on bg (light + dark)
- Subtle text on bg (light + dark)
- Accent color on bg (light + dark)
- Border-strong on bg (light + dark)

Expected: body text ≥ 7:1; UI text ≥ 4.5:1; accent on bg ≥ 3:1.

- [ ] **Step 5: Fix any issues found, commit per fix**

For each issue found in steps 1–4, fix and commit:

```bash
git add <files>
git commit -m "fix(a11y): <specific issue>"
```

---

## Task 23: Performance QA pass

**Files:** (no new files; fixes only)

- [ ] **Step 1: Build production**

```bash
npm run build
npm start
```

Open `http://localhost:3000` in an incognito Chrome window.

- [ ] **Step 2: Lighthouse on each route**

For `/`, `/about`, `/work/spm-lifecycle`, `/work/fiserv-gift-card-portal`, `/writing`, `/writing/process`, `/lab`:

1. Open DevTools → Lighthouse tab
2. Select "Performance", "Accessibility", "Best Practices", "SEO"
3. Mobile + simulated throttling
4. Run

Expected for each:
- Performance ≥ 90
- Accessibility = 100
- Best Practices = 100
- SEO ≥ 90

- [ ] **Step 3: Bundle analyzer pass**

Install:

```bash
npm install -D @next/bundle-analyzer
```

Modify `next.config.ts` to wrap with the analyzer when `ANALYZE=true`:

```ts
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// ... existing config above ...

export default withBundleAnalyzer(withMDX(nextConfig));
```

Run:

```bash
ANALYZE=true npm run build
```

Open the generated `.next/analyze/*.html` files. Confirm:

- Initial JS on `/` is < 150 kb gz
- No surprise dependency adding > 20 kb gz
- `motion/react` only loaded on routes that use it

- [ ] **Step 4: Image audit**

Confirm every `<img>` and `<Image>` has:
- Explicit `width` + `height`
- `alt` text (or `aria-hidden` if decorative)
- AVIF/WebP format
- Reasonable file size (< 250 kb for hero images)

- [ ] **Step 5: Fix any regressions, commit per fix**

```bash
git add <files>
git commit -m "perf: <specific fix>"
```

---

## Task 24: Mobile + cross-browser QA

**Files:** (no new files; fixes only)

- [ ] **Step 1: Real device test on iPhone**

Deploy a preview to Vercel. Open the preview URL on an iPhone (Safari and Chrome). Walk through every route. Confirm:

- Top bar collapses to hamburger
- Mobile menu opens/closes
- Hero H1 doesn't overflow
- Demo 1 and Demo 2 interactive
- Demo 1 evidence drawer animates smoothly
- Demo 2 streaming animates smoothly; cancel works
- Method-in-practice image scales
- Case study metric grid stacks vertically

- [ ] **Step 2: Real device test on Android**

Same as Step 1 on Android Chrome.

- [ ] **Step 3: Desktop browser test (Chrome, Safari, Firefox, Edge)**

Walk through home + /about + one case study + one writing post + /lab in each.

Confirm:
- No layout breakage
- Fonts render (Geist Sans + Mono load)
- Dark mode toggle works
- All interactive elements work

- [ ] **Step 4: Fix any issues, commit per fix**

---

## Task 25: Update profile.yml + final deploy

**Files:**
- Modify: `../career-ops/config/profile.yml` (the career-ops repo, sibling)

- [ ] **Step 1: Update `config/profile.yml` proof point #3 in career-ops repo**

Replace the stale "wallet + cart abandonment" entry with the corrected Gift Card Portal metrics. Edit `~/00-Dev/career-ops/config/profile.yml`:

Find the entry for `id: 3` and update to:

```yaml
    - id: 3
      name: "Fiserv Gift Card Portal redesign (Sr. PD, 2023–2024)"
      url: "https://jaymoore.net/work/fiserv-gift-card-portal"
      hero_metric: "−35% support tickets; +40% promotion setup speed; +20 NPS points from merchants; multi-persona B2B SaaS (3 user types) end-to-end as Lead PD over 6 months"
      use_for: "Enterprise B2B SaaS, multi-persona design, complex workflow UX, cross-domain proof (non-AI)"
      maps_to: "Gusto, GitLab, Atlassian, Stripe, Intuit Mailchimp, HubSpot, Customer.io"
```

Commit in the career-ops repo:

```bash
cd ~/00-Dev/career-ops
git add config/profile.yml
git commit -m "fix(profile): replace stale Fiserv wallet metrics with Gift Card Portal metrics"
```

- [ ] **Step 2: Final production deploy from jay-moore-design**

```bash
cd ~/00-Dev-jaymoore/jay-moore-design
npx vercel --prod
```

Expected: production deploy succeeds; preview URL `jay-moore-design.vercel.app` is live.

- [ ] **Step 3: DNS cutover prep**

In Vercel dashboard:
1. Add `jaymoore.net` as a custom domain on the `jay-moore-design` project
2. Vercel displays required DNS records
3. Update DNS at the domain registrar to point to Vercel's records
4. Wait for DNS to propagate (5 min – 1 hr)
5. Confirm `https://jaymoore.net` resolves to the new portfolio

- [ ] **Step 4: Archive the old portfolio**

Before DNS cutover, archive the old portfolio:

```bash
# Replace with actual old portfolio repo path
cd ~/path/to/old-portfolio-repo
git tag -a archive-pre-redesign-2026-05-13 -m "Archive: state of jaymoore.net before May 2026 redesign"
git push --tags
```

- [ ] **Step 5: Run first real audit on production**

In github UI → Actions → "Weekly Audit" → "Run workflow". Confirm a fresh audit report appears in `/audits/`.

- [ ] **Step 6: Launch announcement**

Post to LinkedIn (manual, Jay-authored) and send one email to recent contacts. Out of scope for this implementation plan — Jay's content.

- [ ] **Step 7: Final commit on jay-moore-design**

If any last-minute fixes were needed:

```bash
git add -A
git commit -m "chore: launch v1"
git push
```

---

## Self-Review Notes

This plan implements every Section 1–10 requirement from the spec at `docs/superpowers/specs/2026-05-13-portfolio-redesign-design.md`:

| Spec section | Covered by task(s) |
|---|---|
| 2. Sitemap and IA | Tasks 4–6, 11, 14–17, 20 |
| 3. Homepage composition | Tasks 4, 9, 10 |
| 4. Demo component pattern | Tasks 6–8 |
| 5. Tech stack and craft bar | Tasks 1–3, 18, 19, 23 |
| 6. Visual system | Task 2 (token implementation; values from Phase 0) |
| 7. Content list — homepage demos | Tasks 7, 8, 10 |
| 7. Content list — case studies | Tasks 15, 16 |
| 7. Content list — essays | Tasks 12, 13 |
| 7. Content list — lab | Task 14 |
| 7. Content list — audits folder | Tasks 17, 19 |
| 7. Content list — /about | Task 5 |
| 7. Content list — pivot statement on home | Task 4 |
| 7. Content list — Method in practice block | Tasks 9, 10 |
| 7. Content list — top bar (5 links + Github) | Task 3 |
| 7. Content list — availability line in footer | Task 3 |
| 8. Timeline / build sequence | This plan as a whole; phases mapped to task ordering |
| 9. Definition of v1 ship | Tasks 22–25 verify the checklist |
| 10. Open question 4 (profile.yml update) | Task 25 |

Things explicitly NOT in this plan (per spec — deferred to v1.1):

- Demo 3 (Decision Routing)
- `/patterns` route content (route exists from Task 11; no entries yet)
- `/writing/trust-surfaces` and `/writing/streaming-is-not-chat` essays
- "Run live" buttons on demos (canned data only at v1)
- Auto-generated OG images for `/writing` (basic OG handled by Next default in Task 1)

Things owned outside this plan:

- Phase 0 visual design exploration (user-collaborative; produces approved token values + accent + final fonts before Task 1 starts)
- Launch announcement content (Jay-authored at Step 6 of Task 25)
- Wave 1 / Wave 2 application work (Phase 5 of spec; not implementation)
- `/work/spm-lifecycle.mdx` and `/work/fiserv-gift-card-portal.mdx` body copy (skeleton in Tasks 15 and 16; Jay fills in actual paragraphs)
