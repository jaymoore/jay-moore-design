import Link from "next/link";
import { Simulator } from "./simulator";
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

type EvalRow = {
  metric: string;
  result: string;
  target: string;
  status: string;
};

const EVAL_ROWS: EvalRow[] = [
  { metric: "Label accuracy", result: "96% · 48/50", target: "≥ 85%", status: "Pass" },
  {
    metric: "Urgency accuracy",
    result: "74% · 37/50",
    target: "≥ 75%",
    status: "Off by 1",
  },
  { metric: "P50 LLM latency", result: "1.3s", target: "—", status: "—" },
  { metric: "P95 LLM latency", result: "1.6s", target: "≤ 3.5s", status: "Pass" },
  {
    metric: "Spam (pre-filter + LLM)",
    result: "8/8",
    target: "—",
    status: "Pass",
  },
];

type BuildLogEntry = {
  num: number;
  day: string;
  title: string;
  body: React.ReactNode;
  refs: string;
};

const BUILD_LOG: BuildLogEntry[] = [
  {
    num: 1,
    day: "D1",
    title: "Scaffold + D1 schema",
    body: "Wrangler + Vitest scaffold, 6-table D1 schema (calls, messages, classifications, owner_decisions, bookings, opt_outs).",
    refs: "simplepathmedia/auto-lead-response-loop @ 80cb46c, a9de39f",
  },
  {
    num: 2,
    day: "D2",
    title: "Twilio webhook reliability",
    body: "HMAC-SHA1 sig-verify (test vector quoted in the plan was stale — verified correct value against the twilio npm package), KV-backed idempotency, retry-registry with exponential backoff.",
    refs: "f926d13, e44065b, 77340b3",
  },
  {
    num: 3,
    day: "D2",
    title: "Missed-call → text-back loop",
    body: "POST /webhooks/twilio/call-status fires SMS text-back within 60s on no-answer / busy / failed. Telemetry: every event correlation-id'd to D1.",
    refs: "c6009ea, d3c00b1",
  },
  {
    num: 4,
    day: "D3",
    title: "Spam pre-filter (Decision 2 anchor)",
    body: "30-line regex pre-filter for 4 high-confidence patterns. Short-circuits ~20% of inbound before paying for inference.",
    refs: "c7695a2",
  },
  {
    num: 5,
    day: "D3",
    title: "LLM qualifier + frozen contract (Decision 3 anchor)",
    body: "Claude Haiku with tool-use schema. QualifierOutput shape frozen at v1, shipped with X-Schema-Version header on every response.",
    refs: "7646e3f",
  },
  {
    num: 6,
    day: "D3",
    title: "POST /qualify sync endpoint",
    body: "Bearer-token auth, 5s timeout, schema-enforced output. Same code path the inbound webhook uses internally.",
    refs: "6c4fcc6",
  },
  {
    num: 7,
    day: "D3",
    title: "Inbound SMS → qualify → log",
    body: "webhooks/twilio/sms-inbound integrates pre-filter + qualifier + opt-out + STOP/HELP keyword detection + classification logging.",
    refs: "9f789bb",
  },
  {
    num: 8,
    day: "D4",
    title: "Owner notification + reply loop",
    body: "Single-keyword YES/NO/INFO interface over SMS. Cal.com link sent on YES. Escalation scheduled on every notification.",
    refs: "a6d8abd, b6dd3cb, c4cf42e",
  },
  {
    num: 9,
    day: "D5",
    title: "Eval harness + v1 prompt result (Section 06 anchor)",
    body: "50 labeled examples, confusion matrix, P50/P95 latency. v1 prompt landed at 96% label accuracy / 74% urgency accuracy.",
    refs: "01eabe9, 177a8f2",
  },
  {
    num: 10,
    day: "D5",
    title: "Observability + cron + Resend",
    body: "GET /metrics/public aggregate endpoint, CF Cron Trigger every 60s for retry-replay + escalation processing, Resend email escalation on 3-strike failure.",
    refs: "da2795f, 7ed891c",
  },
  {
    num: 11,
    day: "D8",
    title: "Case study URL rename + simulator skeleton",
    body: "/work/spm-lifecycle → /work/lead-response-loop. State machine + UI panes scaffolded under the rename.",
    refs: "jaymoore/jay-moore-design @ 3302418, 53154f5",
  },
  {
    num: 12,
    day: "D9",
    title: "Simulator → /qualify proxy (Decision 3 reversal landed)",
    body: "Replaced the planned direct-Claude call from the simulator with a Server Action proxy to the product's /qualify endpoint. One source of truth across both code paths.",
    refs: "98841c7",
  },
  {
    num: 13,
    day: "D10",
    title: "Case study prose, sections 00–09",
    body: "Lede, TL;DR, Problem, Approach, Decisions (including one reversal narrative), Evaluation, Outcomes (in-build framing), Roadmap. Each commit Codex-reviewed pre-merge.",
    refs: "43b88bd, 7d39483, 5ade780",
  },
];

