import Image from "next/image";

type Stage = {
	eyebrow: string;
	title: string;
	body: string;
	tag?: string;
	img: string;
	alt: string;
	hot?: boolean;
	cta?: { label: string; href: string };
};

// Flow + design decisions merged: each stage row carries the design call it
// embodies, illustrated by its actual screen. Alternating sides, LRL IxItem style.
const STAGES: Stage[] = [
	{
		eyebrow: "Stage 1 · Intake",
		title: "Capture the facts once.",
		body: "The agent enters the property facts and books the photo shoot in one step. Beds, baths, square footage, year built, shoot notes. These are not just form fields. They become the exact sources the AI drafts from, and cites, later.",
		img: "/case-study/listing-launch/stage-1-intake.png",
		alt: "Intake form: property address, beds and baths, size, year built, shoot date, and shoot notes, ending in a Submit & request shoot button",
	},
	{
		eyebrow: "Stage 2 · Shoot",
		title: "The agent picks the set.",
		body: "Twelve photos come back and the agent picks the eight that sell the home. Later, the AI suggests a hero shot from this set. Here it picked the renovated kitchen over the front of the house, because the kitchen is what sells this home. It is marked as a suggestion the agent can override in one tap. The machine has an opinion. The agent has the final say.",
		img: "/case-study/listing-launch/stage-2-shoot-v2.png",
		alt: "Photo selection grid: 12 listing photos with 8 selected, an AI pick · Hero badge on the kitchen, and a Use these 8 → Draft listing button",
	},
	{
		eyebrow: "Stage 3 · Draft",
		title: "The AI drafts. It never publishes.",
		body: "The easy version auto-posts the listing. That is a lawsuit waiting to happen, with the agent's license on every word. So the AI drafts the copy, leads with a confidence score and the exact inputs it drafted from, and hands every decision back. The status reads “Not published” the entire time, on purpose. Trust comes from visible evidence, not a confident tone.",
		tag: "Built in React",
		img: "/case-study/listing-launch/stage-3-draft-v2.png",
		alt: "The real draft-review card running in the browser: Not published status, 91% confidence bar, the property facts the AI drafted from, and the hero photo strip with the AI pick on the kitchen",
		hot: true,
		cta: { label: "Try the working version below", href: "#gate-unlock" },
	},
	{
		eyebrow: "Stage 4 · Syndicate",
		title: "One approval pushes everywhere.",
		body: "After the agent approves, one action pushes the listing to the MLS and the portal sites, with per-channel status they can watch land. Nothing goes out until a human made the call. That is the whole point.",
		img: "/case-study/listing-launch/stage-4-syndicate.png",
		alt: "Syndication status: live on 3 of 5 channels. MLS, Realtor.com and Facebook live, Zillow publishing, Redfin queued",
	},
];

export function FlowDiagram() {
	return (
		<div className="mt-12 flex flex-col gap-16">
			{STAGES.map((s, i) => {
				const imageLeft = i % 2 === 0;
				const image = (
					<div
						className={`relative aspect-[6/5] overflow-hidden rounded-md border ${
							s.hot ? "border-accent" : "border-line"
						} bg-bg-2`}
					>
						<Image
							src={s.img}
							alt={s.alt}
							fill
							sizes="(min-width: 768px) 460px, 100vw"
							className="object-cover object-top"
						/>
					</div>
				);
				const text = (
					<div>
						<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
							{s.eyebrow}
							{s.tag && (
								<span className="ml-3 text-accent">{s.tag}</span>
							)}
						</p>
						<h3 className="mt-2 text-xl font-semibold leading-tight tracking-tight text-fg">
							{s.title}
						</h3>
						<p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
							{s.body}
						</p>
						{s.cta && (
							<a
								href={s.cta.href}
								className="mt-4 inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-wider text-accent transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-accent-deep"
							>
								{s.cta.label}
								<span aria-hidden>↓</span>
							</a>
						)}
					</div>
				);
				return (
					<div
						key={s.eyebrow}
						className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10"
					>
						{imageLeft ? (
							<>
								{image}
								{text}
							</>
						) : (
							<>
								<div className="order-2 md:order-1">{text}</div>
								<div className="order-1 md:order-2">{image}</div>
							</>
						)}
					</div>
				);
			})}
		</div>
	);
}
