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
