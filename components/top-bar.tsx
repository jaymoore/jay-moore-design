"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { href: "/work", label: "Work" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TopBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-baseline gap-3 text-sm"
          aria-label="Jay Moore — home"
        >
          <span className="font-medium text-fg">Jay Moore</span>
          <span
            className="hidden font-mono text-xs text-fg-faint sm:inline"
            aria-hidden
          >
            /
          </span>
          <span className="hidden text-fg-soft sm:inline">Design Engineer</span>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`border-b-2 pb-1 text-sm transition-colors duration-(--duration-fast) ease-(--ease-snappy) ${
                  active
                    ? "border-accent text-accent"
                    : "border-transparent text-fg-soft hover:border-line hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>

        <button
          type="button"
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-expanded={open}
          aria-controls="top-bar-mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span
            className={`block h-px w-5 bg-fg transition-transform duration-(--duration-fast) ease-(--ease-snappy) ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-fg transition-opacity duration-(--duration-fast) ease-(--ease-snappy) ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-fg transition-transform duration-(--duration-fast) ease-(--ease-snappy) ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        id="top-bar-mobile-menu"
        className={`overflow-hidden border-t border-line transition-[max-height,opacity] duration-(--duration-normal) ease-(--ease-snappy) md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="flex flex-col gap-px bg-line"
          aria-label="Mobile primary"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`bg-bg px-6 py-4 text-sm ${
                  active ? "text-accent" : "text-fg-soft"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="flex items-center justify-between bg-bg px-6 py-4">
            <span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
              Theme
            </span>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
