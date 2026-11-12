import type { Metadata } from "next";
import { EmailSamplesContent } from "./email-samples-content";

export const metadata: Metadata = {
	title: "Email and marketing samples",
	description:
		"Concept work for a fictional organization: a responsive HTML newsletter, the same newsletter as a locked template, and a social graphics set with brand rules.",
	robots: {
		index: false,
		follow: false,
	},
};

export default function EmailSamplesPage() {
	return <EmailSamplesContent />;
}
