import type { ReactNode } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createApplication, logout } from "@/app/actions";
import { WIZARD_STEPS } from "@/lib/wizard";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import WavingFlag from "@/components/WavingFlag";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const STATUS_LABEL: Record<string, string> = {
  EM_ANDAMENTO: "Em andamento",
  ANALISE_PRONTA: "Análise pronta",
  CONCLUIDA: "Concluída",
};

const STATUS_STYLE: Record<string, string> = {
  EM_ANDAMENTO: "border border-warn/30 bg-warn/5 text-warn",
  ANALISE_PRONTA: "border border-ok/30 bg-ok/5 text-ok",
  CONCLUIDA: "border border-slate-300 text-slate-600",
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
    <div className="flex flex-1 flex-col">
      <SiteHeader variant="minimal">
        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-slate-500 sm:inline">{user.email}</span>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-ink transition hover:border-hairline"
            >
              Sair
            </button>
          </form>
        </div>
      </SiteHeader>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
            Minhas solicitações
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Preparação para o visto americano de turismo (B1/B2). Isso não é
            uma garantia de aprovação — a decisão é sempre do consulado.
          </p>
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
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-slate-400"
                >
                  <div>
                    <p className="font-semibold text-ink">
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
            className="w-full rounded-full bg-brand px-5 py-3.5 text-sm font-bold text-star transition hover:bg-brand-strong"
          >
            Nova solicitação
          </button>
        </form>
      </div>
    </div>
  );
}

const HERO_BULLETS = [
  "Análise dos seus vínculos com o Brasil — o que pesa no 214(b)",
  "Checklist de documentos do seu perfil, não uma lista genérica",
  "DS-160 em português, com revisão humana antes do envio",
  "Simulação da entrevista com as perguntas reais do consulado",
];

const DIFERENCIAIS = [
  {
    title: "Análise de perfil",
    description:
      "Um questionário curto lê as suas respostas e aponta, na hora, onde o seu perfil está forte e onde está frágil aos olhos do consulado.",
    icon: IconSpark,
  },
  {
    title: "Checklist por perfil",
    description:
      "CLT, autônomo, MEI, aposentado, estudante ou menor: cada caso tem uma lista de documentos própria. Você leva só o que o seu precisa.",
    icon: IconChecklist,
  },
  {
    title: "DS-160 sem erro",
    description:
      "O formulário oficial preenchido no seu idioma, com revisão humana campo a campo. O erro no DS-160 é o que mais derruba a entrevista.",
    icon: IconSteps,
  },
  {
    title: "Sem falsas promessas",
    description:
      "A decisão é sempre do oficial consular. Não vendemos milagre — tiramos do seu caminho os erros que fazem perder a taxa.",
    icon: IconShieldOutline,
  },
];

const PASSOS = [
  {
    t: "Você faz o Raio-X grátis",
    d: "Um questionário rápido sobre emprego, renda, família, patrimônio e o roteiro que pretende fazer. Leva 2 minutos.",
  },
  {
    t: "A análise aponta os riscos",
    d: "Resultado na hora, em linguagem simples: o que joga a seu favor, o que vale reforçar e onde há ponto de atenção que pode virar recusa.",
  },
  {
    t: "Você corrige antes de agendar",
    d: "Cada ponto fraco vem com o que fazer: qual documento buscar, como ajustar o roteiro, o que organizar no extrato.",
  },
  {
    t: "DS-160 revisado e entrevista treinada",
    d: "Preenchemos o formulário com você e fazemos uma simulação com as perguntas reais do consulado, até a resposta sair natural.",
  },
  {
    t: "Você entra na entrevista preparado",
    d: "Sabendo o que levar, o que dizer e por que cada escolha do seu processo faz sentido.",
  },
];

function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-0.5 w-6 bg-brand" />
      <span className="eyebrow text-slate-500">{children}</span>
    </div>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 fill-brand" aria-hidden>
      <path d="M8 0l2 5 5 .4-3.8 3.3 1.2 5L8 12.6 3.4 15.7l1.2-5L.8 5.4 5.8 5z" />
    </svg>
  );
}

