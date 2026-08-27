# Rota Consular

Projeto paralelo à 2N Travel — marca própria, sem vínculo de nome com a empresa.

## O que é

App para brasileiros que querem tirar o **visto americano de turismo (B1/B2)**.
Fluxo: wizard de perguntas → upload de documentos → análise automática (IA) →
checklist de prontidão / pontos de atenção → apoio no preenchimento do DS-160.

**Escopo fechado:** só visto de turismo. Não atende imigração, trabalho, estudo
ou outras categorias de visto.

**Posicionamento legal:** o produto *prepara e orienta*, nunca promete ou garante
aprovação de visto — isso é decisão exclusiva do consulado americano. Evitar
qualquer copy/nome que sugira garantia de aprovação ou vínculo com órgão oficial
(consulado, embaixada, governo).

## Marca

- **Nome:** Rota Consular
- **Domínio:** `rotaconsular.com.br` (registro solicitado no Registro.br, CPF,
  em processamento — aguardando confirmação de pagamento)
- **Domínio secundário (tráfego/SEO):** `vistoamericano.info` — usar como funil
  de captação (Google Ads/SEO), redirecionando para o domínio principal. Não usar
  como domínio de produto (`.info` tem baixa reputação de confiança no Brasil).
- **E-mail:** `rotaconsular@gmail.com`
- **Repositório:** https://github.com/rotaconsular-sudo/rota-consular

## Por que não "Vistta"

Nome já ocupado por múltiplos negócios no Brasil (clínica oftalmológica em
vistta.com/.com.br, engenharia, imobiliária, cosméticos) — risco de conflito de
marca e SEO inviável.

## Stack

- **Next.js (App Router)** — frontend + backend no mesmo projeto, deploy na Vercel.
- **Prisma + PostgreSQL** — banco relacional (Neon ou Vercel Postgres), mesmo
  padrão usado no ecossistema 2N Travel, mas infraestrutura própria e separada.
- **Claude API (Anthropic)** — motor de análise automática: lê as respostas do
  wizard + documentos enviados e gera o checklist de prontidão. Sempre como
  apoio à decisão do usuário, nunca como veredito de aprovação.
- **Armazenamento de documentos** — Vercel Blob (ou S3-compatível) para upload
  de RG, comprovantes, extratos — dados sensíveis, precisa de criptografia em
  repouso e política de retenção clara (LGPD).
- **Autenticação** — magic link por e-mail (sem senha) é suficiente pro público
  final; evita a empresa guardar senha de cliente.
- **E-mail transacional** — Resend, pra avisos de status/checklist pronto.

## Wizard de triagem (fluxo proposto)

1. **Dados pessoais** — nome, idade, estado civil, cidade/UF.
2. **Situação profissional e financeira** — vínculo empregatício, renda,
   tempo no emprego/negócio. É o principal fator de "vínculo com o Brasil"
   que o consulado avalia.
3. **Histórico de viagens** — já viajou internacionalmente? já teve visto
   americano? teve visto negado antes? (recusa anterior muda bastante a
   orientação).
4. **Motivo da viagem e vínculos nos EUA** — turismo, visita a família/amigos,
   convenção, etc. Tem parente morando nos EUA?
5. **Upload de documentos** — RG/CPF/passaporte, comprovante de renda, extrato
   bancário, comprovante de vínculo empregatício, itinerário (se já tiver).
6. **Análise automática (Claude API)** — cruza respostas + documentos e gera:
   - Nível de prontidão da documentação (não é "chance de aprovação")
   - Checklist do que falta ou está fraco
   - Alertas específicos (ex: recusa anterior, viagem muito próxima da data,
     vínculo financeiro fraco)
7. **Passo a passo final** — orientação pra preencher o DS-160, agendar no
   CASV/consulado e se preparar pra entrevista.

## Modelo de dados (rascunho)

- `User` — dados de login (magic link)
- `Application` — um "caso" de visto por usuário (pode refazer se for recusado)
- `Answer` — respostas do wizard, vinculadas à Application
- `Document` — arquivos enviados, vinculados à Application
- `AnalysisResult` — saída da IA: score, checklist, alertas — vinculado à Application

