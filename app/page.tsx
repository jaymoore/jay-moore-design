import { ArrowUpRight } from "lucide-react";
import { DepthList } from "@/components/depth-list";
import { TrustSurface } from "@/components/trust-surface";

export default function Home() {
  return (
    <>
      {/* ============================================================
          BLOCK 1 — Positioning
          ============================================================ */}
      <section id="start" className="scroll-mt-20 py-24">
        <div className="relative mx-auto max-w-[1120px] px-6">
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 hidden font-mono text-2xs uppercase tracking-[0.18em] text-fg-faint md:block"
            style={{ writingMode: "vertical-rl" }}
          >
            01 / Positioning
          </span>

          <div className="md:pl-20">
            <p className="max-w-[50ch] font-mono text-2xs uppercase tracking-wider text-fg-faint">
              Product designer who codes. 10 yrs designing complex software,
              now shipping the code too.
            </p>

            <h1 className="mt-6 text-3xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-4xl md:text-5xl">
              Product designer for{" "}
              <span className="text-accent">AI-native</span> workflows.
            </h1>

            <p className="mt-8 max-w-[60ch] text-base text-fg-soft">
              I design AI products and ship them in code. When the model is
              uncertain, the interface says so and the person using it decides
              what happens next.
            </p>

            <dl className="mt-12 grid max-w-[60ch] grid-cols-1 gap-y-6 sm:max-w-none sm:grid-cols-3 sm:gap-x-12">
              <div>
                <dt className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
                  now
                </dt>
                <dd className="mt-1 font-mono text-2xs text-fg">
                  Simple Path Media — decision support
                </dd>
              </div>
              <div>
                <dt className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
                  prior
                </dt>
                <dd className="mt-1 font-mono text-2xs text-fg">
                  Fiserv · Kleinfelder
                </dd>
              </div>
              <div>
                <dt className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
                  open to
                </dt>
                <dd className="mt-1 font-mono text-2xs text-fg">
                  Senior / Staff PD · US remote
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ============================================================
          BLOCK 2 — Live demo / hero slot
          ============================================================ */}
      <section id="demo" className="scroll-mt-20 py-24">
        <div className="relative mx-auto max-w-[1120px] px-6">
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 hidden font-mono text-2xs uppercase tracking-[0.18em] text-fg-faint md:block"
            style={{ writingMode: "vertical-rl" }}
          >
            02 / Live demo
          </span>

          <div className="md:pl-20">
            <p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
              — Live demo
            </p>

            <h2 className="mt-4 text-2xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-3xl">
              Two views of the same answer.
            </h2>

            <p className="mt-6 max-w-[60ch] text-base text-fg-soft">
              The AI streams a response in plain text. The same content gets
              reformatted into a structured view you can scan. Two ways to read
              the same thing — the person picks which one fits the moment.
            </p>

            {/* Hero slot — trust surface demo (Ready state) */}
            <div className="mt-12">
              <TrustSurface />
            </div>

            {/* Demo-attached metadata strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-x border-b border-line bg-bg-2 px-4 py-2 font-mono text-2xs text-fg-faint">
              <span>
                <span className="text-fg-soft">Built</span> 12 commits
              </span>
              <span className="hidden text-fg-faint sm:inline">/</span>
              <span>
                <span className="text-fg-soft">0</span> failed CI
              </span>
              <span className="hidden text-fg-faint sm:inline">/</span>
              <a
                href="https://github.com/jaymoore/jay-moore-design/commits/main"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-accent-deep"
              >
                view commits
                <ArrowUpRight
                  size={12}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          BLOCK 3 — Depth list
          ============================================================ */}
      <section id="depth" className="scroll-mt-20 py-24">
        <div className="relative mx-auto max-w-[1120px] px-6">
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 hidden font-mono text-2xs uppercase tracking-[0.18em] text-fg-faint md:block"
            style={{ writingMode: "vertical-rl" }}
          >
            03 / Depth
          </span>

          <div className="md:pl-20">
            <p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
              — Where to go for depth
            </p>

            <DepthList />
          </div>
        </div>
      </section>
    </>
  );
}
