import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDashboardContext } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectForm } from "./project-form";

export const metadata = { title: "New project · LaunchPad" };

export default async function NewProjectPage() {
  await getDashboardContext();

  return (
    <div className="pb-12">
      <PageHeader eyebrow="Workspace" title="Create a project" />

      <div className="px-6 py-8 sm:px-8">
        <Link
          href="/dashboard/projects"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>

        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <ProjectForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
