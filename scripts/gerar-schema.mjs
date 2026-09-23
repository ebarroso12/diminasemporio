/**
 * Gera scripts/schema.sql a partir de lib/seed.ts — assim o banco nasce
 * exatamente com o cardápio que o site mostra, sem transcrição manual.
 * Uso: node scripts/gerar-schema.mjs
 */
import { writeFileSync } from "node:fs";
import { produtosIniciais } from "../lib/seed.ts";

const texto = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const numero = (v) => (v === null || v === undefined ? "null" : String(v));

const linhas = produtosIniciais
  .map(
    (p) =>
      `  (${texto(p.nome)}, ${texto(p.descricao)}, ${numero(p.preco)}, ${texto(p.unidade)}, ` +
      `${texto(p.categoria)}, ${texto(p.foto_url)}, ${p.disponivel}, ${p.pronta_entrega}, ` +
      `${p.destaque}, ${p.ordem})`
  )
  .join(",\n");

const sql = `-- Di Minas · Café e Empório
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
${linhas}
) as carga(nome, descricao, preco, unidade, categoria, foto_url, disponivel, pronta_entrega, destaque, ordem)
where not exists (select 1 from public.produtos);
`;

writeFileSync(new URL("./schema.sql", import.meta.url), sql, "utf8");
console.log(`schema.sql gerado com ${produtosIniciais.length} produtos`);
