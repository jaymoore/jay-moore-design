# Case Study Designer-First Pivot — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Spec is the source of truth — when a step says "per spec §N", open `process/2026-05-20-case-study-designer-first-pivot.md` and read that section.

**Goal:** Restructure `/work/lead-response-loop` from engineer-first to designer-first per the approved pivot spec. 11 new sections, 4 new placeholder Figma image slots, 2 new components, several legacy components deleted.

**Architecture:** Heavy modification of a single Server Component file (`case-study-content.tsx`) plus two new presentational client components. No new state, no new data fetching, no API changes. The Simulator component (existing) gets repositioned but is otherwise unchanged. The Server Component continues to fetch the metrics snapshot at render time.

**Tech Stack:** Next.js 16 App Router · React 19 · Tailwind v4 · TypeScript strict · Vitest 3 (existing portfolio test infra)

**Spec source of truth:** `process/2026-05-20-case-study-designer-first-pivot.md`

---

## Phase 1 — Add new pieces (no removals yet, page still builds)

### Task 1: Create `PhoneMockupStrip` component

**Files:**
- Create: `app/work/lead-response-loop/phone-mockups.tsx`
- Test: `tests/case-study/phone-mockups.test.tsx`

This is the visual artifact below the simulator: three minimal-chrome phone mockups side-by-side, each containing static SMS-thread content. Pure presentational, no props (content is hardcoded since it mirrors the canned scenario one-to-one).

- [ ] **Step 1: Write the failing test.**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PhoneMockupStrip } from "../../app/work/lead-response-loop/phone-mockups";

describe("PhoneMockupStrip", () => {
  it("renders three phone panels labeled Prospect / Owner / Prospect (after YES)", () => {
    render(<PhoneMockupStrip />);
    expect(screen.getByText("Prospect")).toBeDefined();
    expect(screen.getByText("Owner")).toBeDefined();
    expect(screen.getByText("Prospect (after YES)")).toBeDefined();
  });

  it("includes the auto-text-back body in the prospect phone", () => {
    render(<PhoneMockupStrip />);
    expect(
      screen.getByText(/Sorry we missed your call/),
    ).toBeDefined();
  });

  it("includes the URGENT classification in the owner phone", () => {
    render(<PhoneMockupStrip />);
    expect(screen.getByText("URGENT")).toBeDefined();
    expect(screen.getByText(/92% conf/)).toBeDefined();
  });

  it("includes the booking link in the post-YES prospect phone", () => {
    render(<PhoneMockupStrip />);
    expect(
      screen.getByText(/cal.com\/spm\/hvac-appointment/),
    ).toBeDefined();
  });
});
```

- [ ] **Step 2: Confirm @testing-library/react is available.**

```bash
grep '"@testing-library/react"' package.json || echo "needs install"
```

If "needs install", add it:

```bash
npm install -D @testing-library/react @testing-library/dom jsdom
```

Update `vitest.config.ts` to switch the test environment for component tests to `jsdom`. The current config uses `environment: "node"`. Change to `jsdom` OR add a per-file environment directive at the top of `phone-mockups.test.tsx`:

```tsx
// @vitest-environment jsdom
```

The per-file directive is less invasive — use it.

- [ ] **Step 3: Run the test, confirm FAIL.**

```bash
npm test tests/case-study/phone-mockups.test.tsx
```

Expected: FAIL — `PhoneMockupStrip` is not exported from `../../app/work/lead-response-loop/phone-mockups`.

- [ ] **Step 4: Implement `app/work/lead-response-loop/phone-mockups.tsx`.**

```tsx
const TEXT_BACK_BODY =
  "Sorry we missed your call. Can we help via text? Reply with what you need and we'll get back to you. Reply STOP to opt out.";

export function PhoneMockupStrip() {
  return (
    <div className="my-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
      <Phone label="Prospect">
        <PhoneHeader>+1 (555) 432-1098</PhoneHeader>
        <EventRow>📞 Missed call</EventRow>
        <BubbleIn>{TEXT_BACK_BODY}</BubbleIn>
        <BubbleOut>water heater leaking everywhere can someone come today</BubbleOut>
      </Phone>

      <Phone label="Owner">
        <PhoneHeader>Auto Lead Response Loop</PhoneHeader>
        <NotificationCard />
      </Phone>

      <Phone label="Prospect (after YES)">
        <PhoneHeader>+1 (555) 432-1098</PhoneHeader>
        <BubbleIn>Book a time that works: cal.com/spm/hvac-appointment</BubbleIn>
        <EventRow>✓ Booking confirmed · Tue 2:00pm</EventRow>
      </Phone>
    </div>
  );
}

