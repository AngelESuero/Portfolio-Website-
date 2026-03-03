"use client";

import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import type { VerificationRequest } from "../../lib/types";

type ScreenState = "loading" | "unconfigured" | "signed_out" | "forbidden" | "ready" | "error";
type PendingVerificationRequest = Pick<VerificationRequest, "id" | "user_id" | "zipcode" | "created_at">;

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export default function AdminPage() {
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [requests, setRequests] = useState<PendingVerificationRequest[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadRequests = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setScreenState("unconfigured");
      setRequests([]);
      return;
    }

    setScreenState("loading");
    setErrorMessage(null);

    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;

    if (!accessToken) {
      setRequests([]);
      setScreenState("signed_out");
      return;
    }

    const response = await fetch("/api/admin/verification", {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });

    let payload: { error?: string; requests?: PendingVerificationRequest[] } = {};

    try {
      payload = (await response.json()) as { error?: string; requests?: PendingVerificationRequest[] };
    } catch {
      payload = {};
    }

    if (response.status === 401) {
      setRequests([]);
      setScreenState("signed_out");
      return;
    }

    if (response.status === 403) {
      setRequests([]);
      setScreenState("forbidden");
      return;
    }

    if (!response.ok) {
      setRequests([]);
      setScreenState("error");
      setErrorMessage(payload.error || "Could not load verification requests.");
      return;
    }

    setRequests(Array.isArray(payload.requests) ? payload.requests : []);
    setScreenState("ready");
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  const handleDecision = async (requestId: string, decision: "approve" | "deny") => {
    if (!supabase) return;

    setBusyId(requestId);
    setStatus(null);
    setErrorMessage(null);

    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;

    if (!accessToken) {
      setScreenState("signed_out");
      setBusyId(null);
      return;
    }

    const response = await fetch("/api/admin/verification", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        request_id: requestId,
        decision,
        note: notes[requestId] || undefined
      })
    });

    let payload: { error?: string } = {};

    try {
      payload = (await response.json()) as { error?: string };
    } catch {
      payload = {};
    }

    if (response.status === 401) {
      setScreenState("signed_out");
      setBusyId(null);
      return;
    }

    if (response.status === 403) {
      setScreenState("forbidden");
      setBusyId(null);
      return;
    }

    if (!response.ok) {
      setErrorMessage(payload.error || "Could not update the verification request.");
      setBusyId(null);
      return;
    }

    setNotes((current) => ({ ...current, [requestId]: "" }));
    setStatus(decision === "approve" ? "Verification request approved." : "Verification request denied.");
    setBusyId(null);
    await loadRequests();
  };

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Admin Review</h1>
          <p className="text-sm text-slate/70">Review pending Light verification requests.</p>
        </div>

        {screenState === "loading" ? <p className="text-sm text-slate/60">Loading admin review...</p> : null}
        {screenState === "unconfigured" ? (
          <div className="rounded-2xl border border-amber/30 bg-amber/10 p-6 text-sm text-slate">
            Supabase is not configured. Add env vars to enable admin review.
          </div>
        ) : null}
        {screenState === "signed_out" ? (
          <div className="rounded-2xl border border-slate/10 bg-white p-6 text-sm text-slate/70 shadow-card">
            Sign in on a civic page first, then reload this screen to review verification requests.
          </div>
        ) : null}
        {screenState === "forbidden" ? (
          <div className="rounded-2xl border border-amber/30 bg-amber/10 p-6 text-sm text-slate">
            This account is not allowed to review verification requests.
          </div>
        ) : null}
        {screenState === "error" && errorMessage ? (
          <div className="rounded-2xl border border-amber/30 bg-amber/10 p-6 text-sm text-slate">
            {errorMessage}
          </div>
        ) : null}

        {screenState === "ready" ? (
          <section className="space-y-4">
            {requests.length === 0 ? (
              <div className="rounded-2xl border border-slate/10 bg-white p-6 text-sm text-slate/70 shadow-card">
                No pending verification requests.
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="rounded-2xl border border-slate/10 bg-white p-6 shadow-card">
                  <div className="space-y-2">
                    <p className="text-sm text-slate/60">Request ID</p>
                    <p className="font-mono text-sm text-ink">{request.id}</p>
                    <p className="text-sm text-slate/60">User ID</p>
                    <p className="font-mono text-sm text-ink">{request.user_id}</p>
                    <p className="text-sm text-slate/60">ZIP</p>
                    <p className="text-sm text-ink">{request.zipcode}</p>
                    <p className="text-sm text-slate/60">Requested</p>
                    <p className="text-sm text-ink">{formatDate(request.created_at)}</p>
                  </div>
                  <textarea
                    value={notes[request.id] ?? ""}
                    onChange={(event) =>
                      setNotes((current) => ({
                        ...current,
                        [request.id]: event.target.value
                      }))
                    }
                    placeholder="Optional review note"
                    rows={3}
                    className="mt-4 w-full rounded-lg border border-slate/20 px-3 py-2 text-sm"
                  />
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleDecision(request.id, "approve")}
                      disabled={busyId === request.id}
                      className="rounded-lg bg-ink px-4 py-2 text-sm text-white disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecision(request.id, "deny")}
                      disabled={busyId === request.id}
                      className="rounded-lg border border-slate/20 px-4 py-2 text-sm text-slate disabled:opacity-60"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        ) : null}

        {status ? <p className="text-sm text-slate/60">{status}</p> : null}
      </main>
    </div>
  );
}
