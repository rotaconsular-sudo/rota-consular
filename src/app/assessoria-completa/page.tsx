import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { whatsappLink } from "@/lib/contato";
import { Kicker, Star } from "@/components/marketing";
import { FbTrack } from "@/components/FbTrack";

export const metadata: Metadata = {
  title: "Assessoria Completa | Rota Consular",
  description:
    "Uma especialista cuida do seu visto americano do início ao fim: formulário, documentação e preparação para a entrevista consular.",
};

const WHATSAPP_LINK = whatsappLink(
  "Olá, quero falar com uma especialista sobre a Assessoria Completa",
);

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

function WhatsAppButton({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-brand px-9 py-4 text-base font-bold text-star transition hover:bg-brand-strong"
    >
      {children}
    </a>
  );
}

export default function AssessoriaCompletaPage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-ink">
      <FbTrack event="ViewContent" params={{ content_name: "Assessoria completa" }} />
      <SiteHeader />

      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
          <Kicker>Assessoria completa</Kicker>
          <h1 className="mt-5 text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-[2.7rem]">
            Uma especialista cuida do seu visto americano do começo ao fim.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
            Do preenchimento do DS-160 à preparação para a entrevista, com uma
            consultora sênior segurando a sua mão no WhatsApp. Você assume a
            viagem; a gente assume a burocracia.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-start gap-2.5 text-slate-700">
                <Star className="mt-1.5" />
                <span>
                  <span className="font-semibold text-ink">{b.title}.</span>{" "}
                  {b.description}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <WhatsAppButton>Falar com uma especialista</WhatsAppButton>
          </div>
        </div>
      </section>

      <hr className="stripes" />

      {/* Agitação da dor */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
          <Kicker>Por que preparar</Kicker>
          <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            O consulado não perdoa erro amador.
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
            Todos os dias, brasileiros têm o visto negado e perdem as taxas
            (MRV + Visa Integrity Fee, cerca de US$&nbsp;435). Quase nunca é
            falta de dinheiro — é DS-160 com informação conflitante, roteiro
            incoerente e nervosismo na entrevista. Isso se resolve com
            preparação, não com sorte.
          </p>
        </div>
      </section>

      <hr className="stripes" />

      {/* O que entra */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
          <Kicker>O que entra</Kicker>
          <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Tudo que você garante ao entrar.
          </h2>
          <ul className="mt-10 border-t border-slate-200">
            {VALUE_STACK.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-4 border-b border-slate-200 py-5"
              >
                <Star className="mt-1.5" />
                <div>
                  <p className="font-bold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <hr className="stripes" />

      {/* Bônus */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <Kicker>Não acaba na porta do consulado</Kicker>
            <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Kit Passaporte Carimbado, pra viagem.
            </h2>
            <p className="mt-4 text-slate-600">
              Quem tira o visto geralmente vai pra Orlando. A assessoria já
              inclui:
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {BONUSES.map((bonus) => (
              <div
                key={bonus.title}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <span className="eyebrow text-brand">Bônus</span>
                <p className="mt-3 font-bold text-ink">{bonus.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {bonus.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="stripes" />

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
          <Kicker>Dúvidas</Kicker>
          <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Antes de começar.
          </h2>
          <div className="mt-8 border-t border-slate-200">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group border-b border-slate-200 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink">
                  {item.question}
                  <span className="text-xl font-black leading-none text-brand transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <hr className="stripes" />

      {/* CTA final */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-24">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            O seu visto merece preparação de verdade.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600">
            Chega de tutorial solto e conselho de quem não entende do assunto.
            Converse com a equipe e dê o primeiro passo seguro.
          </p>
          <div className="mt-7 flex justify-center">
            <WhatsAppButton>Quero iniciar minha assessoria</WhatsAppButton>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
