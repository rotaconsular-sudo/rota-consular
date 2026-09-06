import { Resend } from "resend";
import { SITE_URL } from "@/lib/url";

const FROM = "Rota Consular <acesso@enviar.rotaconsular.com.br>";

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

// Avisa a EQUIPE que chegou um rascunho de DS-160 pra processar.
export async function sendDs160Recebido(input: {
  solicitacaoId: string;
  email: string;
  nome: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const para = (process.env.ADMIN_EMAIL ?? "").split(",")[0]?.trim();
  const url = `${SITE_URL}/admin/ds160/${input.solicitacaoId}`;
  const html = `<p>Nova solicitação de DS-160 preenchida.</p><p><strong>${input.nome ?? "(sem nome)"}</strong> — ${input.email}</p><p><a href="${url}">Abrir no admin</a> (ver dados, baixar JSON, devolver o número).</p>`;

  if (!apiKey || !para) {
    console.log(`[dev] DS-160 recebido (${input.email}) → ${url}`);
    return;
  }
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to: para,
    subject: "Novo DS-160 pra preencher",
    html,
  });
}

// Devolve pro cliente o número do DS-160 que a equipe preencheu.
export async function sendDs160Numero(input: { email: string; numero: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const html = `<p>Seu DS-160 foi preenchido e enviado ao Consulado.</p><p><strong>Número do DS-160: ${input.numero}</strong></p><p>Guarde esse número — você vai precisar dele para agendar a entrevista no site do CASV/Consulado.</p><p><a href="${SITE_URL}/ds160">Ver na sua conta</a></p>`;

  if (!apiKey) {
    console.log(`[dev] Número do DS-160 para ${input.email}: ${input.numero}`);
    return;
  }
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to: input.email,
    subject: "Seu número do DS-160",
    html,
  });
}
