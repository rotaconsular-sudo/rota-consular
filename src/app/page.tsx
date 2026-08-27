import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createApplication, logout } from "@/app/actions";
import { WIZARD_STEPS } from "@/lib/wizard";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import WavingFlag from "@/components/WavingFlag";

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
      {/* Capa */}
      <section className="relative isolate flex min-h-[92svh] flex-col overflow-hidden bg-[#070d1c]">
        <WavingFlag className="absolute inset-0 h-full w-full" />

        {/* Camadas de leitura: escurecem o pano sem apagar a bandeira */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(7,13,28,0.96)_0%,rgba(7,13,28,0.88)_30%,rgba(7,13,28,0.5)_55%,rgba(7,13,28,0.24)_78%,rgba(7,13,28,0.34)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070d1c]/90 via-transparent to-[#070d1c]/60" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-slate-50" />

        <header className="relative z-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
            <span className="text-sm font-bold tracking-[0.14em] text-white">
              ROTA CONSULAR
            </span>
            <nav className="flex items-center gap-6 text-sm font-medium text-white/70">
              <Link href="/blog" className="hidden transition hover:text-white sm:inline">
                Blog
              </Link>
              <Link href="/analise-de-perfil" className="hidden transition hover:text-white sm:inline">
                Análise de Perfil
              </Link>
              <Link href="/mapads160" className="hidden transition hover:text-white sm:inline">
                DS160 sem erros
              </Link>
              <Link
                href="/entrar"
                className="rounded-full border border-white/25 px-4 py-1.5 text-white transition hover:border-white/60 hover:bg-white/10"
              >
                Entrar
              </Link>
            </nav>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-16 sm:py-24">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-white/40" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
              Visto americano de turismo · B1/B2
            </span>
          </div>

          <h1 className="mt-7 max-w-4xl text-[clamp(2.5rem,6.6vw,5rem)] font-extrabold leading-[0.98] tracking-tight text-white">
            Preparação inteligente
            <br />
            para o seu{" "}
            <span className="text-blue-300">visto americano</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300">
            Análise de prontidão por IA, checklist do que falta organizar e um
            guia passo a passo para o DS-160 — para você chegar na entrevista
            com mais clareza e segurança.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/analise-de-perfil"
              className="rounded-full bg-white px-8 py-3.5 text-center text-sm font-bold text-slate-900 shadow-xl shadow-black/25 transition hover:bg-blue-50"
            >
              Fazer análise grátis
            </Link>
            <Link
              href="/mapads160"
              className="rounded-full border border-white/30 px-8 py-3.5 text-center text-sm font-bold text-white backdrop-blur-sm transition hover:border-white/70 hover:bg-white/10"
            >
              DS160 sem erros
            </Link>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
            ↓ Role para ver como funciona
          </span>
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
              href="/analise-de-perfil"
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                ANÁLISE GRÁTIS
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Descubra suas chances na hora
              </h3>
              <p className="text-sm text-slate-600">
                Responda um quiz rápido de 2 minutos e receba um diagnóstico
                imediato. Saiba se o seu perfil está pronto para aprovação ou
                se esconde alguma &quot;pegadinha&quot; que pode te fazer
                perder a taxa do visto.
              </p>
            </Link>
            <Link
              href="/mapads160"
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                🛡️ PREENCHIMENTO OFICIAL
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                O Fim do Medo de Errar no DS-160
              </h3>
              <p className="text-sm text-slate-600">
                Esqueça o site confuso em inglês. Use nosso formulário fácil
                no seu idioma e deixe o resto com a gente. Nossa equipe faz
                uma revisão humana minuciosa para evitar &quot;pegadinhas&quot;
                e transmite seus dados ao governo americano com zero risco de
                erros.
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
