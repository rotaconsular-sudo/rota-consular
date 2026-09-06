"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { temAcessoDs160, getOrCreateSolicitacao } from "@/lib/ds160";
import { sendDs160Recebido } from "@/lib/mailer";
import type { Ds160Dados } from "@/lib/ds160Form";

async function contexto() {
  const user = await requireUser();
  if (!(await temAcessoDs160(user.id))) redirect("/ds160");
  const solicitacao = await getOrCreateSolicitacao(user.id);
  return { user, solicitacao };
}

export async function salvarCpf(formData: FormData) {
  const { solicitacao } = await contexto();
  const cpf = String(formData.get("cpf") ?? "").replace(/\D/g, "").slice(0, 11);
  if (cpf.length !== 11) redirect("/ds160?erro=cpf");
  await prisma.solicitacaoDs160.update({
    where: { id: solicitacao.id },
    data: { cpf },
  });
  revalidatePath("/ds160");
  redirect("/ds160/formulario");
}

// Auto-save do rascunho — chamado pelo formulário conforme a pessoa digita.
export async function salvarRascunho(dados: Ds160Dados) {
  const { solicitacao } = await contexto();
  if (solicitacao.status !== "RASCUNHO") return { ok: false, motivo: "travado" };
  await prisma.solicitacaoDs160.update({
    where: { id: solicitacao.id },
    data: { dados: dados as object },
  });
  return { ok: true };
}

// Trava o rascunho e avisa a equipe.
export async function enviarDs160() {
  const { user, solicitacao } = await contexto();
  if (solicitacao.status !== "RASCUNHO") redirect("/ds160");

  await prisma.solicitacaoDs160.update({
    where: { id: solicitacao.id },
    data: { status: "ENVIADO", enviadoEm: new Date() },
  });

  await sendDs160Recebido({
    solicitacaoId: solicitacao.id,
    email: user.email,
    nome: user.name,
  });

  revalidatePath("/ds160");
  redirect("/ds160?enviado=1");
}
