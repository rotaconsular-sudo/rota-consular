import { prisma } from "@/lib/prisma";
import { saveAnswer } from "@/app/actions";
import { StepFooter } from "@/components/StepFooter";

export default async function MotivoViagemPage(
  props: PageProps<"/solicitacoes/[id]/motivo-viagem">,
) {
  const { id } = await props.params;

  const answer = await prisma.answer.findUnique({
    where: { applicationId_step: { applicationId: id, step: "MOTIVO_VIAGEM" } },
  });

  const data = (answer?.data as Record<string, string>) ?? {};
  const action = saveAnswer.bind(null, id, "motivo-viagem", "MOTIVO_VIAGEM");

  return (
    <form action={action} className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Motivo da viagem</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Por que você quer ir aos EUA e se tem vínculos por lá.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium">Motivo principal</span>
          <select
            name="motivo"
            defaultValue={data.motivo ?? ""}
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Selecione
            </option>
            <option value="turismo">Turismo / lazer</option>
            <option value="visita_familia_amigos">Visita a família ou amigos</option>
            <option value="convencao_evento">Convenção ou evento</option>
            <option value="outro">Outro</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Data pretendida da viagem</span>
          <input
            name="dataPretendidaViagem"
            type="date"
            defaultValue={data.dataPretendidaViagem}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Duração estimada (dias)</span>
          <input
            name="duracaoEstimadaDias"
            type="number"
            min={1}
            defaultValue={data.duracaoEstimadaDias}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            name="temParenteNosEUA"
            defaultChecked={data.temParenteNosEUA === "on"}
            className="h-4 w-4 rounded border-zinc-300"
          />
          <span className="text-sm">Tenho parente(s) morando nos EUA</span>
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium">
            Se sim, quem (opcional)
          </span>
          <input
            name="nomeParente"
            defaultValue={data.nomeParente}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <StepFooter applicationId={id} currentSlug="motivo-viagem" />
    </form>
  );
}
