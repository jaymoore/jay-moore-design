import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — the pivot",
  description:
    "10 yrs product design into design engineering. The cross-domain bridge for AI-native work.",
};

type TimelineEntry = {
  years: string;
  company: string;
  role: string;
};

const TIMELINE: TimelineEntry[] = [
  { years: "2024–present", company: "Simple Path Media", role: "Design Engineer" },
  { years: "2021–24", company: "Fiserv", role: "Product Design" },
  { years: "2016–20", company: "Kleinfelder", role: "Product Design" },
];

type PrincipleItem = { label: string; value: string };

const PRINCIPLES: PrincipleItem[] = [
  {
    label: "Ship in code",
    value:
      "Every design is the actual interface. No mockups handed off to engineers.",
  },
  {
    label: "Real users first",
    value:
      "v1 in front of users before the v2 conversation. Cuts the speculation early.",
  },
  {
    label: "Documented intent",
    value:
      "The spec is the ceiling on the output. Concrete details — padding values, color tokens, interaction patterns — push the ceiling up. Anything left to interpretation comes back as drift.",
  },
  {
    label: "Operator framing",
    value:
      "The user is not the system. Designs hold that gap visible.",
  },
];

export default function AboutPage() {
  return (
    <article className="mx-auto w-full max-w-[1120px] px-6 py-24">
      {/* Hero */}
      <header>
        <p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
          About — the pivot
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-4xl">
          Cross-domain bridge.
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg text-fg-soft">
          10 yrs of zero-to-one product design. Now shipping through code with
          AI as the pair. The pivot, the practice, and why this combination is
          rare.
        </p>
      </header>

      <hr className="my-16 border-line" />

      {/* Two-column body */}
      <div className="grid gap-16 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start md:gap-20">
        {/* Narrative */}
        <div>
          <Stanza label="Then">
            <Prose>
              I&rsquo;ve always been a designer who codes. The medium has
              always been the point — same way a graphic designer understands
              paper and printing. Right now we&rsquo;re moving through another
              transformation, and it asks for an understanding of a new medium
              to design in a new way.
            </Prose>
            <Prose>
              What carries forward: good design still applies, especially now.
              AI is a force multiplier; it amplifies the precise and the
              imprecise equally. The specifications need to be tighter, the
              understanding deeper, the guardrails more careful. Design skills
              don&rsquo;t go away. They get documented, leveraged, enhanced.
            </Prose>
          </Stanza>

          <Stanza label="Catalyst">
            <Prose>
              I&rsquo;d been watching the shift for a few years. 2026 was the
              moment it became obvious — time to change the foundation of how
              I work and design.
            </Prose>
            <Prose>
              Coming back to my roots: a designer who codes, this time paired
              with AI. The iteration cycles are different. Ideas I couldn&rsquo;t
              have afforded to test a year ago can land in an afternoon now.
            </Prose>
          </Stanza>

          <Stanza label="Now">
            <Prose>
              As a design engineer for AI-native workflows, every layer of the
              practice is in play at once.
            </Prose>
            <Prose>
              <span className="text-fg">Trust surfaces</span> — show the
              receipts when the model is uncertain; the operator decides.
            </Prose>
            <Prose>
              <span className="text-fg">Streaming UI</span> — treat the stream
              as transport for structured output, not chat bubbles.
            </Prose>
            <Prose>
              <span className="text-fg">Agentic fallbacks</span> — the seam
              where AI capability meets human judgment, so the system stays
              legible when autonomy hits its edge.
            </Prose>
          </Stanza>

          <Stanza label="Why this combination">
            <Prose>
              Ten years of taking products from zero to one — finding the right
              thing to build, cutting what doesn&rsquo;t ship, getting a working
              version into users&rsquo; hands. The work trains a specific kind
              of attention: the user is not the system, and the system is not
              the user. The user has their own job. The tool serves the job.
              The design work is keeping that gap visible.
            </Prose>
            <Prose>
              AI-paired coding closed the last loop. I direct the model, read
              what it writes, redirect when it&rsquo;s wrong, and iterate on the
              real interface — not a static mockup someone else has to
              translate. The thing I design is the thing I ship. No handoff. No
              game of telephone with an engineer who half-gets the intent.
            </Prose>
            <Prose>
              Anyone can prompt an AI to write code. The rare part is knowing
              what the first version should be — what to cut, what to keep,
              what&rsquo;s worth shipping now. That call doesn&rsquo;t come from
              a model. It comes from ten years of doing it.
            </Prose>
          </Stanza>
        </div>

        {/* Sidebar */}
        <aside className="md:sticky md:top-20">
          <SidebarBlock label="Timeline">
            <dl>
              {TIMELINE.map((entry, i) => (
                <div
                  key={entry.company}
                  className={`grid grid-cols-[88px_1fr] items-baseline gap-3 py-3 font-mono text-2xs ${
                    i > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <dt className="text-fg-faint">{entry.years}</dt>
                  <dd>
                    <span className="block font-medium text-fg">
                      {entry.company}
                    </span>
                    <span className="mt-0.5 block text-fg-soft">
                      {entry.role}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </SidebarBlock>

          <SidebarBlock label="Role open to">
            <p className="font-mono text-2xs leading-relaxed text-fg-soft">
              Staff / Principal
              <br />
              Product Designer
              <br />
              Design Engineer
              <br />
              US remote
            </p>
          </SidebarBlock>

          <SidebarBlock label="Located">
            <p className="font-mono text-2xs leading-relaxed text-fg-soft">
              San Diego, CA (remote)
            </p>
          </SidebarBlock>

          <SidebarBlock label="Reach">
            <p className="font-mono text-2xs leading-relaxed text-fg-soft">
              <a
                href="mailto:jay@jaymoore.net"
                className="block transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-accent"
              >
                jay@jaymoore.net
              </a>
              <a
                href="https://github.com/jaymoore"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-accent"
              >
                github.com/jaymoore
              </a>
              <a
                href="https://www.linkedin.com/in/jay-moore-designer/"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-accent"
              >
                linkedin.com/in/jay-moore-designer
              </a>
            </p>
          </SidebarBlock>
        </aside>
      </div>

      <hr className="my-16 border-line" />

      {/* Operating principles */}
      <section>
        <p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
          How I work
        </p>
        <h2 className="mt-2 text-xl font-medium tracking-tight text-fg">
          Operating principles
        </h2>
        <dl className="mt-6">
          {PRINCIPLES.map((item, i) => (
            <div
              key={item.label}
              className={`grid grid-cols-1 gap-2 border-t border-line py-5 sm:grid-cols-[180px_1fr] sm:gap-8 ${
                i === PRINCIPLES.length - 1 ? "border-b" : ""
              }`}
            >
              <dt className="font-mono text-2xs uppercase tracking-wider text-fg-faint sm:pt-0.5">
                {item.label}
              </dt>
              <dd className="text-sm leading-relaxed text-fg">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <hr className="my-16 border-line" />

      {/* CTA */}
      <section>
        <h2 className="font-mono text-2xs font-normal uppercase tracking-wider text-fg-faint">
          Where to go next
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/work/spm-lifecycle"
            className="group flex flex-col rounded-md border border-line bg-panel p-6 transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:border-line-strong"
          >
            <span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
              Case study
            </span>
            <span className="mt-2 text-lg font-medium text-fg">
              SPM lifecycle engine
            </span>
            <span className="mt-2 text-sm text-fg-soft">
              Full study — TTF-touch 30 min → 60 s. Reply rate 4.6–4.9% against
              a ~1% industry baseline.
            </span>
            <span className="mt-4 inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-wider text-accent">
              Read
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
      </section>
    </article>
  );
}

function Stanza({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 last:mb-0">
      <h2 className="font-mono text-2xs font-normal uppercase tracking-wider text-fg-faint">
        {label}
      </h2>
      <div className="mt-2 h-px w-8 bg-line" />
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function SidebarBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 last:mb-0">
      <p className="border-b border-line pb-2 font-mono text-2xs uppercase tracking-wider text-fg-faint">
        {label}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-[60ch] text-base leading-relaxed text-fg-soft">
      {children}
    </p>
  );
}
