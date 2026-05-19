"use client";

import type { Scenario } from "./scenarios";

type Props = {
	scenarios: Scenario[];
	onSelect: (s: Scenario) => void;
	disabled: boolean;
};

export function ScenarioPicker({ scenarios, onSelect, disabled }: Props) {
	return (
		<div className="flex flex-col gap-3">
			<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
				Choose a scenario
			</p>
			<div className="flex flex-wrap gap-2">
				{scenarios.map((s) => (
					<button
						key={s.id}
						type="button"
						disabled={disabled}
						onClick={() => onSelect(s)}
						className="rounded-sm border border-line bg-bg px-3 py-1.5 font-mono text-2xs uppercase tracking-wider text-fg-soft transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:border-line-strong hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
					>
						{s.label}
					</button>
				))}
			</div>
		</div>
	);
}
