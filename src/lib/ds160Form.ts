// Estrutura do rascunho do DS-160, mesmas chaves do dados_cliente.json que a
// robô lê. As 21 seções abaixo replicam a ordem, os textos e as opções do
// formulario-schema oficial do outro projeto (formulário completo do DS-160
// em português). Duas exceções deliberadas:
// - As chaves/valores que já alimentam a robô de automação (dob_dia/mes/ano,
//   sexo, estado_civil, quem_paga, travel_dia/mes/ano) foram MANTIDAS como
//   estão — são o contrato de exportação (dados_cliente.json) já em uso; só
//   os textos visíveis ao usuário foram alinhados ao schema oficial.
// - Os campos finais do schema oficial ("Receber cópia por e-mail" e
//   "Consentir") não foram replicados: aqui o usuário já está logado (já
//   temos o e-mail dele) e o site tem seu próprio consentimento LGPD
//   (banner de cookies) — seriam redundantes.
// Bug corrigido em relação ao schema oficial: o campo "segunda rede social"
// estava condicionado à PRIMEIRA rede social em vez da segunda.

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
        kind: "text" | "date" | "select" | "textarea";
        options?: Opcao[];
      }[];
      help?: string;
      optional?: boolean;
      showIf?: (d: Ds160Dados) => boolean;
    }
  | {
      // Texto informativo puro, sem campo de entrada (ex.: avisos legais do
      // DS-160 oficial). Não entra no JSON exportado pra robô.
      key: string;
      label: string;
      kind: "note";
      help?: string;
      showIf?: (d: Ds160Dados) => boolean;
    };

export type Ds160Section = { id: string; titulo: string; campos: Ds160Field[] };

const MESES: Opcao[] = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
].map((m, i) => ({ value: m, label: `${String(i + 1).padStart(2, "0")} — ${m}` }));

const GRAU_PARENTESCO: Opcao[] = [
  "Cônjuge", "Filho(a)", "Mãe / Pai", "Irmão(a)", "Tio(a)", "Avô / Avó",
  "Primo(a)", "Amigo(a)", "Namorado(a)", "Parceiro de trabalho / Negócios",
].map((v) => ({ value: v, label: v }));

const DURACAO_OPCOES: Opcao[] = ["1", "2", "3", "4", "5", "6", "7", "10", "12", "15"].map((v) => ({ value: v, label: v }));
const PERIODO_OPCOES: Opcao[] = ["Dias", "Meses", "Anos"].map((v) => ({ value: v, label: v }));
const SITUACAO_EUA_OPCOES: Opcao[] = [
  "Cidadão Americano",
  "Residente permanente legal dos EUA (Green Card)",
  "Não Imigrante (não tem green card e não é cidadão)",
  "Outro",
].map((v) => ({ value: v, label: v }));

const SIM_NAO = (d: Ds160Dados, key: string) => d[key] === true || d[key] === "true";

// Calcula a idade a partir de dob_dia/dob_mes/dob_ano (mês em código de 3
// letras, ver MESES). Retorna null se a data de nascimento ainda não foi
// preenchida ou está incompleta/inválida.
function idadeAtual(d: Ds160Dados): number | null {
  const dia = Number(d.dob_dia);
  const mesIndice = MESES.findIndex((m) => m.value === d.dob_mes);
  const ano = Number(d.dob_ano);
  if (!dia || mesIndice < 0 || !ano) return null;
  const nascimento = new Date(ano, mesIndice, dia);
  if (Number.isNaN(nascimento.getTime())) return null;
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aniversarioEsteAno = new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate());
  if (hoje < aniversarioEsteAno) idade--;
  return idade;
}

// Menor de idade não tem "trabalhos anteriores" — a seção some pra esse caso.
const MENOR_DE_IDADE = (d: Ds160Dados) => {
  const idade = idadeAtual(d);
  return idade !== null && idade < 18;
};

// Estado civil: quem conta como "tem cônjuge" (inclui união estável, com ou
// sem certidão) vs. "tem ex-parceiro" vs. "é viúvo".
const EH_CONJUGE = (d: Ds160Dados) =>
  d.estado_civil === "MARRIED" || d.estado_civil === "COMMON LAW MARRIAGE" || d.estado_civil === "COMMON LAW MARRIAGE (SEM CERTIDAO)";
const EH_EX_PARCEIRO = (d: Ds160Dados) => d.estado_civil === "DIVORCED" || d.estado_civil === "LEGALLY SEPARATED";
const EH_VIUVO = (d: Ds160Dados) => d.estado_civil === "WIDOWED";
const TEM_HISTORICO_CONJUGAL = (d: Ds160Dados) => EH_CONJUGE(d) || EH_EX_PARCEIRO(d) || EH_VIUVO(d);

