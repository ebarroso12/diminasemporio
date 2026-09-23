"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Produto } from "@/lib/types";
import { CATEGORIAS } from "@/lib/types";
import { formatarPreco } from "@/lib/site";

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

export default function PainelAdmin({
  produtosIniciais,
  somenteLeitura,
}: {
  produtosIniciais: Produto[];
  somenteLeitura: boolean;
}) {
  const router = useRouter();
  const [produtos, setProdutos] = useState(produtosIniciais);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [criando, setCriando] = useState(false);

  function avisar(tipo: "ok" | "erro", texto: string) {
    setAviso({ tipo, texto });
    setTimeout(() => setAviso(null), 4000);
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
    setProdutos((atual) => atual.map((p) => (p.id === id ? corpo : p)));
    avisar("ok", "Alteração salva.");
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
    setProdutos((atual) => atual.filter((p) => p.id !== produto.id));
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
    setProdutos((atual) => [...atual, corpo].sort((a, b) => a.ordem - b.ordem));
    setCriando(false);
    avisar("ok", "Produto adicionado ao cardápio.");
    return true;
  }

  async function sair() {
    await fetch("/api/auth", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-center gap-4 border-b border-creme-3 pb-6">
        <Image src="/fotos/logo.png" alt="" width={100} height={100} className="h-12 w-12 rounded-full" />
        <div className="mr-auto">
          <h1 className="font-display text-2xl font-semibold text-marinho">Cardápio</h1>
          <p className="text-sm text-tinta-suave">
            {produtos.length} produtos · as alterações aparecem no site na hora
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
            O banco de dados ainda não está configurado, então o site está mostrando o cardápio
            inicial que veio no código e nada pode ser salvo aqui. Configure as variáveis
            <code className="mx-1 rounded bg-creme-3 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>,
            <code className="mx-1 rounded bg-creme-3 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> e
            <code className="mx-1 rounded bg-creme-3 px-1.5 py-0.5 text-xs">SUPABASE_SERVICE_ROLE_KEY</code>
            na Vercel e rode o <code className="rounded bg-creme-3 px-1.5 py-0.5 text-xs">scripts/schema.sql</code>.
          </p>
        </div>
      )}

      {aviso && (
        <p
          className={`sticky top-4 z-30 mt-6 rounded-full px-5 py-3 text-center text-sm font-semibold ${
            aviso.tipo === "ok" ? "bg-folha text-creme" : "bg-cereja text-creme"
          }`}
        >
          {aviso.texto}
        </p>
      )}

      <div className="mt-8 flex justify-end">
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

function EditorProduto({
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
    const { id: _, ...patch } = rascunho;
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
        {/* Foto */}
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

        {/* Campos */}
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
              {rascunho.disponivel ? "Em estoque" : "Esgotado"}
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
