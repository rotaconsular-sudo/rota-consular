import type { Metadata } from "next";
import Link from "next/link";
import { FLAGSHIP_PRODUCT } from "@/lib/products";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Mapa do DS-160 | Rota Consular",
  description: FLAGSHIP_PRODUCT.subtitle,
};

const GUIDE_FEATURES = [
  {
    title: "Formulário próprio, simples e 100% em português",
    icon: IconClipboard,
  },
  {
    title: "Auditoria Humana Especializada em cada resposta enviada",
    icon: IconDocument,
  },
  {
    title: "Notificação oficial caso nosso Controle de Qualidade identifique alguma divergência",
    icon: IconRoute,
  },
  {
    title: "Alertas sobre informações conflitantes ou inconsistentes",
    icon: IconAlert,
  },
  {
    title: "Envio oficial direto ao site do Consulado americano",
    icon: IconClipboard,
  },
];

const IDEAL_FOR = [
  "Preencher seus dados 100% em português, no seu tempo e sem esbarrar no site confuso do governo.",
  "Ter a segurança de uma revisão humana especializada antes de qualquer envio oficial.",
  "Receber a confirmação oficial (código de barras) e o PDF finalizado sem estresse.",
  "Economizar centenas de reais fugindo das taxas abusivas de despachantes tradicionais.",
];

const HOW_DS160_WORKS = [
  {
    title: "O Preenchimento Descomplicado",
    description: "Você usa nosso formulário simplificado em português.",
    icon: IconOpenForm,
  },
  {
    title: "A Revisão Humana",
    description:
      "Um especialista audita as suas respostas para eliminar informações conflitantes.",
    icon: IconGuide,
  },
  {
    title: "A Submissão Oficial",
    description:
      "Nós assumimos a burocracia, lançamos tudo no site do Consulado e te enviamos o código do DS-160 e o PDF oficial prontos para o seu agendamento.",
    icon: IconOrder,
  },
];

