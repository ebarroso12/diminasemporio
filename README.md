# Di Minas · Café e Empório

Site de vendas com cardápio, pedido pelo WhatsApp e painel administrativo.

- **Produção:** https://diemporio.vercel.app
- **Painel:** https://diemporio.vercel.app/admin
- **Instagram:** [@diminas.cafe.e.emporio](https://www.instagram.com/diminas.cafe.e.emporio/)
- **Pedidos:** (16) 99226-2382 · entrega em Franca/SP, taxa fixa de R$ 12

## Stack

Next.js 16 (App Router) · Tailwind v4 · Supabase (Postgres, Auth e Storage) · Vercel.

O Supabase entrou pela integração do Marketplace da Vercel, então as variáveis
de ambiente são injetadas no projeto automaticamente. Para trabalhar local:

```bash
vercel env pull        # grava tudo em .env.local
npm install
npm run dev
```

## Como o cardápio funciona

Os produtos vivem na tabela `public.produtos`. O site lê com a chave anônima
(RLS libera só o `select`) e **toda escrita passa pelas rotas de API**, que usam
a service role depois de conferir quem está pedindo.

Se o Supabase não estiver configurado, o site **não quebra**: cai no catálogo de
`lib/seed.ts` e o painel entra em modo somente leitura, avisando na tela. Isso
mantém o site no ar mesmo antes de o banco existir.

`lib/seed.ts` é a fonte da carga inicial. Para regerar e aplicar o schema:

```bash
node scripts/gerar-schema.mjs                                   # gera scripts/schema.sql
node --env-file=.env.local scripts/aplicar-schema.mjs           # aplica produtos
node --env-file=.env.local scripts/aplicar-schema.mjs schema-auth.sql
```

O `insert` da carga inicial só roda com a tabela vazia — rodar de novo não
duplica nem sobrescreve o que a loja já editou.

## Quem pode administrar

**Estar autenticado não dá acesso ao painel.** O cadastro público do Supabase
Auth vem aberto por padrão e a chave anônima vai no bundle do navegador, então
qualquer pessoa consegue criar conta. Por isso existe `public.administradores`:
só quem tem linha nela entra, e a conferência é feita no servidor com a service
role (`lib/admin.ts`).

Quem já é administrador libera outros pela aba **Usuários**. Ninguém consegue
remover o próprio acesso nem deixar o site sem nenhum administrador.

Vale endurecer mais um nível desligando o cadastro público no painel do
Supabase (Authentication → Sign In / Providers → desmarcar *Allow new users to
sign up*). A tabela já protege sem isso, mas a porta fechada é melhor.

## Senhas

- **Trocar senha:** aba *Minha conta*. Pede a senha atual antes de aceitar a nova.
- **Esqueceu a senha:** link na tela de login. O Supabase envia um e-mail com
  link temporário, que abre `/admin/redefinir`. O SMTP padrão do Supabase tem
  limite baixo de envios e às vezes cai no spam; para volume maior, configure um
  SMTP próprio no painel do Supabase.

## Fotos

As tratadas ficam em `public/fotos`. `scripts/imagens.js` documenta como foram
geradas a partir do material original (recorte circular do logo, recortes de
produto, montagem dos combos). Fotos enviadas pelo painel vão para o bucket
`produtos` do Supabase Storage.

## Testes

```bash
npm run build
node scripts/testar-painel.mjs                            # contra localhost
node scripts/testar-painel.mjs https://diemporio.vercel.app
```

O teste dirige um Chrome de verdade: login, olho da senha, edição de preço
(conferindo que o valor novo aparece na API pública), aba de usuários e recusa
de senha atual errada. Ele **altera um preço e devolve o original** — sabendo
disso antes de rodar contra produção.