type RoadmapItem = { title: string; body: string };

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    title: "Website form follow-up",
    body: "Same loop, different intake — a contact-form submission instead of a missed call. Trivial extension once the qualifier and notifier are in place.",
  },
  {
    title: "Owner-facing web dashboard",
    body: "v1 is SMS-only on the owner side. A web view becomes useful at ~10+ leads/day or when the owner wants to delegate YES/NO/INFO decisions to office staff. Multi-tenant infrastructure precedes this.",
  },
  {
    title: "Weekly lead-recovery report",
    body: "Email digest: total calls, recovery rate, conversion, top failure modes. Mostly a SQL-from-D1 + Resend send. Half a day of work.",
  },
  {
    title: "AI receptionist",
    body: "Voice channel — answer the call instead of letting it ring out. Different stack (Vapi or Retell), different conversation model, different latency budget. Its own sprint, post-beta-revenue.",
  },
];

export async function CaseStudyContent() {
  const { data: metrics, source } = await getMetricsSnapshot();
  const outcomesTiles: Metric[] = [
    {
      label: "Total calls handled",
      value: metrics.total_calls.toString(),
      sub:
        metrics.total_calls === 0
          ? "onboarding pending"
          : `${metrics.qualified_pct}% qualified`,
    },
    {
      label: "P95 LLM latency",
      value:
        metrics.latency_p95_ms > 0
          ? `${(metrics.latency_p95_ms / 1000).toFixed(1)}s`
          : "—",
      sub:
        metrics.latency_p95_ms > 0
          ? `P50 ${(metrics.latency_p50_ms / 1000).toFixed(1)}s`
          : "onboarding pending",
    },
    {
      label: "Beta partner days live",
      value:
        metrics.beta_partner_days_live > 0
          ? metrics.beta_partner_days_live.toString()
          : "0",
      sub:
        metrics.beta_partner_days_live > 0
          ? "since first call"
          : "onboarding pending",
    },
  ];

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
        <SectionHeading
          eyebrow="Approach"
          title="A multi-agent loop with a frozen output contract."
        />
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          The system has four agents working in sequence: an intake handler that
          catches missed calls and fires a text-back within seconds; a
          deterministic pre-filter that catches obvious spam before paying for
          inference; a Claude Haiku classifier that returns a structured verdict
          with confidence and evidence quotes; and an owner-side notifier that
          surfaces a single-keyword decision (YES / NO / INFO) over SMS. The loop is
          event-sourced — every step writes a correlation-id&rsquo;d row to D1 —
          so a downstream consumer can replay any moment.
        </p>

        <ArtifactPanel type="diagram" caption="System architecture (TBD)" />

        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          The single most important interface in the system is the
          qualifier&rsquo;s JSON output. It&rsquo;s frozen at <code>v1</code> and
          shipped with a version header on every response, because three
          different callers — the production webhook handler, the public{" "}
          <code>POST /qualify</code> endpoint, and the simulator on this page —
          all consume the same shape. Drift between any two of those would be a
          hidden product bug.
        </p>

        <ArtifactPanel
          type="code"
          caption="Qualifier output schema (TypeScript)"
        />

        <ArtifactPanel
          type="screenshot"
          caption="Sample qualification trace (anonymized)"
        />
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 04 — Demo */}
      <CaseSection num="04" id="demo" label="Demo">
        <SectionHeading
          eyebrow="Demo"
          title="Run the loop on the page."
        />
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          Pick a scenario below. The simulator dispatches a sequence of events
          that mirrors the production webhook flow — missed call, text-back,
          prospect reply, pre-filter (with LLM classification on what passes),
          owner notification. The classification call hits the product&rsquo;s
          real{" "}
          <code>POST /qualify</code> endpoint when wired in production; falls
          back to a cached canned output here while the beta partner
          deployment is in onboarding. Either way it&rsquo;s the same JSON
          schema (<code>X-Schema-Version: v1</code>).
        </p>
        <Simulator />
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 05 — Decisions */}
      <CaseSection num="05" id="decisions" label="Decisions">
        <SectionHeading
          eyebrow="Decisions"
          title="Four calls. One reversal."
        />

        <Decision title="Decision-support over full automation">
          The first instinct on an AI-classified lead pipeline is to auto-route
          confident matches. Push them to Cal.com without bothering the owner;
          auto-dismiss spam; <code>manual_review</code> only for the ambiguous
          middle. In practice, every false-positive auto-route is a wasted slot
          the owner has to apologize for. v1 is decision-support: the owner sees
          a one-line SMS with label, confidence, evidence quote, and three
          keystrokes (YES / NO / INFO) gate every send. The training data —
          owner&rsquo;s explicit YES/NO against the classifier&rsquo;s{" "}
          <code>recommended_action</code> — feeds the next prompt iteration.
          Trust accrues incrementally; never decays from a single bad auto-send.
        </Decision>

        <Decision title="Deterministic pre-filter before LLM">
          Roughly 20% of inbound to a US business phone is spam. There&rsquo;s no
          reason to pay for inference on a &ldquo;Congratulations you won $5000
          bit.ly/abc&rdquo;. A 30-line regex pre-filter catches four
          high-confidence patterns (shortened URLs, lottery-style claims,
          adult-spam keywords, get-rich-quick) and short-circuits the LLM.
          Ambiguous cases always go to the LLM. Tradeoff: regex is brittle and
          won&rsquo;t catch novel spam; the eval harness covers this gap with 8
          spam examples in the labeled test set and a confusion-matrix view on
          every prompt iteration.
        </Decision>

        <Decision title="Frozen LLM output contract (the reversal)">
          Original plan: the portfolio simulator calls Claude directly via a
          Next.js Server Action. Faster to wire up; one Anthropic key in two
          places. Codex review caught the drift risk: two independent inference
          implementations will diverge, producing different outputs for
          identical inputs. Reversed mid-build. Now the product exposes{" "}
          <code>POST /qualify</code> (sync endpoint) and the simulator proxies
          through a Server Action that forwards to that endpoint. Same prompt
          version, same JSON schema, same code path. Costs an extra HTTP hop on
          every simulator run; gains one source of truth. Schema is versioned in
          the response header (<code>X-Schema-Version: v1</code>) so future
          revisions are explicit.
        </Decision>

        <Decision title="60-second end-to-end latency budget">
          Missed-call recovery has a hard UX constraint: the first text-back
          should land within 60 seconds of call end. The controllable budget is
          tight — ~2s for classification and ~5s for persistence plus outbound
          send, with Twilio network time outside direct control. Current eval
          shows classifier P95 at 1.6s, leaving headroom. If Anthropic times
          out, the route degrades to manual review and forwards the raw caller
          message to the owner. Slower, but the loop never drops a lead
          silently.
        </Decision>
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 06 — Evaluation */}
      <CaseSection num="06" id="evaluation" label="Evaluation">
        <SectionHeading
          eyebrow="Evaluation"
          title="How I know this works."
        />
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          50 labeled examples in <code>eval/test-set.jsonl</code> — 15 urgent,
          15 standard, 12 not_a_fit, 8 spam, 5 edge cases (very-short,
          multi-language, partial info, sarcasm, multi-issue). The harness runs
          the same code path the production webhook uses (pre-filter → Claude
          Haiku with the v1 prompt + tool-use schema), records label +
          confidence + evidence + extracted fields, and emits a confusion
          matrix.
        </p>

        <div className="mt-8 max-w-[720px] overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-bg-2">
              <tr>
                <th className="px-4 py-3 text-left font-mono text-2xs uppercase tracking-wider text-fg-soft">
                  Metric
                </th>
                <th className="px-4 py-3 text-left font-mono text-2xs uppercase tracking-wider text-fg-soft">
                  Result
                </th>
                <th className="px-4 py-3 text-left font-mono text-2xs uppercase tracking-wider text-fg-soft">
                  Target
                </th>
                <th className="px-4 py-3 text-left font-mono text-2xs uppercase tracking-wider text-fg-soft">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {EVAL_ROWS.map((row, i) => (
                <tr
                  key={row.metric}
                  className={i > 0 ? "border-t border-line" : undefined}
                >
                  <td className="px-4 py-3 text-fg">{row.metric}</td>
                  <td className="px-4 py-3 font-mono text-fg">{row.result}</td>
                  <td className="px-4 py-3 font-mono text-fg-soft">
                    {row.target}
                  </td>
                  <td className="px-4 py-3 font-mono text-2xs uppercase tracking-wider text-fg-soft">
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          The urgency miss is one case: &ldquo;help&rdquo; alone (edge{" "}
          <code>e1</code>) classifies as <code>not_a_fit</code> with{" "}
          <code>none</code> urgency. The test set author tagged it{" "}
          <code>urgent</code>. Both readings are defensible — one-word
          &ldquo;help&rdquo; is ambiguous in production too — so v1 ships at 74%
          with the edge case documented rather than gaming either side until
          the number passes.
        </p>

        <h3 className="mt-12 font-mono text-2xs font-normal uppercase tracking-wider text-fg-faint">
          False-positive / false-negative policy
        </h3>
        <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          False positives (LLM flags a real lead as spam) are worse than false
          negatives (LLM passes spam through to the owner). The owner dismisses
          spam in one keystroke; a misclassified real lead silently drops.
          Confidence &lt; 0.5 always routes to <code>manual_review</code>,
          surfacing the raw message to the owner regardless of label.
        </p>

        <h3 className="mt-12 font-mono text-2xs font-normal uppercase tracking-wider text-fg-faint">
          SLO targets at v1
        </h3>
        <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          Label accuracy ≥ 85% (met). P95 latency ≤ 3.5s (met). Uptime —
          measured once beta partner is live (pending).
        </p>
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 07 — Outcomes */}
      <CaseSection num="07" id="outcomes" label="Outcomes">
        <SectionHeading eyebrow="Outcomes" title="In build, measured honestly." />
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          The product is live in a single-tenant configuration against a Twilio
          test number. Production telemetry — call counts, classification
          accuracy on real prospects, owner decision rate, booking conversion —
          lands once beta partner onboarding completes (week of measurement,
          pending Twilio A2P 10DLC approval). Until then the numbers in
          Section 06 are the eval-harness numbers, not real-world.
        </p>

        <h3 className="mt-12 font-mono text-2xs font-normal uppercase tracking-wider text-fg-faint">
          Eval-harness ≠ real-world
        </h3>
        <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          The harness measures classifier behavior on a researcher-authored test
          set. Production will surface failure modes the test set didn&rsquo;t
          anticipate — accent + speech-to-text typos in caller SMS, multi-message
          conversations the v1 prompt assumes are single-turn, weird Twilio
          webhook ordering. The eval gives a floor, not a ceiling.
        </p>

        <h3 className="mt-12 font-mono text-2xs font-normal uppercase tracking-wider text-fg-faint">
          What changed about my own thinking during the build
        </h3>
        <ul className="mt-3 ml-6 max-w-[60ch] list-disc space-y-3 text-lg leading-relaxed text-fg-soft marker:text-fg-faint">
          <li>
            The biggest correction was the frozen output contract (Section 05,
            Decision 3). Codex caught it before the simulator&rsquo;s inference
            path shipped. The &ldquo;one source of truth&rdquo; principle was
            internalized in the abstract but lost track of in the moment because
            direct Claude calls in the simulator were the faster wire-up. The
            discipline shows up most when it&rsquo;s inconvenient.
          </li>
          <li>
            The eval harness was scoped as a stretch goal. Once it existed
            (Day 5), it changed how I evaluated prompt revisions — vibes vs.
            confusion matrix. v2 of the qualifier prompt won&rsquo;t ship
            without a re-run.
          </li>
        </ul>

        <dl className="mt-10 max-w-[640px] rounded-md border border-line bg-panel">
          {outcomesTiles.map((m, i) => (
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
        <p className="mt-4 max-w-[640px] font-mono text-2xs text-fg-faint">
          Telemetry refreshes every 6 hours via scheduled GitHub Action against{" "}
          <code>/metrics/public</code>. Current render:{" "}
          {source === "live" ? (
            <span>live (snapshot for ISR)</span>
          ) : (
            <span>cached snapshot fallback (endpoint not yet configured)</span>
          )}
          . Eval accuracy on labeled test set: {Math.round(metrics.accuracy_on_labeled_set * 100)}%.
        </p>
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 08 — Build log */}
      <CaseSection num="08" id="build-log" label="Build log">
        <SectionHeading
          eyebrow="Build log"
          title="14 days of decisions, in order."
        />
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          14 days, two repos (
          <code>simplepathmedia/auto-lead-response-loop</code> for the product,
          <code>jaymoore/jay-moore-design</code> for the case study
          you&rsquo;re reading), shipped against the original plan with one
          major mid-flight reversal. Curated — not diary. Each entry is
          anchored from a section above.
        </p>

        <ol className="mt-10 max-w-[840px] space-y-8">
          {BUILD_LOG.map((entry) => (
            <li
              key={entry.num}
              id={`bl-${entry.num}`}
              className="scroll-mt-20 border-t border-line pt-6"
            >
              <h3 className="text-base font-medium text-fg">
                <span className="mr-3 font-mono text-2xs uppercase tracking-wider text-fg-faint">
                  {entry.day} · {String(entry.num).padStart(2, "0")}
                </span>
                {entry.title}
              </h3>
              <p className="mt-2 max-w-[60ch] text-base leading-relaxed text-fg-soft">
                {entry.body}
              </p>
              <p className="mt-2 font-mono text-2xs uppercase tracking-wider text-fg-faint">
                {entry.refs}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          Two failures worth naming: the plan&rsquo;s quoted Twilio sig-verify
          test vector was wrong (caught Day 2 via Node crypto cross-check). And{" "}
          <code>vi.mock</code> doesn&rsquo;t work in{" "}
          <code>@cloudflare/vitest-pool-workers</code> — caught when the
          call-status test silently swallowed the mock. Both surfaced because
          tests were authored before the implementation. The TDD discipline
          isn&rsquo;t aesthetic.
        </p>
      </CaseSection>

      <hr className="my-16 border-line" />

      {/* 09 — Roadmap */}
      <CaseSection num="09" id="roadmap" label="Roadmap">
        <SectionHeading
          eyebrow="Roadmap"
          title="Out of scope for v1. On the queue."
        />

        {ROADMAP_ITEMS.map((item) => (
          <div key={item.title} className="mt-8 border-t border-line pt-6">
            <h3 className="font-mono text-2xs font-normal uppercase tracking-wider text-fg-faint">
              {item.title}
            </h3>
            <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
              {item.body}
            </p>
          </div>
        ))}

        <h3 className="mt-12 font-mono text-2xs font-normal uppercase tracking-wider text-fg-faint">
          Quality queue
        </h3>
        <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
          Prompt iteration v2 (target <code>urgency_accuracy</code> ≥ 80%); more
          eval examples (currently 50, target 200); per-partner business profile
          editor; formal TCPA compliance review.
        </p>
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
   Decision — used in section 05 to render a tradeoff narrative
   with a sticky title and a single body paragraph.
   ============================================================ */

function Decision({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10 border-t border-line pt-6">
      <h3 className="text-base font-medium text-fg">
        {title}
      </h3>
      <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
        {children}
      </p>
    </div>
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
        role="img"
        aria-label={`Placeholder for ${caption}`}
      >
        <span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
          [{typeLabel} placeholder]
        </span>
      </div>
    </figure>
  );
}
