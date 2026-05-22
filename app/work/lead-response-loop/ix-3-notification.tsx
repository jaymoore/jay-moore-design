"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

const CYCLE = 6;

function ringKeyframes(centerT: number) {
	const before = Math.max(0.01, centerT - 0.06);
	const after = Math.min(0.99, centerT + 0.06);
	return {
		values: [
			"var(--color-line-strong)",
			"var(--color-line-strong)",
			"var(--color-accent)",
			"var(--color-line-strong)",
			"var(--color-line-strong)",
		],
		times: [0, before, centerT, after, 1],
	};
}

function opacityKeyframes(turnT: number) {
	return {
		values: [0.2, 0.2, 1, 1],
		times: [0, Math.max(0.01, turnT - 0.05), turnT, 1],
	};
}

const R_INNER = ringKeyframes(0.15);
const R_MID = ringKeyframes(0.4);
const R_OUTER = ringKeyframes(0.65);

const L1 = opacityKeyframes(0.15);
const L2 = opacityKeyframes(0.4);
const L3 = opacityKeyframes(0.65);

const ITEMS = [
	{ n: "01", lbl: "label", sub: "“new booking lead”", k: L1 },
	{ n: "02", lbl: "confidence", sub: "96%", k: L2 },
	{ n: "03", lbl: "quote", sub: "“leaking everywhere”", k: L3 },
];

export function IxNotification() {
	const reduced = useReducedMotion();
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount: 0.3 });
	const play = !reduced && inView;

	const ringTransition = (times: number[]) => ({
		duration: CYCLE,
		times,
		repeat: Number.POSITIVE_INFINITY,
		ease: "linear" as const,
	});

	return (
		<div
			ref={ref}
			role="img"
			aria-label="Animated diagram: three concentric rings light from the center outward, revealing the reading rank — label, confidence, quote."
			className="relative aspect-[16/9] overflow-hidden rounded-md border border-line bg-bg-2"
		>
			<div className="absolute inset-0 grid grid-cols-2 items-center gap-4 px-[8%]">
				<svg
					viewBox="0 0 200 200"
					className="h-full max-h-[80%] w-full"
					aria-hidden
				>
					<motion.circle
						cx="100"
						cy="100"
						r="80"
						fill="none"
						strokeWidth="1"
						initial={{ stroke: "var(--color-line-strong)" }}
						animate={play ? { stroke: R_OUTER.values } : undefined}
						transition={ringTransition(R_OUTER.times)}
					/>
					<motion.circle
						cx="100"
						cy="100"
						r="55"
						fill="none"
						strokeWidth="1"
						initial={{ stroke: "var(--color-line-strong)" }}
						animate={play ? { stroke: R_MID.values } : undefined}
						transition={ringTransition(R_MID.times)}
					/>
					<motion.circle
						cx="100"
						cy="100"
						r="30"
						fill="none"
						strokeWidth="1"
						initial={{ stroke: "var(--color-line-strong)" }}
						animate={play ? { stroke: R_INNER.values } : undefined}
						transition={ringTransition(R_INNER.times)}
					/>
					<circle cx="100" cy="100" r="5" fill="var(--color-accent)" />
				</svg>

				<ul className="flex flex-col gap-3 font-mono">
					{ITEMS.map((item) => (
						<motion.li
							key={item.n}
							className="grid grid-cols-[18px_1fr] items-baseline gap-2"
							initial={{ opacity: 0.2 }}
							animate={play ? { opacity: item.k.values } : undefined}
							transition={ringTransition(item.k.times)}
						>
							<span className="text-[11px] tabular-nums text-accent">
								{item.n}
							</span>
							<div>
								<div className="text-[10px] uppercase tracking-wider text-fg">
									{item.lbl}
								</div>
								<div className="mt-0.5 text-[10px] text-fg-faint">
									{item.sub}
								</div>
							</div>
						</motion.li>
					))}
				</ul>
			</div>
		</div>
	);
}
