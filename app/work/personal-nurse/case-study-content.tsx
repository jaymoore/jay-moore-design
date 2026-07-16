import Image from "next/image";
import Link from "next/link";

const IMG = "/case-study/personal-nurse";

type Metric = { label: string; value: string; sub?: string };

const TLDR_METRICS: Metric[] = [
	{
		label: "Directions explored",
		value: "4",
		sub: "scored against a 6-criteria matrix",
	},
	{
		label: "Contrast, worst pair",
		value: "3.9 → 7.2",
		sub: "measured WCAG pass, two token changes",
	},
	{
		label: "Screens designed",
		value: "12",
		sub: "three personas, one phone",
	},
];

/* ============================================================
   Direction gallery — one row per direction, image-first
   ============================================================ */

type Direction = {
	eyebrow: string;
	title: string;
	body: string;
	img: string;
	alt: string;
	hot?: boolean;
};

const DIRECTIONS: Direction[] = [
	{
		eyebrow: "Direction A · Soft Sanctuary 2.0",
		title: "Calm that ages with the patient's energy.",
		body: "The existing hypothesis, matured. Low-arousal periwinkle, tonal layering, pill shapes — plus a decay-aware idea: as the wait passes hour 2, 4, 6, type grows and choices shrink.",
		img: `${IMG}/direction-a`,
		alt: "Direction A: four periwinkle-and-cream phone screens — home with one big I'm at the ER button, active visit with a radial wait clock, nurse card, and family timeline",
	},
	{
		eyebrow: "Direction B · Paper Chart",
		title: "Trust through familiarity.",
		body: "Nurses parse paper charts for a living, so the app looks like a clinical document: ink on paper, ruled fields, uppercase section labels, one alert red. No motion at all.",
		img: `${IMG}/direction-b`,
		alt: "Direction B: four document-styled screens — packet-like home, visit record with monospace wait clock, an emergency room card with a red allergy band, and a family log",
	},
	{
		eyebrow: "Direction C · Warm Hearth",
		title: "A daughter's hand on the shoulder.",
		body: "Family companion, not medical tool. Terracotta and cream, rounded humanist type, copy that sounds like family. Presence is the core mechanic: who's watching, who claimed the call.",
		img: `${IMG}/direction-c`,
		alt: "Direction C: four warm terracotta screens — Hi Carol home with family avatars, a gentle suggestion card, a warm nurse card, and a family screen with claimed actions",
		hot: true,
	},
	{
		eyebrow: "Direction D · Warm Sanctuary",
		title: "C's layout, A's color, AAA discipline.",
		body: "A control experiment: keep C's conversational layout, swap in the accessible periwinkle system. It proved the warmth was in the voice and layout — not the terracotta.",
		img: `${IMG}/direction-d`,
		alt: "Direction D: the same four screen layouts as Direction C rendered in accessible periwinkle and cream",
	},
];

/* ============================================================
   Final system — patient journey, image-led alternating rows
   ============================================================ */

type Screen = {
	eyebrow: string;
	title: string;
	body: string;
	img: string;
	alt: string;
};

