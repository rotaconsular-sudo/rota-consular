# HANDOFF — onde paramos

> Para a IA que abrir este projeto em outro PC: **leia este arquivo + `PROJECT.md`**
> (o log completo da sessão está no fim do `PROJECT.md`, seção
> "Loja de produtos + área de membros"). Depois pergunte ao operador em qual
> ponto quer continuar.

Última atualização: **2026-09-06**.

---

## O que é o projeto

App Next.js (App Router) + Prisma + Postgres (Prisma Postgres, instância única —
o banco de dev é o mesmo de produção), deploy automático Git→Vercel em
`rotaconsular.com.br`. Tem: funil de **análise de perfil grátis** para visto
americano de turismo (questionário → resultado com IA), **loja de produtos +
área de membros**, e `/blog` em Markdown.

**O site ainda NÃO foi lançado** — está em fase de teste pesado antes de abrir.

### DS-160 preenchido pra você (06/09/2026)
Novo produto `ds160-preenchido` (R$97) + fluxo dentro do Rota Consular, **sem
ligação** com `flow-vistoamericano`/`automacao_vistos`.
- `/ds160` (rota; subdomínio `ds160.rotaconsular.com.br` pendente): página
  explicativa → confirma CPF → `/ds160/formulario` com as 118 perguntas do
  DS-160 em português (`src/lib/ds160Form.ts`, 12 seções, condicionais + listas,
  rascunho auto-save). Enviar trava (status ENVIADO) e avisa a equipe.
- `/admin/ds160`: lista + detalhe (todos os campos) + "Baixar JSON" (idêntico
  ao `dados_cliente.json` da robô, 118 chaves) + campo "Número do DS-160" →
  status ENTREGUE + e-mail pro cliente.
- Model `SolicitacaoDs160` (migration `20260906174116_ds160_preenchido`).
- **`src/lib/ds160Form.ts` é uma 1ª versão** montada a partir do
  `dados_cliente.json` — as `key`s já batem com a robô; labels/opções/condicionais
  a refinar quando chegar o JSON do formulário oficial do outro projeto.
- `mapa-ds160` (R$27,90) ficou intocado — decidir depois se é o mesmo produto.

### Mudanças de 06/09/2026
- **Removido o upload de documentos** (era opcional na análise). `model Document`,
  `enum DocumentType`, tela `/solicitacoes/[id]/documentos` e o passo do wizard
  não existem mais. A análise é só o questionário.
- **Removido o paywall** ("checklist completo R$47"). `model Payment`,
  `enum PaymentStatus`, `createCheckoutPreference`, `UnlockChecklistButton` e o
  webhook `/api/mercadopago/webhook` foram apagados. O resultado da análise é
  gratuito e completo. Migration `20260906151928_remove_documentos_e_paywall`
  dropa as tabelas Document e Payment.
