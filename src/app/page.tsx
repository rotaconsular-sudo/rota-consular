import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createApplication, logout, startFreeApplication } from "@/app/actions";
import { WIZARD_STEPS } from "@/lib/wizard";
import { FLAGSHIP_PRODUCT } from "@/lib/products";

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
  if (!session) return <SalesLanding />;
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

const GUIDE_FEATURES = [
  {
    title: "Guia visual organizado conforme a sequência do formulário",
    icon: IconClipboard,
  },
  {
    title: "Explicação dos principais campos do DS-160",
    icon: IconDocument,
  },
  {
    title: "Orientações para diferentes situações de preenchimento",
    icon: IconRoute,
  },
  {
    title: "Alertas e pontos de atenção em cada etapa",
    icon: IconAlert,
  },
  {
    title: "Passo a passo da abertura até o envio do formulário",
    icon: IconClipboard,
  },
];

const IDEAL_FOR = [
  "Preencher o DS-160 por conta própria",
  "Entender o que cada etapa do formulário está solicitando",
  "Evitar dúvidas durante o preenchimento",
  "Seguir um processo prático, organizado e visual",
  "Consultar rapidamente sempre que surgir uma dúvida",
];

const ACCESS_STEPS = [
  { title: "Conclua sua compra", icon: IconOrder },
  { title: "Receba o acesso imediatamente no seu e-mail", icon: IconMail },
  { title: "Baixe todo o material organizado", icon: IconDownload },
  { title: "Abra o DS-160 e deixe o guia ao lado", icon: IconOpenForm },
  { title: "Siga cada etapa do formulário com o apoio do mapa", icon: IconGuide },
];

