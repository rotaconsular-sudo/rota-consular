import type { WizardStep } from "@/generated/prisma/enums";

// Ordem das etapas do funil. "perfil" é o quiz (1 pergunta por tela, ver
// src/components/Quiz.tsx) que substituiu as 4 páginas antigas de
// formulário — essas páginas continuam existindo (não foram apagadas) mas
// não fazem mais parte do fluxo ativo. "documentos" e "revisao" não têm
// um WizardStep correspondente — documentos usa o model Document, e a
// revisão só lê o que já foi salvo nas etapas anteriores.
export const WIZARD_STEPS = [
  {
    slug: "perfil",
    step: "PERFIL" satisfies WizardStep,
    title: "Perfil",
    description: "Análise de perfil",
  },
  {
    slug: "documentos",
    step: null,
    title: "Documentos",
    description: "O que você já tem em mãos",
  },
  {
    slug: "revisao",
    step: null,
    title: "Revisão",
    description: "Confira tudo antes da análise",
  },
] as const;

export type WizardStepSlug = (typeof WIZARD_STEPS)[number]["slug"];

export function getStepBySlug(slug: string) {
  return WIZARD_STEPS.find((s) => s.slug === slug);
}

export function getStepIndex(slug: string) {
  return WIZARD_STEPS.findIndex((s) => s.slug === slug);
}

export function getNextStep(slug: string) {
  const i = getStepIndex(slug);
  return i >= 0 && i < WIZARD_STEPS.length - 1 ? WIZARD_STEPS[i + 1] : null;
}

export function getPrevStep(slug: string) {
  const i = getStepIndex(slug);
  return i > 0 ? WIZARD_STEPS[i - 1] : null;
}
