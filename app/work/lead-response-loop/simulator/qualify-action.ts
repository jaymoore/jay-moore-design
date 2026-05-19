"use server";

import { headers } from "next/headers";
import type { QualifierOutput } from "./state-machine";
import { FALLBACK_OUTPUTS, FALLBACK_DEFAULT } from "./fallback";
import { checkRateLimit } from "./rate-limit";

const DEMO_BUSINESS_PROFILE = {
	partner_id: "simulator-demo",
	business_name: "Demo HVAC + Plumbing",
	service_offerings: ["AC", "heating", "water heater", "plumbing", "furnace"],
	service_area: ["Austin", "Round Rock"],
	hours: "8a-6p Mon-Fri",
};

const MAX_INPUT_CHARS = 280;
const QUALIFY_TIMEOUT_MS = 8000;

export type QualifyActionResult = {
	output: QualifierOutput;
	source: "live" | "fallback";
	reason?: "no_endpoint" | "rate_limited" | "timeout" | "upstream_error" | "input_too_long";
};

export async function qualifyAction(input: {
	scenario_id?: string;
	prospect_text: string;
}): Promise<QualifyActionResult> {
	const h = await headers();
	const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

	// 1. Input length cap
	if (input.prospect_text.length > MAX_INPUT_CHARS) {
		return {
			output: input.scenario_id ? FALLBACK_OUTPUTS[input.scenario_id] ?? FALLBACK_DEFAULT : FALLBACK_DEFAULT,
			source: "fallback",
			reason: "input_too_long",
		};
	}

	// 2. Rate limit
	const rl = await checkRateLimit(ip, {
		UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
		UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
	});
	if (!rl.allowed) {
		return {
			output: input.scenario_id ? FALLBACK_OUTPUTS[input.scenario_id] ?? FALLBACK_DEFAULT : FALLBACK_DEFAULT,
			source: "fallback",
			reason: "rate_limited",
		};
	}

	// 3. If endpoint not configured, fall back
	const endpoint = process.env.QUALIFY_ENDPOINT_URL;
	const token = process.env.QUALIFY_API_TOKEN;
	if (!endpoint || !token) {
		return {
			output: input.scenario_id ? FALLBACK_OUTPUTS[input.scenario_id] ?? FALLBACK_DEFAULT : FALLBACK_DEFAULT,
			source: "fallback",
			reason: "no_endpoint",
		};
	}

	// 4. Real upstream call with timeout
	try {
		const result = await Promise.race([
			fetch(`${endpoint}/qualify`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					prospect_messages: [input.prospect_text],
					business_profile: DEMO_BUSINESS_PROFILE,
				}),
			}),
			new Promise<never>((_, rej) =>
				setTimeout(() => rej(new Error("timeout")), QUALIFY_TIMEOUT_MS),
			),
		]);
		if (!result.ok) throw new Error(`Upstream ${result.status}`);
		const output = (await result.json()) as QualifierOutput;
		return { output, source: "live" };
	} catch (e) {
		const reason = (e as Error).message === "timeout" ? "timeout" : "upstream_error";
		return {
			output: input.scenario_id ? FALLBACK_OUTPUTS[input.scenario_id] ?? FALLBACK_DEFAULT : FALLBACK_DEFAULT,
			source: "fallback",
			reason: reason as "timeout" | "upstream_error",
		};
	}
}
