# HANDOFF — onde paramos

> Para a IA que abrir este projeto em outro PC: **leia este arquivo + `PROJECT.md`**
> (o log completo da sessão está no fim do `PROJECT.md`, seção
> "Loja de produtos + área de membros"). Depois pergunte ao operador em qual
> ponto quer continuar.

Última atualização: **2026-09-05**.

---

## O que é o projeto

App Next.js (App Router) + Prisma + Postgres (Prisma Postgres, instância única —
o banco de dev é o mesmo de produção), deploy automático Git→Vercel em
`rotaconsular.com.br`. Já existia: funil freemium de análise de visto americano
(score grátis → checklist pago R$47 via Mercado Pago) + `/blog` em Markdown.

**O site ainda NÃO foi lançado** — está em fase de teste pesado antes de abrir.

---

## Onde paramos (sessão 05/09/2026)

Construído do zero um **módulo de loja + área de membros**, separado do fluxo
freemium (`model Payment` ficou intocado). Tudo **commitado e no `main`**, e
**deployado em produção** (READY na Vercel).

Commits desta sessão (mais antigo → mais novo):

| commit | o que |
|---|---|
| `7852924` | schema: `Produto`, `Conteudo`, `ProdutoConteudo`, `Compra`, `CompraItem`, `Acesso` + migration `20260905181749_loja_area_membros` + `prisma/seed.mjs` |
| `f60b459` | `/admin` (allowlist `ADMIN_EMAIL`) → aba **Produtos** (CRUD) |
| `0910901` | aba **Conteúdos** (VIDEO/PDF/ROTEIRO/LINK) + **vínculos** produto↔conteúdo |
| `4a4ddf7` | **`/minha-conta`** (área de membros) + **Admin › Acessos** (concessão manual) |
| `760e114` | **`/checkout`** ligado ao Mercado Pago (multi-item) + webhook `/api/mercadopago/loja/webhook` |
| `c68da78` | log da sessão no `PROJECT.md` |

### Testado (dev, no navegador)
- Admin: criar/editar/excluir/ativar produto; criar/editar/excluir conteúdo dos 4
  tipos; troca de tipo mostra o campo certo; vincular conteúdo a produto; contagens.
- Admin › Acessos: buscar usuário por e-mail, conceder (origem MANUAL,
  `expiraEm` = duração do produto), revogar.
- `/minha-conta`: lista produtos com acesso + conteúdos; player YouTube
  (`youtube-nocookie`); roteiro Markdown renderizado; conteúdo sem acesso → 404;
  revogar acesso → área fica vazia.
- `/checkout`: renderiza catálogo do banco; `criarPedido` cria User + Compra
  PENDENTE + CompraItem com total certo.
- Webhook (lógica verificada por SQL): aprovado → concede Acesso por item;
  estorno → revoga os acessos daquela compra.

### NÃO testado ainda
- Download de PDF pela UI (`/minha-conta/[id]/arquivo`) — mesmo padrão do
  upload de documentos que já funciona.
- Round-trip real do Mercado Pago (redirect pro Checkout Pro + notificação do
  webhook) — precisa de `MERCADOPAGO_ACCESS_TOKEN` válido (teste ou produção).
- Botão "Reativar" em Acessos; opção "não expira" na concessão manual; tipo LINK.

---

## ⚠️ ÚNICO item aberto: ativar o pagamento da loja

O operador vai **usar outra conta do Mercado Pago pra receber** (a atual é a de
"National Tur", que ele quer trocar). Enquanto `MERCADOPAGO_ACCESS_TOKEN` não
for o da conta certa:

- Em **produção** já existe um token (da conta atual) → o botão do checkout
  fica ativo e completa pagamento **na conta errada**.
- Em **dev** não há token → botão desativado, `criarPedido` só registra a
  `Compra` como PENDENTE e redireciona pra `/checkout?erro=config`.

**Para ligar de verdade (nenhuma linha de código muda):**
1. Access Token de produção da conta nova → `MERCADOPAGO_ACCESS_TOKEN` no Vercel
   (Production). Local: adicionar em `.env.local`.
2. No painel dessa conta MP, cadastrar o webhook
   `https://rotaconsular.com.br/api/mercadopago/loja/webhook` (evento *payments*).
3. Redeploy.

(A URL do webhook também é passada em cada preferência via `notification_url`,
então funciona mesmo sem o cadastro no painel — mas cadastrar é o certo.)

---

## Rodar em outro PC

