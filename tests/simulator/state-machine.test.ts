import { describe, it, expect } from "vitest";
import { reducer, INITIAL_STATE, type SimEvent, type QualifierOutput } from "../../app/work/lead-response-loop/simulator/state-machine";
import { CANNED_SCENARIOS } from "../../app/work/lead-response-loop/simulator/scenarios";

const URGENT: QualifierOutput = {
	label: "urgent",
	confidence: 0.92,
	evidence_quotes: ["water heater leaking"],
	extracted: { service_type: "water heater repair", urgency: "high", name: null, location: null },
	recommended_action: "send_owner_notification",
};

describe("state-machine reducer", () => {
	it("scenario_selected resets state and sets running stage", () => {
		const s = reducer(INITIAL_STATE, { type: "scenario_selected", scenario: CANNED_SCENARIOS[0]! });
		expect(s.scenario?.id).toBe("water-heater");
		expect(s.stage).toBe("running");
		expect(s.events).toHaveLength(0);
	});

	it("call_missed appends prospect + event", () => {
		const s = reducer(INITIAL_STATE, { type: "call_missed", t: 1000 });
		expect(s.prospect_messages).toHaveLength(1);
		expect(s.events).toHaveLength(1);
	});

	it("text_back_sent appends outbound message", () => {
		const s = reducer(INITIAL_STATE, { type: "text_back_sent", body: "Sorry we missed", t: 1100 });
		expect(s.prospect_messages[0]?.kind).toBe("text_out");
	});

	it("prospect_replied appends inbound message", () => {
		const s = reducer(INITIAL_STATE, { type: "prospect_replied", body: "leak", t: 2000 });
		expect(s.prospect_messages[0]?.kind).toBe("text_in");
	});

	it("prefilter_run with spam decision short-circuits to complete + sets spam classification", () => {
		const s = reducer(INITIAL_STATE, {
			type: "prefilter_run",
			decision: "spam",
			pattern: "shortened_url",
			t: 2200,
		});
		expect(s.stage).toBe("complete");
		expect(s.classification?.label).toBe("spam");
	});

	it("prefilter_run with pass decision does not change stage", () => {
		const s = reducer(
			{ ...INITIAL_STATE, stage: "running" },
			{ type: "prefilter_run", decision: "pass", pattern: null, t: 2200 },
		);
		expect(s.stage).toBe("running");
	});

	it("llm_classified sets classification and moves stage to awaiting_owner", () => {
		const s = reducer(INITIAL_STATE, {
			type: "llm_classified",
			output: URGENT,
			latency_ms: 1500,
			t: 3000,
		});
		expect(s.stage).toBe("awaiting_owner");
		expect(s.classification?.label).toBe("urgent");
		expect(s.llm_latency_ms).toBe(1500);
	});

	it("owner_notified appends owner message", () => {
		const s = reducer(INITIAL_STATE, { type: "owner_notified", body: "New lead", t: 3100 });
		expect(s.owner_messages).toHaveLength(1);
	});

	it("owner_replied_yes sets decision but does NOT complete stage", () => {
		const s = reducer(INITIAL_STATE, { type: "owner_replied_yes", t: 4000 });
		expect(s.owner_decision).toBe("yes");
		expect(s.stage).toBe("idle"); // unchanged from initial
	});

	it("owner_replied_no sets decision AND completes", () => {
		const s = reducer(INITIAL_STATE, { type: "owner_replied_no", t: 4000 });
		expect(s.owner_decision).toBe("no");
		expect(s.stage).toBe("complete");
	});

	it("booking_link_sent marks complete + records outbound + event", () => {
		const s = reducer(INITIAL_STATE, {
			type: "booking_link_sent",
			body: "Book here: https://cal.com/...",
			t: 5000,
		});
		expect(s.booking_link_sent).toBe(true);
		expect(s.stage).toBe("complete");
	});

	it("reset returns to INITIAL_STATE", () => {
		const dirty = reducer(INITIAL_STATE, { type: "scenario_selected", scenario: CANNED_SCENARIOS[0]! });
		const reset = reducer(dirty, { type: "reset" });
		expect(reset).toEqual(INITIAL_STATE);
	});
});

describe("full flow — urgent lead end to end", () => {
	it("scenario_selected → call_missed → text_back → reply → prefilter pass → llm urgent → owner notified → YES → booking sent", () => {
		const events: SimEvent[] = [
			{ type: "scenario_selected", scenario: CANNED_SCENARIOS[0]! },
			{ type: "call_missed", t: 1000 },
			{ type: "text_back_sent", body: "Sorry we missed", t: 1100 },
			{ type: "prospect_replied", body: "water heater leaking", t: 3000 },
			{ type: "prefilter_run", decision: "pass", pattern: null, t: 3200 },
			{ type: "llm_classified", output: URGENT, latency_ms: 1500, t: 4700 },
			{ type: "owner_notified", body: "New lead: urgent", t: 4800 },
			{ type: "owner_replied_yes", t: 5500 },
			{ type: "booking_link_sent", body: "Book: https://cal.com/...", t: 5600 },
		];
		const finalState = events.reduce(reducer, INITIAL_STATE);
		expect(finalState.stage).toBe("complete");
		expect(finalState.classification?.label).toBe("urgent");
		expect(finalState.owner_decision).toBe("yes");
		expect(finalState.booking_link_sent).toBe(true);
		expect(finalState.events).toHaveLength(8); // every event except scenario_selected logs an entry
	});
});
