import Image from "next/image";
import Link from "next/link";
import { site, linkPedidoGeral } from "@/lib/site";
import { IconeWhats } from "./Cabecalho";

export default function Rodape() {
  return (
    <footer id="contato" className="mt-24 bg-marinho text-creme">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Image
              src="/fotos/logo.png"
              alt={site.nomeCompleto}
              width={120}
              height={120}
              className="h-20 w-20 rounded-full bg-creme/95 p-1"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-creme/75">
              {site.descricao}
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold">Fale com a gente</h3>
            <ul className="mt-4 space-y-3 text-sm text-creme/80">
              <li>
                <a
                  href={linkPedidoGeral()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <IconeWhats className="h-4 w-4" />
                  {site.whatsapp.exibicao}
                </a>
              </li>
              <li>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {site.instagram.usuario}
                </a>
              </li>
              <li>{site.entrega.texto}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold">O cardápio</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-creme/80">
              <li><a href="#recheados" className="transition-colors hover:text-white">Pães de queijo recheados</a></li>
              <li><a href="#combos" className="transition-colors hover:text-white">Combos</a></li>
              <li><a href="#doces" className="transition-colors hover:text-white">Doces de leite</a></li>
              <li><a href="#congelados" className="transition-colors hover:text-white">Para assar em casa</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-creme/15 pt-8">
          <blockquote className="mx-auto max-w-2xl text-center">
            <p className="font-script text-xl leading-relaxed text-creme/85 sm:text-2xl">
              {site.versiculo.texto}
            </p>
            <cite className="mt-2 block text-xs font-semibold uppercase not-italic tracking-[0.2em] text-creme/55">
              {site.versiculo.referencia}
            </cite>
          </blockquote>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 text-xs text-creme/55 sm:flex-row">
            <span>
              © {new Date().getFullYear()} {site.nomeCompleto}
            </span>
            <Link href="/admin" className="transition-colors hover:text-creme/90">
              Área do administrador
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
