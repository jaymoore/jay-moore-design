import { Check, Flag } from "lucide-react";

/**
 * The Listing Launch product design system, rendered on its native light
 * surface (the product ships light; the portfolio ships dark). Hexes are the
 * product palette — data on display, mirrored from the app's src/index.css.
 */

type Swatch = { name: string; hex: string };
type Group = { title: string; swatches: Swatch[] };

const GROUPS: Group[] = [
	{
		title: "Trust · accent",
		swatches: [
			{ name: "trust-50", hex: "#eef4fb" },
			{ name: "trust-100", hex: "#d9e6f6" },
			{ name: "trust-500", hex: "#2f6fb0" },
			{ name: "trust-600", hex: "#235a93" },
			{ name: "trust-700", hex: "#1c4874" },
		],
	},
	{
		title: "Confidence",
		swatches: [
			{ name: "good-50", hex: "#eaf6ef" },
			{ name: "good-500", hex: "#2e9e5b" },
			{ name: "good-700", hex: "#1f6f40" },
		],
	},
	{
		title: "Compliance flag",
		swatches: [
			{ name: "flag-50", hex: "#fdf4e7" },
			{ name: "flag-100", hex: "#fbe8cd" },
			{ name: "flag-500", hex: "#d68a1e" },
			{ name: "flag-700", hex: "#9a6212" },
		],
	},
	{
		title: "Neutral",
		swatches: [
			{ name: "ink", hex: "#16202b" },
			{ name: "muted", hex: "#5b6976" },
			{ name: "line", hex: "#e3e8ee" },
			{ name: "surface", hex: "#ffffff" },
			{ name: "canvas", hex: "#f4f6f9" },
		],
	},
];

export function DesignSystem() {
	return (
		<div
			className="mt-10 overflow-hidden rounded-lg border"
			style={{ background: "#f4f6f9", borderColor: "#e3e8ee", color: "#16202b" }}
		>
			{/* Color tokens */}
			<div className="border-b px-6 py-6" style={{ borderColor: "#e3e8ee" }}>
				<p
					className="font-mono text-2xs uppercase tracking-wider"
					style={{ color: "#5b6976" }}
				>
					Color tokens
				</p>
				<div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{GROUPS.map((g) => (
						<div key={g.title}>
							<p
								className="font-mono text-2xs uppercase tracking-wider"
								style={{ color: "#5b6976" }}
							>
								{g.title}
							</p>
							<ul className="mt-3 flex flex-col gap-2">
								{g.swatches.map((s) => (
									<li key={s.name} className="flex items-center gap-3">
										<span
											className="size-8 shrink-0 rounded-md"
											style={{
												background: s.hex,
												boxShadow: "inset 0 0 0 1px rgba(22,32,43,0.08)",
											}}
										/>
										<span className="min-w-0">
											<span className="block text-xs font-medium">
												{s.name}
											</span>
											<span
												className="block font-mono text-[10px]"
												style={{ color: "#5b6976" }}
											>
												{s.hex}
											</span>
										</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			{/* Components */}
			<div className="px-6 py-6">
				<p
					className="font-mono text-2xs uppercase tracking-wider"
					style={{ color: "#5b6976" }}
				>
					Components
				</p>
				<div className="mt-5 flex flex-wrap items-start gap-x-10 gap-y-6">
					{/* Buttons */}
					<Atom label="Primary · default">
						<button
							className="rounded-md px-3.5 py-2 text-sm font-semibold text-white"
							style={{ background: "#235a93" }}
						>
							Approve &amp; publish
						</button>
					</Atom>
					<Atom label="Primary · hover">
						<button
							className="rounded-md px-3.5 py-2 text-sm font-semibold text-white"
							style={{ background: "#1c4874" }}
						>
							Approve &amp; publish
						</button>
					</Atom>
					<Atom label="Primary · disabled">
						<button
							className="rounded-md px-3.5 py-2 text-sm font-semibold"
							style={{ background: "#e3e8ee", color: "#5b6976" }}
						>
							Approve &amp; publish
						</button>
					</Atom>
					<Atom label="Secondary">
						<button
							className="rounded-md border px-3.5 py-2 text-sm font-semibold"
							style={{ borderColor: "#e3e8ee", color: "#16202b" }}
						>
							Reject draft
						</button>
					</Atom>

					{/* Status pill */}
					<Atom label="Status pill">
						<span
							className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs"
							style={{ borderColor: "#e3e8ee", color: "#5b6976" }}
						>
							Not published
						</span>
					</Atom>

					{/* AI pick badge */}
					<Atom label='Hero "AI pick"'>
						<span
							className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold"
							style={{
								borderColor: "#e3e8ee",
								background: "#fff",
								color: "#1c4874",
							}}
						>
							AI pick
						</span>
					</Atom>

					{/* Checks */}
					<Atom label="Checks · pending">
						<span
							className="inline-flex items-center gap-2 text-xs"
							style={{ color: "#5b6976" }}
						>
							<span
								className="size-3.5 rounded-full border"
								style={{ borderColor: "#5b6976" }}
							/>
							1 check pending
						</span>
					</Atom>
					<Atom label="Checks · passed">
						<span
							className="inline-flex items-center gap-2 text-xs font-medium"
							style={{ color: "#1f6f40" }}
						>
							<Check className="size-3.5" aria-hidden />1 of 1 checks passed
						</span>
					</Atom>

					{/* Confidence bar */}
					<Atom label="Confidence bar">
						<div
							className="w-56 overflow-hidden rounded-md px-3 py-2"
							style={{ background: "#eaf6ef" }}
						>
							<div className="flex items-baseline gap-2">
								<span
									className="text-sm font-semibold"
									style={{ color: "#1f6f40" }}
								>
									91% confidence
								</span>
								<span className="text-[11px]" style={{ color: "#5b6976" }}>
									matches your inputs
								</span>
							</div>
							<div
								className="mt-2 h-1.5 overflow-hidden rounded-full"
								style={{ background: "#d9ece0" }}
							>
								<div
									className="h-full rounded-full"
									style={{ width: "91%", background: "#2e9e5b" }}
								/>
							</div>
						</div>
					</Atom>

					{/* Compliance flag card */}
					<Atom label="Compliance flag card">
						<div
							className="w-64 rounded-md border px-3 py-2.5"
							style={{ borderColor: "#fbe8cd", background: "#fdf4e7" }}
						>
							<p
								className="flex items-center gap-1.5 text-xs font-semibold"
								style={{ color: "#9a6212" }}
							>
								<Flag className="size-3" aria-hidden />
								Fair-housing review needed
							</p>
							<div className="mt-2 flex gap-2">
								<span
									className="rounded-sm px-2 py-1 text-[11px] font-semibold text-white"
									style={{ background: "#d68a1e" }}
								>
									Apply suggestion
								</span>
								<span
									className="rounded-sm border px-2 py-1 text-[11px] font-semibold"
									style={{ borderColor: "#e0c79a", color: "#9a6212" }}
								>
									Keep as written
								</span>
							</div>
						</div>
					</Atom>
				</div>
			</div>
		</div>
	);
}

function Atom({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-2">
			<span
				className="font-mono text-2xs uppercase tracking-wider"
				style={{ color: "#5b6976" }}
			>
				{label}
			</span>
			{children}
		</div>
	);
}
