import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createSupabaseAnonServerClient,
  createSupabaseServiceRoleServerClient,
  getBearerToken,
  getPublicSupabaseConfig
} from "./supabase";

type AdminAuthSuccess = {
  ok: true;
  supabaseAdmin: SupabaseClient;
  userId: string;
};

type AdminAuthFailure = {
  ok: false;
  message: string;
  status: number;
};

export type AdminAuthResult = AdminAuthSuccess | AdminAuthFailure;

function readAdminIds() {
  return (process.env.ADMIN_USER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export async function requireAdminRequest(request: Request): Promise<AdminAuthResult> {
  if (!getPublicSupabaseConfig()) {
    return {
      ok: false,
      status: 500,
      message: "Supabase public config missing"
    };
  }

  const token = getBearerToken(request);

  if (!token) {
    return {
      ok: false,
      status: 401,
      message: "Authorization token required"
    };
  }

  const supabaseAuth = createSupabaseAnonServerClient();
  const supabaseAdmin = createSupabaseServiceRoleServerClient();

  if (!supabaseAuth) {
    return {
      ok: false,
      status: 500,
      message: "Supabase public config missing"
    };
  }

  if (!supabaseAdmin) {
    return {
      ok: false,
      status: 500,
      message: "Service role key missing"
    };
  }

  const { data, error } = await supabaseAuth.auth.getUser(token);

  if (error || !data.user) {
    return {
      ok: false,
      status: 401,
      message: "Invalid authorization token"
    };
  }

  const adminIds = readAdminIds();

  if (!adminIds.includes(data.user.id)) {
    return {
      ok: false,
      status: 403,
      message: "Admin access required"
    };
  }

  return {
    ok: true,
    supabaseAdmin,
    userId: data.user.id
  };
}
