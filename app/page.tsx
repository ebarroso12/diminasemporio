import Image from "next/image";
import Cabecalho, { IconeWhats } from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import Cardapio from "@/components/Cardapio";
import CartaoProduto from "@/components/CartaoProduto";
import BotaoWhatsApp from "@/components/BotaoWhatsApp";
import { listarProdutos } from "@/lib/produtos";
import { site, linkPedidoGeral } from "@/lib/site";

export const dynamic = "force-dynamic";

const ingredientes = [
  { titulo: "Queijo da Canastra", texto: "O legítimo curado da serra, que dá o sabor da casa." },
  { titulo: "Ovos caipiras", texto: "Gema alaranjada, massa mais encorpada." },
  { titulo: "Polvilho premium", texto: "A base que deixa a casca fina e o miolo puxa-puxa." },
  { titulo: "Feito no dia", texto: "Sem conservante e sem estoque parado." },
];

export default async function Home() {
  const produtos = await listarProdutos();
  const destaques = produtos.filter((p) => p.destaque && p.disponivel).slice(0, 3);

  return (
    <>
      <Cabecalho />
      <BotaoWhatsApp />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-20">
            <div className="surge">
              <span className="inline-flex items-center gap-2 rounded-full bg-creme-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-marinho ring-1 ring-creme-3">
                Café e empório · sabor de Minas
              </span>

              <h1 className="mt-6 font-display text-4xl leading-[1.05] font-semibold text-marinho sm:text-5xl lg:text-6xl">
                O pão de queijo
                <span className="mt-1 block font-script text-4xl font-normal text-cafe sm:text-5xl lg:text-[3.4rem]">
                  que não cabe na mão
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-tinta-suave">
                Até 200 g de massa artesanal, recheada até a borda e feita com queijo curado da
                Serra da Canastra. Sai da cozinha no dia e chega quentinho na sua casa.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={linkPedidoGeral()}
                  target="_blank"
                  rel="noreferrer"
                  className="sombra-flutuante flex items-center gap-2.5 rounded-full bg-marinho px-7 py-4 font-bold text-creme transition-transform hover:scale-[1.03]"
                >
                  <IconeWhats className="h-5 w-5" />
                  Pedir no WhatsApp
                </a>
                <a
                  href="#cardapio"
                  className="rounded-full border-2 border-marinho/20 px-7 py-3.5 font-bold text-marinho transition-colors hover:border-marinho hover:bg-marinho hover:text-creme"
                >
                  Ver o cardápio
                </a>
              </div>

              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-creme-3 pt-6">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-tinta-suave">
                    Entrega
                  </dt>
                  <dd className="font-display text-lg font-semibold text-marinho">
                    R$ 12 para qualquer bairro
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-tinta-suave">
                    Massa
                  </dt>
                  <dd className="font-display text-lg font-semibold text-marinho">180 g a 200 g</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-tinta-suave">
                    Queijo
                  </dt>
                  <dd className="font-display text-lg font-semibold text-marinho">
                    Serra da Canastra
                  </dd>
                </div>
              </dl>
            </div>

            <div className="surge relative">
              <div className="sombra-cartao relative aspect-square overflow-hidden rounded-[2rem] ring-1 ring-creme-3">
                <Image
                  src="/fotos/pao-de-queijo-recheado.jpeg"
                  alt="Pão de queijo recheado gigante do Di Minas"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              <Image
                src="/fotos/logo.png"
                alt=""
                width={200}
                height={200}
                aria-hidden="true"
                className="sombra-cartao absolute -bottom-6 -left-6 hidden h-32 w-32 rounded-full bg-creme p-1.5 sm:block lg:-left-10 lg:h-36 lg:w-36"
              />
            </div>
          </div>
        </section>

        {/* INGREDIENTES */}
        <section className="border-y border-creme-3 bg-creme-2/60">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {ingredientes.map((item) => (
              <div key={item.titulo}>
                <h2 className="font-display text-base font-semibold text-marinho">{item.titulo}</h2>
                <p className="mt-1 text-sm leading-relaxed text-tinta-suave">{item.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DESTAQUES */}
        {destaques.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <header className="mb-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-cereja">
                Os mais pedidos
              </span>
              <h2 className="mt-1 font-display text-3xl font-semibold text-marinho sm:text-4xl">
                Comece por aqui
              </h2>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destaques.map((p) => (
                <CartaoProduto key={p.id} produto={p} />
              ))}
            </div>
          </section>
        )}

        {/* CARDÁPIO */}
        <section id="cardapio" className="scroll-mt-20 border-t border-creme-3 bg-creme-2/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <header className="mb-10 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-cereja">
                Cardápio completo
              </span>
              <h2 className="mt-1 font-display text-3xl font-semibold text-marinho sm:text-4xl">
                Tudo que sai da nossa cozinha
              </h2>
            </header>
            <Cardapio produtos={produtos} />
          </div>
        </section>

        {/* COMO PEDIR */}
        <section id="encomendas" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-cereja">
                Como pedir
              </span>
              <h2 className="mt-1 font-display text-3xl font-semibold text-marinho sm:text-4xl">
                Três informações e o pedido está feito
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-tinta-suave">
                O pedido é pelo WhatsApp, direto com a gente. Sem aplicativo e sem cadastro.
              </p>

              <ol className="mt-8 space-y-6">
                {site.comoPedir.map((passo, i) => (
                  <li key={passo.titulo} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-marinho font-display font-semibold text-creme">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-marinho">
                        {passo.titulo}
                      </h3>
                      <p className="text-sm leading-relaxed text-tinta-suave">{passo.texto}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <a
                href={linkPedidoGeral()}
                target="_blank"
                rel="noreferrer"
                className="sombra-flutuante mt-9 inline-flex items-center gap-2.5 rounded-full bg-marinho px-7 py-4 font-bold text-creme transition-transform hover:scale-[1.03]"
              >
                <IconeWhats className="h-5 w-5" />
                Começar meu pedido
              </a>
            </div>

            <div className="flex flex-col gap-6">
              <div className="sombra-cartao rounded-suave bg-marinho p-8 text-creme">
                <h3 className="font-display text-2xl font-semibold">{site.entrega.texto}</h3>
                <p className="mt-2 text-sm leading-relaxed text-creme/75">
                  Sem surpresa no fim do pedido: a taxa é a mesma para toda a cidade.
                </p>
              </div>

              <div className="sombra-cartao relative flex-1 overflow-hidden rounded-suave ring-1 ring-creme-3">
                <Image
                  src="/fotos/doce-de-leite.jpeg"
                  alt="Doce de leite mineiro em pote de vidro"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SOBRE */}
        <section id="sobre" className="scroll-mt-20 border-t border-creme-3 bg-creme-2/60">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16">
            <div className="grid grid-cols-2 gap-4">
              <div className="sombra-cartao relative aspect-[3/4] overflow-hidden rounded-suave ring-1 ring-creme-3">
                <Image
                  src="/fotos/produtora.jpeg"
                  alt="Produção artesanal do Di Minas"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="sombra-cartao relative mt-8 aspect-[3/4] overflow-hidden rounded-suave ring-1 ring-creme-3">
                <Image
                  src="/fotos/queijos-canastra.jpeg"
                  alt="Queijo curado da Serra da Canastra"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-cereja">
                Nossa história
              </span>
              <h2 className="mt-1 font-display text-3xl font-semibold text-marinho sm:text-4xl">
                {site.tagline}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-tinta-suave">
                O Di Minas nasceu de uma ideia simples: trazer para a mesa daqui o que Minas faz de
                melhor. Tudo é produzido de forma artesanal, em pequenas fornadas, com ingrediente
                escolhido um a um.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-tinta-suave">
                Por isso não trabalhamos com estoque parado. O que você recebe saiu da cozinha
                naquele dia — e é assim que a gente mantém o sabor de sempre.
              </p>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-block rounded-full border-2 border-marinho/20 px-6 py-3 font-bold text-marinho transition-colors hover:border-marinho hover:bg-marinho hover:text-creme"
              >
                Acompanhe no Instagram
              </a>
            </div>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  );
}
