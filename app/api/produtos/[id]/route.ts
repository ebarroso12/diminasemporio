import { NextResponse } from "next/server";
import { sessaoValida } from "@/lib/auth";
import { atualizarProduto, removerProduto } from "@/lib/produtos";
import type { Produto } from "@/lib/types";

export const dynamic = "force-dynamic";

type Contexto = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Contexto) {
  if (!(await sessaoValida())) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const corpo = (await request.json()) as Partial<Produto>;
    // Só os campos enviados são alterados — o painel manda patches pequenos.
    const patch: Partial<Produto> = {};
    if ("nome" in corpo) patch.nome = corpo.nome?.trim();
    if ("descricao" in corpo) patch.descricao = corpo.descricao?.trim() || null;
    if ("preco" in corpo)
      patch.preco =
        corpo.preco === null || corpo.preco === undefined || Number.isNaN(Number(corpo.preco))
          ? null
          : Number(corpo.preco);
    if ("unidade" in corpo) patch.unidade = corpo.unidade?.trim() || null;
    if ("categoria" in corpo) patch.categoria = corpo.categoria;
    if ("foto_url" in corpo) patch.foto_url = corpo.foto_url?.trim() || null;
    if ("disponivel" in corpo) patch.disponivel = Boolean(corpo.disponivel);
    if ("pronta_entrega" in corpo) patch.pronta_entrega = Boolean(corpo.pronta_entrega);
    if ("destaque" in corpo) patch.destaque = Boolean(corpo.destaque);
    if ("ordem" in corpo) patch.ordem = Number(corpo.ordem);

    return NextResponse.json(await atualizarProduto(id, patch));
  } catch (erro) {
    return NextResponse.json({ erro: (erro as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Contexto) {
  if (!(await sessaoValida())) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  try {
    await removerProduto(id);
    return NextResponse.json({ ok: true });
  } catch (erro) {
    return NextResponse.json({ erro: (erro as Error).message }, { status: 500 });
  }
}
