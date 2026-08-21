import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { WIZARD_STEPS } from "@/lib/wizard";
import { RunAnalysisButton } from "@/components/RunAnalysisButton";

const FIELD_LABEL: Record<string, string> = {
  nomeCompleto: "Nome completo",
  idade: "Idade",
  estadoCivil: "Estado civil",
  cidade: "Cidade",
  uf: "UF",
  vinculo: "Vínculo",
  profissao: "Profissão",
  tempoNoEmprego: "Tempo no emprego/negócio (anos)",
  rendaMensal: "Renda mensal (R$)",
  jaViajouInternacional: "Já viajou internacionalmente",
  jaTeveVistoAmericano: "Já teve visto americano",
  vistoNegadoAntes: "Visto negado antes",
  detalhesRecusa: "Detalhes da recusa",
  motivo: "Motivo da viagem",
  dataPretendidaViagem: "Data pretendida",
  duracaoEstimadaDias: "Duração estimada (dias)",
  temParenteNosEUA: "Tem parente nos EUA",
  nomeParente: "Nome do parente",
};

const DOCUMENT_TYPE_LABEL: Record<string, string> = {
  IDENTIDADE: "RG / CPF / Passaporte",
  COMPROVANTE_RENDA: "Comprovante de renda",
  EXTRATO_BANCARIO: "Extrato bancário",
  VINCULO_EMPREGATICIO: "Comprovante de vínculo empregatício",
  ITINERARIO: "Itinerário",
  OUTRO: "Outro",
};

const VALUE_LABEL: Record<string, string> = {
  solteiro: "Solteiro(a)",
  casado: "Casado(a)",
  divorciado: "Divorciado(a)",
  viuvo: "Viúvo(a)",
  uniao_estavel: "União estável",
  clt: "Carteira assinada (CLT)",
  servidor_publico: "Servidor público",
  autonomo: "Autônomo",
  empresario: "Empresário(a)",
  estudante: "Estudante",
  aposentado: "Aposentado(a)",
  desempregado: "Desempregado(a)",
  turismo: "Turismo / lazer",
  visita_familia_amigos: "Visita a família ou amigos",
  convencao_evento: "Convenção ou evento",
  outro: "Outro",
};

function formatValue(value: unknown) {
  if (value === "on") return "Sim";
  if (value === undefined || value === null || value === "") return "—";
  const str = String(value);
  return VALUE_LABEL[str] ?? str;
}

export default async function RevisaoPage(
  props: PageProps<"/solicitacoes/[id]/revisao">,
) {
  const { id } = await props.params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: { answers: true, documents: true, analysisResult: true },
  });

  if (!application) return null;

  const answerSteps = WIZARD_STEPS.filter((s) => s.step !== null);
  const pendingSteps = answerSteps.filter(
    (s) => !application.answers.some((a) => a.step === s.step),
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-semibold">Revisão</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Confira tudo antes de rodar a análise automática.
        </p>
      </div>

      {pendingSteps.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
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
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <Link
                href={`/solicitacoes/${id}/${step.slug}`}
                className="text-xs text-blue-700 hover:underline"
              >
                Editar
              </Link>
            </div>
            {data ? (
              <dl className="grid gap-x-6 gap-y-1 rounded-md bg-zinc-50 p-3 text-sm sm:grid-cols-2">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-2">
                    <dt className="text-zinc-500">
                      {FIELD_LABEL[key] ?? key}
                    </dt>
                    <dd className="text-right font-medium">
                      {formatValue(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="rounded-md bg-zinc-50 p-3 text-sm text-zinc-400">
                Não preenchido ainda.
              </p>
            )}
          </section>
        );
      })}

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Documentos</h3>
          <Link
            href={`/solicitacoes/${id}/documentos`}
            className="text-xs text-blue-700 hover:underline"
          >
            Editar
          </Link>
        </div>
        {application.documents.length > 0 ? (
          <ul className="rounded-md bg-zinc-50 p-3 text-sm">
            {application.documents.map((doc) => (
              <li key={doc.id} className="flex justify-between gap-2">
                <span className="text-zinc-500">
                  {DOCUMENT_TYPE_LABEL[doc.type] ?? doc.type}
                </span>
                <span className="font-medium">{doc.fileName}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md bg-zinc-50 p-3 text-sm text-zinc-400">
            Nenhum documento adicionado ainda.
          </p>
        )}
      </section>

      <div className="border-t border-zinc-100 pt-5">
        {application.analysisResult && (
          <Link
            href={`/solicitacoes/${id}/resultado`}
            className="mb-3 block text-center text-sm text-blue-700 hover:underline"
          >
            Ver análise já gerada
          </Link>
        )}

        {pendingSteps.length > 0 ? (
          <button
            type="button"
            disabled
            title="Preencha todas as etapas antes de rodar a análise"
            className="w-full cursor-not-allowed rounded-lg bg-zinc-200 px-5 py-3 text-sm font-medium text-zinc-500"
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
