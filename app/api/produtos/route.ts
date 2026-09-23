import { NextResponse } from "next/server";
import { administradorAtual } from "@/lib/admin";
import { listarProdutos, criarProduto } from "@/lib/produtos";
import type { Produto } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await listarProdutos());
}

export async function POST(request: Request) {
  if (!(await administradorAtual())) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  try {
    const corpo = (await request.json()) as Partial<Produto>;
    if (!corpo.nome?.trim()) {
      return NextResponse.json({ erro: "O nome do produto é obrigatório." }, { status: 400 });
    }
    return NextResponse.json(await criarProduto(normalizar(corpo)));
  } catch (erro) {
    return NextResponse.json({ erro: (erro as Error).message }, { status: 500 });
  }
}

function normalizar(p: Partial<Produto>): Partial<Produto> {
  return {
    nome: p.nome?.trim(),
    descricao: p.descricao?.trim() || null,
    preco: p.preco === null || p.preco === undefined || Number.isNaN(Number(p.preco))
      ? null
      : Number(p.preco),
    unidade: p.unidade?.trim() || null,
    categoria: p.categoria || "recheados",
    foto_url: p.foto_url?.trim() || null,
    disponivel: p.disponivel ?? true,
    pronta_entrega: p.pronta_entrega ?? true,
    destaque: p.destaque ?? false,
    ordem: Number(p.ordem ?? 99),
  };
}
