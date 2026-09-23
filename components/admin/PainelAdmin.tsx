"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Produto } from "@/lib/types";
import type { Administrador } from "@/lib/admin";
import { supabaseNavegador } from "@/lib/supabase/navegador";
import AbaCardapio from "./AbaCardapio";
import AbaUsuarios from "./AbaUsuarios";
import AbaConta from "./AbaConta";

export type Aviso = { tipo: "ok" | "erro"; texto: string };

const ABAS = [
  { id: "cardapio", rotulo: "Cardápio" },
  { id: "usuarios", rotulo: "Usuários" },
  { id: "conta", rotulo: "Minha conta" },
] as const;

type AbaId = (typeof ABAS)[number]["id"];

export default function PainelAdmin({
  produtosIniciais,
  administradoresIniciais,
  administradorAtual,
  somenteLeitura,
}: {
  produtosIniciais: Produto[];
  administradoresIniciais: Administrador[];
  administradorAtual: Administrador;
  somenteLeitura: boolean;
}) {
  const router = useRouter();
  const [aba, setAba] = useState<AbaId>("cardapio");
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [totalProdutos, setTotalProdutos] = useState(produtosIniciais.length);

  function avisar(tipo: Aviso["tipo"], texto: string) {
    setAviso({ tipo, texto });
    setTimeout(() => setAviso(null), 4500);
  }

  async function sair() {
    await supabaseNavegador().auth.signOut();
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-center gap-4 border-b border-creme-3 pb-6">
        <Image
          src="/fotos/logo.png"
          alt=""
          width={100}
          height={100}
          className="h-12 w-12 rounded-full"
        />
        <div className="mr-auto">
          <h1 className="font-display text-2xl font-semibold text-marinho">Painel do Di Minas</h1>
          <p className="text-sm text-tinta-suave">
            {administradorAtual.email} · {totalProdutos} produtos no cardápio
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          className="rounded-full border border-marinho/25 px-4 py-2 text-sm font-semibold text-marinho transition-colors hover:bg-marinho hover:text-creme"
        >
          Ver o site
        </a>
        <button
          onClick={sair}
          className="rounded-full px-4 py-2 text-sm font-semibold text-tinta-suave transition-colors hover:text-cereja"
        >
          Sair
        </button>
      </header>

      {somenteLeitura && (
        <div className="mt-6 rounded-suave border border-cereja/30 bg-cereja/5 p-5">
          <h2 className="font-display font-semibold text-cereja">Modo somente leitura</h2>
          <p className="mt-1 text-sm leading-relaxed text-tinta-suave">
            O banco de dados não está acessível, então o site está mostrando o cardápio inicial do
            código e nada pode ser salvo aqui.
          </p>
        </div>
      )}

      <nav className="mt-7 flex flex-wrap gap-2">
        {ABAS.map((item) => (
          <button
            key={item.id}
            onClick={() => setAba(item.id)}
            aria-current={aba === item.id ? "page" : undefined}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
              aba === item.id
                ? "bg-marinho text-creme"
                : "bg-creme-2 text-marinho ring-1 ring-creme-3 hover:bg-creme-3"
            }`}
          >
            {item.rotulo}
          </button>
        ))}
      </nav>

      {aviso && (
        <p
          className={`sticky top-4 z-30 mt-6 rounded-full px-5 py-3 text-center text-sm font-semibold ${
            aviso.tipo === "ok" ? "bg-folha text-creme" : "bg-cereja text-creme"
          }`}
        >
          {aviso.texto}
        </p>
      )}

      <div className="mt-8">
        {aba === "cardapio" && (
          <AbaCardapio
            produtosIniciais={produtosIniciais}
            somenteLeitura={somenteLeitura}
            avisar={avisar}
            aoMudarTotal={setTotalProdutos}
          />
        )}
        {aba === "usuarios" && (
          <AbaUsuarios
            administradoresIniciais={administradoresIniciais}
            administradorAtual={administradorAtual}
            avisar={avisar}
          />
        )}
        {aba === "conta" && <AbaConta administradorAtual={administradorAtual} avisar={avisar} />}
      </div>
    </div>
  );
}
