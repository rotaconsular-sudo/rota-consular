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

## Stack (proposta, a detalhar)

- Next.js + Prisma + Postgres (Vercel) — reaproveita o padrão já usado no
  ecossistema 2N Travel, mas em repositório e infraestrutura totalmente
  separados.
- Claude API para o motor de análise automática do wizard (apoio, não veredito).

## Próximos passos

- [ ] Confirmar pagamento e ativação do domínio rotaconsular.com.br
- [ ] Detalhar stack técnica e estrutura do projeto
- [ ] Desenhar o fluxo do wizard de triagem (perguntas, documentos, critérios de análise)
