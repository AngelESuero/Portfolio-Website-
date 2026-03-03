import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type PublicSupabaseConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

type ServiceRoleSupabaseConfig = PublicSupabaseConfig & {
  serviceRoleKey: string;
};

function readPublicSupabaseConfig(): PublicSupabaseConfig | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return { supabaseUrl, supabaseAnonKey };
}

export function getPublicSupabaseConfig(): PublicSupabaseConfig | null {
  return readPublicSupabaseConfig();
}

export function getServiceRoleSupabaseConfig(): ServiceRoleSupabaseConfig | null {
  const publicConfig = readPublicSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

  if (!publicConfig || !serviceRoleKey) {
    return null;
  }

  return {
    ...publicConfig,
    serviceRoleKey
  };
}

export function createSupabaseAnonServerClient(): SupabaseClient | null {
  const config = readPublicSupabaseConfig();

  if (!config) {
    return null;
  }

  return createClient(config.supabaseUrl, config.supabaseAnonKey);
}

export function createSupabaseServiceRoleServerClient(): SupabaseClient | null {
  const config = getServiceRoleSupabaseConfig();

  if (!config) {
    return null;
  }

  return createClient(config.supabaseUrl, config.serviceRoleKey);
}

export function getBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  return token || null;
}

export function isDuplicateKeyError(error: { code?: string | null } | null | undefined) {
  return error?.code === "23505";
}
