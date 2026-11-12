import type { CSSProperties } from "react";
import { contrastRatio } from "./contrast";

// Fictional brand: Larkspur Institute. Concept work only.
const BRAND = {
	inkBlue: "#1b3a4b",
	marigold: "#f2b33d",
	cream: "#f7f3ea",
	ink: "#1d2422",
	white: "#ffffff",
};

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

// Type sizes in native pixels. The artboards scale them with container query
// units, and the rule sheet prints these same numbers.
const TYPE = { wordmark: 28, tag: 26, detail: 38 };
const PAD = 80;

type Size = {
	w: number;
	h: number;
	name: string;
	use: string;
	headline: number;
};

const SIZES: Size[] = [
	{ w: 1080, h: 1080, name: "Square", use: "Feed post", headline: 140 },
	{ w: 1080, h: 1350, name: "Portrait", use: "Tall feed post", headline: 160 },
	{ w: 1200, h: 628, name: "Landscape", use: "Link share", headline: 112 },
];

type Pair = { fg: string; bg: string; fgName: string; bgName: string; use: string };

const PAIRS: Pair[] = [
	{ fg: BRAND.white, bg: BRAND.inkBlue, fgName: "White", bgName: "Ink Blue", use: "Headline, details" },
	{ fg: BRAND.marigold, bg: BRAND.inkBlue, fgName: "Marigold", bgName: "Ink Blue", use: "Tag line, links" },
	{ fg: BRAND.inkBlue, bg: BRAND.marigold, fgName: "Ink Blue", bgName: "Marigold", use: "Buttons" },
	{ fg: BRAND.ink, bg: BRAND.cream, fgName: "Ink", bgName: "Cream", use: "Light variant text" },
];

function grade(ratio: number) {
	if (ratio >= 7) return "AAA";
	if (ratio >= 4.5) return "AA";
	return "AA large only";
}

function Artboard({ size }: { size: Size }) {
	const u = (px: number) => `${(px / size.w) * 100}cqw`;
	const sun = size.w === 1200 ? 520 : 648;
	// Sun and rings share one center on the bottom edge, inset from the right.
	const centerFromRight = PAD + sun / 2 - 120;
	const circle = (d: number, extra: CSSProperties): CSSProperties => ({
		position: "absolute",
		width: u(d),
		height: u(d),
		right: u(centerFromRight - d / 2),
		bottom: u(-d / 2),
		borderRadius: "50%",
		...extra,
	});

	return (
		<div
			role="img"
			aria-label={`${size.name} ${size.w} by ${size.h} graphic: Larkspur Institute, Open Lab Day, Saturday, March 13, 10 am to 2 pm.`}
			className="relative w-full overflow-hidden rounded-sm shadow-(--shadow)"
			style={{
				aspectRatio: `${size.w} / ${size.h}`,
				containerType: "inline-size",
				background: BRAND.inkBlue,
				color: BRAND.white,
			}}
		>
			<span style={circle(sun + 360, { border: `${u(2)} solid rgba(255,255,255,.08)` })} />
			<span style={circle(sun + 180, { border: `${u(2)} solid rgba(255,255,255,.12)` })} />
			<span style={circle(sun, { background: BRAND.marigold })} />

			<div
				className="relative flex h-full flex-col justify-between"
				style={{ padding: u(PAD) }}
			>
				<p
					style={{
						fontFamily: SANS,
						fontSize: u(TYPE.wordmark),
						fontWeight: 700,
						letterSpacing: "0.14em",
						textTransform: "uppercase",
						lineHeight: 1,
					}}
				>
					Larkspur Institute
				</p>

				<div>
					<p
						style={{
							fontFamily: SANS,
							fontSize: u(TYPE.tag),
							fontWeight: 700,
							letterSpacing: "0.12em",
							textTransform: "uppercase",
							color: BRAND.marigold,
						}}
					>
						Save the date
					</p>
					<p
						style={{
							fontFamily: SERIF,
							fontSize: u(size.headline),
							lineHeight: 1,
							marginTop: u(24),
							letterSpacing: "-0.01em",
						}}
					>
						Open Lab Day
					</p>
				</div>

				<p
					style={{
						fontFamily: SANS,
						fontSize: u(TYPE.detail),
						lineHeight: 1.3,
						maxWidth: u(size.w / 2),
					}}
				>
					Saturday, March 13
					<br />
					10 am to 2 pm
				</p>
			</div>
		</div>
	);
}

