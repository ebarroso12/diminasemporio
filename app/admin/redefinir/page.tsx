"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseNavegador } from "@/lib/supabase/navegador";
import CampoSenha from "@/components/admin/CampoSenha";

type Estado = "verificando" | "pronto" | "invalido" | "salvo";

export default function RedefinirSenha() {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>("verificando");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const supabase = supabaseNavegador();

    async function abrirSessaoDeRecuperacao() {
      // Fluxo PKCE: o link do e-mail volta com ?code= e ele vira sessão aqui.
      const codigo = new URLSearchParams(window.location.search).get("code");
      if (codigo) {
        const { error } = await supabase.auth.exchangeCodeForSession(codigo);
        if (!error) {
          setEstado("pronto");
          return;
        }
      }

      // Fluxo implícito ou sessão já aberta pelo próprio link.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setEstado(session ? "pronto" : "invalido");
    }

    abrirSessaoDeRecuperacao();
  }, []);

  async function salvar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);

    if (senha.length < 8) {
      setErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (senha !== confirmacao) {
      setErro("As duas senhas não são iguais.");
      return;
    }

    setSalvando(true);
    const supabase = supabaseNavegador();
    const { error } = await supabase.auth.updateUser({ password: senha });
    setSalvando(false);

    if (error) {
      setErro(error.message);
      return;
    }
    setEstado("salvo");
    setTimeout(() => router.push("/admin"), 2500);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="sombra-cartao w-full max-w-sm rounded-suave bg-creme-2 p-8 ring-1 ring-creme-3">
        <Image
          src="/fotos/logo.png"
          alt="Di Minas"
          width={140}
          height={140}
          className="mx-auto h-20 w-20 rounded-full"
        />

        {estado === "verificando" && (
          <p className="mt-6 text-center text-sm text-tinta-suave">Verificando o link...</p>
        )}

        {estado === "invalido" && (
          <>
            <h1 className="mt-5 text-center font-display text-2xl font-semibold text-marinho">
              Link expirado
            </h1>
            <p className="mt-2 text-center text-sm leading-relaxed text-tinta-suave">
              Esse link de redefinição não vale mais — eles duram pouco tempo e só funcionam uma
              vez. Peça um novo na tela de login.
            </p>
            <Link
              href="/admin"
              className="mt-6 block rounded-full bg-marinho py-3.5 text-center font-bold text-creme transition-transform hover:scale-[1.02]"
            >
              Voltar para o login
            </Link>
          </>
        )}

        {estado === "salvo" && (
          <>
            <h1 className="mt-5 text-center font-display text-2xl font-semibold text-marinho">
              Senha alterada
            </h1>
            <p className="mt-2 text-center text-sm text-tinta-suave">
              Tudo certo. Levando você para o painel...
            </p>
          </>
        )}

        {estado === "pronto" && (
          <form onSubmit={salvar}>
            <h1 className="mt-5 text-center font-display text-2xl font-semibold text-marinho">
              Criar senha nova
            </h1>

            <label className="mt-7 block text-sm font-semibold text-marinho" htmlFor="senha">
              Nova senha
            </label>
            <CampoSenha id="senha" valor={senha} aoMudar={setSenha} placeholder="mínimo 8 caracteres" />

            <label className="mt-4 block text-sm font-semibold text-marinho" htmlFor="confirmacao">
              Repita a senha
            </label>
            <CampoSenha id="confirmacao" valor={confirmacao} aoMudar={setConfirmacao} />

            {erro && <p className="mt-3 text-sm font-semibold text-cereja">{erro}</p>}

            <button
              type="submit"
              disabled={salvando}
              className="mt-6 w-full rounded-full bg-marinho py-3.5 font-bold text-creme transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {salvando ? "Salvando..." : "Salvar senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
