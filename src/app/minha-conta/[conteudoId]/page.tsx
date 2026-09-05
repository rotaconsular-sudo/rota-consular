import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { podeVerConteudo } from "@/lib/acesso";
import { youtubeEmbedUrl } from "@/lib/youtube";

export default async function ConteudoPage({
  params,
}: {
  params: Promise<{ conteudoId: string }>;
}) {
  const user = await requireUser();
  const { conteudoId } = await params;

  const conteudo = await prisma.conteudo.findUnique({ where: { id: conteudoId } });
  // 404 tanto pra conteúdo inexistente/inativo quanto pra sem acesso —
  // não revela a existência de material que a pessoa não comprou.
  if (!conteudo || !conteudo.ativo) notFound();
  if (!(await podeVerConteudo(user.id, conteudoId))) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/minha-conta" className="text-sm text-slate-400 hover:text-ink">
        ← Minha conta
      </Link>

      <h1 className="text-xl font-bold tracking-tight text-ink">{conteudo.titulo}</h1>

      {conteudo.tipo === "VIDEO" &&
        (youtubeEmbedUrl(conteudo.videoUrl ?? "") ? (
          <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-black">
            <iframe
              src={youtubeEmbedUrl(conteudo.videoUrl ?? "")!}
              title={conteudo.titulo}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="text-sm text-err">Vídeo indisponível.</p>
        ))}

      {conteudo.tipo === "PDF" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-600">
            {conteudo.arquivoNome ?? "Arquivo PDF"}
          </p>
          <a
            href={`/minha-conta/${conteudo.id}/arquivo`}
            className="mt-3 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink-muted"
          >
            Baixar PDF
          </a>
        </div>
      )}

      {conteudo.tipo === "LINK" && conteudo.link && (
        <a
          href={conteudo.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink-muted"
        >
          Abrir ↗
        </a>
      )}

      {conteudo.tipo === "ROTEIRO" && conteudo.markdown && (
        <div
          className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-accent"
          dangerouslySetInnerHTML={{
            __html: marked.parse(conteudo.markdown, { async: false }),
          }}
        />
      )}
    </div>
  );
}
