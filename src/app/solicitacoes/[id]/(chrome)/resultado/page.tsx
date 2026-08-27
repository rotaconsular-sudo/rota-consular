import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UnlockChecklistButton } from "@/components/UnlockChecklistButton";
import type {
  AnalysisChecklistItem,
} from "@/lib/anthropic";

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

  const payments = await prisma.payment.findMany({ where: { applicationId: id } });
  const paid = payments.some((p) => p.status === "APPROVED");

  const checklist = result.checklist as unknown as AnalysisChecklistItem[];
  const alerts = result.alerts as unknown as string[];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-ink">Resultado da análise</h2>
        <p className="mt-1 text-sm text-slate-500">
          Isso é um checklist de prontidão da sua documentação, gerado
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
            Quanto sua documentação e vínculos parecem completos e
            consistentes (0-100)
          </p>
        </div>
      </div>

      {!paid && (
        <section className="flex flex-col gap-3 rounded-2xl border border-ink/20 bg-white p-5">
          <div>
            <h3 className="text-sm font-semibold text-ink">
              O que vem no checklist completo (R$47)
            </h3>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-slate-600">
              <li>
                • Status individual (ok / atenção / faltando) dos{" "}
                {checklist.length} itens avaliados
              </li>
              <li>
                • Explicação específica de cada item, citando os dados que
                você informou
              </li>
              <li>
                • Alertas do seu caso (ex: recusa anterior, vínculo
                financeiro fraco, viagem muito próxima da data)
              </li>
              <li>• Acesso permanente por e-mail, pra rever quando quiser</li>
            </ul>
          </div>
          <UnlockChecklistButton applicationId={id} />
        </section>
      )}

      {paid && alerts.length > 0 && (
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
                {paid ? (
                  <p className="text-slate-600">{entry.comentario}</p>
                ) : (
                  <p
                    aria-hidden
                    className="select-none text-slate-300"
                  >
                    ████████████████████████████
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

      <div className="flex items-center justify-between border-t border-slate-100 pt-5 text-sm">
        <Link href={`/solicitacoes/${id}/perfil`} className="text-slate-500 hover:underline">
          ← Editar respostas
        </Link>
        <Link href={`/solicitacoes/${id}/documentos`} className="font-medium text-accent hover:underline">
          Enviar documentos e refinar a análise →
        </Link>
      </div>
    </div>
  );
}
