import { Resend } from "resend";

// Sem RESEND_API_KEY configurada (ainda não decidimos o domínio de envio),
// o link de acesso só é logado no console do servidor — dá pra testar o
// login localmente sem depender de e-mail de verdade.
export async function sendMagicLink(email: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[dev] Link de acesso para ${email}: ${url}`);
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "Rota Consular <acesso@rotaconsular.com.br>",
    to: email,
    subject: "Seu link de acesso — Rota Consular",
    html: `<p>Clique para entrar na sua conta:</p><p><a href="${url}">${url}</a></p><p>Esse link expira em 15 minutos e só pode ser usado uma vez.</p>`,
  });
}
