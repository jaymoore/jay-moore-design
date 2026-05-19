"use client";

import { useReducer } from "react";
import { reducer, INITIAL_STATE, type QualifierOutput } from "./state-machine";
import { CANNED_SCENARIOS, type Scenario } from "./scenarios";
import { ScenarioPicker } from "./scenario-picker";
import { ProspectPane } from "./prospect-pane";
import { OwnerPane } from "./owner-pane";
import { EventLog } from "./event-log";

const CANNED_OUTPUTS: Record<string, QualifierOutput> = {
	"water-heater": {
		label: "urgent",
		confidence: 0.94,
		evidence_quotes: ["water heater is leaking everywhere", "can someone come today"],
		extracted: {
			service_type: "water heater repair",
			urgency: "high",
			name: null,
			location: null,
		},
		recommended_action: "send_owner_notification",
	},
	"ac-tune-up": {
		label: "standard",
		confidence: 0.81,
		evidence_quotes: ["schedule an AC tune-up sometime next month"],
		extracted: {
			service_type: "AC tune-up",
			urgency: "low",
			name: null,
			location: null,
		},
		recommended_action: "send_owner_notification",
	},
	"parts-inquiry": {
		label: "not_a_fit",
		confidence: 0.86,
		evidence_quotes: ["Just need a replacement thermostat, not install"],
		extracted: {
			service_type: "parts only",
			urgency: "none",
			name: null,
			location: null,
		},
		recommended_action: "manual_review",
	},
	// obvious-spam handled via prefilter short-circuit, not LLM
};

const TEXT_BACK_BODY =
	"Sorry we missed your call. Can we help via text? Reply with what you need and we'll get back to you. Reply STOP to opt out.";

function isCannedSpam(prospect_text: string): boolean {
	return /\b(you won|congratulations|bit\.ly|tinyurl)/i.test(prospect_text);
}

function formatOwnerBody(output: QualifierOutput): string {
	const conf = Math.round((output.confidence ?? 0) * 100);
	const quote = output.evidence_quotes[0] ?? "(no quote)";
	return `New lead: Caller A1 — ${output.extracted.service_type} — ${output.label.toUpperCase()} · ${conf}% conf\nEvidence: "${quote}"\nReply YES, NO, INFO.`;
}

export function SimulatorClient() {
	const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

	async function runScenario(s: Scenario) {
		dispatch({ type: "scenario_selected", scenario: s });
		const t0 = Date.now();
		await new Promise((r) => setTimeout(r, 300));
		dispatch({ type: "call_missed", t: Date.now() - t0 });
		await new Promise((r) => setTimeout(r, 500));
		dispatch({ type: "text_back_sent", body: TEXT_BACK_BODY, t: Date.now() - t0 });
		await new Promise((r) => setTimeout(r, 1200));
		dispatch({ type: "prospect_replied", body: s.prospect_text, t: Date.now() - t0 });
		await new Promise((r) => setTimeout(r, 400));

		if (isCannedSpam(s.prospect_text)) {
			dispatch({
				type: "prefilter_run",
				decision: "spam",
				pattern: "shortened_url",
				t: Date.now() - t0,
			});
			return;
		}
		dispatch({ type: "prefilter_run", decision: "pass", pattern: null, t: Date.now() - t0 });

		const output = CANNED_OUTPUTS[s.id];
		if (!output) return;

		await new Promise((r) => setTimeout(r, 1500));
		dispatch({
			type: "llm_classified",
			output,
			latency_ms: 1500,
			t: Date.now() - t0,
		});
		await new Promise((r) => setTimeout(r, 200));
		dispatch({
			type: "owner_notified",
			body: formatOwnerBody(output),
			t: Date.now() - t0,
		});
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

	return (
		<div className="my-12 flex flex-col gap-6">
			<ScenarioPicker
				scenarios={CANNED_SCENARIOS}
				onSelect={runScenario}
				disabled={state.stage === "running" || state.stage === "awaiting_owner"}
			/>
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
					onClick={() => dispatch({ type: "reset" })}
					className="self-start font-mono text-2xs uppercase tracking-wider text-accent transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-accent-deep"
				>
					Reset →
				</button>
			)}
		</div>
	);
}
