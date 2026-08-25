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

// As 10 perguntas da análise de perfil gratuita, no formato quiz (1 por
// tela). Perguntas condicionais usam showIf para só aparecer conforme a
// resposta anterior (ex: só pede "quais países" se a pessoa já viajou).
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "escolaridade",
    kind: "choice",
    question: "Qual sua escolaridade?",
    options: [
      { key: "fundamental", label: "Fundamental" },
      { key: "medio", label: "Médio" },
      { key: "superior_incompleto", label: "Superior incompleto" },
      { key: "superior_completo", label: "Superior completo" },
      { key: "pos_graduacao", label: "Pós-graduação" },
    ],
  },
  {
    id: "trabalhoAtual",
    kind: "text",
    question: "Qual seu trabalho atual?",
    placeholder: "Ex: Analista de Marketing",
  },
  {
    id: "tempoTrabalho",
    kind: "choice",
    question: "Há quanto tempo você está nesse trabalho?",
    options: [
      { key: "menos_6m", label: "Menos de 6 meses" },
      { key: "6m_1a", label: "Entre 6 meses e 1 ano" },
      { key: "1_3a", label: "Entre 1 e 3 anos" },
      { key: "mais_3a", label: "Mais de 3 anos" },
    ],
  },
  {
    id: "ramoAtividade",
    kind: "text",
    question: "Qual o ramo de atividade da empresa?",
    placeholder: "Ex: Varejo, Tecnologia, Saúde",
  },
  {
    id: "declaraIR",
    kind: "choice",
    question: "Você declara Imposto de Renda?",
    options: [
      { key: "sim", label: "Sim" },
      { key: "nao", label: "Não" },
    ],
  },
  {
    id: "casaPropria",
    kind: "choice",
    question: "Você possui casa própria?",
    options: [
      { key: "sim", label: "Sim" },
      { key: "nao", label: "Não" },
    ],
  },
  {
    id: "jaViajou",
    kind: "choice",
    question: "Já viajou para outros países?",
    options: [
      { key: "sim", label: "Sim" },
      { key: "nao", label: "Não" },
    ],
  },
  {
    id: "paisesViajados",
    kind: "text",
    question: "Quais países e quando?",
    placeholder: "Ex: Argentina em 2022, Portugal em 2023",
    showIf: (a) => a.jaViajou === "sim",
  },
  {
    id: "conheceAlguemEUA",
    kind: "choice",
    question: "Conhece alguém morando nos EUA?",
    options: [
      { key: "sim", label: "Sim" },
      { key: "nao", label: "Não" },
    ],
  },
  {
    id: "quemConheceEUA",
    kind: "text",
    question: "Quem é essa pessoa e qual sua relação com você?",
    placeholder: "Ex: Meu irmão, mora em Orlando",
    showIf: (a) => a.conheceAlguemEUA === "sim",
  },
  {
    id: "rendaMensal",
    kind: "choice",
    question: "Qual sua renda mensal aproximada?",
    options: [
      { key: "ate_3k", label: "Até R$ 3 mil" },
      { key: "3k_6k", label: "Entre R$ 3 mil e R$ 6 mil" },
      { key: "6k_10k", label: "Entre R$ 6 mil e R$ 10 mil" },
      { key: "10k_20k", label: "Entre R$ 10 mil e R$ 20 mil" },
      { key: "acima_20k", label: "Acima de R$ 20 mil" },
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
