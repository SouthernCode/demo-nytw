import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PROJECT_STATUS_LABELS, type Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Projects · LaunchPad" };

export default async function ProjectsPage() {
  const { org } = await getDashboardContext();
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false });

  const projects = (data ?? []) as Project[];

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        description="Every initiative your team is building, in one view."
        action={
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="h-4 w-4" /> New project
            </Link>
          </Button>
        }
      />

      <div className="px-6 py-8 sm:px-8">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <FolderKanban className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                You don&apos;t have any projects yet.
              </p>
              <Button asChild size="sm">
                <Link href="/dashboard/projects/new">
                  <Plus className="h-4 w-4" /> Create your first project
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <Card className="h-full transition-colors hover:border-primary/40">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-medium">{project.name}</h3>
                      <Badge variant="secondary">
                        {PROJECT_STATUS_LABELS[project.status]}
                      </Badge>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
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
