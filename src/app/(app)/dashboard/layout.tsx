import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { getDashboardContext } from "@/lib/data";
import { signOut } from "@/app/(auth)/actions";
import { initials } from "@/lib/utils";

// The dashboard is per-user and reads cookies/session, so it must render
// dynamically rather than being prerendered at build time.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, email, org } = await getDashboardContext();
  const displayName = profile?.full_name || email || "Founder";

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex flex-col border-b border-border md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r md:sticky md:top-0">
        <div className="flex items-center justify-between px-5 py-4">
          <Logo href="/dashboard" />
        </div>

        <div className="px-5 pb-3">
          <div className="rounded-md border border-border bg-card px-3 py-2.5">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              Organization
            </p>
            <p className="mt-0.5 truncate text-sm font-medium">{org.name}</p>
          </div>
        </div>

        <div className="px-3 md:flex-1">
          <SidebarNav />
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
              {initials(displayName)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              title="Sign out"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 scrollbar-thin">{children}</main>
    </div>
  );
}
