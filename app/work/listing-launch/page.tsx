import type { Metadata } from "next";
import { CaseStudyContent } from "./case-study-content";

export const metadata: Metadata = {
  title: "Listing Launch — case study",
  description:
    "A B2B tool that gets a new real-estate listing from won to live without the agent losing control of what goes public. AI drafts; the human approves every word.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ListingLaunchPage() {
  return <CaseStudyContent />;
}
