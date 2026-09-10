import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { ReforcarItem } from "@/lib/anthropic";

type Corpo = {
  resumo: string;
  favoravel: string[];
  reforcar: ReforcarItem[];
};

function barra(score: number) {
  if (score >= 75) return { cor: "bg-ok", texto: "text-ok" };
  if (score >= 45) return { cor: "bg-warn", texto: "text-warn" };
  return { cor: "bg-err", texto: "text-err" };
}

export default async function ResultadoPage(
  props: PageProps<"/solicitacoes/[id]/resultado">,
) {
  const { id } = await props.params;

  const result = await prisma.analysisResult.findUnique({
    where: { applicationId: id },
  });
  if (!result) notFound();

  const score = result.readinessScore;
  const corpo = result.checklist as unknown as Corpo;
  const atencao = (result.alerts as unknown as string[]) ?? [];
  const { cor, texto } = barra(score);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow text-accent">Sua análise de perfil</p>
        <h2 className="mt-2 text-xl font-extrabold leading-snug tracking-tight text-ink">
          {corpo.resumo}
        </h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold text-ink">
            Quanto seu perfil está preparado
          </p>
          <p className={`text-2xl font-extrabold ${texto}`}>{score}</p>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${cor}`} style={{ width: `${score}%` }} />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Isso mostra o quanto sua preparação parece completa hoje — não é uma
          previsão nem garantia de aprovação. A decisão é sempre do oficial
          consular americano.
        </p>
      </div>

      {atencao.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-bold text-ink">🚨 Fique atento</h3>
          <ul className="flex flex-col gap-2">
            {atencao.map((a, i) => (
              <li
                key={i}
                className="rounded-xl border border-err/30 bg-err/5 px-4 py-3 text-sm text-err"
              >
                {a}
              </li>
            ))}
          </ul>
        </section>
      )}

      {corpo.favoravel.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-bold text-ink">✅ O que joga a seu favor</h3>
          <ul className="flex flex-col gap-2">
            {corpo.favoravel.map((f, i) => (
              <li
                key={i}
                className="rounded-xl border border-ok/30 bg-ok/5 px-4 py-3 text-sm text-slate-700"
              >
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {corpo.reforcar.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-bold text-ink">⚠️ O que vale reforçar</h3>
          <ul className="flex flex-col gap-3">
            {corpo.reforcar.map((r, i) => (
              <li
                key={i}
                className="rounded-xl border border-warn/30 bg-warn/5 px-4 py-3 text-sm"
              >
                <p className="font-medium text-ink">{r.ponto}</p>
                <p className="mt-1 text-slate-600">
                  <span className="font-semibold text-warn">O que fazer: </span>
                  {r.oQueFazer}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-8">
        <span className="eyebrow text-accent">Próximo passo</span>
        <h3 className="mt-3 text-xl font-bold text-ink">
          Seu diagnóstico está pronto. Agora vem o DS-160.
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Você já sabe o que está a seu favor e o que reforçar. O próximo
          passo é o formulário oficial do visto — e ele não perdoa erro de
          preenchimento.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/mapads160"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-ink transition hover:border-hairline"
          >
            Prefiro preencher sozinho — R$27,90
          </Link>
          <Link
            href="/ds160-preenchido"
            className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-star transition hover:bg-brand-strong"
          >
            Quero que façam por mim — R$97
          </Link>
        </div>
      </section>

      <div className="border-t border-slate-100 pt-5 text-sm">
        <Link
          href={`/solicitacoes/${id}/perfil`}
          className="text-slate-500 hover:underline"
        >
          ← Editar respostas
        </Link>
      </div>
    </div>
  );
}
