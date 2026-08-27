import { prisma } from "@/lib/prisma";
import { saveAnswer } from "@/app/actions";
import { StepFooter } from "@/components/StepFooter";

export default async function HistoricoViagensPage(
  props: PageProps<"/solicitacoes/[id]/historico-viagens">,
) {
  const { id } = await props.params;

  const answer = await prisma.answer.findUnique({
    where: {
      applicationId_step: { applicationId: id, step: "HISTORICO_VIAGENS" },
    },
  });

  const data = (answer?.data as Record<string, string>) ?? {};
  const action = saveAnswer.bind(null, id, "historico-viagens", "HISTORICO_VIAGENS");

  return (
    <form action={action} className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Histórico de viagens</h2>
        <p className="mt-1 text-sm text-slate-500">
          Uma recusa anterior muda bastante a orientação — não tem problema
          ter tido uma, só precisamos saber.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="jaViajouInternacional"
            defaultChecked={data.jaViajouInternacional === "on"}
            className="h-4 w-4 rounded border-slate-300 accent-ink"
          />
          <span className="text-sm">Já viajei para outros países antes</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="jaTeveVistoAmericano"
            defaultChecked={data.jaTeveVistoAmericano === "on"}
            className="h-4 w-4 rounded border-slate-300 accent-ink"
          />
          <span className="text-sm">Já tive visto americano antes</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="vistoNegadoAntes"
            defaultChecked={data.vistoNegadoAntes === "on"}
            className="h-4 w-4 rounded border-slate-300 accent-ink"
          />
          <span className="text-sm">Já tive um visto americano negado</span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            Se sim, conte o que aconteceu (opcional)
          </span>
          <textarea
            name="detalhesRecusa"
            defaultValue={data.detalhesRecusa}
            rows={3}
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
          />
        </label>
      </div>

      <StepFooter applicationId={id} currentSlug="historico-viagens" />
    </form>
  );
}
