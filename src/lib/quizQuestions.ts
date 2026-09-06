export type QuizAnswers = Record<string, string>;

type QuizOption = { key: string; label: string };

export type QuizQuestion =
  | {
      id: string;
      kind: "choice";
      question: string;
      options: QuizOption[];
      showIf?: (answers: QuizAnswers) => boolean;
    }
  | {
      id: string;
      kind: "text";
      question: string;
      placeholder?: string;
      optional?: boolean;
      showIf?: (answers: QuizAnswers) => boolean;
    };

// Análise de perfil (quiz, 1 pergunta por tela). Perguntas condicionais usam
// showIf pra só aparecer conforme a resposta anterior.
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── Sobre você ──────────────────────────────────────────────
  {
    id: "idade",
    kind: "choice",
    question: "Qual sua idade?",
    options: [
      { key: "18_24", label: "18 a 24 anos" },
      { key: "25_34", label: "25 a 34 anos" },
      { key: "35_44", label: "35 a 44 anos" },
      { key: "45_59", label: "45 a 59 anos" },
      { key: "60_mais", label: "60 anos ou mais" },
    ],
  },
  {
    id: "estadoCivil",
    kind: "choice",
    question: "Qual seu estado civil?",
    options: [
      { key: "solteiro", label: "Solteiro(a)" },
      { key: "casado", label: "Casado(a) ou união estável" },
      { key: "divorciado", label: "Divorciado(a)" },
      { key: "viuvo", label: "Viúvo(a)" },
    ],
  },
  {
    id: "filhos",
    kind: "choice",
    question: "Você tem filhos?",
    options: [
      { key: "nao", label: "Não tenho" },
      { key: "sim_moram", label: "Sim, e moram comigo" },
      { key: "sim_nao_moram", label: "Sim, mas não moram comigo" },
    ],
  },
  {
    id: "escolaridade",
    kind: "choice",
    question: "Até onde você estudou?",
    options: [
      { key: "fundamental", label: "Fundamental" },
      { key: "medio", label: "Ensino médio" },
      { key: "superior_incompleto", label: "Faculdade incompleta" },
      { key: "superior_completo", label: "Faculdade completa" },
      { key: "pos", label: "Pós-graduação" },
    ],
  },

  // ── Trabalho e dinheiro ─────────────────────────────────────
  {
    id: "vinculo",
    kind: "choice",
    question: "Como você trabalha hoje?",
    options: [
      { key: "clt", label: "Carteira assinada (CLT)" },
      { key: "servidor", label: "Servidor público" },
      { key: "autonomo", label: "Autônomo(a) ou freelancer" },
      { key: "empresario", label: "Dono(a) de empresa" },
      { key: "aposentado", label: "Aposentado(a)" },
      { key: "do_lar", label: "Do lar" },
      { key: "estudante", label: "Estudante" },
      { key: "desempregado", label: "Sem trabalho no momento" },
    ],
  },
  {
    id: "tempoVinculo",
    kind: "choice",
    question: "Há quanto tempo você está nessa situação?",
    options: [
      { key: "menos_6m", label: "Menos de 6 meses" },
      { key: "6m_1a", label: "De 6 meses a 1 ano" },
      { key: "1_3a", label: "De 1 a 3 anos" },
      { key: "3_5a", label: "De 3 a 5 anos" },
      { key: "mais_5a", label: "Mais de 5 anos" },
    ],
  },
  {
    id: "renda",
    kind: "choice",
    question: "Qual sua renda por mês, mais ou menos?",
    options: [
      { key: "ate_2k", label: "Até R$ 2 mil" },
      { key: "2k_4k", label: "R$ 2 mil a R$ 4 mil" },
      { key: "4k_7k", label: "R$ 4 mil a R$ 7 mil" },
      { key: "7k_12k", label: "R$ 7 mil a R$ 12 mil" },
      { key: "12k_20k", label: "R$ 12 mil a R$ 20 mil" },
      { key: "acima_20k", label: "Acima de R$ 20 mil" },
    ],
  },
  {
    id: "reserva",
    kind: "choice",
    question: "Quanto você tem guardado ou investido para essa viagem?",
    options: [
      { key: "nada", label: "Ainda não tenho reserva" },
      { key: "ate_5k", label: "Até R$ 5 mil" },
      { key: "5k_15k", label: "R$ 5 mil a R$ 15 mil" },
      { key: "15k_30k", label: "R$ 15 mil a R$ 30 mil" },
      { key: "mais_30k", label: "Mais de R$ 30 mil" },
    ],
  },
  {
    id: "quemPaga",
    kind: "choice",
    question: "Quem vai pagar a viagem?",
    options: [
      { key: "eu", label: "Eu mesmo(a)" },
      { key: "pais", label: "Meus pais" },
      { key: "conjuge", label: "Meu cônjuge / companheiro(a)" },
      { key: "empresa", label: "A empresa onde trabalho" },
      { key: "anfitriao", label: "A pessoa que vou visitar nos EUA" },
    ],
  },

  // ── Sua vida no Brasil ─────────────────────────────────────
  {
    id: "casaPropria",
    kind: "choice",
    question: "Você tem casa própria?",
    options: [
      { key: "quitada", label: "Sim, quitada" },
      { key: "financiada", label: "Sim, financiada" },
      { key: "nao", label: "Não (alugo ou moro com a família)" },
    ],
  },
  {
    id: "carro",
    kind: "choice",
    question: "Você tem carro no seu nome?",
    options: [
      { key: "sim", label: "Sim" },
      { key: "nao", label: "Não" },
    ],
  },
  {
    id: "empresaPropria",
    kind: "choice",
    question: "Você tem uma empresa ou é sócio de alguma?",
    options: [
      { key: "sim", label: "Sim" },
      { key: "nao", label: "Não" },
    ],
  },
  {
    id: "ficaNoBrasil",
    kind: "choice",
    question: "Quem fica no Brasil enquanto você viaja?",
    options: [
      { key: "conjuge_filhos", label: "Meu cônjuge e/ou meus filhos" },
      { key: "pais", label: "Meus pais" },
      { key: "ninguem", label: "Não fica ninguém próximo" },
      { key: "familia_toda_vai", label: "Vou viajar com a família toda" },
    ],
  },

  // ── A viagem ──────────────────────────────────────────────
  {
    id: "paraQuem",
    kind: "choice",
    question: "Esse pedido de visto é pra quem?",
    options: [
      { key: "so_eu", label: "Só pra mim" },
      { key: "casal", label: "Pra mim e meu cônjuge / companheiro(a)" },
      { key: "familia", label: "Pra minha família (com filhos)" },
      { key: "parentes", label: "Pra mim e outros parentes (pais, irmãos…)" },
    ],
  },
  {
    id: "motivo",
    kind: "choice",
    question: "Qual o motivo da viagem?",
    options: [
      { key: "passeio", label: "Passeio / turismo" },
      { key: "familia_amigos", label: "Visitar família ou amigos" },
      { key: "lua_de_mel", label: "Lua de mel" },
      { key: "disney", label: "Disney e parques" },
      { key: "evento", label: "Evento, congresso ou treinamento" },
      { key: "outro", label: "Outro" },
    ],
  },
  {
    id: "quando",
    kind: "choice",
    question: "Quando você pretende viajar?",
    options: [
      { key: "data_marcada", label: "Já tenho data" },
      { key: "3m", label: "Nos próximos 3 meses" },
      { key: "3_6m", label: "Daqui a 3 a 6 meses" },
      { key: "mais_6m", label: "Daqui a mais de 6 meses" },
      { key: "nao_sei", label: "Ainda não sei" },
    ],
  },
  {
    id: "duracao",
    kind: "choice",
    question: "Quanto tempo você pretende ficar nos EUA?",
    options: [
      { key: "ate_15d", label: "Até 15 dias" },
      { key: "15_30d", label: "De 15 a 30 dias" },
      { key: "1_3m", label: "De 1 a 3 meses" },
      { key: "mais_3m", label: "Mais de 3 meses" },
    ],
  },
  {
    id: "conheceEUA",
    kind: "choice",
    question: "Você conhece alguém morando nos EUA?",
    options: [
      { key: "sim", label: "Sim" },
      { key: "nao", label: "Não" },
    ],
  },
  {
    id: "quemConheceEUA",
    kind: "text",
    question: "Quem é essa pessoa e qual sua relação com você?",
    placeholder: "Ex: meu irmão, mora em Orlando há 5 anos",
    showIf: (a) => a.conheceEUA === "sim",
  },

  // ── Histórico ─────────────────────────────────────────────
  {
    id: "vistoAmericano",
    kind: "choice",
    question: "Você já teve visto americano?",
    options: [
      { key: "valido", label: "Tenho um visto válido agora" },
      { key: "venceu", label: "Já tive, mas venceu" },
      { key: "nunca", label: "Nunca tive" },
    ],
  },
  {
    id: "vistoNegado",
    kind: "choice",
    question: "Você já teve algum visto negado?",
    options: [
      { key: "nunca", label: "Nunca tive visto negado" },
      { key: "eua", label: "Sim, dos Estados Unidos" },
      { key: "outro_pais", label: "Sim, de outro país" },
    ],
  },
  {
    id: "vistoNegadoDetalhe",
    kind: "text",
    question: "Conta rapidamente: qual visto, quando, e o motivo (se você souber).",
    placeholder: "Ex: visto americano em 2019, disseram que faltava vínculo",
    showIf: (a) => a.vistoNegado === "eua" || a.vistoNegado === "outro_pais",
  },
  {
    id: "jaViajouFora",
    kind: "choice",
    question: "Você já viajou pra fora do Brasil?",
    options: [
      { key: "sim", label: "Sim" },
      { key: "nao", label: "Não" },
    ],
  },
  {
    id: "paisesViajados",
    kind: "text",
    question: "Quais países e quando?",
    placeholder: "Ex: Argentina 2022, Portugal 2023, Chile 2024",
    showIf: (a) => a.jaViajouFora === "sim",
  },
  {
    id: "passaporte",
    kind: "choice",
    question: "Você tem passaporte válido?",
    options: [
      { key: "sim", label: "Sim, válido por mais de 6 meses" },
      { key: "vence_perto", label: "Tenho, mas vence em menos de 6 meses" },
      { key: "nao", label: "Ainda não tenho passaporte" },
    ],
  },
  {
    id: "maisDetalhes",
    kind: "text",
    question: "Quer contar mais alguma coisa que ajude na análise?",
    placeholder: "Opcional",
    optional: true,
  },
];

export function getVisibleQuestions(answers: QuizAnswers) {
  return QUIZ_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}
