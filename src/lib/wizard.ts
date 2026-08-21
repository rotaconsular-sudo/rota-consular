import type { WizardStep } from "@/generated/prisma/enums";

// Ordem das etapas do wizard de triagem. "documentos" e "revisao" não têm
// um WizardStep correspondente — documentos usa o model Document, e a
// revisão só lê o que já foi salvo nas etapas anteriores.
export const WIZARD_STEPS = [
  {
    slug: "dados-pessoais",
    step: "DADOS_PESSOAIS" satisfies WizardStep,
    title: "Dados pessoais",
    description: "Quem é você",
  },
  {
    slug: "situacao-profissional",
    step: "SITUACAO_PROFISSIONAL" satisfies WizardStep,
    title: "Situação profissional",
    description: "Seu vínculo com o Brasil",
  },
  {
    slug: "historico-viagens",
    step: "HISTORICO_VIAGENS" satisfies WizardStep,
    title: "Histórico de viagens",
    description: "Viagens e vistos anteriores",
  },
  {
    slug: "motivo-viagem",
    step: "MOTIVO_VIAGEM" satisfies WizardStep,
    title: "Motivo da viagem",
    description: "Por que você quer ir aos EUA",
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
