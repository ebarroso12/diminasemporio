import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/** Cliente de servidor ligado aos cookies da requisição. */
export async function supabaseServidor() {
  const jarra = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => jarra.getAll(),
        setAll: (lista) => {
          try {
            lista.forEach(({ name, value, options }) => jarra.set(name, value, options));
          } catch {
            // Server Component não pode escrever cookie; o middleware renova a sessão.
          }
        },
      },
    }
  );
}
