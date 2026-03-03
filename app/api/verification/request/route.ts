import { NextResponse } from "next/server";
import { NEWARK_ZIPS } from "../../../../lib/newark";
import {
  createSupabaseAnonServerClient,
  createSupabaseServiceRoleServerClient,
  getBearerToken,
  isDuplicateKeyError
} from "../../../../lib/server/supabase";

export async function POST(request: Request) {
  const token = getBearerToken(request);

  if (!token) {
    return NextResponse.json({ ok: false, message: "Authorization token required" }, { status: 401 });
  }

  const supabaseAuth = createSupabaseAnonServerClient();
  const supabaseAdmin = createSupabaseServiceRoleServerClient();

  if (!supabaseAuth) {
    return NextResponse.json({ ok: false, message: "Supabase public config missing" }, { status: 500 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, message: "Service role key missing" }, { status: 500 });
  }

  const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);

  if (userError || !userData.user) {
    return NextResponse.json({ ok: false, message: "Invalid authorization token" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON payload" }, { status: 400 });
  }

  const payloadRecord = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const zipcode = typeof payloadRecord.zipcode === "string" ? payloadRecord.zipcode.trim() : "";

  if (!NEWARK_ZIPS.has(zipcode)) {
    return NextResponse.json({ ok: false, message: "ZIP must be a Newark ZIP code." }, { status: 400 });
  }

  const { error: profileInsertError } = await supabaseAdmin.from("users").insert({
    id: userData.user.id
  });

  if (profileInsertError && !isDuplicateKeyError(profileInsertError)) {
    return NextResponse.json({ ok: false, message: profileInsertError.message }, { status: 500 });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("users")
    .select("verification_tier")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ ok: false, message: profileError.message }, { status: 500 });
  }

  if (profile?.verification_tier === "light" || profile?.verification_tier === "strong") {
    return NextResponse.json({ ok: false, message: "Already verified" }, { status: 409 });
  }

  const { data: pendingRequest, error: pendingError } = await supabaseAdmin
    .from("verification_requests")
    .select("id")
    .eq("user_id", userData.user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (pendingError) {
    return NextResponse.json({ ok: false, message: pendingError.message }, { status: 500 });
  }

  if (pendingRequest) {
    return NextResponse.json({ ok: true, state: "pending" });
  }

  const { error: requestError } = await supabaseAdmin.from("verification_requests").insert({
    user_id: userData.user.id,
    requested_tier: "light",
    zipcode,
    status: "pending"
  });

  if (requestError && !isDuplicateKeyError(requestError)) {
    return NextResponse.json({ ok: false, message: requestError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, state: "pending" });
}
