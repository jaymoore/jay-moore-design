"use client";

import { useRef } from "react";
import { X } from "lucide-react";

// Wraps a scaled-down artboard in a button that opens it near full size, so
// the small type is readable. Native <dialog>: Esc and focus return come free.
export function ArtboardZoom({
	label,
	ratio,
	maxWidth,
	preview,
	full,
}: {
	label: string;
	ratio: number;
	maxWidth: number;
	preview: React.ReactNode;
	full: React.ReactNode;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	return (
		<>
			<button
				type="button"
				aria-label={`Enlarge ${label}`}
				onClick={() => dialogRef.current?.showModal()}
				className="group relative block w-full cursor-zoom-in rounded-sm transition-transform duration-(--duration-fast) ease-(--ease-snappy) hover:-translate-y-0.5 active:translate-y-0"
			>
				{preview}
				<span className="pointer-events-none absolute bottom-2 right-2 rounded-sm bg-panel px-2 py-1 font-mono text-2xs uppercase tracking-wider text-fg opacity-0 shadow-(--shadow) transition-opacity duration-(--duration-fast) ease-(--ease-snappy) group-hover:opacity-100 group-focus-visible:opacity-100">
					Enlarge
				</span>
			</button>

			<dialog
				ref={dialogRef}
				aria-label={label}
				onClick={(e) => {
					if (e.target === e.currentTarget) e.currentTarget.close();
				}}
				className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/70"
			>
				<div
					className="relative"
					style={{
						width: `min(92vw, calc(85vh * ${ratio}), ${maxWidth}px)`,
					}}
				>
					{full}
					<button
						type="button"
						aria-label="Close"
						onClick={() => dialogRef.current?.close()}
						className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-sm bg-panel text-fg shadow-(--shadow) transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:bg-bg-2 active:bg-line"
					>
						<X aria-hidden size={16} />
					</button>
				</div>
			</dialog>
		</>
	);
}
