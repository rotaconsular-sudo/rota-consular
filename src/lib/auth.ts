import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

// Chame em toda página/layout que exige login. Redireciona pra /entrar se
// não houver sessão válida — nunca confie só no middleware para isso.
export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/entrar");
  return session.user;
}
