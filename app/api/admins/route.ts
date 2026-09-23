import { NextResponse } from "next/server";
import { administradorAtual, listarAdministradores } from "@/lib/admin";
import { supabaseEscrita } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await administradorAtual())) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }
  return NextResponse.json(await listarAdministradores());
}

/** Convida um novo administrador: cria o usuário e o registra na tabela. */
export async function POST(request: Request) {
  if (!(await administradorAtual())) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const db = supabaseEscrita();
  if (!db) {
    return NextResponse.json({ erro: "Banco não configurado." }, { status: 503 });
  }

  let email = "";
  let nome = "";
  let senha = "";
  try {
    ({ email = "", nome = "", senha = "" } = await request.json());
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  email = String(email).trim().toLowerCase();
  if (!email.includes("@")) {
    return NextResponse.json({ erro: "Informe um e-mail válido." }, { status: 400 });
  }
  if (String(senha).length < 8) {
    return NextResponse.json(
      { erro: "A senha inicial precisa ter pelo menos 8 caracteres." },
      { status: 400 }
    );
  }

  const { data: criado, error: erroCriacao } = await db.auth.admin.createUser({
    email,
    password: String(senha),
    email_confirm: true,
    user_metadata: { nome: String(nome).trim() || null },
  });

  // Se já existe conta com esse e-mail, basta promovê-la a administradora.
  let id = criado?.user?.id;
  if (erroCriacao) {
    const { data: lista } = await db.auth.admin.listUsers();
    id = lista?.users.find((u) => u.email?.toLowerCase() === email)?.id;
    if (!id) {
      return NextResponse.json({ erro: erroCriacao.message }, { status: 400 });
    }
  }

  const { data, error } = await db
    .from("administradores")
    .upsert({ id, email, nome: String(nome).trim() || null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
