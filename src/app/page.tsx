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
  CONCLUIDA: "bg-slate-200 text-slate-700",
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
          <p className="text-sm font-semibold text-blue-600">Rota Consular</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Minhas solicitações
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Preparação para o visto americano de turismo (B1/B2). Isso não é
            uma garantia de aprovação — a decisão é sempre do consulado.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 pt-1">
          <span className="text-xs text-slate-500">{user.email}</span>
          <form action={logout}>
            <button type="submit" className="text-xs text-slate-500 hover:underline">
              Sair
            </button>
          </form>
        </div>
      </header>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
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
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      Solicitação de{" "}
                      {new Date(app.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {completedSteps.size} de {totalTrackedSteps} etapas
                      preenchidas
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[app.status]}`}
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
          className="w-full rounded-full bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
        >
          Nova solicitação
        </button>
      </form>
    </div>
  );
}

const HOW_IT_WORKS = [
  {
    title: "O Diagnóstico Express (Grátis)",
    description:
      "Responda um quiz inteligente e objetivo de 2 minutos sobre sua vida no Brasil. Sem envio de documentos chatos agora.",
    icon: IconClipboard,
    highlight: false,
  },
  {
    title: "Seu Score de Prontidão (Grátis)",
    description:
      'Assim que você termina, nossa IA cruza seus dados e gera um "Termômetro de Prontidão" na tela, mostrando a força atual do seu perfil e os pontos de atenção.',
    icon: IconGauge,
    highlight: false,
  },
  {
    title: "O Checklist Completo (Opcional — R$47)",
    description:
      "Quer se preparar sozinho(a) com mais segurança? Desbloqueie o status detalhado de cada critério avaliado — vínculos, renda, histórico, documentação — com o comentário da IA explicando o que ajustar em cada um.",
    icon: IconMap,
    highlight: true,
  },
];

function FreeStartLanding() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-slate-900">
      <section className="bg-slate-50">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
            🇺🇸 VISTO AMERICANO: FAÇA VOCÊ MESMO, MAS NÃO TENTE NO ESCURO
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Descubra o que falta pra sua documentação estar{" "}
            <span className="text-blue-600">pronta</span> pro Visto Americano
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Nossa Inteligência Artificial analisa seus vínculos, histórico e
            renda em 2 minutos. Descubra seus pontos cegos e receba o caminho
            pra chegar mais preparado(a) na entrevista — antes mesmo de pagar
            a taxa consular.
          </p>
          <a
            href="#comecar"
            className="mt-2 rounded-full bg-blue-600 px-9 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-xl"
          >
            ➔ Fazer Minha Análise de Perfil Gratuita
          </a>
          <p className="text-sm text-slate-500">
            🔒 100% seguro e sigiloso. Leva apenas 2 minutos. Sem necessidade
            de cartão de crédito.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            A maioria dos vistos negados não é por falta de dinheiro, é por
            falta de estratégia.
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Todos os meses, milhares de brasileiros têm o visto negado e
            perdem a taxa de $185 dólares simplesmente porque preenchem o
            formulário DS-160 como se fosse um cadastro de loja. Eles não
            entendem a lógica que os cônsules usam pra avaliar os perfis. Não
            cometa esse erro — antecipe os problemas antes de sentar na
            frente do oficial consular.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          Do zero à confiança total em 3 passos simples
        </h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className={`flex flex-col gap-3 rounded-2xl border bg-white p-6 shadow-sm ${
                  step.highlight
                    ? "border-blue-200 ring-1 ring-blue-100"
                    : "border-slate-200"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Passo {i + 1}
                </p>
                <p className="font-semibold text-slate-900">{step.title}</p>
                <p className="text-sm text-slate-600">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section
        id="comecar"
        className="mx-auto w-full max-w-md flex-1 px-6 py-16"
      >
        <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-xl shadow-slate-900/5">
          <h2 className="text-xl font-bold text-slate-900">
            Comece sua análise gratuita agora
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Só precisamos saber pra onde enviar o resultado do seu
            diagnóstico.
          </p>

          <form action={startFreeApplication} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">
                Seu melhor e-mail
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">
                Seu WhatsApp
              </span>
              <input
                name="whatsapp"
                type="tel"
                required
                placeholder="(11) 99999-9999"
                className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </label>

            <p className="text-xs text-slate-400">
              Usamos apenas para enviar o link do seu resultado, sem spam.
            </p>

            <button
              type="submit"
              className="mt-1 w-full rounded-full bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
            >
              ➔ Iniciar Diagnóstico Agora
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Já tem uma solicitação paga?{" "}
          <Link href="/entrar" className="text-blue-600 hover:underline">
            Entrar
          </Link>
        </p>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-10 text-center text-xs text-slate-400">
          O Rota Consular é uma ferramenta de tecnologia e inteligência
          estratégica. Não somos afiliados ao governo dos Estados Unidos, à
          Embaixada ou ao Consulado americano. Isso não é uma promessa de
          aprovação — a decisão final é sempre do oficial consular
          americano. Nossa missão é te ajudar a chegar na entrevista com a
          melhor estratégia e documentação possível.
        </div>
      </footer>
    </div>
  );
}

function IconClipboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M9 4.5h6a1 1 0 0 1 1 1V6h1.5A1.5 1.5 0 0 1 19 7.5v11A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-11A1.5 1.5 0 0 1 6.5 6H8v-.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12h6M9 15.5h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGauge() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M4.5 15a7.5 7.5 0 1 1 15 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 15 15 10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15" r="1.3" fill="currentColor" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M9 5 4.5 6.8v11.7L9 16.5m0-11.5 6 2m-6-2v11.5m6-9.5 4.5-1.8v11.7L15 18.5m0-11.5-6 2m6-2v11.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