const PATIENT_SCREENS: Screen[] = [
	{
		eyebrow: "Screen 1 · Home",
		title: "One tap starts everything.",
		body: "No login, no menu maze. The screen exists for exactly one moment: the patient is at the ER and needs the app working for them. The family's avatars are right there — no one does this alone.",
		img: `${IMG}/screen-home.png`,
		alt: "Home screen: Hi Carol greeting, one large terracotta I'm at the ER button, three family avatars, and two quick links",
	},
	{
		eyebrow: "Screen 2 · Triage",
		title: "You can't get this wrong.",
		body: "Big-button branching grounded in ESI triage logic, one question per screen, first-person answers. It produces a plain-language summary for the nurse — what happened, never a diagnosis.",
		img: `${IMG}/screen-triage.png`,
		alt: "Triage screen: What happened? with five large answer buttons — I had a fall, my chest feels wrong, trouble breathing, pain somewhere else, something else",
	},
	{
		eyebrow: "Screen 3 · Setup",
		title: "Filled in on a good day.",
		body: "Hearing side, upright tolerance, what makes the fog set in — captured at leisure, at peak cognition. Every field feeds both the nurse card and the nudge rules. All of it optional.",
		img: `${IMG}/screen-setup.png`,
		alt: "Setup screen: hearing side chips, an upright-hours stepper reading 2 hours, three toggles, and a save button",
	},
	{
		eyebrow: "Screen 4 · Active visit",
		title: "The app carries the load.",
		body: "As the patient's energy drains over the wait, a deterministic rules engine — not an LLM — surfaces one gentle, timed nudge at a time. Comfort, logistics, communication. Never clinical advice; a guardrail test in code enforces it.",
		img: `${IMG}/screen-active.png`,
		alt: "Active visit screen: You're doing fine Carol, a suggestion card offering the words to ask for a recliner, and status choices including Worse — tell my family",
	},
	{
		eyebrow: "Screen 5 · Feeling worse",
		title: "The words, when they won't come.",
		body: "One tap tells the whole family, then hands the patient an exact script — or they hand the phone to the desk. The state is persistent and reversible, and they can see who is already acting.",
		img: `${IMG}/screen-worse.png`,
		alt: "Feeling worse screen: Your family knows banner, a show-this-or-say-this script card, an undo option, and live family responses",
	},
	{
		eyebrow: "Screen 6 · Discharge",
		title: "Seven questions, every visit.",
		body: "Straight from the paper packet this project started as: what was found, what changed, what means come straight back. Checked off in the room, sent to the family before the car leaves the lot.",
		img: `${IMG}/screen-discharge.png`,
		alt: "Discharge screen: Before you leave checklist of seven questions with two checked, and a send answers to my family button",
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
					Personal Nurse.
				</h1>
				<p className="mt-6 max-w-[60ch] text-xl leading-relaxed text-fg sm:text-[1.375rem]">
					A patient reaches the ER sharp, then drains over a 4–8 hour wait —
					forgetting what to ask exactly when asking matters most. I designed
					an app that front-loads their context while they&rsquo;re sharp,
					then advocates for them as they fade.{" "}
					<strong className="text-accent">
						The patient holds the phone. The app carries the load.
					</strong>
				</p>
			</header>

			<hr className="my-16 border-line" />

			{/* 01 — Problem */}
			<CaseSection num="01" id="problem" label="Problem">
				<SectionHeading
					eyebrow="Problem"
					title="The patient's voice fades over the exact hours it matters most."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					It began with customer zero — my own mother — but the product is for
					anyone facing a long ER wait. Existing tools — Medical ID, patient
					portals, panic buttons — are static records or emergency triggers.
					None carry the patient&rsquo;s context forward in time. The design
					problem in one picture:
				</p>
				<Figure
					src={`${IMG}/decay-diagram-v2.png`}
					alt="Diagram: the patient's capacity to self-advocate declines over eight hours while what the wait demands of them stays flat — the widening gap is what the app carries"
					width={1680}
					height={668}
					caption="Front-load context at hour 0. The app holds it and prompts the right small action at the right minute as the patient fades."
				/>
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 02 — Directions */}
			<CaseSection num="02" id="directions" label="Directions">
				<SectionHeading
					eyebrow="Exploration"
					title="Four directions, four philosophies."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					Each direction is a complete argument about what an anxious
					patient trusts — not a re-skin. All four carry the same five
					principles: front-load at peak cognition, one decision per screen,
					never give medical advice, work offline, and let the app do the
					remembering.
				</p>
				<div className="mt-12 flex flex-col gap-16">
					{DIRECTIONS.map((d) => (
						<DirectionRow key={d.eyebrow} d={d} />
					))}
				</div>
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 03 — Decision */}
			<CaseSection num="03" id="decision" label="Decision">
				<SectionHeading
					eyebrow="Evaluation"
					title="Scored against what the ER actually demands."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					Six criteria, from nurse scan-speed to low-vision contrast. Warm
					Hearth won on the human criteria and failed exactly one row:
					terracotta text measured 3.9:1 — under WCAG AA.
				</p>
				<Figure
					src={`${IMG}/evaluation-matrix-v2.png`}
					alt="Evaluation matrix scoring directions A, B and C across six criteria, with a recommendation card beneath"
					width={1680}
					height={629}
					caption="The matrix as decided. C selected — after a measured token pass closed its one open risk."
				/>
				<p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					The fix was measured, not eyeballed: I computed WCAG ratios for
					every color pair in the direction, deepened terracotta to #753C22
					and the secondary brown one step. Worst pair went{" "}
					<strong className="text-fg">3.9:1 → 7.2:1</strong>. Every text
					surface now clears AAA except the alert red, which holds AA. Two
					token changes — the warmth stayed.
				</p>
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 04 — Patient journey */}
			<CaseSection num="04" id="patient" label="Patient">
				<SectionHeading
					eyebrow="Final system · the patient's phone"
					title="Six screens, one decision each."
				/>
				<div className="mt-12 flex flex-col gap-16">
					{PATIENT_SCREENS.map((s, i) => (
						<ScreenRow key={s.eyebrow} s={s} flip={i % 2 === 1} />
					))}
				</div>
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 05 — The handoff */}
			<CaseSection num="05" id="handoff" label="Handoff">
				<SectionHeading
					eyebrow="Final system · the nurse"
					title="The design language switches when the phone changes hands."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					The project began as a hand-typed paper packet in my mother&rsquo;s
					purse. The system closes that loop: the patient&rsquo;s setup data
					renders as a warm card on screen and regenerates the letter-size
					packet for print — same record, two readers. Meds change, update
					once, reprint. The paper copy can never drift more than one print
					behind.
				</p>
				<div className="mt-12 grid gap-6 sm:grid-cols-2 md:gap-10">
					<figure>
						<div className="overflow-hidden rounded-md border border-accent bg-[#E7EAED] dark:bg-[#121619] p-5 sm:p-8">
							<Image
								src={`${IMG}/screen-nurse-card.png`}
								alt="Nurse card on the patient's phone: Hello I'm Carol band, a red please-know-first allergy card, why I'm here, and small things that help a lot"
								width={780}
								height={1688}
								sizes="(min-width: 768px) 460px, 100vw"
								className="h-auto w-full"
							/>
						</div>
						<figcaption className="mt-3 font-mono text-2xs uppercase tracking-wider text-fg-faint">
							On screen — warm, first-person, allergies first
						</figcaption>
					</figure>
					<figure>
						<div className="overflow-hidden rounded-md border border-line bg-[#E7EAED] dark:bg-[#121619] p-5 sm:p-8">
							<Image
								src={`${IMG}/packet-print.png`}
								alt="Printable letter-size ER packet auto-filled from the app: patient header, red allergy band, full medications table, baseline, and family call order"
								width={844}
								height={1056}
								sizes="(min-width: 768px) 460px, 100vw"
								className="h-auto w-full"
							/>
						</div>
						<figcaption className="mt-3 font-mono text-2xs uppercase tracking-wider text-fg-faint">
							On paper — chart language, generated from the same data
						</figcaption>
					</figure>
				</div>
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 06 — Family */}
			<CaseSection num="06" id="family" label="Family">
				<SectionHeading
					eyebrow="Final system · the family"
					title="Presence without a phone tree."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					Family joins by magic link — no app store, no account. A quiet
					state that says the patient is okay, and an escalation state where
					one person claims the action so three people don&rsquo;t all call
					the front desk at once.
				</p>
				<figure className="mt-8 max-w-[720px]">
					<div className="overflow-hidden rounded-md border border-line">
						<ThemedRowImage
							base={`${IMG}/family-row`}
							alt="Two family screens: a quiet live view with the patient's day so far and who's watching, and an escalation view with a claimed I've-got-this-one action"
							width={932}
							height={940}
						/>
					</div>
					<figcaption className="mt-3 font-mono text-2xs uppercase tracking-wider text-fg-faint">
						Quiet state and escalation state. Claiming a nudge is visible to
						everyone — coordination, not noise.
					</figcaption>
				</figure>
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 07 — System */}
			<CaseSection num="07" id="system" label="System">
				<SectionHeading
					eyebrow="Design system"
					title="The components behind the screens."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					56px minimum targets, one primary action per screen, status never
					carried by color alone. Lucide icons at 2.5px stroke, always
					paired with a label. Every pair&rsquo;s contrast ratio is
					documented in the tokens.
				</p>
				<Figure
					src={`${IMG}/components.png`}
					alt="Component sheet: four button variants, three status choices, and a Lucide icon row with usage notes"
					width={2048}
					height={322}
					caption="Buttons, status choices, iconography — the accessible-terracotta token set."
				/>
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 08 — TL;DR + status */}
			<CaseSection num="08" id="tldr" label="TL;DR">
				<SectionHeading eyebrow="TL;DR" title="At a glance" />
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					A self-initiated product for anyone facing a long ER wait — it
					began with my mother as customer zero — with the patient side
					already running as a client-only PWA (deterministic rules engine,
					offline, no account). This case study is the design system pass
					before the rebuild. All patient data shown is fictional.
				</p>
				<MetricList tiles={TLDR_METRICS} />
				<p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					The lesson I&rsquo;d hand another designer: the warmth was never
					decoration — it was the accessibility feature. Tech anxiety, not
					touch targets, is what keeps an overwhelmed patient from using an
					app in a crisis. And a contrast ratio is the cheapest usability
					test you&rsquo;ll ever run.
				</p>
			</CaseSection>

			<hr className="my-16 border-line" />

			{/* 09 — Where next */}
			<section id="where-next" className="relative scroll-mt-20">
				<CaseSectionLabel num="09" label="Where next" />
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
								Missed calls into bookings — qualify the lead, show the
								owner, keep the human in the loop. Designed and built end to
								end.
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
   Image rows
   ============================================================ */

