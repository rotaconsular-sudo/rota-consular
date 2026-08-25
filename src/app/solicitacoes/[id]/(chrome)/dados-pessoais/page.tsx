import { prisma } from "@/lib/prisma";
import { saveAnswer } from "@/app/actions";
import { StepFooter } from "@/components/StepFooter";

export default async function DadosPessoaisPage(
  props: PageProps<"/solicitacoes/[id]/dados-pessoais">,
) {
  const { id } = await props.params;

  const answer = await prisma.answer.findUnique({
    where: { applicationId_step: { applicationId: id, step: "DADOS_PESSOAIS" } },
  });

  const data = (answer?.data as Record<string, string>) ?? {};
  const action = saveAnswer.bind(null, id, "dados-pessoais", "DADOS_PESSOAIS");

  return (
    <form action={action} className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Dados pessoais</h2>
        <p className="mt-1 text-sm text-zinc-500">Quem é você.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium">Nome completo</span>
          <input
            name="nomeCompleto"
            defaultValue={data.nomeCompleto}
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Idade</span>
          <input
            name="idade"
            type="number"
            min={18}
            max={120}
            defaultValue={data.idade}
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Estado civil</span>
          <select
            name="estadoCivil"
            defaultValue={data.estadoCivil ?? ""}
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Selecione
            </option>
            <option value="solteiro">Solteiro(a)</option>
            <option value="casado">Casado(a)</option>
            <option value="divorciado">Divorciado(a)</option>
            <option value="viuvo">Viúvo(a)</option>
            <option value="uniao_estavel">União estável</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Cidade</span>
          <input
            name="cidade"
            defaultValue={data.cidade}
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">UF</span>
          <input
            name="uf"
            maxLength={2}
            defaultValue={data.uf}
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm uppercase"
          />
        </label>
      </div>

      <StepFooter applicationId={id} currentSlug="dados-pessoais" />
    </form>
  );
}
