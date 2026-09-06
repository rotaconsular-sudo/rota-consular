import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { montarJsonExport } from "@/lib/ds160";
import type { Ds160Dados } from "@/lib/ds160Form";

// Baixa o dados_cliente.json no formato que a robô Python lê.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;

  const s = await prisma.solicitacaoDs160.findUnique({ where: { id } });
  if (!s) notFound();

  // O CPF confirmado na entrada fica em s.cpf; a robô espera em dados.cpf.
  const dados = { ...((s.dados as Ds160Dados) ?? {}), cpf: s.cpf ?? "" };
  const json = montarJsonExport(dados);
  const corpo = JSON.stringify(json, null, 2);

  return new Response(corpo, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="dados_cliente.json"`,
    },
  });
}