```bash
git pull --ff-only
npm install                     # roda `prisma generate` no postinstall
npx prisma migrate deploy       # aplica a migration da loja no banco
node prisma/seed.mjs            # popula os 4 produtos iniciais (idempotente)
npm run dev                     # http://localhost:3000  (ou --port 3001)
```

### Variáveis de ambiente (`.env.local`, NÃO vai pro git)

| var | pra quê | onde pegar |
|---|---|---|
| `DATABASE_URL` | Postgres | `npx vercel env pull` |
| `ANTHROPIC_API_KEY` | análise do funil freemium | conta Anthropic `rota` |
| `ADMIN_EMAIL` | allowlist do `/admin` | `rotaconsular@gmail.com` (já no Vercel Production) |
| `MERCADOPAGO_ACCESS_TOKEN` | checkout (loja e freemium) | conta MP — **pendente trocar** |
| `RESEND_API_KEY` | e-mail (magic link, "acesso liberado") | Resend; sem ela o link vai só pro console |
| `BLOB_READ_WRITE_TOKEN` | upload/download de PDF | Vercel Blob (`vercel env pull` traz) |

`npx vercel env pull .env.local` traz a maioria delas de uma vez.

### Login pra testar o admin
`/entrar` com `rotaconsular@gmail.com`. Sem `RESEND_API_KEY` o link de acesso
aparece no console do `next dev` (`[dev] Link de acesso para ...`).

---

## Mapa dos arquivos do módulo

```
prisma/schema.prisma                         # modelos Produto..Acesso (fim do arquivo)
prisma/seed.mjs                              # catálogo inicial (raw SQL, idempotente)

src/lib/admin.ts                             # requireAdmin() — allowlist ADMIN_EMAIL
src/lib/money.ts                             # formatBRL / parseReaisToCents
src/lib/youtube.ts                          # id + URL de embed nocookie
src/lib/acesso.ts                           # acessosAtivos / podeVerConteudo / minhaBiblioteca
src/lib/loja.ts                             # concederAcessosDaCompra / revogarAcessosDaCompra
src/lib/mercadopago.ts                      # + createLojaPreference / mpConfigurado
src/lib/mailer.ts                           # + sendAcessoLiberado

src/app/admin/layout.tsx                     # shell + abas
src/app/admin/produtos/*                     # lista, form, [id] (com VinculosForm), actions
src/app/admin/conteudos/*                    # lista, form, [id], actions (upload PDF -> Blob)
src/app/admin/acessos/*                      # busca por e-mail, conceder/revogar, actions

src/app/minha-conta/layout.tsx              # requireUser
src/app/minha-conta/page.tsx                # biblioteca do usuário
src/app/minha-conta/[conteudoId]/page.tsx   # visualizador por tipo
src/app/minha-conta/[conteudoId]/arquivo/route.ts   # download do PDF (revalida acesso)

src/app/checkout/page.tsx                    # server: lê catálogo do banco
src/app/checkout/CheckoutForm.tsx           # client: UI + order bumps
src/app/checkout/actions.ts                 # criarPedido()
src/app/checkout/obrigado/page.tsx          # pós-pagamento
src/app/api/mercadopago/loja/webhook/route.ts   # aprovado -> Acesso; estorno -> revoga

src/app/verificar/route.ts                   # + ?next= (só caminho interno)
```

### Regra do modelo de acesso
`Acesso` é a fonte da verdade ("essa pessoa pode ver esse produto?"). Um
registro por `(userId, produtoId)` (unique). Ativo = `revogadoEm` nulo **e**
(`expiraEm` nulo ou futuro). Recompra faz `upsert` e estende `expiraEm`.
Um `Conteudo` é visível se algum `Produto` que o libera está entre os produtos
com acesso ativo. Toda página/rota revalida no servidor antes de renderizar ou
servir arquivo — `blobUrl` nunca vai pro cliente.

---

## Próximos passos possíveis

- [ ] Trocar `MERCADOPAGO_ACCESS_TOKEN` pela conta nova + cadastrar webhook → testar compra real ponta a ponta.
- [ ] Testar download de PDF e os caminhos não cobertos (ver "NÃO testado").
- [ ] Migrar a copy de `/mapads160` (`src/lib/products.ts`, ainda em código) pro banco/admin.
- [ ] `/minha-conta`: adaptar o header do site pra mostrar "Minha conta" quando logado.
- [ ] (herdado) cobrança comercial na Anthropic antes de escalar tráfego; trocar "National Tur" no perfil do Mercado Pago; trocar os posts de exemplo do blog.
