import Link from "next/link";

type Metric = { label: string; value: string };

const TLDR_METRICS: Metric[] = [
  { label: "TTF-touch", value: "30 min → 60 s" },
  { label: "Reply rate", value: "4.6–4.9%" },
  { label: "Industry baseline", value: "~1%" },
];

export function CaseStudyContent() {
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
        <Placeholder size="large">
          Lede — what the system is, in one sentence. Frame the problem and
          the work. Placeholder; real prose lands in Task 4.1.
        </Placeholder>
      </header>

      <hr className="my-16 border-line" />

      {/* 01 — TL;DR */}
      <CaseSection num="01" id="tldr" label="TL;DR">
        <SectionHeading eyebrow="TL;DR" title="Metrics first" />
        <Placeholder size="large">
          One-sentence summary of the case study, surfaced before any narrative.
        </Placeholder>
        <dl className="mt-8 max-w-[640px] rounded-md border border-line bg-panel">
          {TLDR_METRICS.map((m, i) => (
            <div
              key={m.label}
              className={`grid grid-cols-[160px_1fr] items-baseline gap-4 px-5 py-5 sm:grid-cols-[220px_1fr] ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <dt className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
                {m.label}
              </dt>
              <dd className="text-2xl font-semibold tracking-tight text-fg">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 02 — Problem */}
      <CaseSection num="02" id="problem" label="Problem">
        <SectionHeading eyebrow="Problem" title="What was broken" />
        <Placeholder size="large">
          TL;DR sentence — the broken thing in one line.
        </Placeholder>
        <Placeholder>
          Narrative for the problem statement. 2–3 paragraphs covering: the
          home-services economics of missed calls, why response time wins
          jobs, and the cost of inaction. Real prose lands in Task 4.1.
        </Placeholder>
        <Placeholder>Continuation — supporting detail or anecdote.</Placeholder>
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 03 — Approach */}
      <CaseSection num="03" id="approach" label="Approach">
        <SectionHeading eyebrow="Approach" title="What got built" />
        <Placeholder size="large">
          TL;DR sentence — the approach in one line.
        </Placeholder>
        <Placeholder>
          Narrative — the lifecycle engine architecture, the decision-support
          framing, the operator&rsquo;s mental model, the key trade-offs.
        </Placeholder>

        <ArtifactPanel
          type="diagram"
          caption="Lifecycle engine architecture"
        />

        <Placeholder>
          Continuation — implementation details, what made the engine work, how
          the decision-support layer surfaces the right context at the right
          time.
        </Placeholder>

        <ArtifactPanel
          type="code"
          caption="Decision-support kernel — core loop"
        />

        <Placeholder>
          Continuation — the UI surface. How operators see and act on the
          lifecycle state.
        </Placeholder>

        <ArtifactPanel
          type="screenshot"
          caption="Operator surface in production"
        />
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 04 — Demo */}
      <CaseSection num="04" id="demo" label="Demo">
        <SectionHeading eyebrow="Demo" title="Live artifact" />
        <Placeholder size="large">
          TL;DR sentence — what the demo demonstrates and how to interact with
          it.
        </Placeholder>
        <div
          className="mt-8 flex aspect-[16/10] flex-col items-center justify-center gap-4 rounded-md border border-line bg-panel"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--color-line) 0, var(--color-line) 1px, transparent 1px, transparent 12px)",
          }}
          role="img"
          aria-label="Live demo placeholder — to be built in a separate session"
        >
          <span className="rounded-sm border border-line bg-bg px-3 py-1 font-mono text-2xs uppercase tracking-wider text-fg-soft">
            [ live demo · separate session ]
          </span>
          <p className="max-w-[40ch] text-center font-mono text-2xs text-fg-faint">
            Interactive lead-response simulator lands here in Task 3.2/3.3.
            Same chrome family as the trust-surface slot on the homepage.
          </p>
        </div>
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 05 — Outcomes */}
      <CaseSection num="05" id="outcomes" label="Outcomes">
        <SectionHeading eyebrow="Outcomes" title="What changed" />
        <Placeholder size="large">
          TL;DR sentence — outcomes in one line.
        </Placeholder>
        <Placeholder>
          Outcomes narrative. Real metrics belong here: TTF-touch 30 min → 60 s,
          reply rate 4.6–4.9% vs ~1% industry baseline. Context for what the
          numbers mean, who they affect, how they were measured.
        </Placeholder>
        <Placeholder>
          Reflections / honest tradeoffs. What didn&rsquo;t work, what
          I&rsquo;d do differently, what&rsquo;s still open. The counterweight
          to the metrics.
        </Placeholder>
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 06 — Where next */}
      <section id="where-next" className="relative scroll-mt-20">
        <CaseSectionLabel num="06" label="Where next" />
        <div className="md:pl-20">
          <h2 className="font-mono text-2xs font-normal uppercase tracking-wider text-fg-faint">
            Where to go next
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/"
              className="group flex flex-col rounded-md border border-line bg-panel p-6 transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:border-line-strong"
            >
              <span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
                Homepage
              </span>
              <span className="mt-2 text-lg font-medium text-fg">
                Back to the scan spine
              </span>
              <span className="mt-2 text-sm text-fg-soft">
                See the rest of the work — the trust-surface demo, the depth
                list, more.
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
              className="group flex flex-col rounded-md border border-line bg-panel p-6 transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:border-line-strong"
            >
              <span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
                Contact
              </span>
              <span className="mt-2 text-lg font-medium text-fg">
                Get in touch
              </span>
              <span className="mt-2 text-sm text-fg-soft">
                Open to Staff / Principal Design Engineer roles. US remote.
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
   Section primitives
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

/* ============================================================
   Placeholder — italic + bracketed so it reads as TBD.
   Swap to a Prose-style component when real content lands.
   ============================================================ */

function Placeholder({
  size = "body",
  children,
}: {
  size?: "large" | "body";
  children: React.ReactNode;
}) {
  const className =
    size === "large"
      ? "mt-6 max-w-[60ch] text-lg italic leading-relaxed text-fg-faint"
      : "mt-6 max-w-[60ch] text-base italic leading-relaxed text-fg-faint";
  return <p className={className}>[{children}]</p>;
}

/* ============================================================
   Artifact panels — drop inline within Approach (or elsewhere)
   ============================================================ */

function ArtifactPanel({
  type,
  caption,
}: {
  type: "screenshot" | "code" | "diagram";
  caption: string;
}) {
  if (type === "code") {
    return (
      <figure className="mt-8">
        <figcaption className="mb-2 font-mono text-2xs uppercase tracking-wider text-fg-faint">
          [ code · TBD ] {caption}
        </figcaption>
        <pre className="overflow-x-auto rounded-md border border-line bg-bg-2 p-4 font-mono text-xs leading-relaxed text-fg-faint">
{`// [TBD] code snippet
// Real implementation lands in a separate session.
function placeholder() {
  return { todo: true };
}`}
        </pre>
      </figure>
    );
  }

  const aspect = type === "diagram" ? "aspect-[3/2]" : "aspect-video";
  const typeLabel = type === "diagram" ? "diagram" : "screenshot";

  return (
    <figure className="mt-8">
      <figcaption className="mb-2 font-mono text-2xs uppercase tracking-wider text-fg-faint">
        [ {typeLabel} · TBD ] {caption}
      </figcaption>
      <div
        className={`flex ${aspect} flex-col items-center justify-center rounded-md border border-line bg-bg-2`}
      >
        <span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
          [{typeLabel} placeholder]
        </span>
      </div>
    </figure>
  );
}
