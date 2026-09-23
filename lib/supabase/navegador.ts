import { createBrowserClient } from "@supabase/ssr";

/** Cliente do navegador: só a chave publicável, nunca a service role. */
export function supabaseNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
