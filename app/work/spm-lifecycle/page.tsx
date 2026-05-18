import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CaseStudyContent } from "./case-study-content";
import { PasswordGate } from "./password-gate";

export const metadata: Metadata = {
  title: "SPM lifecycle engine — case study",
  description:
    "Full case study. TTF-touch 30 min → 60 s. Reply rate 4.6–4.9% against a ~1% industry baseline.",
};

export default async function SpmLifecyclePage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("spm-case-study-auth")?.value;
  const expected = process.env.CASE_STUDY_PASSWORD || "preview";

  if (auth && auth === expected) {
    return <CaseStudyContent />;
  }

  return <PasswordGate />;
}