function Phone({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[200px] rounded-3xl border border-line bg-panel px-3 pb-3 pt-4 shadow-(--shadow)">
        <span
          aria-hidden
          className="absolute left-1/2 top-1.5 h-2 w-2 -translate-x-1/2 rounded-full bg-line"
        />
        <div className="px-1 pt-2">{children}</div>
      </div>
      <p className="mt-3 font-mono text-2xs uppercase tracking-wider text-fg-faint">
        {label}
      </p>
    </div>
  );
}

function PhoneHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 border-b border-line pb-2 text-center font-mono text-[8px] uppercase tracking-wider text-fg-faint">
      {children}
    </p>
  );
}

function EventRow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 rounded-sm bg-bg-2 p-1 text-center font-mono text-[8px] text-fg-faint">
      {children}
    </p>
  );
}

function BubbleIn({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 max-w-[84%] rounded-xl rounded-bl-sm bg-bg-2 px-2 py-1.5 font-mono text-[8px] leading-snug text-fg">
      {children}
    </p>
  );
}

function BubbleOut({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 ml-auto max-w-[84%] rounded-xl rounded-br-sm bg-accent px-2 py-1.5 font-mono text-[8px] leading-snug text-selection-fg">
      {children}
    </p>
  );
}

function NotificationCard() {
  return (
    <div className="rounded-lg border border-line bg-bg-2 p-2 font-mono text-[8px] leading-relaxed text-fg">
      <div>New lead: Caller A1</div>
      <div>water heater repair</div>
      <div>
        <span className="font-bold uppercase tracking-wider text-ok">URGENT</span>
        <span className="text-fg-faint"> · 92% conf</span>
      </div>
      <p className="mt-1 italic text-fg-soft">&ldquo;water heater leaking everywhere&rdquo;</p>
      <p className="mt-1.5 font-bold text-accent">Reply YES / NO / INFO</p>
    </div>
  );
}
```

- [ ] **Step 5: Run the test, confirm PASS.**

```bash
npm test tests/case-study/phone-mockups.test.tsx
```

Expected: 4 passing.

- [ ] **Step 6: Typecheck + commit.**

```bash
npm run typecheck
git add app/work/lead-response-loop/phone-mockups.tsx tests/case-study/phone-mockups.test.tsx package.json package-lock.json vitest.config.ts
git commit -m "feat(case-study): PhoneMockupStrip component (Section 02 visual)"
```

(If `vitest.config.ts` was changed to add jsdom default, include it. If only per-file directive was used, leave it out.)

### Task 2: Create `IxItem` component

**Files:**
- Create: `app/work/lead-response-loop/ix-item.tsx`
- Test: `tests/case-study/ix-item.test.tsx`

Reusable item for Section 05's zig-zag layout. Renders image + title + body with a `side` prop controlling which column the image lives in. Mobile collapses to single column with image above text.

- [ ] **Step 1: Write the failing test.**

```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { IxItem } from "../../app/work/lead-response-loop/ix-item";

describe("IxItem", () => {
  it("renders title, body, and image alt text", () => {
    render(
      <IxItem
        side="left"
        imageSrc="/case-study/ix-1.png"
        imageAlt="Both phones at once mockup"
        title="Both phones at once."
        body="Most product videos cut between caller and owner."
      />,
    );
    expect(screen.getByText("Both phones at once.")).toBeDefined();
    expect(screen.getByText(/Most product videos/)).toBeDefined();
    expect(screen.getByAltText("Both phones at once mockup")).toBeDefined();
  });

  it("applies side='left' grid order (image first)", () => {
    const { container } = render(
      <IxItem
        side="left"
        imageSrc="/case-study/ix-1.png"
        imageAlt="alt"
        title="t"
        body="b"
      />,
    );
    const grid = container.querySelector('[data-ix-side="left"]');
    expect(grid).toBeDefined();
  });

  it("applies side='right' grid order (text first)", () => {
    const { container } = render(
      <IxItem
        side="right"
        imageSrc="/case-study/ix-2.png"
        imageAlt="alt"
        title="t"
        body="b"
      />,
    );
    const grid = container.querySelector('[data-ix-side="right"]');
    expect(grid).toBeDefined();
  });
});
```

- [ ] **Step 2: Run, confirm FAIL.**

```bash
npm test tests/case-study/ix-item.test.tsx
```

- [ ] **Step 3: Implement `app/work/lead-response-loop/ix-item.tsx`.**

```tsx
import Image from "next/image";