## Próximos passos

- [x] Detalhar stack técnica e estrutura do projeto
- [x] Desenhar o fluxo do wizard de triagem
- [x] Fazer o scaffold inicial do projeto Next.js (App Router, TS, Tailwind)
- [x] Modelar o schema Prisma (`User`, `Application`, `Answer`, `Document`, `AnalysisResult`)
- [ ] Confirmar pagamento e ativação do domínio rotaconsular.com.br
- [x] Provisionar o banco de produção: **Prisma Postgres**, região `us-east-1`
      (N. Virginia — mais próxima do Brasil entre as opções disponíveis, não há
      região em São Paulo ainda). Conta criada com `rotaconsular@gmail.com`.
      Conexão verificada de ponta a ponta.
- [x] Rodar a primeira migration (`prisma migrate dev --name init`)
- [x] Construir as telas do wizard (dashboard de solicitações + 5 etapas + revisão)
- [x] Login por magic link (sem senha) — sessão com estado no banco (`Session`,
      revogável), token do link é de uso único e expira em 15 min. Toda Server
      Action reconfirma dono da solicitação (`requireOwnApplication`), e uma
      solicitação de outro usuário retorna 404 em vez de vazar que ela existe.
      Testado com dois usuários diferentes no navegador. Envio de e-mail via
      Resend ainda não configurado — em dev, o link é só logado no console
      do servidor (ver `src/lib/mailer.ts`).
- [x] Pagamento e ativação do domínio `rotaconsular.com.br` confirmados —
      DNS em transição (delegação externa liberada ~20min depois da ativação)
- [x] Publicado na Vercel: **https://rota-consular.vercel.app** (conta
      `rota-consulado`/`rotaconsular-sudo`). Deploy feito via `vercel --prod`
      (CLI) porque a integração automática Git→Vercel não estava disparando
      deploy nos pushes — ainda precisa investigar/corrigir isso em
      Project Settings → Git pra voltar a deployar automático depois de cada
      push. Testado em produção: login por link mágico, banco de dados e
      navegação entre etapas funcionando.
- [x] Deploy automático Git→Vercel corrigido — reconectado via `vercel link` +
      `vercel git connect` (também foi necessário reconfigurar as credenciais
      Git locais: o push estava usando a conta GitHub errada,
      `vistosnationaltur-ship-it`, sem permissão neste repo; corrigido com
      `gh auth login` como `rotaconsular-sudo` + `gh auth setup-git`).
      Confirmado com push de teste: deploy disparou sozinho, sem `vercel --prod`
      manual.
- [x] Domínio `rotaconsular.com.br` apontado pro projeto na Vercel — DNS fica no
      Cloudflare (não delegação de nameserver), com um CNAME na raiz (`@` →
      `7e4c1ce103fcca64.vercel-dns-017.com.`, proxy desligado/"DNS only") no
      lugar do A record antigo que apontava pra hospedagem cPanel antiga. Os
      registros MX/e-mail (`mail.rotaconsular.com.br`) ficaram intactos, sem
      impacto. Certificado SSL precisou ser emitido manualmente
      (`vercel certs issue`) — não saiu sozinho depois da verificação do DNS.
      Confirmado em produção: `https://rotaconsular.com.br` responde 200,
      redireciona pra `/entrar`.
      SPF duplicado (`v=spf1 +ip4:187.33.241.37 +include:spf-c.mailbaby.net...`
      e `v=spf1 -all`) encontrado e corrigido durante a limpeza — só sobrou um
      registro SPF. `www.rotaconsular.com.br` também adicionado como domínio
      no projeto (CNAME próprio, cert emitido) — confirmado em produção
      (HTTP 307, igual ao domínio raiz).
- [x] Configurado `RESEND_API_KEY` e e-mail real via Resend — domínio de envio
      é um subdomínio dedicado, `enviar.rotaconsular.com.br` (verificado via
      Auto configure do Resend com Cloudflare), separado da raiz do domínio
      pra não conflitar com o SPF/DKIM da hospedagem cPanel existente.
      Remetente: `acesso@enviar.rotaconsular.com.br` (`src/lib/mailer.ts`).
      Chave salva como env var sensível na Vercel (Production). Testado ponta
      a ponta em produção: e-mail de link de acesso chegou na caixa de
      entrada (não foi pra spam).
