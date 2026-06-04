"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthState } from "../actions";
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

export default function LoginPage() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    signIn,
    undefined
  );

  return (
    <Card className="glow-accent">
      <CardHeader>
        <p className="eyebrow">Welcome back</p>
        <CardTitle className="text-2xl">Sign in to LaunchPad</CardTitle>
        <CardDescription>
          Pick up where you left off across your projects and notes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
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
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>

          {state?.error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
              {state.error}
            </p>
          )}

          <SubmitButton className="w-full" size="lg" pendingText="Signing in…">
            Sign in
          </SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
