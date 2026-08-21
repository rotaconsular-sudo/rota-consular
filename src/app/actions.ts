"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { WIZARD_STEPS, getNextStep, type WizardStepSlug } from "@/lib/wizard";
import type { WizardStep, DocumentType } from "@/generated/prisma/enums";

export async function createApplication() {
  const user = await getCurrentUser();

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

export async function addDocument(
  applicationId: string,
  formData: FormData,
) {
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
  await prisma.document.delete({ where: { id: documentId } });
  revalidatePath(`/solicitacoes/${applicationId}/documentos`);
}