- [x] Upload real de documentos — Vercel Blob, store privado
      (`rota-consular-documentos`, região `iad1`, `access: private`). Limite
      de 8MB por arquivo, `next.config.ts` com
      `serverActions.bodySizeLimit: "10mb"` (o padrão de 1MB estourava fácil
      com PDF/foto de extrato). Download só pelo dono da solicitação, via rota
      `src/app/solicitacoes/[id]/documentos/[docId]/route.ts` (reusa
      `requireOwnApplication`, extraído pra `src/lib/applications.ts`), que
      busca o blob privado com `@vercel/blob` `get()` e serve com
      `Content-Disposition: attachment`. Ao remover um documento, o blob
      correspondente também é apagado (`del()`), sem ficar órfão no storage.
      Testado ponta a ponta em produção: upload de PDF, listagem e download
      confirmados via navegador (uma solicitação de teste ficou na conta
      `rotaconsular@gmail.com`, mantida de propósito).
- [x] Motor de análise automática (Claude API, `claude-sonnet-5`) — lê as
      respostas do wizard + lista de documentos, devolve nível de prontidão
      (0-100), checklist com status (ok/atenção/faltando) e alertas, via
      resposta estruturada (tool use). Prompt deixa explícito que não é
      previsão de aprovação. **Testado ponta a ponta** com chave real (conta
      Anthropic própria em `rotaconsular@gmail.com`, separada da 55digital) —
      resultado qualitativamente bom, identificou pontos específicos (vínculo
      empregatício forte, documentação financeira/patrimonial faltando).
      Custo por análise: ~US$ 0,01–0,02 (preço promocional do Sonnet 5 até
      31/08/2026, depois sobe um pouco). ~18s de latência por análise.
- [x] **Funil freemium sem login + checkout Mercado Pago (R$47)** — antes
      disso, o app inteiro exigia login e era grátis/ilimitado, sem nenhuma
      cobrança em lugar nenhum.
      Fluxo novo: landing pública (`/`, sem sessão) captura e-mail + WhatsApp
      → cria uma `Application` anônima (`userId` nulo) → wizard de 4 etapas
      (documento continua opcional, não bloqueia mais a análise) → IA roda a
      análise só com as respostas → nível de prontidão (score) aparece
      grátis na tela e é mandado por e-mail → checklist detalhado + alertas
      ficam bloqueados até pagar.
      Acesso sem login: `Application.accessTokenHash` + cookie httpOnly
      escopado por rota (`src/lib/applications.ts`,
      `requireApplicationAccess`) — não usa Session/User enquanto anônima.
      Link do e-mail de resultado passa pela rota
      `/solicitacoes/[id]/acessar?token=` (mesmo padrão do `/verificar` de
      login) pra replantar o cookie em outro navegador/dispositivo.
      Pagamento: Mercado Pago Checkout Pro (`src/lib/mercadopago.ts`), preço
      fixo R$47 (`CHECKLIST_PRICE_CENTS` em `src/app/actions.ts`), conta
      Mercado Pago pessoal do usuário (não é a `rotaconsular@gmail.com`).
      Webhook em `/api/mercadopago/webhook` nunca confia no corpo da
      notificação — sempre rebusca o pagamento na API do Mercado Pago pelo
      id antes de marcar como aprovado. Quando aprovado: cria/reaproveita um
      `User` pelo e-mail, linka a `Application`, e manda um magic link de
      acesso.
      **Achado e corrigido durante o teste**: o checklist bloqueado
      inicialmente só borrava o texto via CSS (`blur`) — o comentário real
      continuava inteiro no HTML/snapshot de acessibilidade, dava pra ler
      sem pagar. Corrigido: quando não pago, o servidor nem manda o texto
      real pro navegador (Server Component só renderiza um placeholder fixo).
      Migration nova (`Application.userId` opcional, `email`/`whatsapp`/
      `accessTokenHash`, tabela `Payment`) e o `build` da Vercel agora roda
      `prisma migrate deploy` automaticamente antes do `next build` — não
      precisa mais rodar migration manual a cada deploy (a máquina local não
      tem acesso direto ao banco de produção, então isso também resolve esse
      gargalo).
      Testado ponta a ponta em produção via navegador: landing → wizard sem
      login → análise → score grátis com checklist bloqueado (confirmado sem
      vazamento) → botão de desbloqueio abre o Checkout Pro corretamente
      (Pix/cartão/boleto, item e preço certos, link de volta com token). Não
      foi completado um pagamento real — falta testar o caminho de
      pagamento aprovado → webhook → e-mail de confirmação ponta a ponta com
      dinheiro de verdade (ou em modo sandbox do Mercado Pago).
      **Pendências desta frente:**
      - [ ] WhatsApp automático (precisa nova aplicação Meta/número
            dedicado) — o campo já é capturado, só o envio que falta.
        - [ ] "Pedido de visto completo" (apoio guiado no preenchimento do
              DS-160) — próxima etapa depois de validar o checkout de R$47
              com pagamento de verdade.
      - [ ] Nome "National Tur" aparece como vendedor na tela do Mercado
            Pago (nome cadastrado na conta pessoal usada) — trocar pro nome
            da marca nas configurações do perfil de negócio, se fizer
            sentido.
      Sites de referência mostrados pro produto: boundless.com,
      simplecitizen.com (concorrentes americanos de assessoria de
      visto/imigração self-service + IA), ds160.io/agencies (SaaS
      white-label pra agências).
      **Bug de contraste achado pelo usuário e corrigido**: `globals.css`
      tinha uma regra `prefers-color-scheme: dark` que deixava o app inteiro
      (não só a landing nova) com texto quase ilegível em navegador/SO com
      tema escuro — rótulo/texto herdava cor clara do modo escuro em cima de
      cartões com fundo branco. O app nunca foi desenhado pra tema escuro,
      então a correção foi forçar `color-scheme: light` e remover a regra,
      em vez de redesenhar cada tela pra dark mode.
      Copy do que se ganha ao pagar foi deixada mais clara (card de
      desbloqueio na `/resultado` virou lista de bullets concreta, e o item
      do Mercado Pago ganhou `description`), depois de feedback de que
      "checklist" sozinho não deixava claro o que a pessoa recebia.

