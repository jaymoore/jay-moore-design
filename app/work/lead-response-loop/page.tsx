import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CaseStudyContent } from "./case-study-content";
import { PasswordGate } from "./password-gate";

export const metadata: Metadata = {
  title: "Lead Response Loop — case study",
  description:
    "Decision-support response system for high-noise inbound lead channels. HVAC + plumbing first, pattern transferable.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LeadResponseLoopPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("lrl-case-study-auth")?.value;
  const expected = process.env.CASE_STUDY_PASSWORD || "explore";

  if (auth && auth === expected) {
    return <CaseStudyContent />;
  }

  return <PasswordGate />;
}
