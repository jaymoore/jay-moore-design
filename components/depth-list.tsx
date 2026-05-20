"use client";

import Link from "next/link";
import { motion, MotionConfig } from "motion/react";

type DepthItem = {
  number: string;
  title: string;
  body: string;
  cta: string;
  href: string;
};

const ITEMS: DepthItem[] = [
  {
    number: "01",
    title: "Lead Response Loop",
    body: "A system I designed and built that turns missed calls into bookings for HVAC and plumbing businesses. End to end — the design and the code. Password-gated.",
    cta: "Case study",
    href: "/work/lead-response-loop",
  },
  {
    number: "02",
    title: "About — the pivot",
    body: "Ten years of product design at Fiserv, Kleinfelder, and SPM. Why I'm shipping in code now too.",
    cta: "Background",
    href: "/about",
  },
  {
    number: "03",
    title: "Get in touch",
    body: "Open to Senior / Staff Product Designer roles. US remote.",
    cta: "Contact",
    href: "mailto:jay@jaymoore.net",
  },
];

// Motion library accepts numeric durations and easing tuples, not CSS variables.
// These literals mirror process/token-contract.md exactly.
//   duration 0.5s        ← --duration-slow (400ms) nudged up so reveal is visible
//   ease tuple           ← --ease-snappy: cubic-bezier(.32, .72, 0, 1)
//   stagger base 0.05s   ← --stagger-base: 50ms
//   stagger step 0.10s   ← --stagger-step 80ms, nudged up for clearer cascade
const ROW_DURATION_S = 0.5;
const ROW_EASE = [0.32, 0.72, 0, 1] as [number, number, number, number];
const STAGGER_BASE_S = 0.05;
const STAGGER_STEP_S = 0.1;

export function DepthList() {
  return (
    <MotionConfig reducedMotion="user">
      <ol className="mt-8">
        {ITEMS.map((item, i) => (
          <DepthRow
            key={item.number}
            item={item}
            index={i}
            isLast={i === ITEMS.length - 1}
          />
        ))}
      </ol>
    </MotionConfig>
  );
}

function DepthRow({
  item,
  index,
  isLast,
}: {
  item: DepthItem;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, margin: "-5% 0px -5% 0px" }}
      transition={{
        duration: ROW_DURATION_S,
        ease: ROW_EASE,
        delay: STAGGER_BASE_S + STAGGER_STEP_S * index,
      }}
      className={`border-t border-line ${isLast ? "border-b" : ""}`}
    >
      <Link
        href={item.href}
        className="group grid grid-cols-[48px_1fr] items-start gap-4 rounded-sm px-4 py-8 transition-all duration-(--duration-fast) ease-(--ease-snappy) hover:shadow-(--shadow) sm:grid-cols-[48px_1fr_160px]"
      >
        <span
          aria-hidden
          className="pt-1 font-mono text-2xs text-fg-faint"
        >
          {item.number}
        </span>

        <div className="min-w-0">
          <h3 className="text-lg font-medium leading-tight text-fg transition-colors duration-(--duration-fast) ease-(--ease-snappy) group-hover:text-accent sm:text-xl">
            {item.title}
          </h3>
          <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-fg-soft">
            {item.body}
          </p>
        </div>

        <span className="hidden self-start pt-1 text-right font-mono text-2xs uppercase tracking-wider text-accent sm:flex sm:items-center sm:justify-end sm:gap-1">
          {item.cta}
          <span
            aria-hidden
            className="inline-block transition-transform duration-(--duration-fast) ease-(--ease-snappy) group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </Link>
    </motion.li>
  );
}
