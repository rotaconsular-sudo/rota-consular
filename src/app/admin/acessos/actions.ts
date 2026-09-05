"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function urlComEmail(email: string) {
  return `/admin/acessos?email=${encodeURIComponent(email)}`;
}

export async function buscarUsuario(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  redirect(email ? urlComEmail(email) : "/admin/acessos");
}

export async function concederAcesso(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const produtoId = String(formData.get("produtoId") ?? "");
  const duracao = String(formData.get("duracao") ?? "produto"); // "produto" | "nunca"

  if (!EMAIL_RE.test(email)) redirect("/admin/acessos?erro=email");

  const produto = await prisma.produto.findUnique({ where: { id: produtoId } });
  if (!produto) redirect(urlComEmail(email) + "&erro=produto");

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  let expiraEm: Date | null = null;
  if (duracao === "produto" && produto.duracaoDias) {
    expiraEm = new Date(Date.now() + produto.duracaoDias * 24 * 60 * 60 * 1000);
  }

  await prisma.acesso.upsert({
    where: { userId_produtoId: { userId: user.id, produtoId: produto.id } },
    update: { origem: "MANUAL", revogadoEm: null, expiraEm, compraId: null },
    create: {
      userId: user.id,
      produtoId: produto.id,
      origem: "MANUAL",
      expiraEm,
    },
  });

  revalidatePath("/admin/acessos");
  redirect(urlComEmail(email) + "&ok=concedido");
}

export async function revogarAcesso(acessoId: string, email: string) {
  await requireAdmin();
  await prisma.acesso.update({
    where: { id: acessoId },
    data: { revogadoEm: new Date() },
  });
  revalidatePath("/admin/acessos");
  redirect(urlComEmail(email) + "&ok=revogado");
}

export async function reativarAcesso(acessoId: string, email: string) {
  await requireAdmin();
  await prisma.acesso.update({
    where: { id: acessoId },
    data: { revogadoEm: null },
  });
  revalidatePath("/admin/acessos");
  redirect(urlComEmail(email) + "&ok=reativado");
}
