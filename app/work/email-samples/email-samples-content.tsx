import { EmailPreview } from "./email-preview";
import { SocialSet } from "./social-set";

type Note = { title: string; body: string };

const EMAIL_SAFE: Note[] = [
	{
		title: "Tables for layout",
		body: "Nested tables with role=\"presentation\", so screen readers skip the structure and older clients keep the grid.",
	},
	{
		title: "Inline CSS first",
		body: "Every visual style lives on the element. The head block only adds what can't be inlined: the mobile query and dark mode.",
	},
	{
		title: "Mobile-first stacking",
		body: "Two story columns sit side by side at 600px and stack into one on narrower screens.",
	},
	{
		title: "Bulletproof button",
		body: "A padded link for most clients, with a VML fallback so Outlook on Windows still draws a real button.",
	},
	{
		title: "Images-off safe",
		body: "The header is live text, not a logo image, and every image has alt text that describes it.",
	},
	{
		title: "Dark mode",
		body: "A color-scheme meta tag plus a tuned dark palette, so clients that invert colors get choices I made instead of guesses.",
	},
];

const LOCKED: Note[] = [
	{
		title: "Brand bar and header",
		body: "The identity lives here. It stays fixed so every send is recognizable in a crowded inbox.",
	},
	{
		title: "Type styles",
		body: "Headline, body, and link styles are set in the code. Writers fill a slot; they never pick a font or a size.",
	},
	{
		title: "Footer",
		body: "Address, preferences, and unsubscribe. Required on every send, so nobody can delete it by accident.",
	},
];

const EDITABLE: Note[] = [
	{
		title: "Hero image",
		body: "Swap the image at the same proportions. Alt text is required, not optional.",
	},
	{
		title: "Headline and lead story",
		body: "One headline, one short lead paragraph. The type style comes with the slot.",
	},
	{
		title: "Primary CTA",
		body: "One button per send. The label and link change; the color and shape do not.",
	},
	{
		title: "Story blocks",
		body: "Two stories, each with an image, a title, a two-line summary, and a link.",
	},
	{
		title: "Event callout",
		body: "Optional. Remove the row when there is no event to promote.",
	},
];

export function EmailSamplesContent() {
	return (
		<article className="mx-auto w-full max-w-[1120px] px-6 py-24">
			<header>
				<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
					Samples · concept work
				</p>
				<h1 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-4xl">
					Email and marketing design.
				</h1>
				<p className="mt-6 max-w-[60ch] text-xl leading-relaxed text-fg">
					Three pieces for one fictional organization, the Larkspur
					Institute for Health Research: a responsive newsletter, the same
					newsletter as a template a team can maintain, and a social set
					with a brand rule sheet.{" "}
					<strong className="text-accent">
						All of it is concept work. No real clients, no real data.
					</strong>
				</p>
				<p className="mt-6 max-w-[60ch] font-mono text-2xs uppercase leading-relaxed tracking-wider text-fg-faint">
					Hand-built HTML email: 600px tables, inline CSS, a mobile stacking
					query. Previewed at 600px and 375px.
				</p>
			</header>

			<hr className="my-16 border-line" />

			<Section num="01" id="newsletter" label="Newsletter">
				<SectionHeading
					eyebrow="Responsive newsletter · concept"
					title="A monthly newsletter, in real email HTML."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					Email HTML is its own discipline: no flexbox, no grid, and
					clients that strip half your CSS. This is the kind of code that
					survives that. Switch the width to see the columns stack, then
					open the source.
				</p>
				<NoteGrid notes={EMAIL_SAFE} />
				<EmailPreview
					mode="email"
					title="Concept newsletter for the fictional Larkspur Institute"
				/>
			</Section>

			<hr className="my-16 border-line" />

			<Section num="02" id="template" label="Template">
				<SectionHeading
					eyebrow="Template anatomy · concept"
					title="The same email, as a template a team can maintain."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					A template earns its keep when someone else can send next
					month&rsquo;s issue without calling the designer. Locked regions
					carry the brand and the legal requirements. Editable slots carry
					what changes each send. The source for sample 01 marks every
					region with a comment, so the rules travel with the code.
				</p>
				<div className="mt-2 grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,664px)_1fr]">
					<EmailPreview
						mode="template"
						title="Template view of the concept newsletter with locked and editable regions labeled"
					/>
					<div className="xl:mt-20">
						<RegionList kind="locked" notes={LOCKED} />
						<RegionList kind="editable" notes={EDITABLE} />
					</div>
				</div>
			</Section>

			<hr className="my-16 border-line" />

			<Section num="03" id="social" label="Social">
				<SectionHeading
					eyebrow="Social set · concept"
					title="One announcement, three sizes, one rule sheet."
				/>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
					The event from the newsletter, sized for a feed post, a tall feed
					post, and a link share. Built in HTML and CSS with one set of
					type sizes, so all three scale from the same numbers. The rule
					sheet is what I&rsquo;d hand the team so the next event looks
					like this one.
				</p>
				<SocialSet />
			</Section>
		</article>
	);
}

function NoteGrid({ notes }: { notes: Note[] }) {
	return (
		<dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
			{notes.map((n) => (
				<div key={n.title} className="border-t border-line pt-4">
					<dt className="text-base font-semibold text-fg">{n.title}</dt>
					<dd className="mt-1 text-sm leading-relaxed text-fg-soft">
						{n.body}
					</dd>
				</div>
			))}
		</dl>
	);
}

function RegionList({
	kind,
	notes,
}: {
	kind: "locked" | "editable";
	notes: Note[];
}) {
	const locked = kind === "locked";
	return (
		<div className={locked ? "" : "mt-8"}>
			<p className="flex items-center gap-2 font-mono text-2xs uppercase tracking-wider text-fg-soft">
				<span
					aria-hidden
					className={`inline-block h-3 w-3 rounded-[2px] border-2 ${
						locked ? "border-fg bg-fg/10" : "border-dashed border-accent"
					}`}
				/>
				{locked ? "Locked regions" : "Editable slots"}
			</p>
			<ul className="mt-3 flex flex-col gap-4">
				{notes.map((n) => (
					<li key={n.title} className="border-t border-line pt-3">
						<p className="text-base font-semibold text-fg">{n.title}</p>
						<p className="mt-1 text-sm leading-relaxed text-fg-soft">
							{n.body}
						</p>
					</li>
				))}
			</ul>
		</div>
	);
}

/* Section primitives, mirrored from the listing-launch case study. */

function Section({
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
			<span
				aria-hidden
				className="pointer-events-none absolute left-0 top-0 hidden font-mono text-2xs uppercase tracking-[0.18em] text-fg-faint md:block"
				style={{ writingMode: "vertical-rl" }}
			>
				{num} / {label}
			</span>
			<div className="md:pl-20">{children}</div>
		</section>
	);
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
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
