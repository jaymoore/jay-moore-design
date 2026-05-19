"use client";

import { useReducer, useRef, useState } from "react";
import { reducer, INITIAL_STATE, type QualifierOutput } from "./state-machine";
import { CANNED_SCENARIOS, type Scenario } from "./scenarios";
import { ScenarioPicker } from "./scenario-picker";
import { ProspectPane } from "./prospect-pane";
import { OwnerPane } from "./owner-pane";
import { EventLog } from "./event-log";
import { qualifyAction } from "./qualify-action";

// Mirror the product's prefilter regex patterns (inline, no shared import).
const PREFILTER_PATTERNS: Array<[RegExp, string]> = [
	[/\b(you won|congratulations)\b.*\b(click|claim|prize)\b/i, "prize_scam"],
	[/\b(bit\.ly|tinyurl|short\.gy|t\.co\/)\b/i, "shortened_url"],
	[/\b(buy now|limited time|act fast|exclusive offer)\b/i, "marketing_spam"],
	[/\b(free gift|no cost|winner|you have been selected)\b/i, "prize_scam"],
];

function detectSpam(text: string): { isSpam: boolean; pattern: string | null } {
	for (const [re, label] of PREFILTER_PATTERNS) {
		if (re.test(text)) return { isSpam: true, pattern: label };
	}
	return { isSpam: false, pattern: null };
}

const MAX_CUSTOM_CHARS = 280;

const TEXT_BACK_BODY =
	"Sorry we missed your call. Can we help via text? Reply with what you need and we'll get back to you. Reply STOP to opt out.";

function formatOwnerBody(output: QualifierOutput): string {
	const conf = Math.round((output.confidence ?? 0) * 100);
	const quote = output.evidence_quotes[0] ?? "(no quote)";
	return `New lead: Caller A1 — ${output.extracted.service_type} — ${output.label.toUpperCase()} · ${conf}% conf\nEvidence: "${quote}"\nReply YES, NO, INFO.`;
}

