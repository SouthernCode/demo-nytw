"use client";

import { useActionState, useState } from "react";
import { updateProfile, type ActionState } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";

export function ProfileForm({
  fullName,
  company,
  dashboardFormula,
}: {
  fullName: string;
  company: string;
  dashboardFormula: string;
}) {
  const [saved, setSaved] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(
    async (prev, data) => {
      const result = await updateProfile(prev, data);
      setSaved(!result?.error);
      return result;
    },
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" defaultValue={fullName} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Startup name</Label>
        <Input id="company" name="company" defaultValue={company} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dashboard_formula">Custom KPI formula</Label>
        <Input
          id="dashboard_formula"
          name="dashboard_formula"
          defaultValue={dashboardFormula}
          placeholder="e.g. projects * 10 + waitlist"
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Define a metric and we&apos;ll compute it live on your dashboard.
        </p>
      </div>

      {state?.error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
          {state.error}
        </p>
      )}
      {saved && !state?.error && (
        <p className="text-sm text-primary">Saved.</p>
      )}

      <SubmitButton pendingText="Saving…" onClick={() => setSaved(false)}>
        Save changes
      </SubmitButton>
    </form>
  );
}
