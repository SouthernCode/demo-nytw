"use client";

import { useActionState } from "react";
import { createProject, type ActionState } from "../../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { PROJECT_STATUS_LABELS } from "@/lib/types";

export function ProjectForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createProject,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">
          Project name <span className="text-primary">*</span>
        </Label>
        <Input id="name" name="name" placeholder="Mobile app v1" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue="planning"
          className="flex h-10 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="What is this project about?"
        />
      </div>

      {state?.error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <SubmitButton pendingText="Creating…">Create project</SubmitButton>
      </div>
    </form>
  );
}
