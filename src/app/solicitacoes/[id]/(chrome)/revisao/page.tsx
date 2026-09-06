import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { WIZARD_STEPS } from "@/lib/wizard";
import { RunAnalysisButton } from "@/components/RunAnalysisButton";
import { QUIZ_QUESTIONS } from "@/lib/quizQuestions";

// Rótulos vêm do próprio quiz — não precisa manter dois lugares em sincronia.
const QUESTION_BY_ID = new Map(QUIZ_QUESTIONS.map((q) => [q.id, q]));

function fieldLabel(key: string) {
  return QUESTION_BY_ID.get(key)?.question ?? key;
}

function formatValue(key: string, value: unknown) {
  if (value === undefined || value === null || value === "") return "—";
  const str = String(value);
  const q = QUESTION_BY_ID.get(key);
  if (q?.kind === "choice") {
    return q.options.find((o) => o.key === str)?.label ?? str;
  }
  return str;
}

export default async function RevisaoPage(
  props: PageProps<"/solicitacoes/[id]/revisao">,
) {
  const { id } = await props.params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: { answers: true, analysisResult: true },
  });

  if (!application) return null;

  const answerSteps = WIZARD_STEPS.filter((s) => s.step !== null);
  const pendingSteps = answerSteps.filter(
    (s) => !application.answers.some((a) => a.step === s.step),
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-ink">Revisão</h2>
        <p className="mt-1 text-sm text-slate-500">
          Confira tudo antes de rodar a análise automática.
        </p>
      </div>

      {pendingSteps.length > 0 && (
        <div className="rounded-xl border border-warn/30 bg-warn/5 px-4 py-3 text-sm text-warn">
          Ainda falta preencher:{" "}
          {pendingSteps.map((s) => s.title).join(", ")}.
        </div>
      )}

      {answerSteps.map((step) => {
        const answer = application.answers.find((a) => a.step === step.step);
        const data = (answer?.data as Record<string, unknown>) ?? null;

        return (
          <section key={step.slug} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
              <Link
                href={`/solicitacoes/${id}/${step.slug}`}
                className="text-xs font-medium text-accent hover:underline"
              >
                Editar
              </Link>
            </div>
            {data ? (
              <dl className="grid gap-x-6 gap-y-1 rounded-xl bg-slate-50 p-3 text-sm sm:grid-cols-2">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-2">
                    <dt className="text-slate-500">{fieldLabel(key)}</dt>
                    <dd className="text-right font-medium text-ink">
                      {formatValue(key, value)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-400">
                Não preenchido ainda.
              </p>
            )}
          </section>
        );
      })}

      <div className="border-t border-slate-100 pt-5">
        {application.analysisResult && (
          <Link
            href={`/solicitacoes/${id}/resultado`}
            className="mb-3 block text-center text-sm font-medium text-accent hover:underline"
          >
            Ver análise já gerada
          </Link>
        )}

        {pendingSteps.length > 0 ? (
          <button
            type="button"
            disabled
            title="Preencha todas as etapas antes de rodar a análise"
            className="w-full cursor-not-allowed rounded-full bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500"
          >
            Rodar análise automática
          </button>
        ) : (
          <RunAnalysisButton
            applicationId={id}
            label={
              application.analysisResult
                ? "Rodar análise novamente"
                : "Rodar análise automática"
            }
          />
        )}
      </div>
    </div>
  );
}
