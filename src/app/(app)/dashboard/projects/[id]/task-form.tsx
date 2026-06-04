"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { createTask, type ActionState } from "../../actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";

export function TaskForm({ projectId }: { projectId: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createTask,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state?.error) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="project_id" value={projectId} />
      <Input name="title" placeholder="Add a task or milestone…" required />
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="is_milestone"
            className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
          />
          Milestone
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Due
          <Input
            type="date"
            name="due_date"
            className="h-9 w-auto"
          />
        </label>
        <SubmitButton size="sm" pendingText="Adding…" className="ml-auto">
          <Plus className="h-4 w-4" /> Add
        </SubmitButton>
      </div>
      {state?.error && (
        <p className="text-sm text-destructive-foreground">{state.error}</p>
      )}
    </form>
  );
}
