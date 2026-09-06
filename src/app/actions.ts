"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { destroySession } from "@/lib/session";
import {
  requireApplicationAccess,
  createAccessToken,
  getAccessCookieValue,
} from "@/lib/applications";
import { WIZARD_STEPS, getNextStep } from "@/lib/wizard";
import type { WizardStep } from "@/generated/prisma/enums";
import type { QuizAnswers } from "@/lib/quizQuestions";
import { runReadinessAnalysis } from "@/lib/anthropic";
import { sendAnalysisResult } from "@/lib/mailer";
import { getBaseUrl } from "@/lib/url";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createApplication() {
  const user = await requireUser();

  const application = await prisma.application.create({
    data: { userId: user.id },
  });

  redirect(`/solicitacoes/${application.id}/${WIZARD_STEPS[0].slug}`);
}

// Início do funil gratuito, sem login — só e-mail e WhatsApp. A solicitação
// fica anônima (userId nulo); acesso é validado por cookie (ver
// src/lib/applications.ts), não por sessão.
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
// direto pro resultado.
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

// Núcleo de rodar a análise por IA: lê as respostas, chama o modelo, grava o
// resultado e avisa por e-mail. Sem redirect — quem chama decide pra onde
// mandar a pessoa depois.
async function performAnalysis(applicationId: string) {
  const application = await requireApplicationAccess(applicationId);

  const answers = await prisma.answer.findMany({ where: { applicationId } });

  const answersByStep = Object.fromEntries(
    answers.map((a) => [a.step, a.data as Record<string, unknown>]),
  );

  const result = await runReadinessAnalysis({ answers: answersByStep });

  // O model AnalysisResult tem 3 colunas (readinessScore, checklist Json,
  // alerts Json) — reaproveitadas pro novo formato sem migração:
  // checklist = { resumo, favoravel, reforcar }; alerts = atencao.
  const corpo = {
    resumo: result.resumo,
    favoravel: result.favoravel,
    reforcar: result.reforcar,
  };

  await prisma.analysisResult.upsert({
    where: { applicationId },
    update: {
      readinessScore: result.score,
      checklist: corpo,
      alerts: result.atencao,
    },
    create: {
      applicationId,
      readinessScore: result.score,
      checklist: corpo,
      alerts: result.atencao,
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
      score: result.score,
      resumo: result.resumo,
      resultUrl,
    });
  }
}

export async function runAnalysis(applicationId: string) {
  await performAnalysis(applicationId);

  revalidatePath(`/solicitacoes/${applicationId}`);
  redirect(`/solicitacoes/${applicationId}/resultado`);
}

export async function logout() {
  await destroySession();
  redirect("/entrar");
}
