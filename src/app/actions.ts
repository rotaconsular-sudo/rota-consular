"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { destroySession } from "@/lib/session";
import { requireOwnApplication } from "@/lib/applications";
import { WIZARD_STEPS, getNextStep, type WizardStepSlug } from "@/lib/wizard";
import type { WizardStep, DocumentType } from "@/generated/prisma/enums";
import { runReadinessAnalysis } from "@/lib/anthropic";

const MAX_DOCUMENT_SIZE = 8 * 1024 * 1024; // 8MB

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
  const file = formData.get("file") as File | null;

  if (!type || !file || file.size === 0) return;
  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new Error("Arquivo maior que 8MB. Envie um arquivo menor.");
  }

  const blob = await put(`documentos/${applicationId}/${crypto.randomUUID()}-${file.name}`, file, {
    access: "private",
    addRandomSuffix: false,
  });

  await prisma.document.create({
    data: {
      applicationId,
      type,
      fileName: file.name,
      url: blob.url,
    },
  });

  revalidatePath(`/solicitacoes/${applicationId}/documentos`);
}

export async function removeDocument(documentId: string, applicationId: string) {
  const user = await requireUser();
  await requireOwnApplication(user.id, applicationId);

  const document = await prisma.document.findUnique({
    where: { id: documentId, applicationId },
  });
  if (!document) return;

  await prisma.document.delete({
    where: { id: documentId, applicationId },
  });

  if (document.url) await del(document.url);

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
