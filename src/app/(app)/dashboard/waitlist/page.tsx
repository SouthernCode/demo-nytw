import { Inbox, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { WaitlistSubmission } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Waitlist · LaunchPad" };

export default async function WaitlistPage() {
  await getDashboardContext();
  const supabase = await createClient();

  const { data } = await supabase
    .from("waitlist_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const submissions = (data ?? []) as WaitlistSubmission[];

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Demand"
        title="Waitlist submissions"
        description="Everyone who signed up through your public landing page form."
        action={<Badge variant="secondary">{submissions.length} total</Badge>}
      />

      <div className="px-6 py-8 sm:px-8">
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No submissions yet. Share your waitlist link to start collecting
                signups.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {submissions.map((submission) => (
              <Card key={submission.id}>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium">
                        {submission.name || "Anonymous founder"}
                      </h3>
                      <a
                        href={`mailto:${submission.email}`}
                        className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {submission.email}
                      </a>
                    </div>
                    <div className="text-right">
                      {submission.company && (
                        <p className="text-sm font-medium">
                          {submission.company}
                        </p>
                      )}
                      <p className="font-mono text-xs text-muted-foreground">
                        {formatDate(submission.created_at)}
                      </p>
                    </div>
                  </div>

                  {submission.building && (
                    <div className="mt-4 rounded-md border border-border bg-background/50 p-4">
                      <p className="mb-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                        What are you building?
                      </p>
                      {/*
                        WORKSHOP_INTENTIONAL_VULNERABILITY: the free-text value
                        from the public form is rendered as raw HTML here without
                        any sanitization, enabling stored XSS. It should be shown
                        as plain text instead.
                      */}
                      <div
                        className="prose-sm text-sm text-foreground/90"
                        dangerouslySetInnerHTML={{ __html: submission.building }}
                      />
                    </div>
                  )}

                  {submission.referral && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Heard via{" "}
                      <span className="text-foreground/80">
                        {submission.referral}
                      </span>
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
