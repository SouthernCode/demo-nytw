// Lightweight hand-written types for the LaunchPad schema.
// (A real project would generate these from Supabase, but keeping them
// explicit here makes the data model easy to follow for the workshop.)

export type ProjectStatus =
  | "planning"
  | "building"
  | "launched"
  | "paused"
  | "archived";

export type TaskStatus = "todo" | "in_progress" | "done";

export interface Profile {
  id: string;
  full_name: string | null;
  company: string | null;
  avatar_url: string | null;
  // User-defined "custom KPI formula" shown on the dashboard.
  dashboard_formula: string | null;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  org_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  created_at: string;
}

export interface Project {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  is_milestone: boolean;
  due_date: string | null;
  position: number;
  created_at: string;
}

export interface InvestorNote {
  id: string;
  org_id: string;
  project_id: string | null;
  investor_name: string;
  content: string;
  sentiment: "positive" | "neutral" | "negative" | null;
  created_by: string | null;
  created_at: string;
}

export interface WaitlistSubmission {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  // Free-text "what are you building?" field collected from the public form.
  building: string | null;
  referral: string | null;
  created_at: string;
}

export interface AuditEvent {
  id: string;
  org_id: string | null;
  actor_id: string | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: "Planning",
  building: "Building",
  launched: "Launched",
  paused: "Paused",
  archived: "Archived",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};
