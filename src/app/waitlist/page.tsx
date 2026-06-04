import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { Card, CardContent } from "@/components/ui/card";
import { WaitlistForm } from "./waitlist-form";

export const metadata = {
  title: "Join the LaunchPad waitlist",
};

export default function WaitlistPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <Logo />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-10">
        <div className="mb-8 animate-fade-up text-center">
          <p className="eyebrow">Early access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Get on the LaunchPad{" "}
            <span className="text-primary">waitlist</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            We&apos;re onboarding founders in small batches. Tell us what
            you&apos;re building and we&apos;ll save you a spot.
          </p>
        </div>

        <Card className="animate-fade-up glow-accent [animation-delay:80ms]">
          <CardContent className="pt-6">
            <WaitlistForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
