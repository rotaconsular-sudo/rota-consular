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

// Compra aprovada na loja: o acesso já foi concedido, esse e-mail leva a
// pessoa direto pra área de membros (o link já loga, sem senha).
export async function sendAcessoLiberado(
  email: string,
  input: { loginUrl: string; produtos: string[] },
) {
  const apiKey = process.env.RESEND_API_KEY;
  const lista = input.produtos.map((p) => `<li>${p}</li>`).join("");
  const html = `<p>Seu pagamento foi confirmado e o acesso está liberado:</p><ul>${lista}</ul><p><a href="${input.loginUrl}">Ver meus materiais</a></p><p>Esse link entra na sua conta automaticamente (expira em 15 minutos). Depois, é só usar o e-mail em <strong>rotaconsular.com.br/entrar</strong>.</p>`;

  if (!apiKey) {
    console.log(`[dev] Acesso liberado para ${email}: ${input.loginUrl}`);
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "Rota Consular <acesso@enviar.rotaconsular.com.br>",
    to: email,
    subject: "Acesso liberado — Rota Consular",
    html,
  });
}

// Resultado da análise de perfil — leva a pessoa de volta pro resultado
// completo no site.
export async function sendAnalysisResult(
  email: string,
  input: { score: number; resumo: string; resultUrl: string },
) {
  const apiKey = process.env.RESEND_API_KEY;

  const html = `<p>Sua análise de perfil para o visto americano de turismo está pronta.</p><p><strong>${input.resumo}</strong></p><p>Quão preparado seu perfil parece: <strong>${input.score}/100</strong>. Isso não é uma previsão de aprovação — a decisão é sempre do oficial consular.</p><p><a href="${input.resultUrl}">Ver o resultado completo</a></p>`;

  if (!apiKey) {
    console.log(`[dev] Resultado da análise para ${email}: ${input.resultUrl}`);
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "Rota Consular <acesso@enviar.rotaconsular.com.br>",
    to: email,
    subject: "Sua análise de perfil está pronta",
    html,
  });
}