## Escada de ofertas (decisão: adiada, não construir ainda)

Foi discutida uma escada de 4 degraus pra substituir o funil atual de 2
degraus (grátis → R$47): grátis → **R$19,70** (diagnóstico mais profundo por
tipo de perfil: família, visto negado antes, parente nos EUA) → **R$197**
(DS-160 preenchido, reaproveitando o robô/form do projeto de automação de
DS-160 separado, da 2N Travel) → **R$497** (assessoria completa com
consultora humana, descontando o que já foi pago nos degraus anteriores).
Registro completo (com o que cada degrau inclui, dependências e perguntas em
aberto) está neste briefing:
**https://claude.ai/code/artifact/611772af-7d81-4ec2-b091-5c337749eaf1**

**Decisão tomada em 2026-08-22**: não construir a escada toda agora.
Motivo: nenhum pagamento real aconteceu ainda no funil atual — construir 2
camadas novas (que dependem de conteúdo por persona que não existe, e de um
processo humano pra R$497 que também não existe) antes de saber se o
primeiro degrau converte é resolver um problema não confirmado.
**Foco agora é aprimorar/validar o primeiro passo** (grátis → pago) com
tráfego real antes de expandir a escada.

**Próximos passos concretos (nessa ordem):**
- [ ] Testar um pagamento aprovado de verdade (ou em modo sandbox do
      Mercado Pago) ponta a ponta: webhook → conta criada → e-mail de
      confirmação — ainda não foi validado com dinheiro real.
- [ ] Configurar cobrança comercial na conta Anthropic `rota`
      (`rotaconsular@gmail.com`) antes de escalar tráfego — hoje roda sob
      avaliação/créditos, não plano comercial com SLA de rate limit.
- [ ] Trocar nome "National Tur" → "Rota Consular" (e a foto) no perfil de
      negócio do Mercado Pago.
