import { cookies } from "next/headers";

const COOKIE = "diminas_admin";
const DURACAO_HORAS = 12;

function segredo() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

/** Sem ADMIN_PASSWORD definido o painel fica trancado — nunca há senha padrão. */
export const adminConfigurado = Boolean(process.env.ADMIN_PASSWORD);

/** O e-mail é opcional: se ADMIN_EMAIL não existir, só a senha é cobrada. */
export const exigeEmail = Boolean(process.env.ADMIN_EMAIL);

async function assinar(valor: string): Promise<string> {
  const chave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(segredo()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const assinatura = await crypto.subtle.sign("HMAC", chave, new TextEncoder().encode(valor));
  return Array.from(new Uint8Array(assinatura))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function comparacaoSegura(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let i = 0; i < a.length; i++) diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diferenca === 0;
}

/**
 * Compara pelo resumo HMAC: o tempo de resposta não vaza o conteúdo da senha,
 * e o e-mail entra na mesma conta quando ADMIN_EMAIL está definido.
 */
export async function credenciaisCorretas(email: string, senha: string) {
  const senhaEsperada = process.env.ADMIN_PASSWORD;
  if (!senhaEsperada) return false;

  const emailEsperado = process.env.ADMIN_EMAIL;
  if (emailEsperado) {
    const informado = await assinar(email.trim().toLowerCase());
    const esperado = await assinar(emailEsperado.trim().toLowerCase());
    if (!comparacaoSegura(informado, esperado)) return false;
  }

  return comparacaoSegura(await assinar(senha), await assinar(senhaEsperada));
}

export async function abrirSessao() {
  const expiraEm = Date.now() + DURACAO_HORAS * 60 * 60 * 1000;
  const token = `${expiraEm}.${await assinar(String(expiraEm))}`;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACAO_HORAS * 60 * 60,
  });
}

export async function fecharSessao() {
  (await cookies()).delete(COOKIE);
}

export async function sessaoValida() {
  if (!adminConfigurado) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;

  const [expiraEm, assinatura] = token.split(".");
  if (!expiraEm || !assinatura) return false;
  if (Number(expiraEm) < Date.now()) return false;
  return comparacaoSegura(assinatura, await assinar(expiraEm));
}
