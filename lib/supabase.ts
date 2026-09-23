import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** O site inteiro funciona sem Supabase — nesse caso usa o catálogo de lib/seed.ts. */
export const supabaseConfigurado = Boolean(url && anonKey);
export const escritaConfigurada = Boolean(url && serviceKey);

export function supabaseLeitura(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

export function supabaseEscrita(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export const BUCKET_FOTOS = "produtos";
