import Anthropic from "@anthropic-ai/sdk";

export type AnalysisChecklistItem = {
  item: string;
  status: "ok" | "atencao" | "faltando";
  comentario: string;
};

export type AnalysisOutput = {
  readinessScore: number;
  checklist: AnalysisChecklistItem[];
  alerts: string[];
};

const SYSTEM_PROMPT = `Você ajuda brasileiros a se prepararem para o pedido de visto americano de turismo (B1/B2).

Seu papel é avaliar PRONTIDÃO DA DOCUMENTAÇÃO E DOS VÍNCULOS COM O BRASIL — nunca prever ou prometer aprovação. A decisão final é sempre exclusiva do oficial consular americano, e você não tem acesso a nenhum critério interno do consulado.

Avalie principalmente:
- Força dos vínculos com o Brasil (emprego estável, renda, tempo no cargo/negócio, família)
- Histórico de viagens e vistos (uma recusa anterior não desqualifica, mas merece atenção)
- Coerência do motivo da viagem com o perfil da pessoa
- Completude dos documentos listados

Responda SOMENTE via a ferramenta "registrar_analise". Nunca use a palavra "aprovação" ou "aprovado" no comentário — fale em termos de "prontidão" e "pontos de atenção". Seja específico e cite os dados que a pessoa informou.`;

const TOOL: Anthropic.Tool = {
  name: "registrar_analise",
  description:
    "Registra o resultado da análise de prontidão para o visto americano de turismo",
  input_schema: {
    type: "object",
    properties: {
      readinessScore: {
        type: "integer",
        minimum: 0,
        maximum: 100,
        description:
          "0-100: quão completa e consistente está a preparação, não a chance de aprovação",
      },
      checklist: {
        type: "array",
        items: {
          type: "object",
          properties: {
            item: { type: "string", description: "Nome curto do item avaliado" },
            status: { type: "string", enum: ["ok", "atencao", "faltando"] },
            comentario: {
              type: "string",
              description: "Explicação breve e específica, citando os dados informados",
            },
          },
          required: ["item", "status", "comentario"],
        },
      },
      alerts: {
        type: "array",
        items: { type: "string" },
        description: "Alertas específicos que merecem atenção antes da entrevista",
      },
    },
    required: ["readinessScore", "checklist", "alerts"],
  },
};

export async function runReadinessAnalysis(input: {
  answers: Record<string, Record<string, unknown>>;
  documents: { type: string; fileName: string }[];
}): Promise<AnalysisOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY não configurada. Defina a variável de ambiente antes de rodar a análise.",
    );
  }

  const client = new Anthropic({ apiKey });

  const userContent = `Respostas do formulário:\n${JSON.stringify(input.answers, null, 2)}\n\nDocumentos listados:\n${JSON.stringify(input.documents, null, 2)}`;

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
