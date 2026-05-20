import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// RTL auto-cleanup relies on Jest globals. Vitest needs this explicit hook
// so the jsdom DOM is reset between tests. See:
// https://testing-library.com/docs/react-testing-library/api/#cleanup
afterEach(() => {
	cleanup();
});
