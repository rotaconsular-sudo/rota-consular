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
    "Preencha seu DS-160 sozinho, sem abrir o site do governo em inglês. Formulário guiado 100% em português, com as mesmas seções do DS-160 oficial — você preenche, revisa e envia por conta própria.",
  priceCents: 2790,
  compareAtPriceCents: 9700,
  bullets: [
    "Formulário próprio, 100% em português — nada de traduzir na mão",
    "As mesmas seções e perguntas do DS-160 oficial, uma por vez, sem se perder",
    "Rascunho salvo automaticamente — pausa e volta quando quiser",
    "Ao final, um resumo das suas respostas organizado por seção, pronto pra usar no site oficial",
    "Você quem revisa e envia — esse é o plano econômico e independente",
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
