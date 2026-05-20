const TEXT_BACK_BODY =
	"Sorry we missed your call. Can we help via text? Reply with what you need and we'll get back to you. Reply STOP to opt out.";

export function PhoneMockupStrip() {
	return (
		<div className="my-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
			<Phone label="Prospect">
				<PhoneHeader>+1 (555) 432-1098</PhoneHeader>
				<EventRow>📞 Missed call</EventRow>
				<BubbleIn>{TEXT_BACK_BODY}</BubbleIn>
				<BubbleOut>water heater leaking everywhere can someone come today</BubbleOut>
			</Phone>

			<Phone label="Owner">
				<PhoneHeader>Auto Lead Response Loop</PhoneHeader>
				<NotificationCard />
			</Phone>

			<Phone label="Prospect (after YES)">
				<PhoneHeader>+1 (555) 432-1098</PhoneHeader>
				<BubbleIn>Book a time that works: cal.com/spm/hvac-appointment</BubbleIn>
				<EventRow>✓ Booking confirmed · Tue 2:00pm</EventRow>
			</Phone>
		</div>
	);
}

function Phone({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col items-center">
			<div className="relative w-[200px] rounded-3xl border border-line bg-panel px-3 pb-3 pt-4 shadow-(--shadow)">
				<span
					aria-hidden
					className="absolute left-1/2 top-1.5 h-2 w-2 -translate-x-1/2 rounded-full bg-line"
				/>
				<div className="px-1 pt-2">{children}</div>
			</div>
			<p className="mt-3 font-mono text-2xs uppercase tracking-wider text-fg-faint">
				{label}
			</p>
		</div>
	);
}

function PhoneHeader({ children }: { children: React.ReactNode }) {
	return (
		<p className="mb-2 border-b border-line pb-2 text-center font-mono text-[8px] uppercase tracking-wider text-fg-faint">
			{children}
		</p>
	);
}

function EventRow({ children }: { children: React.ReactNode }) {
	return (
		<p className="mb-1.5 rounded-sm bg-bg-2 p-1 text-center font-mono text-[8px] text-fg-faint">
			{children}
		</p>
	);
}

function BubbleIn({ children }: { children: React.ReactNode }) {
	return (
		<p className="mb-1.5 max-w-[84%] rounded-xl rounded-bl-sm bg-bg-2 px-2 py-1.5 font-mono text-[8px] leading-snug text-fg">
			{children}
		</p>
	);
}

function BubbleOut({ children }: { children: React.ReactNode }) {
	return (
		<p className="mb-1.5 ml-auto max-w-[84%] rounded-xl rounded-br-sm bg-accent px-2 py-1.5 font-mono text-[8px] leading-snug text-selection-fg">
			{children}
		</p>
	);
}

function NotificationCard() {
	return (
		<div className="rounded-lg border border-line bg-bg-2 p-2 font-mono text-[8px] leading-relaxed text-fg">
			<div>New lead: Caller A1</div>
			<div>water heater repair</div>
			<div>
				<span className="font-bold uppercase tracking-wider text-ok">URGENT</span>
				<span className="text-fg-faint"> · 92% conf</span>
			</div>
			<p className="mt-1 italic text-fg-soft">&ldquo;water heater leaking everywhere&rdquo;</p>
			<p className="mt-1.5 font-bold text-accent">Reply YES / NO / INFO</p>
		</div>
	);
}
