import type { Metadata } from "next";
import { CaseStudyContent } from "./case-study-content";

export const metadata: Metadata = {
  title: "Lead Response Loop — case study",
  description:
    "Decision-support response system for high-noise inbound lead channels. HVAC + plumbing first, pattern transferable.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LeadResponseLoopPage() {
  return <CaseStudyContent />;
}
