import type { QualifierOutput } from "./state-machine";

/**
 * Pre-recorded "real" outputs for the canned scenarios. Used as the fallback
 * when the product /qualify endpoint is unavailable, rate-limited, or times
 * out. The values approximate what a healthy Claude Haiku call would return
 * for each input — so the demo still shows the right shape even offline.
 */
export const FALLBACK_OUTPUTS: Record<string, QualifierOutput> = {
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
};

export const FALLBACK_DEFAULT: QualifierOutput = FALLBACK_OUTPUTS["water-heater"]!;
