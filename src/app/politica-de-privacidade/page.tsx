import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getLegalDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de Privacidade | Rota Consular",
  description:
    "Como o Rota Consular coleta, usa, compartilha e protege seus dados pessoais, de acordo com a LGPD.",
};

function formatData(iso: string) {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PoliticaPrivacidadePage() {
  const doc = getLegalDoc("politica-de-privacidade");
  if (!doc) notFound();

  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-ink">
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-2xl px-6 py-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">
            {doc.title}
          </h1>
          {doc.updatedAt && (
            <p className="mt-2 text-sm text-slate-500">
              Última atualização: {formatData(doc.updatedAt)}
            </p>
          )}
          <div
            className="prose prose-slate mt-8 max-w-none prose-headings:font-bold prose-a:text-accent prose-table:block prose-table:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: doc.contentHtml }}
          />
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
