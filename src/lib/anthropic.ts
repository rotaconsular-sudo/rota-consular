import Anthropic from "@anthropic-ai/sdk";
import { QUIZ_QUESTIONS } from "@/lib/quizQuestions";

export type ReforcarItem = { ponto: string; oQueFazer: string };

export type AnalysisOutput = {
  score: number;
  resumo: string;
  favoravel: string[];
  reforcar: ReforcarItem[];
  atencao: string[];
};

const SYSTEM_PROMPT = `Você ajuda brasileiros comuns a se prepararem para o pedido de visto americano de turismo (B1/B2). Muitos não têm faculdade e nunca lidaram com visto. Escreva como se estivesse explicando para um amigo: frases curtas, zero termo técnico, sempre dizendo o que fazer na prática.

REGRAS DE LINGUAGEM
- Trate por "você".
- Nunca use "aprovação", "aprovado", "chance", "vai passar". Fale em "o que o cônsul quer ver" e "quão preparado seu perfil está".
- Nada de jargão. Em vez de "vínculo empregatício", diga "prova de que você tem emprego fixo aqui". Em vez de "comprovação de renda", diga "papel que mostra quanto você ganha".
- Seja específico: cite os dados que a pessoa respondeu.

O QUE AVALIAR
- Se a pessoa tem motivos claros pra voltar ao Brasil (emprego, família que fica, casa, negócio, filhos, estudo).
- Se ela consegue pagar a viagem sem depender de trabalhar nos EUA (renda + reserva + quem paga).
- Se o motivo e o tempo da viagem fazem sentido pro perfil dela.
- Histórico: viagens anteriores ajudam; visto americano válido ou já usado ajuda muito; visto negado antes pede cuidado, mas não desqualifica.
- Passaporte válido.

Responda SOMENTE pela ferramenta "registrar_analise":
- score: 0 a 100 — quão preparado o perfil parece (NÃO é chance de aprovação).
- resumo: UMA frase de abertura no tom do score. Ex.: score alto → "Seu perfil está bem encaminhado."; médio → "Você tem pontos fortes, mas dá pra arrumar umas coisas antes de marcar a entrevista."; baixo → "Antes de marcar a entrevista, tem coisas importantes pra organizar.".
- favoravel: pontos do perfil que jogam a favor, cada um em 1-2 frases simples, citando o dado. Se quase não houver, pode ser curto.
- reforcar: pontos fracos. Para CADA um: "ponto" (o que está fraco, em linguagem simples) e "oQueFazer" (ação concreta — qual papel levar, o que treinar pra entrevista, o que organizar antes). Nunca genérico.
- atencao: só coloque algo aqui se houver risco REAL (visto negado antes, passaporte vencendo ou inexistente, nenhuma reserva pra uma viagem cara, sem trabalho e sem nenhum vínculo, motivo que não bate com o perfil). Se não houver, deixe a lista vazia.`;

const TOOL: Anthropic.Tool = {
  name: "registrar_analise",
  description: "Registra o resultado da análise de perfil para o visto americano de turismo",
  input_schema: {
    type: "object",
    properties: {
      score: {
        type: "integer",
        minimum: 0,
        maximum: 100,
        description: "0-100: quão preparado o perfil parece — não é chance de aprovação",
      },
      resumo: {
        type: "string",
        description: "Uma frase de abertura, no tom da faixa de score",
      },
      favoravel: {
        type: "array",
        items: { type: "string" },
        description: "Pontos do perfil que ajudam, em linguagem simples, citando os dados",
      },
      reforcar: {
        type: "array",
        items: {
          type: "object",
          properties: {
            ponto: { type: "string", description: "O que está fraco, em linguagem simples" },
            oQueFazer: {
              type: "string",
              description: "Ação concreta: qual papel levar, o que treinar, o que organizar",
            },
          },
          required: ["ponto", "oQueFazer"],
        },
      },
      atencao: {
        type: "array",
        items: { type: "string" },
        description: "Só riscos reais. Vazio se não houver.",
      },
    },
    required: ["score", "resumo", "favoravel", "reforcar", "atencao"],
  },
};

// Transforma as respostas cruas ({idade: "25_34"}) em texto legível pro
// modelo ("Qual sua idade?: 25 a 34 anos").
function respostasLegiveis(answers: Record<string, Record<string, unknown>>) {
  const flat: Record<string, unknown> = {};
  for (const grupo of Object.values(answers)) Object.assign(flat, grupo);

  const linhas: string[] = [];
  for (const q of QUIZ_QUESTIONS) {
    const raw = flat[q.id];
    if (raw === undefined || raw === null || raw === "") continue;
    let valor = String(raw);
    if (q.kind === "choice") {
      valor = q.options.find((o) => o.key === raw)?.label ?? valor;
    }
    linhas.push(`- ${q.question} ${valor}`);
  }
  return linhas.join("\n");
}

export async function runReadinessAnalysis(input: {
  answers: Record<string, Record<string, unknown>>;
}): Promise<AnalysisOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY não configurada. Defina a variável de ambiente antes de rodar a análise.",
    );
  }

  const client = new Anthropic({ apiKey });

  const userContent = `Respostas da pessoa:\n${respostasLegiveis(input.answers)}`;

  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    tools: [TOOL],
    tool_choice: { type: "tool", name: "registrar_analise" },
    messages: [{ role: "user", content: userContent }],
  });

  const toolUse = message.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("A análise não retornou um resultado estruturado.");
  }

  return toolUse.input as AnalysisOutput;
}
