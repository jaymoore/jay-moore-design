import type { Scenario } from "./scenarios";

// ---------- State ----------

export type SimulatorState = {
	scenario: Scenario | null;
	prospect_messages: Array<{ kind: "call_missed" | "text_in" | "text_out"; body: string; t: number }>;
	owner_messages: Array<{ body: string; t: number }>;
	events: Array<{ t: number; label: string }>;
	classification: QualifierOutput | null;
	owner_decision: "yes" | "no" | "info" | null;
	booking_link_sent: boolean;
	stage: "idle" | "running" | "awaiting_owner" | "complete";
	llm_latency_ms: number | null;
};

export const INITIAL_STATE: SimulatorState = {
	scenario: null,
	prospect_messages: [],
	owner_messages: [],
	events: [],
	classification: null,
	owner_decision: null,
	booking_link_sent: false,
	stage: "idle",
	llm_latency_ms: null,
};

// ---------- Mirror the product's frozen QualifierOutput shape ----------

export type QualifierOutput = {
	label: "urgent" | "standard" | "not_a_fit" | "spam";
	confidence: number;
	evidence_quotes: string[];
	extracted: {
		service_type: string;
		urgency: "high" | "medium" | "low" | "none";
		name: string | null;
		location: string | null;
	};
	recommended_action: "send_owner_notification" | "auto_dismiss" | "manual_review";
};

// ---------- Events ----------

export type SimEvent =
	| { type: "scenario_selected"; scenario: Scenario }
	| { type: "call_missed"; t: number }
	| { type: "text_back_sent"; body: string; t: number }
	| { type: "prospect_replied"; body: string; t: number }
	| { type: "prefilter_run"; decision: "spam" | "pass"; pattern: string | null; t: number }
	| { type: "llm_classified"; output: QualifierOutput; latency_ms: number; t: number }
	| { type: "owner_notified"; body: string; t: number }
	| { type: "owner_replied_yes"; t: number }
	| { type: "owner_replied_no"; t: number }
	| { type: "booking_link_sent"; body: string; t: number }
	| { type: "reset" };

export function reducer(state: SimulatorState, event: SimEvent): SimulatorState {
	switch (event.type) {
		case "scenario_selected":
			return {
				...INITIAL_STATE,
				scenario: event.scenario,
				stage: "running",
			};
		case "call_missed":
			return {
				...state,
				prospect_messages: [
					...state.prospect_messages,
					{ kind: "call_missed", body: "Call missed (no-answer)", t: event.t },
				],
				events: [...state.events, { t: event.t, label: "Call missed" }],
			};
		case "text_back_sent":
			return {
				...state,
				prospect_messages: [
					...state.prospect_messages,
					{ kind: "text_out", body: event.body, t: event.t },
				],
				events: [...state.events, { t: event.t, label: "Auto text-back sent" }],
			};
		case "prospect_replied":
			return {
				...state,
				prospect_messages: [
					...state.prospect_messages,
					{ kind: "text_in", body: event.body, t: event.t },
				],
				events: [...state.events, { t: event.t, label: "Prospect reply received" }],
			};
		case "prefilter_run":
			return {
				...state,
				events: [
					...state.events,
					{
						t: event.t,
						label:
							event.decision === "spam"
								? `Pre-filter: spam (${event.pattern ?? "matched"})`
								: "Pre-filter: pass",
					},
				],
				...(event.decision === "spam"
					? {
							stage: "complete" as const,
							classification: {
								label: "spam" as const,
								confidence: 1,
								evidence_quotes: [],
								extracted: {
									service_type: "spam",
									urgency: "none" as const,
									name: null,
									location: null,
								},
								recommended_action: "auto_dismiss" as const,
							},
						}
					: {}),
			};
		case "llm_classified":
			return {
				...state,
				classification: event.output,
				llm_latency_ms: event.latency_ms,
				events: [
					...state.events,
					{
						t: event.t,
						label: `Claude classified: ${event.output.label} · ${Math.round((event.output.confidence ?? 0) * 100)}% conf`,
					},
				],
				stage: "awaiting_owner",
			};
		case "owner_notified":
			return {
				...state,
				owner_messages: [...state.owner_messages, { body: event.body, t: event.t }],
				events: [...state.events, { t: event.t, label: "Owner notified" }],
			};
		case "owner_replied_yes":
			return {
				...state,
				owner_decision: "yes",
				events: [...state.events, { t: event.t, label: "Owner replied YES" }],
			};
		case "owner_replied_no":
			return {
				...state,
				owner_decision: "no",
				stage: "complete",
				events: [...state.events, { t: event.t, label: "Owner replied NO" }],
			};
		case "booking_link_sent":
			return {
				...state,
				booking_link_sent: true,
				prospect_messages: [
					...state.prospect_messages,
					{ kind: "text_out", body: event.body, t: event.t },
				],
				events: [...state.events, { t: event.t, label: "Cal.com link sent" }],
				stage: "complete",
			};
		case "reset":
			return INITIAL_STATE;
		default:
			return state;
	}
}
