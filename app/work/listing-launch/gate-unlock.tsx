"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
	AnimatePresence,
	motion,
	MotionConfig,
	useReducedMotion,
} from "motion/react";
import { Check, Flag, RotateCcw } from "lucide-react";

type State = "locked" | "resolving" | "ready" | "published";
type Resolution = "applied" | "kept" | null;

// Emil: UI transitions under 300ms, strong ease-out. Site's --ease-snappy
// (cubic-bezier(.32,.72,0,1)) is the drawer curve — reused here as JS literals
// because the motion library needs numbers, not CSS vars.
const EASE = [0.32, 0.72, 0, 1] as [number, number, number, number];
const RESOLVE_MS = 250;

const FLAGGED = "family-friendly";
const REWRITE = "sun-filled";

// Stage 4: channels light up in this order after publish (ms after click).
const CHANNELS = [
	{ name: "ARMLS (Multiple Listing Service)", delay: 500 },
	{ name: "Realtor.com", delay: 1000 },
	{ name: "Facebook Marketplace", delay: 1500 },
	{ name: "Zillow", delay: 2200 },
	{ name: "Redfin", delay: 3000 },
];

const PHOTOS = [
	{ key: "front", label: "Front elevation", src: "/case-study/listing-launch/thumb-front.jpg" },
	{ key: "kitchen", label: "Kitchen", src: "/case-study/listing-launch/thumb-kitchen.jpg", aiPick: true },
	{ key: "living", label: "Living room", src: "/case-study/listing-launch/thumb-living.jpg" },
	{ key: "bath", label: "Primary bath", src: "/case-study/listing-launch/thumb-bath.jpg" },
] as const;

