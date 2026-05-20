// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PhoneMockupStrip } from "../../app/work/lead-response-loop/phone-mockups";

describe("PhoneMockupStrip", () => {
	it("renders three phone panels labeled Prospect / Owner / Prospect (after YES)", () => {
		render(<PhoneMockupStrip />);
		expect(screen.getByText("Prospect")).toBeDefined();
		expect(screen.getByText("Owner")).toBeDefined();
		expect(screen.getByText("Prospect (after YES)")).toBeDefined();
	});

	it("includes the auto-text-back body in the prospect phone", () => {
		render(<PhoneMockupStrip />);
		expect(
			screen.getByText(/Sorry we missed your call/),
		).toBeDefined();
	});

	it("includes the URGENT classification in the owner phone", () => {
		render(<PhoneMockupStrip />);
		expect(screen.getByText("URGENT")).toBeDefined();
		expect(screen.getByText(/92% conf/)).toBeDefined();
	});

	it("includes the booking link in the post-YES prospect phone", () => {
		render(<PhoneMockupStrip />);
		expect(
			screen.getByText(/cal.com\/spm\/hvac-appointment/),
		).toBeDefined();
	});
});
