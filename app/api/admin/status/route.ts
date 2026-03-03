import { NextResponse } from "next/server";
import type { IssueStatus } from "../../../../lib/types";
import { requireAdminRequest } from "../../../../lib/server/admin";

const allowedStatuses: IssueStatus[] = [
  "Submitted",
  "Under review",
  "Responded",
  "In progress",
  "Resolved"
];

export async function POST(request: Request) {
  const adminAuth = await requireAdminRequest(request);

  if (!adminAuth.ok) {
    return NextResponse.json({ error: adminAuth.message }, { status: adminAuth.status });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const payloadRecord = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const issueId = typeof payloadRecord.issue_id === "string" ? payloadRecord.issue_id.trim() : "";
  const toStatus = payloadRecord.to_status;
  const note = typeof payloadRecord.note === "string" ? payloadRecord.note.trim() : null;

  if (!issueId || typeof toStatus !== "string" || !allowedStatuses.includes(toStatus as IssueStatus)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data, error } = await adminAuth.supabaseAdmin.rpc("admin_transition_issue_status", {
    p_issue_id: issueId,
    p_actor_id: adminAuth.userId,
    p_to_status: toStatus,
    p_note: note
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (data === "invalid_status") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (data === "not_found") {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  if (data !== "ok") {
    return NextResponse.json({ error: "Unexpected admin status result" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
