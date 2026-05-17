import { ArrowUpRight } from "lucide-react";
import { DepthList } from "@/components/depth-list";
import { TrustSurface } from "@/components/trust-surface";

export default function Home() {
  return (
    <>
      {/* ============================================================
          BLOCK 1 — Positioning
          ============================================================ */}
      <section
        id="start"
        className="relative scroll-mt-20 py-24"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-6 top-24 font-mono text-2xs uppercase tracking-[0.18em] text-fg-faint"
          style={{ writingMode: "vertical-rl" }}
        >
          01 / Positioning
        </span>

        <div className="mx-auto max-w-[1120px] pl-20 pr-6">
          <p className="max-w-[50ch] font-mono text-2xs uppercase tracking-wider text-fg-faint">
            Interaction designer who codes. 10 yrs in complex software UX, now
            shipping it in React.
          </p>

          <h1 className="mt-6 text-3xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-4xl md:text-5xl">
            Design engineer for{" "}
            <span className="text-accent">AI-native</span> workflows.
          </h1>

          <p className="mt-8 max-w-[60ch] text-base text-fg-soft">
            I build the trust surfaces, the streaming UI, and the agentic
            fallbacks — the seam between design and engineering on products
            where the AI has to stay legible to the person using it.
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
                Staff / Principal DE · US remote
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ============================================================
          BLOCK 2 — Live demo / hero slot
          ============================================================ */}
      <section
        id="demo"
        className="relative scroll-mt-20 py-24"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-6 top-24 font-mono text-2xs uppercase tracking-[0.18em] text-fg-faint"
          style={{ writingMode: "vertical-rl" }}
        >
          02 / Live demo
        </span>

        <div className="mx-auto max-w-[1120px] pl-20 pr-6">
          <p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
            — Live demo — the hero object
          </p>

          <h2 className="mt-4 text-2xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-3xl">
            Trust surface — confidence, evidence, override
          </h2>

          <p className="mt-6 max-w-[60ch] text-base text-fg-soft">
            When the model is uncertain, show the receipts. Override beats
            obedience — the operator decides, and the disagreement becomes
            training data.
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
              href="#"
              className="inline-flex items-center gap-1 text-accent transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-accent-deep"
            >
              view PR
              <ArrowUpRight
                size={12}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          BLOCK 3 — Depth list
          ============================================================ */}
      <section
        id="depth"
        className="relative scroll-mt-20 py-24"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-6 top-24 font-mono text-2xs uppercase tracking-[0.18em] text-fg-faint"
          style={{ writingMode: "vertical-rl" }}
        >
          03 / Depth
        </span>

        <div className="mx-auto max-w-[1120px] pl-20 pr-6">
          <p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
            — Where to go for depth
          </p>

          <DepthList />
        </div>
      </section>
    </>
  );
}
