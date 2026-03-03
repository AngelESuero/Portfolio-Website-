import { NextResponse } from "next/server";
import { requireAdminRequest } from "../../../../lib/server/admin";

type VerificationDecision = "approve" | "deny";

export const runtime = "edge";

export async function GET(request: Request) {
  const adminAuth = await requireAdminRequest(request);

  if (!adminAuth.ok) {
    return NextResponse.json({ error: adminAuth.message }, { status: adminAuth.status });
  }

  const { data, error } = await adminAuth.supabaseAdmin
    .from("verification_requests")
    .select("id, user_id, zipcode, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    requests: data ?? []
  });
}

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
  const requestId = typeof payloadRecord.request_id === "string" ? payloadRecord.request_id.trim() : "";
  const decision = payloadRecord.decision;
  const note = typeof payloadRecord.note === "string" ? payloadRecord.note.trim() : null;

  if (!requestId || (decision !== "approve" && decision !== "deny")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data, error } = await adminAuth.supabaseAdmin.rpc("admin_resolve_verification_request", {
    p_request_id: requestId,
    p_reviewer_id: adminAuth.userId,
    p_decision: decision as VerificationDecision,
    p_note: note || null
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (data === "invalid_decision") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (data === "not_found") {
    return NextResponse.json({ error: "Verification request not found" }, { status: 404 });
  }

  if (data === "already_resolved") {
    return NextResponse.json({ error: "Verification request already resolved" }, { status: 409 });
  }

  if (data !== "ok") {
    return NextResponse.json({ error: "Unexpected verification result" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
