import type { Metadata } from "next";

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
    emoji: "🛡️",
    title: "100% Guiado",
    description: "Zero dor de cabeça com o idioma ou formulários confusos do governo.",
  },
  {
    emoji: "📱",
    title: "Atendimento Humano",
    description: "Tire suas dúvidas direto pelo WhatsApp com quem entende do assunto.",
  },
  {
    emoji: "🎯",
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
    emoji: "📘",
    title: "Manual da Migração",
    description:
      "O passo a passo de como se comportar e o que responder no aeroporto para não ser barrado.",
  },
  {
    emoji: "📕",
    title: "Manual de Inglês Básico para Viagem",
    description: "As frases que vão te salvar no aeroporto, hotel e restaurantes.",
  },
  {
    emoji: "🎢",
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

function WhatsAppButton({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-9 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-xl"
    >
      {children}
    </a>
  );
}

export default function AssessoriaCompletaPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-16 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
            🇺🇸 PARE DE ARRISCAR O SEU SONHO
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
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
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            O Consulado não perdoa erros amadores.
          </h2>
          <p className="mt-4 text-sm text-slate-600">
            Todos os dias, centenas de brasileiros têm o visto negado e
            perdem a cara taxa consular de US$ 185. O motivo? Não é falta de
            dinheiro. É falta de instrução. Formulários com informações
            conflitantes, nervosismo na frente do cônsul e falta de
            documentos corretos destroem viagens planejadas por anos. Você
            não precisa passar por esse estresse.
          </p>
        </div>
      </section>

      {/* Solução */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Conheça a Assessoria Completa Rota Consular
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-600">
            Muito mais que um simples &quot;despachante&quot;, nós somos o
            seu escudo contra a burocracia. Nossa equipe assume o controle
            técnico do seu processo e blinda o seu perfil para o momento da
            entrevista.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <span className="text-3xl">{b.emoji}</span>
                <p className="text-sm font-semibold text-slate-900">{b.title}</p>
                <p className="text-sm text-slate-600">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Empilhamento de valor */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            O que você garante ao entrar para a nossa Assessoria:
          </h2>
          <ul className="mt-8 flex flex-col gap-3">
            {VALUE_STACK.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <IconCheck />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bônus */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            E NÃO ACABA NA PORTA DO CONSULADO 🎁
          </span>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600">
            Quem tira o visto geralmente tem um destino principal: Orlando.
            Como somos experts absolutos na cidade mágica, sua assessoria
            inclui o nosso &quot;Kit Passaporte Carimbado&quot; para a sua
            viagem:
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {BONUSES.map((bonus) => (
              <div
                key={bonus.title}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm"
              >
                <span className="text-3xl">{bonus.emoji}</span>
                <p className="text-sm font-semibold text-slate-900">{bonus.title}</p>
                <p className="text-sm text-slate-600">{bonus.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-slate-50">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
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
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Perguntas frequentes
          </h2>
          <div className="mt-8 flex flex-col gap-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-slate-200 bg-slate-50 p-4 open:shadow-sm"
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

      <footer className="border-t border-slate-200 bg-slate-50">
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
