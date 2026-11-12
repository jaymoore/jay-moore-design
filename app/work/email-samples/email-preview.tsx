"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { NEWSLETTER_HTML } from "./newsletter-html";

type Width = 600 | 375;

// Preview-only CSS, injected into the iframe and never into the source panel.
// Links are disabled so a click can't navigate the frame away from the email.
const PREVIEW_CSS = "a{pointer-events:none}";

// Template mode: outline every data-region cell and label it. Labels sit on the
// region's top edge, left side, so they cover padding instead of content.
const REGION_CSS = `
[data-region]{position:relative}
[data-region]::after{content:"";position:absolute;inset:0;pointer-events:none}
[data-region="editable"]::after{outline:2px dashed #1f57bd;outline-offset:-2px}
[data-region="locked"]::after{outline:2px solid #16191d;outline-offset:-2px;background:repeating-linear-gradient(135deg,rgba(22,25,29,.10) 0 2px,transparent 2px 8px)}
[data-region]::before{position:absolute;top:-10px;left:8px;z-index:1;padding:3px 6px;border-radius:3px;font:600 10px/1.2 ui-monospace,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#fff}
[data-region="editable"]::before{content:"Edit \\00B7  " attr(data-label);background:#1f57bd}
[data-region="locked"]::before{content:"Locked \\00B7  " attr(data-label);background:#16191d}
[data-label="Brand bar"]::before{display:none}
`;

function withPreviewCss(html: string, css: string) {
	return html.replace("</head>", `<style>${css}</style>\n</head>`);
}

// On a phone, open on the phone view instead of a clipped 600px frame.
const PHONE_QUERY = "(max-width: 639px)";
function subscribePhone(onChange: () => void) {
	const mq = window.matchMedia(PHONE_QUERY);
	mq.addEventListener("change", onChange);
	return () => mq.removeEventListener("change", onChange);
}

const LINE_COUNT = NEWSLETTER_HTML.split("\n").length;
const SIZE_KB = (new TextEncoder().encode(NEWSLETTER_HTML).length / 1024).toFixed(1);

export function EmailPreview({
	mode,
	title,
}: {
	mode: "email" | "template";
	title: string;
}) {
	const isPhone = useSyncExternalStore(
		subscribePhone,
		() => window.matchMedia(PHONE_QUERY).matches,
		() => false,
	);
	const [chosen, setWidth] = useState<Width | null>(null);
	const width: Width = chosen ?? (isPhone ? 375 : 600);
	const [height, setHeight] = useState(900);
	const frameRef = useRef<HTMLIFrameElement>(null);
	const observerRef = useRef<ResizeObserver | null>(null);

	const srcDoc = withPreviewCss(
		NEWSLETTER_HTML,
		mode === "template" ? PREVIEW_CSS + REGION_CSS : PREVIEW_CSS,
	);

	function watchHeight() {
		const doc = frameRef.current?.contentDocument;
		if (!doc?.body) return;
		observerRef.current?.disconnect();
		const measure = () => setHeight(doc.body.offsetHeight);
		observerRef.current = new ResizeObserver(measure);
		observerRef.current.observe(doc.body);
		measure();
	}

	// The frame can finish loading before hydration attaches onLoad.
	useEffect(() => {
		if (frameRef.current?.contentDocument?.readyState === "complete") {
			watchHeight();
		}
		return () => observerRef.current?.disconnect();
	}, []);

	return (
		<figure className="mt-8">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div
					role="group"
					aria-label="Preview width"
					className="inline-flex rounded-sm border border-line bg-panel p-1"
				>
					{([600, 375] as const).map((w) => (
						<button
							key={w}
							type="button"
							aria-pressed={width === w}
							onClick={() => setWidth(w)}
							className={`h-8 rounded-[2px] px-4 font-mono text-2xs uppercase tracking-wider transition-colors duration-(--duration-fast) ease-(--ease-snappy) active:bg-bg-2 ${
								width === w
									? "bg-accent text-selection-fg"
									: "text-fg-soft hover:bg-bg-2 hover:text-fg"
							}`}
						>
							{w === 600 ? "Desktop 600" : "Phone 375"}
						</button>
					))}
				</div>
				<span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
					Concept sample · fictional organization
				</span>
			</div>

			<div className="mt-4 overflow-x-auto rounded-md border border-line bg-bg-2 p-4 sm:p-6">
				<iframe
					ref={frameRef}
					title={title}
					srcDoc={srcDoc}
					sandbox="allow-same-origin"
					onLoad={watchHeight}
					style={{
						// +2px for the 1px border, so the email's viewport is exactly 600 or 375.
						width: width === 600 ? "602px" : "min(377px, 100%)",
						height,
					}}
					className="mx-auto block rounded-sm border border-line bg-white shadow-(--shadow) transition-[width,height] duration-(--duration-normal) ease-(--ease-snappy)"
				/>
			</div>

			<figcaption className="mt-4 max-w-[70ch] text-sm leading-relaxed text-fg-faint">
				{mode === "template"
					? "Preview only: the outlines and labels are added for this view. The HTML underneath is the same file as sample 01."
					: "Preview only: links are switched off inside this frame so a click stays on the page. Everything else is the HTML below, unchanged."}
			</figcaption>

			{mode === "email" && (
				<details className="group mt-6 rounded-md border border-line bg-panel">
					<summary className="flex h-12 cursor-pointer list-none items-center justify-between gap-4 px-6 font-mono text-2xs uppercase tracking-wider text-fg-soft transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-fg [&::-webkit-details-marker]:hidden">
						<span>
							<span className="text-accent">View HTML</span> · {LINE_COUNT}{" "}
							lines · {SIZE_KB} KB
						</span>
						<span
							aria-hidden
							className="transition-transform duration-(--duration-fast) ease-(--ease-snappy) group-open:rotate-90"
						>
							→
						</span>
					</summary>
					<pre
						tabIndex={0}
						aria-label="Newsletter HTML source"
						className="max-h-[480px] overflow-auto border-t border-line bg-bg-2 p-6 font-mono text-2xs leading-relaxed text-fg-soft">
						<code>{NEWSLETTER_HTML}</code>
					</pre>
				</details>
			)}
		</figure>
	);
}