function ThemedRowImage({
	base,
	alt,
	width,
	height,
}: {
	base: string;
	alt: string;
	width: number;
	height: number;
}) {
	// Light/dark backgrounds are baked into the exports (#E7EAED / #121619);
	// the pair swaps with the html.dark class.
	return (
		<>
			<Image
				src={`${base}-light.png`}
				alt={alt}
				width={width}
				height={height}
				sizes="(min-width: 1120px) 1072px, 100vw"
				className="block h-auto w-full dark:hidden"
			/>
			<Image
				src={`${base}-dark.png`}
				alt={alt}
				width={width}
				height={height}
				sizes="(min-width: 1120px) 1072px, 100vw"
				className="hidden h-auto w-full dark:block"
			/>
		</>
	);
}

function DirectionRow({ d }: { d: Direction }) {
	const image = (
		<div
			className={`overflow-hidden rounded-md border ${
				d.hot ? "border-accent" : "border-line"
			}`}
		>
			<ThemedRowImage base={d.img} alt={d.alt} width={1800} height={940} />
		</div>
	);
	return (
		<div>
			<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
				{d.eyebrow}
				{d.hot && <span className="ml-3 text-accent">Selected</span>}
			</p>
			<h3 className="mt-2 text-xl font-semibold leading-tight tracking-tight text-fg">
				{d.title}
			</h3>
			<p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
				{d.body}
			</p>
			<div className="mt-6">{image}</div>
		</div>
	);
}

