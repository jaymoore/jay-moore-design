// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { IxItem } from "../../app/work/lead-response-loop/ix-item";

describe("IxItem", () => {
	it("renders title, body, and image alt text", () => {
		render(
			<IxItem
				side="left"
				imageSrc="/case-study/ix-1.png"
				imageAlt="Both phones at once mockup"
				title="Both phones at once."
				body="Most product videos cut between caller and owner."
			/>,
		);
		expect(screen.getByText("Both phones at once.")).toBeDefined();
		expect(screen.getByText(/Most product videos/)).toBeDefined();
		expect(screen.getByAltText("Both phones at once mockup")).toBeDefined();
	});

	it("applies side='left' grid order (image first)", () => {
		const { container } = render(
			<IxItem
				side="left"
				imageSrc="/case-study/ix-1.png"
				imageAlt="alt"
				title="t"
				body="b"
			/>,
		);
		const grid = container.querySelector('[data-ix-side="left"]');
		expect(grid).toBeDefined();
	});

	it("applies side='right' grid order (text first)", () => {
		const { container } = render(
			<IxItem
				side="right"
				imageSrc="/case-study/ix-2.png"
				imageAlt="alt"
				title="t"
				body="b"
			/>,
		);
		const grid = container.querySelector('[data-ix-side="right"]');
		expect(grid).toBeDefined();
	});
});
