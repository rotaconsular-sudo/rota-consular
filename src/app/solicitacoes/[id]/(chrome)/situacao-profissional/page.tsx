import { prisma } from "@/lib/prisma";
import { saveAnswer } from "@/app/actions";
import { StepFooter } from "@/components/StepFooter";

export default async function SituacaoProfissionalPage(
  props: PageProps<"/solicitacoes/[id]/situacao-profissional">,
) {
  const { id } = await props.params;

  const answer = await prisma.answer.findUnique({
    where: {
      applicationId_step: { applicationId: id, step: "SITUACAO_PROFISSIONAL" },
    },
  });

  const data = (answer?.data as Record<string, string>) ?? {};
  const action = saveAnswer.bind(
    null,
    id,
    "situacao-profissional",
    "SITUACAO_PROFISSIONAL",
  );

  return (
    <form action={action} className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Situação profissional</h2>
        <p className="mt-1 text-sm text-slate-500">
          É o principal fator de vínculo com o Brasil avaliado no consulado.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Vínculo</span>
          <select
            name="vinculo"
            defaultValue={data.vinculo ?? ""}
            required
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
          >
            <option value="" disabled>
              Selecione
            </option>
            <option value="clt">Carteira assinada (CLT)</option>
            <option value="servidor_publico">Servidor público</option>
            <option value="autonomo">Autônomo</option>
            <option value="empresario">Empresário(a)</option>
            <option value="estudante">Estudante</option>
            <option value="aposentado">Aposentado(a)</option>
            <option value="desempregado">Desempregado(a)</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Profissão</span>
          <input
            name="profissao"
            defaultValue={data.profissao}
            required
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            Tempo no emprego/negócio (anos)
          </span>
          <input
            name="tempoNoEmprego"
            type="number"
            min={0}
            step={0.5}
            defaultValue={data.tempoNoEmprego}
            required
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Renda mensal aproximada (R$)</span>
          <input
            name="rendaMensal"
            type="number"
            min={0}
            defaultValue={data.rendaMensal}
            required
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
          />
        </label>
      </div>

      <StepFooter applicationId={id} currentSlug="situacao-profissional" />
    </form>
  );
}
