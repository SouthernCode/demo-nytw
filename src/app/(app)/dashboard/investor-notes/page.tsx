import { NotebookPen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { InvestorNote } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { NoteForm } from "./note-form";

export const metadata = { title: "Investor notes · LaunchPad" };

const SENTIMENT_VARIANT = {
  positive: "success",
  neutral: "muted",
  negative: "warning",
} as const;

export default async function InvestorNotesPage() {
  await getDashboardContext();
  const supabase = await createClient();

  // WORKSHOP_INTENTIONAL_VULNERABILITY: this query is NOT scoped to the current
  // user's organization (no `.eq("org_id", org.id)`). It relies entirely on RLS
  // for isolation — and the investor_notes SELECT policy is intentionally too
  // permissive — so notes from other tenants can leak into this list.
  const { data } = await supabase
    .from("investor_notes")
    .select("*")
    .order("created_at", { ascending: false });

  const notes = (data ?? []) as InvestorNote[];

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Fundraising"
        title="Investor notes"
        description="Keep every investor conversation, sentiment, and follow-up in one place."
      />

      <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
        <Card className="h-fit">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-sm font-semibold">Log a conversation</h2>
            <NoteForm />
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            {notes.length} note{notes.length === 1 ? "" : "s"}
          </h2>
          {notes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <NotebookPen className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No investor notes yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-medium">{note.investor_name}</h3>
                      {note.sentiment && (
                        <Badge variant={SENTIMENT_VARIANT[note.sentiment]}>
                          {note.sentiment}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {note.content}
                    </p>
                    <p className="mt-3 font-mono text-xs text-muted-foreground">
                      {formatDate(note.created_at)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
