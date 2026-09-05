import { notFound } from "next/navigation";
import { get } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { podeVerConteudo } from "@/lib/acesso";

// Serve o PDF privado só pra quem tem acesso ao conteúdo. O blobUrl nunca
// vai pro cliente — o download passa sempre por aqui.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ conteudoId: string }> },
) {
  const user = await requireUser();
  const { conteudoId } = await params;

  const conteudo = await prisma.conteudo.findUnique({ where: { id: conteudoId } });
  if (!conteudo || !conteudo.ativo || conteudo.tipo !== "PDF" || !conteudo.blobUrl)
    notFound();
  if (!(await podeVerConteudo(user.id, conteudoId))) notFound();

  const blob = await get(conteudo.blobUrl, { access: "private" });
  if (!blob) notFound();

  const nome = conteudo.arquivoNome ?? "material.pdf";
  return new Response(blob.stream, {
    headers: {
      "Content-Type": blob.blob.contentType ?? "application/pdf",
      "Content-Disposition": `attachment; filename="${nome.replace(/"/g, "")}"`,
    },
  });
}
