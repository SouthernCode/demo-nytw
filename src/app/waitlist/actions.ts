"use server";

import { createClient } from "@/lib/supabase/server";

export type WaitlistState =
  | { ok?: boolean; error?: string }
  | undefined;

// NOTE (workshop): this public endpoint is intentionally production-incomplete.
// There is no rate limiting, no captcha, no origin checking, and validation is
// deliberately minimal. The free-text "building" field is stored verbatim.
export async function submitWaitlist(
  _prev: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const building = String(formData.get("building") ?? "").trim();
  const referral = String(formData.get("referral") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist_submissions").insert({
    email,
    name: name || null,
    company: company || null,
    building: building || null,
    referral: referral || null,
  });

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