function InstitutionalHome() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-ink">
      {/* Capa */}
      <section className="relative isolate flex min-h-[92svh] flex-col overflow-hidden bg-[#0a1b3d]">
        <WavingFlag className="absolute inset-0 h-full w-full" />

        {/* Camadas de leitura: escurecem o pano sem apagar a bandeira */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(7,13,28,0.96)_0%,rgba(7,13,28,0.88)_30%,rgba(7,13,28,0.5)_55%,rgba(7,13,28,0.24)_78%,rgba(7,13,28,0.34)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1b3d]/90 via-transparent to-[#0a1b3d]/60" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-slate-50" />

        <SiteHeader variant="dark" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-20 sm:py-28 sm:py-24">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-white/40" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-star/70">
              Visto americano de turismo · B1/B2
            </span>
          </div>

          <h1 className="mt-7 max-w-4xl text-[clamp(2.5rem,6.6vw,5rem)] font-extrabold leading-[0.98] tracking-tight text-star">
            Preparação inteligente
            <br />
            para o seu{" "}
            <span className="text-accent-soft">visto americano</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300">
            Um Raio-X completo das suas chances, um checklist à prova de
            falhas e o passo a passo exato para o DS-160. Evite erros
            críticos, organize seus documentos com excelência e vá para o
            consulado com total segurança.
          </p>

          <ul className="mt-7 flex max-w-xl flex-col gap-2.5">
            {HERO_BULLETS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-slate-200">
                <Star />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/analise-de-perfil"
              className="rounded-full bg-brand px-8 py-3.5 text-center text-sm font-bold text-star shadow-xl shadow-black/25 transition hover:bg-brand-strong"
            >
              Fazer minha análise grátis →
            </Link>
            <Link
              href="/mapads160"
              className="rounded-full border border-star/30 px-8 py-3.5 text-center text-sm font-bold text-star backdrop-blur-sm transition hover:border-star/70 hover:bg-white/10"
            >
              DS-160 sem erros
            </Link>
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-star/50">
            2 min · sem cartão · resultado na hora
          </p>
        </div>
      </section>

      <hr className="stripes" />

      {/* O que você recebe */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <Kicker>O que você recebe</Kicker>
            <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Quatro coisas que decidem a sua entrevista — todas cobertas.
            </h2>
            <p className="mt-4 text-slate-600">
              Não vendemos milagre. A decisão é sempre do oficial consular. O
              que a gente faz é tirar do seu caminho os erros que fazem perder
              a taxa.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {DIFERENCIAIS.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.title}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-brand">
                    <Icon />
                  </div>
                  <p className="font-bold text-ink">{d.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {d.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="stripes" />

      {/* Como funciona */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <Kicker>Como funciona</Kicker>
            <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Do &ldquo;será que passo?&rdquo; ao consulado, sem improviso.
            </h2>
          </div>
          <div className="mt-10 flex flex-col">
            {PASSOS.map((p, i) => (
              <div
                key={p.t}
                className="grid grid-cols-[52px_1fr] gap-5 border-t border-slate-200 py-6 first:border-t-0 sm:grid-cols-[68px_1fr]"
              >
                <span className="font-mono text-2xl font-medium leading-none text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-ink">{p.t}</h3>
                  <p className="mt-2 max-w-xl text-slate-600">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="stripes" />

      {/* O que você encontra aqui */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <Kicker>Por onde começar</Kicker>
            <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Comece pelo grátis. Só avança quem quiser.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <Link
              href="/analise-de-perfil"
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-7 transition hover:border-slate-400"
            >
              <span className="eyebrow text-brand">Análise grátis</span>
              <h3 className="mt-3 text-lg font-bold text-ink">
                Descubra suas chances na hora
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Um quiz de 2 minutos e um diagnóstico imediato: se o seu perfil
                está pronto ou se esconde uma &ldquo;pegadinha&rdquo; que pode
                te fazer perder a taxa.
              </p>
              <span className="mt-4 text-sm font-semibold text-accent transition group-hover:text-ink">
                Fazer o Raio-X →
              </span>
            </Link>
            <Link
              href="/mapads160"
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-7 transition hover:border-slate-400"
            >
              <span className="eyebrow text-slate-500">Preenchimento oficial</span>
              <h3 className="mt-3 text-lg font-bold text-ink">
                O fim do medo de errar no DS-160
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Formulário fácil no seu idioma + revisão humana campo a campo
                antes do envio ao governo americano. Zero risco de erro bobo.
              </p>
              <span className="mt-4 text-sm font-semibold text-accent transition group-hover:text-ink">
                Ver o DS-160 sem erros →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <>
          <hr className="stripes" />
          <section className="bg-white">
            <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Kicker>Do blog</Kicker>
                  <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                    Chegue informado.
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-sm font-semibold text-accent hover:text-ink"
                >
                  Ver blog completo →
                </Link>
              </div>
              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-400"
                  >
                    <time
                      className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400"
                      dateTime={post.publishedAt}
                    >
                      {formatPostDate(post.publishedAt)}
                    </time>
                    <p className="text-sm font-bold leading-snug text-ink">
                      {post.title}
                    </p>
                    <p className="text-xs leading-relaxed text-slate-600">
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <hr className="stripes" />

      {/* CTA final */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-24">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Comece pelo Raio-X. Ele é grátis e leva 2 minutos.
          </h2>
          <Link
            href="/analise-de-perfil"
            className="mt-7 inline-block rounded-full bg-brand px-8 py-4 text-sm font-bold text-star transition hover:bg-brand-strong"
          >
            Fazer minha análise grátis →
          </Link>
        </div>
      </section>

      <SiteFooter />
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
