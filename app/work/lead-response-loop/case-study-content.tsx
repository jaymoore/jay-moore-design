import Link from "next/link";

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
    value: "Onboarding",
    sub: "telemetry lands week of measurement",
  },
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
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          Read this expecting engineering, not vertical. The product is missed-lead
          recovery for HVAC and plumbing owners. The patterns — multi-agent
          classification with a deterministic pre-filter, a frozen LLM output
          contract shared between simulator and production, decision-support over
          full automation, idempotent webhooks, durable retry queues, server-only
          secret boundaries — apply anywhere a high-noise inbound channel meets a
          latency budget. Sales funnels, support triage, onboarding intake. HVAC
          is where there were real prospects to test against.
        </p>
      </header>

      <hr className="my-16 border-line" />

      {/* 01 — TL;DR */}
      <CaseSection num="01" id="tldr" label="TL;DR">
        <SectionHeading eyebrow="TL;DR" title="Metrics first" />
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          Shipped end-to-end in 14 days. Live decision support over real Twilio
          calls and real Claude qualifications. Beta partner onboarding in
          progress.
        </p>
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
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 02 — Problem */}
      <CaseSection num="02" id="problem" label="Problem">
        <SectionHeading
          eyebrow="Problem"
          title="The response window is measured in minutes."
        />
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          A $500K–$5M HVAC or plumbing business runs on tickets in the $300–$1,500
          range. The gap between a lost lead and a booked one is a single SMS
          reply, sent within minutes. Industry studies put a 5-minute response
          window at roughly 21× higher qualification odds than a 30-minute
          window. Owners in this size band don&rsquo;t have admin staff — they
          answer their own phones between jobs and miss 30–40% of inbound calls
          during the workday. Those misses don&rsquo;t ring back. They hit the
          next name in the local search results.
        </p>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          Existing tooling is split in two: heavyweight CRM platforms (weeks of
          onboarding) and low-quality auto-responders (same template to every
          caller). Neither closes the loop from missed call to qualified booking
          in seconds. The engineering question is what falls out when you treat
          the response loop itself as the product, not a feature of a larger
          CRM. That&rsquo;s what this case study documents.
        </p>
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
