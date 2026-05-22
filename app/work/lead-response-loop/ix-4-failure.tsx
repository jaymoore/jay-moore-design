"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useMemo, useRef } from "react";

const PATTERN_WIDTH = 50;
const PATTERN_COUNT = 8;

function buildSpikePoints() {
	const pts: string[] = [];
	for (let i = 0; i < PATTERN_COUNT; i++) {
		const x = i * PATTERN_WIDTH;
		pts.push(
			`${x},16`,
			`${x + 20},16`,
			`${x + 22},4`,
			`${x + 24},28`,
			`${x + 26},4`,
			`${x + 28},28`,
			`${x + 30},16`,
			`${x + 50},16`,
		);
	}
	return pts.join(" ");
}

export function IxFailure() {
	const reduced = useReducedMotion();
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount: 0.3 });
	const play = !reduced && inView;
	const spike = useMemo(() => buildSpikePoints(), []);

	return (
		<div
			ref={ref}
			role="img"
			aria-label="Animated diagram: silent failure is a flat line with no label; loud failure is a labeled scrolling waveform."
			className="relative aspect-[16/9] overflow-hidden rounded-md border border-line bg-bg-2"
		>
			<div className="absolute inset-0 flex flex-col justify-center gap-4 px-[10%]">
				<div className="flex flex-col gap-1">
					<div className="grid grid-cols-[90px_1fr_60px] items-center gap-4">
						<span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
							silent fail
						</span>
						<div className="h-8 w-full overflow-hidden">
							<svg
								viewBox="0 0 200 32"
								preserveAspectRatio="none"
								className="block h-full w-full"
								aria-hidden
							>
								<line
									x1="0"
									y1="16"
									x2="200"
									y2="16"
									stroke="var(--color-fg-faint)"
									strokeWidth="1"
								/>
							</svg>
						</div>
						<span className="text-right font-mono text-2xs uppercase tracking-wider text-fg-faint">
							— —
						</span>
					</div>
					<div className="pl-[106px] font-mono text-[10px] italic text-fg-faint">
						owner: &ldquo;it&rsquo;s working&rdquo;
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<div className="grid grid-cols-[90px_1fr_60px] items-center gap-4">
						<span className="font-mono text-2xs uppercase tracking-wider text-accent">
							loud fail
						</span>
						<div className="h-8 w-full overflow-hidden">
							<svg
								viewBox="0 0 200 32"
								preserveAspectRatio="none"
								className="block h-full w-full"
								aria-hidden
							>
								<motion.g
									animate={play ? { x: [0, -200] } : undefined}
									transition={{
										duration: 3,
										ease: "linear",
										repeat: Number.POSITIVE_INFINITY,
									}}
								>
									<polyline
										points={spike}
										stroke="var(--color-accent)"
										strokeWidth="1"
										fill="none"
									/>
								</motion.g>
							</svg>
						</div>
						<span className="text-right font-mono text-2xs tabular-nums uppercase tracking-wider text-accent">
							504
						</span>
					</div>
					<div className="pl-[106px] font-mono text-[10px] text-accent">
						504 · sms unreachable · retry 15s
					</div>
				</div>
			</div>
		</div>
	);
}
