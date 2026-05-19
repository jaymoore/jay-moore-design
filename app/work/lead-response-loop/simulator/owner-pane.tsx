"use client";

import type { QualifierOutput } from "./state-machine";

type Props = {
	messages: Array<{ body: string; t: number }>;
	classification: QualifierOutput | null;
	awaitingDecision: boolean;
	onYes: () => void;
	onNo: () => void;
};

const LABEL_COLORS: Record<QualifierOutput["label"], string> = {
	urgent: "text-ok",
	standard: "text-accent",
	not_a_fit: "text-fg-soft",
	spam: "text-fg-faint",
};

export function OwnerPane({ messages, classification, awaitingDecision, onYes, onNo }: Props) {
	return (
		<div className="flex flex-col rounded-md border border-line bg-panel">
			<div className="border-b border-line px-4 py-3">
				<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
					Owner view
				</p>
			</div>

			<div className="flex min-h-[200px] flex-col gap-4 px-4 py-4">
				{messages.length === 0 && !classification ? (
					<p className="self-center pt-8 font-mono text-2xs text-fg-faint">
						— no notifications yet —
					</p>
				) : null}

				{/* Classification badge */}
				{classification && (
					<div className="rounded-sm border border-line bg-bg-2 px-3 py-3">
						<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
							Claude classification
						</p>
						<div className="mt-2 flex items-baseline gap-3">
							<span className={`font-mono text-xs font-medium uppercase tracking-wider ${LABEL_COLORS[classification.label]}`}>
								{classification.label}
							</span>
							<span className="font-mono text-2xs text-fg-faint">
								{Math.round(classification.confidence * 100)}% conf
							</span>
						</div>
						{classification.evidence_quotes.length > 0 && (
							<p className="mt-2 text-xs italic leading-relaxed text-fg-soft">
								&ldquo;{classification.evidence_quotes[0]}&rdquo;
							</p>
						)}
						<div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
							{classification.extracted.service_type && (
								<>
									<span className="font-mono text-2xs text-fg-faint">service</span>
									<span className="font-mono text-2xs text-fg-soft">{classification.extracted.service_type}</span>
								</>
							)}
							<span className="font-mono text-2xs text-fg-faint">urgency</span>
							<span className="font-mono text-2xs text-fg-soft">{classification.extracted.urgency}</span>
						</div>
					</div>
				)}

				{/* Owner notification messages */}
				{messages.map((m, i) => (
					<div key={i} className="rounded-sm border border-line bg-bg-2 px-3 py-2">
						<p className="whitespace-pre-line text-xs leading-relaxed text-fg-soft">{m.body}</p>
					</div>
				))}

				{/* Decision controls */}
				{awaitingDecision && (
					<div className="mt-auto flex flex-col gap-2">
						<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
							Your call
						</p>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={onYes}
								className="flex-1 rounded-sm border border-line bg-bg px-3 py-2 font-mono text-2xs uppercase tracking-wider text-ok transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:border-line-strong hover:bg-bg-2"
							>
								Yes →
							</button>
							<button
								type="button"
								onClick={onNo}
								className="flex-1 rounded-sm border border-line bg-bg px-3 py-2 font-mono text-2xs uppercase tracking-wider text-fg-soft transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:border-line-strong hover:bg-bg-2"
							>
								No
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
