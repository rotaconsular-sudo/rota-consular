// Fonte única dos dados de produto usada pela página de vendas (`/`) e pelo
// checkout (`/checkout`), pra não duplicar preço/nome/copy em dois lugares.
// Copy e imagens são provisórias — o usuário ajusta depois.

export type Product = {
  slug: string;
  title: string;
  subtitle: string;
  priceCents: number;
  compareAtPriceCents: number;
  bullets: string[];
  themes: string[];
  bonusTitle: string;
  bonusDescription: string;
  bonusValueCents: number;
};

export type OrderBump = {
  slug: string;
  title: string;
  priceCents: number;
  description: string;
};

export const FLAGSHIP_PRODUCT: Product = {
  slug: "mapa-ds160",
  title: "DS-160 Sem Erros",
  subtitle:
    "Preencha seu DS-160 pelo nosso formulário 100% em português. Nossa equipe revisa suas respostas e faz o envio oficial ao Consulado americano por você.",
  priceCents: 2790,
  compareAtPriceCents: 9700,
  bullets: [
    "Formulário próprio, 100% em português",
    "Foco no DS-160 para visto de turista B1/B2",
    "Revisão humana especializada antes do envio",
    "Envio oficial direto ao site do Consulado americano",
    "Alertas sobre informações conflitantes ou inconsistentes",
    "Você recebe o código de confirmação e o PDF oficial",
  ],
  themes: [
    "Personal Information",
    "Travel Information",
    "Travel Companions",
    "Previous U.S. Travel",
    "Address and Phone",
    "Passport Information",
    "U.S. Point of Contact",
    "Family Information",
    "Work, Education and Training",
    "Security and Background",
  ],
  bonusTitle: "Checklist de Revisão do DS-160",
  bonusDescription:
    "Material para conferir os principais dados e informações do seu formulário antes de enviar.",
  bonusValueCents: 2700,
};

export const ORDER_BUMPS: OrderBump[] = [
  {
    slug: "checklist-casv",
    title: "Checklist CASV + Entrevista Consular",
    priceCents: 990,
    description:
      "Lista rápida para conferir documentos, informações e pontos importantes antes de sair de casa para o CASV e para a entrevista consular.",
  },
  {
    slug: "checklist-entrevista",
    title: "Checklist Preparatório para a Entrevista do Visto Americano",
    priceCents: 990,
    description:
      "Revise as principais informações do seu processo e veja perguntas que podem surgir na entrevista para chegar mais preparado(a) e seguro(a).",
  },
  {
    slug: "acesso-atualizacoes",
    title: "Acesso a Atualizações",
    priceCents: 990,
    description:
      "Receba acesso às atualizações do material quando houver novas versões, ajustes ou mudanças, sem precisar comprar novamente.",
  },
];
