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

const HOW_IT_WORKS = [
  {
    title: "Responda o quiz (2 minutos)",
    description:
      "Perguntas objetivas sobre trabalho, renda, viagens e vínculos com o Brasil — sem enviar nenhum documento agora.",
  },
  {
    title: "Receba seu score na hora",
    description:
      "Assim que você termina, nossa IA calcula seu nível de prontidão (0-100) e mostra na tela.",
  },
  {
    title: "Aprofunde se quiser",
    description:
      "Desbloqueie o checklist completo por R$47 — item por item, com o que ajustar antes da entrevista.",
  },
];

function FreeStartLanding() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-zinc-100 bg-white">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-20 text-center">
          <p className="text-sm font-medium text-blue-700">Rota Consular</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Sua análise de prontidão pro visto americano, grátis e na hora
          </h1>
          <p className="max-w-xl text-base text-zinc-600">
            Responda um quiz rápido e nossa IA avalia seus vínculos com o
            Brasil, seu histórico e sua documentação — a mesma lógica usada
            nas análises da nossa assessoria, sem custo e sem compromisso.
          </p>
          <a
            href="#comecar"
            className="mt-2 rounded-lg bg-blue-700 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-800 hover:shadow-md"
          >
            Fazer minha análise de perfil grátis →
          </a>
          <p className="text-xs text-zinc-400">
            Leva menos de 2 minutos. Sem cartão, sem CPF nessa etapa.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 py-16">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Como funciona
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <p className="font-medium">{step.title}</p>
              <p className="text-sm text-zinc-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-2xl px-6 py-10 text-center text-sm text-zinc-500">
          Isso não é uma promessa de aprovação — a decisão final é sempre do
          oficial consular americano. A análise avalia só a prontidão da sua
          documentação e dos seus vínculos com o Brasil, pra você chegar mais
          preparado(a) na entrevista. Rota Consular é uma consultoria
          privada, não afiliada ao governo dos Estados Unidos, ao Consulado
          ou à Embaixada americana.
        </div>
      </section>

      <section id="comecar" className="mx-auto w-full max-w-md flex-1 px-6 py-16">
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Comece sua análise gratuita</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Só pra saber pra onde mandar o resultado.
          </p>

          <form action={startFreeApplication} className="mt-5 flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Seu melhor e-mail</span>
              <input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
              <span className="text-xs text-zinc-400">
                É pra onde mandamos o resultado da sua análise.
              </span>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Seu WhatsApp</span>
              <input
                name="whatsapp"
                type="tel"
                required
                placeholder="(11) 99999-9999"
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
              <span className="text-xs text-zinc-400">
                Usamos só pra avisar quando sua análise estiver pronta — sem
                spam.
              </span>
            </label>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-800"
            >
              Começar análise gratuita
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Já tem uma solicitação paga?{" "}
          <Link href="/entrar" className="text-blue-700 hover:underline">
            Entrar
          </Link>
        </p>
      </section>
    </div>
  );
}