const FAQ_ITEMS = [
  {
    question: "O material serve para quem nunca preencheu o DS-160?",
    answer:
      "Sim. O material foi organizado para acompanhar quem está preenchendo o DS-160 pela primeira vez, com explicações visuais e sequência passo a passo.",
  },
  {
    question: "Posso acessar pelo celular?",
    answer: "Sim. Você pode acessar o material pelo celular, tablet ou computador.",
  },
  {
    question: "Como recebo o material?",
    answer: "Após a confirmação da compra, você recebe o acesso no seu e-mail.",
  },
  {
    question: "O guia segue a sequência do formulário?",
    answer:
      "Sim. O guia foi organizado seguindo a sequência apresentada no DS-160 para facilitar o acompanhamento durante o preenchimento.",
  },
  {
    question: "Como funciona a garantia?",
    answer:
      "Você conta com garantia de 7 dias. Dentro desse prazo, caso não queira continuar com o produto, pode solicitar o reembolso.",
  },
];

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function SalesLanding() {
  const p = FLAGSHIP_PRODUCT;
  const discountCents = p.compareAtPriceCents - p.priceCents;

  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-slate-900">
      {/* Faixa de oferta */}
      <div className="bg-slate-900 py-2 text-center text-xs font-semibold tracking-wide text-white">
        OFERTA POR TEMPO LIMITADO — Como Tirar seu Visto Americano em 24hs
      </div>

      {/* Hero */}
      <section className="bg-slate-50">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-14 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
            🇺🇸 ROTA CONSULAR
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {p.title}
          </h1>
          <p className="max-w-xl text-lg text-slate-600">{p.subtitle}</p>

          <div className="flex aspect-[4/3] w-full max-w-sm items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-400 shadow-sm">
            [ prévia do {p.title} ]
          </div>

          <ul className="grid gap-2 text-left sm:grid-cols-2">
            {p.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2 text-sm text-slate-700">
                <IconCheck />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/checkout"
            className="mt-2 rounded-full bg-blue-600 px-9 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-xl"
          >
            ACESSAR AGORA
          </Link>
          <p className="text-sm text-slate-500">
            Você recebe tudo na hora, direto no seu e-mail.
          </p>
        </div>
      </section>

      {/* Análise de perfil grátis — reaproveita o funil de quiz + IA já existente */}
      <section id="analise-gratis" className="bg-white">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-7 shadow-sm sm:p-9">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700">
              GRÁTIS
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Antes de tudo: descubra grátis seu nível de prontidão
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Nossa Inteligência Artificial analisa suas respostas em 2 minutos e
              mostra o quão pronta está sua documentação para o visto americano —
              sem custo, antes mesmo de decidir comprar qualquer guia.
            </p>

            <form
              action={startFreeApplication}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <label className="flex flex-1 flex-col gap-1.5 text-left">
                <span className="text-sm font-medium text-slate-700">Seu melhor e-mail</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                />
              </label>
              <label className="flex flex-1 flex-col gap-1.5 text-left">
                <span className="text-sm font-medium text-slate-700">Seu WhatsApp</span>
                <input
                  name="whatsapp"
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                />
              </label>
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
              >
                ➔ Fazer Análise Grátis
              </button>
            </form>
            <p className="mt-3 text-xs text-slate-500">
              🔒 100% seguro e sigiloso. Sem necessidade de cartão de crédito.
            </p>
          </div>
        </div>
      </section>

      {/* Prévia do material */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Veja o material que você vai receber na prática:
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-[3/4] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-xs text-slate-400"
              >
                [ página {i + 1} ]
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {p.themes.map((theme) => (
              <span
                key={theme}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* O guia possui */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            O {p.title} possui:
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {GUIDE_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.title} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{f.title}</p>
                </li>
              );
            })}
          </ul>
          <p className="mt-10 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
            Com o nosso mapa você entende o que o DS-160 está pedindo, preenche
            cada etapa com mais clareza e chega ao envio do formulário com muito
            mais segurança!
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/checkout"
              className="rounded-full bg-blue-600 px-9 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
            >
              QUERO ACESSAR AGORA
            </Link>
          </div>
        </div>
      </section>

      {/* Ideal para você que deseja */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Nosso Mapa é ideal para você que deseja:
          </h2>
          <ul className="mt-8 flex flex-col gap-3">
            {IDEAL_FOR.map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
                <IconCheck />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tudo que você vai receber */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Tudo o que você vai receber:
          </h2>
          <div className="mt-8 flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
            [ prévia do plano completo ]
          </div>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {p.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2 text-sm text-slate-700">
                <IconCheck />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-slate-500">
            Você recebe tudo na hora, direto no e-mail.
          </p>
        </div>
      </section>

      {/* Bônus */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            🔥 BÔNUS EXCLUSIVO
          </span>
          <div className="mt-6 flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">
            [ capa do bônus ]
          </div>
          <h3 className="mt-6 text-xl font-bold text-slate-900">{p.bonusTitle}</h3>
          <p className="mt-2 text-sm text-slate-600">{p.bonusDescription}</p>
          <p className="mt-3 text-sm font-semibold">
            <span className="text-slate-400 line-through">{formatBRL(p.bonusValueCents)}</span>{" "}
            <span className="text-emerald-600">GRÁTIS</span>
          </p>
        </div>
      </section>

      {/* Oferta / preço */}
      <section className="bg-white">
        <div className="mx-auto max-w-md px-6 py-16">
          <div className="rounded-2xl border border-blue-200 bg-white p-7 text-center shadow-xl shadow-slate-900/5 ring-1 ring-blue-100">
            <div className="flex justify-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">MAIS VENDIDO</span>
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">ÚLTIMA CHANCE</span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Mapa Completo</h3>
            <div className="mt-4 flex aspect-square w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
              [ prévia do produto ]
            </div>
            <ul className="mt-6 flex flex-col gap-2 text-left text-sm text-slate-700">
              {[p.title, "Guia organizado passo a passo", "Conteúdo visual e de fácil consulta", `🎁 Bônus: ${p.bonusTitle}`].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <IconCheck />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate-500">
              de <span className="line-through">{formatBRL(p.compareAtPriceCents)}</span> por apenas:
            </p>
            <p className="text-4xl font-extrabold text-blue-600">{formatBRL(p.priceCents)}</p>
            <p className="text-xs text-slate-500">ou em até 4x no cartão</p>
            <p className="mt-1 text-xs font-semibold text-emerald-600">
              Você economiza {formatBRL(discountCents)}.
            </p>
            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-full bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
            >
              QUERO O PLANO COMPLETO
            </Link>
          </div>
        </div>
      </section>

      {/* Garantia */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Preencher o DS-160 entendendo o que cada etapa está pedindo torna o
            processo muito mais claro, organizado e seguro!
          </h2>
          <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <IconShield />
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Garantia de 7 dias. Se você achar que o material não faz sentido para
            o seu processo ou simplesmente não quiser continuar com o produto:
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            DEVOLVEMOS SEU DINHEIRO DE VOLTA, SEM BUROCRACIA!
          </p>
        </div>
      </section>

      {/* Como é o acesso */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Como é o acesso (passo a passo)
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-5">
            {ACCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Icon />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Passo {i + 1}
                  </p>
                  <p className="text-sm font-medium text-slate-700">{step.title}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Perguntas frequentes
          </h2>
          <div className="mt-8 flex flex-col gap-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-slate-200 bg-white p-4 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-900">
                  {item.question}
                  <span className="ml-4 text-slate-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <p className="mx-auto mt-2 text-center text-xs text-slate-400">
        Já tem uma solicitação paga?{" "}
        <Link href="/entrar" className="text-blue-600 hover:underline">
          Entrar
        </Link>
        {" · "}
        <Link href="/blog" className="text-blue-600 hover:underline">
          Blog
        </Link>
      </p>

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

function IconDocument() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 3.5V7h4M9 12.5h6M9 15.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconRoute() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 6.5h6a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 4.5 21 19H3L12 4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 10v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16.2" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-blue-600">
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9">
      <path
        d="M12 3.5 19 6v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8.5 12 11 14.5 15.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconOrder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4.5 6.5h15l-1.4 9.2a1.5 1.5 0 0 1-1.5 1.3H7.4a1.5 1.5 0 0 1-1.5-1.3L4.5 6.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 6.5V5a4 4 0 0 1 8 0v1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 7 12 12.5 19.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M12 4v11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.5 11 12 15.5 16.5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconOpenForm() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 7 12 3.5 20 7v10L12 20.5 4 17V7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 3.5v17" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconGuide() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M12 5c-2-1.3-4.5-1.5-7-1v13.5c2.5-.5 5-.3 7 1 2-1.3 4.5-1.5 7-1V4c-2.5-.5-5-.3-7 1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 5v13.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
