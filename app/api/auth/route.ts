import { NextResponse } from "next/server";
import { abrirSessao, fecharSessao, senhaCorreta, adminConfigurado } from "@/lib/auth";

export async function POST(request: Request) {
  if (!adminConfigurado) {
    return NextResponse.json(
      { erro: "Painel bloqueado: a variável ADMIN_PASSWORD não está definida no servidor." },
      { status: 503 }
    );
  }

  let senha = "";
  try {
    ({ senha } = await request.json());
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  if (!(await senhaCorreta(String(senha ?? "")))) {
    return NextResponse.json({ erro: "Senha incorreta." }, { status: 401 });
  }

  await abrirSessao();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await fecharSessao();
  return NextResponse.json({ ok: true });
}
