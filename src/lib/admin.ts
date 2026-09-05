import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";

// Allowlist de e-mails com acesso ao /admin, via env ADMIN_EMAIL
// (separados por vírgula se for mais de um).
function adminEmails() {
  return (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

// Chame no topo de toda página/action do /admin. Route Handlers e Server
// Actions são alcançáveis por request direto — nunca confie só na UI.
//
// - Sem sessão: manda pro login.
// - Logado mas não-admin: 404 (não revela que o /admin existe).
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/entrar");

  if (!adminEmails().includes(session.user.email.toLowerCase())) notFound();

  return session.user;
}

export function isAdminEmail(email: string) {
  return adminEmails().includes(email.toLowerCase());
}
