"use client";

import { useState } from "react";
import type { Administrador } from "@/lib/admin";
import type { Aviso } from "./PainelAdmin";
import CampoSenha from "./CampoSenha";

export default function AbaUsuarios({
  administradoresIniciais,
  administradorAtual,
  avisar,
}: {
  administradoresIniciais: Administrador[];
  administradorAtual: Administrador;
  avisar: (tipo: Aviso["tipo"], texto: string) => void;
}) {
  const [administradores, setAdministradores] = useState(administradoresIniciais);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function adicionar(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviando(true);

    const resposta = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });
    const corpo = await resposta.json();
    setEnviando(false);

    if (!resposta.ok) {
      avisar("erro", corpo.erro ?? "Não foi possível adicionar.");
      return;
    }
    setAdministradores((atual) => [...atual.filter((a) => a.id !== corpo.id), corpo]);
    setNome("");
    setEmail("");
    setSenha("");
    avisar("ok", "Administrador liberado. Avise a pessoa da senha inicial.");
  }

  async function remover(pessoa: Administrador) {
    if (!confirm(`Remover o acesso de ${pessoa.email}?`)) return;

    const resposta = await fetch(`/api/admins/${pessoa.id}`, { method: "DELETE" });
    if (!resposta.ok) {
      const { erro } = await resposta.json().catch(() => ({ erro: "Falha ao remover." }));
      avisar("erro", erro);
      return;
    }
    setAdministradores((atual) => atual.filter((a) => a.id !== pessoa.id));
    avisar("ok", "Acesso removido.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <h2 className="font-display text-xl font-semibold text-marinho">Quem administra o site</h2>
        <p className="mt-1 text-sm text-tinta-suave">
          Só quem está nesta lista consegue entrar no painel e mexer no cardápio.
        </p>

        <ul className="mt-5 space-y-3">
          {administradores.map((pessoa) => (
            <li
              key={pessoa.id}
              className="sombra-cartao flex flex-wrap items-center gap-3 rounded-suave bg-creme-2 p-4 ring-1 ring-creme-3"
            >
              <div className="mr-auto">
                <p className="font-display font-semibold text-marinho">
                  {pessoa.nome || pessoa.email}
                  {pessoa.id === administradorAtual.id && (
                    <span className="ml-2 rounded-full bg-folha px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-creme">
                      você
                    </span>
                  )}
                </p>
                <p className="text-sm text-tinta-suave">{pessoa.email}</p>
              </div>
              <button
                onClick={() => remover(pessoa)}
                disabled={pessoa.id === administradorAtual.id || administradores.length <= 1}
                className="rounded-full px-4 py-2 text-sm font-semibold text-cereja transition-colors hover:bg-cereja/10 disabled:opacity-30"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={adicionar}
        className="sombra-cartao h-fit rounded-suave bg-creme-2 p-6 ring-1 ring-creme-3"
      >
        <h2 className="font-display text-lg font-semibold text-marinho">Liberar mais alguém</h2>
        <p className="mt-1 text-sm leading-relaxed text-tinta-suave">
          Defina uma senha inicial e peça para a pessoa trocá-la no primeiro acesso, na aba
          &ldquo;Minha conta&rdquo;.
        </p>

        <label className="mt-5 block text-sm font-semibold text-marinho" htmlFor="novo-nome">
          Nome
        </label>
        <input
          id="novo-nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Como chamar essa pessoa"
          className="entrada mt-1.5 py-3"
        />

        <label className="mt-4 block text-sm font-semibold text-marinho" htmlFor="novo-email">
          E-mail
        </label>
        <input
          id="novo-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="entrada mt-1.5 py-3"
        />

        <label className="mt-4 block text-sm font-semibold text-marinho" htmlFor="nova-senha">
          Senha inicial
        </label>
        <CampoSenha
          id="nova-senha"
          valor={senha}
          aoMudar={setSenha}
          placeholder="mínimo 8 caracteres"
        />

        <button
          type="submit"
          disabled={enviando}
          className="mt-6 w-full rounded-full bg-marinho py-3.5 font-bold text-creme transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {enviando ? "Liberando..." : "Liberar acesso"}
        </button>
      </form>
    </div>
  );
}
