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

const SAMPLE_RESPONSE = `TL;DR
Q3 +23% led by Enterprise (+47% YoY). Watch concentration: top 3 accounts = 31% of revenue.

SEGMENTS
Enterprise: +47%, YoY · $14.2M ARR
Mid-Market: Flat, $4.2M · 2 quarters
SMB: -6%, $1.8M · planned

RISK
Top 3 enterprise accounts now represent 31% of recognized revenue, up from 24% in Q2. Concentration risk has grown two consecutive quarters.

RECOMMENDATION
Board agenda: discuss segment diversification before celebrating the headline 23%.`;

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

const SECTION_HEADS = ["TL;DR", "SEGMENTS", "RISK", "RECOMMENDATION"] as const;
type SectionHead = (typeof SECTION_HEADS)[number];

function isSectionHead(line: string): line is SectionHead {
  return SECTION_HEADS.includes(line.trim().toUpperCase() as SectionHead);
}

function headToType(head: SectionHead): Section["type"] {
  switch (head) {
    case "TL;DR":
      return "tldr";
    case "SEGMENTS":
      return "segments";
    case "RISK":
      return "risk";
    case "RECOMMENDATION":
      return "recommendation";
  }
}

function parseSegmentLine(line: string): SegmentItem {
  const colon = line.indexOf(":");
  if (colon === -1) return { label: line.trim(), metric: "", detail: "" };
  const label = line.slice(0, colon).trim();
  const rest = line.slice(colon + 1).trim();
  const comma = rest.indexOf(",");
  if (comma === -1) return { label, metric: rest, detail: "" };
  const metric = rest.slice(0, comma).trim();
  const detail = rest.slice(comma + 1).trim();
  return { label, metric, detail };
}

function parseResponse(text: string): Section[] {
  if (!text.trim()) return [];
  const sections: Section[] = [];
  const lines = text.split("\n");

  let currentHead: SectionHead | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (!currentHead) return;
    const type = headToType(currentHead);
    if (type === "segments") {
      const items = buffer
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
        .map(parseSegmentLine);
      if (items.length > 0) sections.push({ type, items });
    } else {
      const content = buffer.join("\n").trim();
      if (content.length > 0) sections.push({ type, content } as Section);
    }
    buffer = [];
  };

  for (const line of lines) {
    if (isSectionHead(line)) {
      flush();
      currentHead = line.trim().toUpperCase() as SectionHead;
    } else if (currentHead) {
      buffer.push(line);
    }
  }
  flush();

  return sections;
}

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
      if (i >= SAMPLE_RESPONSE.length) {
        setStreamedText(SAMPLE_RESPONSE);
        stopStream();
      } else {
        setStreamedText(SAMPLE_RESPONSE.slice(0, i));
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

  const sections = parseResponse(streamedText);

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
        ) : (
          <div className="size-full overflow-y-auto p-4">
            <p className="mb-4 font-mono text-2xs uppercase tracking-wider text-fg-faint">
              You asked: {SAMPLE_PROMPT}
            </p>
            <MotionConfig reducedMotion="user">
              <LayoutGroup>
                <SectionList
                  sections={sections}
                  mode={mode}
                  isStreaming={isStreaming}
                />
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

function SectionList({
  sections,
  mode,
  isStreaming,
}: {
  sections: Section[];
  mode: "text" | "canvas";
  isStreaming: boolean;
}) {
  if (sections.length === 0) {
    return (
      <p className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
        {isStreaming ? "Receiving structure…" : "No content yet."}
      </p>
    );
  }

  return (
    <div className={mode === "text" ? "grid gap-4" : "grid gap-5"}>
      {sections.map((section, i) => {
        const last = i === sections.length - 1;
        return (
          <motion.div
            key={sectionLayoutId(section.type)}
            layoutId={sectionLayoutId(section.type)}
            layout
            transition={MORPH_TRANSITION}
          >
            {mode === "text" ? (
              <SectionAsText
                section={section}
                showCursor={isStreaming && last}
              />
            ) : (
              <SectionAsCard section={section} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================================================
   Text mode — prose rendering of each section
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

function SectionAsText({
  section,
  showCursor,
}: {
  section: Section;
  showCursor: boolean;
}) {
  if (section.type === "tldr") {
    return (
      <div>
        <p className="mb-1 font-mono text-2xs uppercase tracking-wider text-fg-faint">
          TL;DR
        </p>
        <p className="text-sm leading-relaxed text-fg">
          {section.content}
          {showCursor && <StreamingCursor />}
        </p>
      </div>
    );
  }
  if (section.type === "segments") {
    const lastIndex = section.items.length - 1;
    return (
      <div>
        <p className="mb-1 font-mono text-2xs uppercase tracking-wider text-fg-faint">
          Segments
        </p>
        <ul className="text-sm leading-relaxed text-fg-soft">
          {section.items.map((item, i) => (
            <motion.li
              key={segmentLayoutId(item.label)}
              layoutId={segmentLayoutId(item.label)}
              layout
              transition={MORPH_TRANSITION}
            >
              <span className="text-fg">{item.label}:</span> {item.metric}
              {item.detail && <span className="text-fg-faint"> · {item.detail}</span>}
              {showCursor && i === lastIndex && <StreamingCursor />}
            </motion.li>
          ))}
        </ul>
      </div>
    );
  }
  if (section.type === "risk") {
    return (
      <div>
        <p className="mb-1 font-mono text-2xs uppercase tracking-wider text-fg-faint">
          Risk
        </p>
        <p className="text-sm leading-relaxed text-fg-soft">
          {section.content}
          {showCursor && <StreamingCursor />}
        </p>
      </div>
    );
  }
  return (
    <div>
      <p className="mb-1 font-mono text-2xs uppercase tracking-wider text-fg-faint">
        Recommendation
      </p>
      <p className="flex gap-2 text-sm leading-relaxed text-fg-soft">
        <span aria-hidden className="text-ok">
          →
        </span>
        <span>
          {section.content}
          {showCursor && <StreamingCursor />}
        </span>
      </p>
    </div>
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
