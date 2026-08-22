import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UnlockChecklistButton } from "@/components/UnlockChecklistButton";
import type {
  AnalysisChecklistItem,
} from "@/lib/anthropic";

const STATUS_STYLE: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-800",
  atencao: "bg-amber-100 text-amber-800",
  faltando: "bg-red-100 text-red-800",
};

const STATUS_LABEL: Record<string, string> = {
  ok: "Ok",
  atencao: "Atenção",
  faltando: "Faltando",
};

function scoreColor(score: number) {
  if (score >= 75) return "text-emerald-700";
  if (score >= 45) return "text-amber-700";
  return "text-red-700";
}

export default async function ResultadoPage(
  props: PageProps<"/solicitacoes/[id]/resultado">,
) {
  const { id } = await props.params;

  const result = await prisma.analysisResult.findUnique({
    where: { applicationId: id },
  });

  if (!result) notFound();

  const payments = await prisma.payment.findMany({ where: { applicationId: id } });
  const paid = payments.some((p) => p.status === "APPROVED");

  const checklist = result.checklist as unknown as AnalysisChecklistItem[];
  const alerts = result.alerts as unknown as string[];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-semibold">Resultado da análise</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Isso é um checklist de prontidão da sua documentação, gerado
          automaticamente — nunca uma previsão ou garantia de aprovação. A
          decisão é sempre do oficial consular americano.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-5">
        <div className={`text-4xl font-bold ${scoreColor(result.readinessScore)}`}>
          {result.readinessScore}
        </div>
        <div>
          <p className="text-sm font-medium">Nível de prontidão</p>
          <p className="text-xs text-zinc-500">
            Quanto sua documentação e vínculos parecem completos e
            consistentes (0-100)
          </p>
        </div>
      </div>

      {!paid && (
        <section className="flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50 p-5">
          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              Checklist completo e alertas bloqueados
            </h3>
            <p className="mt-1 text-sm text-blue-800">
              O nível de prontidão é grátis. Pra ver o que exatamente falta ou
              está fraco em cada item — e os alertas específicos do seu
              caso — desbloqueie o checklist completo.
            </p>
          </div>
          <UnlockChecklistButton applicationId={id} />
        </section>
      )}

      {paid && alerts.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Alertas</h3>
          <ul className="flex flex-col gap-2">
            {alerts.map((alert, i) => (
              <li
                key={i}
                className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900"
              >
                {alert}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Checklist</h3>
        <ul className="flex flex-col gap-2">
          {checklist.map((entry, i) => (
            <li
              key={i}
              className="flex flex-col gap-1 rounded-md border border-zinc-200 p-3 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <div>
                <p className="font-medium">{entry.item}</p>
                {paid ? (
                  <p className="text-zinc-600">{entry.comentario}</p>
                ) : (
                  <p className="text-zinc-400 select-none blur-[3px]">
                    {entry.comentario}
                  </p>
                )}
              </div>
              {paid && (
                <span
                  className={`shrink-0 self-start rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[entry.status]}`}
                >
                  {STATUS_LABEL[entry.status] ?? entry.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="border-t border-zinc-100 pt-5">
        <Link
          href={`/solicitacoes/${id}/revisao`}
          className="text-sm text-blue-700 hover:underline"
        >
          ← Voltar à revisão
        </Link>
      </div>
    </div>
  );
}
