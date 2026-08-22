import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { generateToken, hashToken } from "@/lib/crypto";

function accessCookieName(applicationId: string) {
  return `access_${applicationId}`;
}

// Cria uma solicitação anônima (sem login) e planta o cookie de acesso
// escopado só a essa solicitação. Usado no início do funil gratuito.
export async function createAccessToken(applicationId: string) {
  const token = generateToken();
  const cookieStore = await cookies();
  cookieStore.set(accessCookieName(applicationId), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/solicitacoes/${applicationId}`,
    maxAge: 60 * 60 * 24 * 90, // 90 dias
  });
  return hashToken(token);
}

// Toda ação/rota que mexe numa Application deve reconfirmar quem tem acesso,
// mesmo que a tela já pareça garantir isso — Server Actions e Route
// Handlers são alcançáveis por POST/GET direto, não só pela UI.
//
// Duas formas de acesso:
// - Solicitação com dono (userId setado): exige sessão de usuário logado e
//   dono da solicitação, igual ao fluxo de login por magic link.
// - Solicitação anônima (userId nulo): exige o cookie de acesso plantado na
//   criação (ou replantado via a rota `/solicitacoes/[id]/acessar?token=`,
//   usada no link do e-mail — layouts não recebem searchParams, então o
//   token da URL é tratado ali, não aqui).
export async function requireApplicationAccess(applicationId: string) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });
  if (!application) notFound();

  if (application.userId) {
    const session = await getSession();
    if (!session || session.userId !== application.userId) notFound();
    return application;
  }

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(accessCookieName(applicationId))?.value;

  if (cookieToken && hashToken(cookieToken) === application.accessTokenHash) {
    return application;
  }

  notFound();
}

// Lê o token cru do cookie já plantado nesse navegador (não o hash) — usado
// só pra montar o link de retorno no e-mail de resultado, reaproveitando o
// mesmo token que o navegador atual já usa pra acessar a solicitação
// anônima. Nunca precisamos "desidratar" um hash: o token cru nunca sai do
// cookie do dono original, então mandamos ele de volta pro próprio e-mail
// dele.
export async function getAccessCookieValue(applicationId: string) {
  const cookieStore = await cookies();
  return cookieStore.get(accessCookieName(applicationId))?.value;
}

// Usado só pela rota `/solicitacoes/[id]/acessar` (link do e-mail de
// resultado): confere o token da URL contra o hash salvo e planta o cookie
// pro navegador atual, sem exigir login.
export async function grantAccessFromToken(applicationId: string, token: string) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });
  if (!application || !application.accessTokenHash) return false;
  if (hashToken(token) !== application.accessTokenHash) return false;

  const cookieStore = await cookies();
  cookieStore.set(accessCookieName(applicationId), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/solicitacoes/${applicationId}`,
    maxAge: 60 * 60 * 24 * 90,
  });
  return true;
}
