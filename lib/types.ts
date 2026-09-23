export type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number | null;
  unidade: string | null;
  categoria: string;
  foto_url: string | null;
  disponivel: boolean;
  pronta_entrega: boolean;
  destaque: boolean;
  ordem: number;
};

export type NovoProduto = Omit<Produto, "id">;

export const CATEGORIAS = [
  {
    slug: "recheados",
    nome: "Pães de queijo recheados",
    chamada: "Os gigantes",
    nota: "Modelados com 180 g a 200 g de massa crua, feitos com ovos caipiras, polvilho premium e o legítimo queijo curado da Serra da Canastra.",
  },
  {
    slug: "combos",
    nome: "Combos",
    chamada: "Lanche e bebida",
    nota: "O lanche completo com guaraná trincando de gelado, por um preço melhor do que separado.",
  },
  {
    slug: "doces",
    nome: "Doces de leite gourmet",
    chamada: "Da fazenda para a mesa",
    nota: "O legítimo doce de leite mineiro em embalagem de vidro exclusiva — bonito de servir e de presentear.",
  },
  {
    slug: "congelados",
    nome: "Para assar em casa",
    chamada: "Linha congelados",
    nota: "Leve o cheiro de Minas para a sua cozinha e asse na hora que quiser.",
  },
  {
    slug: "paes",
    nome: "Fornada de pão",
    chamada: "Sob encomenda",
    nota: "Pão artesanal feito no capricho, com aquele sabor de fornada de casa de vó.",
  },
  {
    slug: "bebidas",
    nome: "Bebidas geladas",
    chamada: "Para acompanhar",
    nota: null,
  },
  {
    slug: "adicionais",
    nome: "Adicionais",
    chamada: "Turbine seu lanche",
    nota: "Some ao recheio do seu pão de queijo na hora do pedido.",
  },
] as const;

export function categoria(slug: string) {
  return CATEGORIAS.find((c) => c.slug === slug);
}

export function nomeCategoria(slug: string) {
  return categoria(slug)?.nome ?? slug;
}
