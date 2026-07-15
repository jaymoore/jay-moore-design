import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CaseStudyContent } from "./case-study-content";
import { PasswordGate } from "./password-gate";

export const metadata: Metadata = {
  title: "Listing Launch — case study",
  description:
    "A B2B tool that gets a new real-estate listing from won to live without the agent losing control of what goes public. AI drafts; the human approves every word.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ListingLaunchPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("ll-case-study-auth")?.value;
  const expected = process.env.CASE_STUDY_PASSWORD || "explore";

  if (auth && auth === expected) {
    return <CaseStudyContent />;
  }

  return <PasswordGate />;
}
