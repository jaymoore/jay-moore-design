"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

const STEPS = [
	{ key: "receive", duration: "0.6s", flex: 1.0 },
	{ key: "trans", duration: "0.4s", flex: 0.6 },
	{ key: "class", duration: "0.3s", flex: 0.4 },
	{ key: "wait", duration: "2.0s", flex: 3.0, accent: true },
	{ key: "send", duration: "0.3s", flex: 0.5 },
	{ key: "deliver", duration: "0.8s", flex: 1.2 },
];

export function IxTiming() {
	const reduced = useReducedMotion();
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount: 0.3 });
	const play = !reduced && inView;

	return (
		<div
			ref={ref}
			role="img"
			aria-label="Animated diagram: pipeline steps shown as bars whose widths equal duration; the 2-second wait is the widest, drawn in accent."
			className="relative aspect-[16/9] overflow-hidden rounded-md border border-line bg-bg-2"
		>
			<div className="absolute inset-0 flex flex-col justify-center px-[8%]">
				<div className="mb-5 text-center font-mono text-2xs uppercase tracking-wider text-fg-faint">
					step timing <span className="text-line-strong">·</span>{" "}
					<span className="tabular-nums text-accent">wait = 2.0s</span>
				</div>

				<div className="flex gap-1 font-mono text-[9px] tabular-nums text-fg-faint">
					{STEPS.map((s) => (
						<span
							key={s.key}
							className={`text-center ${s.accent ? "font-medium text-accent" : ""}`}
							style={{ flex: s.flex }}
						>
							{s.duration}
						</span>
					))}
				</div>

				<div className="relative mt-1 flex h-16 items-end gap-1">
					{STEPS.map((s) => (
						<div
							key={s.key}
							className={`h-full border-b-0 ${
								s.accent
									? "border border-accent bg-accent-wash"
									: "border border-line-strong"
							}`}
							style={{ flex: s.flex }}
						/>
					))}
					{play ? (
						<motion.div
							aria-hidden
							className="pointer-events-none absolute -top-2 -bottom-4 w-px bg-fg"
							style={{ left: 0 }}
							animate={{ left: ["0%", "100%"] }}
							transition={{ duration: 5, ease: "linear", repeat: Infinity }}
						>
							<div className="absolute -top-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-fg" />
						</motion.div>
					) : null}
				</div>

				<div className="mt-px h-px bg-fg-faint" />

				<div className="mt-2 flex gap-1 font-mono text-[9px] uppercase tracking-wider text-fg-faint">
					{STEPS.map((s) => (
						<span
							key={s.key}
							className={`text-center ${
								s.accent ? "font-medium text-accent" : ""
							}`}
							style={{ flex: s.flex }}
						>
							{s.key}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
