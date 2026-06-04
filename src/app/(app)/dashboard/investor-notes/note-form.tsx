"use client";

import { useActionState, useEffect, useRef } from "react";
import { createInvestorNote, type ActionState } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";

export function NoteForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createInvestorNote,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state?.error) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="investor_name">
            Investor / firm <span className="text-primary">*</span>
          </Label>
          <Input
            id="investor_name"
            name="investor_name"
            placeholder="Sequoia · Jane Doe"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sentiment">Sentiment</Label>
          <select
            id="sentiment"
            name="sentiment"
            defaultValue=""
            className="flex h-10 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">—</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">
          Note <span className="text-primary">*</span>
        </Label>
        <Textarea
          id="content"
          name="content"
          placeholder="What did you discuss? Any follow-ups?"
          required
        />
      </div>

      {state?.error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
          {state.error}
        </p>
      )}

      <SubmitButton pendingText="Saving…">Save note</SubmitButton>
    </form>
  );
}
