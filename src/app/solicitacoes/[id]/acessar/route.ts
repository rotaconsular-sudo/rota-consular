import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { grantAccessFromToken } from "@/lib/applications";

// Link do e-mail de resultado (solicitação anônima, sem login) — valida o
// token contra o hash salvo, planta o cookie de acesso nesse navegador, e
// manda pro resultado. Mesmo padrão do /verificar (magic link de login),
// mas escopado a uma única Application em vez de a conta inteira.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("token");

  if (!token || !(await grantAccessFromToken(id, token))) {
    redirect("/entrar?erro=link_invalido");
  }

  redirect(`/solicitacoes/${id}/resultado`);
}
