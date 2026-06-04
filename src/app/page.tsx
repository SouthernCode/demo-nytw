import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  Flag,
  NotebookPen,
  Users,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: FolderKanban,
    title: "Project workspace",
    body: "Organize every initiative in one place. Status, owners, and context — no more scattered docs.",
  },
  {
    icon: Flag,
    title: "Tasks & milestones",
    body: "Break work into tasks, flag the milestones that matter, and always know what ships next.",
  },
  {
    icon: NotebookPen,
    title: "Investor notes",
    body: "Capture conversations, sentiment, and follow-ups so your raise stays organized and warm.",
  },
  {
    icon: Users,
    title: "Public waitlist",
    body: "Drop a form on your landing page and collect early demand before you write a line of code.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create your workspace",
    body: "Sign up and we spin up a default organization for your startup automatically.",
  },
  {
    step: "02",
    title: "Add your projects",
    body: "Track each initiative with tasks, milestones, and a status everyone can see.",
  },
  {
    step: "03",
    title: "Grow & report",
    body: "Collect waitlist demand and keep investor notes in one calm, founder-friendly home.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[48rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px] animate-pulse-glow" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              The operating system for founders
            </div>
            <h1 className="animate-fade-up mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl [animation-delay:60ms]">
              Run your startup
              <br />
              <span className="text-primary">without the chaos</span>
            </h1>
            <p className="animate-fade-up mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground [animation-delay:120ms]">
              LaunchPad keeps your projects, milestones, investor notes, and
              waitlist in one calm place — so you can spend less time wrangling
              tools and more time building.
            </p>
            <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:180ms]">
              <Button asChild size="lg">
                <Link href="/register">
                  Start building <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/waitlist">Join the waitlist</Link>
              </Button>
            </div>
            <p className="animate-fade-up mt-5 text-xs text-muted-foreground [animation-delay:220ms]">
              No credit card required · Free during early access
            </p>
          </div>

          {/* Product mock */}
          <Reveal
            delay={120}
            className="mx-auto mt-16 max-w-4xl rounded-xl border border-border bg-card/70 p-2 shadow-2xl backdrop-blur"
          >
            <div className="rounded-lg border border-border bg-background/80">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-destructive/60" />
                <span className="h-3 w-3 rounded-full bg-warning/60" />
                <span className="h-3 w-3 rounded-full bg-[hsl(var(--success)/0.6)]" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">
                  app.launchpad.io/dashboard
                </span>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-3">
                {[
                  { label: "Active projects", value: "6" },
                  { label: "Open milestones", value: "12" },
                  { label: "Waitlist signups", value: "248" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Everything in one place</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              The tools founders actually need,{" "}
              <span className="text-primary">nothing they don&apos;t</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <Reveal
                key={feature.title}
                delay={i * 80}
                className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="relative border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              From idea to traction in{" "}
              <span className="text-primary">three steps</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((item, i) => (
              <Reveal
                key={item.step}
                delay={i * 100}
                className="rounded-lg border border-border bg-card p-6"
              >
                <span className="font-mono text-sm text-primary">
                  {item.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {[
              "Built on Supabase",
              "Secure by default",
              "Live in minutes",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {item}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA / waitlist */}
      <section id="waitlist" className="relative border-t border-border py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-10 text-center glow-accent">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
            <div className="relative">
              <span className="flex mx-auto h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to bring order to your launch?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Create your workspace today, or join the waitlist to get early
                access as we roll out.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/register">
                    Create your workspace <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/waitlist">Join the waitlist</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LaunchPad. A workshop demo app.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-foreground">
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
