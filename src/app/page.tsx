import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createApplication, logout } from "@/app/actions";
import { WIZARD_STEPS } from "@/lib/wizard";
import { getAllPosts, formatPostDate } from "@/lib/blog";

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
  if (!session) return <InstitutionalHome />;
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

const DIFERENCIAIS = [
  {
    title: "Análise Inteligente de Perfil",
    description:
      "Em poucos minutos, nosso sistema lê suas respostas e te avisa exatamente onde você pode estar errando. Descubra os pontos fracos do seu perfil antes mesmo de pagar a cara taxa do visto",
    icon: IconSpark,
  },
  {
    title: "Lista de Documentos Exata",
    description:
      "Esqueça aquelas listas gigantes e confusas da internet. Você vai receber um checklist mastigado mostrando apenas os documentos que o seu caso precisa levar no dia da entrevista",
    icon: IconChecklist,
  },
  {
    title: "Preparação Sem Falsas Promessas",
    description:
      "Não vendemos milagres, jogamos limpo com você. Entregamos a preparação real para você sentar na frente do cônsul sabendo exatamente o que fazer, com total segurança e confiança",
    icon: IconShieldOutline,
  },
  {
    title: "Passo a Passo Descomplicado",
    description:
      "Preencher o formulário DS-160 não precisa dar dor de cabeça. Te guiamos pela mão em cada etapa para você não cometer erros bobos e economizar um bom dinheiro com despachantes",
    icon: IconSteps,
  },
];

function InstitutionalHome() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold text-blue-600">
            🇺🇸 ROTA CONSULAR
          </span>
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
            <Link href="/blog" className="hover:text-blue-600">
              Blog
            </Link>
            <Link href="/mapads160" className="hover:text-blue-600">
              Mapa do DS-160
            </Link>
            <Link href="/entrar" className="hover:text-blue-600">
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-16 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
            VISTO AMERICANO DE TURISMO (B1/B2)
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Preparação inteligente para o seu visto americano
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Análise de prontidão por IA, checklist do que falta organizar e um
            guia passo a passo para o DS-160 — para você chegar na entrevista
            com mais clareza e segurança.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/mapads160#analise-gratis"
              className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-xl"
            >
              Fazer análise grátis
            </Link>
            <Link
              href="/mapads160"
              className="rounded-full border border-slate-300 px-8 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              Conhecer o Mapa do DS-160
            </Link>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Como o Rota Consular ajuda
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DIFERENCIAIS.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.title}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{d.title}</p>
                  <p className="text-sm text-slate-600">{d.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* O que oferecemos */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            O que você encontra aqui
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <Link
              href="/mapads160#analise-gratis"
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                GRÁTIS
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Análise de prontidão
              </h3>
              <p className="text-sm text-slate-600">
                Responda algumas perguntas sobre o seu perfil e receba, na
                hora, o nível de prontidão da sua documentação para o visto.
              </p>
            </Link>
            <Link
              href="/mapads160"
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                MAPA DO DS-160
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Guia visual passo a passo
              </h3>
              <p className="text-sm text-slate-600">
                Preencha o formulário DS-160 com mais segurança, seguindo a
                mesma sequência apresentada no site oficial.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog teaser */}
      {posts.length > 0 && (
        <section className="bg-slate-50">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Últimas do blog
              </h2>
              <Link href="/blog" className="text-sm font-semibold text-blue-600 hover:underline">
                Ver blog completo →
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <time className="text-xs text-slate-400" dateTime={post.publishedAt}>
                    {formatPostDate(post.publishedAt)}
                  </time>
                  <p className="text-sm font-bold text-slate-900">{post.title}</p>
                  <p className="text-xs text-slate-600">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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

function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 3.5c.7 3 2.5 4.8 5.5 5.5-3 .7-4.8 2.5-5.5 5.5-.7-3-2.5-4.8-5.5-5.5 3-.7 4.8-2.5 5.5-5.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M18.5 15.5c.4 1.6 1.3 2.6 2.9 3-1.6.4-2.6 1.3-3 2.9-.4-1.6-1.3-2.6-2.9-3 1.6-.4 2.6-1.3 3-2.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function IconChecklist() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 9h8M8 12.5h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconSteps() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 18h4v-4H4v4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 13h4V9h-4v4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16 8h4V4h-4v4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function IconShieldOutline() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 3.5 19 6v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
