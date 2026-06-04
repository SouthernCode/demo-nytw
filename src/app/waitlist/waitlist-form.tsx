"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitWaitlist, type WaitlistState } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";

export function WaitlistForm() {
  const [state, formAction] = useActionState<WaitlistState, FormData>(
    submitWaitlist,
    undefined
  );

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary" />
        <h3 className="text-lg font-semibold">You&apos;re on the list</h3>
        <p className="text-sm text-muted-foreground">
          Thanks for your interest — we&apos;ll be in touch as we open up access.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Ada Lovelace" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" placeholder="Analytical Engines" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-primary">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@startup.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="building">What are you building?</Label>
        <Textarea
          id="building"
          name="building"
          placeholder="Tell us about your startup in a sentence or two…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="referral">How did you hear about us?</Label>
        <Input
          id="referral"
          name="referral"
          placeholder="Twitter, a friend, Product Hunt…"
        />
      </div>

      {state?.error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
          {state.error}
        </p>
      )}

      <SubmitButton className="w-full" size="lg" pendingText="Joining…">
        Join the waitlist
      </SubmitButton>
    </form>
  );
}
