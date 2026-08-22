import { Resend } from "resend";

// Sem RESEND_API_KEY configurada, o link de acesso só é logado no console do
// servidor — dá pra testar o login localmente sem depender de e-mail de
// verdade. Domínio de envio é um subdomínio dedicado (enviar.rotaconsular.com.br)
// verificado no Resend, separado da hospedagem de e-mail existente na raiz do
// domínio (evita conflito de SPF/DKIM).
export async function sendMagicLink(email: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[dev] Link de acesso para ${email}: ${url}`);
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "Rota Consular <acesso@enviar.rotaconsular.com.br>",
    to: email,
    subject: "Seu link de acesso — Rota Consular",
    html: `<p>Clique para entrar na sua conta:</p><p><a href="${url}">${url}</a></p><p>Esse link expira em 15 minutos e só pode ser usado uma vez.</p>`,
  });
}

// Resultado da análise gratuita (score) — o checklist detalhado fica
// bloqueado até o pagamento, então esse e-mail não inclui os detalhes.
export async function sendAnalysisResult(
  email: string,
  input: { readinessScore: number; resultUrl: string },
) {
  const apiKey = process.env.RESEND_API_KEY;

  const html = `<p>Sua análise de prontidão para o visto americano de turismo está pronta.</p><p><strong>Nível de prontidão: ${input.readinessScore}/100</strong></p><p>Isso não é uma previsão de aprovação — é uma avaliação de quão completa está sua documentação e seus vínculos com o Brasil. A decisão final é sempre do consulado.</p><p><a href="${input.resultUrl}">Ver o resultado completo</a></p>`;

  if (!apiKey) {
    console.log(`[dev] Resultado da análise para ${email}: ${input.resultUrl}`);
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "Rota Consular <acesso@enviar.rotaconsular.com.br>",
    to: email,
    subject: `Sua análise está pronta — nível de prontidão ${input.readinessScore}/100`,
    html,
  });
}
