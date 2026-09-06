// Estrutura do rascunho do DS-160 — 118 campos, mesmas chaves do
// dados_cliente.json que a robô lê. Primeira versão a partir desse JSON;
// ajustar labels/opções quando chegar o JSON de definição do formulário
// oficial do outro projeto.

export type Ds160Dados = Record<string, unknown>;

type Opcao = { value: string; label: string };

export type Ds160Field =
  | {
      key: string;
      label: string;
      kind: "text" | "textarea" | "date" | "bool";
      placeholder?: string;
      help?: string;
      optional?: boolean;
      showIf?: (d: Ds160Dados) => boolean;
    }
  | {
      key: string;
      label: string;
      kind: "select";
      options: Opcao[];
      help?: string;
      optional?: boolean;
      showIf?: (d: Ds160Dados) => boolean;
    }
  | {
      key: string;
      label: string;
      kind: "list";
      itemFields: {
        key: string;
        label: string;
        kind: "text" | "date" | "select";
        options?: Opcao[];
      }[];
      help?: string;
      optional?: boolean;
      showIf?: (d: Ds160Dados) => boolean;
    };

export type Ds160Section = { id: string; titulo: string; campos: Ds160Field[] };

const MESES: Opcao[] = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
].map((m, i) => ({ value: m, label: `${String(i + 1).padStart(2, "0")} — ${m}` }));

const SIM_NAO = (d: Ds160Dados, key: string) => d[key] === true || d[key] === "true";

