"use client";

type Props = {
	events: Array<{ t: number; label: string }>;
	llm_latency_ms: number | null;
};

function formatT(ms: number): string {
	return `T+${(ms / 1000).toFixed(1)}s`;
}

export function EventLog({ events, llm_latency_ms }: Props) {
	if (events.length === 0) return null;

	return (
		<div className="rounded-md border border-line bg-panel px-4 py-4">
			<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
				Event log
			</p>
			<ol className="mt-3 flex flex-col gap-1.5">
				{events.map((e, i) => (
					<li key={i} className="grid grid-cols-[72px_1fr] gap-3 items-baseline">
						<span className="font-mono text-2xs tabular-nums text-fg-faint">
							{formatT(e.t)}
						</span>
						<span className="font-mono text-2xs text-fg-soft">{e.label}</span>
					</li>
				))}
			</ol>
			{llm_latency_ms !== null && (
				<div className="mt-3 border-t border-line pt-3">
					<span className="font-mono text-2xs text-fg-faint">
						LLM latency:{" "}
						<span className="text-fg-soft">{llm_latency_ms}ms</span>
					</span>
				</div>
			)}
		</div>
	);
}
