import type { Metadata } from "next";
import { CaseStudyContent } from "./case-study-content";

export const metadata: Metadata = {
  title: "Personal Nurse — case study",
  description:
    "An ER-wait advocacy app for anyone facing a long wait. Four design directions, a measured accessibility pass, and a system where the design language switches when the phone changes hands.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PersonalNursePage() {
  return <CaseStudyContent />;
}