export const DS160_SECTIONS: Ds160Section[] = [
  {
    id: "pessoais",
    titulo: "Dados pessoais",
    campos: [
      { key: "nome", label: "Nome (como no passaporte)", kind: "text" },
      { key: "sobrenome", label: "Sobrenome (como no passaporte)", kind: "text" },
      { key: "nome_nativo_na", label: "Não tenho nome em alfabeto nativo / não se aplica", kind: "bool" },
      { key: "nome_nativo", label: "Nome completo em alfabeto nativo", kind: "text", optional: true, showIf: (d) => !SIM_NAO(d, "nome_nativo_na") },
      { key: "usou_outros_nomes", label: "Já usou outros nomes (solteira, religioso, artístico…)?", kind: "bool" },
      { key: "outro_nome", label: "Outro nome", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "usou_outros_nomes") },
      { key: "outro_sobrenome", label: "Outro sobrenome", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "usou_outros_nomes") },
      { key: "tem_telecode", label: "Seu nome tem telecode?", kind: "bool", help: "Quase sempre 'não'. Só marque se souber o que é." },
      {
        key: "sexo", label: "Sexo", kind: "select",
        options: [{ value: "MALE", label: "Masculino" }, { value: "FEMALE", label: "Feminino" }],
      },
      {
        key: "estado_civil", label: "Estado civil", kind: "select",
        options: [
          { value: "MARRIED", label: "Casado(a)" },
          { value: "COMMON LAW MARRIAGE", label: "União estável" },
          { value: "CIVIL UNION/DOMESTIC PARTNERSHIP", label: "União civil / parceria doméstica" },
          { value: "SINGLE", label: "Solteiro(a)" },
          { value: "WIDOWED", label: "Viúvo(a)" },
          { value: "DIVORCED", label: "Divorciado(a)" },
          { value: "LEGALLY SEPARATED", label: "Separado(a) judicialmente" },
          { value: "OTHER", label: "Outro" },
        ],
      },
      { key: "dob_dia", label: "Dia de nascimento", kind: "text", placeholder: "14" },
      { key: "dob_mes", label: "Mês de nascimento", kind: "select", options: MESES },
      { key: "dob_ano", label: "Ano de nascimento", kind: "text", placeholder: "1990" },
      { key: "cidade_nascimento", label: "Cidade onde nasceu", kind: "text" },
      { key: "estado_nascimento_na", label: "Não sei / não se aplica o estado", kind: "bool" },
      { key: "estado_nascimento", label: "Estado onde nasceu", kind: "text", optional: true, showIf: (d) => !SIM_NAO(d, "estado_nascimento_na") },
      { key: "pais_nascimento", label: "País onde nasceu", kind: "text", placeholder: "BRAZIL" },
    ],
  },
  {
    id: "nacionalidade",
    titulo: "Documento e nacionalidade",
    campos: [
      { key: "cpf", label: "CPF", kind: "text" },
      { key: "outra_nacionalidade", label: "Tem nacionalidade de outro país além do Brasil?", kind: "bool" },
      { key: "residente_permanente", label: "É residente permanente de outro país?", kind: "bool" },
    ],
  },
  {
    id: "contato",
    titulo: "Endereço e contato",
    campos: [
      { key: "endereco_rua", label: "Endereço (rua e número)", kind: "text" },
      { key: "endereco_cidade", label: "Cidade", kind: "text" },
      { key: "endereco_estado", label: "Estado", kind: "text" },
      { key: "endereco_cep", label: "CEP", kind: "text" },
      { key: "endereco_pais", label: "País", kind: "text", placeholder: "Brasil" },
      { key: "telefone_principal", label: "Telefone principal (com DDD)", kind: "text" },
      { key: "telefone_secundario", label: "Telefone secundário", kind: "text", optional: true },
      { key: "telefone_comercial", label: "Telefone comercial", kind: "text", optional: true },
      { key: "email", label: "E-mail", kind: "text" },
    ],
  },
  {
    id: "passaporte",
    titulo: "Passaporte",
    campos: [
      { key: "passaporte_numero", label: "Número do passaporte", kind: "text" },
      { key: "passaporte_pais_emissor", label: "País que emitiu", kind: "text", placeholder: "Brasil" },
      { key: "passaporte_cidade_emissora", label: "Cidade emissora", kind: "text" },
      { key: "passaporte_estado_emissor", label: "Estado emissor", kind: "text", optional: true },
      { key: "passaporte_data_emissao", label: "Data de emissão", kind: "date" },
      { key: "passaporte_data_validade", label: "Data de validade", kind: "date" },
      { key: "passaporte_perdido_roubado", label: "Já teve um passaporte perdido ou roubado?", kind: "bool" },
    ],
  },
  {
    id: "viagem",
    titulo: "A viagem",
    campos: [
      { key: "categoria_visto", label: "Categoria do visto", kind: "text", placeholder: "B1/B2 - Negócios e Turismo" },
      { key: "travel_dia", label: "Data pretendida — dia", kind: "text", placeholder: "3" },
      { key: "travel_mes", label: "Data pretendida — mês", kind: "text", placeholder: "11" },
      { key: "travel_ano", label: "Data pretendida — ano", kind: "text", placeholder: "2026" },
      { key: "travel_tempo", label: "Quantos dias pretende ficar", kind: "text", placeholder: "5" },
      { key: "onde_ficara", label: "Onde vai ficar nos EUA", kind: "text", placeholder: "Hotel" },
      { key: "cidade_destino_eua", label: "Cidade de destino", kind: "text" },
      {
        key: "quem_paga", label: "Quem paga a viagem", kind: "select",
        options: [
          { value: "SELF", label: "Eu mesmo(a)" },
          { value: "OTHER PERSON", label: "Outra pessoa" },
          { value: "PRESENT EMPLOYER", label: "Meu empregador atual" },
          { value: "EMPLOYER IN THE U.S.", label: "Um empregador nos EUA" },
          { value: "OTHER COMPANY/ORGANIZATION", label: "Outra empresa / organização" },
        ],
      },
      { key: "pagador_empresa_nome", label: "Nome de quem/da empresa que paga", kind: "text", optional: true, showIf: (d) => d.quem_paga != null && d.quem_paga !== "SELF" },
      { key: "pagador_empresa_telefone", label: "Telefone de quem paga", kind: "text", optional: true, showIf: (d) => d.quem_paga != null && d.quem_paga !== "SELF" },
      { key: "pagador_empresa_relacionamento", label: "Relação com você", kind: "text", optional: true, showIf: (d) => d.quem_paga != null && d.quem_paga !== "SELF" },
      { key: "pagador_empresa_endereco_linha1", label: "Endereço de quem paga (linha 1)", kind: "text", optional: true, showIf: (d) => d.quem_paga != null && d.quem_paga !== "SELF" },
      { key: "pagador_empresa_endereco_bairro", label: "Bairro", kind: "text", optional: true, showIf: (d) => d.quem_paga != null && d.quem_paga !== "SELF" },
      { key: "pagador_empresa_endereco_cidade_uf_cep", label: "Cidade, UF e CEP", kind: "text", optional: true, showIf: (d) => d.quem_paga != null && d.quem_paga !== "SELF" },
      { key: "pagador_empresa_endereco_pais", label: "País", kind: "text", optional: true, showIf: (d) => d.quem_paga != null && d.quem_paga !== "SELF" },
      { key: "viaja_com_alguem", label: "Vai viajar com outras pessoas?", kind: "bool" },
      {
        key: "companheiros_viagem", label: "Companheiros de viagem", kind: "list",
        showIf: (d) => SIM_NAO(d, "viaja_com_alguem"),
        itemFields: [
          { key: "nome", label: "Nome completo", kind: "text" },
          { key: "parentesco", label: "Parentesco / relação", kind: "text" },
        ],
      },
    ],
  },
  {
    id: "vistos_anteriores",
    titulo: "Viagens e vistos anteriores aos EUA",
    campos: [
      { key: "ja_esteve_eua", label: "Já esteve nos Estados Unidos?", kind: "bool" },
      {
        key: "visitas_anteriores_eua", label: "Visitas anteriores", kind: "list",
        showIf: (d) => SIM_NAO(d, "ja_esteve_eua"),
        itemFields: [
          { key: "data_chegada", label: "Data de chegada", kind: "text" },
          { key: "tempo", label: "Quanto tempo ficou", kind: "text" },
        ],
      },
      { key: "ja_teve_visto_eua", label: "Já teve visto americano?", kind: "bool" },
      { key: "visto_anterior_data_emissao", label: "Data de emissão do último visto", kind: "date", optional: true, showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") },
      { key: "visto_anterior_numero", label: "Número do último visto", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") },
      { key: "visto_mesmo_tipo", label: "É o mesmo tipo de visto que está pedindo agora?", kind: "bool", optional: true, showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") },
      { key: "visto_perdido_roubado", label: "Esse visto foi perdido ou roubado?", kind: "bool", optional: true, showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") },
      { key: "visto_cancelado_revogado", label: "Algum visto americano já foi cancelado ou revogado?", kind: "bool" },
      { key: "visto_recusado", label: "Já teve visto americano recusado?", kind: "bool" },
      { key: "peticao_imigrante", label: "Alguém já entrou com petição de imigração em seu nome?", kind: "bool" },
      { key: "carteira_habilitacao_eua", label: "Já teve carteira de motorista dos EUA?", kind: "bool" },
    ],
  },
  {
    id: "contato_eua",
    titulo: "Contato nos EUA",
    campos: [
      { key: "tem_contato_eua", label: "Tem uma pessoa ou local de contato nos EUA?", kind: "bool", help: "Se tiver, a equipe pede os dados depois." },
    ],
  },
  {
    id: "familia",
    titulo: "Família",
    campos: [
      { key: "pai_nome", label: "Nome completo do pai", kind: "text" },
      { key: "pai_data_nascimento", label: "Data de nascimento do pai", kind: "date", optional: true },
      { key: "pai_esta_eua", label: "O pai está nos EUA?", kind: "bool" },
      { key: "mae_nome", label: "Nome completo da mãe", kind: "text" },
      { key: "mae_data_nascimento", label: "Data de nascimento da mãe", kind: "date", optional: true },
      { key: "mae_esta_eua", label: "A mãe está nos EUA?", kind: "bool" },
      { key: "parente_1_grau_eua", label: "Tem parente de 1º grau (irmão, filho) nos EUA?", kind: "bool" },
      { key: "outro_parente_eua", label: "Tem outro parente nos EUA?", kind: "bool" },
      { key: "conjuge_nome", label: "Nome completo do cônjuge", kind: "text", optional: true, showIf: (d) => d.estado_civil === "MARRIED" || d.estado_civil === "COMMON LAW MARRIAGE" || d.estado_civil === "CIVIL UNION/DOMESTIC PARTNERSHIP" },
      { key: "conjuge_data_nascimento", label: "Data de nascimento do cônjuge", kind: "date", optional: true, showIf: (d) => d.estado_civil === "MARRIED" || d.estado_civil === "COMMON LAW MARRIAGE" || d.estado_civil === "CIVIL UNION/DOMESTIC PARTNERSHIP" },
      { key: "conjuge_nacionalidade", label: "Nacionalidade do cônjuge", kind: "text", optional: true, showIf: (d) => d.estado_civil === "MARRIED" || d.estado_civil === "COMMON LAW MARRIAGE" || d.estado_civil === "CIVIL UNION/DOMESTIC PARTNERSHIP" },
      { key: "conjuge_local_nascimento", label: "Cidade e estado onde o cônjuge nasceu", kind: "text", optional: true, showIf: (d) => d.estado_civil === "MARRIED" || d.estado_civil === "COMMON LAW MARRIAGE" || d.estado_civil === "CIVIL UNION/DOMESTIC PARTNERSHIP" },
      { key: "conjuge_endereco_mesmo_aplicante", label: "O cônjuge mora no mesmo endereço que você?", kind: "bool", optional: true, showIf: (d) => d.estado_civil === "MARRIED" || d.estado_civil === "COMMON LAW MARRIAGE" || d.estado_civil === "CIVIL UNION/DOMESTIC PARTNERSHIP" },
      { key: "conjuge_endereco_texto", label: "Endereço do cônjuge", kind: "text", optional: true, showIf: (d) => (d.estado_civil === "MARRIED" || d.estado_civil === "COMMON LAW MARRIAGE" || d.estado_civil === "CIVIL UNION/DOMESTIC PARTNERSHIP") && !SIM_NAO(d, "conjuge_endereco_mesmo_aplicante") },
    ],
  },
  {
    id: "trabalho_atual",
    titulo: "Trabalho atual",
    campos: [
      { key: "ocupacao_atual", label: "Ocupação atual", kind: "text", placeholder: "Funcionário, Autônomo, Aposentado…" },
      { key: "cargo", label: "Cargo / função", kind: "text" },
      { key: "trabalho_empresa_nome", label: "Nome da empresa", kind: "text" },
      { key: "trabalho_telefone", label: "Telefone da empresa", kind: "text", optional: true },
      { key: "trabalho_endereco_linha1", label: "Endereço da empresa (linha 1)", kind: "text" },
      { key: "trabalho_endereco_bairro", label: "Bairro", kind: "text", optional: true },
      { key: "trabalho_endereco_cidade_uf_cep", label: "Cidade, UF e CEP", kind: "text" },
      { key: "trabalho_endereco_pais", label: "País", kind: "text", placeholder: "Brasil" },
      { key: "trabalho_data_inicio", label: "Desde quando trabalha lá", kind: "date" },
      { key: "trabalho_funcoes", label: "Descreva o que você faz no trabalho", kind: "textarea" },
    ],
  },
  {
    id: "trabalho_anterior_educacao",
    titulo: "Trabalho anterior e educação",
    campos: [
      { key: "trabalhou_outra_empresa_5anos", label: "Trabalhou em outra empresa nos últimos 5 anos?", kind: "bool" },
      { key: "trabalho_anterior_empresa_nome", label: "Empresa anterior", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_cargo", label: "Cargo anterior", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_telefone", label: "Telefone da empresa anterior", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_endereco_linha1", label: "Endereço da empresa anterior (linha 1)", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_endereco_cidade_uf_cep", label: "Cidade, UF e CEP", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_endereco_pais", label: "País", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_data_inicio", label: "Data de início", kind: "date", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_data_fim", label: "Data de saída", kind: "date", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_funcoes", label: "O que você fazia lá", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "estudou_nivel_medio_superior", label: "Estudou em nível médio ou superior?", kind: "bool" },
      { key: "instituicao_nome", label: "Nome da instituição de ensino", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "instituicao_endereco_linha1", label: "Endereço da instituição (linha 1)", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "instituicao_endereco_cidade_uf_cep", label: "Cidade, UF e CEP", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "instituicao_endereco_pais", label: "País", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "curso_nome", label: "Curso", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "curso_data_inicio", label: "Início do curso", kind: "date", optional: true, showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "curso_data_termino", label: "Término do curso", kind: "date", optional: true, showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "idiomas", label: "Idiomas que você fala", kind: "text", placeholder: "Português, Inglês básico…" },
    ],
  },
  {
    id: "adicionais",
    titulo: "Informações adicionais",
    campos: [
      { key: "viajou_ultimos_5_anos", label: "Viajou para fora do Brasil nos últimos 5 anos?", kind: "bool" },
      { key: "paises_visitados_5_anos", label: "Quais países e quando", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "viajou_ultimos_5_anos") },
      { key: "treinamento_arma", label: "Já teve treinamento com armas de fogo ou explosivos?", kind: "bool" },
      { key: "treinamento_arma_detalhe", label: "Descreva o treinamento", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "treinamento_arma") },
      { key: "serviu_exercito", label: "Já serviu em alguma força armada?", kind: "bool" },
      { key: "seguranca", label: "Observações para as perguntas de segurança do DS-160", kind: "textarea", optional: true, help: "Deixe em branco se não houver nada. A equipe orienta essa parte." },
    ],
  },
  {
    id: "redes",
    titulo: "Redes sociais",
    campos: [
      { key: "tem_midia_social", label: "Você usa redes sociais?", kind: "bool" },
      {
        key: "midias_sociais", label: "Suas redes sociais", kind: "list",
        showIf: (d) => SIM_NAO(d, "tem_midia_social"),
        help: "Adicione cada rede que você usa (o consulado pede isso no DS-160).",
        itemFields: [
          {
            key: "plataforma", label: "Plataforma", kind: "select",
            options: ["Instagram", "Facebook", "X (Twitter)", "TikTok", "LinkedIn", "YouTube", "Outra"].map((p) => ({ value: p, label: p })),
          },
          { key: "handle", label: "Seu @ / nome de usuário", kind: "text" },
        ],
      },
    ],
  },
];

// Todas as chaves que a robô espera (dados_cliente.json). Usada pra montar
// o JSON de exportação com todas as chaves presentes, mesmo as vazias.
export const DS160_TODAS_CHAVES: string[] = [
  ...DS160_SECTIONS.flatMap((s) => s.campos.map((c) => c.key)),
  // chaves derivadas / legadas que a robô também lê
  "midia_social_plataforma",
  "midia_social_handle",
];

export function secoesVisiveis(dados: Ds160Dados) {
  return DS160_SECTIONS.map((sec) => ({
    ...sec,
    campos: sec.campos.filter((c) => !c.showIf || c.showIf(dados)),
  }));
}
