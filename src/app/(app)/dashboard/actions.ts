"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/data";

export type ActionState = { error?: string } | undefined;

export async function createProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "planning");

  if (!name) {
    return { error: "Project name is required." };
  }

  const { org, userId } = await getDashboardContext();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      org_id: org.id,
      name,
      description: description || null,
      status,
      created_by: userId,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/projects");
  redirect(`/dashboard/projects/${data.id}`);
}

export async function createTask(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const projectId = String(formData.get("project_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const dueDate = String(formData.get("due_date") ?? "").trim();
  const isMilestone = formData.get("is_milestone") === "on";

  if (!projectId || !title) {
    return { error: "Task title is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("project_tasks").insert({
    project_id: projectId,
    title,
    is_milestone: isMilestone,
    due_date: dueDate || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
  return undefined;
}

export async function setTaskStatus(formData: FormData) {
  const taskId = String(formData.get("task_id") ?? "");
  const status = String(formData.get("status") ?? "todo");
  const projectId = String(formData.get("project_id") ?? "");

  if (!taskId) return;

  const supabase = await createClient();
  await supabase
    .from("project_tasks")
    .update({ status })
    .eq("id", taskId);

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function createInvestorNote(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const investorName = String(formData.get("investor_name") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const sentiment = String(formData.get("sentiment") ?? "").trim();
  const projectId = String(formData.get("project_id") ?? "").trim();

  if (!investorName || !content) {
    return { error: "Investor name and note are required." };
  }

  const { org, userId } = await getDashboardContext();
  const supabase = await createClient();

  const { error } = await supabase.from("investor_notes").insert({
    org_id: org.id,
    project_id: projectId || null,
    investor_name: investorName,
    content,
    sentiment: sentiment || null,
    created_by: userId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/investor-notes");
  return undefined;
}

export async function updateProfile(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const dashboardFormula = String(formData.get("dashboard_formula") ?? "").trim();

  const { userId } = await getDashboardContext();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      company: company || null,
      dashboard_formula: dashboardFormula || null,
    })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/settings");
  return undefined;
}
