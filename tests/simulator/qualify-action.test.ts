import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock next/headers
vi.mock("next/headers", () => ({
	headers: async () => new Map([["cf-connecting-ip", "127.0.0.1"]]),
}));

import { qualifyAction } from "../../app/work/lead-response-loop/simulator/qualify-action";

const ORIGINAL_FETCH = globalThis.fetch;

describe("qualifyAction", () => {
	beforeEach(() => {
		delete process.env.QUALIFY_ENDPOINT_URL;
		delete process.env.QUALIFY_API_TOKEN;
		delete process.env.UPSTASH_REDIS_REST_URL;
		delete process.env.UPSTASH_REDIS_REST_TOKEN;
	});

	afterEach(() => {
		globalThis.fetch = ORIGINAL_FETCH;
	});

	it("returns fallback with reason=no_endpoint when QUALIFY_ENDPOINT_URL is unset", async () => {
		const result = await qualifyAction({
			scenario_id: "water-heater",
			prospect_text: "leak now",
		});
		expect(result.source).toBe("fallback");
		expect(result.reason).toBe("no_endpoint");
		expect(result.output.label).toBe("urgent");
	});

	it("returns fallback with reason=input_too_long when prospect_text exceeds 280 chars", async () => {
		const result = await qualifyAction({
			scenario_id: "water-heater",
			prospect_text: "x".repeat(500),
		});
		expect(result.source).toBe("fallback");
		expect(result.reason).toBe("input_too_long");
	});

	it("returns live output when upstream responds 200", async () => {
		process.env.QUALIFY_ENDPOINT_URL = "https://product.example.com";
		process.env.QUALIFY_API_TOKEN = "test-token";
		globalThis.fetch = vi.fn(async () => ({
			ok: true,
			status: 200,
			json: async () => ({
				label: "urgent",
				confidence: 0.99,
				evidence_quotes: ["leak now"],
				extracted: { service_type: "water heater", urgency: "high", name: null, location: null },
				recommended_action: "send_owner_notification",
			}),
		})) as never;

		const result = await qualifyAction({
			scenario_id: "water-heater",
			prospect_text: "leak now",
		});
		expect(result.source).toBe("live");
		expect(result.output.confidence).toBe(0.99);
	});

	it("returns fallback with reason=upstream_error when upstream returns 5xx", async () => {
		process.env.QUALIFY_ENDPOINT_URL = "https://product.example.com";
		process.env.QUALIFY_API_TOKEN = "test-token";
		globalThis.fetch = vi.fn(async () => ({
			ok: false,
			status: 500,
			text: async () => "Internal Server Error",
		})) as never;

		const result = await qualifyAction({
			scenario_id: "ac-tune-up",
			prospect_text: "AC please",
		});
		expect(result.source).toBe("fallback");
		expect(result.reason).toBe("upstream_error");
		expect(result.output.label).toBe("standard"); // ac-tune-up canned output
	});
});
