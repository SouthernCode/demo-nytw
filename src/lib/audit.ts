import { createClient } from "@/lib/supabase/server";
import type { AuditEvent } from "@/lib/types";

/**
 * Audit logging — PLACEHOLDER.
 *
 * The `audit_events` table exists and this helper is wired to write to it,
 * but it is intentionally NOT called from most mutations yet. The goal is to
 * have a realistic starting point so audit logging can be designed and rolled
 * out properly later (which actions to log, retention, redaction, querying UI).
 *
 * TODO(workshop): decide an audit strategy and call this from server actions.
 */
export async function logAuditEvent(event: {
  orgId?: string | null;
  actorId?: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.from("audit_events").insert({
      org_id: event.orgId ?? null,
      actor_id: event.actorId ?? null,
      action: event.action,
      entity: event.entity ?? null,
      entity_id: event.entityId ?? null,
      metadata: event.metadata ?? null,
    });
  } catch {
    // Swallowed on purpose for now — auditing must never break a user action.
    // Proper error handling / alerting is a later planning exercise.
  }
}

export type { AuditEvent };
