/**
 * Per-IP rate limit using Upstash Redis REST API. Server-only.
 * Returns {allowed: boolean, remaining: number, reset_at: number}.
 *
 * If Upstash env vars are missing, the function fails OPEN (returns allowed:true).
 * This is deliberate: a misconfigured Upstash should not block legitimate users
 * from the demo. The downstream qualifier fetch will still fall back to canned
 * outputs if the product endpoint is unavailable, so the demo never breaks.
 */

const KEY_PREFIX = "rl:lrl:";

export type RateLimitResult = {
	allowed: boolean;
	remaining: number;
	reset_at: number;
};

export async function checkRateLimit(
	identifier: string,
	env: { UPSTASH_REDIS_REST_URL?: string; UPSTASH_REDIS_REST_TOKEN?: string },
	opts: { windowMs?: number; max?: number } = {},
): Promise<RateLimitResult> {
	const windowMs = opts.windowMs ?? 60 * 60 * 1000; // 1 hour
	const max = opts.max ?? 10;

	if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
		return { allowed: true, remaining: max, reset_at: Date.now() + windowMs };
	}

	const key = KEY_PREFIX + identifier;
	try {
		const res = await fetch(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify([
				["INCR", key],
				["PEXPIRE", key, windowMs, "NX"],
			]),
		});
		if (!res.ok) {
			return { allowed: true, remaining: max, reset_at: Date.now() + windowMs };
		}
		const json = (await res.json()) as Array<{ result: number }>;
		const count = json[0]?.result ?? 1;
		return {
			allowed: count <= max,
			remaining: Math.max(0, max - count),
			reset_at: Date.now() + windowMs,
		};
	} catch {
		return { allowed: true, remaining: max, reset_at: Date.now() + windowMs };
	}
}