- [ ] Decidir e colocar tráfego de verdade no funil atual (anúncio ou
      orgânico) pra ter dado real de conversão antes de mexer em preço ou
      construir os próximos degraus.
- [ ] Só depois disso: revisitar a escada de ofertas (R$19,70 / R$197 /
      R$497) com dado real na mão.

## Sessão 2026-08-25/26 — reestruturação de páginas e incidente de deploy

- [x] **Blog em `/blog`** — posts em Markdown puro (`content/blog/*.md`), sem
      CMS/banco. 6 artigos iniciais sobre visto americano/DS-160. Páginas de
      listagem, post individual e filtro por tag, com busca/paginação.
- [x] **Home dividida em institucional + funil** — `/` virou página
      institucional (hero, diferenciais, "o que oferecemos", últimos posts do
      blog), sem depoimentos/números fictícios (ainda não há prova social
      real). O funil de venda antigo (oferta, checkout, análise grátis)
      mudou de endereço pra `/mapads160`.
- [x] **`/analise-de-perfil` separada do `/mapads160`** — a análise gratuita
      de perfil (formulário e-mail + WhatsApp) tinha uma seção misturada
      dentro da página do DS-160; agora é uma página própria, com estrutura
      de dobra principal + "como funciona" (3 passos) + benefícios + bloco de
      autoridade + CTA final. Todos os links que apontavam pra
      `/mapads160#analise-gratis` foram atualizados.
- [x] **`/mapads160` reposicionado como serviço completo** — antes o produto
      era um guia/PDF autoguiado; a operação real é: cliente preenche
      formulário próprio em português → equipe faz revisão humana → equipe
      submete oficialmente no site do Consulado → cliente recebe código de
      confirmação + PDF oficial. Título do produto (`lib/products.ts`)
      virou "DS-160 Sem Erros"; textos, features, FAQ e a faixa de oferta do
      topo (removida a promessa de "24hs") foram todos revisados pra não
      contradizer esse modelo. Prazo de entrega comunicado no FAQ: 7 a 10
      dias úteis (framed como "Auditoria Humana Especializada", não demora).
- [x] **Enquadramento institucional pro suporte via WhatsApp** — decisão:
      nunca chamar o contato pós-venda de "suporte"/"tirar dúvida" (abre
      brecha pra virar consultoria de graça por áudio). Linguagem oficial:
      "Controle de Qualidade" / "Notificação de Divergência" / "Auditoria
      Humana Especializada". FAQ deixa explícito que o serviço cobre 1
      alerta pontual de divergência, sem consultoria de perfil, análise de
      vínculos ou simulação de entrevista.
- [x] **Nova página `/assessoria-completa`** — venda da assessoria humana
      completa (documentação + treinamento pra entrevista + atendimento
      direto no WhatsApp + bônus "Kit Passaporte Carimbado" pra quem vai a
      Orlando). Sem preço na página — os 2 CTAs abrem WhatsApp direto
      (conectado ao Chatwoot, conforme combinado). Link de upsell adicionado
      em `/mapads160` antes do FAQ.
      **Pendência:** o número de WhatsApp nos botões (`WHATSAPP_LINK` em
      `src/app/assessoria-completa/page.tsx`) é um **placeholder**
      (`5500000000000`, marcado com `// TODO`) — falta o número real
      conectado ao Chatwoot antes de divulgar a página de verdade.
