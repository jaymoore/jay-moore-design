import Image from "next/image";

type Props = {
	side: "left" | "right";
	imageSrc: string;
	imageAlt: string;
	title: string;
	body: React.ReactNode;
};

export function IxItem({ side, imageSrc, imageAlt, title, body }: Props) {
	const image = (
		<div className="relative aspect-[16/9] overflow-hidden rounded-md border border-line bg-bg-2">
			<Image
				src={imageSrc}
				alt={imageAlt}
				fill
				className="object-cover"
				sizes="(min-width: 768px) 360px, 100vw"
			/>
		</div>
	);
	const text = (
		<div>
			<h3 className="text-base font-medium text-fg">{title}</h3>
			<p className="mt-2 max-w-[60ch] text-lg leading-relaxed text-fg-soft">
				{body}
			</p>
		</div>
	);
	return (
		<div
			data-ix-side={side}
			className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10"
		>
			{side === "left" ? (
				<>
					{image}
					{text}
				</>
			) : (
				<>
					<div className="order-2 md:order-1">{text}</div>
					<div className="order-1 md:order-2">{image}</div>
				</>
			)}
		</div>
	);
}