export function GateUnlock() {
	const [state, setState] = useState<State>("locked");
	const [resolution, setResolution] = useState<Resolution>(null);
	const [hero, setHero] = useState<string>("kitchen");
	const [liveCount, setLiveCount] = useState(0);
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
	const reduce = useReducedMotion();

	useEffect(() => () => timers.current.forEach(clearTimeout), []);

	function resolve(kind: "applied" | "kept") {
		if (state !== "locked") return;
		setResolution(kind);
		setState("resolving");
		timers.current.push(
			setTimeout(() => setState("ready"), reduce ? 0 : RESOLVE_MS),
		);
	}

	function publish() {
		if (state !== "ready") return;
		setState("published");
		if (reduce) {
			setLiveCount(CHANNELS.length);
			return;
		}
		CHANNELS.forEach((c, i) => {
			timers.current.push(setTimeout(() => setLiveCount(i + 1), c.delay));
		});
	}

	function reset() {
		timers.current.forEach(clearTimeout);
		timers.current = [];
		setResolution(null);
		setHero("kitchen");
		setLiveCount(0);
		setState("locked");
	}

	const ready = state === "ready";
	const phrase = resolution === "applied" && state === "ready" ? REWRITE : FLAGGED;

	return (
		<MotionConfig reducedMotion="user">
			<div className="mt-10 overflow-hidden rounded-lg border border-line bg-panel shadow-(--shadow)">
				{/* Card header */}
				<div className="flex items-center justify-between border-b border-line px-5 py-4">
					<span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
						{state === "published" ? "Syndicate · Stage 4" : "Draft · Stage 3"}
					</span>
					<StatusPill ready={ready} published={state === "published"} />
				</div>

				{state === "published" ? (
					<SyndicatePanel liveCount={liveCount} />
				) : (
					<>
				{/* Confidence */}
				<div className="px-5 pt-5">
					<div className="rounded-md bg-ok/10 px-4 py-3">
						<div className="flex flex-wrap items-baseline gap-x-2">
							<span className="text-sm font-semibold text-ok">
								91% confidence
							</span>
							<span className="text-xs text-fg-soft">
								this draft matches your inputs
							</span>
						</div>
						<div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ok/20">
							<div className="h-full w-[91%] rounded-full bg-ok" />
						</div>
					</div>
				</div>

				{/* Hero strip — AI suggests, agent can override */}
				<div className="px-5 pt-5">
					<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
						Hero photo · AI suggested the kitchen
					</p>
					<div className="mt-2 grid grid-cols-4 gap-2">
						{PHOTOS.map((p) => {
							const selected = hero === p.key;
							return (
								<button
									key={p.key}
									type="button"
									onClick={() => setHero(p.key)}
									aria-pressed={selected}
									aria-label={`Use ${p.label} as hero photo`}
									className={`group relative aspect-[4/3] overflow-hidden rounded-md border-2 transition-colors duration-(--duration-fast) ease-(--ease-snappy) ${
										selected
											? "border-accent"
											: "border-transparent hover:border-line-strong"
									}`}
								>
									<Image
										src={p.src}
										alt={p.label}
										fill
										sizes="140px"
										className="object-cover"
									/>
									{"aiPick" in p && p.aiPick && (
										<span className="absolute left-1 top-1 rounded-full bg-panel/95 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
											AI pick
										</span>
									)}
									<span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 pb-1 pt-3 text-left text-[10px] font-medium text-white">
										{p.label}
									</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Listing copy with the inline-flagged phrase */}
				<div className="px-5 py-5">
					<p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
						Listing description
					</p>
					<p className="mt-2 max-w-[52ch] text-base leading-relaxed text-fg">
						Bright,{" "}
						<Phrase phrase={phrase} flagged={!ready || resolution === "kept"} />{" "}
						home close to parks and schools. The 2019 build lives like new.
					</p>
				</div>

				{/* Compliance flag — collapses once the agent decides */}
				<AnimatePresence initial={false}>
					{state === "locked" && (
						<motion.div
							key="flag"
							initial={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.22, ease: EASE }}
							className="overflow-hidden px-5"
						>
							<div className="rounded-md border border-warn/40 bg-warn-wash px-4 py-3">
								<p className="flex items-center gap-2 text-sm font-semibold text-warn-fg">
									<Flag className="size-3.5" aria-hidden />
									Fair-housing review needed
								</p>
								<p className="mt-1 text-sm text-warn-fg/90">
									“{FLAGGED}” can read as describing the buyer, not the home.
								</p>
								<div className="mt-3 flex flex-wrap gap-2">
									<button
										onClick={() => resolve("applied")}
										className="rounded-sm bg-warn px-3 py-1.5 font-mono text-2xs uppercase tracking-wider text-selection-fg transition-transform duration-(--duration-fast) ease-(--ease-snappy) active:scale-[0.97]"
									>
										Apply suggestion
									</button>
									<button
										onClick={() => resolve("kept")}
										className="rounded-sm border border-warn/50 px-3 py-1.5 font-mono text-2xs uppercase tracking-wider text-warn-fg transition-transform duration-(--duration-fast) ease-(--ease-snappy) active:scale-[0.97]"
									>
										Keep as written
									</button>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Gate: checks line + publish button */}
				<div className="flex items-center justify-between gap-4 px-5 py-5">
					<ChecksLine state={state} />
					<PublishButton ready={ready} onPublish={publish} />
				</div>
					</>
				)}
			</div>

			{/* Replay affordance */}
			<div className="mt-3 flex items-center gap-3">
				<button
					onClick={reset}
					disabled={state === "locked"}
					className="inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-wider text-fg-faint transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-fg-soft disabled:cursor-not-allowed disabled:opacity-40"
				>
					<RotateCcw className="size-3" aria-hidden />
					Replay
				</button>
				<span className="font-mono text-2xs text-fg-faint">
					{state === "published"
						? "One approval pushed the listing to every channel."
						: state === "locked"
							? "Publish is disabled until the flag is handled."
							: resolution === "applied"
								? "Rewrite applied. Gate unlocked. Now approve it."
								: "Kept as written, on the record. Gate unlocked. Now approve it."}
				</span>
			</div>
		</MotionConfig>
	);
}

function Phrase({ phrase, flagged }: { phrase: string; flagged: boolean }) {
	return (
		<span
			className={
				flagged
					? "underline decoration-warn decoration-wavy decoration-2 underline-offset-4"
					: "rounded-[3px] bg-ok/15 px-0.5 text-fg"
			}
		>
			{phrase}
		</span>
	);
}

function StatusPill({
	ready,
	published,
}: {
	ready: boolean;
	published?: boolean;
}) {
	const on = ready || published;
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-2xs uppercase tracking-wider transition-colors duration-(--duration-normal) ease-(--ease-snappy) ${
				on
					? "border-ok/40 bg-ok/10 text-ok"
					: "border-line bg-bg-2 text-fg-faint"
			}`}
		>
			<span
				className={`size-1.5 rounded-full transition-colors duration-(--duration-normal) ease-(--ease-snappy) ${
					on ? "bg-ok" : "bg-fg-faint"
				}`}
			/>
			{published ? "Published" : ready ? "Ready to publish" : "Not published"}
		</span>
	);
}

function SyndicatePanel({ liveCount }: { liveCount: number }) {
	const allLive = liveCount >= CHANNELS.length;
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.24, ease: EASE }}
			className="px-5 py-5"
		>
			<div
				className={`rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-(--duration-normal) ease-(--ease-snappy) ${
					allLive ? "bg-ok/10 text-ok" : "bg-accent-wash text-accent"
				}`}
			>
				{allLive
					? "Live on all 5 channels"
					: `Live on ${liveCount} of ${CHANNELS.length} channels · ${
							CHANNELS.length - liveCount
						} still publishing`}
			</div>
			<ul className="mt-3 divide-y divide-line rounded-md border border-line">
				{CHANNELS.map((c, i) => {
					const status =
						i < liveCount ? "live" : i === liveCount ? "publishing" : "queued";
					return (
						<li
							key={c.name}
							className="flex items-center justify-between gap-3 px-4 py-3"
						>
							<span className="min-w-0 truncate text-sm text-fg">
								{c.name}
							</span>
							<span className="flex shrink-0 items-center gap-3">
								<span className="font-mono text-2xs text-fg-faint">
									{status === "live" ? "just now" : "—"}
								</span>
								<span
									className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-2xs uppercase tracking-wider ${
										status === "live"
											? "bg-ok/10 text-ok"
											: status === "publishing"
												? "bg-warn/15 text-warn-fg"
												: "bg-bg-2 text-fg-faint"
									}`}
								>
									{status === "publishing" && <Spinner />}
									{status === "live" && (
										<span className="size-1.5 rounded-full bg-ok" />
									)}
									{status === "live"
										? "Live"
										: status === "publishing"
											? "Publishing"
											: "Queued"}
								</span>
							</span>
						</li>
					);
				})}
			</ul>
		</motion.div>
	);
}

