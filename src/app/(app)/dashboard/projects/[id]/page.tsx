import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Flag, ListTodo } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  PROJECT_STATUS_LABELS,
  type Project,
  type ProjectTask,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { TaskForm } from "./task-form";
import { TaskRow } from "./task-row";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await getDashboardContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!project) {
    notFound();
  }

  const typedProject = project as Project;

  const { data: taskData } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("project_id", id)
    .order("is_milestone", { ascending: false })
    .order("created_at", { ascending: true });

  const tasks = (taskData ?? []) as ProjectTask[];
  const milestones = tasks.filter((t) => t.is_milestone);
  const regularTasks = tasks.filter((t) => !t.is_milestone);
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Project"
        title={typedProject.name}
        description={typedProject.description || undefined}
        action={
          <Badge variant="secondary" className="text-sm">
            {PROJECT_STATUS_LABELS[typedProject.status]}
          </Badge>
        }
      />

      <div className="px-6 py-8 sm:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Link>
          <p className="font-mono text-xs text-muted-foreground">
            {doneCount}/{tasks.length} done · Created{" "}
            {formatDate(typedProject.created_at)}
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-sm font-semibold">Add to this project</h2>
            <TaskForm projectId={id} />
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Flag className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Milestones</h2>
              <Badge variant="muted">{milestones.length}</Badge>
            </div>
            {milestones.length === 0 ? (
              <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                No milestones yet.
              </p>
            ) : (
              <div className="space-y-2">
                {milestones.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Tasks</h2>
              <Badge variant="muted">{regularTasks.length}</Badge>
            </div>
            {regularTasks.length === 0 ? (
              <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                No tasks yet.
              </p>
            ) : (
              <div className="space-y-2">
                {regularTasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
