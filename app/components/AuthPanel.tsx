"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import type { VerificationTier } from "../../lib/types";
import { NEWARK_ZIPS } from "../../lib/newark";

const tierLabels: Record<VerificationTier, string> = {
  unverified: "Unverified",
  light: "Light verified",
  strong: "Strong verified"
};

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [tier, setTier] = useState<VerificationTier>("unverified");
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const syncAuthState = async () => {
    if (!isSupabaseConfigured || !supabase) return;

    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      setUserId(null);
      setTier("unverified");
      setHasPendingRequest(false);
      setZip("");
      return;
    }

    setUserId(data.user.id);

    let { data: profile, error: profileError } = await supabase
      .from("users")
      .select("verification_tier")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!profile && !profileError) {
      const { error: insertError } = await supabase.from("users").insert({ id: data.user.id });
      if (insertError && insertError.code !== "23505") {
        setStatus(insertError.message);
        return;
      }

      const reload = await supabase
        .from("users")
        .select("verification_tier")
        .eq("id", data.user.id)
        .maybeSingle();

      profile = reload.data;
      profileError = reload.error;
    }

    if (profileError) {
      setStatus(profileError.message);
      return;
    }

    setTier(profile?.verification_tier ?? "unverified");

    const { data: pendingRequest, error: pendingError } = await supabase
      .from("verification_requests")
      .select("id")
      .eq("user_id", data.user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pendingError) {
      setStatus(pendingError.message);
      return;
    }

    setHasPendingRequest(Boolean(pendingRequest));
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      void syncAuthState();
    });

    void syncAuthState();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    if (!email || !supabase) return;
    setLoading(true);
    setStatus(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined
      }
    });
    setLoading(false);
    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Check your email for a magic sign-in link.");
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const requestLightVerification = async () => {
    if (!userId || !supabase) return;
    if (!NEWARK_ZIPS.has(zip)) {
      setStatus("ZIP must be a Newark ZIP code.");
      return;
    }

    setLoading(true);
    setStatus(null);
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;

    if (!accessToken) {
      setStatus("Sign in required.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/verification/request", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ zipcode: zip })
    });

    let payload: { message?: string } = {};
    try {
      payload = (await response.json()) as { message?: string };
    } catch {
      payload = {};
    }

    if (!response.ok) {
      setStatus(payload.message || "Could not submit verification request.");
      setLoading(false);
      if (response.status === 409) {
        await syncAuthState();
      }
      return;
    }

    setHasPendingRequest(true);
    setStatus("Light verification request submitted for review.");
    setLoading(false);
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-2xl border border-amber/30 bg-amber/10 p-4 text-sm text-slate">
        Supabase is not configured. Add env vars to enable auth.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate/10 bg-white p-4 shadow-card">
      <h2 className="text-base font-semibold text-ink">Your Civic Passport</h2>
      <p className="text-sm text-slate/70">Tier: {tierLabels[tier]}</p>
      {userId ? (
        <div className="mt-3 space-y-3 text-sm">
          <button
            onClick={signOut}
            className="rounded-full border border-slate/20 px-3 py-1.5 text-slate"
          >
            Sign out
          </button>
          {tier === "light" || tier === "strong" ? (
            <div className="rounded-xl bg-fog p-3">
              <p className="font-medium text-ink">Verification active</p>
              <p className="text-xs text-slate/70">
                Your account is currently eligible to post and support issues.
              </p>
            </div>
          ) : hasPendingRequest ? (
            <div className="rounded-xl bg-fog p-3">
              <p className="font-medium text-ink">Light verification pending</p>
              <p className="text-xs text-slate/70">
                Your Newark ZIP was submitted for manual review. An admin must approve the request before
                posting or support actions unlock.
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-fog p-3">
              <p className="font-medium text-ink">Request Light Verified</p>
              <p className="text-xs text-slate/70">
                Submit a Newark ZIP for manual review. Approval is handled by an admin before the account
                can post issues.
              </p>
              <div className="mt-2 flex flex-col gap-2">
                <input
                  value={zip}
                  onChange={(event) => setZip(event.target.value)}
                  placeholder="Newark ZIP"
                  className="rounded-lg border border-slate/20 px-3 py-2"
                />
                <button
                  onClick={requestLightVerification}
                  disabled={loading}
                  className="rounded-lg bg-ink px-3 py-2 text-white disabled:opacity-60"
                >
                  Request Light Verification
                </button>
              </div>
            </div>
          )}
          <div className="rounded-xl border border-slate/10 p-3 text-xs text-slate/70">
            Strong verification is coming soon.
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-2 text-sm">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="w-full rounded-lg border border-slate/20 px-3 py-2"
          />
          <button
            onClick={signIn}
            disabled={loading}
            className="w-full rounded-lg bg-ink px-3 py-2 text-white disabled:opacity-60"
          >
            Sign in with magic link
          </button>
        </div>
      )}
      {status ? <p className="mt-3 text-xs text-slate/60">{status}</p> : null}
    </div>
  );
}
