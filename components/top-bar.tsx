"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

type NavItem =
  | { kind: "anchor"; href: string; label: string; matchPathname?: string }
  | { kind: "external"; href: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { kind: "anchor", href: "/#start", label: "Start", matchPathname: "/" },
  { kind: "anchor", href: "/#demo", label: "Demo" },
  { kind: "anchor", href: "/#depth", label: "Depth" },
  { kind: "external", href: "https://github.com/jaymoore", label: "Github" },
];

function navClass(active: boolean) {
  return `text-sm transition-colors duration-(--duration-fast) ease-(--ease-snappy) ${
    active ? "text-accent" : "text-fg-soft hover:text-fg"
  }`;
}

function NavLink({
  item,
  pathname,
  onClick,
  className,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
  className?: string;
}) {
  if (item.kind === "external") {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={`inline-flex items-center gap-1 ${navClass(false)} ${className ?? ""}`}
      >
        {item.label}
        <ArrowUpRight
          size={16}
          strokeWidth={1.5}
          className="text-fg-faint"
          aria-hidden="true"
        />
      </a>
    );
  }
  const active = item.matchPathname ? pathname === item.matchPathname : false;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`${navClass(active)} ${className ?? ""}`}
    >
      {item.label}
    </Link>
  );
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
          className="flex items-center gap-2 text-sm text-fg transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-fg-soft"
        >
          <span className="brand-dot" aria-hidden />
          Jay Moore
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.label} item={item} pathname={pathname} />
          ))}
          <ThemeToggle />
        </nav>

        <button
          type="button"
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 rounded-sm transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:bg-bg-2 md:hidden"
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
        inert={!open}
        className={`overflow-hidden border-t border-line transition-[max-height,opacity] duration-(--duration-normal) ease-(--ease-snappy) md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="flex flex-col gap-px bg-line"
          aria-label="Mobile primary"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              pathname={pathname}
              onClick={() => setOpen(false)}
              className="block w-full bg-bg px-6 py-4"
            />
          ))}
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
