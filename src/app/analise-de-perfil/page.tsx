import type { Metadata } from "next";
import Link from "next/link";
import { startFreeApplication } from "@/app/actions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Análise Grátis de Perfil | Rota Consular",
  description:
    "Descubra em minutos o nível de prontidão da sua documentação para o visto americano de turismo (B1/B2), sem custo.",
};

const HOW_IT_WORKS = [
  {
    title: "Preencha seus dados",
    description:
      "É rápido, 100% seguro e precisamos deles para enviar o seu resultado final.",
    icon: IconSignup,
  },
  {
    title: "Responda 10 perguntas simples",
    description:
      "Nosso sistema vai avaliar sua escolaridade, vínculos e histórico em menos de 2 minutos.",
    icon: IconClock,
  },
  {
    title: "Receba seu Diagnóstico",
    description:
      "Descubra na hora a sua nota de aprovação e o que você precisa arrumar urgente.",
    icon: IconTarget,
  },
];

const DIFERENCIAIS = [
  {
    title: "Análise Inteligente de Perfil",
    description:
      "Em poucos minutos, nosso sistema lê suas respostas e te avisa exatamente onde você pode estar errando. Descubra os pontos fracos do seu perfil antes mesmo de pagar a cara taxa do visto",
    icon: IconSpark,
  },
  {
    title: "Lista de Documentos Exata",
    description:
      "Esqueça aquelas listas gigantes e confusas da internet. Você vai receber um checklist mastigado mostrando apenas os documentos que o seu caso precisa levar no dia da entrevista",
    icon: IconChecklist,
  },
  {
    title: "Preparação Sem Falsas Promessas",
    description:
      "Não vendemos milagres, jogamos limpo com você. Entregamos a preparação real para você sentar na frente do cônsul sabendo exatamente o que fazer, com total segurança e confiança",
    icon: IconShieldOutline,
  },
  {
    title: "Passo a Passo Descomplicado",
    description:
      "Preencher o formulário DS-160 não precisa dar dor de cabeça. Te guiamos pela mão em cada etapa para você não cometer erros bobos e economizar um bom dinheiro com despachantes",
    icon: IconSteps,
  },
];

function AnaliseForm() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
      <span className="inline-flex items-center rounded-full border border-ink/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
        GRÁTIS
      </span>
      <form
        action={startFreeApplication}
        className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <label className="flex flex-1 flex-col gap-1.5 text-left">
          <span className="text-sm font-medium text-slate-700">Seu melhor e-mail</span>
          <input
            name="email"
            type="email"
            required
            placeholder="seu@email.com"
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1.5 text-left">
          <span className="text-sm font-medium text-slate-700">Seu WhatsApp</span>
          <input
            name="whatsapp"
            type="tel"
            required
            placeholder="(11) 99999-9999"
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
          />
        </label>
        <button
          type="submit"
          className="shrink-0 whitespace-nowrap rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-ink-muted"
        >
          Iniciar Minha Análise Gratuita
        </button>
      </form>
      <p className="mt-3 text-xs text-slate-500">
        100% seguro e sigiloso. Sem necessidade de cartão de crédito.
      </p>
    </div>
  );
}

export default function AnaliseDePerfilPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-ink">
      <SiteHeader />

      {/* Dobra principal: promessa + card de captura */}
      <section id="captura" className="scroll-mt-6 bg-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-20 sm:py-28 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            O seu perfil passa no teste do Consulado Americano?
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Descubra se você está no caminho certo ou se o seu perfil esconde
            falhas que podem causar uma reprovação automática.
          </p>
          <div className="w-full text-left">
            <AnaliseForm />
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Como funciona a nossa Análise?
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-ink">
                    <Icon />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Passo {i + 1}
                  </p>
                  <p className="text-sm font-semibold text-ink">{step.title}</p>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Benefícios */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Como o Rota Consular ajuda
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DIFERENCIAIS.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.title}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-ink">
                    <Icon />
                  </div>
                  <p className="text-sm font-semibold text-ink">{d.title}</p>
                  <p className="text-sm text-slate-600">{d.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Autoridade */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Não jogue a taxa do seu visto (US$ 185) no lixo por erros
            amadores.
          </h2>
          <p className="mt-4 text-sm text-slate-600">
            A maioria das reprovações acontece por informações conflitantes e
            falta de preparo, não por falta de dinheiro. O Rota Consular foi
            desenhado para blindar o seu processo, entregando a clareza que
            os despachantes tradicionais não querem que você tenha.
          </p>
        </div>
      </section>

      {/* Rodapé de resgate */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-20 sm:py-28 text-center">
          <Link
            href="#captura"
            className="rounded-full bg-ink px-9 py-4 text-base font-bold text-white transition hover:bg-ink-muted"
          >
            Quero Fazer Minha Análise Grátis
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function IconSignup() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 19.5c1-3.3 3.6-5 6.5-5s5.5 1.7 6.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 3.5c.7 3 2.5 4.8 5.5 5.5-3 .7-4.8 2.5-5.5 5.5-.7-3-2.5-4.8-5.5-5.5 3-.7 4.8-2.5 5.5-5.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M18.5 15.5c.4 1.6 1.3 2.6 2.9 3-1.6.4-2.6 1.3-3 2.9-.4-1.6-1.3-2.6-2.9-3 1.6-.4 2.6-1.3 3-2.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function IconChecklist() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 9h8M8 12.5h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconShieldOutline() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 3.5 19 6v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSteps() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 18h4v-4H4v4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 13h4V9h-4v4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16 8h4V4h-4v4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
