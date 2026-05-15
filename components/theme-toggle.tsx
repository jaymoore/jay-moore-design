"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      aria-label="Toggle theme"
      className="inline-flex h-8 items-center gap-2 rounded-full border border-line px-3 text-sm text-fg-soft transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:border-line-strong hover:text-fg"
    >
      <span
        className="block size-3 rounded-full border border-current"
        aria-hidden
      />
      {theme}
    </button>
  );
}