const FAQ_ITEMS = [
  {
    question: "Em quanto tempo recebo meu DS-160 oficial pronto?",
    answer:
      "O nosso foco é a sua aprovação, e excelência leva tempo. Diferente de sistemas 100% automatizados que geram erros grotescos, nós fazemos uma Auditoria Humana Especializada em cada linha das suas respostas. Por isso, após você preencher o nosso formulário em português, nossa equipe leva de 7 a 10 dias úteis para revisar todas as informações, cruzar os dados, emitir o envio no sistema oficial do governo americano e te entregar o PDF finalizado com o código de barras, 100% seguro e sem erros.",
  },
  {
    question: "O serviço serve para quem nunca preencheu o DS-160?",
    answer:
      "Sim. Você só precisa responder nosso formulário em português — nossa equipe cuida da revisão e do envio oficial, mesmo que seja a primeira vez que você lida com o DS-160.",
  },
  {
    question: "Posso acessar pelo celular?",
    answer: "Sim. Você pode preencher nosso formulário pelo celular, tablet ou computador.",
  },
  {
    question: "Preciso saber inglês para usar o formulário de vocês?",
    answer:
      "Não. Nosso formulário é 100% em português — a tradução e o envio ao site oficial do Consulado ficam por nossa conta.",
  },
  {
    question: "Como funciona a garantia?",
    answer:
      "Você conta com garantia de 7 dias. Dentro desse prazo, caso não queira continuar com o produto, pode solicitar o reembolso.",
  },
  {
    question: "Eu vou precisar entrar no site oficial do governo americano?",
    answer:
      "Não. Nossa equipe se encarrega de transferir todos os seus dados revisados para o sistema oficial do Consulado.",
  },
  {
    question: "O que eu recebo no final do processo?",
    answer:
      "Você receberá o número de confirmação oficial do seu DS-160 e uma cópia em PDF gerada diretamente pelo site do governo americano.",
  },
  {
    question: "E se eu errar alguma digitação no sistema de vocês?",
    answer:
      "Nosso Controle de Qualidade audita cada resposta antes do envio definitivo. Caso identifique alguma divergência, você recebe uma Notificação de Divergência para corrigir o dado pontual antes da submissão oficial.",
  },
  {
    question: "E se as informações que eu preencher estiverem confusas?",
    answer:
      "Nosso time faz uma auditoria estrita. Caso encontremos informações conflitantes que coloquem seu visto em risco, emitiremos um (1) \"Alerta de Divergência\" via WhatsApp solicitando a correção pontual daquele dado para finalizar o seu envio. Este serviço inclui a submissão dos dados fornecidos por você, e não inclui consultoria de perfil, análise de vínculos ou simulação de entrevista.",
  },
];

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function MapaDS160Page() {
  const p = FLAGSHIP_PRODUCT;
  const discountCents = p.compareAtPriceCents - p.priceCents;

  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-ink">
      {/* Faixa de oferta */}
      <div className="bg-ink py-2 text-center text-xs font-semibold tracking-wide text-white">
        OFERTA POR TEMPO LIMITADO — Como Tirar seu Visto Americano com Segurança
      </div>

      <SiteHeader />

      {/* Hero */}
      <section className="bg-slate-50">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-14 text-center sm:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {p.title}
          </h1>
          <p className="max-w-xl text-lg text-slate-600">{p.subtitle}</p>

          <div className="flex aspect-[4/3] w-full max-w-sm items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">
            [ prévia do {p.title} ]
          </div>

          <ul className="grid gap-2 text-left sm:grid-cols-2">
            {p.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2 text-sm text-slate-700">
                <IconCheck />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/checkout"
            className="mt-2 rounded-full bg-ink px-9 py-4 text-base font-bold text-white transition hover:bg-ink-muted"
          >
            ACESSAR AGORA
          </Link>
          <p className="text-sm text-slate-500">
            Preencha agora e deixe o resto com a gente.
          </p>
        </div>
      </section>

      {/* Prévia do material */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Nós cuidamos de cada uma dessas etapas do formulário oficial:
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {p.themes.map((theme) => (
              <span
                key={theme}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* O guia possui */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            O {p.title} inclui:
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {GUIDE_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.title} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-ink">
                    <Icon />
                  </div>
                  <p className="text-sm font-semibold text-ink">{f.title}</p>
                </li>
              );
            })}
          </ul>
          <p className="mt-10 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
            Você preenche pelo nosso formulário, nossa equipe revisa e envia
            oficialmente — sem risco de erro e sem precisar de despachante!
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/checkout"
              className="rounded-full bg-ink px-9 py-4 text-base font-bold text-white transition hover:bg-ink-muted"
            >
              QUERO ACESSAR AGORA
            </Link>
          </div>
        </div>
      </section>

      {/* Ideal para você que deseja */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            O nosso Sistema Inteligente é ideal para você que deseja:
          </h2>
          <ul className="mt-8 flex flex-col gap-3">
            {IDEAL_FOR.map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <IconCheck />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tudo que você vai receber */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Tudo o que você vai receber:
          </h2>
          <div className="mt-8 flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
            [ prévia do plano completo ]
          </div>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {p.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2 text-sm text-slate-700">
                <IconCheck />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-slate-500">
            Você preenche, nossa equipe revisa e envia — sem burocracia.
          </p>
        </div>
      </section>

      {/* Bônus */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
            BÔNUS EXCLUSIVO
          </span>
          <div className="mt-6 flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">
            [ capa do bônus ]
          </div>
          <h3 className="mt-6 text-xl font-bold text-ink">{p.bonusTitle}</h3>
          <p className="mt-2 text-sm text-slate-600">{p.bonusDescription}</p>
          <p className="mt-3 text-sm font-semibold">
            <span className="text-slate-400 line-through">{formatBRL(p.bonusValueCents)}</span>{" "}
            <span className="text-ink">GRÁTIS</span>
          </p>
        </div>
      </section>

      {/* Oferta / preço */}
      <section className="bg-white">
        <div className="mx-auto max-w-md px-6 py-20 sm:py-28">
          <div className="rounded-2xl border border-ink/20 bg-white p-7 text-center ring-1 ring-blue-100">
            <div className="flex justify-center gap-2">
              <span className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">MAIS VENDIDO</span>
              <span className="rounded-full border border-ink/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">ÚLTIMA CHANCE</span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-ink">Mapa Completo</h3>
            <div className="mt-4 flex aspect-square w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
              [ prévia do produto ]
            </div>
            <ul className="mt-6 flex flex-col gap-2 text-left text-sm text-slate-700">
              {[p.title, "Guia organizado passo a passo", "Conteúdo visual e de fácil consulta", `Bônus: ${p.bonusTitle}`].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <IconCheck />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate-500">
              de <span className="line-through">{formatBRL(p.compareAtPriceCents)}</span> por apenas:
            </p>
            <p className="text-4xl font-extrabold text-accent">{formatBRL(p.priceCents)}</p>
            <p className="text-xs text-slate-500">ou em até 4x no cartão</p>
            <p className="mt-1 text-xs font-semibold text-ink">
              Você economiza {formatBRL(discountCents)}.
            </p>
            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white transition hover:bg-ink-muted"
            >
              QUERO O PLANO COMPLETO
            </Link>
          </div>
        </div>
      </section>

      {/* Garantia */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28 text-center">
          <h2 className="text-xl font-bold tracking-tight text-ink">
            Preencher o DS-160 entendendo o que cada etapa está pedindo torna o
            processo muito mais claro, organizado e seguro!
          </h2>
          <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-ink">
            <IconShield />
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Garantia de 7 dias. Se você achar que o material não faz sentido para
            o seu processo ou simplesmente não quiser continuar com o produto:
          </p>
          <p className="mt-1 text-sm font-bold text-ink">
            DEVOLVEMOS SEU DINHEIRO DE VOLTA, SEM BUROCRACIA!
          </p>
        </div>
      </section>

      {/* Como funciona o seu DS-160 Blindado */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Como funciona o seu DS-160 Blindado?
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {HOW_DS160_WORKS.map((step, i) => {
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

      {/* Upsell: Assessoria Completa */}
      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 text-center sm:p-9">
            <span className="inline-flex items-center rounded-full border border-ink/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
              PARA QUEM QUER IR ALÉM DO FORMULÁRIO
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Quer uma especialista cuidando de tudo, do DS-160 até a entrevista?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Conheça a Assessoria Completa Rota Consular: documentação,
              treinamento para a entrevista consular e atendimento humano
              direto no WhatsApp.
            </p>
            <Link
              href="/assessoria-completa"
              className="mt-6 inline-block rounded-full bg-ink px-8 py-3.5 text-sm font-bold text-white transition hover:bg-ink-muted"
            >
              Conhecer a Assessoria Completa
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Perguntas frequentes
          </h2>
          <div className="mt-8 flex flex-col gap-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors open:border-ink/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink">
                  {item.question}
                  <span className="ml-4 text-slate-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <p className="mx-auto mt-2 text-center text-xs text-slate-400">
        Já tem uma solicitação paga?{" "}
        <Link href="/entrar" className="text-accent hover:underline">
          Entrar
        </Link>
        {" · "}
        <Link href="/blog" className="text-accent hover:underline">
          Blog
        </Link>
      </p>

      <SiteFooter />
    </div>
  );
}

function IconClipboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M9 4.5h6a1 1 0 0 1 1 1V6h1.5A1.5 1.5 0 0 1 19 7.5v11A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-11A1.5 1.5 0 0 1 6.5 6H8v-.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12h6M9 15.5h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDocument() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 3.5V7h4M9 12.5h6M9 15.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconRoute() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 6.5h6a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 4.5 21 19H3L12 4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 10v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16.2" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-accent">
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9">
      <path
        d="M12 3.5 19 6v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8.5 12 11 14.5 15.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconOrder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4.5 6.5h15l-1.4 9.2a1.5 1.5 0 0 1-1.5 1.3H7.4a1.5 1.5 0 0 1-1.5-1.3L4.5 6.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 6.5V5a4 4 0 0 1 8 0v1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 7 12 12.5 19.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M12 4v11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.5 11 12 15.5 16.5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconOpenForm() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 7 12 3.5 20 7v10L12 20.5 4 17V7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 3.5v17" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconGuide() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M12 5c-2-1.3-4.5-1.5-7-1v13.5c2.5-.5 5-.3 7 1 2-1.3 4.5-1.5 7-1V4c-2.5-.5-5-.3-7 1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 5v13.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
