import { getDashboardContext } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "./profile-form";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Settings · LaunchPad" };

export default async function SettingsPage() {
  const { profile, email, org, role } = await getDashboardContext();

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your profile and workspace details."
      />

      <div className="grid max-w-3xl gap-6 px-6 py-8 sm:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your profile</CardTitle>
            <CardDescription>
              Signed in as <span className="text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm
              fullName={profile?.full_name ?? ""}
              company={profile?.company ?? ""}
              dashboardFormula={profile?.dashboard_formula ?? ""}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workspace</CardTitle>
            <CardDescription>
              Your organization details. Renaming and invites are coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Organization</span>
              <span className="font-medium">{org.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Slug</span>
              <span className="font-mono text-xs">{org.slug}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Your role</span>
              <span className="font-medium capitalize">{role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">{formatDate(org.created_at)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
