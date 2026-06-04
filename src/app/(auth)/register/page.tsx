"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type AuthState } from "../actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";

export default function RegisterPage() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    signUp,
    undefined
  );

  return (
    <Card className="glow-accent">
      <CardHeader>
        <p className="eyebrow">Get started</p>
        <CardTitle className="text-2xl">Create your workspace</CardTitle>
        <CardDescription>
          We&apos;ll spin up a default organization for your startup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              name="full_name"
              placeholder="Ada Lovelace"
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Startup name</Label>
            <Input
              id="company"
              name="company"
              placeholder="Analytical Engines, Inc."
              autoComplete="organization"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@startup.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              required
            />
          </div>

          {state?.error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
              {state.error}
            </p>
          )}
          {state?.message && (
            <p className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-foreground">
              {state.message}
            </p>
          )}

          <SubmitButton
            className="w-full"
            size="lg"
            pendingText="Creating workspace…"
          >
            Create account
          </SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
