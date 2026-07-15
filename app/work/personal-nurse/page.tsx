import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CaseStudyContent } from "./case-study-content";
import { PasswordGate } from "./password-gate";

export const metadata: Metadata = {
  title: "Personal Nurse — case study",
  description:
    "An ER-wait advocacy app for an 80-year-old patient. Four design directions, a measured accessibility pass, and a system where the design language switches when the phone changes hands.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PersonalNursePage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("pn-case-study-auth")?.value;
  const expected = process.env.CASE_STUDY_PASSWORD || "explore";

  if (auth && auth === expected) {
    return <CaseStudyContent />;
  }

  return <PasswordGate />;
}
