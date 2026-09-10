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
    title: "Rascunho salvo automaticamente, sem pressa",
    icon: IconDocument,
  },
  {
    title: "Resumo organizado das suas respostas ao final",
    icon: IconRoute,
  },
  {
    title: "Mesmas seções do DS-160 oficial, explicadas em português",
    icon: IconAlert,
  },
  {
    title: "Sem letra miúda: você revisa e envia por conta própria",
    icon: IconClipboard,
  },
];

const IDEAL_FOR = [
  "Ter as mesmas seções do DS-160 oficial organizadas e explicadas em português.",
  "Preencher no seu tempo, com o rascunho salvo automaticamente.",
  "Economizar fugindo das taxas abusivas de despachantes tradicionais, preenchendo você mesmo com confiança.",
];

const HOW_DS160_WORKS = [
  {
    title: "O Preenchimento Descomplicado",
    description: "Você usa nosso formulário simplificado em português.",
    icon: IconOpenForm,
  },
  {
    title: "Revise você mesmo",
    description: "Confira suas respostas com calma — o formulário te guia seção por seção.",
    icon: IconGuide,
  },
  {
    title: "Use no site oficial",
    description:
      "Leve o resumo organizado pro site do Consulado americano e finalize seu envio por lá.",
    icon: IconOrder,
  },
];

const FAQ_ITEMS = [
  {
    question: "Em quanto tempo posso usar?",
    answer:
      "Na hora. Assim que você conclui o formulário, seu resumo já fica disponível pra uso.",
  },
  {
    question: "Vocês enviam o DS-160 por mim?",
    answer:
      "Não neste plano — você mesmo faz o envio final no site oficial do Consulado, usando o resumo organizado que a gente te entrega. Se preferir que a gente cuide de tudo, veja o DS-160 preenchido pra você (R$97).",
  },
  {
    question: "O serviço serve para quem nunca preencheu o DS-160?",
    answer:
      "Sim. Nosso formulário guia você seção por seção, em português, com a mesma ordem e as mesmas perguntas do DS-160 oficial — mesmo que seja a primeira vez que você lide com ele.",
  },
  {
    question: "Posso acessar pelo celular?",
    answer: "Sim. Você pode preencher nosso formulário pelo celular, tablet ou computador.",
  },
  {
    question: "Preciso saber inglês para usar o formulário de vocês?",
    answer:
      "Não, o formulário é 100% em português. Só o site oficial do governo, no final, é em inglês — mas o resumo que você recebe já te dá o que preencher lá.",
  },
  {
    question: "Como funciona a garantia?",
    answer:
      "Você conta com garantia de 7 dias. Dentro desse prazo, caso não queira continuar com o produto, pode solicitar o reembolso.",
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
      <SiteHeader />

      {/* Hero */}
      <section className="bg-slate-50">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-14 text-center sm:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl text-balance">
            {p.title}
          </h1>
          <p className="max-w-xl text-lg text-slate-600">{p.subtitle}</p>

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
            className="mt-2 rounded-full bg-brand px-9 py-4 text-base font-bold text-star transition hover:bg-brand-strong"
          >
            ACESSAR AGORA
          </Link>
          <p className="text-sm text-slate-500">
            Acesso imediato. Preencha no seu tempo, no seu ritmo.
          </p>
        </div>
      </section>

      {/* Prévia do material */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
            O formulário guia você por cada uma dessas etapas do processo oficial:
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
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
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
            Você preenche pelo nosso formulário, no seu tempo — sem precisar
            de despachante!
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/checkout"
              className="rounded-full bg-brand px-9 py-4 text-base font-bold text-star transition hover:bg-brand-strong"
            >
              QUERO ACESSAR AGORA
            </Link>
          </div>
        </div>
      </section>

      {/* Ideal para você que deseja */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
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
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
            Tudo o que você vai receber:
          </h2>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {p.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2 text-sm text-slate-700">
                <IconCheck />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-slate-500">
            Você preenche, revisa e envia — no seu tempo, sem burocracia.
          </p>
        </div>
      </section>

      {/* Bônus */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
            BÔNUS EXCLUSIVO
          </span>
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
          <div className="rounded-2xl border border-hairline/20 bg-white p-7 text-center">
            <div className="flex justify-center gap-2">
              <span className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">MAIS VENDIDO</span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-ink">Mapa Completo</h3>
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
              className="mt-6 block w-full rounded-full bg-brand px-5 py-3.5 text-sm font-bold text-star transition hover:bg-brand-strong"
            >
              QUERO O PLANO COMPLETO
            </Link>
          </div>
        </div>
      </section>

      {/* Upsell: DS-160 preenchido pra você (tier completo) */}
      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 text-center sm:p-9">
            <span className="inline-flex items-center rounded-full border border-hairline/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
              PREFERE NÃO PREENCHER NADA?
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
              A gente preenche, revisa e envia o seu DS-160 por você
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Mesmo formulário, mas com um especialista revisando cada
              resposta e fazendo o envio oficial em inglês no site do
              Consulado por você.
            </p>
            <Link
              href="/ds160-preenchido"
              className="mt-6 inline-block rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-star transition hover:bg-brand-strong"
            >
              Conhecer o DS-160 preenchido pra você
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
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
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
            <span className="inline-flex items-center rounded-full border border-hairline/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
              PARA QUEM QUER IR ALÉM DO FORMULÁRIO
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
              Quer uma especialista cuidando de tudo, do DS-160 até a entrevista?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Conheça a Assessoria Completa Rota Consular: documentação,
              treinamento para a entrevista consular e atendimento humano
              direto no WhatsApp.
            </p>
            <Link
              href="/assessoria-completa"
              className="mt-6 inline-block rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-star transition hover:bg-brand-strong"
            >
              Conhecer a Assessoria Completa
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
            Perguntas frequentes
          </h2>
          <div className="mt-8 flex flex-col gap-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors open:border-hairline/30"
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
