import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { SITE_URL } from "@/lib/url";

export const metadata: Metadata = {
  title: "Sobre a Rota Consular | Rota Consular",
  description:
    "Quem é a Rota Consular: uma marca de assessoria para o visto americano de turismo, operada pela ASG CRUZ Agência de Viagens e Turismo. Nossos princípios, o que fazemos e como o blog é produzido.",
  alternates: { canonical: "/sobre" },
};

const PRINCIPIOS = [
  {
    titulo: "Sem promessa de aprovação",
    texto:
      "A decisão do visto é sempre do oficial consular americano. Nosso trabalho é te deixar preparado — nunca vender uma garantia que ninguém pode dar.",
  },
  {
    titulo: "Informação verificada",
    texto:
      "O que publicamos é apoiado em fontes oficiais (Departamento de Estado, consulado dos EUA, Polícia Federal, Receita Federal). Quando a regra muda, atualizamos o artigo e a data.",
  },
  {
    titulo: "Foco em preparar, não em atalho",
    texto:
      "Não somos despachante que “consegue” visto. Ajudamos você a organizar documentação, entender o processo e chegar coerente na entrevista.",
  },
  {
    titulo: "Transparência sobre limites",
    texto:
      "Quando um assunto depende de regra que pode mudar ou de análise do seu caso específico, dizemos isso com todas as letras.",
  },
];

const O_QUE_FAZEMOS = [
  {
    titulo: "Análise de perfil gratuita",
    texto:
      "Um questionário rápido que aponta os pontos fortes e frágeis do seu perfil para o visto de turismo.",
    href: "/analise-de-perfil",
  },
  {
    titulo: "DS-160 sem erros",
    texto:
      "Preenchimento do formulário oficial no seu idioma, com revisão humana antes do envio.",
    href: "/mapads160",
  },
  {
    titulo: "Assessoria completa",
    texto:
      "Acompanhamento do início ao fim: formulário, documentação e preparação para a entrevista.",
    href: "/assessoria-completa",
  },
  {
    titulo: "Blog",
    texto:
      "Artigos sobre visto americano, DS-160, passaporte e entrevista — para você chegar informado.",
    href: "/blog",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${SITE_URL}/sobre`,
  mainEntity: {
    "@type": "Organization",
    name: "Rota Consular",
    url: SITE_URL,
    description:
      "Marca de assessoria para o visto americano de turismo (B1/B2), operada pela ASG CRUZ Agência de Viagens e Turismo LTDA.",
    legalName: "ASG CRUZ AGENCIA DE VIAGENS E TURISMO LTDA",
    taxID: "21.416.792/0001-50",
    logo: `${SITE_URL}/logo-rota-consular.png`,
    contactPoint: {
      "@type": "ContactPoint",
      email: "contato@rotaconsular.com.br",
      contactType: "customer support",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
  },
};

export default function SobrePage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="flex-1">
        {/* Cabeçalho */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-slate-300" />
              <span className="eyebrow text-slate-500">Sobre</span>
            </div>
            <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              A Rota Consular
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
              Ajudamos brasileiros a se prepararem para o visto americano de
              turismo com informação verificada e sem falsas promessas.
            </p>
          </div>
        </header>

        {/* Quem somos */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Quem somos
            </h2>
            <div className="mt-4 space-y-4 text-slate-700 leading-relaxed">
              <p>
                <strong className="text-ink">Rota Consular</strong> é uma marca
                de assessoria voltada ao visto americano de turismo (B1/B2),
                operada pela{" "}
                <strong className="text-ink">
                  ASG CRUZ Agência de Viagens e Turismo LTDA
                </strong>{" "}
                (CNPJ 21.416.792/0001-50), uma agência de viagens e turismo
                brasileira.
              </p>
              <p>
                Reunimos, em um só lugar, três formas de ajuda: uma{" "}
                <Link
                  href="/analise-de-perfil"
                  className="font-medium text-accent hover:text-ink"
                >
                  análise de perfil gratuita
                </Link>
                , o preenchimento assistido do{" "}
                <Link
                  href="/mapads160"
                  className="font-medium text-accent hover:text-ink"
                >
                  DS-160
                </Link>{" "}
                e uma{" "}
                <Link
                  href="/assessoria-completa"
                  className="font-medium text-accent hover:text-ink"
                >
                  assessoria completa
                </Link>{" "}
                para quem quer acompanhamento do início ao fim.
              </p>
            </div>
          </div>
        </section>

        {/* Princípios */}
        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-6 py-14 sm:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Como trabalhamos
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {PRINCIPIOS.map((p) => (
                <div
                  key={p.titulo}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <p className="font-semibold text-ink">{p.titulo}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {p.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Como o blog é produzido */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Como o blog é produzido
            </h2>
            <div className="mt-4 space-y-4 text-slate-700 leading-relaxed">
              <p>
                Os artigos do{" "}
                <Link
                  href="/blog"
                  className="font-medium text-accent hover:text-ink"
                >
                  blog
                </Link>{" "}
                são escritos e revisados pela equipe da Rota Consular, com base
                em fontes oficiais: o Departamento de Estado dos EUA
                (travel.state.gov), o site do consulado dos EUA no Brasil, a
                Polícia Federal e a Receita Federal.
              </p>
              <p>
                Regras de visto, taxas e prazos mudam com frequência. Por isso
                cada artigo traz a data da última revisão e, sempre que um dado
                pode ter mudado, a orientação de confirmar na fonte oficial.
                Nenhum conteúdo do blog é aconselhamento jurídico nem análise do
                seu caso específico.
              </p>
            </div>
          </div>
        </section>

        {/* O que fazemos */}
        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-6 py-14 sm:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              O que oferecemos
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {O_QUE_FAZEMOS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-400"
                >
                  <p className="font-semibold text-ink">{item.titulo}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.texto}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* O que não somos */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              O que a Rota Consular não é
            </h2>
            <ul className="mt-4 space-y-3 text-slate-700 leading-relaxed">
              <li>
                <strong className="text-ink">
                  Não temos vínculo com o governo dos EUA
                </strong>
                , com a Embaixada ou com o Consulado americano. Somos uma
                empresa privada.
              </li>
              <li>
                <strong className="text-ink">Não vendemos aprovação.</strong> A
                decisão é sempre do oficial consular, e desconfie de quem promete
                garantir um visto.
              </li>
              <li>
                <strong className="text-ink">
                  Não somos despachante que “resolve” recusa.
                </strong>{" "}
                Ajudamos a corrigir o que está frágil no seu perfil e na sua
                preparação.
              </li>
            </ul>
          </div>
        </section>

        {/* Contato */}
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Contato
            </h2>
            <p className="mt-4 text-slate-700 leading-relaxed">
              Dúvidas sobre os nossos serviços ou sobre um conteúdo do blog:{" "}
              <a
                href="mailto:contato@rotaconsular.com.br"
                className="font-medium text-accent hover:text-ink"
              >
                contato@rotaconsular.com.br
              </a>
              . Para tratamento de dados pessoais, veja a{" "}
              <Link
                href="/politica-de-privacidade"
                className="font-medium text-accent hover:text-ink"
              >
                Política de Privacidade
              </Link>
              .
            </p>
            <Link
              href="/analise-de-perfil"
              className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-ink-muted"
            >
              Fazer a análise de perfil grátis
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
