import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/money";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Kicker, Star, StarList } from "@/components/marketing";

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

export default async function Ds160PreenchidoPage() {
  const produto = await prisma.produto.findUnique({
    where: { slug: "ds160-preenchido" },
    select: { precoCents: true, nome: true, descricao: true },
  });

  const precoCents = produto?.precoCents ?? 9700;

  return (
    <div className="flex flex-1 flex-col bg-background text-ink">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
          <Kicker>DS-160 preenchido · {formatBRL(precoCents)}</Kicker>
          <h1 className="mt-5 text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-[2.7rem]">
            A gente preenche, revisa e envia o seu DS-160 por você.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
            Você responde um formulário guiado em português. Um especialista
            revisa cada resposta e faz o envio oficial em inglês, direto no
            site do Consulado americano.
          </p>
          <div className="mt-6">
            <StarList
              items={[
                "Formulário 100% em português, salvo automaticamente",
                "Revisão humana campo a campo antes de qualquer envio",
                "Número de confirmação e PDF oficial no seu e-mail",
              ]}
            />
          </div>
          <Link
            href="/checkout?p=ds160-preenchido"
            className="mt-8 inline-block rounded-full bg-brand px-9 py-4 text-sm font-bold text-star transition hover:bg-brand-strong"
          >
            Quero que a Rota Consular faça por mim →
          </Link>
        </div>
      </section>

      <hr className="stripes" />

      {/* Inclui */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
          <Kicker>O que está incluído</Kicker>
          <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Do formulário ao PDF final, sem você tocar em inglês.
          </h2>
          <ul className="mt-10 border-t border-slate-200">
            {INCLUI.map((item) => (
              <li
                key={item}
                className="flex items-start gap-4 border-b border-slate-200 py-4 text-slate-700"
              >
                <Star className="mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <hr className="stripes" />

      {/* Preço */}
      <section className="bg-white">
        <div className="mx-auto max-w-md px-6 py-20 sm:py-28">
          <div className="rounded-xl border border-slate-200 bg-white p-7 text-center shadow-[0_20px_50px_-30px_rgba(10,27,61,.35)]">
            <span className="eyebrow text-brand">Pagamento único</span>
            <h3 className="mt-3 text-lg font-bold text-ink">
              {produto?.nome ?? "DS-160 preenchido pra você"}
            </h3>
            {produto?.descricao && (
              <p className="mt-2 text-sm text-slate-600">{produto.descricao}</p>
            )}
            <p className="mt-6 text-4xl font-extrabold tracking-tight text-ink">
              {formatBRL(precoCents)}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">
              ou em até 4x no cartão
            </p>
            <Link
              href="/checkout?p=ds160-preenchido"
              className="mt-6 block w-full rounded-full bg-brand px-5 py-3.5 text-sm font-bold text-star transition hover:bg-brand-strong"
            >
              Quero que a Rota Consular faça por mim →
            </Link>
          </div>
        </div>
      </section>

      <hr className="stripes" />

      {/* FAQ */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
          <Kicker>Dúvidas</Kicker>
          <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Antes de contratar.
          </h2>
          <div className="mt-8 border-t border-slate-200">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group border-b border-slate-200 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink">
                  {item.question}
                  <span className="text-xl font-black leading-none text-brand transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
