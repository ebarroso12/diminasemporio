export const site = {
  nome: "Di Minas",
  nomeCompleto: "Di Minas · Café e Empório",
  tagline: "Um cantinho pra desacelerar",
  descricao:
    "Pão de queijo recheado gigante, doce de leite gourmet e congelados artesanais, feitos com queijo curado da Serra da Canastra e entregues em qualquer bairro.",
  whatsapp: {
    numero: "5516992262382",
    exibicao: "(16) 99226-2382",
  },
  instagram: {
    usuario: "@diminas.cafe.e.emporio",
    url: "https://www.instagram.com/diminas.cafe.e.emporio/",
  },
  entrega: {
    taxa: 12,
    texto: "Taxa fixa de R$ 12,00 para qualquer bairro",
  },
  comoPedir: [
    { titulo: "Escolha os itens", texto: "Monte seu pedido com a quantidade de cada produto." },
    { titulo: "Diga seu nome", texto: "Precisamos dele para separar e identificar a entrega." },
    { titulo: "Envie o endereço", texto: "Endereço completo, com número e ponto de referência." },
  ],
  versiculo: {
    texto:
      "Para que todos vejam, e saibam, e considerem, e entendam que a mão do Senhor fez isso.",
    referencia: "Isaías 41:20",
  },
} as const;

export function formatarPreco(preco: number | null) {
  if (preco === null || preco === undefined) return "Sob consulta";
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const RODAPE_PEDIDO = "\n\nMeu nome: \nEndereço completo: ";

export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;
}

/** Mensagem genérica do botão flutuante e do cabeçalho. */
export function linkPedidoGeral() {
  return linkWhatsApp(
    `Olá! Vim pelo site do ${site.nome} e quero fazer um pedido.${RODAPE_PEDIDO}`
  );
}

/** Mensagem já preenchida com o item escolhido, no formato que a loja pede. */
export function linkPedidoProduto(nome: string, precoFormatado: string) {
  return linkWhatsApp(
    `Olá! Quero pedir pelo site:\n\n1x ${nome} — ${precoFormatado}${RODAPE_PEDIDO}`
  );
}

/** Para item esgotado: avisar quando voltar. */
export function linkAviseMe(nome: string) {
  return linkWhatsApp(
    `Olá! Vi no site que ${nome} está esgotado. Pode me avisar quando voltar?`
  );
}
