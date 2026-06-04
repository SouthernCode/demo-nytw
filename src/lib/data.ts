import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Organization, Profile } from "@/lib/types";

export interface DashboardContext {
  userId: string;
  email: string | null;
  profile: Profile | null;
  org: Organization;
  role: string;
}

/**
 * Loads the signed-in user's profile and their default (first) organization.
 * Redirects to /login when there is no session.
 */
export async function getDashboardContext(): Promise<DashboardContext> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("role, org_id, organizations(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const org = membership?.organizations as unknown as Organization | undefined;

  if (!org) {
    // A signed-in user with no org is an unexpected state (the signup trigger
    // should always create one). Bounce to login rather than render broken UI.
    redirect("/login");
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    profile: (profile as Profile | null) ?? null,
    org,
    role: membership?.role ?? "member",
  };
}
