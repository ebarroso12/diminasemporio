import type { Produto } from "./types";
import { produtosIniciais } from "./seed";
import { supabaseLeitura, supabaseEscrita, supabaseConfigurado } from "./supabase";

const TABELA = "produtos";

class BancoNaoConfigurado extends Error {
  constructor() {
    super(
      "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY para editar o cardápio."
    );
    this.name = "BancoNaoConfigurado";
  }
}

export const usandoCatalogoLocal = !supabaseConfigurado;

export async function listarProdutos(): Promise<Produto[]> {
  const db = supabaseLeitura();
  if (!db) return produtosIniciais;

  const { data, error } = await db.from(TABELA).select("*").order("ordem", { ascending: true });
  if (error) {
    console.error("[produtos] falha ao ler do Supabase, usando catálogo local:", error.message);
    return produtosIniciais;
  }
  return (data ?? []) as Produto[];
}

export async function criarProduto(produto: Partial<Produto>): Promise<Produto> {
  const db = supabaseEscrita();
  if (!db) throw new BancoNaoConfigurado();

  const { id: _ignorado, ...campos } = produto;
  const { data, error } = await db.from(TABELA).insert(campos).select().single();
  if (error) throw new Error(error.message);
  return data as Produto;
}

export async function atualizarProduto(id: string, patch: Partial<Produto>): Promise<Produto> {
  const db = supabaseEscrita();
  if (!db) throw new BancoNaoConfigurado();

  const { id: _ignorado, ...campos } = patch;
  const { data, error } = await db.from(TABELA).update(campos).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data as Produto;
}

export async function removerProduto(id: string): Promise<void> {
  const db = supabaseEscrita();
  if (!db) throw new BancoNaoConfigurado();

  const { error } = await db.from(TABELA).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