function ScreenRow({ s, flip }: { s: Screen; flip: boolean }) {
	const image = (
		<div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-md border border-line bg-[#E7EAED] dark:bg-[#121619] p-5 sm:p-8">
			<Image
				src={s.img}
				alt={s.alt}
				width={780}
				height={1688}
				sizes="(min-width: 768px) 360px, 80vw"
				className="h-auto w-full"
			/>
		</div>
	);
	const text = (
		<div>
			<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
				{s.eyebrow}
			</p>
			<h3 className="mt-2 text-xl font-semibold leading-tight tracking-tight text-fg">
				{s.title}
			</h3>
			<p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
				{s.body}
			</p>
		</div>
	);
	return (
		<div className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
			{flip ? (
				<>
					<div className="order-2 md:order-1">{text}</div>
					<div className="order-1 md:order-2">{image}</div>
				</>
			) : (
				<>
					{image}
					{text}
				</>
			)}
		</div>
	);
}

function Figure({
	src,
	alt,
	width,
	height,
	caption,
	narrow,
}: {
	src: string;
	alt: string;
	width: number;
	height: number;
	caption: string;
	narrow?: boolean;
}) {
	return (
		<figure className={`mt-8 ${narrow ? "max-w-[720px]" : ""}`}>
			<div className="overflow-hidden rounded-md border border-line bg-[#E7EAED] dark:bg-[#121619] p-4 sm:p-8">
				<Image
					src={src}
					alt={alt}
					width={width}
					height={height}
					sizes="(min-width: 1120px) 1072px, 100vw"
					className="h-auto w-full"
				/>
			</div>
			<figcaption className="mt-3 font-mono text-2xs uppercase tracking-wider text-fg-faint">
				{caption}
			</figcaption>
		</figure>
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
