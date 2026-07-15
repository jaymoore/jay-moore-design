import { Flag } from "lucide-react";

type Approach = {
	label: string;
	verdict: "Rejected" | "Weak" | "Chosen";
	body: string;
};

const APPROACHES: Approach[] = [
	{
		label: "Auto-strip it silently",
		verdict: "Rejected",
		body: "Hides a decision that is legally the agent's to make. The agent learns nothing and can't defend a word they never knew changed.",
	},
	{
		label: "List flags in a side panel",
		verdict: "Weak",
		body: "Correct, but disconnected. The agent reads the warning far from the phrase it's actually about.",
	},
	{
		label: "Flag it inline, agent decides",
		verdict: "Chosen",
		body: "Underline the phrase in place. The risk lives where the words live. Apply the rewrite, or keep it and own the call.",
	},
];

export function InlineFlag() {
	return (
		<>
			{/* The reasoning path */}
			<div className="mt-10 grid gap-4 md:grid-cols-3">
				{APPROACHES.map((a) => {
					const chosen = a.verdict === "Chosen";
					return (
						<div
							key={a.label}
							className={`flex flex-col gap-2 rounded-md border p-5 ${
								chosen
									? "border-accent bg-accent-wash"
									: "border-line bg-panel"
							}`}
						>
							<div className="flex items-center justify-between gap-2">
								<span className="text-base font-semibold leading-tight text-fg">
									{a.label}
								</span>
							</div>
							<span
								className={`w-fit rounded-full px-2 py-0.5 font-mono text-2xs uppercase tracking-wider ${
									chosen
										? "bg-accent text-selection-fg"
										: a.verdict === "Rejected"
											? "bg-warn/15 text-warn-fg line-through"
											: "bg-bg-2 text-fg-faint"
								}`}
							>
								{a.verdict}
							</span>
							<p className="mt-1 text-sm leading-relaxed text-fg-soft">
								{a.body}
							</p>
						</div>
					);
				})}
			</div>

			{/* Before / after */}
			<div className="mt-8 grid gap-4 md:grid-cols-2">
				<BeforeAfterCard variant="before" />
				<BeforeAfterCard variant="after" />
			</div>
		</>
	);
}

function BeforeAfterCard({ variant }: { variant: "before" | "after" }) {
	const after = variant === "after";
	return (
		<div className="flex flex-col rounded-md border border-line bg-panel">
			<div className="border-b border-line px-5 py-3">
				<span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
					{after ? "After · inline" : "Before · disconnected"}
				</span>
			</div>
			<div className="flex flex-1 flex-col gap-4 px-5 py-5">
				<div>
					<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
						Listing description
					</p>
					<p className="mt-2 text-base leading-relaxed text-fg">
						Bright,{" "}
						{after ? (
							<span className="underline decoration-warn decoration-wavy decoration-2 underline-offset-4">
								family-friendly
							</span>
						) : (
							"family-friendly"
						)}{" "}
						home close to parks and schools.
					</p>
				</div>
				<div className="rounded-md border border-warn/40 bg-warn-wash px-4 py-3">
					<p className="flex items-center gap-2 text-sm font-semibold text-warn-fg">
						<Flag className="size-3.5" aria-hidden />
						Fair-housing review needed
					</p>
					<p className="mt-1 text-sm text-warn-fg/90">
						{after
							? "Flagged phrase is underlined above ↑"
							: "Flagged phrase: “family-friendly”"}
					</p>
				</div>
			</div>
		</div>
	);
}
