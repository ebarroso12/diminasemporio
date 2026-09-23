"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FormularioLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);

    const resposta = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (resposta.ok) {
      router.refresh();
    } else {
      const { erro } = await resposta.json().catch(() => ({ erro: "Falha ao entrar." }));
      setErro(erro);
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={entrar}
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
          Área do administrador
        </h1>
        <p className="mt-1 text-center text-sm text-tinta-suave">
          Entre para editar o cardápio do site.
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
          className="mt-1.5 w-full rounded-xl border border-creme-3 bg-creme px-4 py-3 text-tinta outline-none focus:border-marinho"
        />

        <label className="mt-4 block text-sm font-semibold text-marinho" htmlFor="senha">
          Senha
        </label>
        <div className="relative mt-1.5">
          <input
            id="senha"
            type={mostrarSenha ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-creme-3 bg-creme px-4 py-3 pr-12 text-tinta outline-none focus:border-marinho"
          />
          <button
            type="button"
            onClick={() => setMostrarSenha((v) => !v)}
            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={mostrarSenha}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-tinta-suave transition-colors hover:text-marinho"
          >
            <IconeOlho aberto={mostrarSenha} />
          </button>
        </div>

        {erro && <p className="mt-3 text-sm font-semibold text-cereja">{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="mt-6 w-full rounded-full bg-marinho py-3.5 font-bold text-creme transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

function IconeOlho({ aberto }: { aberto: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
      {!aberto && <path d="M4 20 20 4" />}
    </svg>
  );
}
