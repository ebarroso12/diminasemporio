import Image from "next/image";
import type { Produto } from "@/lib/types";
import { formatarPreco, linkPedidoProduto, linkAviseMe } from "@/lib/site";
import { IconeWhats } from "./Cabecalho";

export default function CartaoProduto({ produto }: { produto: Produto }) {
  const preco = formatarPreco(produto.preco);
  const esgotado = !produto.disponivel;

  return (
    <article className="sombra-cartao group flex flex-col overflow-hidden rounded-suave bg-creme-2 ring-1 ring-creme-3">
      <div className="relative aspect-[4/3] overflow-hidden bg-creme-3">
        {produto.foto_url ? (
          <Image
            src={produto.foto_url}
            alt={produto.nome}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              esgotado ? "grayscale" : ""
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center font-script text-4xl text-cafe-claro/50">
            Di Minas
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {esgotado ? (
            <Etiqueta cor="esgotado">Esgotado</Etiqueta>
          ) : produto.pronta_entrega ? (
            <Etiqueta cor="pronta">Pronta entrega</Etiqueta>
          ) : (
            <Etiqueta cor="encomenda">Sob encomenda</Etiqueta>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex-1">
          <h3 className="font-display text-lg leading-tight font-semibold text-marinho">
            {produto.nome}
          </h3>
          {produto.descricao && (
            <p className="mt-1.5 text-sm leading-relaxed text-tinta-suave">{produto.descricao}</p>
          )}
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-creme-3 pt-3">
          <div>
            <span className="block font-display text-xl font-semibold text-cafe">{preco}</span>
            {produto.unidade && (
              <span className="text-xs text-tinta-suave">por {produto.unidade}</span>
            )}
          </div>

          {esgotado ? (
            <a
              href={linkAviseMe(produto.nome)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-marinho/30 px-3.5 py-2 text-xs font-bold text-marinho transition-colors hover:bg-marinho hover:text-creme"
            >
              Avise-me
            </a>
          ) : (
            <a
              href={linkPedidoProduto(produto.nome, preco)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-marinho px-3.5 py-2 text-xs font-bold text-creme transition-transform hover:scale-105"
            >
              <IconeWhats className="h-3.5 w-3.5" />
              Pedir
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Etiqueta({ cor, children }: { cor: "pronta" | "encomenda" | "esgotado"; children: React.ReactNode }) {
  const estilos = {
    pronta: "bg-folha text-creme",
    encomenda: "bg-marinho text-creme",
    esgotado: "bg-tinta/85 text-creme",
  } as const;
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${estilos[cor]}`}
    >
      {children}
    </span>
  );
}
