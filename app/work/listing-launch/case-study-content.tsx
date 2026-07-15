import Link from "next/link";
import { FlowDiagram } from "./flow-diagram";
import { GateUnlock } from "./gate-unlock";
import { InlineFlag } from "./inline-flag";
import { DesignSystem } from "./design-system";

type Metric = { label: string; value: string; sub?: string };

const TLDR_METRICS: Metric[] = [
	{
		label: "Flow designed",
		value: "4 stages",
		sub: "won to live, end to end",
	},
	{
		label: "Stage built live",
		value: "Draft review",
		sub: "React, runs in the browser",
	},
	{
		label: "Compliance model",
		value: "Human-decided",
		sub: "flag the risk, don't auto-fix",
	},
];

type ValidationItem = { title: string; body: string };

const VALIDATION_ITEMS: ValidationItem[] = [
	{
		title: "Instrument the gate.",
		body: "Track how often agents override the AI's copy, its hero pick, and its compliance flag. High override on the flag means the detector is too noisy. Near-zero override on copy means agents are rubber-stamping, which is its own kind of risk.",
	},
	{
		title: "Build a labeled set for the detector.",
		body: "Hand-label real listings for fair-housing risk, run the detector against them, measure precision and recall. That's exactly how I validated the qualifier in Lead Response Loop to 96% on a labeled set. A flag that cries wolf gets ignored, and an ignored safety feature is worse than none.",
	},
	{
		title: "Measure the real outcome.",
		body: "Time from won to live, before and after. That's the number an agent actually feels.",
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
					Listing Launch.
				</h1>
				<p className="mt-6 max-w-[60ch] text-xl leading-relaxed text-fg sm:text-[1.375rem]">
					A tool that takes a real-estate listing from the moment an agent
					wins it to the moment it&rsquo;s live online, without the agent
					losing control of what goes public. The AI does the grunt work:
					copy, hero photo, compliance check. The agent approves every word
					before anything publishes.{" "}
					<strong className="text-accent">
						Show the human. Don&rsquo;t auto-send.
					</strong>
				</p>
			</header>

			<hr className="my-16 border-line" />

			{/* 01 — Problem */}
			<CaseSection num="01" id="problem" label="Problem">
				<SectionHeading
					eyebrow="Problem"
					title="The gap between won and live is where deals die."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					I shoot real estate on the side, so I live in the gap between an
					agent winning a listing and that listing going live: writing the
					copy, picking the hero photo, getting it into the MLS, the shared
					database every listing site pulls from. Days go by. On a fast
					market, days are deals.
				</p>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					The obvious fix is a chatbot that writes the listing and posts it.
					That fix is a liability. Real-estate copy is legally regulated, and
					the agent&rsquo;s license is on every word. So I designed a tool
					that does the grunt work and keeps the agent in control of the one
					thing they can&rsquo;t outsource.
				</p>
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 02 — Flow (stages + the design decisions they embody, merged) */}
			<CaseSection num="02" id="flow" label="Flow">
				<SectionHeading
					eyebrow="The flow, and the calls behind it"
					title="Four stages. Every consequential call stays human."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					The flow has four stages: capture the property facts, shoot the
					photos, draft the listing, then push it out to the listing sites. I
					designed the whole flow and went deepest where the risk lives: the
					draft. Each screen below carries the design decision it embodies.
				</p>
				<FlowDiagram />
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 03 — The gate unlock (interactive) */}
			<CaseSection num="03" id="gate-unlock" label="Try it">
				<SectionHeading
					eyebrow="The key interaction, live"
					title="The publish gate unlocks."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					This is the working prototype, not a mockup. Publish stays disabled
					until the fair-housing flag is handled. Resolve it, approve the
					listing, and watch it go live on every channel. Try the whole loop.
				</p>
				<GateUnlock />
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 04 — TL;DR */}
			<CaseSection num="04" id="tldr" label="TL;DR">
				<SectionHeading eyebrow="TL;DR" title="At a glance" />
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					A self-directed concept, fully anonymized. No real listing, agent,
					or property. The point of the project is how the interaction
					behaves, so I built that stage in working code instead of mocking
					it.
				</p>
				<MetricList tiles={TLDR_METRICS} />
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 05 — Inline flag (thought process) */}
			<CaseSection num="05" id="inline-flag" label="Inline flag">
				<SectionHeading
					eyebrow="The hardest call, in depth"
					title="Show the risk where the words live."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					The fair-housing flag was the hardest call. Language that describes
					the buyer instead of the home, like &ldquo;family-friendly&rdquo; or
					&ldquo;perfect for a young couple,&rdquo; can read as steering under
					the Fair Housing Act. That is real legal exposure, and it is
					legally the agent&rsquo;s call to make. There were three ways to
					surface a risky phrase. Only one keeps the decision with the agent.
				</p>
				<InlineFlag />
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 06 — Design system */}
			<CaseSection num="06" id="design-system" label="Design system">
				<SectionHeading
					eyebrow="Design system"
					title="The system behind the card."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					Trust-blue for the accent, deliberately not Realtor.com red. Green
					for confidence, amber for compliance risk, and a tight neutral ramp.
					Every component in the flow is built from these tokens.
				</p>
				<DesignSystem />
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 07 — Validation */}
			<CaseSection num="07" id="validation" label="Validation">
				<SectionHeading
					eyebrow="Validation"
					title="How I'd prove it works."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					This is a concept, so I have no shipped metrics, and I won&rsquo;t
					invent any. But I don&rsquo;t ship trust patterns on faith.
					Here&rsquo;s how I&rsquo;d validate it.
				</p>
				<div className="mt-8 flex flex-col gap-5">
					{VALIDATION_ITEMS.map((item) => (
						<div key={item.title} className="border-t border-line pt-4">
							<h3 className="text-base font-semibold text-fg">
								{item.title}
							</h3>
							<p className="mt-1 max-w-[60ch] text-base leading-relaxed text-fg-soft">
								{item.body}
							</p>
						</div>
					))}
				</div>
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 08 — Where next */}
			<section id="where-next" className="relative scroll-mt-20">
				<CaseSectionLabel num="08" label="Where next" />
				<div className="md:pl-20">
					<h2 className="font-mono text-2xs font-normal uppercase tracking-wider text-fg-faint">
						Where to go next
					</h2>
					<div className="mt-6 grid gap-4 sm:grid-cols-2">
						<Link
							href="/work/lead-response-loop"
							className="group flex flex-col rounded-md border border-line bg-panel p-6 transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:border-line-strong focus-visible:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
						>
							<span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
								Case study
							</span>
							<span className="mt-2 text-lg font-medium text-fg">
								Lead Response Loop
							</span>
							<span className="mt-2 text-sm text-fg-soft">
								The same conviction applied to missed calls: qualify the lead,
								show the owner, keep the human in the loop. Designed and built
								end to end.
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
							className="group flex flex-col rounded-md border border-line bg-panel p-6 transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:border-line-strong focus-visible:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
						>
							<span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
								Contact
							</span>
							<span className="mt-2 text-lg font-medium text-fg">
								Get in touch
							</span>
							<span className="mt-2 text-sm text-fg-soft">
								Open to Senior / Staff Product Designer roles. US remote.
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
   Section primitives — mirrored from lead-response-loop
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

function CaseSectionLabel({ num, label }: { num: string; label: string }) {
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