export function SocialSet() {
	return (
		<>
			<div className="mt-10 grid items-end gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr]">
				{SIZES.map((s) => (
					<figure key={s.name}>
						<Artboard size={s} />
						<figcaption className="mt-3 font-mono text-2xs uppercase tracking-wider text-fg-faint">
							{s.w} × {s.h} · {s.use} · concept
						</figcaption>
					</figure>
				))}
			</div>

			<div className="mt-12 rounded-md border border-line bg-panel">
				<div className="border-b border-line px-5 py-4">
					<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
						Rule sheet · Larkspur Institute (fictional)
					</p>
				</div>

				<div className="grid md:grid-cols-2">
					{/* Logo clear space */}
					<section className="border-b border-line p-5 md:border-r">
						<h3 className="text-base font-semibold text-fg">Wordmark clear space</h3>
						<div
							className="mt-4 flex justify-center rounded-sm p-6"
							style={{ background: BRAND.inkBlue }}
						>
							<span
								className="border border-dashed"
								style={{
									borderColor: BRAND.marigold,
									padding: "0.72em",
									fontFamily: SANS,
									fontSize: 14,
									fontWeight: 700,
									letterSpacing: "0.14em",
									textTransform: "uppercase",
									color: BRAND.white,
									lineHeight: 1,
								}}
							>
								Larkspur Institute
							</span>
						</div>
						<p className="mt-3 text-sm leading-relaxed text-fg-soft">
							Keep clear space equal to the wordmark&rsquo;s cap height on
							every side. The wordmark sits on Ink Blue or Cream, never on
							Marigold or a photo.
						</p>
					</section>

					{/* Type scale */}
					<section className="border-b border-line p-5">
						<h3 className="text-base font-semibold text-fg">Type scale</h3>
						<table className="mt-4 w-full text-left text-sm">
							<thead className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
								<tr>
									<th className="pb-2 font-normal">Role</th>
									<th className="pb-2 font-normal">Face</th>
									<th className="pb-2 text-right font-normal">Size</th>
								</tr>
							</thead>
							<tbody className="text-fg-soft">
								<tr className="border-t border-line">
									<td className="py-2 text-fg">Headline</td>
									<td className="py-2">Georgia</td>
									<td className="py-2 text-right font-mono text-2xs">
										{SIZES.map((s) => s.headline).join(" / ")} px
									</td>
								</tr>
								<tr className="border-t border-line">
									<td className="py-2 text-fg">Details</td>
									<td className="py-2">Arial</td>
									<td className="py-2 text-right font-mono text-2xs">{TYPE.detail} px</td>
								</tr>
								<tr className="border-t border-line">
									<td className="py-2 text-fg">Wordmark</td>
									<td className="py-2">Arial Bold, caps</td>
									<td className="py-2 text-right font-mono text-2xs">{TYPE.wordmark} px</td>
								</tr>
								<tr className="border-t border-line">
									<td className="py-2 text-fg">Tag line</td>
									<td className="py-2">Arial Bold, caps</td>
									<td className="py-2 text-right font-mono text-2xs">{TYPE.tag} px</td>
								</tr>
							</tbody>
						</table>
						<p className="mt-3 text-sm leading-relaxed text-fg-soft">
							Headline sizes are square / portrait / landscape. Same
							faces as the newsletter, so the brand reads the same in the
							inbox and the feed. Margins are {PAD} px on every size.
						</p>
					</section>

					{/* Color pairs */}
					<section className="border-b border-line p-5 md:border-b-0 md:border-r">
						<h3 className="text-base font-semibold text-fg">Approved color pairs</h3>
						<ul className="mt-4 flex flex-col gap-2">
							{PAIRS.map((p) => {
								const ratio = contrastRatio(p.fg, p.bg);
								return (
									<li
										key={`${p.fgName}-${p.bgName}`}
										className="flex items-center gap-3"
									>
										<span
											aria-hidden
											className="flex h-10 w-14 shrink-0 items-center justify-center rounded-sm border border-line text-base font-semibold"
											style={{ background: p.bg, color: p.fg, fontFamily: SERIF }}
										>
											Aa
										</span>
										<span className="min-w-0 flex-1 text-sm">
											<span className="block text-fg">
												{p.fgName} on {p.bgName}
											</span>
											<span className="block text-fg-faint">{p.use}</span>
										</span>
										<span className="text-right font-mono text-2xs uppercase tracking-wider text-fg-soft">
											{ratio.toFixed(2)}:1
											<span className="block text-fg-faint">{grade(ratio)}</span>
										</span>
									</li>
								);
							})}
						</ul>
					</section>

					{/* What a non-designer may change */}
					<section className="p-5">
						<h3 className="text-base font-semibold text-fg">
							Who can change what
						</h3>
						<p className="mt-4 font-mono text-2xs uppercase tracking-wider text-accent">
							Anyone on the team
						</p>
						<ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-fg-soft">
							<li>Event name, as long as it fits on two lines</li>
							<li>Date and time line</li>
							<li>The tag line above the headline</li>
						</ul>
						<p className="mt-4 font-mono text-2xs uppercase tracking-wider text-fg-faint">
							Locked
						</p>
						<ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-fg-soft">
							<li>Wordmark, colors, typefaces, and sizes</li>
							<li>Margins and the sun graphic&rsquo;s position</li>
							<li>New sizes: ask the designer for a new artboard</li>
						</ul>
					</section>
				</div>
			</div>
		</>
	);
}
