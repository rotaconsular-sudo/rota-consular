"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { parseReaisToCents } from "@/lib/money";
import type { ProdutoTipo } from "@/generated/prisma/enums";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type FormState = { error?: string };

type ParsedProduto = {
  slug: string;
  nome: string;
  descricao: string | null;
  precoCents: number;
  tipo: ProdutoTipo;
  duracaoDias: number | null;
  ativo: boolean;
  ordem: number;
};

// Lança string legível em caso de dado inválido — quem chama transforma em
// FormState.error.
function parseForm(formData: FormData): ParsedProduto {
  const nome = String(formData.get("nome") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const precoCents = parseReaisToCents(String(formData.get("preco") ?? ""));
  const tipoRaw = String(formData.get("tipo") ?? "PRINCIPAL");
  const duracaoRaw = String(formData.get("duracaoDias") ?? "").trim();
  const ordemRaw = String(formData.get("ordem") ?? "0").trim();

  if (!nome) throw "O nome é obrigatório.";
  if (!SLUG_RE.test(slug))
    throw "Slug inválido — use só letras minúsculas, números e hífen (ex.: checklist-casv).";
  if (precoCents === null) throw "Preço inválido.";
  if (tipoRaw !== "PRINCIPAL" && tipoRaw !== "ORDER_BUMP") throw "Tipo inválido.";

  let duracaoDias: number | null = null;
  if (duracaoRaw) {
    const n = Number(duracaoRaw);
    if (!Number.isInteger(n) || n <= 0)
      throw "Dias de acesso: número inteiro positivo, ou vazio para não expirar.";
    duracaoDias = n;
  }

  const ordem = Number(ordemRaw);
  if (!Number.isInteger(ordem)) throw "Ordem deve ser um número inteiro.";

  return {
    slug,
    nome,
    descricao,
    precoCents,
    tipo: tipoRaw,
    duracaoDias,
    ativo: formData.get("ativo") === "on",
    ordem,
  };
}

// Cria (sem `id`) ou atualiza (com `id`). Assinatura de useActionState.
export async function salvarProduto(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim() || null;
  let data: ParsedProduto;
  try {
    data = parseForm(formData);
  } catch (e) {
    return { error: typeof e === "string" ? e : "Dados inválidos." };
  }

  const conflito = await prisma.produto.findFirst({
    where: { slug: data.slug, ...(id ? { NOT: { id } } : {}) },
  });
  if (conflito)
    return { error: `O slug "${data.slug}" já é usado por outro produto.` };

  if (id) {
    await prisma.produto.update({ where: { id }, data });
  } else {
    await prisma.produto.create({ data });
  }

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function alternarAtivo(id: string) {
  await requireAdmin();
  const produto = await prisma.produto.findUnique({ where: { id } });
  if (!produto) return;
  await prisma.produto.update({ where: { id }, data: { ativo: !produto.ativo } });
  revalidatePath("/admin/produtos");
}

export async function excluirProduto(
  id: string,
  _prev: FormState,
): Promise<FormState> {
  await requireAdmin();
  const itens = await prisma.compraItem.count({ where: { produtoId: id } });
  if (itens > 0)
    return {
      error: "Esse produto já tem compras associadas — desative em vez de excluir.",
    };
  await prisma.produto.delete({ where: { id } });
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}
