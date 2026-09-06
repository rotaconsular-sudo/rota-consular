// Estrutura do rascunho do DS-160, mesmas chaves do dados_cliente.json que a
// robô lê. Refinado a partir do formulario-schema oficial do outro projeto
// (21 páginas / ~250 campos do DS-160 real) — a seção "Segurança e
// antecedentes" e os detalhes condicionais (explicações de "Sim") vieram de lá.

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
      { key: "outra_nacionalidade_pais", label: "Qual outra nacionalidade", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "outra_nacionalidade") },
      { key: "outra_nacionalidade_passaporte", label: "Tem passaporte dessa outra nacionalidade?", kind: "bool", optional: true, showIf: (d) => SIM_NAO(d, "outra_nacionalidade") },
      { key: "outra_nacionalidade_passaporte_numero", label: "Número desse passaporte", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "outra_nacionalidade") && SIM_NAO(d, "outra_nacionalidade_passaporte") },
      { key: "residente_permanente", label: "É residente permanente de outro país?", kind: "bool" },
      { key: "residente_permanente_pais", label: "De qual país", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "residente_permanente") },
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
      { key: "passaporte_perdido_roubado_numero", label: "Número do documento perdido ou roubado", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "passaporte_perdido_roubado") },
      { key: "passaporte_perdido_roubado_pais", label: "País de emissão do documento perdido ou roubado", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "passaporte_perdido_roubado") },
      { key: "passaporte_perdido_roubado_explique", label: "Explique o que aconteceu", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "passaporte_perdido_roubado") },
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
      { key: "visto_anterior_data_vencimento", label: "Data de vencimento do último visto", kind: "date", optional: true, showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") },
      { key: "visto_anterior_numero", label: "Número do último visto (em vermelho no visto)", kind: "text", optional: true, help: "Se não souber, escreva \"não sei\".", showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") },
      { key: "visto_mesmo_tipo", label: "É o mesmo tipo de visto que está pedindo agora?", kind: "bool", optional: true, showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") },
      { key: "visto_perdido_roubado", label: "Esse visto foi perdido ou roubado?", kind: "bool", optional: true, showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") },
      { key: "visto_perdido_roubado_ano", label: "Em que ano", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") && SIM_NAO(d, "visto_perdido_roubado") },
      { key: "visto_perdido_roubado_explique", label: "Explique o que aconteceu", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") && SIM_NAO(d, "visto_perdido_roubado") },
      { key: "visto_cancelado_revogado", label: "Algum visto americano já foi cancelado ou revogado?", kind: "bool" },
      { key: "visto_cancelado_revogado_explique", label: "Explique o motivo", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "visto_cancelado_revogado") },
      { key: "visto_recusado", label: "Já teve visto americano recusado, ou teve entrada negada nos EUA?", kind: "bool" },
      { key: "visto_recusado_explique", label: "Descreva com detalhes a recusa ou a negativa de entrada", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "visto_recusado") },
      { key: "esta_negado", label: "Já teve autorização de viagem negada pelo sistema ESTA?", kind: "bool" },
      { key: "peticao_imigrante", label: "Alguém já entrou com petição de imigração em seu nome?", kind: "bool" },
      { key: "carteira_habilitacao_eua", label: "Já teve carteira de motorista dos EUA?", kind: "bool" },
      { key: "carteira_habilitacao_eua_detalhe", label: "Informe os dados da habilitação (nome e número, como estiverem escritos)", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "carteira_habilitacao_eua") },
    ],
  },
  {
    id: "contato_eua",
    titulo: "Contato nos EUA",
    campos: [
      { key: "tem_contato_eua", label: "Tem uma pessoa ou empresa de contato nos EUA?", kind: "bool" },
      { key: "contato_eua_nome", label: "Nome completo da pessoa ou empresa", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "tem_contato_eua") },
      { key: "contato_eua_telefone", label: "Telefone", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "tem_contato_eua") },
      { key: "contato_eua_email", label: "E-mail", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "tem_contato_eua") },
      { key: "contato_eua_endereco_linha1", label: "Endereço (rua e número)", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "tem_contato_eua") },
      { key: "contato_eua_endereco_cidade_uf_cep", label: "Cidade, estado e CEP", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "tem_contato_eua") },
      { key: "contato_eua_endereco_pais", label: "País", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "tem_contato_eua") },
      {
        key: "contato_eua_relacao", label: "Sua relação com essa pessoa ou empresa", kind: "select", optional: true, showIf: (d) => SIM_NAO(d, "tem_contato_eua"),
        options: [
          { value: "Parente", label: "Parente" },
          { value: "Cônjuge", label: "Cônjuge" },
          { value: "Amigo", label: "Amigo" },
          { value: "Parceiro Comercial", label: "Parceiro comercial" },
          { value: "Empregador", label: "Empregador" },
          { value: "Escola Oficial", label: "Escola oficial" },
          { value: "Outro", label: "Outro" },
        ],
      },
      { key: "contato_eua_relacao_detalhe", label: "Descreva a relação", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "tem_contato_eua") && d.contato_eua_relacao === "Outro" },
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
      { key: "teve_mais_de_um_emprego_anterior", label: "Trabalhou em mais de uma empresa nos últimos 5 anos (além dessa)?", kind: "bool", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior2_empresa_nome", label: "Segunda empresa anterior", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && SIM_NAO(d, "teve_mais_de_um_emprego_anterior") },
      { key: "trabalho_anterior2_cargo", label: "Cargo", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && SIM_NAO(d, "teve_mais_de_um_emprego_anterior") },
      { key: "trabalho_anterior2_telefone", label: "Telefone da empresa", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && SIM_NAO(d, "teve_mais_de_um_emprego_anterior") },
      { key: "trabalho_anterior2_endereco_linha1", label: "Endereço (linha 1)", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && SIM_NAO(d, "teve_mais_de_um_emprego_anterior") },
      { key: "trabalho_anterior2_endereco_cidade_uf_cep", label: "Cidade, UF e CEP", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && SIM_NAO(d, "teve_mais_de_um_emprego_anterior") },
      { key: "trabalho_anterior2_endereco_pais", label: "País", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && SIM_NAO(d, "teve_mais_de_um_emprego_anterior") },
      { key: "trabalho_anterior2_data_inicio", label: "Data de início", kind: "date", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && SIM_NAO(d, "teve_mais_de_um_emprego_anterior") },
      { key: "trabalho_anterior2_data_fim", label: "Data de saída", kind: "date", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && SIM_NAO(d, "teve_mais_de_um_emprego_anterior") },
      { key: "trabalho_anterior2_funcoes", label: "O que você fazia lá", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && SIM_NAO(d, "teve_mais_de_um_emprego_anterior") },
      { key: "estudou_nivel_medio_superior", label: "Estudou em nível médio ou superior?", kind: "bool" },
      { key: "instituicao_nome", label: "Nome da instituição de ensino", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "instituicao_telefone", label: "Telefone da instituição", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
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
      { key: "treinamento_arma", label: "Já teve treinamento ou habilidade especializada com arma de fogo, explosivos ou experiência nuclear, biológica ou química?", kind: "bool" },
      { key: "treinamento_arma_detalhe", label: "Descreva o treinamento", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "treinamento_arma") },
      { key: "serviu_exercito", label: "Já serviu em alguma força armada?", kind: "bool" },
      { key: "servico_militar_pais", label: "Em qual país", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "serviu_exercito") },
      { key: "servico_militar_ramo", label: "Ramo do serviço", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "serviu_exercito") },
      { key: "servico_militar_posto", label: "Classificação / posição", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "serviu_exercito") },
      { key: "servico_militar_especialidade", label: "Especialidade militar", kind: "text", optional: true, showIf: (d) => SIM_NAO(d, "serviu_exercito") },
      { key: "servico_militar_data_inicio", label: "Data de início do serviço", kind: "date", optional: true, showIf: (d) => SIM_NAO(d, "serviu_exercito") },
      { key: "servico_militar_data_fim", label: "Data de término do serviço", kind: "date", optional: true, showIf: (d) => SIM_NAO(d, "serviu_exercito") },
    ],
  },
  {
    id: "seguranca",
    titulo: "Segurança e antecedentes",
    campos: [
      { key: "seg_doenca_transmissivel", label: "Você tem uma doença transmissível de importância para a saúde pública, como tuberculose (TB)?", kind: "bool", help: "Estas são as mesmas perguntas do DS-160 oficial. Responder \"Sim\" não significa que o visto será negado — a equipe orienta os próximos passos." },
      { key: "seg_doenca_transmissivel_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_doenca_transmissivel") },
      { key: "seg_disturbio_mental_fisico", label: "Você tem um distúrbio mental ou físico que representa ou pode representar uma ameaça para a segurança ou bem-estar de si mesmo ou de outras pessoas?", kind: "bool" },
      { key: "seg_disturbio_mental_fisico_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_disturbio_mental_fisico") },
      { key: "seg_usuario_drogas", label: "Você é ou já foi usuário ou viciado em drogas?", kind: "bool" },
      { key: "seg_usuario_drogas_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_usuario_drogas") },
      { key: "seg_preso_condenado", label: "Você já foi preso ou condenado por algum crime ou ofensa, mesmo que tenha havido indulto, anistia ou ação semelhante?", kind: "bool" },
      { key: "seg_preso_condenado_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_preso_condenado") },
      { key: "seg_substancias_controladas", label: "Você já violou, ou participou de uma conspiração para violar, alguma lei sobre substâncias controladas (drogas)?", kind: "bool" },
      { key: "seg_substancias_controladas_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_substancias_controladas") },
      { key: "seg_prostituicao", label: "Você vem aos EUA para exercer prostituição ou comercialização ilegal, ou esteve envolvido em prostituição ou aliciamento nos últimos 10 anos?", kind: "bool" },
      { key: "seg_prostituicao_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_prostituicao") },
      { key: "seg_lavagem_dinheiro", label: "Você já esteve envolvido ou tentou se envolver em lavagem de dinheiro?", kind: "bool" },
      { key: "seg_lavagem_dinheiro_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_lavagem_dinheiro") },
      { key: "seg_trafico_pessoas", label: "Você já cometeu ou conspirou para cometer um crime de tráfico de pessoas nos Estados Unidos ou fora deles?", kind: "bool" },
      { key: "seg_trafico_pessoas_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_trafico_pessoas") },
      { key: "seg_trafico_pessoas_auxilio", label: "Você já ajudou, incitou ou conspirou intencionalmente com alguém que cometeu ou conspirou para cometer um crime grave de tráfico de pessoas?", kind: "bool" },
      { key: "seg_trafico_pessoas_auxilio_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_trafico_pessoas_auxilio") },
      { key: "seg_trafico_pessoas_beneficio", label: "Você é cônjuge ou filho(a) de alguém que cometeu tráfico de pessoas e, nos últimos 5 anos, se beneficiou conscientemente dessas atividades?", kind: "bool" },
      { key: "seg_trafico_pessoas_beneficio_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_trafico_pessoas_beneficio") },
      { key: "seg_espionagem_sabotagem", label: "Você pretende se envolver em espionagem, sabotagem, violação de controle de exportação, ou qualquer outra atividade ilegal nos EUA?", kind: "bool" },
      { key: "seg_espionagem_sabotagem_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_espionagem_sabotagem") },
      { key: "seg_terrorismo", label: "Você pretende se envolver em atividades terroristas nos EUA, ou já esteve envolvido em atividades terroristas?", kind: "bool" },
      { key: "seg_terrorismo_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_terrorismo") },
      { key: "seg_apoio_terrorismo", label: "Você já prestou ou pretendeu prestar apoio financeiro ou de outro tipo a terroristas ou organizações terroristas?", kind: "bool" },
      { key: "seg_apoio_terrorismo_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_apoio_terrorismo") },
      { key: "seg_membro_organizacao_terrorista", label: "Você é membro ou representante de uma organização terrorista?", kind: "bool" },
      { key: "seg_membro_organizacao_terrorista_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_membro_organizacao_terrorista") },
      { key: "seg_genocidio", label: "Você já ordenou, incitou, cometeu, assistiu ou participou de genocídio?", kind: "bool" },
      { key: "seg_genocidio_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_genocidio") },
      { key: "seg_tortura", label: "Você já cometeu, ordenou, incitou, assistiu ou participou de atos de tortura?", kind: "bool" },
      { key: "seg_tortura_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_tortura") },
      { key: "seg_violencia_extrajudicial", label: "Você já cometeu, ordenou, incitou ou participou de execuções extrajudiciais, assassinatos políticos ou outros atos de violência?", kind: "bool" },
      { key: "seg_violencia_extrajudicial_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_violencia_extrajudicial") },
      { key: "seg_liberdade_religiosa", label: "Você já foi responsável, direta ou indiretamente, por violações graves da liberdade religiosa?", kind: "bool" },
      { key: "seg_liberdade_religiosa_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_liberdade_religiosa") },
      { key: "seg_deportacao", label: "Você já foi objeto de uma audiência de deportação ou remoção?", kind: "bool" },
      { key: "seg_deportacao_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_deportacao") },
      { key: "seg_fraude_imigracao", label: "Você já tentou obter, ou ajudar outra pessoa a obter, visto ou benefício de imigração dos EUA por fraude, deturpação deliberada ou outros meios ilícitos?", kind: "bool" },
      { key: "seg_fraude_imigracao_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_fraude_imigracao") },
      { key: "seg_overstay", label: "Você já ultrapassou ilegalmente o prazo concedido por um funcionário da imigração, violando os termos de um visto americano?", kind: "bool" },
      { key: "seg_overstay_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_overstay") },
      { key: "seg_custodia_crianca", label: "Você já manteve fora dos EUA a custódia de uma criança cidadã americana, tirando-a de alguém que tinha a guarda legal por decisão de um tribunal americano?", kind: "bool" },
      { key: "seg_custodia_crianca_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_custodia_crianca") },
      { key: "seg_voto_ilegal", label: "Você já votou nos Estados Unidos violando alguma lei ou regulamento?", kind: "bool" },
      { key: "seg_voto_ilegal_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_voto_ilegal") },
      { key: "seg_renuncia_cidadania", label: "Você já renunciou à cidadania americana com a finalidade de evitar o pagamento de impostos?", kind: "bool" },
      { key: "seg_renuncia_cidadania_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_renuncia_cidadania") },
      { key: "seg_escola_publica_sem_reembolso", label: "Você já estudou em escola pública (visto F) ou escola secundária pública financiada com recursos públicos, depois de 30/11/1996, sem reembolsar a escola?", kind: "bool" },
      { key: "seg_escola_publica_sem_reembolso_explique", label: "Explique", kind: "textarea", optional: true, showIf: (d) => SIM_NAO(d, "seg_escola_publica_sem_reembolso") },
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
