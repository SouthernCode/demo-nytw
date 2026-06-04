import Link from "next/link";
import {
  FolderKanban,
  Flag,
  NotebookPen,
  Inbox,
  Plus,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PROJECT_STATUS_LABELS, type Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default async function DashboardOverview() {
  const { org, profile, email } = await getDashboardContext();
  const supabase = await createClient();

  const [{ data: projects }, { count: openMilestones }, { count: notesCount }, { count: waitlistCount }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .eq("org_id", org.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("project_tasks")
        .select("id", { count: "exact", head: true })
        .eq("is_milestone", true)
        .neq("status", "done"),
      supabase
        .from("investor_notes")
        .select("id", { count: "exact", head: true })
        .eq("org_id", org.id),
      supabase
        .from("waitlist_submissions")
        .select("id", { count: "exact", head: true }),
    ]);

  const projectList = (projects ?? []) as Project[];
  const displayName = profile?.full_name || email || "there";
  const firstName = displayName.split(" ")[0];

  const stats = [
    {
      label: "Active projects",
      value: projectList.filter((p) => p.status !== "archived").length,
      icon: FolderKanban,
    },
    { label: "Open milestones", value: openMilestones ?? 0, icon: Flag },
    { label: "Investor notes", value: notesCount ?? 0, icon: NotebookPen },
    { label: "Waitlist signups", value: waitlistCount ?? 0, icon: Inbox },
  ];

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow={`Welcome back, ${firstName}`}
        title="Overview"
        description="A quick pulse on everything happening across your startup."
        action={
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="h-4 w-4" /> New project
            </Link>
          </Button>
        }
      />

      <div className="px-6 py-8 sm:px-8">
        {/*
          WORKSHOP_INTENTIONAL_VULNERABILITY: the user's profile name (captured
          on the registration form and stored verbatim) is rendered here as raw
          HTML. A display name like
          <img src=x onerror="document.body.style.background='crimson'"> will
          execute on this page. It should be rendered as plain text.
        */}
        <p
          className="mb-6 text-lg text-muted-foreground"
          dangerouslySetInnerHTML={{
            __html: `Good to see you, ${displayName} 👋`,
          }}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
                  <stat.icon className="h-5 w-5" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {profile?.dashboard_formula && (
          <div className="mt-4">
            <MetricCard
              formula={profile.dashboard_formula}
              vars={{
                projects: projectList.length,
                milestones: openMilestones ?? 0,
                notes: notesCount ?? 0,
                waitlist: waitlistCount ?? 0,
              }}
            />
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent projects</h2>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {projectList.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <FolderKanban className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No projects yet. Create your first one to get going.
              </p>
              <Button asChild size="sm">
                <Link href="/dashboard/projects/new">
                  <Plus className="h-4 w-4" /> New project
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectList.slice(0, 6).map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <Card className="h-full transition-colors hover:border-primary/40">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-medium">{project.name}</h3>
                      <Badge variant="secondary">
                        {PROJECT_STATUS_LABELS[project.status]}
                      </Badge>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {project.description || "No description yet."}
                    </p>
                    <p className="mt-4 font-mono text-xs text-muted-foreground">
                      Created {formatDate(project.created_at)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
