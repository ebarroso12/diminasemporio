"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabaseNavegador } from "@/lib/supabase/navegador";
import CampoSenha from "./CampoSenha";

export default function FormularioLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [modoRecuperar, setModoRecuperar] = useState(false);

  async function entrar(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);

    const supabase = supabaseNavegador();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
      setErro(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message
      );
      setEnviando(false);
      return;
    }
    router.refresh();
  }

  async function recuperar(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);
    setAviso(null);

    const supabase = supabaseNavegador();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/redefinir`,
    });

    setEnviando(false);
    if (error) {
      setErro(error.message);
      return;
    }
    // Resposta igual com ou sem conta: não confirma para estranhos quais
    // e-mails têm acesso ao painel.
    setAviso(
      "Se houver conta com esse e-mail, o link de redefinição já está a caminho. Confira também o spam."
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <form
        onSubmit={modoRecuperar ? recuperar : entrar}
        className="sombra-cartao w-full max-w-sm rounded-suave bg-creme-2 p-8 ring-1 ring-creme-3"
      >
        <Image
          src="/fotos/logo.png"
          alt="Di Minas"
          width={140}
          height={140}
          className="mx-auto h-20 w-20 rounded-full"
        />
        <h1 className="mt-5 text-center font-display text-2xl font-semibold text-marinho">
          {modoRecuperar ? "Recuperar senha" : "Área do administrador"}
        </h1>
        <p className="mt-1 text-center text-sm text-tinta-suave">
          {modoRecuperar
            ? "Informe o e-mail da conta e enviamos um link para criar uma senha nova."
            : "Entre para editar o cardápio do site."}
        </p>

        <label className="mt-7 block text-sm font-semibold text-marinho" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          required
          className="entrada mt-1.5 py-3"
        />

        {!modoRecuperar && (
          <>
            <label className="mt-4 block text-sm font-semibold text-marinho" htmlFor="senha">
              Senha
            </label>
            <CampoSenha
              id="senha"
              valor={senha}
              aoMudar={setSenha}
              autoComplete="current-password"
            />
          </>
        )}

        {erro && <p className="mt-3 text-sm font-semibold text-cereja">{erro}</p>}
        {aviso && <p className="mt-3 text-sm font-semibold text-folha">{aviso}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="mt-6 w-full rounded-full bg-marinho py-3.5 font-bold text-creme transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {enviando ? "Aguarde..." : modoRecuperar ? "Enviar link de redefinição" : "Entrar"}
        </button>

        <button
          type="button"
          onClick={() => {
            setModoRecuperar((v) => !v);
            setErro(null);
            setAviso(null);
          }}
          className="mt-4 w-full text-center text-sm font-semibold text-tinta-suave transition-colors hover:text-marinho"
        >
          {modoRecuperar ? "Voltar para o login" : "Esqueci minha senha"}
        </button>
      </form>
    </div>
  );
}
