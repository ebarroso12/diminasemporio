"use client";

import { useMemo, useState } from "react";
import type { Produto } from "@/lib/types";
import { CATEGORIAS } from "@/lib/types";
import { formatarPreco } from "@/lib/site";
import CartaoProduto from "./CartaoProduto";

export default function Cardapio({ produtos }: { produtos: Produto[] }) {
  const [filtro, setFiltro] = useState<string>("todos");

  const secoes = useMemo(
    () =>
      CATEGORIAS.map((cat) => ({
        ...cat,
        itens: produtos
          .filter((p) => p.categoria === cat.slug)
          .sort((a, b) => a.ordem - b.ordem),
      })).filter((s) => s.itens.length > 0),
    [produtos]
  );

  const visiveis = filtro === "todos" ? secoes : secoes.filter((s) => s.slug === filtro);

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <Chip ativo={filtro === "todos"} onClick={() => setFiltro("todos")}>
          Tudo
        </Chip>
        {secoes.map((s) => (
          <Chip key={s.slug} ativo={filtro === s.slug} onClick={() => setFiltro(s.slug)}>
            {s.nome}
          </Chip>
        ))}
      </div>

      <div className="space-y-16">
        {visiveis.map((secao) => (
          <section key={secao.slug} id={secao.slug} className="scroll-mt-24">
            <header className="mb-6 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-cereja">
                {secao.chamada}
              </span>
              <h3 className="mt-1 font-display text-2xl font-semibold text-marinho sm:text-3xl">
                {secao.nome}
              </h3>
              {secao.nota && (
                <p className="mt-2 text-sm leading-relaxed text-tinta-suave">{secao.nota}</p>
              )}
            </header>

            {secao.slug === "adicionais" ? (
              <ul className="flex flex-wrap gap-2.5">
                {secao.itens.map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-baseline gap-2 rounded-full bg-creme-2 px-4 py-2.5 text-sm ring-1 ring-creme-3 ${
                      item.disponivel ? "" : "opacity-45 line-through"
                    }`}
                  >
                    <span className="font-semibold text-marinho">{item.nome}</span>
                    <span className="font-display font-semibold text-cafe">
                      + {formatarPreco(item.preco)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {secao.itens.map((item) => (
                  <CartaoProduto key={item.id} produto={item} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        ativo
          ? "bg-marinho text-creme"
          : "bg-creme-2 text-marinho ring-1 ring-creme-3 hover:bg-creme-3"
      }`}
    >
      {children}
    </button>
  );
}
