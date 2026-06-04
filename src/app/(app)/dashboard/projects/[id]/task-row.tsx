import { Flag, Circle, CircleDot, CheckCircle2 } from "lucide-react";
import { setTaskStatus } from "../../actions";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { TASK_STATUS_LABELS, type ProjectTask, type TaskStatus } from "@/lib/types";

const STATUS_ICON: Record<TaskStatus, typeof Circle> = {
  todo: Circle,
  in_progress: CircleDot,
  done: CheckCircle2,
};

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "done"];

export function TaskRow({ task }: { task: ProjectTask }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-md border border-border bg-card px-4 py-3",
        task.status === "done" && "opacity-70"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {task.is_milestone && (
          <Flag className="h-4 w-4 shrink-0 text-primary" />
        )}
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-sm font-medium",
              task.status === "done" && "line-through"
            )}
          >
            {task.title}
          </p>
          {task.due_date && (
            <p className="font-mono text-xs text-muted-foreground">
              Due {formatDate(task.due_date)}
            </p>
          )}
        </div>
        {task.is_milestone && <Badge variant="default">Milestone</Badge>}
      </div>

      <div className="flex items-center gap-1">
        {STATUS_ORDER.map((status) => {
          const Icon = STATUS_ICON[status];
          const active = task.status === status;
          return (
            <form action={setTaskStatus} key={status}>
              <input type="hidden" name="task_id" value={task.id} />
              <input type="hidden" name="project_id" value={task.project_id} />
              <input type="hidden" name="status" value={status} />
              <button
                type="submit"
                title={TASK_STATUS_LABELS[status]}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {TASK_STATUS_LABELS[status]}
                </span>
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
