"use client";

type Message = { kind: "call_missed" | "text_in" | "text_out"; body: string; t: number };

type Props = {
	messages: Message[];
};

export function ProspectPane({ messages }: Props) {
	return (
		<div className="flex flex-col rounded-md border border-line bg-panel">
			<div className="border-b border-line px-4 py-3">
				<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
					Prospect thread
				</p>
			</div>
			<div className="flex min-h-[200px] flex-col gap-3 px-4 py-4">
				{messages.length === 0 ? (
					<p className="self-center pt-8 font-mono text-2xs text-fg-faint">
						— waiting for scenario —
					</p>
				) : (
					messages.map((m, i) => <MessageBubble key={i} message={m} />)
				)}
			</div>
		</div>
	);
}

function MessageBubble({ message }: { message: Message }) {
	if (message.kind === "call_missed") {
		return (
			<div className="flex items-center gap-2 self-center">
				<span className="font-mono text-2xs text-fg-faint">↗</span>
				<span className="rounded-sm border border-line bg-bg-2 px-3 py-1.5 font-mono text-2xs text-fg-faint">
					{message.body}
				</span>
			</div>
		);
	}

	if (message.kind === "text_out") {
		return (
			<div className="flex justify-end">
				<span className="max-w-[80%] rounded-sm bg-accent px-3 py-2 text-xs leading-relaxed text-selection-fg">
					{message.body}
				</span>
			</div>
		);
	}

	// text_in
	return (
		<div className="flex justify-start">
			<span className="max-w-[80%] rounded-sm border border-line bg-bg-2 px-3 py-2 text-xs leading-relaxed text-fg">
				{message.body}
			</span>
		</div>
	);
}
