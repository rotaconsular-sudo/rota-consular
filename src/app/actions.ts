"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { destroySession } from "@/lib/session";
import {
  requireApplicationAccess,
  createAccessToken,
  getAccessCookieValue,
} from "@/lib/applications";
import { WIZARD_STEPS, getNextStep } from "@/lib/wizard";
import type { WizardStep, DocumentType } from "@/generated/prisma/enums";
import type { QuizAnswers } from "@/lib/quizQuestions";
import { runReadinessAnalysis } from "@/lib/anthropic";
import { sendAnalysisResult } from "@/lib/mailer";
import { getBaseUrl } from "@/lib/url";
import { createCheckoutPreference as createMpPreference } from "@/lib/mercadopago";

const MAX_DOCUMENT_SIZE = 8 * 1024 * 1024; // 8MB
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CHECKLIST_PRICE_CENTS = 4700; // R$47,00

export async function createApplication() {
  const user = await requireUser();

  const application = await prisma.application.create({
    data: { userId: user.id },
  });

  redirect(`/solicitacoes/${application.id}/${WIZARD_STEPS[0].slug}`);
}

// Início do funil gratuito, sem login — só e-mail e WhatsApp. A solicitação
// fica anônima (userId nulo) até o pagamento; acesso é validado por cookie
// (ver src/lib/applications.ts), não por sessão.
export async function startFreeApplication(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();

  if (!EMAIL_REGEX.test(email) || !whatsapp) {
    redirect("/analise-de-perfil?erro=dados_invalidos");
  }

  const application = await prisma.application.create({
    data: { email, whatsapp },
  });

  const accessTokenHash = await createAccessToken(application.id);
  await prisma.application.update({
    where: { id: application.id },
    data: { accessTokenHash },
  });

  redirect(`/solicitacoes/${application.id}/${WIZARD_STEPS[0].slug}`);
}

// stepSlug é string solta (não WizardStepSlug): só as páginas antigas do
// wizard (fora do fluxo ativo, ver src/lib/wizard.ts) ainda chamam essa
// action, com slugs que não existem mais em WIZARD_STEPS.
export async function saveAnswer(
  applicationId: string,
  stepSlug: string,
  step: WizardStep,
  formData: FormData,
) {
  await requireApplicationAccess(applicationId);

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

// Salva o quiz de análise de perfil inteiro (etapa PERFIL) de uma vez, ao
// final das perguntas, e já roda a análise na hora — a pessoa sai do quiz
// direto pro resultado (score grátis), sem passar por documentos/revisão
// antes. Documentos continuam disponíveis depois, pra quem quiser refinar
// o checklist pago.
export async function savePerfilAnswers(
  applicationId: string,
  answers: QuizAnswers,
) {
  await requireApplicationAccess(applicationId);

  await prisma.answer.upsert({
    where: { applicationId_step: { applicationId, step: "PERFIL" } },
    update: { data: answers },
    create: { applicationId, step: "PERFIL", data: answers },
  });

  await performAnalysis(applicationId);

  revalidatePath(`/solicitacoes/${applicationId}`);
  redirect(`/solicitacoes/${applicationId}/resultado`);
}

export async function addDocument(applicationId: string, formData: FormData) {
  await requireApplicationAccess(applicationId);

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
  await requireApplicationAccess(applicationId);

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

// Núcleo de rodar a análise por IA: lê respostas + documentos salvos,
// chama o modelo, grava o resultado e avisa por e-mail. Sem redirect —
// quem chama decide pra onde mandar a pessoa depois (savePerfilAnswers
// manda pro resultado assim que o quiz termina; runAnalysis reusa isso
// pro botão "rodar análise novamente" na revisão, depois de documentos).
async function performAnalysis(applicationId: string) {
  const application = await requireApplicationAccess(applicationId);

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

  if (application.email) {
    const baseUrl = await getBaseUrl();
    const accessToken = application.userId
      ? null
      : await getAccessCookieValue(applicationId);
    const resultUrl = accessToken
      ? `${baseUrl}/solicitacoes/${applicationId}/acessar?token=${accessToken}`
      : `${baseUrl}/solicitacoes/${applicationId}/resultado`;

    await sendAnalysisResult(application.email, {
      readinessScore: result.readinessScore,
      resultUrl,
    });
  }
}

export async function runAnalysis(applicationId: string) {
  await performAnalysis(applicationId);

  revalidatePath(`/solicitacoes/${applicationId}`);
  redirect(`/solicitacoes/${applicationId}/resultado`);
}

// Desbloqueia o checklist completo (R$47, Mercado Pago Checkout Pro).
export async function createCheckoutPreference(applicationId: string) {
  const application = await requireApplicationAccess(applicationId);

  const baseUrl = await getBaseUrl();
  const accessToken = application.userId
    ? null
    : await getAccessCookieValue(applicationId);
  const returnUrl = accessToken
    ? `${baseUrl}/solicitacoes/${applicationId}/acessar?token=${accessToken}`
    : `${baseUrl}/solicitacoes/${applicationId}/resultado`;

  const preference = await createMpPreference({
    applicationId,
    amountCents: CHECKLIST_PRICE_CENTS,
    successUrl: returnUrl,
    notificationUrl: `${baseUrl}/api/mercadopago/webhook`,
  });

  await prisma.payment.create({
    data: {
      applicationId,
      mpPreferenceId: preference.id,
      status: "PENDING",
      amountCents: CHECKLIST_PRICE_CENTS,
    },
  });

  redirect(preference.initPoint);
}

export async function logout() {
  await destroySession();
  redirect("/entrar");
}
