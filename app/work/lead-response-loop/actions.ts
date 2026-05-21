"use server";

import { cookies } from "next/headers";

export type UnlockState = { ok: boolean; error?: string };

export async function unlockCaseStudy(
  _prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const password = formData.get("password");
  if (typeof password !== "string" || password.length === 0) {
    return { ok: false, error: "Enter a password." };
  }

  const expected = process.env.CASE_STUDY_PASSWORD || "explore";
  if (password !== expected) {
    return { ok: false, error: "Wrong password." };
  }

  const cookieStore = await cookies();
  cookieStore.set("lrl-case-study-auth", password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/work/lead-response-loop",
  });

  return { ok: true };
}
