import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

export type MetricsSnapshot = {
	schema_version: string;
	generated_at: number;
	total_calls: number;
	qualified_pct: number;
	latency_p50_ms: number;
	latency_p95_ms: number;
	accuracy_on_labeled_set: number;
	beta_partner_days_live: number;
};

const SNAPSHOT_PATH = "app/work/lead-response-loop/metrics-snapshot.json";
const FETCH_TIMEOUT_MS = 8000;

/**
 * Fetches the latest aggregate metrics from the product's /metrics/public.
 * Falls back to the committed snapshot JSON on any of:
 *   - missing env vars (QUALIFY_ENDPOINT_URL, METRICS_API_TOKEN)
 *   - non-2xx response
 *   - network timeout
 *   - JSON parse failure
 *
 * Server-only. Tokens never reach the client bundle.
 */
export async function getMetricsSnapshot(): Promise<{
	data: MetricsSnapshot;
	source: "live" | "snapshot";
}> {
	const endpoint = process.env.QUALIFY_ENDPOINT_URL;
	const token = process.env.METRICS_API_TOKEN;

	if (endpoint && token) {
		try {
			const res = await Promise.race([
				fetch(`${endpoint}/metrics/public`, {
					headers: { Authorization: `Bearer ${token}` },
					next: { revalidate: 60 },
				}),
				new Promise<never>((_, rej) =>
					setTimeout(() => rej(new Error("timeout")), FETCH_TIMEOUT_MS),
				),
			]);
			if (res.ok) {
				const data = (await res.json()) as MetricsSnapshot;
				return { data, source: "live" };
			}
		} catch {
			// fall through to snapshot
		}
	}

	const raw = await readFile(
		path.join(process.cwd(), SNAPSHOT_PATH),
		"utf8",
	);
	return { data: JSON.parse(raw) as MetricsSnapshot, source: "snapshot" };
}
