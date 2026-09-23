import { NextResponse } from "next/server";
import { administradorAtual, listarAdministradores } from "@/lib/admin";
import { supabaseEscrita } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Contexto = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Contexto) {
  const atual = await administradorAtual();
  if (!atual) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

  if (id === atual.id) {
    return NextResponse.json(
      { erro: "Você não pode remover o seu próprio acesso." },
      { status: 400 }
    );
  }

  // Nunca deixar o painel sem dono.
  const todos = await listarAdministradores();
  if (todos.length <= 1) {
    return NextResponse.json(
      { erro: "É preciso haver pelo menos um administrador." },
      { status: 400 }
    );
  }

  const db = supabaseEscrita();
  if (!db) {
    return NextResponse.json({ erro: "Banco não configurado." }, { status: 503 });
  }

  const { error } = await db.from("administradores").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }

  // Tira também a conta de acesso, para não sobrar login órfão.
  await db.auth.admin.deleteUser(id).catch(() => undefined);

  return NextResponse.json({ ok: true });
}
