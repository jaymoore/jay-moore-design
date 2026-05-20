"use client";

import { ArrowRight } from "lucide-react";
import { LayoutGroup, motion, MotionConfig } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type Mode = "ready" | "text" | "canvas";

type SegmentItem = {
  label: string;
  metric: string;
  detail: string;
};

type Section =
  | { type: "tldr"; content: string }
  | { type: "segments"; items: SegmentItem[] }
  | { type: "risk"; content: string }
  | { type: "recommendation"; content: string };

const SAMPLE_PROMPT = "Summarize Q3 performance for the board deck.";

const SAMPLE_STREAM_TEXT = `Q3 came in at +23%, driven mostly by Enterprise — that segment grew 47% year over year and is now at $14.2M ARR. Mid-Market was flat at $4.2M, the second quarter in a row at that level. SMB was down 6% to $1.8M, in line with the planned wind-down.

The number worth flagging is concentration. Your top three Enterprise accounts now represent 31% of recognized revenue, up from 24% in Q2. That's two consecutive quarters of the top trending in the wrong direction for diversification.

Recommendation: put segment concentration on the board agenda before the headline 23% lands.`;

const SAMPLE_SECTIONS: Section[] = [
  {
    type: "tldr",
    content:
      "Q3 +23% led by Enterprise (+47% YoY). Watch concentration: top 3 accounts = 31% of revenue.",
  },
  {
    type: "segments",
    items: [
      { label: "Enterprise", metric: "+47%", detail: "YoY · $14.2M ARR" },
      { label: "Mid-Market", metric: "Flat", detail: "$4.2M · 2 quarters" },
      { label: "SMB", metric: "-6%", detail: "$1.8M · planned" },
    ],
  },
  {
    type: "risk",
    content:
      "Top 3 enterprise accounts now represent 31% of recognized revenue, up from 24% in Q2. Concentration risk has grown two consecutive quarters.",
  },
  {
    type: "recommendation",
    content:
      "Board agenda: discuss segment diversification before celebrating the headline 23%.",
  },
];

const STREAM_INTERVAL_MS = 14;

// Motion library accepts numeric durations and easing tuples, not CSS variables.
// These literals mirror process/token-contract.md exactly. Keep in sync if the
// tokens iterate.
//   duration 0.4s  ←  --duration-slow: 400ms
//   ease tuple    ←  --ease-snappy: cubic-bezier(.32, .72, 0, 1)
const MORPH_DURATION_S = 0.4;
const MORPH_EASE = [0.32, 0.72, 0, 1] as [number, number, number, number];
const MORPH_TRANSITION = {
  duration: MORPH_DURATION_S,
  ease: MORPH_EASE,
};

function metricTone(metric: string): "positive" | "flat" | "negative" {
  if (/^\+/.test(metric)) return "positive";
  if (/^flat$/i.test(metric)) return "flat";
  return "negative";
}

function sectionLayoutId(type: Section["type"]) {
  return `ts-section-${type}`;
}

function segmentLayoutId(label: string) {
  return `ts-segment-${label.toLowerCase().replace(/\s+/g, "-")}`;
}

