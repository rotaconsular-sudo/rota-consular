import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import ConteudoForm from "../ConteudoForm";

export default async function EditarConteudoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const conteudo = await prisma.conteudo.findUnique({ where: { id } });
  if (!conteudo) notFound();

  return (
    <ConteudoForm
      conteudo={{
        id: conteudo.id,
        titulo: conteudo.titulo,
        descricao: conteudo.descricao,
        tipo: conteudo.tipo,
        videoUrl: conteudo.videoUrl,
        blobUrl: conteudo.blobUrl,
        arquivoNome: conteudo.arquivoNome,
        markdown: conteudo.markdown,
        link: conteudo.link,
        ativo: conteudo.ativo,
        ordem: conteudo.ordem,
      }}
    />
  );
}
