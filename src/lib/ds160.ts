import { prisma } from "@/lib/prisma";
import { produtosLiberados } from "@/lib/acesso";
import { DS160_TODAS_CHAVES, type Ds160Dados } from "@/lib/ds160Form";

export const PRODUTO_DS160_SLUG = "ds160-preenchido";

// A pessoa pode entrar no /ds160 se tem acesso ativo ao produto.
export async function temAcessoDs160(userId: string): Promise<boolean> {
  const ids = await produtosLiberados(userId);
  if (ids.length === 0) return false;
  const prod = await prisma.produto.findFirst({
    where: { slug: PRODUTO_DS160_SLUG, id: { in: ids } },
    select: { id: true },
  });
  return Boolean(prod);
}

// Uma solicitação por usuário (a mais recente). Cria se não existir.
export async function getOrCreateSolicitacao(userId: string) {
  const existente = await prisma.solicitacaoDs160.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  if (existente) return existente;
  return prisma.solicitacaoDs160.create({ data: { userId } });
}

// Monta o JSON no formato que a robô lê (dados_cliente.json): todas as
// chaves presentes, booleanos como boolean, listas como array.
export function montarJsonExport(dados: Ds160Dados): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const chave of DS160_TODAS_CHAVES) {
    const v = dados[chave];
    if (v === undefined || v === null) {
      out[chave] = "";
    } else {
      out[chave] = v;
    }
  }
  // rede social "principal" (campos legados) = 1º item da lista
  const midias = dados["midias_sociais"];
  if (Array.isArray(midias) && midias[0] && typeof midias[0] === "object") {
    const m = midias[0] as Record<string, unknown>;
    out["midia_social_plataforma"] = m.plataforma ?? "";
    out["midia_social_handle"] = m.handle ?? "";
  }
  return out;
}