- **Análise de perfil reescrita**: quiz de ~22 perguntas (`src/lib/quizQuestions.ts`)
  e resultado em linguagem simples ("O que joga a seu favor" / "O que vale
  reforçar" com "O que fazer" / "Fique atento"). Novo shape em
  `src/lib/anthropic.ts` (`AnalysisOutput` = score/resumo/favoravel/reforcar/atencao),
  guardado nas 3 colunas de `AnalysisResult` sem migração.
- **LGPD**: `content/legal/politica-de-privacidade.md` (controlador ASG CRUZ
  AGENCIA DE VIAGENS E TURISMO LTDA), renderizada em `/politica-de-privacidade`
  (`src/lib/legal.ts`), com link no rodapé de todas as telas (`SiteFooter` +
  `MinimalFooter`). Ainda **pendente revisão jurídica**.
- **Banner de cookies próprio + Meta Pixel** (`src/components/CookieBanner.tsx`,
  `src/components/MetaPixel.tsx`, `src/lib/consent.ts`, `POST /api/consent`,
  `model ConsentLog`). Categorias necessários/estatística/marketing; registro
  sem PII no Postgres (guardar 18 meses — falta job de expurgo). O Meta Pixel
  (`NEXT_PUBLIC_META_PIXEL_ID` = 2040382606596802, já no Vercel) só carrega
  quando `hasConsent("marketing")`. Testado em produção. Só dispara PageView
  por enquanto — eventos de funil (Lead/CompleteRegistration/Purchase) e a
  Conversions API ficam pra depois.

### Mudanças de 10/09/2026 — redesign do blog
- **`/blog` e `/blog/[slug]` e `/blog/tag/[tag]`** repaginados no sistema das
  páginas públicas (navy `ink` + accent, resto cinza, eyebrow com filete).
- Novo `src/components/blog/BlogHero.tsx` (eyebrow + título + busca + fileira de
  pills de tag) — **substituiu** `BlogSidebar.tsx` (removido); index e tag page
  agora usam o mesmo cabeçalho, sem coluna lateral.
- `/blog`: post mais recente vira **card "Em destaque"**; o resto em grid
  `sm:grid-cols-2` de `PostCard`. Busca com `?q=` some o destaque e mostra
  contagem de resultados.
- `PostCard`: agora com "N min de leitura", hover em accent, altura uniforme.
- `/blog/[slug]`: cabeçalho com back-link, eyebrow da tag principal, `excerpt`
  como lead, meta (data · leitura · tags); `prose` afinado (H2 menor, links
  accent); CTA agora é card **navy** (`bg-ink`); seção **"Continue lendo"** com 2
  posts relacionados por tag (`getRelatedPosts` em `src/lib/blog.ts`).
- `src/lib/blog.ts`: `BlogPostMeta.readingMinutes` (≈200 wpm) + `getRelatedPosts`.
- Verificado em `localhost:3001` (index, artigo, tag, busca) — tsc + eslint limpos.

### Mudanças de 10/09/2026 (2) — SEO do blog + 4 artigos novos
- **Frontmatter novo** (opcional): `metaTitle`, `metaDescription`, `updatedAt`,
  `faq: [{q, a}]`. `src/lib/blog.ts` lê e tipa (`BlogFaq`). `updatedAt` cai pra
  `publishedAt`; posts antigos seguem funcionando sem mudança.
- **`/blog/[slug]`**: JSON-LD (`Article` + `BreadcrumbList` + `FAQPage` quando há
  `faq`), `alternates.canonical`, `openGraph type:"article"` com
  `publishedTime`/`modifiedTime`. Seção visível **"Perguntas frequentes"** (o
  texto do schema tem que existir na página — bate 1:1 com o `faq`). Header
  mostra "atualizado em" quando `updatedAt != publishedAt`.
- **`src/app/sitemap.ts`**: agora inclui as páginas de tag e `/ds160`,
  `/ds160-preenchido`; `lastModified` dos posts usa `updatedAt`;
  `changeFrequency` em tudo. (`robots.ts` já existia, sem mudança.)
- **4 artigos** em `content/blog/` (todos com `faq` e links internos):
  `visto-americano-turismo-b1-b2-guia` (pilar), `quanto-custa-visto-americano`,
  `como-agendar-entrevista-visto-americano`, `visto-americano-negado-o-que-fazer`.
  Fatos sensíveis (taxa MRV US$185, Visa Integrity Fee, portal de agendamento)
  estão **hedgeados** com "confirme no site oficial" — revisar antes de campanha.
- **Pendente de SEO**: `og:image` por artigo (hoje sem imagem); revisar os fatos
  datados dos posts.

### Mudanças de 10/09/2026 (3) — +4 artigos do blog
- `content/blog/`: `quanto-tempo-demora-visto-americano` (prazos + CEAC),
  `renovacao-visto-americano-sem-entrevista` (interview waiver/dropbox),
  `perguntas-entrevista-visto-americano` (as perguntas + como responder),
  `visto-americano-autonomo-mei-freelancer` (comprovar vínculo sem CLT).
- Todos com `faq`, links internos cruzados e CTA pra `/analise-de-perfil` /
  `/assessoria-completa`. Blog agora tem **14 posts**.
- Fatos voláteis hedgeados: janela da isenção de entrevista (mudou em 2025),
  prazos de espera, status do CEAC. **Revisar contra fonte oficial** antes de
  usar em anúncio.
- Sem mudança de código — `sitemap.ts` já pega os novos posts e a tag
  `renovacao` sozinho. Verificado em `localhost:3001` (rotas 200, JSON-LD +
  FAQ ok, links internos 200).

### Mudanças de 10/09/2026 (4) — +3 artigos + pilar de documentos
- `content/blog/documentos-visto-turismo-eua.md` **reescrito como pilar**
  (mesmo slug/publishedAt; `updatedAt` novo): lista base + **checklist por
  perfil** (CLT, autônomo, aposentado, estudante, menor, empresário) + `faq`.
- 3 novos: `carta-do-empregador-visto-americano` (com modelo),
  `visto-americano-para-menores-criancas`,
  `visto-americano-para-aposentados`.
- Blog com **17 posts**. Todos os novos com `faq` e links internos cruzados.
  Hedge nos pontos que mudam (idade de dispensa de entrevista/CASV do menor).
- Verificado em `localhost:3001`: rotas 200, JSON-LD Article+Breadcrumb+FAQ,
  "atualizado em" no header do pilar, todos os links internos 200.

### Mudanças de 10/09/2026 (5) — Tier 1 de SEO (análise vs. Viaggi Vistos)
- **Autor institucional**: `BLOG_AUTHOR = "Rota Consular"` em `src/lib/blog.ts`.
  Byline visível "Por Rota Consular" + `Article.author` = Organization no
  JSON-LD. (Decisão do operador: autor é a empresa, não pessoa. Contrapeso de
  E-E-A-T pendente: página "Sobre" forte linkada no rodapé dos artigos.)
- **Caixa "Resposta rápida"** no topo de cada artigo: campo `respostaRapida`
  no frontmatter (`BlogPostMeta`), renderizado em box com borda accent antes do
  corpo. Adicionado aos **17 posts** (1–2 frases respondendo o título).
- **Data dupla** no header: "Publicado em X · atualizado em Y" (Y só quando
  difere). Os 5 posts originais que faltavam ganharam `updatedAt: 2026-09-10`.
- Script gerador: `scratchpad/add_resposta.py` (fora do repo).
- Verificado: 17 posts 200, box + byline + JSON-LD author OK, tsc + eslint limpos.
- **Próximo (Tier 2)**: "resposta rápida" ainda falta padronizar "Erros
  comuns" + tabela nos pilares; stream de notícias.

### Mudanças de 10/09/2026 (6) — cluster de passaporte (Tier 2)
- 6 artigos novos em `content/blog/` (tag nova `passaporte`):
  `como-tirar-passaporte-brasileiro` (pilar), `documentos-para-tirar-passaporte`,
  `quanto-custa-passaporte`, `prazo-e-validade-do-passaporte`,
  `passaporte-para-menor-de-idade`, `passaporte-e-visto-para-os-eua` (bridge
  que funila pro visto).
- Todos com `respostaRapida`, `faq`, links internos entre si + backlinks do
  guia B1/B2 e do artigo de menores pro cluster de passaporte.
- Fatos hedgeados: taxa GRU R$ 257,25, prazo ~6 dias úteis, faixas de
  validade do menor, regra dos 6 meses (EUA isenta o Brasil) — **conferir na
  Polícia Federal / gov.br** antes de campanha.
- Blog agora com **23 posts**. Verificado: 6 rotas 200, tag/passaporte 200,
  sitemap 42 URLs, JSON-LD + box + byline OK, tsc limpo.

### Mudanças de 10/09/2026 (7) — Tier 2: 4 artigos evergreen avulsos
- `foto-para-o-visto-americano` (5x5, fundo branco, sem óculos, formato digital),
  `custeador-do-visto-americano` (quem paga a viagem, campos do DS-160),
  `imposto-de-renda-no-visto-americano` (por que pesa, obrigado x isento),
  `i-94-tempo-de-permanencia-eua` (validade x permanência, overstay, CBP).
- Backlinks adicionados: guia B1/B2 → I-94; pilar de documentos → IR, foto,
  custeador, prazo/validade do passaporte.
- Blog com **27 posts**, sitemap 46 URLs. Verificado: rotas 200, JSON-LD +
  box + byline + links internos OK, tsc limpo.
- **Tier 2 evergreen concluído.**

### Mudanças de 10/09/2026 (8) — 2 explicadores de atualidades (tag `atualidades`)
- `caucao-visto-americano-visa-bond` (visa bond: mecanismo, valores, Brasil
  fora da lista) e `visa-integrity-fee-taxa-250` (taxa US$ 250 da lei de 2025,
  ainda pendente de regulamentação). Formato "explicador" (envelhece melhor
  que notícia), com nota "última revisão: setembro de 2026".
- **Fatos conferidos e aprovados pelo operador em 10/09** antes de publicar.
- Backlink de `quanto-custa` → explicador da Visa Integrity Fee.
- Blog com **29 posts**. Ainda em aberto: cadência de um stream de notícias
  recorrente (não definida).

### Mudanças de 10/09/2026 (9) — página /sobre + E-E-A-T do blog
- Nova `src/app/sobre/page.tsx` (`/sobre`): quem somos (ASG CRUZ, CNPJ),
  princípios, como o blog é produzido (fontes oficiais + revisão), o que
  oferecemos, "o que não somos", contato. JSON-LD `AboutPage` + `Organization`
  com `legalName`/`taxID`/`contactPoint`. Canonical `/sobre`. Usa
  SiteHeader/SiteFooter, design do site.
- `SiteFooter`: link **"Sobre"** ao lado de "Política de Privacidade" — aparece
  no rodapé de todas as páginas públicas (blog incluído).
- `/blog/[slug]`: byline "Por Rota Consular" agora **linka pra /sobre**, e
  `Article.author.url` no JSON-LD aponta pra `${SITE_URL}/sobre` (sinal de
  autoridade do autor).
- `sitemap.ts`: + `/sobre`. Verificado: /sobre 200, JSON-LD ok, byline e
  footer linkando, tsc + eslint limpos.

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
| `f797456` | checkout: confirma o e-mail antes de criar o pedido |
| `c7f1550` | `Conteudo.descricao` (Markdown) + `Produto.categoria`/`promoverCategoria` + bloco "Leve também" no `/minha-conta/[id]` + `/checkout?p=<slug>` (migration `20260905202855_loja_categorias_descricao`) |
| `a084c6e` | rascunho da Política de Privacidade (LGPD) em `content/legal/` |
| `5ff9929` | remove upload de documentos + paywall (migration `20260906151928`) |
| `cb28f65` | análise de perfil: 22 perguntas + resultado em linguagem simples |

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