export function TrustSurface() {
  const [mode, setMode] = useState<Mode>("ready");
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopStream = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const startStream = useCallback(() => {
    stopStream();
    setStreamedText("");
    setIsStreaming(true);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 1;
      if (i >= SAMPLE_STREAM_TEXT.length) {
        setStreamedText(SAMPLE_STREAM_TEXT);
        stopStream();
      } else {
        setStreamedText(SAMPLE_STREAM_TEXT.slice(0, i));
      }
    }, STREAM_INTERVAL_MS);
  }, [stopStream]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function handlePrimary() {
    if (mode === "ready") {
      setMode("text");
      startStream();
    } else if (mode === "text") {
      setMode("canvas");
    } else {
      setMode("text");
    }
  }

  function handleReset() {
    stopStream();
    setStreamedText("");
    setMode("ready");
    setResetKey((k) => k + 1);
  }

  const stateLabel = mode === "ready" ? "Ready" : "Inferring";
  const stateDotClass =
    mode === "ready" ? "bg-fg-faint" : "bg-accent animate-pulse";
  const primaryLabel =
    mode === "ready" ? "Run" : mode === "text" ? "Show canvas" : "Show text";

  return (
    <div
      className="flex aspect-[16/10] flex-col rounded-md border border-line bg-panel"
      role="region"
      aria-label="Trust surface demo"
    >
      {/* State ribbon */}
      <div className="flex items-center border-b border-line px-4 py-2 font-mono text-2xs uppercase tracking-wider text-fg-faint">
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className={`block size-1.5 rounded-full ${stateDotClass}`}
          />
          {stateLabel}
        </span>
      </div>

      {/* Visually-hidden announcer for state transitions. Coarse — fires once
          per Ready / Inferring → result. Avoids screen-reader spam during the
          14ms streaming ticks. */}
      <span className="sr-only" role="status" aria-live="polite">
        {mode === "ready"
          ? "Ready."
          : isStreaming
            ? "Inferring."
            : "Inference complete."}
      </span>

      {/* Content area — not in a live region; updates per character would spam. */}
      <div className="flex-1 overflow-hidden">
        {mode === "ready" ? (
          <textarea
            key={resetKey}
            id="trust-surface-prompt"
            aria-label="Prompt"
            defaultValue={SAMPLE_PROMPT}
            className="size-full resize-none border-0 bg-transparent px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:outline-none"
          />
        ) : mode === "text" ? (
          <div className="size-full overflow-y-auto p-4">
            <p className="mb-4 font-mono text-2xs uppercase tracking-wider text-fg-faint">
              You asked: {SAMPLE_PROMPT}
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg">
              {streamedText}
              {isStreaming && <StreamingCursor />}
            </p>
          </div>
        ) : (
          <div className="size-full overflow-y-auto p-4">
            <p className="mb-4 font-mono text-2xs uppercase tracking-wider text-fg-faint">
              You asked: {SAMPLE_PROMPT}
            </p>
            <MotionConfig reducedMotion="user">
              <LayoutGroup>
                <SectionList sections={SAMPLE_SECTIONS} />
              </LayoutGroup>
            </MotionConfig>
          </div>
        )}
      </div>

      {/* Control ribbon */}
      <div className="flex items-center justify-end gap-2 border-t border-line px-4 py-2">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-sm border border-line px-3 py-1 font-mono text-2xs uppercase tracking-wider text-fg-soft transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:border-line-strong hover:text-fg"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handlePrimary}
          className="inline-flex items-center gap-1 rounded-sm bg-accent px-3 py-1 font-mono text-2xs uppercase tracking-wider text-selection-fg transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:bg-accent-deep"
        >
          {primaryLabel}
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

function SectionList({ sections }: { sections: Section[] }) {
  if (sections.length === 0) {
    return (
      <p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
        No content yet.
      </p>
    );
  }

  return (
    <div className="grid gap-5">
      {sections.map((section) => (
        <motion.div
          key={sectionLayoutId(section.type)}
          layoutId={sectionLayoutId(section.type)}
          layout
          transition={MORPH_TRANSITION}
        >
          <SectionAsCard section={section} />
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================
   Streaming cursor — used in text mode
   ============================================================ */

function StreamingCursor() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block w-[0.5ch] animate-pulse text-fg-faint"
    >
      ▍
    </span>
  );
}

/* ============================================================
   Canvas mode — card rendering of each section
   ============================================================ */

function SectionAsCard({ section }: { section: Section }) {
  switch (section.type) {
    case "tldr":
      return <TldrBlock content={section.content} />;
    case "segments":
      return <SegmentsBlock items={section.items} />;
    case "risk":
      return <RiskBlock content={section.content} />;
    case "recommendation":
      return <RecommendationBlock content={section.content} />;
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono text-2xs uppercase tracking-wider text-fg-faint">
      {children}
    </p>
  );
}

function TldrBlock({ content }: { content: string }) {
  return (
    <div className="rounded-md bg-fg p-4 text-bg">
      <p className="mb-1 font-mono text-2xs uppercase tracking-wider opacity-60">
        TL;DR
      </p>
      <p className="text-base leading-snug">{content}</p>
    </div>
  );
}

function SegmentsBlock({ items }: { items: SegmentItem[] }) {
  return (
    <div>
      <SectionLabel>Segments</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const tone = metricTone(item.metric);
          const metricColor =
            tone === "positive"
              ? "text-ok"
              : tone === "flat"
                ? "text-fg"
                : "text-fg-soft";
          return (
            <motion.div
              key={segmentLayoutId(item.label)}
              layoutId={segmentLayoutId(item.label)}
              layout
              transition={MORPH_TRANSITION}
              className="rounded-md border border-line bg-bg-2 p-3"
            >
              <p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
                {item.label}
              </p>
              <p
                className={`mt-1 text-xl font-semibold tracking-tight ${metricColor}`}
              >
                {item.metric || "—"}
              </p>
              {item.detail && (
                <p className="mt-1 font-mono text-2xs text-fg-soft">
                  {item.detail}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function RiskBlock({ content }: { content: string }) {
  return (
    <div>
      <SectionLabel>Risk</SectionLabel>
      <div className="flex gap-3 rounded-md border border-line bg-bg-2 p-3">
        <span
          aria-hidden
          className="mt-2 block size-1.5 shrink-0 rounded-sm bg-fg-soft"
        />
        <p className="text-sm text-fg-soft">{content}</p>
      </div>
    </div>
  );
}

function RecommendationBlock({ content }: { content: string }) {
  return (
    <div>
      <SectionLabel>Recommendation</SectionLabel>
      <div className="flex gap-3 rounded-md border border-line p-3">
        <ArrowRight
          size={16}
          strokeWidth={1.5}
          className="mt-0.5 shrink-0 text-ok"
          aria-hidden="true"
        />
        <p className="text-sm text-fg-soft">{content}</p>
      </div>
    </div>
  );
}
