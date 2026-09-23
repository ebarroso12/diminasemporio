import { NextResponse } from "next/server";
import { abrirSessao, fecharSessao, credenciaisCorretas, adminConfigurado } from "@/lib/auth";

export async function POST(request: Request) {
  if (!adminConfigurado) {
    return NextResponse.json(
      { erro: "Painel bloqueado: a variável ADMIN_PASSWORD não está definida no servidor." },
      { status: 503 }
    );
  }

  let email = "";
  let senha = "";
  try {
    ({ email = "", senha = "" } = await request.json());
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  if (!(await credenciaisCorretas(String(email ?? ""), String(senha ?? "")))) {
    return NextResponse.json({ erro: "E-mail ou senha incorretos." }, { status: 401 });
  }

  await abrirSessao();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await fecharSessao();
  return NextResponse.json({ ok: true });
}
