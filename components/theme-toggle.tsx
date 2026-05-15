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
      className="rounded-sm border border-line px-3 py-1 font-mono text-xs uppercase tracking-wider text-fg-soft transition-colors hover:border-line-strong hover:text-fg"
    >
      {next}
    </button>
  );
}
