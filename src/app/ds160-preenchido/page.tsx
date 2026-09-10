import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/money";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "DS-160 preenchido pra você | Rota Consular",
  description:
    "Um especialista revisa cada resposta do seu DS-160 e faz o envio oficial em inglês no site do Consulado americano por você.",
};

const INCLUI = [
  "Tudo do DS-160 Sem Erros (formulário completo, 100% em português, salvo automaticamente)",
  "Revisão humana especializada, campo por campo, antes de qualquer envio",
  "Envio oficial em inglês feito por nós, no site do Consulado",
  "Você recebe o número de confirmação e o PDF oficial por e-mail",
  "Zero risco de erro de tradução ou de preenchimento",
];

const FAQ_ITEMS = [
  {
    question: "Em quanto tempo recebo meu número do DS-160?",
    answer:
      "O nosso foco é a sua aprovação, e excelência leva tempo. Após você preencher o formulário em português, nossa equipe leva de 7 a 10 dias úteis para revisar todas as informações, cruzar os dados, emitir o envio no sistema oficial do governo americano e te entregar o PDF finalizado com o código de barras, 100% seguro e sem erros.",
  },
  {
    question: "Preciso saber inglês?",
    answer:
      "Não. Nosso formulário é 100% em português — a tradução e o envio ao site oficial do Consulado ficam por nossa conta.",
  },
  {
    question: "Como funciona a revisão?",
    answer:
      "Nossa equipe audita cada resposta antes do envio definitivo. Caso identifique alguma divergência, você recebe uma Notificação de Divergência pelo WhatsApp pra corrigir aquele dado pontual antes da submissão oficial.",
  },
];

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

export default async function Ds160PreenchidoPage() {
  const produto = await prisma.produto.findUnique({
    where: { slug: "ds160-preenchido" },
    select: { precoCents: true, nome: true, descricao: true },
  });

  const precoCents = produto?.precoCents ?? 9700;

  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-ink">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-slate-50">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-14 text-center sm:py-20">
          <span className="inline-flex items-center rounded-full border border-hairline/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
            FEITO POR ESPECIALISTA · REVISÃO HUMANA
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl text-balance">
            A gente preenche, revisa e envia o seu DS-160 por você
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Mesmo formulário guiado em português das outras opções. A
            diferença: um especialista com mais de 15 anos de experiência
            revisa cada resposta e faz o envio oficial em inglês, direto no
            site do Consulado americano.
          </p>
          <Link
            href="/checkout?p=ds160-preenchido"
            className="mt-2 rounded-full bg-brand px-9 py-4 text-base font-bold text-star transition hover:bg-brand-strong"
          >
            Quero que a Rota Consular faça por mim
          </Link>
        </div>
      </section>

      {/* Inclui */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
            O que está incluído
          </h2>
          <ul className="mt-10 flex flex-col gap-3">
            {INCLUI.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
              >
                <IconCheck />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Preço */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-md px-6 py-20 sm:py-28">
          <div className="rounded-2xl border border-hairline/20 bg-white p-7 text-center">
            <h3 className="text-xl font-bold text-ink">
              {produto?.nome ?? "DS-160 preenchido pra você"}
            </h3>
            {produto?.descricao && (
              <p className="mt-2 text-sm text-slate-600">{produto.descricao}</p>
            )}
            <p className="mt-6 text-4xl font-extrabold text-accent">
              {formatBRL(precoCents)}
            </p>
            <p className="text-xs text-slate-500">ou em até 4x no cartão</p>
            <Link
              href="/checkout?p=ds160-preenchido"
              className="mt-6 block w-full rounded-full bg-brand px-5 py-3.5 text-sm font-bold text-star transition hover:bg-brand-strong"
            >
              Quero que a Rota Consular faça por mim
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
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

      <SiteFooter />
    </div>
  );
}
