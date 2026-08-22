import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createApplication, logout, startFreeApplication } from "@/app/actions";
import { WIZARD_STEPS } from "@/lib/wizard";

const STATUS_LABEL: Record<string, string> = {
  EM_ANDAMENTO: "Em andamento",
  ANALISE_PRONTA: "Análise pronta",
  CONCLUIDA: "Concluída",
};

const STATUS_STYLE: Record<string, string> = {
  EM_ANDAMENTO: "bg-amber-100 text-amber-800",
  ANALISE_PRONTA: "bg-emerald-100 text-emerald-800",
  CONCLUIDA: "bg-zinc-200 text-zinc-700",
};

export default async function HomePage() {
  const session = await getSession();
  if (!session) return <FreeStartLanding />;
  const user = session.user;

  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { answers: true },
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-700">Rota Consular</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Minhas solicitações
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Preparação para o visto americano de turismo (B1/B2). Isso não é
            uma garantia de aprovação — a decisão é sempre do consulado.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 pt-1">
          <span className="text-xs text-zinc-500">{user.email}</span>
          <form action={logout}>
            <button type="submit" className="text-xs text-zinc-500 hover:underline">
              Sair
            </button>
          </form>
        </div>
      </header>

      {applications.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
          <p className="text-sm text-zinc-600">
            Você ainda não começou nenhuma solicitação.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {applications.map((app) => {
            const completedSteps = new Set(app.answers.map((a) => a.step));
            const totalTrackedSteps = WIZARD_STEPS.filter(
              (s) => s.step !== null,
            ).length;

            return (
              <li key={app.id}>
                <Link
                  href={`/solicitacoes/${app.id}/${WIZARD_STEPS[0].slug}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-5 py-4 transition hover:border-blue-300 hover:shadow-sm"
                >
                  <div>
                    <p className="font-medium">
                      Solicitação de{" "}
                      {new Date(app.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="mt-0.5 text-sm text-zinc-500">
                      {completedSteps.size} de {totalTrackedSteps} etapas
                      preenchidas
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[app.status]}`}
                  >
                    {STATUS_LABEL[app.status]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <form action={createApplication}>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-800"
        >
          Nova solicitação
        </button>
      </form>
    </div>
  );
}

function FreeStartLanding() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-6 py-16">
      <div>
        <p className="text-sm font-medium text-blue-700">Rota Consular</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Descubra o quanto sua documentação está pronta pro visto americano
          de turismo
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          Responda algumas perguntas e receba uma análise automática por IA —
          sem precisar enviar nenhum documento agora. Isso não é uma garantia
          de aprovação, é uma preparação: a decisão é sempre do consulado.
        </p>
      </div>

      <form
        action={startFreeApplication}
        className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">E-mail</span>
          <input
            name="email"
            type="email"
            required
            placeholder="seu@email.com"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">WhatsApp</span>
          <input
            name="whatsapp"
            type="tel"
            required
            placeholder="(11) 99999-9999"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <button
          type="submit"
          className="mt-2 w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-800"
        >
          Começar análise gratuita
        </button>
      </form>

      <p className="text-center text-xs text-zinc-400">
        Já tem uma solicitação paga?{" "}
        <Link href="/entrar" className="text-blue-700 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