export const DS160_SECTIONS: Ds160Section[] = [
  {
    id: "pessoais_1",
    titulo: "Informações Pessoais 1",
    campos: [
      { key: "nome_sobrenome_atual", label: "Nome e sobrenome atuais", kind: "text" },
      { key: "usou_outros_nomes", label: "Você já teve outros nomes ou sobrenomes antes do atual?", kind: "bool" },
      { key: "outro_nome_sobrenome", label: "Já teve outro nome e sobrenome utilizados antes do atual", kind: "text", help: "Casamentos e divórcios podem alterar o sobrenome.", showIf: (d) => SIM_NAO(d, "usou_outros_nomes") },
      { key: "nome_nativo_na", label: "Não tenho nome em alfabeto nativo / não se aplica", kind: "bool" },
      { key: "nome_nativo", label: "Nome completo em alfabeto nativo", kind: "text", showIf: (d) => !SIM_NAO(d, "nome_nativo_na") },
      { key: "tem_telecode", label: "Seu nome tem telecode?", kind: "bool", help: "Quase sempre \"não\". Só marque se souber o que é." },
      {
        key: "sexo", label: "Sexo", kind: "select",
        options: [{ value: "FEMALE", label: "Feminino" }, { value: "MALE", label: "Masculino" }],
      },
      {
        key: "estado_civil", label: "Estado Civil", kind: "select",
        options: [
          { value: "MARRIED", label: "Casado" },
          { value: "COMMON LAW MARRIAGE", label: "União estável com Certidão" },
          { value: "COMMON LAW MARRIAGE (SEM CERTIDAO)", label: "União estável sem Certidão" },
          { value: "SINGLE", label: "Solteiro" },
          { value: "WIDOWED", label: "Viúvo" },
          { value: "DIVORCED", label: "Divorciado" },
          { value: "LEGALLY SEPARATED", label: "Separado legalmente" },
          { value: "OTHER", label: "Outros" },
        ],
      },
      { key: "dob_dia", label: "Dia de nascimento", kind: "text", placeholder: "14" },
      { key: "dob_mes", label: "Mês de nascimento", kind: "select", options: MESES },
      { key: "dob_ano", label: "Ano de nascimento", kind: "text", placeholder: "1990" },
      { key: "cidade_nascimento", label: "Cidade de nascimento", kind: "text" },
      { key: "estado_nascimento", label: "Estado", kind: "text" },
      { key: "pais_nascimento", label: "País", kind: "text", placeholder: "Brasil" },
    ],
  },
  {
    id: "pessoais_2",
    titulo: "Informações Pessoais 2",
    campos: [
      {
        key: "nacionalidade", label: "Nacionalidade (País de Origem)", kind: "select",
        options: ["Brasil", "Argentina", "Paraguai", "Uruguai", "Bolívia", "Chile", "Peru", "Colômbia", "Outro"].map((v) => ({ value: v, label: v })),
      },
      { key: "nacionalidade_outro", label: "Qual país", kind: "text", showIf: (d) => d.nacionalidade === "Outro" },
      { key: "outra_nacionalidade", label: "Possui outra Nacionalidade que não a indicada acima", kind: "bool" },
      { key: "outra_nacionalidade_pais", label: "Informe sua outra Nacionalidade", kind: "text", showIf: (d) => SIM_NAO(d, "outra_nacionalidade") },
      { key: "outra_nacionalidade_passaporte", label: "Possui um passaporte para essa outra Nacionalidade", kind: "bool", showIf: (d) => SIM_NAO(d, "outra_nacionalidade") },
      { key: "outra_nacionalidade_passaporte_numero", label: "Informe o Número desse Passaporte", kind: "text", showIf: (d) => SIM_NAO(d, "outra_nacionalidade") && SIM_NAO(d, "outra_nacionalidade_passaporte") },
      { key: "residente_permanente", label: "Você é residente permanente de um País diferente do seu País de origem (Nacionalidade)", kind: "bool" },
      { key: "residente_permanente_pais", label: "Informe", kind: "text", showIf: (d) => SIM_NAO(d, "residente_permanente") },
      { key: "cpf", label: "Informe o número do seu CPF", kind: "text" },
    ],
  },
  {
    id: "viagem",
    titulo: "Informações de viagem",
    campos: [
      {
        key: "categoria_visto", label: "Categoria de Visto", kind: "select",
        options: [
          { value: "B1/B2 - Negócios e Turismo", label: "B1/B2 - Negócios e Turismo" },
          { value: "F - Estudante", label: "F - Estudante" },
          { value: "B1 - Empregada Doméstica / Babá", label: "B1 - Empregada Doméstica / Babá" },
        ],
      },
      {
        key: "categoria_estudante", label: "Especifique a Categoria Estudante", kind: "select",
        showIf: (d) => d.categoria_visto === "F - Estudante",
        options: [
          { value: "F1 – Estudante", label: "F1 – Estudante" },
          { value: "F2 - Acompanhante do Estudante - Pais / Filhos / Cônjugue", label: "F2 - Acompanhante do Estudante - Pais / Filhos / Cônjugue" },
        ],
      },
      { key: "travel_dia", label: "Data Prevista da Viagem — Dia", kind: "text", placeholder: "3" },
      { key: "travel_mes", label: "Data Prevista da Viagem — Mês", kind: "text", placeholder: "11" },
      { key: "travel_ano", label: "Data Prevista da Viagem — Ano", kind: "text", placeholder: "2026" },
      { key: "travel_tempo", label: "Tempo de permanência nos EUA", kind: "text", optional: true },
      {
        key: "onde_ficara", label: "Informe onde ficará nos EUA", kind: "select",
        options: ["Hotel", "Casa Alugada", "Casa Particular"].map((v) => ({ value: v, label: v })),
      },
      { key: "cidade_destino_eua", label: "Qual Cidade ficará nos Estados Unidos (pretensão)", kind: "text" },
      { key: "destino_endereco_rua", label: "Rua", kind: "text", showIf: (d) => d.onde_ficara === "Casa Particular" || d.onde_ficara === "Casa Alugada" },
      { key: "destino_endereco_bairro", label: "Bairro e Complemento", kind: "text", showIf: (d) => d.onde_ficara === "Casa Particular" || d.onde_ficara === "Casa Alugada" },
      { key: "destino_endereco_cidade", label: "Cidade", kind: "text", showIf: (d) => d.onde_ficara === "Casa Particular" || d.onde_ficara === "Casa Alugada" },
      { key: "destino_endereco_estado", label: "Estado", kind: "text", showIf: (d) => d.onde_ficara === "Casa Particular" || d.onde_ficara === "Casa Alugada" },
      { key: "destino_endereco_cep", label: "Código postal", kind: "text", showIf: (d) => d.onde_ficara === "Casa Particular" || d.onde_ficara === "Casa Alugada" },
      { key: "destino_endereco_pais", label: "País", kind: "text", showIf: (d) => d.onde_ficara === "Casa Particular" || d.onde_ficara === "Casa Alugada" },
    ],
  },
  {
    id: "pagador",
    titulo: "Quem paga a viagem",
    campos: [
      {
        key: "quem_paga", label: "Quem vai pagar a sua viagem?", kind: "select",
        options: [
          { value: "SELF", label: "Eu mesmo irei pagar minhas despesas de viagem" },
          { value: "OTHER PERSON", label: "Outra pessoa irá pagar as despesas da minha viagem" },
          { value: "PRESENT EMPLOYER", label: "Empregador atual (empresa onde trabalho)" },
          { value: "EMPLOYER IN THE U.S.", label: "Empregador nos Estados Unidos" },
          { value: "OTHER COMPANY/ORGANIZATION", label: "Outra empresa" },
        ],
      },
      { key: "pagador_pessoa_nome", label: "Nome e sobrenome da pessoa", kind: "text", showIf: (d) => d.quem_paga === "OTHER PERSON" },
      { key: "pagador_pessoa_telefone", label: "Telefone da pessoa com DDD", kind: "text", showIf: (d) => d.quem_paga === "OTHER PERSON" },
      { key: "pagador_pessoa_email", label: "E-mail da pessoa", kind: "text", showIf: (d) => d.quem_paga === "OTHER PERSON" },
      { key: "pagador_pessoa_parentesco", label: "Qual o seu parentesco com a pessoa que vai pagar a viagem?", kind: "text", showIf: (d) => d.quem_paga === "OTHER PERSON" },
      {
        key: "pagador_pessoa_endereco_tipo", label: "Endereço completo de quem vai pagar a viagem", kind: "select",
        showIf: (d) => d.quem_paga === "OTHER PERSON",
        options: [
          { value: "Mesmo endereço do aplicante", label: "Mesmo endereço do aplicante" },
          { value: "Outro endereço", label: "Outro endereço" },
        ],
      },
      { key: "pagador_pessoa_endereco_rua", label: "Rua", kind: "text", showIf: (d) => d.pagador_pessoa_endereco_tipo === "Outro endereço" },
      { key: "pagador_pessoa_endereco_bairro", label: "Bairro e Complemento", kind: "text", showIf: (d) => d.pagador_pessoa_endereco_tipo === "Outro endereço" },
      { key: "pagador_pessoa_endereco_cidade", label: "Cidade", kind: "text", showIf: (d) => d.pagador_pessoa_endereco_tipo === "Outro endereço" },
      { key: "pagador_pessoa_endereco_estado", label: "Estado", kind: "text", showIf: (d) => d.pagador_pessoa_endereco_tipo === "Outro endereço" },
      { key: "pagador_pessoa_endereco_cep", label: "Código postal", kind: "text", showIf: (d) => d.pagador_pessoa_endereco_tipo === "Outro endereço" },
      { key: "pagador_pessoa_endereco_pais", label: "País", kind: "text", showIf: (d) => d.pagador_pessoa_endereco_tipo === "Outro endereço" },
      { key: "pagador_empresa_nome", label: "Nome da empresa", kind: "text", showIf: (d) => d.quem_paga === "OTHER COMPANY/ORGANIZATION" },
      { key: "pagador_empresa_telefone", label: "Número de telefone da empresa com DDD", kind: "text", showIf: (d) => d.quem_paga === "OTHER COMPANY/ORGANIZATION" },
      { key: "pagador_empresa_relacionamento", label: "Qual o relacionamento da empresa com você?", kind: "text", showIf: (d) => d.quem_paga === "OTHER COMPANY/ORGANIZATION" },
      { key: "pagador_empresa_endereco_rua", label: "Rua", kind: "text", showIf: (d) => d.quem_paga === "OTHER COMPANY/ORGANIZATION" },
      { key: "pagador_empresa_endereco_bairro", label: "Bairro e Complemento", kind: "text", showIf: (d) => d.quem_paga === "OTHER COMPANY/ORGANIZATION" },
      { key: "pagador_empresa_endereco_cidade", label: "Cidade", kind: "text", showIf: (d) => d.quem_paga === "OTHER COMPANY/ORGANIZATION" },
      { key: "pagador_empresa_endereco_estado", label: "Estado", kind: "text", showIf: (d) => d.quem_paga === "OTHER COMPANY/ORGANIZATION" },
      { key: "pagador_empresa_endereco_cep", label: "Código postal", kind: "text", showIf: (d) => d.quem_paga === "OTHER COMPANY/ORGANIZATION" },
      { key: "pagador_empresa_endereco_pais", label: "País", kind: "text", showIf: (d) => d.quem_paga === "OTHER COMPANY/ORGANIZATION" },
    ],
  },
  {
    id: "companheiros",
    titulo: "Companheiros de viagem",
    campos: [
      { key: "viaja_com_alguem", label: "Há outras pessoas viajando com você?", kind: "bool" },
      {
        key: "companheiros_viagem", label: "Nome completo e grau de parentesco de cada um", kind: "list",
        showIf: (d) => SIM_NAO(d, "viaja_com_alguem"),
        itemFields: [
          { key: "nome", label: "Nome completo", kind: "text" },
          { key: "parentesco", label: "Grau de Parentesco", kind: "select", options: GRAU_PARENTESCO },
        ],
      },
    ],
  },
  {
    id: "vistos_anteriores",
    titulo: "Viagens e vistos anteriores aos EUA",
    campos: [
      { key: "ja_esteve_eua", label: "Você já esteve nos Estados Unidos?", kind: "bool" },
      {
        key: "visitas_anteriores_eua", label: "Suas últimas visitas aos EUA", kind: "list",
        help: "Forneça informações sobre suas últimas 5 visitas aos EUA. Caso não saiba a data correta, informe ao menos o ano.",
        showIf: (d) => SIM_NAO(d, "ja_esteve_eua"),
        itemFields: [
          { key: "data_entrada", label: "Data de Entrada", kind: "date" },
          { key: "duracao", label: "Duração", kind: "select", options: DURACAO_OPCOES },
          { key: "periodo", label: "Período", kind: "select", options: PERIODO_OPCOES },
        ],
      },
      { key: "carteira_habilitacao_eua", label: "Você já teve Habilitação Americana", kind: "bool" },
      { key: "carteira_habilitacao_eua_detalhe", label: "Informe os dados da sua Habilitação Americana", kind: "textarea", help: "Todos os dados de como está o nome e números referentes à sua Habilitação Americana.", showIf: (d) => SIM_NAO(d, "carteira_habilitacao_eua") },
      { key: "ja_teve_visto_eua", label: "Você já teve Visto dos Estados Unidos?", kind: "bool" },
      { key: "visto_anterior_data_emissao", label: "Data de emissão do último visto", kind: "date", showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") },
      { key: "visto_anterior_data_vencimento", label: "Data de vencimento do último visto", kind: "date", showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") },
      { key: "visto_anterior_numero", label: "Número do visto (descrito em vermelho)", kind: "text", help: "Caso não saiba o número, escreva \"NÃO SEI\".", showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") },
      { key: "visto_mesmo_tipo", label: "Você está solicitando o mesmo tipo de visto?", kind: "bool", showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") },
      { key: "visto_perdido_roubado", label: "Seu visto americano já foi perdido ou roubado?", kind: "bool", showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") },
      { key: "visto_perdido_roubado_ano", label: "Digite o ano em que o visto foi perdido ou roubado", kind: "text", showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") && SIM_NAO(d, "visto_perdido_roubado") },
      { key: "visto_perdido_roubado_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "ja_teve_visto_eua") && SIM_NAO(d, "visto_perdido_roubado") },
      { key: "visto_cancelado_revogado", label: "Seu visto já foi cancelado ou revogado?", kind: "bool" },
      { key: "visto_cancelado_revogado_explique", label: "Explique o motivo do cancelamento ou revogação", kind: "textarea", showIf: (d) => SIM_NAO(d, "visto_cancelado_revogado") },
      { key: "visto_recusado", label: "Você já teve um Visto Americano recusado, ou teve a entrada negada nos Estados Unidos?", kind: "bool", optional: true },
      { key: "visto_recusado_explique", label: "Descreva com detalhes sobre a recusa ou negativa de entrada nos Estados Unidos", kind: "textarea", showIf: (d) => SIM_NAO(d, "visto_recusado") },
      { key: "esta_negado", label: "Você já teve sua autorização de viagem negada por meio do sistema ESTA?", kind: "bool" },
      { key: "peticao_imigrante", label: "Alguém já entrou com uma petição de imigrante em seu nome nos Serviços de Cidadania e Imigração dos Estados Unidos?", kind: "bool" },
    ],
  },
  {
    id: "endereco_residencial",
    titulo: "Endereço Residencial",
    campos: [
      { key: "endereco_rua", label: "Rua, nº, apto", kind: "text" },
      { key: "endereco_cidade", label: "Cidade", kind: "text" },
      { key: "endereco_estado", label: "Estado", kind: "text" },
      { key: "endereco_cep", label: "Cep", kind: "text" },
      { key: "endereco_pais", label: "País", kind: "text", placeholder: "Brasil" },
      { key: "telefone_principal", label: "Telefone Principal (DD) 0000-0000", kind: "text", help: "Preencher neste formato (DD) 0000-0000." },
      { key: "telefone_secundario", label: "Segundo Telefone (DD) 0000-0000", kind: "text", optional: true, help: "Preencher neste formato (DD) 0000-0000." },
      { key: "telefone_comercial", label: "Telefone do Trabalho (DD) 0000-0000", kind: "text", optional: true, help: "Preencher neste formato (DD) 0000-0000. Descreva apenas se tiver." },
      { key: "email", label: "Informe seu e-mail principal", kind: "text" },
      {
        key: "rede_social_1", label: "Sua principal Rede Social?", kind: "select",
        help: "Se não tiver, selecione Nenhuma.",
        options: ["Nenhuma", "Instagram", "Facebook", "Linkedin"].map((v) => ({ value: v, label: v })),
      },
      { key: "rede_social_1_handle", label: "Descreva aqui endereço da sua Rede Social", kind: "text", showIf: (d) => d.rede_social_1 === "Instagram" || d.rede_social_1 === "Facebook" || d.rede_social_1 === "Linkedin" },
      {
        key: "rede_social_2", label: "Sua segunda Rede Social?", kind: "select", optional: true,
        help: "Se não tiver, selecione Nenhuma.",
        options: ["Nenhuma", "Instagram", "Facebook", "Linkedin"].map((v) => ({ value: v, label: v })),
      },
      { key: "rede_social_2_handle", label: "Descreva aqui endereço da sua Rede Social", kind: "text", showIf: (d) => d.rede_social_2 === "Instagram" || d.rede_social_2 === "Facebook" || d.rede_social_2 === "Linkedin" },
    ],
  },
  {
    id: "passaporte",
    titulo: "Informações do passaporte",
    campos: [
      {
        key: "passaporte_tipo", label: "Tipo de passaporte", kind: "select",
        options: [{ value: "Regular", label: "Regular" }, { value: "Outros", label: "Outros" }],
      },
      { key: "passaporte_tipo_outro", label: "Descreva outros", kind: "text", showIf: (d) => d.passaporte_tipo === "Outros" },
      { key: "passaporte_numero", label: "Número do passaporte (composto por 2 letras e 6 números)", kind: "text", help: "Caso não saiba, escreva \"NÃO SEI\"." },
      {
        key: "passaporte_pais_emissor", label: "País que emitiu o passaporte", kind: "select",
        options: [{ value: "Brasil", label: "Brasil" }, { value: "Outros", label: "Outros" }],
      },
      { key: "passaporte_pais_emissor_outro", label: "Descreva outros", kind: "text", showIf: (d) => d.passaporte_pais_emissor === "Outros" },
      { key: "passaporte_cidade_emissora", label: "Cidade que emitiu o passaporte", kind: "text" },
      { key: "passaporte_estado_emissor", label: "Estado que emitiu o passaporte", kind: "text" },
      { key: "passaporte_data_emissao", label: "Data de emissão do Passaporte", kind: "date" },
      { key: "passaporte_data_validade", label: "Data de validade do Passaporte", kind: "date" },
      { key: "passaporte_perdido_roubado", label: "Você já perdeu ou roubaram seu Passaporte?", kind: "bool" },
      { key: "passaporte_perdido_roubado_numero", label: "Número do Documento Perdido ou Roubado", kind: "text", showIf: (d) => SIM_NAO(d, "passaporte_perdido_roubado") },
      { key: "passaporte_perdido_roubado_pais", label: "País de emissão do documento perdido ou roubado", kind: "text", showIf: (d) => SIM_NAO(d, "passaporte_perdido_roubado") },
      { key: "passaporte_perdido_roubado_explique", label: "Explique sobre o documento perdido ou roubado", kind: "textarea", showIf: (d) => SIM_NAO(d, "passaporte_perdido_roubado") },
    ],
  },
  {
    id: "contato_eua",
    titulo: "Informações sobre contato nos EUA",
    campos: [
      {
        key: "contato_eua_tipo", label: "Você tem contato com alguma pessoa ou empresa nos Estados Unidos?", kind: "select",
        options: [
          { value: "Sim, conheço uma Pessoa", label: "Sim, conheço uma Pessoa" },
          { value: "Sim, conheço uma Empresa", label: "Sim, conheço uma Empresa" },
          { value: "Não", label: "Não" },
        ],
      },
      { key: "contato_eua_nome", label: "Nome completo da pessoa ou empresa", kind: "text", showIf: (d) => d.contato_eua_tipo === "Sim, conheço uma Pessoa" || d.contato_eua_tipo === "Sim, conheço uma Empresa" },
      { key: "contato_eua_telefone", label: "Telefone da pessoa ou empresa", kind: "text", help: "Preencha corretamente este campo.", showIf: (d) => d.contato_eua_tipo === "Sim, conheço uma Pessoa" || d.contato_eua_tipo === "Sim, conheço uma Empresa" },
      { key: "contato_eua_email", label: "E-mail da pessoa ou empresa", kind: "text", showIf: (d) => d.contato_eua_tipo === "Sim, conheço uma Pessoa" || d.contato_eua_tipo === "Sim, conheço uma Empresa" },
      { key: "contato_eua_endereco_rua", label: "Rua", kind: "text", showIf: (d) => d.contato_eua_tipo === "Sim, conheço uma Pessoa" || d.contato_eua_tipo === "Sim, conheço uma Empresa" },
      { key: "contato_eua_endereco_bairro", label: "Bairro e Complemento", kind: "text", showIf: (d) => d.contato_eua_tipo === "Sim, conheço uma Pessoa" || d.contato_eua_tipo === "Sim, conheço uma Empresa" },
      { key: "contato_eua_endereco_cidade", label: "Cidade", kind: "text", showIf: (d) => d.contato_eua_tipo === "Sim, conheço uma Pessoa" || d.contato_eua_tipo === "Sim, conheço uma Empresa" },
      { key: "contato_eua_endereco_estado", label: "Estado", kind: "text", showIf: (d) => d.contato_eua_tipo === "Sim, conheço uma Pessoa" || d.contato_eua_tipo === "Sim, conheço uma Empresa" },
      { key: "contato_eua_endereco_cep", label: "Código postal", kind: "text", showIf: (d) => d.contato_eua_tipo === "Sim, conheço uma Pessoa" || d.contato_eua_tipo === "Sim, conheço uma Empresa" },
      { key: "contato_eua_endereco_pais", label: "País", kind: "text", showIf: (d) => d.contato_eua_tipo === "Sim, conheço uma Pessoa" || d.contato_eua_tipo === "Sim, conheço uma Empresa" },
      {
        key: "contato_eua_relacao", label: "Qual sua Relação com pessoa ou empresa citada acima?", kind: "select",
        showIf: (d) => d.contato_eua_tipo === "Sim, conheço uma Pessoa" || d.contato_eua_tipo === "Sim, conheço uma Empresa",
        options: ["Parente", "Cônjuge", "Amigo", "Parceiro Comercial", "Empregador", "Escola Oficial", "Outro"].map((v) => ({ value: v, label: v })),
      },
      { key: "contato_eua_relacao_detalhe", label: "Descreva sua relação com a pessoa ou a empresa?", kind: "textarea", showIf: (d) => d.contato_eua_relacao === "Outro" },
    ],
  },
  {
    id: "familia",
    titulo: "Informação da Família (parentes)",
    campos: [
      { key: "pai_nome", label: "Nome Completo do Pai", kind: "text" },
      { key: "pai_data_nascimento", label: "Data Nascimento Pai (se não souber deixe em branco)", kind: "date", optional: true },
      { key: "pai_esta_eua", label: "Seu Pai esta no EUA?", kind: "bool" },
      { key: "pai_situacao_eua", label: "Situação do seu Pai nos Estados Unidos", kind: "select", showIf: (d) => SIM_NAO(d, "pai_esta_eua"), options: SITUACAO_EUA_OPCOES },
      { key: "pai_situacao_eua_explique", label: "Explique", kind: "textarea", showIf: (d) => d.pai_situacao_eua === "Outro" },
      { key: "mae_nome", label: "Nome Completo da Mãe", kind: "text" },
      { key: "mae_data_nascimento", label: "Data Nascimento Mãe (se não souber deixe em branco)", kind: "date", optional: true },
      { key: "mae_esta_eua", label: "Sua Mãe esta no EUA?", kind: "bool" },
      { key: "mae_situacao_eua", label: "Situação da sua Mãe nos Estados Unidos", kind: "select", showIf: (d) => SIM_NAO(d, "mae_esta_eua"), options: SITUACAO_EUA_OPCOES },
      { key: "mae_situacao_eua_explique", label: "Explique", kind: "textarea", showIf: (d) => d.mae_situacao_eua === "Outro" },
      { key: "parente_1_grau_eua", label: "Você tem algum parente de primeiro grau, sem incluir os Pais, nos EUA?", kind: "bool", optional: true },
      { key: "parente_1_grau_nome", label: "Nome Completo do Parente Imediato", kind: "text", showIf: (d) => SIM_NAO(d, "parente_1_grau_eua") },
      {
        key: "parente_1_grau_parentesco", label: "Informe abaixo o Grau de Parentesco", kind: "select",
        showIf: (d) => SIM_NAO(d, "parente_1_grau_eua"),
        options: ["Noivo / Noiva", "Cônjuge", "Filho / Filha", "Irmão / Irmã"].map((v) => ({ value: v, label: v })),
      },
      { key: "parente_1_grau_situacao", label: "Situação do parente nos Estados Unidos", kind: "select", showIf: (d) => SIM_NAO(d, "parente_1_grau_eua"), options: SITUACAO_EUA_OPCOES },
      { key: "outro_parente_eua", label: "Você tem algum outro parente nos Estados Unidos?", kind: "bool" },
      { key: "outro_parente_eua_parentesco", label: "Descreva o Grau de parentesco", kind: "text", showIf: (d) => SIM_NAO(d, "outro_parente_eua") },
    ],
  },
  {
    id: "conjuge",
    titulo: "Informações do Cônjuge atual, Separado / Divorciado ou Viúvo",
    campos: [
      { key: "conjuge_nome", label: "Nome Completo do Cônjuge", kind: "text", showIf: EH_CONJUGE },
      {
        key: "ex_parceiros_qtd", label: "Selecione quantos Ex Parceiros teve", kind: "select",
        showIf: EH_EX_PARCEIRO,
        options: [{ value: "1", label: "1" }, { value: "2", label: "2" }],
      },
      { key: "ex_parceiro_nome", label: "Nome Completo do Ex Parceiro(a)", kind: "text", showIf: EH_EX_PARCEIRO },
      { key: "ex_parceiro2_nome", label: "Nome Completo do Ex Parceiro(a) 2", kind: "text", showIf: (d) => EH_EX_PARCEIRO(d) && d.ex_parceiros_qtd === "2" },
      { key: "conjuge_falecido_nome", label: "Nome Completo do Cônjuge Falecido(a)", kind: "text", showIf: EH_VIUVO },
      { key: "conjuge_data_nascimento", label: "Data Nascimento", kind: "date", showIf: TEM_HISTORICO_CONJUGAL },
      { key: "conjuge_data_nascimento_2", label: "Data Nascimento 2", kind: "date", showIf: (d) => EH_EX_PARCEIRO(d) && d.ex_parceiros_qtd === "2" },
      { key: "conjuge_nacionalidade", label: "Nacionalidade (País de Origem)", kind: "text", showIf: TEM_HISTORICO_CONJUGAL },
      { key: "conjuge_nacionalidade_2", label: "Nacionalidade (País de Origem) 2", kind: "text", showIf: (d) => EH_EX_PARCEIRO(d) && d.ex_parceiros_qtd === "2" },
      { key: "conjuge_cidade_nascimento", label: "Cidade de Nascimento do Cônjuge", kind: "text", showIf: TEM_HISTORICO_CONJUGAL },
      { key: "conjuge_cidade_nascimento_2", label: "Cidade de Nascimento 2", kind: "text", showIf: (d) => EH_EX_PARCEIRO(d) && d.ex_parceiros_qtd === "2" },
      { key: "data_casamento", label: "Data do Casamento", kind: "date", showIf: EH_EX_PARCEIRO },
      { key: "data_divorcio", label: "Data do Divórcio", kind: "date", showIf: EH_EX_PARCEIRO },
      { key: "data_casamento_2", label: "Data do Casamento 2", kind: "date", showIf: (d) => EH_EX_PARCEIRO(d) && d.ex_parceiros_qtd === "2" },
      { key: "data_divorcio_2", label: "Data do Divórcio 2", kind: "date", showIf: (d) => EH_EX_PARCEIRO(d) && d.ex_parceiros_qtd === "2" },
    ],
  },
  {
    id: "trabalho_atual",
    titulo: "Informações sobre Atividade Atual (Trabalho ou Estudo)",
    campos: [
      {
        key: "ocupacao_atual", label: "Atividade Atual", kind: "select",
        options: [
          "Empresário / Empreendedor / Dono Próprio Negócio", "Funcionário", "Aposentado",
          "Dona de Casa", "Estudante", "Outra", "Não se aplica",
        ].map((v) => ({ value: v, label: v })),
      },
      { key: "cargo", label: "Informe seu cargo ou escolaridade", kind: "text", showIf: (d) => d.ocupacao_atual === "Funcionário" || d.ocupacao_atual === "Estudante" },
      { key: "trabalho_data_inicio", label: "Data de Início no trabalho ou estudo", kind: "date", showIf: (d) => ["Empresário / Empreendedor / Dono Próprio Negócio", "Funcionário", "Outra", "Estudante"].includes(String(d.ocupacao_atual)) },
      { key: "trabalho_funcoes", label: "Descreva abaixo suas funções diárias no trabalho", kind: "textarea", showIf: (d) => ["Empresário / Empreendedor / Dono Próprio Negócio", "Funcionário", "Outra"].includes(String(d.ocupacao_atual)) },
      { key: "trabalho_empresa_nome", label: "Nome completo da empresa onde trabalha ou instituição de ensino", kind: "text", showIf: (d) => ["Empresário / Empreendedor / Dono Próprio Negócio", "Funcionário", "Outra", "Estudante"].includes(String(d.ocupacao_atual)) },
      { key: "trabalho_telefone", label: "DDD+Telefone", kind: "text", showIf: (d) => ["Empresário / Empreendedor / Dono Próprio Negócio", "Funcionário", "Outra", "Estudante"].includes(String(d.ocupacao_atual)) },
      { key: "trabalho_endereco_rua", label: "Rua", kind: "text", showIf: (d) => ["Empresário / Empreendedor / Dono Próprio Negócio", "Funcionário", "Outra", "Estudante"].includes(String(d.ocupacao_atual)) },
      { key: "trabalho_endereco_bairro", label: "Bairro e Complemento", kind: "text", showIf: (d) => ["Empresário / Empreendedor / Dono Próprio Negócio", "Funcionário", "Outra", "Estudante"].includes(String(d.ocupacao_atual)) },
      { key: "trabalho_endereco_cidade", label: "Cidade", kind: "text", showIf: (d) => ["Empresário / Empreendedor / Dono Próprio Negócio", "Funcionário", "Outra", "Estudante"].includes(String(d.ocupacao_atual)) },
      { key: "trabalho_endereco_estado", label: "Estado", kind: "text", showIf: (d) => ["Empresário / Empreendedor / Dono Próprio Negócio", "Funcionário", "Outra", "Estudante"].includes(String(d.ocupacao_atual)) },
      { key: "trabalho_endereco_cep", label: "Código postal", kind: "text", showIf: (d) => ["Empresário / Empreendedor / Dono Próprio Negócio", "Funcionário", "Outra", "Estudante"].includes(String(d.ocupacao_atual)) },
      { key: "trabalho_endereco_pais", label: "País", kind: "text", showIf: (d) => ["Empresário / Empreendedor / Dono Próprio Negócio", "Funcionário", "Outra", "Estudante"].includes(String(d.ocupacao_atual)) },
      { key: "possui_mais_de_um_emprego", label: "Possui mais de uma empresa ou mais de um emprego?", kind: "bool" },
      { key: "trabalho2_empresa_nome", label: "Nome completo da segunda empresa ou instituição de ensino", kind: "text", showIf: (d) => SIM_NAO(d, "possui_mais_de_um_emprego") },
      { key: "trabalho2_cargo", label: "Cargo / função na segunda empresa", kind: "text", showIf: (d) => SIM_NAO(d, "possui_mais_de_um_emprego") },
      { key: "trabalho2_telefone", label: "DDD+Telefone", kind: "text", showIf: (d) => SIM_NAO(d, "possui_mais_de_um_emprego") },
      { key: "trabalho2_endereco_rua", label: "Rua", kind: "text", showIf: (d) => SIM_NAO(d, "possui_mais_de_um_emprego") },
      { key: "trabalho2_endereco_bairro", label: "Bairro e Complemento", kind: "text", showIf: (d) => SIM_NAO(d, "possui_mais_de_um_emprego") },
      { key: "trabalho2_endereco_cidade", label: "Cidade", kind: "text", showIf: (d) => SIM_NAO(d, "possui_mais_de_um_emprego") },
      { key: "trabalho2_endereco_estado", label: "Estado", kind: "text", showIf: (d) => SIM_NAO(d, "possui_mais_de_um_emprego") },
      { key: "trabalho2_endereco_cep", label: "Código postal", kind: "text", showIf: (d) => SIM_NAO(d, "possui_mais_de_um_emprego") },
      { key: "trabalho2_endereco_pais", label: "País", kind: "text", showIf: (d) => SIM_NAO(d, "possui_mais_de_um_emprego") },
      { key: "trabalho2_data_inicio", label: "Data de Início nessa empresa", kind: "date", showIf: (d) => SIM_NAO(d, "possui_mais_de_um_emprego") },
      { key: "trabalho2_funcoes", label: "Descreva abaixo suas funções diárias nessa empresa", kind: "textarea", showIf: (d) => SIM_NAO(d, "possui_mais_de_um_emprego") },
    ],
  },
  {
    id: "trabalho_anterior",
    titulo: "Informações sobre Trabalhos Anteriores",
    campos: [
      { key: "trabalhou_outra_empresa_5anos", label: "Você Trabalhou em outra Empresa nos Últimos 5 Anos?", kind: "bool", showIf: (d) => !MENOR_DE_IDADE(d) },
      { key: "trabalho_anterior_empresa_nome", label: "Nome Completo da Empresa Anterior", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_cargo", label: "Cargo Anterior", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_supervisor", label: "Nome Completo do Supervisor", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_telefone", label: "Telefone com DDD (00) 0000-0000", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_endereco_rua", label: "Rua", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_endereco_bairro", label: "Bairro e Complemento", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_endereco_cidade", label: "Cidade", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_endereco_estado", label: "Estado", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_endereco_cep", label: "Código postal", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_endereco_pais", label: "País", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_data_inicio", label: "Data Início", kind: "date", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_data_fim", label: "Data Saída", kind: "date", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior_funcoes", label: "Descreva Brevemente suas Funções", kind: "textarea", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") },
      { key: "trabalho_anterior2_empresa_nome", label: "Nome da Empresa Anterior 2", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && !!d.trabalho_anterior_empresa_nome },
      { key: "trabalho_anterior2_cargo", label: "Cargo Anterior", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && !!d.trabalho_anterior_empresa_nome },
      { key: "trabalho_anterior2_supervisor", label: "Nome Completo do Supervisor", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && !!d.trabalho_anterior_empresa_nome },
      { key: "trabalho_anterior2_telefone", label: "Telefone com DDD (00) 0000-0000", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && !!d.trabalho_anterior_empresa_nome },
      { key: "trabalho_anterior2_endereco_rua", label: "Rua", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && !!d.trabalho_anterior_empresa_nome },
      { key: "trabalho_anterior2_endereco_bairro", label: "Bairro e Complemento", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && !!d.trabalho_anterior_empresa_nome },
      { key: "trabalho_anterior2_endereco_cidade", label: "Cidade", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && !!d.trabalho_anterior_empresa_nome },
      { key: "trabalho_anterior2_endereco_estado", label: "Estado", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && !!d.trabalho_anterior_empresa_nome },
      { key: "trabalho_anterior2_endereco_cep", label: "Código postal", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && !!d.trabalho_anterior_empresa_nome },
      { key: "trabalho_anterior2_endereco_pais", label: "País", kind: "text", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && !!d.trabalho_anterior_empresa_nome },
      { key: "trabalho_anterior2_data_inicio", label: "Data Início", kind: "date", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && !!d.trabalho_anterior_empresa_nome },
      { key: "trabalho_anterior2_data_fim", label: "Data Saída", kind: "date", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && !!d.trabalho_anterior_empresa_nome },
      { key: "trabalho_anterior2_funcoes", label: "Descreva Brevemente suas Funções", kind: "textarea", showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos") && !!d.trabalho_anterior_empresa_nome },
      {
        key: "trabalho_anterior_extra", label: "Mais empresas anteriores (se tiver mais de 2 nos últimos 5 anos)", kind: "list",
        showIf: (d) => SIM_NAO(d, "trabalhou_outra_empresa_5anos"),
        itemFields: [
          { key: "empresa_nome", label: "Nome Completo da Empresa", kind: "text" },
          { key: "cargo", label: "Cargo", kind: "text" },
          { key: "supervisor", label: "Nome Completo do Supervisor", kind: "text" },
          { key: "telefone", label: "Telefone com DDD (00) 0000-0000", kind: "text" },
          { key: "endereco", label: "Endereço completo (rua, bairro, cidade, estado, CEP, país)", kind: "text" },
          { key: "data_inicio", label: "Data Início", kind: "date" },
          { key: "data_fim", label: "Data Saída", kind: "date" },
          { key: "funcoes", label: "Descreva Brevemente suas Funções", kind: "textarea" },
        ],
      },
    ],
  },
  {
    id: "escolaridade",
    titulo: "Escolaridade",
    campos: [
      { key: "estudou_nivel_medio_superior", label: "Concluiu o Ensino de Nível Médio ou Superior?", kind: "bool" },
      { key: "instituicao_nome", label: "Nome Completo da Instituição", kind: "text", showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "instituicao_telefone", label: "Telefone com DDD (00) 0000-0000", kind: "text", showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "instituicao_endereco_rua", label: "Rua", kind: "text", showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "instituicao_endereco_bairro", label: "Bairro e Complemento", kind: "text", showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "instituicao_endereco_cidade", label: "Cidade", kind: "text", showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "instituicao_endereco_estado", label: "Estado", kind: "text", showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "instituicao_endereco_cep", label: "Código postal", kind: "text", showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "instituicao_endereco_pais", label: "País", kind: "text", showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "curso_nome", label: "Nome do Curso Acadêmico", kind: "text", showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "curso_data_inicio", label: "Data Início", kind: "date", showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      { key: "curso_data_termino", label: "Data de Término (caso esteja cursando ainda, colocar data prevista de término)", kind: "date", showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior") },
      {
        key: "outras_instituicoes", label: "Outras instituições de ensino (se tiver mais de uma formação)", kind: "list",
        showIf: (d) => SIM_NAO(d, "estudou_nivel_medio_superior"),
        itemFields: [
          { key: "nome", label: "Nome Completo da Instituição", kind: "text" },
          { key: "telefone", label: "Telefone com DDD (00) 0000-0000", kind: "text" },
          { key: "endereco", label: "Endereço completo (rua, bairro, cidade, estado, CEP, país)", kind: "text" },
          { key: "curso_nome", label: "Nome do Curso Acadêmico", kind: "text" },
          { key: "data_inicio", label: "Data Início", kind: "date" },
          { key: "data_termino", label: "Data de Término", kind: "date" },
        ],
      },
    ],
  },
  {
    id: "adicionais_educacao",
    titulo: "Informações adicionais sobre Educação, Trabalho, Treinamento",
    campos: [
      { key: "idiomas", label: "Descreva todos Idiomas que você fala (Informar somente se for Fluente no Idioma)", kind: "text" },
      { key: "viajou_ultimos_5_anos", label: "Você já viajou para algum País nos últimos 5 Anos?", kind: "bool" },
      { key: "paises_visitados_5_anos", label: "Descreva todos Países Visitados no Últimos 5 Anos", kind: "textarea", showIf: (d) => SIM_NAO(d, "viajou_ultimos_5_anos") },
    ],
  },
  {
    id: "adicionais",
    titulo: "Informações Adicionais",
    campos: [
      { key: "treinamento_arma", label: "Você tem alguma habilidade ou treinamento especializado com Arma de Fogo, Explosivos, Experiência Nuclear, Biológica ou Química?", kind: "bool" },
      { key: "treinamento_arma_detalhe", label: "Explique habilidade ou Treinamento Especializado", kind: "textarea", showIf: (d) => SIM_NAO(d, "treinamento_arma") },
      { key: "serviu_exercito", label: "Você já serviu ao Exército?", kind: "bool" },
      { key: "servico_militar_pais", label: "Selecione o País", kind: "text", showIf: (d) => SIM_NAO(d, "serviu_exercito") },
      { key: "servico_militar_ramo", label: "Ramo do Serviço", kind: "text", showIf: (d) => SIM_NAO(d, "serviu_exercito") },
      { key: "servico_militar_posto", label: "Classificação / Posição", kind: "text", showIf: (d) => SIM_NAO(d, "serviu_exercito") },
      { key: "servico_militar_especialidade", label: "Especialidade Militar", kind: "text", showIf: (d) => SIM_NAO(d, "serviu_exercito") },
      { key: "servico_militar_data_inicio", label: "Data Início Serviço", kind: "date", showIf: (d) => SIM_NAO(d, "serviu_exercito") },
      { key: "servico_militar_data_fim", label: "Data Término Serviço", kind: "date", showIf: (d) => SIM_NAO(d, "serviu_exercito") },
    ],
  },
  {
    id: "seguranca_1",
    titulo: "Informações Médicas, Criminais e de Segurança",
    campos: [
      {
        key: "seguranca_aviso", label: "Sobre estas perguntas", kind: "note",
        help: "O visto não pode ser concedido a pessoas que estão dentro das categorias específicas definidas por lei como inadmissíveis para os Estados Unidos (exceto quando a renúncia é obtida com antecedência). Responder \"Sim\" não significa automaticamente inelegibilidade para o visto — pode ser necessário comparecer pessoalmente perante um oficial consular. A equipe orienta os próximos passos em qualquer caso.",
      },
      { key: "seg_doenca_transmissivel", label: "Você tem uma doença transmissível de importância para a saúde pública, como a tuberculose (TB)?", kind: "bool" },
      { key: "seg_doenca_transmissivel_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_doenca_transmissivel") },
      { key: "seg_disturbio_mental_fisico", label: "Você tem um distúrbio mental ou físico que represente ou possa representar uma ameaça para a segurança ou bem-estar de si mesmo ou outros?", kind: "bool" },
      { key: "seg_disturbio_mental_fisico_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_disturbio_mental_fisico") },
      { key: "seg_usuario_drogas", label: "Você é ou já foi Usuário de Drogas ou Viciado?", kind: "bool" },
      { key: "seg_usuario_drogas_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_usuario_drogas") },
    ],
  },
  {
    id: "seguranca_2",
    titulo: "Segurança e Histórico Parte II",
    campos: [
      { key: "seg_preso_condenado", label: "Alguma vez você já foi preso ou condenado por qualquer ofensa ou crime, ainda que objeto de um indulto, anistia ou ação similar?", kind: "bool" },
      { key: "seg_preso_condenado_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_preso_condenado") },
      { key: "seg_substancias_controladas", label: "Alguma vez você violou, ou foi envolvido em uma conspiração para violar qualquer lei relativa às substâncias controladas?", kind: "bool" },
      { key: "seg_substancias_controladas_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_substancias_controladas") },
      { key: "seg_prostituicao", label: "Você vem para os Estados Unidos para exercer a prostituição ou comercialização ilegal ou ainda foi envolvido em prostituição ou a busca de prostitutas nos últimos 10 anos?", kind: "bool" },
      { key: "seg_prostituicao_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_prostituicao") },
      { key: "seg_lavagem_dinheiro", label: "Alguma vez você já esteve envolvido ou procurou se envolver em lavagem de dinheiro?", kind: "bool" },
      { key: "seg_lavagem_dinheiro_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_lavagem_dinheiro") },
      { key: "seg_trafico_pessoas", label: "Você já cometeu ou conspirou para cometer um crime de tráfico de pessoas nos Estados Unidos ou fora dos Estados Unidos?", kind: "bool" },
      { key: "seg_trafico_pessoas_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_trafico_pessoas") },
      { key: "seg_trafico_pessoas_auxilio", label: "Você já auxiliou, instigou, ou conspirou intencionalmente com um indivíduo que cometeu ou conspirou para cometer um crime grave de tráfico de pessoas nos Estados Unidos ou fora dos Estados Unidos?", kind: "bool" },
      { key: "seg_trafico_pessoas_auxilio_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_trafico_pessoas_auxilio") },
      { key: "seg_trafico_pessoas_beneficio", label: "Você é cônjuge, filho ou filha de um indivíduo que cometeu ou conspirou para cometer um crime de tráfico de pessoas nos Estados Unidos ou fora dos Estados Unidos e, nos últimos cinco anos, você se beneficiou conscientemente das atividades de tráfico?", kind: "bool" },
      { key: "seg_trafico_pessoas_beneficio_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_trafico_pessoas_beneficio") },
    ],
  },
  {
    id: "seguranca_3",
    titulo: "Segurança e Histórico Parte III — Espionagem e Terrorismo",
    campos: [
      { key: "seg_espionagem_sabotagem", label: "Você procurará o envolvimento em espionagem, sabotagem, violações de controle de exportação, ou qualquer outra atividade ilegal enquanto nos Estados Unidos?", kind: "bool" },
      { key: "seg_espionagem_sabotagem_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_espionagem_sabotagem") },
      { key: "seg_terrorismo", label: "Você procurará o envolvimento em atividades terroristas, enquanto nos Estados Unidos, ou já está envolvido em atividades terroristas?", kind: "bool" },
      { key: "seg_terrorismo_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_terrorismo") },
      { key: "seg_apoio_terrorismo", label: "Alguma vez você já prestou ou teve a intenção de prestar assistência financeira ou outro apoio a terroristas ou organizações terroristas?", kind: "bool" },
      { key: "seg_apoio_terrorismo_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_apoio_terrorismo") },
      { key: "seg_membro_organizacao_terrorista", label: "Você é um membro ou representante de uma organização terrorista?", kind: "bool" },
      { key: "seg_membro_organizacao_terrorista_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_membro_organizacao_terrorista") },
    ],
  },
  {
    id: "seguranca_4",
    titulo: "Segurança e Histórico Parte III — Crimes Graves e Imigração",
    campos: [
      { key: "seg_genocidio", label: "Alguma vez você já ordenou, incitou, esteve comprometido, assistido ou participado no genocídio?", kind: "bool" },
      { key: "seg_genocidio_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_genocidio") },
      { key: "seg_tortura", label: "Alguma vez você já cometeu, ordenou, incitou, assistido, ou participado de atos de tortura?", kind: "bool" },
      { key: "seg_tortura_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_tortura") },
      { key: "seg_violencia_extrajudicial", label: "Você já cometeu, ordenou, incitou, ou participou de execuções extrajudiciais, assassinatos políticos, ou outros atos de violência?", kind: "bool", optional: true },
      { key: "seg_violencia_extrajudicial_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_violencia_extrajudicial") },
      { key: "seg_liberdade_religiosa", label: "Alguma vez foi responsável direta ou indiretamente de graves violações da liberdade religiosa?", kind: "bool", optional: true },
      { key: "seg_liberdade_religiosa_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_liberdade_religiosa") },
      { key: "seg_deportacao", label: "Alguma vez você já foi objeto de uma audiência de deportação ou remoção?", kind: "bool", optional: true },
      { key: "seg_deportacao_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_deportacao") },
      { key: "seg_fraude_imigracao", label: "Alguma vez procurou obter ou ajudar outros a obter um visto de entrada nos Estados Unidos, ou qualquer outro benefício de imigração dos Estados Unidos por fraude ou deturpação deliberada ou outros meios ilícitos?", kind: "bool", optional: true },
      { key: "seg_fraude_imigracao_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_fraude_imigracao") },
      { key: "seg_overstay", label: "Você ultrapassou ilegalmente o período de tempo concedido por um funcionário da imigração, violando os termos de um visto E.U.?", kind: "bool", optional: true },
      { key: "seg_overstay_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_overstay") },
      { key: "seg_custodia_crianca", label: "Alguma vez manteve a custódia de uma criança cidadã E.U. fora dos Estados Unidos a partir de uma pessoa que tiver a guarda legal de um tribunal E.U.?", kind: "bool", optional: true },
      { key: "seg_custodia_crianca_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_custodia_crianca") },
      { key: "seg_voto_ilegal", label: "Você já votou nos Estados Unidos em violação de qualquer lei ou regulamento?", kind: "bool", optional: true },
      { key: "seg_voto_ilegal_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_voto_ilegal") },
      { key: "seg_renuncia_cidadania", label: "Alguma vez você já renunciou à cidadania norte-americana com a finalidade de evitar o imposto?", kind: "bool", optional: true },
      { key: "seg_renuncia_cidadania_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_renuncia_cidadania") },
      { key: "seg_escola_publica_sem_reembolso", label: "Você já assistiu a uma escola pública de estudante (F) ou de uma escola secundária pública depois de 30 de novembro de 1996, sem reembolso da escola?", kind: "bool", optional: true },
      { key: "seg_escola_publica_sem_reembolso_explique", label: "Explique", kind: "textarea", showIf: (d) => SIM_NAO(d, "seg_escola_publica_sem_reembolso") },
    ],
  },
];

// Todas as chaves que a robô espera (dados_cliente.json). Usada pra montar
// o JSON de exportação com todas as chaves presentes, mesmo as vazias.
export const DS160_TODAS_CHAVES: string[] = DS160_SECTIONS.flatMap((s) =>
  s.campos.filter((c) => c.kind !== "note").map((c) => c.key),
);

export function secoesVisiveis(dados: Ds160Dados) {
  return DS160_SECTIONS.map((sec) => ({
    ...sec,
    campos: sec.campos.filter((c) => !c.showIf || c.showIf(dados)),
  })).filter((sec) => sec.campos.length > 0);
}
