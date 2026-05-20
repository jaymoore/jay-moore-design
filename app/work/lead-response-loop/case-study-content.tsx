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
	{ label: "AI response time", value: "1.6s", sub: "well under the 3.5-second target" },
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
