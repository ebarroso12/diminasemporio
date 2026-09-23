-- Di Minas · controle de quem administra o site
--
-- Cadastro público no Supabase Auth está aberto por padrão: qualquer pessoa
-- com a chave anônima (que vai no bundle do navegador) consegue criar conta.
-- Por isso "estar autenticado" NÃO dá acesso ao painel — só entra quem tem
-- linha nesta tabela. A checagem é feita no servidor, com a service role.

create table if not exists public.administradores (
  id        uuid primary key references auth.users (id) on delete cascade,
  email     text        not null,
  nome      text,
  criado_em timestamptz not null default now()
);

-- Ninguém alcança esta tabela pela Data API: sem grant para anon/authenticated
-- e com RLS ligado, só a service role (que ignora RLS) enxerga.
alter table public.administradores enable row level security;

revoke all on public.administradores from anon, authenticated;

-- Primeiro administrador: o dono da loja.
insert into public.administradores (id, email, nome)
select u.id, u.email, 'Di Minas'
from auth.users u
where u.email = 'diminascafeemporio@gmail.com'
on conflict (id) do nothing;
