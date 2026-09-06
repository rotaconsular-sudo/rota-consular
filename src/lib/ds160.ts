import { prisma } from "@/lib/prisma";
import { produtosLiberados } from "@/lib/acesso";
import { DS160_TODAS_CHAVES, type Ds160Dados } from "@/lib/ds160Form";

export const PRODUTO_DS160_COMPLETO_SLUG = "ds160-preenchido"; // R$97, revisão humana + envio oficial
export const PRODUTO_DS160_SELF_SLUG = "mapa-ds160"; // R$27,90, self-service

export type Ds160Tier = "completo" | "self" | null;

// "completo" tem prioridade se a pessoa tiver os dois produtos.
export async function tierDs160(userId: string): Promise<Ds160Tier> {
  const ids = await produtosLiberados(userId);
  if (ids.length === 0) return null;
  const produtos = await prisma.produto.findMany({
    where: { slug: { in: [PRODUTO_DS160_COMPLETO_SLUG, PRODUTO_DS160_SELF_SLUG] }, id: { in: ids } },
    select: { slug: true },
  });
  const slugs = produtos.map((p) => p.slug);
  if (slugs.includes(PRODUTO_DS160_COMPLETO_SLUG)) return "completo";
  if (slugs.includes(PRODUTO_DS160_SELF_SLUG)) return "self";
  return null;
}

// A pessoa pode entrar no /ds160 se tem acesso ativo a algum dos dois tiers.
export async function temAcessoDs160(userId: string): Promise<boolean> {
  return (await tierDs160(userId)) !== null;
}

// Formata um valor de resposta do DS-160 pra exibição legível (bool, array,
// vazio, etc.). Usado no admin e no resumo do tier self-service.
export function formatarValorDs160(valor: unknown): string {
  if (valor === true) return "Sim";
  if (valor === false) return "Não";
  if (valor === undefined || valor === null || valor === "") return "—";
  if (Array.isArray(valor)) {
    return valor
      .map((it) =>
        typeof it === "object" && it
          ? Object.values(it as Record<string, unknown>).join(" · ")
          : String(it),
      )
      .join("  |  ");
  }
  return String(valor);
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
