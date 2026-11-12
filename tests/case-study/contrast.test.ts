import { describe, it, expect } from "vitest";
import { contrastRatio } from "../../app/work/email-samples/contrast";

describe("contrastRatio", () => {
	it("matches known WCAG values", () => {
		expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
		expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
		// Order of arguments does not matter.
		expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(
			contrastRatio("#ffffff", "#767676"),
			10,
		);
		expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(4.54, 2);
	});
});
