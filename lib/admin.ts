import { supabaseServidor } from "./supabase/servidor";
import { supabaseEscrita } from "./supabase";

export type Administrador = {
  id: string;
  email: string;
  nome: string | null;
  criado_em: string;
};

/**
 * Quem pode usar o painel.
 *
 * Estar autenticado NÃO basta: o cadastro público do Supabase Auth costuma vir
 * aberto, e a chave anônima é pública. Só passa quem tem linha em
 * `public.administradores`, conferida no servidor com a service role.
 */
export async function administradorAtual(): Promise<Administrador | null> {
  const sessao = await supabaseServidor();

  // getUser() valida o token no servidor do Supabase — getSession() apenas lê
  // o cookie e aceitaria um token forjado.
  const {
    data: { user },
  } = await sessao.auth.getUser();
  if (!user) return null;

  const db = supabaseEscrita();
  if (!db) return null;

  const { data } = await db
    .from("administradores")
    .select("id, email, nome, criado_em")
    .eq("id", user.id)
    .maybeSingle();

  return (data as Administrador) ?? null;
}

export async function listarAdministradores(): Promise<Administrador[]> {
  const db = supabaseEscrita();
  if (!db) return [];

  const { data } = await db
    .from("administradores")
    .select("id, email, nome, criado_em")
    .order("criado_em", { ascending: true });

  return (data as Administrador[]) ?? [];
}
