import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { categoriasExistentes } from "@/lib/loja";
import ProdutoForm from "../ProdutoForm";
import VinculosForm from "../VinculosForm";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [produto, conteudos, categorias] = await Promise.all([
    prisma.produto.findUnique({
      where: { id },
      include: { conteudos: { select: { conteudoId: true } } },
    }),
    prisma.conteudo.findMany({
      orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
      select: { id: true, titulo: true, tipo: true, ativo: true },
    }),
    categoriasExistentes(),
  ]);
  if (!produto) notFound();

  return (
    <div className="flex flex-col gap-6">
      <ProdutoForm
        produto={{
          id: produto.id,
          slug: produto.slug,
          nome: produto.nome,
          descricao: produto.descricao,
          precoCents: produto.precoCents,
          tipo: produto.tipo,
          duracaoDias: produto.duracaoDias,
          categoria: produto.categoria,
          promoverCategoria: produto.promoverCategoria,
          ativo: produto.ativo,
          ordem: produto.ordem,
        }}
        categorias={categorias}
      />
      <VinculosForm
        produtoId={produto.id}
        conteudos={conteudos}
        vinculadosIds={produto.conteudos.map((c) => c.conteudoId)}
      />
    </div>
  );
}
