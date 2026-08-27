import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Assessoria Completa | Rota Consular",
  description:
    "Uma especialista cuida do seu visto americano do início ao fim: formulário, documentação e preparação para a entrevista consular.",
};

// TODO: trocar pelo número real conectado ao Chatwoot antes de publicar.
const WHATSAPP_LINK =
  "https://wa.me/5500000000000?text=Ol%C3%A1%2C%20quero%20falar%20com%20uma%20especialista%20sobre%20a%20Assessoria%20Completa";

const BENEFITS = [
  {
    title: "100% Guiado",
    description: "Zero dor de cabeça com o idioma ou formulários confusos do governo.",
  },
  {
    title: "Atendimento Humano",
    description: "Tire suas dúvidas direto pelo WhatsApp com quem entende do assunto.",
  },
  {
    title: "Estratégia Anti-Negativa",
    description: "Mapeamos os seus vínculos para o cônsul não ter motivos para duvidar de você.",
  },
];

const VALUE_STACK = [
  {
    title: "O DS-160 Blindado",
    description:
      "Nosso sistema inteligente em português aliado à nossa rigorosa Revisão Humana. Emitimos seu formulário sem falhas.",
  },
  {
    title: "Linha Direta via WhatsApp",
    description:
      "Chega de falar com robôs de atendimento. Você terá o contato direto de uma consultora sênior em tempo real para acalmar suas ansiedades e tirar qualquer dúvida.",
  },
  {
    title: "Treinamento de Postura Consular",
    description:
      "O que vestir? Para onde olhar? O que responder? Fazemos uma simulação estratégica para você sentar na frente do oficial esbanjando confiança.",
  },
  {
    title: "Lista de Documentos Cirúrgica",
    description:
      "Acabou a confusão. Te entregamos um checklist exato do que você (e só você) precisa levar no dia da entrevista.",
  },
];

const BONUSES = [
  {
    title: "Manual da Migração",
    description:
      "O passo a passo de como se comportar e o que responder no aeroporto para não ser barrado.",
  },
  {
    title: "Manual de Inglês Básico para Viagem",
    description: "As frases que vão te salvar no aeroporto, hotel e restaurantes.",
  },
  {
    title: "Dicas de Ouro de Orlando",
    description:
      "Atalhos exclusivos de especialistas para você aproveitar os parques e compras sem cair em furadas.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Eu preciso saber inglês?",
    answer: "Não! Nossa equipe cuida de toda a tradução e preenchimento oficial.",
  },
  {
    question: "Vocês garantem a aprovação?",
    answer:
      "Fuja de quem promete isso. A decisão final é sempre do oficial americano. O que nós garantimos é que o seu perfil será preparado no mais alto nível de exigência, anulando as chances de reprovação por erros técnicos ou falta de preparo da sua parte.",
  },
  {
    question: "Como funciona o atendimento pelo WhatsApp?",
    answer:
      "Assim que iniciar sua assessoria, você será direcionado para uma consultora real da nossa equipe, que acompanhará o seu caso até o dia da entrevista.",
  },
];

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-accent">
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

function WhatsAppButton({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-ink px-9 py-4 text-base font-bold text-white transition hover:bg-ink-muted"
    >
      {children}
    </a>
  );
}

export default function AssessoriaCompletaPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-ink">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-20 sm:py-28 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-ink">
            PARE DE ARRISCAR O SEU SONHO
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Aprovamos o seu visto americano cuidando de cada detalhe, do
            preenchimento do formulário até a sua chegada em Orlando.
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Não conte com a sorte. Tenha uma especialista segurando a sua mão
            no WhatsApp, preparando sua documentação e treinando você para a
            entrevista consular. Nós assumimos a burocracia para você viajar
            em paz.
          </p>
          <WhatsAppButton>Quero Falar com uma Especialista Agora</WhatsAppButton>
        </div>
      </section>

      {/* Agitação da dor */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
            O Consulado não perdoa erros amadores.
          </h2>
          <p className="mt-4 text-sm text-slate-600">
            Todos os dias, centenas de brasileiros têm o visto negado e
            perdem a cara taxa consular de US$&nbsp;185. O motivo? Não é falta de
            dinheiro. É falta de instrução. Formulários com informações
            conflitantes, nervosismo na frente do cônsul e falta de
            documentos corretos destroem viagens planejadas por anos. Você
            não precisa passar por esse estresse.
          </p>
        </div>
      </section>

      {/* Solução */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
            Conheça a Assessoria Completa Rota Consular
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-600">
            Muito mais que um simples &quot;despachante&quot;, nós somos o
            seu escudo contra a burocracia. Nossa equipe assume o controle
            técnico do seu processo e blinda o seu perfil para o momento da
            entrevista.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center"
              >
                <span className="font-mono text-xs font-medium tracking-[0.2em] text-slate-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-semibold text-ink">{b.title}</p>
                <p className="text-sm text-slate-600">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Empilhamento de valor */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
            O que você garante ao entrar para a nossa Assessoria:
          </h2>
          <ul className="mt-8 flex flex-col gap-3">
            {VALUE_STACK.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <IconCheck />
                <div>
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bônus */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
            E NÃO ACABA NA PORTA DO CONSULADO
          </span>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600">
            Quem tira o visto geralmente tem um destino principal: Orlando.
            Como somos experts absolutos na cidade mágica, sua assessoria
            inclui o nosso &quot;Kit Passaporte Carimbado&quot; para a sua
            viagem:
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {BONUSES.map((bonus, i) => (
              <div
                key={bonus.title}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-left"
              >
                <span className="font-mono text-xs font-medium tracking-[0.2em] text-slate-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-semibold text-ink">{bonus.title}</p>
                <p className="text-sm text-slate-600">{bonus.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-slate-50">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-20 sm:py-28 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
            O seu visto americano merece preparação de verdade.
          </h2>
          <p className="text-sm text-slate-600">
            Pare de perder tempo com tutoriais soltos na internet e conselhos
            de quem não entende do assunto. Clique no botão abaixo, converse
            com a nossa equipe e dê o primeiro passo seguro rumo à sua
            aprovação.
          </p>
          <WhatsAppButton>Quero Iniciar Minha Assessoria</WhatsAppButton>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
            Perguntas frequentes
          </h2>
          <div className="mt-8 flex flex-col gap-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors open:border-ink/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink">
                  {item.question}
                  <span className="ml-4 text-slate-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
