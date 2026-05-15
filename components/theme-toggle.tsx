"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-sm text-fg-soft transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:border-line-strong hover:text-fg"
    >
      <span
        className="block size-3 rounded-full border border-current"
        aria-hidden
      />
      {theme}
    </button>
  );
}
