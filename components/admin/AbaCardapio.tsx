"use client";

import { useState } from "react";
import type { Produto } from "@/lib/types";
import type { Aviso } from "./PainelAdmin";
import EditorProduto from "./EditorProduto";

const PRODUTO_EM_BRANCO: Omit<Produto, "id"> = {
  nome: "",
  descricao: "",
  preco: null,
  unidade: "unidade",
  categoria: "recheados",
  foto_url: null,
  disponivel: true,
  pronta_entrega: true,
  destaque: false,
  ordem: 99,
};

export default function AbaCardapio({
  produtosIniciais,
  somenteLeitura,
  avisar,
  aoMudarTotal,
}: {
  produtosIniciais: Produto[];
  somenteLeitura: boolean;
  avisar: (tipo: Aviso["tipo"], texto: string) => void;
  aoMudarTotal: (total: number) => void;
}) {
  const [produtos, definirProdutos] = useState(produtosIniciais);
  const [criando, setCriando] = useState(false);

  function atualizarLista(lista: Produto[]) {
    definirProdutos(lista);
    aoMudarTotal(lista.length);
  }

  async function salvar(id: string, patch: Partial<Produto>) {
    const resposta = await fetch(`/api/produtos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const corpo = await resposta.json();

    if (!resposta.ok) {
      avisar("erro", corpo.erro ?? "Não foi possível salvar.");
      return false;
    }
    atualizarLista(produtos.map((p) => (p.id === id ? corpo : p)));
    avisar("ok", "Alteração salva. Já está no ar.");
    return true;
  }

  async function excluir(produto: Produto) {
    if (!confirm(`Excluir "${produto.nome}" do cardápio? Essa ação não tem volta.`)) return;

    const resposta = await fetch(`/api/produtos/${produto.id}`, { method: "DELETE" });
    if (!resposta.ok) {
      const { erro } = await resposta.json().catch(() => ({ erro: "Falha ao excluir." }));
      avisar("erro", erro);
      return;
    }
    atualizarLista(produtos.filter((p) => p.id !== produto.id));
    avisar("ok", "Produto excluído.");
  }

  async function criar(novo: Omit<Produto, "id">) {
    const resposta = await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo),
    });
    const corpo = await resposta.json();

    if (!resposta.ok) {
      avisar("erro", corpo.erro ?? "Não foi possível criar.");
      return false;
    }
    atualizarLista([...produtos, corpo].sort((a, b) => a.ordem - b.ordem));
    setCriando(false);
    avisar("ok", "Produto adicionado ao cardápio.");
    return true;
  }

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={() => setCriando((v) => !v)}
          disabled={somenteLeitura}
          className="rounded-full bg-marinho px-5 py-3 text-sm font-bold text-creme transition-transform hover:scale-[1.03] disabled:opacity-40"
        >
          {criando ? "Cancelar" : "+ Novo produto"}
        </button>
      </div>

      {criando && (
        <div className="mt-5">
          <EditorProduto
            produto={{ ...PRODUTO_EM_BRANCO, id: "novo" }}
            novo
            bloqueado={somenteLeitura}
            onSalvar={(patch) => criar({ ...PRODUTO_EM_BRANCO, ...patch })}
            onExcluir={() => setCriando(false)}
          />
        </div>
      )}

      <div className="mt-6 space-y-4">
        {produtos.map((produto) => (
          <EditorProduto
            key={produto.id}
            produto={produto}
            bloqueado={somenteLeitura}
            onSalvar={(patch) => salvar(produto.id, patch)}
            onExcluir={() => excluir(produto)}
          />
        ))}
      </div>
    </div>
  );
}