- [x] **Incidente de deploy (commit `5fd2b73`) e correção** — build falhou
      com `Error: P1001: Can't reach database server at db.prisma.io:5432`
      durante `prisma migrate deploy`. Diagnosticado via GitHub Commit
      Status API (`gh api .../commits/<sha>/status`) — não tínhamos login do
      Vercel CLI nesta máquina (`vercel login` via device-code falhou
      repetidamente, causa não identificada — possível proxy/firewall).
      Resolvido com um commit vazio pra forçar redeploy depois de confirmar
      o banco ativo no console do Prisma; build seguinte passou.
      **Nota importante pra não confundir de novo**: apareceu uma tela (na
      Vercel, não no Prisma) mostrando "1.7K operations · 119% of workspace
      usage", que parecia indicar cota estourada. Comparando com o
      dashboard oficial do Prisma (console.prisma.io), o uso real é **1.472
      de 200.000 operações incluídas (1%)** — a tela dos 119% media outra
      métrica (não elucidado qual exatamente; linguagem "no repository/no
      deploys" sugere ser algo do lado Vercel/Storage, não do Prisma). Ou
      seja: **cota de operações não é o problema**, o erro P1001 foi
      instabilidade pontual de conexão. Se o erro voltar a acontecer, não
      assumir que é cota — investigar como problema de conectividade
      pontual primeiro.

## Sessão 2026-08-27 — capa animada com a bandeira dos EUA na home

- [x] **Nova capa full-bleed em `/`** — o hero antigo (bloco branco centrado
      dentro de `InstitutionalHome`) virou uma capa imersiva de `92svh`,
      fundo `#070d1c`, com a bandeira dos EUA ondulando em tela cheia atrás
      da tipografia. Pedido veio com a referência
      `recent.design/i/7eq5d9w-koi-fish-portfolio-hero` (hero imersivo com
      visual orgânico animado atrás de tipografia grande) — a página do
      recent.design é gated e retorna erro pra acesso não-logado, então o
      padrão foi reproduzido pelo conceito, não pelo layout exato.
- [x] **`src/components/WavingFlag.tsx`** — a bandeira é desenhada por
      código num `<canvas>`: **sem imagem externa e sem biblioteca**.
      Textura na proporção oficial (13 listras, união 7/13 da altura ×
      0.76 da largura, 50 estrelas em 9 fileiras 6-5-6-5…), cores Old Glory
      (`#b22234` / `#ffffff` / `#3c3b6e`).
      A ondulação recorta a bandeira em fatias verticais de 2px e desloca
      cada uma por **duas senoides sobrepostas**, com amplitude crescendo do
      mastro pra ponta (`pow(p, 1.25)`) — é isso que prende o pano à
      esquerda e deixa solto à direita. O sombreado sai da **derivada da
      onda** (luz na crista, sombra no vale) e o pano encurta um pouco onde
      dobra (`squeeze`). Sem esses dois detalhes vira "imagem tremendo" em
      vez de tecido.
      Cuidados: pausa via `IntersectionObserver` fora da viewport e via
      `visibilitychange` com a aba em segundo plano; respeita
      `prefers-reduced-motion` (renderiza um quadro parado, sem rAF);
      redesenha no resize honrando `devicePixelRatio` (limitado a 2).
- [x] **Legibilidade** — a primeira versão usava um scrim radial que
      apagava a bandeira inteira. Trocado por um **gradiente diagonal**
      (`linear-gradient(100deg, …)`): escuro atrás do texto à esquerda,
      bandeira viva à direita. Mais duas camadas: vinheta vertical e um
      fade da base pro `slate-50` que funde a capa na seção clara seguinte.
- [x] **Ajustes achados na checagem visual** — removido o emoji 🇺🇸 do logo
      (redundante com a bandeira gigante atrás, e cai pra "us" em ambiente
      sem fonte de emoji); a nav espremia e quebrava em duas linhas no
      celular (problema que já existia antes), agora no mobile fica só
      logo + "Entrar" (`hidden sm:inline` nos 3 links secundários).
      Conferido em 1440×900 e 390×844, console sem erros, `tsc --noEmit` e
      `eslint` limpos.
      **Nota**: `npm run build` não foi rodado localmente de propósito — o
      script roda `prisma migrate deploy` antes do `next build` e esta
      máquina não alcança o banco de produção (falharia por conexão, não
      por código). A validação real é o build da Vercel.
- **Gotcha de push confirmado na prática**: a conta ativa do `gh` estava
  como `vistosnationaltur-ship-it` enquanto o remote deste repo é
  `rotaconsular-sudo`. Resolvido com
  `gh auth switch --hostname github.com --user rotaconsular-sudo` **antes**
  do push. Sempre checar `gh auth status` antes de subir neste projeto.

## Sessão 2026-08-27 (2) — sistema de design nas páginas públicas

Pedido: aplicar o padrão de cores da capa no resto do site, "sempre
minimalista". Duas decisões foram confirmadas com o usuário antes de mexer
em 21 páginas:
1. **Claro com âncoras escuras** (não dark total) — o corpo continua claro
   pra leitura e conversão; o navy entra como cor da marca em título, CTA,
   faixas e footer. Dark total foi descartado: exigiria reescrever
   formulário/wizard/checkout e o tema escuro já causou bug de contraste
   aqui antes (ver sessão 2026-08-22).
2. **Páginas públicas primeiro** — wizard/checkout/entrar ficam pra fase 2.

- [x] **Tokens em `globals.css`** — `--color-ink` (#070d1c, o mesmo navy do
      `WavingFlag`), `--color-ink-muted`, `--color-accent`,
      `--color-accent-soft`. Regra do sistema: **cor é informação, não
      decoração** — fora do navy e do azul de acento, só se usa cor quando
      ela significa algo. O `ink` é o que costura a capa ao resto do site.
- [x] **Paleta unificada (154 substituições)** — emerald/amber/red/zinc
      decorativos eliminados das públicas. Badges saturadas
      (`bg-emerald-100`, `bg-amber-100`, `bg-blue-100`…) viraram um padrão
      único: contorno hairline, caixa alta, `tracking-[0.14em]`.
- [x] **Elevação eliminada** — toda `shadow-*` de card saiu; hierarquia
      passa a ser borda + espaço. Sobra **uma só** no site: a do CTA da
      capa. O FAQ sinalizava "aberto" com `open:shadow-sm`, agora usa
      `open:border-ink/30`.
- [x] **Emojis removidos das públicas.** Atenção: a primeira varredura
      **não pegou 🇺🇸** — bandeiras são *regional indicators*
      (U+1F1E6–1F1FF), fora do range U+1F300–1FAFF. Se for varrer emoji de
      novo, incluir esse range. Na `/assessoria-completa` os 6 emojis-ícone
      viraram numeração mono (`01`, `02`…), coerente com o eyebrow da capa.
- [x] **Respiro e hierarquia** — seções `py-16` → `py-20 sm:py-28`; h2
      `text-2xl` → `text-3xl sm:text-4xl`. Cards de diferenciais da home de
      4 → 2 colunas (o texto era longo demais pra coluna estreita).

**Três problemas de UX achados no caminho (não eram de cor):**
- [x] **`/analise-de-perfil`, `/mapads160` e `/assessoria-completa` não
      tinham header nenhum** — abriam direto no h1, sem navegação. Novo
      `src/components/SiteHeader.tsx` com duas variantes: `dark`
      (sobreposta à capa) e `light` (barra sticky das internas). O blog
      tinha header próprio divergente (emoji + azul); passou a usar o mesmo.
- [x] **Disclaimer duplicado em 4 arquivos** → `src/components/SiteFooter.tsx`,
      que é também a âncora escura fechando a página no navy da capa.
- [x] **Links de navegação em 3 lugares** → `src/lib/nav.ts`, fonte única
      consumida por header e footer.

**Duas decisões de conteúdo tomadas junto (reversíveis):** "Assessoria
Completa" entrou na nav (a página não era alcançável pelo topo); e a badge
"ROTA CONSULAR" do hero do `/mapads160` foi removida, porque passou a
repetir o logo do header logo acima.

Verificado: `tsc` limpo, eslint sem erros (os 2 warnings de `IconMail`/
`IconDownload` no `mapads160` são pré-existentes), console do navegador
limpo, 7 rotas em 200, conferido em 1440×900 e 390×844. Diff: 12 arquivos,
+212/−246 — o site ficou com menos código do que tinha.

**Pendente — fase 2:** wizard (`/solicitacoes/**`), `/checkout`, `/entrar` e
a home logada ainda usam o padrão antigo (badge amber/emerald de status em
`STATUS_STYLE`, emoji no checkout).

## Sessão 2026-08-27 (3) — fase 2: sistema de cores na área logada

Conclui o trabalho da fase 1 levando o sistema pro wizard, `/checkout`,
`/entrar`, `/analise-perfil` (demo) e a home logada.

**A regra aqui é o oposto da fase 1.** Nas páginas públicas cor era
decoração e foi removida; na área logada cor **carrega significado**
(status da solicitação, erro de validação, desconto, etapa concluída).
Então em vez de remover, o trabalho foi reduzir a um vocabulário mínimo:
**uma cor por significado**, com tokens cujo nome diz o significado e não
o tom (`globals.css`):
- `--color-ok: #047857` — aprovado, positivo, economia real
- `--color-warn: #b45309` — atenção/alerta
- `--color-err: #b91c1c` — erro, item faltando
Superfícies saem por **opacidade** (`bg-ok/5`, `border-warn/30`), nunca por
um segundo tom da mesma família — é o que impede a paleta de voltar a
inflar.

- [x] **~85 substituições mecânicas** (mesmas regras da fase 1: sombras
      fora, `text-slate-900` → `text-ink`, CTA azul → navy).
- [x] **Estados semânticos tokenizados** — `STATUS_STYLE` do `/resultado`
      (ok/atenção/faltando), `scoreColor()`, `STATUS_STYLE` da home logada,
      caixas de alerta do `/resultado` e `/revisao`, sucesso do `/entrar`.
      Todos passaram de fundo saturado (`bg-emerald-100`) pro padrão
      `border-<token>/30 bg-<token>/5 text-<token>`.
- [x] **`WizardNav`: estado por forma, não por cor** — antes concluído era
      verde e ativo era azul. Agora concluído é `bg-ink` preenchido (com ✓)
      e ativo é **contornado** (`border-ink`, com o número). Distingue sem
      gastar duas cores, e o ✓ já dizia "concluído" sozinho.
- [x] **Uma escala de cinza só** — o wizard usava `zinc` enquanto o resto
      do site usava `slate` (6 usos). Unificado em `slate`.
- [x] **14 inputs do wizard padronizados** — eram `rounded-md
      border-zinc-300` **sem estado de foco visível**; agora usam o mesmo
      padrão dos campos públicos, com `focus:border-ink focus:ring-2
      focus:ring-ink/40`. Checkboxes ganharam `accent-ink`.
- [x] **`/checkout` (tela mais sensível, revisada uma a uma)** — o que era
      urgência decorativa virou neutro: caixa de order bump perdeu o âmbar
      (o tracejado já comunica "opcional"), botão "PEGAR OFERTA" virou navy,
      "N ofertas disponíveis" virou ênfase e não status. O que é informação
      real continuou verde: "3% OFF", "APROVAÇÃO IMEDIATA", "Ambiente
      seguro" e a linha de desconto. **O total voltou pra `ink`** — verde no
      vocabulário significa economia, e o total é valor a pagar, não
      economia. Emojis 🔒 e 💳 removidos.

**Não consegui verificar visualmente o wizard e a home logada**: exigem
sessão autenticada e o login é por magic link enviado por e-mail. O que foi
verificado nessas telas é estático (`tsc`, eslint, varredura por classe).
`/checkout`, `/entrar` e `/analise-perfil` **foram** conferidos no navegador.

**Achados durante a fase 2 (não corrigidos, decisão do usuário):**
- `/checkout` está com o botão COMPRAR desabilitado e a mensagem "Checkout
  em configuração — pagamento será habilitado em breve", e mostra o produto
  a **R$ 27,90**. O funil que está de fato em produção usa Mercado Pago
  Checkout Pro a **R$ 47** (`CHECKLIST_PRICE_CENTS`). Ou seja, essa página
  é um checkout próprio inacabado, paralelo ao fluxo real — vale decidir se
  vai ser terminado ou removido.
- `/analise-perfil` (sem o "de") é uma **página de demo** que renderiza o
  quiz e despeja o JSON cru das respostas. Está acessível publicamente em
  produção. Não removi por estar fora do escopo, mas provavelmente não
  deveria estar no ar.

Estado final do sistema, site inteiro: **zero** classe `blue-*`/`emerald-*`/
`amber-*`/`red-*`/`zinc-*` solta fora dos tokens, e **uma única** `shadow-*`
(o CTA da capa). Tokens em uso: `text-ink` 105, `bg-ink` 40, `border-ink`
37, `text-accent` 18, `text-ok` 8, `text-warn` 5, `text-err` 4.
