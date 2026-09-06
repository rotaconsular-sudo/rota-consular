import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { AnalysisChecklistItem } from "@/lib/anthropic";

const STATUS_STYLE: Record<string, string> = {
  ok: "border border-ok/30 bg-ok/5 text-ok",
  atencao: "border border-warn/30 bg-warn/5 text-warn",
  faltando: "border border-err/30 bg-err/5 text-err",
};

const STATUS_LABEL: Record<string, string> = {
  ok: "Ok",
  atencao: "Atenção",
  faltando: "Faltando",
};

function scoreColor(score: number) {
  if (score >= 75) return "text-ok";
  if (score >= 45) return "text-warn";
  return "text-err";
}

export default async function ResultadoPage(
  props: PageProps<"/solicitacoes/[id]/resultado">,
) {
  const { id } = await props.params;

  const result = await prisma.analysisResult.findUnique({
    where: { applicationId: id },
  });

  if (!result) notFound();

  const checklist = result.checklist as unknown as AnalysisChecklistItem[];
  const alerts = result.alerts as unknown as string[];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-ink">Resultado da análise</h2>
        <p className="mt-1 text-sm text-slate-500">
          Isso é um checklist de prontidão da sua preparação, gerado
          automaticamente — nunca uma previsão ou garantia de aprovação. A
          decisão é sempre do oficial consular americano.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className={`text-4xl font-extrabold ${scoreColor(result.readinessScore)}`}>
          {result.readinessScore}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Nível de prontidão</p>
          <p className="text-xs text-slate-500">
            Quanto sua preparação e seus vínculos parecem completos e
            consistentes (0-100)
          </p>
        </div>
      </div>

      {alerts.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-ink">Alertas</h3>
          <ul className="flex flex-col gap-2">
            {alerts.map((alert, i) => (
              <li
                key={i}
                className="rounded-xl border border-warn/30 bg-warn/5 px-4 py-2.5 text-sm text-warn"
              >
                {alert}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-ink">Checklist</h3>
        <ul className="flex flex-col gap-2">
          {checklist.map((entry, i) => (
            <li
              key={i}
              className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-3 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <div>
                <p className="font-medium text-ink">{entry.item}</p>
                <p className="text-slate-600">{entry.comentario}</p>
              </div>
              <span
                className={`shrink-0 self-start rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[entry.status]}`}
              >
                {STATUS_LABEL[entry.status] ?? entry.status}
              </span>
            </li>
          ))}
        </ul>
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
