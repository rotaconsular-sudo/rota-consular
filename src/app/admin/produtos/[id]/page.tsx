import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import ProdutoForm from "../ProdutoForm";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const produto = await prisma.produto.findUnique({ where: { id } });
  if (!produto) notFound();

  return (
    <ProdutoForm
      produto={{
        id: produto.id,
        slug: produto.slug,
        nome: produto.nome,
        descricao: produto.descricao,
        precoCents: produto.precoCents,
        tipo: produto.tipo,
        duracaoDias: produto.duracaoDias,
        ativo: produto.ativo,
        ordem: produto.ordem,
      }}
    />
  );
}
