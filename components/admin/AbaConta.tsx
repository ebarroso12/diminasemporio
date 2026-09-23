"use client";

import { useState } from "react";
import type { Administrador } from "@/lib/admin";
import type { Aviso } from "./PainelAdmin";
import { supabaseNavegador } from "@/lib/supabase/navegador";
import CampoSenha from "./CampoSenha";

export default function AbaConta({
  administradorAtual,
  avisar,
}: {
  administradorAtual: Administrador;
  avisar: (tipo: Aviso["tipo"], texto: string) => void;
}) {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function trocarSenha(evento: React.FormEvent) {
    evento.preventDefault();

    if (nova.length < 8) {
      avisar("erro", "A senha nova precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (nova !== confirmacao) {
      avisar("erro", "As duas senhas não são iguais.");
      return;
    }

    setSalvando(true);
    const supabase = supabaseNavegador();

    // Confere a senha atual antes de trocar: sem isso, quem pegasse a máquina
    // destravada trocaria a senha sem saber a antiga.
    const { error: erroAtual } = await supabase.auth.signInWithPassword({
      email: administradorAtual.email,
      password: atual,
    });
    if (erroAtual) {
      setSalvando(false);
      avisar("erro", "A senha atual está incorreta.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: nova });
    setSalvando(false);

    if (error) {
      avisar("erro", error.message);
      return;
    }
    setAtual("");
    setNova("");
    setConfirmacao("");
    avisar("ok", "Senha alterada.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={trocarSenha}
        className="sombra-cartao h-fit rounded-suave bg-creme-2 p-6 ring-1 ring-creme-3"
      >
        <h2 className="font-display text-lg font-semibold text-marinho">Trocar minha senha</h2>
        <p className="mt-1 text-sm text-tinta-suave">{administradorAtual.email}</p>

        <label className="mt-5 block text-sm font-semibold text-marinho" htmlFor="senha-atual">
          Senha atual
        </label>
        <CampoSenha
          id="senha-atual"
          valor={atual}
          aoMudar={setAtual}
          autoComplete="current-password"
        />

        <label className="mt-4 block text-sm font-semibold text-marinho" htmlFor="senha-nova">
          Senha nova
        </label>
        <CampoSenha
          id="senha-nova"
          valor={nova}
          aoMudar={setNova}
          placeholder="mínimo 8 caracteres"
        />

        <label className="mt-4 block text-sm font-semibold text-marinho" htmlFor="senha-confirma">
          Repita a senha nova
        </label>
        <CampoSenha id="senha-confirma" valor={confirmacao} aoMudar={setConfirmacao} />

        <button
          type="submit"
          disabled={salvando}
          className="mt-6 w-full rounded-full bg-marinho py-3.5 font-bold text-creme transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar senha nova"}
        </button>
      </form>

      <div className="sombra-cartao h-fit rounded-suave bg-creme-2 p-6 ring-1 ring-creme-3">
        <h2 className="font-display text-lg font-semibold text-marinho">Esqueceu a senha?</h2>
        <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
          Na tela de login existe o link <strong>Esqueci minha senha</strong>. Ele manda um e-mail
          com um link temporário para criar uma senha nova — vale uma vez só e expira rápido.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
          Se o e-mail não chegar em alguns minutos, confira a caixa de spam.
        </p>
      </div>
    </div>
  );
}
