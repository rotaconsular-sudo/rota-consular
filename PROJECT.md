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
- [ ] Escolher e provisionar o banco Postgres (dev local via `prisma dev`, produção
      a decidir: Neon / Vercel Postgres / Prisma Postgres — envolve criar conta,
      decisão do usuário)
- [ ] Rodar a primeira migration (`prisma migrate dev`) assim que houver DATABASE_URL
- [ ] Construir as telas do wizard (dashboard de solicitações + 5 etapas + revisão)
- [ ] Prototipar o prompt de análise automática (Claude API) com casos de teste reais