function ChecksLine({ state }: { state: State }) {
	return (
		<div className="min-w-0 font-mono text-2xs uppercase tracking-wider">
			<AnimatePresence mode="wait" initial={false}>
				<motion.span
					key={state}
					initial={{ opacity: 0, y: 4 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -4 }}
					transition={{ duration: 0.16, ease: EASE }}
					className="flex items-center gap-2"
				>
					{state === "ready" ? (
						<>
							<Check className="size-3.5 text-ok" aria-hidden />
							<span className="text-ok">1 of 1 checks passed</span>
						</>
					) : state === "resolving" ? (
						<>
							<Spinner />
							<span className="text-fg-faint">Resolving…</span>
						</>
					) : (
						<>
							<span className="size-3.5 rounded-full border border-fg-faint" />
							<span className="text-fg-faint">1 check pending</span>
						</>
					)}
				</motion.span>
			</AnimatePresence>
		</div>
	);
}

function PublishButton({
	ready,
	onPublish,
}: {
	ready: boolean;
	onPublish: () => void;
}) {
	return (
		<motion.button
			type="button"
			disabled={!ready}
			aria-disabled={!ready}
			onClick={onPublish}
			// Scale pop on unlock; nothing appears from nothing, it just asserts.
			animate={ready ? { scale: [1, 1.04, 1] } : { scale: 1 }}
			transition={{ duration: 0.28, ease: EASE }}
			whileTap={ready ? { scale: 0.97 } : undefined}
			className={`shrink-0 rounded-sm px-4 py-2 font-mono text-2xs uppercase tracking-wider transition-colors duration-(--duration-normal) ease-(--ease-snappy) ${
				ready
					? "cursor-pointer bg-accent text-selection-fg hover:bg-accent-deep"
					: "cursor-not-allowed bg-bg-2 text-fg-faint"
			}`}
		>
			Approve &amp; publish
		</motion.button>
	);
}

function Spinner() {
	return (
		<span
			className="size-3.5 animate-spin rounded-full border-2 border-fg-faint border-t-transparent"
			aria-hidden
		/>
	);
}
