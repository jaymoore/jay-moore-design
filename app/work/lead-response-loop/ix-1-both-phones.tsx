"use client";

import { useEffect, useRef, useState } from "react";
import {
	animate,
	motion,
	useInView,
	useMotionValue,
	useMotionValueEvent,
	useReducedMotion,
	useTransform,
} from "motion/react";

const MAX_GAP = 22;
const CYCLE = 20;
const RAUNO_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

export function IxBothPhones() {
	const reduced = useReducedMotion();
	const containerRef = useRef<HTMLDivElement>(null);
	const readoutRef = useRef<HTMLSpanElement>(null);
	const inView = useInView(containerRef, { amount: 0.3 });

	const gap = useMotionValue(MAX_GAP);
	const linePct = useTransform(gap, (v) => `${(v / MAX_GAP) * 100}%`);
	const lineScale = useTransform(gap, (v) => v / MAX_GAP);

	const [meet, setMeet] = useState(false);

	useMotionValueEvent(gap, "change", (v) => {
		if (readoutRef.current) readoutRef.current.textContent = v.toFixed(1);
		setMeet(v < 0.05);
	});

	useEffect(() => {
		if (reduced || !inView) return;
		const controls = animate(gap, [MAX_GAP, 0, 0, MAX_GAP], {
			duration: CYCLE,
			times: [0, 0.75, 0.9, 1],
			ease: [RAUNO_EASE, "linear", "easeInOut"],
			repeat: Infinity,
		});
		return () => controls.stop();
	}, [gap, inView, reduced]);

	return (
		<div
			ref={containerRef}
			role="img"
			aria-label="Animated stopwatch: the 22-second gap between prospect and owner collapses to zero. The call ends, the SMS arrives, the dots meet."
			className="relative aspect-[16/9] overflow-hidden rounded-md border border-line bg-bg-2"
		>
			<div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-[8%]">
				<div className="flex items-baseline font-mono font-medium tabular-nums text-fg text-[clamp(36px,7vw,64px)] [letter-spacing:-0.02em]">
					<span ref={readoutRef}>22.0</span>
					<span className="ml-1 text-[0.5em] text-fg-faint">s</span>
				</div>

				<div className="flex w-full max-w-[460px] flex-col gap-2">
					<div className="flex items-center gap-4">
						<span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
							prospect
						</span>
						<div className="relative flex h-2 flex-1 items-center">
							<motion.div
								className="h-px w-full origin-left bg-line-strong"
								style={{ scaleX: lineScale }}
							/>
							<div className="absolute left-0 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg" />
							<motion.div
								className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
								style={{
									left: linePct,
									backgroundColor: meet
										? "var(--color-accent)"
										: "var(--color-bg-2)",
									borderColor: meet
										? "var(--color-accent)"
										: "var(--color-fg)",
								}}
								animate={meet ? { scale: [1, 1.6, 1.2] } : { scale: 1 }}
								transition={{ duration: 0.4, ease: RAUNO_EASE }}
							/>
						</div>
						<span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
							owner
						</span>
					</div>
					<div className="flex justify-between pl-[68px] pr-[52px] font-mono text-[9px] uppercase tracking-wider text-fg-faint">
						<span>call ends</span>
						<span className="text-accent">sms arrives</span>
					</div>
				</div>
			</div>
		</div>
	);
}
