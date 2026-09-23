-- Di Minas · Café e Empório
-- Rode este arquivo no SQL Editor do Supabase (uma vez).
-- Gerado por scripts/gerar-schema.mjs a partir de lib/seed.ts.

create extension if not exists "pgcrypto";

create table if not exists public.produtos (
  id             uuid primary key default gen_random_uuid(),
  nome           text        not null,
  descricao      text,
  preco          numeric(10,2),
  unidade        text,
  categoria      text        not null default 'recheados',
  foto_url       text,
  disponivel     boolean     not null default true,
  pronta_entrega boolean     not null default true,
  destaque       boolean     not null default false,
  ordem          integer     not null default 99,
  criado_em      timestamptz not null default now()
);

create index if not exists produtos_ordem_idx on public.produtos (ordem);

-- O site lê com a chave anônima; quem escreve é a service role, que ignora RLS.
-- Por isso existe apenas a policy de leitura: ninguém grava pelo navegador.
alter table public.produtos enable row level security;

-- RLS decide quais LINHAS aparecem; o GRANT decide se a tabela é alcançável
-- pela Data API. Sem ele o select devolve "permission denied" mesmo com policy.
grant usage on schema public to anon, authenticated;
grant select on public.produtos to anon, authenticated;

drop policy if exists "leitura publica do cardapio" on public.produtos;
create policy "leitura publica do cardapio"
  on public.produtos for select
  to anon, authenticated
  using (true);

-- Bucket público das fotos enviadas pelo painel.
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do update set public = true;

drop policy if exists "leitura publica das fotos" on storage.objects;
create policy "leitura publica das fotos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'produtos');

-- Carga inicial: só roda se a tabela ainda estiver vazia.
insert into public.produtos
  (nome, descricao, preco, unidade, categoria, foto_url, disponivel, pronta_entrega, destaque, ordem)
select * from (values
  ('Frango Tradicional', 'Frango desfiado no tempero da casa, Catupiry e vinagrete fresco.', 25.9, 'unidade', 'recheados', '/fotos/pao-de-queijo-colagem.jpeg', true, true, false, 1),
  ('Frango Tudo', 'Frango desfiado, Catupiry, vinagrete, milho, azeitona, calabresa, bacon e muçarela. O mais pedido da casa.', 34.9, 'unidade', 'recheados', '/fotos/pao-de-queijo-recheado.jpeg', true, true, true, 2),
  ('Pernil Tradicional', 'Pernil suculento desfiado, Catupiry e vinagrete fresco.', 27.9, 'unidade', 'recheados', '/fotos/pao-de-queijo-recheado-3.jpeg', true, true, false, 3),
  ('Pernil Tudo', 'Pernil suculento desfiado, Catupiry, vinagrete, bacon, milho, azeitona, muçarela e calabresa.', 36.9, 'unidade', 'recheados', '/fotos/pao-de-queijo-recheado-2.jpeg', true, true, false, 4),
  ('Combo 1', 'Um pão de queijo Frango Tudo e um Guaraná Antarctica em lata, normal ou zero.', 39.9, 'combo', 'combos', '/fotos/combo-1.jpeg', true, true, false, 5),
  ('Combo 2', 'Um pão de queijo Pernil Tudo e um Guaraná Antarctica em lata, normal ou zero.', 41.9, 'combo', 'combos', '/fotos/combo-2.jpeg', true, true, false, 6),
  ('Combo Casal', 'Dois pães de queijo Frango Tudo e dois Guaraná Antarctica em lata, normal ou zero.', 79.9, 'combo', 'combos', '/fotos/combo-casal.jpeg', true, true, false, 7),
  ('Doce de Leite Tradicional', 'Cremoso e suave, no ponto de colher. Perfeito para acompanhar o cafezinho passado.', 39.9, 'pote de 450 g', 'doces', '/fotos/doce-de-leite.jpeg', true, true, true, 8),
  ('Doce de Leite Flavors', 'A base cremosa da casa com pedaços de frutas, castanhas e texturas especiais. Sabores: nozes, morango, coco, chocolate, café, damasco e ameixa — consulte os do dia.', 45.9, 'pote de 450 g', 'doces', '/fotos/produtos-mineiros.jpeg', true, true, false, 9),
  ('Pão de Queijo Premium Congelado', 'Tamanho coquetel, cerca de 40 g por unidade. Rende de 24 a 25 unidades do mesmo sabor da Canastra.', 45.9, 'pacote de 1 kg', 'congelados', '/fotos/pao-de-queijo-tradicional.jpeg', true, true, true, 10),
  ('Pão Caseiro Tradicional', 'Feito de forma artesanal, com aquele sabor de pão quentinho que lembra casa de vó.', 19.9, 'unidade', 'paes', '/fotos/paes-caseiros.jpeg', true, false, false, 11),
  ('Coca-Cola ou Coca-Cola Zero', 'Lata gelada.', 9, 'lata', 'bebidas', '/fotos/bebidas.jpeg', true, true, false, 12),
  ('Guaraná Antarctica ou Guaraná Zero', 'Lata gelada.', 8.5, 'lata', 'bebidas', null, true, true, false, 13),
  ('Água com Gás Cristal', null, 5, 'garrafa', 'bebidas', null, true, true, false, 14),
  ('Milho', null, 2, 'porção', 'adicionais', null, true, true, false, 15),
  ('Azeitona', null, 2, 'porção', 'adicionais', null, true, true, false, 16),
  ('Muçarela', null, 2, 'porção', 'adicionais', null, true, true, false, 17),
  ('Calabresa', null, 3, 'porção', 'adicionais', null, true, true, false, 18),
  ('Bacon', null, 4.5, 'porção', 'adicionais', null, true, true, false, 19),
  ('Catupiry extra', null, 4, 'porção', 'adicionais', null, true, true, false, 20)
) as carga(nome, descricao, preco, unidade, categoria, foto_url, disponivel, pronta_entrega, destaque, ordem)
where not exists (select 1 from public.produtos);