export function SimulatorClient() {
	const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
	const [fallbackBanner, setFallbackBanner] = useState<string | null>(null);
	const [customText, setCustomText] = useState("");
	const [customSubmitting, setCustomSubmitting] = useState(false);
	const detailsRef = useRef<HTMLDetailsElement>(null);

	async function runScenario(s: Scenario) {
		setFallbackBanner(null);
		dispatch({ type: "scenario_selected", scenario: s });
		const t0 = Date.now();
		await new Promise((r) => setTimeout(r, 300));
		dispatch({ type: "call_missed", t: Date.now() - t0 });
		await new Promise((r) => setTimeout(r, 500));
		dispatch({ type: "text_back_sent", body: TEXT_BACK_BODY, t: Date.now() - t0 });
		await new Promise((r) => setTimeout(r, 1200));
		dispatch({ type: "prospect_replied", body: s.prospect_text, t: Date.now() - t0 });
		await new Promise((r) => setTimeout(r, 400));

		const spam = detectSpam(s.prospect_text);
		if (spam.isSpam) {
			dispatch({
				type: "prefilter_run",
				decision: "spam",
				pattern: spam.pattern,
				t: Date.now() - t0,
			});
			return;
		}
		dispatch({ type: "prefilter_run", decision: "pass", pattern: null, t: Date.now() - t0 });

		await new Promise((r) => setTimeout(r, 1500));

		const result = await qualifyAction({
			scenario_id: s.id,
			prospect_text: s.prospect_text,
		});

		if (result.source === "fallback") {
			const reasonLabels: Record<string, string> = {
				no_endpoint: "endpoint not configured",
				rate_limited: "rate limit reached",
				timeout: "endpoint timed out",
				upstream_error: "upstream error",
				input_too_long: "input too long",
			};
			setFallbackBanner(
				`Demo offline — showing cached output (${reasonLabels[result.reason ?? ""] ?? result.reason ?? "unknown"})`,
			);
		}

		const output = result.output;
		dispatch({
			type: "llm_classified",
			output,
			latency_ms: result.source === "live" ? Date.now() - t0 - 2900 : 1500,
			t: Date.now() - t0,
		});
		await new Promise((r) => setTimeout(r, 200));
		dispatch({
			type: "owner_notified",
			body: formatOwnerBody(output),
			t: Date.now() - t0,
		});
	}

	async function runCustom() {
		const text = customText.trim();
		if (!text || customSubmitting) return;
		setCustomSubmitting(true);
		if (detailsRef.current) detailsRef.current.open = false;
		await runScenario({ id: "custom", label: "Custom", prospect_text: text });
		setCustomSubmitting(false);
	}

	function ownerYes() {
		const t = Date.now();
		dispatch({ type: "owner_replied_yes", t });
		setTimeout(() => {
			dispatch({
				type: "booking_link_sent",
				body: "Book a time: https://cal.com/spm/hvac-appointment",
				t: Date.now(),
			});
		}, 400);
	}

	function ownerNo() {
		dispatch({ type: "owner_replied_no", t: Date.now() });
	}

	const isRunning = state.stage === "running" || state.stage === "awaiting_owner";

	return (
		<div className="my-12 flex flex-col gap-6">
			<ScenarioPicker
				scenarios={CANNED_SCENARIOS}
				onSelect={runScenario}
				disabled={isRunning}
			/>

			{/* Write your own — closed by default for friction */}
			<details ref={detailsRef} className="group">
				<summary className="cursor-pointer list-none font-mono text-2xs uppercase tracking-wider text-neutral-500 hover:text-neutral-300 transition-colors duration-(--duration-fast) ease-(--ease-snappy) select-none">
					<span className="group-open:hidden">+ Write your own (advanced)</span>
					<span className="hidden group-open:inline">− Write your own (advanced)</span>
				</summary>
				<div className="mt-3 flex flex-col gap-2">
					<textarea
						value={customText}
						onChange={(e) => setCustomText(e.target.value.slice(0, MAX_CUSTOM_CHARS))}
						disabled={isRunning || customSubmitting}
						placeholder="Type a prospect message to run through the qualifier…"
						rows={3}
						className="w-full resize-none rounded border border-neutral-700 bg-neutral-900 px-3 py-2 font-mono text-xs text-neutral-200 placeholder:text-neutral-600 focus:border-accent focus:outline-none disabled:opacity-40"
					/>
					<div className="flex items-center justify-between">
						<span className={`font-mono text-2xs ${customText.length >= MAX_CUSTOM_CHARS ? "text-red-400" : "text-neutral-600"}`}>
							{customText.length}/{MAX_CUSTOM_CHARS}
						</span>
						<button
							type="button"
							onClick={runCustom}
							disabled={isRunning || customSubmitting || !customText.trim()}
							className="font-mono text-2xs uppercase tracking-wider text-accent transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-accent-deep disabled:opacity-40 disabled:cursor-not-allowed"
						>
							{customSubmitting ? "Running…" : "Send →"}
						</button>
					</div>
				</div>
			</details>

			{/* Fallback banner */}
			{fallbackBanner && (
				<div className="rounded border border-yellow-700/40 bg-yellow-950/30 px-3 py-2 font-mono text-2xs text-yellow-400">
					{fallbackBanner}
				</div>
			)}

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<ProspectPane messages={state.prospect_messages} />
				<OwnerPane
					messages={state.owner_messages}
					classification={state.classification}
					awaitingDecision={state.stage === "awaiting_owner" && state.owner_decision === null}
					onYes={ownerYes}
					onNo={ownerNo}
				/>
			</div>
			<EventLog events={state.events} llm_latency_ms={state.llm_latency_ms} />
			{state.stage === "complete" && (
				<button
					type="button"
					onClick={() => {
						dispatch({ type: "reset" });
						setFallbackBanner(null);
					}}
					className="self-start font-mono text-2xs uppercase tracking-wider text-accent transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-accent-deep"
				>
					Reset →
				</button>
			)}
		</div>
	);
}
