import Image from "next/image";
import Link from "next/link";
import { site, linkPedidoGeral } from "@/lib/site";

const secoes = [
  { href: "#cardapio", rotulo: "Cardápio" },
  { href: "#encomendas", rotulo: "Encomendas" },
  { href: "#sobre", rotulo: "Nossa história" },
];

export default function Cabecalho() {
  return (
    <header className="sticky top-0 z-40 border-b border-creme-3/70 bg-creme/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/fotos/logo.png"
            alt={site.nomeCompleto}
            width={112}
            height={112}
            className="h-11 w-11 rounded-full ring-1 ring-marinho/15 sm:h-12 sm:w-12"
            priority
          />
          <span className="hidden leading-tight sm:block">
            <span className="block font-script text-xl text-cafe">{site.nome}</span>
            <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-marinho">
              Café e Empório
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {secoes.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="text-sm font-semibold text-marinho transition-colors hover:text-cereja"
            >
              {s.rotulo}
            </a>
          ))}
        </nav>

        <a
          href={linkPedidoGeral()}
          target="_blank"
          rel="noreferrer"
          className="ml-auto flex items-center gap-2 rounded-full bg-marinho px-4 py-2.5 text-sm font-bold text-creme transition-transform hover:scale-[1.03] md:ml-0"
        >
          <IconeWhats className="h-4 w-4" />
          <span className="hidden sm:inline">Fazer pedido</span>
          <span className="sm:hidden">Pedir</span>
        </a>
      </div>
    </header>
  );
}

export function IconeWhats({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.21-8.24 8.21z" />
    </svg>
  );
}