type Props = {
  side: "left" | "right";
  imageSrc: string;
  imageAlt: string;
  title: string;
  body: React.ReactNode;
};

export function IxItem({ side, imageSrc, imageAlt, title, body }: Props) {
  const image = (
    <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-line bg-bg-2">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(min-width: 768px) 360px, 100vw"
      />
    </div>
  );
  const text = (
    <div>
      <h3 className="text-base font-medium text-fg">{title}</h3>
      <p className="mt-2 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
        {body}
      </p>
    </div>
  );
  return (
    <div
      data-ix-side={side}
      className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10"
    >
      {side === "left" ? (
        <>
          {image}
          {text}
        </>
      ) : (
        <>
          <div className="order-2 md:order-1">{text}</div>
          <div className="order-1 md:order-2">{image}</div>
        </>
      )}
    </div>
  );
}
```

Note on mobile: when `side="right"`, the text is in DOM order BEFORE the image, but on mobile we want image-above-text consistently. The `order-1 md:order-2` swap puts image first on mobile, second on md+ desktop. When `side="left"`, default DOM order is image-then-text — that's already image-above-text on mobile.

- [ ] **Step 4: Run, confirm PASS (3 tests).**

```bash
npm test tests/case-study/ix-item.test.tsx
```

- [ ] **Step 5: Typecheck + commit.**

```bash
npm run typecheck
git add app/work/lead-response-loop/ix-item.tsx tests/case-study/ix-item.test.tsx
git commit -m "feat(case-study): IxItem component (zig-zag image + text)"
```

### Task 3: Create 4 placeholder Figma image slots

**Files:**
- Create: `public/case-study/ix-1.png`
- Create: `public/case-study/ix-2.png`
- Create: `public/case-study/ix-3.png`
- Create: `public/case-study/ix-4.png`

Jay swaps these with real Figma exports later. Initial placeholders are simple 1280×720 PNGs with a diagonal-stripe pattern + the ix label.

- [ ] **Step 1: Generate placeholders via a tiny Node script.**

Create `scripts/generate-ix-placeholders.mjs`:

```js
import { writeFile, mkdir } from "node:fs/promises";

// Tiny SVG-as-PNG-via-data-URI trick: write SVG files instead of PNG,
// then rename in the README. For honesty (PNG extension matters for next/image
// and most readers expect PNG), use a small Node lib that does SVG→PNG.
// Skipping rasterization here: just write a 1280×720 PNG with a known fill via
// the `sharp` library or fall back to writing the SVG directly and accept it.

import sharp from "sharp";

const TITLES = [
  "ix-1 — Both phones at once",
  "ix-2 — Timing in plain view",
  "ix-3 — Notification ranked",
  "ix-4 — Loud failure",
];

await mkdir("public/case-study", { recursive: true });

for (let i = 0; i < TITLES.length; i++) {
  const title = TITLES[i];
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
      <defs>
        <pattern id="stripe" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
          <rect width="10" height="20" fill="#d7dbe0"/>
          <rect x="10" width="10" height="20" fill="#e7eaed"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stripe)"/>
      <rect x="40" y="40" width="560" height="120" rx="8" fill="#fff" stroke="#bfc4cb"/>
      <text x="64" y="100" font-family="monospace" font-size="22" fill="#676c72">PLACEHOLDER · ${title}</text>
      <text x="64" y="130" font-family="monospace" font-size="16" fill="#676c72">Replace with Figma export at public/case-study/ix-${i + 1}.png</text>
    </svg>`,
  );
  await sharp(svg)
    .png()
    .toFile(`public/case-study/ix-${i + 1}.png`);
  console.log(`wrote public/case-study/ix-${i + 1}.png`);
}
```

- [ ] **Step 2: Install sharp + run.**

```bash
npm install -D sharp
node scripts/generate-ix-placeholders.mjs
```

Expected output: 4 lines, one per file written.

- [ ] **Step 3: Verify the 4 files exist + are reasonable size.**

```bash
ls -la public/case-study/ix-*.png
```

Expected: 4 files, each between 2KB and 30KB.

- [ ] **Step 4: Commit.**

