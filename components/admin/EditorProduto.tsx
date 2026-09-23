"use client";

import { useState } from "react";
import Image from "next/image";
import type { Produto } from "@/lib/types";
import { CATEGORIAS } from "@/lib/types";
import { formatarPreco } from "@/lib/site";

export default function EditorProduto({
  produto,
  novo = false,
  bloqueado,
  onSalvar,
  onExcluir,
}: {
  produto: Produto;
  novo?: boolean;
  bloqueado: boolean;
  onSalvar: (patch: Partial<Produto>) => Promise<boolean>;
  onExcluir: () => void;
}) {
  const [rascunho, setRascunho] = useState<Produto>(produto);
  const [salvando, setSalvando] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);

  const alterado = JSON.stringify(rascunho) !== JSON.stringify(produto);

  function campo<K extends keyof Produto>(chave: K, valor: Produto[K]) {
    setRascunho((atual) => ({ ...atual, [chave]: valor }));
  }

  async function salvar() {
    setSalvando(true);
    const { id: _ignorado, ...patch } = rascunho;
    const ok = await onSalvar(patch);
    setSalvando(false);
    if (ok && novo) setRascunho({ ...produto });
  }

  async function enviarFoto(arquivo: File) {
    setEnviandoFoto(true);
    const dados = new FormData();
    dados.append("arquivo", arquivo);

    const resposta = await fetch("/api/upload", { method: "POST", body: dados });
    const corpo = await resposta.json();
    setEnviandoFoto(false);

    if (!resposta.ok) {
      alert(corpo.erro ?? "Falha ao enviar a foto.");
      return;
    }
    campo("foto_url", corpo.url);
  }

  return (
    <article
      className={`sombra-cartao rounded-suave bg-creme-2 p-5 ring-1 ring-creme-3 ${
        rascunho.disponivel ? "" : "opacity-75"
      }`}
    >
      <div className="grid gap-5 md:grid-cols-[160px_1fr]">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-creme-3">
            {rascunho.foto_url ? (
              <Image
                src={rascunho.foto_url}
                alt=""
                fill
                sizes="160px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-tinta-suave">
                sem foto
              </div>
            )}
          </div>
          <label className="mt-2 block cursor-pointer rounded-full border border-marinho/25 py-2 text-center text-xs font-bold text-marinho transition-colors hover:bg-marinho hover:text-creme">
            {enviandoFoto ? "Enviando..." : "Trocar foto"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={bloqueado || enviandoFoto}
              onChange={(e) => {
                const arquivo = e.target.files?.[0];
                if (arquivo) enviarFoto(arquivo);
              }}
            />
          </label>
        </div>

        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_130px_130px]">
            <Campo rotulo="Nome">
              <input
                value={rascunho.nome}
                onChange={(e) => campo("nome", e.target.value)}
                className="entrada"
                placeholder="Frango Tudo"
              />
            </Campo>
            <Campo rotulo="Preço (R$)">
              <input
                type="number"
                step="0.01"
                min="0"
                value={rascunho.preco ?? ""}
                onChange={(e) =>
                  campo("preco", e.target.value === "" ? null : Number(e.target.value))
                }
                className="entrada"
                placeholder="34.90"
              />
            </Campo>
            <Campo rotulo="Unidade">
              <input
                value={rascunho.unidade ?? ""}
                onChange={(e) => campo("unidade", e.target.value)}
                className="entrada"
                placeholder="unidade"
              />
            </Campo>
          </div>

          <Campo rotulo="Descrição">
            <textarea
              value={rascunho.descricao ?? ""}
              onChange={(e) => campo("descricao", e.target.value)}
              rows={2}
              className="entrada resize-y"
              placeholder="O que vai no recheio, o que torna esse item especial..."
            />
          </Campo>

          <div className="grid gap-3 sm:grid-cols-[1fr_110px]">
            <Campo rotulo="Categoria">
              <select
                value={rascunho.categoria}
                onChange={(e) => campo("categoria", e.target.value)}
                className="entrada"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo rotulo="Ordem">
              <input
                type="number"
                value={rascunho.ordem}
                onChange={(e) => campo("ordem", Number(e.target.value))}
                className="entrada"
              />
            </Campo>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Interruptor
              ativo={rascunho.disponivel}
              onClick={() => campo("disponivel", !rascunho.disponivel)}
              corAtiva="bg-folha text-creme"
            >
              {rascunho.disponivel ? "Em estoque" : "Em falta"}
            </Interruptor>
            <Interruptor
              ativo={rascunho.pronta_entrega}
              onClick={() => campo("pronta_entrega", !rascunho.pronta_entrega)}
              corAtiva="bg-marinho text-creme"
            >
              {rascunho.pronta_entrega ? "Pronta entrega" : "Sob encomenda"}
            </Interruptor>
            <Interruptor
              ativo={rascunho.destaque}
              onClick={() => campo("destaque", !rascunho.destaque)}
              corAtiva="bg-cereja text-creme"
            >
              Destaque na home
            </Interruptor>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-creme-3 pt-3">
            <span className="mr-auto font-display text-lg font-semibold text-cafe">
              {formatarPreco(rascunho.preco)}
            </span>
            <button
              onClick={onExcluir}
              disabled={bloqueado && !novo}
              className="rounded-full px-4 py-2 text-sm font-semibold text-cereja transition-colors hover:bg-cereja/10 disabled:opacity-40"
            >
              {novo ? "Descartar" : "Excluir"}
            </button>
            <button
              onClick={salvar}
              disabled={bloqueado || salvando || (!alterado && !novo)}
              className="rounded-full bg-marinho px-6 py-2.5 text-sm font-bold text-creme transition-transform hover:scale-[1.03] disabled:opacity-40"
            >
              {salvando ? "Salvando..." : novo ? "Adicionar" : alterado ? "Salvar" : "Salvo"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-tinta-suave">
        {rotulo}
      </span>
      {children}
    </label>
  );
}

function Interruptor({
  ativo,
  onClick,
  corAtiva,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  corAtiva: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
        ativo ? corAtiva : "bg-creme text-tinta-suave ring-1 ring-creme-3"
      }`}
    >
      {children}
    </button>
  );
}
