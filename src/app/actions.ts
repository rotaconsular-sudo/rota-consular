"use server";

import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { destroySession } from "@/lib/session";
import { WIZARD_STEPS, getNextStep, type WizardStepSlug } from "@/lib/wizard";
import type { WizardStep, DocumentType } from "@/generated/prisma/enums";
import { runReadinessAnalysis } from "@/lib/anthropic";

// Server Actions são alcançáveis por POST direto, não só pela UI — por
// isso toda ação aqui reconfirma quem é o usuário e se ele é dono da
// solicitação, mesmo que a tela já pareça garantir isso.
async function requireOwnApplication(userId: string, applicationId: string) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application || application.userId !== userId) notFound();

  return application;
}

export async function createApplication() {
  const user = await requireUser();

  const application = await prisma.application.create({
    data: { userId: user.id },
  });

  redirect(`/solicitacoes/${application.id}/${WIZARD_STEPS[0].slug}`);
}

export async function saveAnswer(
  applicationId: string,
  stepSlug: WizardStepSlug,
  step: WizardStep,
  formData: FormData,
) {
  const user = await requireUser();
  await requireOwnApplication(user.id, applicationId);

  const data: Record<string, string> = Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [key, String(value)]),
  );

  await prisma.answer.upsert({
    where: { applicationId_step: { applicationId, step } },
    update: { data },
    create: { applicationId, step, data },
  });

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: "EM_ANDAMENTO" },
  });

  const next = getNextStep(stepSlug);
  revalidatePath(`/solicitacoes/${applicationId}`);
  redirect(`/solicitacoes/${applicationId}/${next ? next.slug : "revisao"}`);
}

export async function addDocument(applicationId: string, formData: FormData) {
  const user = await requireUser();
  await requireOwnApplication(user.id, applicationId);

  const type = formData.get("type") as DocumentType;
  const fileName = formData.get("fileName") as string;

  if (!type || !fileName) return;

  await prisma.document.create({
    data: {
      applicationId,
      type,
      fileName,
      // Upload real (Vercel Blob ou S3) ainda não está conectado —
      // por enquanto só registramos o nome do arquivo. Ver PROJECT.md.
      url: "",
    },
  });

  revalidatePath(`/solicitacoes/${applicationId}/documentos`);
}

export async function removeDocument(documentId: string, applicationId: string) {
  const user = await requireUser();
  await requireOwnApplication(user.id, applicationId);

  await prisma.document.delete({
    where: { id: documentId, applicationId },
  });

  revalidatePath(`/solicitacoes/${applicationId}/documentos`);
}

export async function runAnalysis(applicationId: string) {
  const user = await requireUser();
  await requireOwnApplication(user.id, applicationId);

  const [answers, documents] = await Promise.all([
    prisma.answer.findMany({ where: { applicationId } }),
    prisma.document.findMany({ where: { applicationId } }),
  ]);

  const answersByStep = Object.fromEntries(
    answers.map((a) => [a.step, a.data as Record<string, unknown>]),
  );

  const result = await runReadinessAnalysis({
    answers: answersByStep,
    documents: documents.map((d) => ({ type: d.type, fileName: d.fileName })),
  });

  await prisma.analysisResult.upsert({
    where: { applicationId },
    update: {
      readinessScore: result.readinessScore,
      checklist: result.checklist,
      alerts: result.alerts,
    },
    create: {
      applicationId,
      readinessScore: result.readinessScore,
      checklist: result.checklist,
      alerts: result.alerts,
    },
  });

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: "ANALISE_PRONTA" },
  });

  revalidatePath(`/solicitacoes/${applicationId}`);
  redirect(`/solicitacoes/${applicationId}/resultado`);
}

export async function logout() {
  await destroySession();
  redirect("/entrar");
}