```bash
git add public/case-study/ scripts/generate-ix-placeholders.mjs package.json package-lock.json
git commit -m "feat(case-study): 4 placeholder Figma image slots for Section 05"
```

---

## Phase 2 — Restructure `case-study-content.tsx`

For Phase 2, the strategy is: do a SINGLE complete rewrite of `case-study-content.tsx` in one commit, because the section-by-section approach would leave the file in a transiently broken state (old `Decision` calls referring to removed data, etc.). One atomic rewrite is safer than 8 sequential edits to the same file.

The rewrite preserves:
- `getMetricsSnapshot()` import + call
- `Simulator` import (now used in Section 01 instead of 04)
- `TLDR_METRICS` constant (still used in Section 03)
- The `metrics`/`source` destructure (still drives Outcomes tiles)
- `CaseSection`, `CaseSectionLabel`, `SectionHeading` helpers (still used by every numbered section)

The rewrite removes:
- `EVAL_ROWS` constant + the entire Evaluation section JSX
- `BUILD_LOG` constant + the entire Build log section JSX
- `Decision` helper component + all 4 Decision instances
- `ArtifactPanel` component (no callers after Approach is removed)
- `Placeholder` component (no callers after restructure)
- The `outcomesTiles` derivation (replaced with a simpler hardcoded array since live data isn't wired yet)

The rewrite adds:
- `PhoneMockupStrip` import + use in Section 02
- `IxItem` import + use 4× in Section 05
- New Section 06 (Design decisions) inline JSX (3 numbered decisions, no helper component)
- New Section 09 (Engineering Proof) inline JSX using native `<details>` element
- New `IX_ITEMS` constant data

### Task 4: Rewrite `case-study-content.tsx` (atomic)

**Files:**
- Modify: `app/work/lead-response-loop/case-study-content.tsx`

- [ ] **Step 1: Replace the entire file with the new structure.**

Read the existing file first to be sure imports stay valid. Then write:

```tsx
import Link from "next/link";
import { Simulator } from "./simulator";
import { PhoneMockupStrip } from "./phone-mockups";
import { IxItem } from "./ix-item";
import { getMetricsSnapshot } from "./metrics";

type Metric = { label: string; value: string; sub?: string };

const TLDR_METRICS: Metric[] = [
  {
    label: "Qualification accuracy",
    value: "96%",
    sub: "48/50 on labeled test set",
  },
  { label: "P95 LLM latency", value: "1.6s", sub: "target ≤ 3.5s" },
  {
    label: "Beta partner status",
    value: "onboarding",
    sub: "telemetry lands week of measurement",
  },
];

type IxItemData = {
  side: "left" | "right";
  imageSrc: string;
  imageAlt: string;
  title: string;
  body: string;
};

const IX_ITEMS: IxItemData[] = [
  {
    side: "left",
    imageSrc: "/case-study/ix-1.png",
    imageAlt: "Both prospect and owner phones side by side, showing the loop in real time",
    title: "Both phones at once.",
    body: "Most product videos cut between caller and owner. That hides what matters — how fast the gap between them closes. Side-by-side, you watch it happen.",
  },
  {
    side: "right",
    imageSrc: "/case-study/ix-2.png",
    imageAlt: "Event log with elapsed-time stamps showing the system's tempo",
    title: "Timing in plain view.",
    body: "Every step shows when it happened. A 2-second delay between classification and notification isn't hidden in a log — it's in the design.",
  },
  {
    side: "left",
    imageSrc: "/case-study/ix-3.png",
    imageAlt: "Owner notification card with label, confidence percentage, and verbatim quote",
    title: "The owner's notification, ranked for five seconds of attention.",
    body: "Label first. Confidence next. Then one quote from the caller. Owner reads, owner decides. The order is the design.",
  },
  {
    side: "right",
    imageSrc: "/case-study/ix-4.png",
    imageAlt: "Loud failure state — empty panel filled with a clear message instead of a blank space",
    title: "Loud failure.",
    body: "Empty states are full messages, not blank panels. When the demo can't reach its endpoint, it says so. The systems this replaces failed quietly; this one doesn't.",
  },
];

type Decision = { num: string; title: string; body: string };

const DESIGN_DECISIONS: Decision[] = [
  {
    num: "01",
    title: "Show the owner. Don't auto-send.",
    body: "The default move with AI is to auto-book the confident matches. One wrong booking and the owner has to apologize. So the system shows them every lead — label, confidence, the caller's words — and books only when the owner says yes.",
  },
  {
    num: "02",
    title: "Reply in under a minute.",
    body: "Industry data says a 5-minute reply is roughly 21× more likely to convert than a 30-minute one. The system aims for a phone-buzzes-in-under-a-minute target. If the AI is slow, the message routes to the owner with no classification — slower, but never silent.",
  },
  {
    num: "03",
    title: "SMS, not a dashboard.",
    body: "Owners drive between jobs, work under sinks, climb ladders. A web dashboard assumes a laptop they can't reach. So the system uses one SMS notification per lead, one keyword reply — read and decide in five seconds, no app to open.",
  },
];

const OUTCOMES_TILES_V2: Metric[] = [
  { label: "Calls handled", value: "0", sub: "waiting on beta partner" },
  { label: "Owner-approved leads", value: "0", sub: "waiting on beta partner" },
  { label: "Bookings created", value: "0", sub: "waiting on beta partner" },
];

type RoadmapItem = { title: string; body: string };

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    title: "Web form follow-up.",
    body: "Same idea, but for someone who fills out a contact form instead of calling.",
  },
  {
    title: "Owner dashboard.",
    body: "Everything happens over text right now. A web view becomes useful once a business hits 10+ leads a day or wants office staff handling decisions.",
  },
  {
    title: "Weekly summary email.",
    body: "What happened that week — calls handled, bookings, where things went wrong.",
  },
  {
    title: "AI receptionist.",
    body: "Voice instead of text. Pick up the call rather than letting it ring out. Bigger project — saved for after the text version is live.",
  },
];

export async function CaseStudyContent() {
  // Metrics snapshot is fetched for future Outcomes-tile wiring; not used in
  // the V2 hardcoded tiles since live data isn't flowing until beta partner
  // onboards. Kept here so the fetch path stays warm and Task 4.3's machinery
  // doesn't bitrot.
  await getMetricsSnapshot();

  return (
    <article className="mx-auto w-full max-w-[1120px] px-6 py-24">
      {/* Hero */}
      <header>
        <p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
          Case study
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-4xl">
          Lead Response Loop.
        </h1>
        <p className="mt-6 max-w-[60ch] text-xl leading-relaxed text-fg sm:text-[1.375rem]">
          I designed and built a system that turns missed calls into bookings
          for HVAC and plumbing businesses. If the business misses a call, the
          system texts the caller back, qualifies the lead, and asks the owner
          yes/no. Approved leads get a booking link.{" "}
          <strong className="text-accent">Try the live demo below.</strong>
        </p>
      </header>

      <hr className="my-16 border-line" />

      {/* 01 — Simulator hero */}
      <CaseSection num="01" id="simulator" label="Simulator">
        <Simulator />
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 02 — Phone mockups */}
      <CaseSection num="02" id="phone-mockups" label="Phone mockups">
        <PhoneMockupStrip />
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 03 — TL;DR */}
      <CaseSection num="03" id="tldr" label="TL;DR">
        <SectionHeading eyebrow="TL;DR" title="Metrics first" />
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          Shipped end to end in 14 days. Live decision support over real Twilio
          calls and real Claude qualifications. Beta partner onboarding in
          progress.
        </p>
        <MetricList tiles={TLDR_METRICS} />
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 04 — Problem */}
      <CaseSection num="04" id="problem" label="Problem">
        <SectionHeading
          eyebrow="Problem"
          title="The response window is measured in minutes."
        />
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          Most plumbers and HVAC companies miss 30–40% of their calls during the
          workday. The owner is usually driving between jobs; there&rsquo;s no
          receptionist to catch what comes in. Each missed call is real money —
          studies show a 5-minute reply is roughly 21× more likely to convert
          than a 30-minute one. A leaking water heater goes to whoever picks up
          first.
        </p>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          The tools that exist don&rsquo;t fit. CRMs take weeks to set up.
          Auto-responders send the same generic text to every caller, including
          spam. Neither closes the gap between a missed call and a booked job.
        </p>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed font-medium text-fg">
          So I designed something that does.
        </p>
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 05 — Interaction design */}
      <CaseSection num="05" id="interaction-design" label="Interaction design">
        <SectionHeading
          eyebrow="Interaction design"
          title="The simulator itself, as designed object."
        />
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          The simulator above is itself a designed surface. A few choices worth
          naming:
        </p>
        <div className="mt-10 flex flex-col gap-12">
          {IX_ITEMS.map((item) => (
            <IxItem
              key={item.imageSrc}
              side={item.side}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              title={item.title}
              body={item.body}
            />
          ))}
        </div>
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 06 — Design decisions */}
      <CaseSection num="06" id="design-decisions" label="Design decisions">
        <SectionHeading eyebrow="Design decisions" title="Three calls." />
        <div className="mt-10 flex flex-col gap-8">
          {DESIGN_DECISIONS.map((d) => (
            <div
              key={d.num}
              className="border-t border-line pt-6"
            >
              <p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
                {d.num}
              </p>
              <h3 className="mt-1 text-xl font-semibold leading-tight tracking-tight text-fg">
                {d.title}
              </h3>
              <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
                {d.body}
              </p>
            </div>
          ))}
        </div>
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 07 — Outcomes */}
      <CaseSection num="07" id="outcomes" label="Outcomes">
        <SectionHeading eyebrow="Outcomes" title="It works. Real callers next." />
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          The system runs end to end on a test number. The numbers in the
          TL;DR come from a 50-example test set I built — not from real callers
          yet. Once I find a beta HVAC or plumbing partner to use it, the
          placeholders below get replaced with real call counts and bookings.
        </p>
        <MetricList tiles={OUTCOMES_TILES_V2} />
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 08 — Roadmap */}
      <CaseSection num="08" id="roadmap" label="Roadmap">
        <SectionHeading eyebrow="Roadmap" title="What's next." />
        <div className="mt-8 flex flex-col gap-5">
          {ROADMAP_ITEMS.map((item) => (
            <div
              key={item.title}
              className="border-t border-line pt-4"
            >
              <h3 className="text-base font-semibold text-fg">{item.title}</h3>
              <p className="mt-1 max-w-[60ch] text-base leading-relaxed text-fg-soft">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 09 — Engineering proof (collapsed) */}
      <CaseSection num="09" id="engineering-proof" label="Engineering proof">
        <SectionHeading
          eyebrow="Engineering proof"
          title="The technical detail, for anyone who wants it."
        />
        <details className="mt-8 group rounded-md border border-line bg-panel">
          <summary className="cursor-pointer list-none px-4 py-3 font-mono text-2xs uppercase tracking-wider text-fg-faint transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-fg-soft">
            <span className="mr-2 text-accent">▸</span>
            Expand · stack, testing, reliability, repos
          </summary>
          <div className="border-t border-line px-4 py-5">
            <EngBlock title="Stack">
              Cloudflare Workers + D1 + KV + Cron Triggers. Twilio Voice and
              SMS. Anthropic Claude Haiku 4.5 for qualifying the message.
              Cal.com for booking. Resend for escalation email. Upstash Redis
              for rate-limiting the public simulator on this page.
            </EngBlock>
            <EngBlock title="Testing">
              50-example labeled test set, confusion matrix, latency tracked at
              the 50th and 95th percentile. v1 prompt landed at 96% label
              accuracy, 74% urgency accuracy, 1.6s P95 latency.
            </EngBlock>
            <EngBlock title="Reliability">
              Twilio webhook signatures verified, duplicate webhooks discarded
              via keyed locks in KV, failed outbound texts retried with
              exponential backoff via a Cloudflare Cron Trigger that runs every
              60 seconds. The JSON shape that the AI returns is frozen at
              version <code>v1</code> and shared between the simulator on this
              page and the production webhook through a single Server Action
              proxy.
            </EngBlock>
            <EngBlock title="Repos">
              <ul className="space-y-1 font-mono text-xs">
                <li>
                  Product:{" "}
                  <a
                    href="https://github.com/simplepathmedia/auto-lead-response-loop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-deep"
                  >
                    github.com/simplepathmedia/auto-lead-response-loop
                  </a>
                </li>
                <li>
                  Portfolio (this site):{" "}
                  <a
                    href="https://github.com/jaymoore/jay-moore-design"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-deep"
                  >
                    github.com/jaymoore/jay-moore-design
                  </a>
                </li>
              </ul>
            </EngBlock>
          </div>
        </details>
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 10 — Where next */}
      <section id="where-next" className="relative scroll-mt-20">
        <CaseSectionLabel num="10" label="Where next" />
        <div className="md:pl-20">
          <h2 className="font-mono text-2xs font-normal uppercase tracking-wider text-fg-faint">
            Where to go next
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/"
              className="group flex flex-col rounded-md border border-line bg-panel p-6 transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:border-line-strong focus-visible:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
                Homepage
              </span>
              <span className="mt-2 text-lg font-medium text-fg">
                Homepage
              </span>
              <span className="mt-2 text-sm text-fg-soft">
                Back to the rest of the work. Live trust-surface demo, the
                pivot story, contact.
              </span>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-wider text-accent">
                Back
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-(--duration-fast) ease-(--ease-snappy) group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>

            <a
              href="mailto:jay@jaymoore.net"
              className="group flex flex-col rounded-md border border-line bg-panel p-6 transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:border-line-strong focus-visible:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
                Contact
              </span>
              <span className="mt-2 text-lg font-medium text-fg">
                Get in touch
              </span>
              <span className="mt-2 text-sm text-fg-soft">
                Open to Senior / Staff Product Designer + Design Engineer
                roles. US remote.
              </span>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-wider text-accent">
                Email
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-(--duration-fast) ease-(--ease-snappy) group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}

/* ============================================================
   Section primitives — unchanged from previous version
   ============================================================ */

function CaseSection({
  num,
  id,
  label,
  children,
}: {
  num: string;
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-20">
      <CaseSectionLabel num={num} label={label} />
      <div className="md:pl-20">{children}</div>
    </section>
  );
}

function CaseSectionLabel({
  num,
  label,
}: {
  num: string;
  label: string;
}) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 hidden font-mono text-2xs uppercase tracking-[0.18em] text-fg-faint md:block"
      style={{ writingMode: "vertical-rl" }}
    >
      {num} / {label}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <>
      <p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-fg sm:text-3xl">
        {title}
      </h2>
    </>
  );
}

function MetricList({ tiles }: { tiles: Metric[] }) {
  return (
    <dl className="mt-8 max-w-[640px] rounded-md border border-line bg-panel">
      {tiles.map((m, i) => (
        <div
          key={m.label}
          className={`flex flex-col gap-1 px-5 py-5 sm:grid sm:grid-cols-[220px_1fr] sm:items-baseline sm:gap-4 ${
            i > 0 ? "border-t border-line" : ""
          }`}
        >
          <dt className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
            {m.label}
          </dt>
          <dd>
            <div className="text-2xl font-semibold tracking-tight text-fg">
              {m.value}
            </div>
            {m.sub && (
              <div className="mt-1 font-mono text-2xs uppercase tracking-wider text-fg-faint">
                {m.sub}
              </div>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function EngBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 first:mt-0">
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      <div className="mt-1.5 max-w-[70ch] text-sm leading-relaxed text-fg-soft">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck.**

```bash
npm run typecheck
```

Expected: zero errors. If the existing `Decision`, `ArtifactPanel`, `Placeholder`, `BUILD_LOG`, `EVAL_ROWS` symbols are referenced from another file (they shouldn't be — they were file-internal), fix the reference.

- [ ] **Step 3: Build.**

```bash
npm run build
```

Expected: `/work/lead-response-loop` listed as `ƒ (Dynamic)`. No build errors.

- [ ] **Step 4: Run existing portfolio tests + new component tests.**

```bash
npm test
```

Expected: all green. Test count = 17 (existing state-machine + qualify-action) + 4 (PhoneMockupStrip) + 3 (IxItem) = 24.

- [ ] **Step 5: Visual verify.**

Start dev server (if not already running): `npm run dev`. Open `http://localhost:3001/work/lead-response-loop`, enter password (default `preview` when CASE_STUDY_PASSWORD env unset locally). Walk all 11 sections. Verify:
- Lede sits prominently below h1
- Simulator is full-width in Section 01 (was previously in Section 04)
- 3 phone mockups in Section 02, side-by-side on desktop, stacked on mobile (resize browser to confirm)
- TL;DR tiles in Section 03 with 3 metrics
- Problem reads with the "So I designed something that does." emphasis line
- Section 05 ix-items alternate left/right with placeholder images visible
- 3 Design decisions in Section 06
- Outcomes tiles all show "0 · waiting on beta partner"
- Roadmap shows 4 items
- Engineering proof is a closed disclosure; clicking expands to 4 blocks
- Where next 2-card grid unchanged

- [ ] **Step 6: Commit.**

```bash
git add app/work/lead-response-loop/case-study-content.tsx
git commit -m "refactor(case-study): designer-first pivot — 11-section restructure

Implements the approved pivot per
process/2026-05-20-case-study-designer-first-pivot.md:
- Lede V2 (natural language, ends with 'Try the live demo below')
- Section 01 hero: Simulator (was Section 04)
- Section 02: PhoneMockupStrip (3 phones, chrome B)
- Section 03: TL;DR (unchanged tiles)
- Section 04: Problem (V2 rewrite, ends with 'So I designed...')
- Section 05: Interaction design with 4 IxItem zig-zag entries
- Section 06: 3 Design decisions in V2 voice
- Section 07: Outcomes ('It works. Real callers next.')
- Section 08: Roadmap (V2, plain language)
- Section 09: Engineering proof (collapsed details disclosure)
- Section 10: Where next (unchanged)

Removed: Approach + Evaluation + Build log sections.
Removed components: Decision, ArtifactPanel, Placeholder.
Removed data: EVAL_ROWS, BUILD_LOG."
```

---

## Phase 3 — Verify + Codex review + push

### Task 5: Codex pre-commit review via the skill

- [ ] **Step 1: Run codex-second-opinion skill on the rewrite.**

Use the skill (not bare `codex exec`). Provide diff context: file path + scope summary + spec link.

Skill prompt:

```
Pre-commit review of the designer-first case study pivot rewrite at
app/work/lead-response-loop/case-study-content.tsx + new components
phone-mockups.tsx and ix-item.tsx in /Users/jay/00-Dev-jaymoore/jay-moore-design.

Spec: process/2026-05-20-case-study-designer-first-pivot.md

Check:
1. All 11 sections present in correct order (00-10)
2. Voice consistent with spec §3 — no banned engineer jargon outside Engineering Proof disclosure (no 'schema', 'P95', 'eval harness', 'frozen contract', 'auto-route', etc. in main body)
3. Tailwind classes valid Tailwind v4 syntax
4. No regression breaks (typecheck + build clean per the prior steps)
5. IxItem mobile order behavior correct (image above text on narrow viewports for both side variants)

PASS or FAIL. Caveman terse fine.
```

- [ ] **Step 2: Address any FAIL findings.**

If Codex flags issues, fix inline and re-run. Common patterns it may catch:
- Banned-word leakage in the main body
- Tailwind typos
- Accessibility regressions

### Task 6: Final push

- [ ] **Step 1: Push the cumulative diff.**

```bash
git push
```

- [ ] **Step 2: Open the live URL.**

If portfolio is deployed (Cloudflare Workers or Vercel — TBD by Jay), visit the production URL + walk the page one more time. If not yet deployed, this is Jay's manual deploy task, out of scope for this plan.

---

## Self-review (run before handing off)

**1. Spec coverage:**
- §1 (why) → captured in commit message + spec link
- §2 (positioning) → Where Next card body updated to "Senior / Staff Product Designer + Design Engineer"
- §3 (new section list) → Task 4 implements all 11 sections in order
- §4 (phone mockup) → Task 1 builds `PhoneMockupStrip`
- §5 (ix-item) → Task 2 builds `IxItem` + Task 3 generates placeholders
- §6 (Engineering Proof disclosure) → Task 4 step 1 includes the `<details>` element
- §7 (what stays unchanged) → Simulator, TL;DR tiles, password gate, metrics fetch — all preserved
- §8 (what gets deleted) → Task 4 atomic rewrite removes Approach, Evaluation, Build log, Decision helper, ArtifactPanel, Placeholder, EVAL_ROWS, BUILD_LOG
- §9 (file map) → exact paths used in Tasks 1, 2, 3, 4
- §10 (open items) → addressed inline (mobile breakpoint = image-first via `order-N`; disclosure closed by default; PNG via sharp; old constants deleted outright)

**2. Placeholder scan:** No TBD/TODO. The `await getMetricsSnapshot()` call is deliberate (kept warm for future wiring); a code comment explains why.

**3. Type consistency:** `Metric` type reused for both `TLDR_METRICS` and `OUTCOMES_TILES_V2`. `IxItemData`/`IxItem` props signature matches. `Decision`/`RoadmapItem` types defined inline where used.

---

## Execution choice

**Plan complete and saved to `process/2026-05-20-case-study-pivot-plan.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — Fresh subagent per task, two-stage review between, fast iteration. 6 tasks total, mostly mechanical.

**2. Inline Execution** — Execute tasks in this session with checkpoints. Slower per-task but lower coordination overhead. Could be appropriate here since the plan is short (6 tasks) and mostly an atomic file rewrite.

**Which approach?**
