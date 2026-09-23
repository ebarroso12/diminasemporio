import { linkPedidoGeral, site } from "@/lib/site";
import { IconeWhats } from "./Cabecalho";

export default function BotaoWhatsApp() {
  return (
    <a
      href={linkPedidoGeral()}
      target="_blank"
      rel="noreferrer"
      aria-label={`Falar com o Di Minas no WhatsApp: ${site.whatsapp.exibicao}`}
      className="group sombra-flutuante fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] py-3.5 pl-4 pr-4 font-bold text-white transition-transform hover:scale-105 sm:pr-5"
    >
      <IconeWhats className="h-6 w-6" />
      <span className="hidden text-sm sm:inline">Pedir no WhatsApp</span>
    </a>
  );
}
