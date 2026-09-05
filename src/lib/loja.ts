import { prisma } from "@/lib/prisma";
import { produtosLiberados } from "@/lib/acesso";

const DIA_MS = 24 * 60 * 60 * 1000;

// Categorias já usadas em algum produto — pra sugerir no admin (datalist).
export async function categoriasExistentes(): Promise<string[]> {
  const rows = await prisma.produto.findMany({
    where: { categoria: { not: null } },
    distinct: ["categoria"],
    select: { categoria: true },
    orderBy: { categoria: "asc" },
  });
  return rows.map((r) => r.categoria!).filter(Boolean);
}

// Bloco "Leve também": dado um conteúdo que o usuário está vendo, retorna
// produtos que ele NÃO tem, da(s) categoria(s) promovida(s) pelos produtos
// que ele possui e que liberam esse conteúdo.
export async function produtosParaPromover(userId: string, conteudoId: string) {
  const meusProdutoIds = await produtosLiberados(userId);
  if (meusProdutoIds.length === 0) return [];

  // Produtos que EU tenho E que liberam este conteúdo.
  const donos = await prisma.produto.findMany({
    where: {
      id: { in: meusProdutoIds },
      conteudos: { some: { conteudoId } },
    },
    select: { categoria: true, promoverCategoria: true },
  });

  const categorias = [
    ...new Set(
      donos
        .map((p) => p.promoverCategoria ?? p.categoria)
        .filter((c): c is string => Boolean(c)),
    ),
  ];
  if (categorias.length === 0) return [];

  return prisma.produto.findMany({
    where: {
      ativo: true,
      categoria: { in: categorias },
      id: { notIn: meusProdutoIds },
    },
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
    take: 6,
    select: {
      slug: true,
      nome: true,
      descricao: true,
      precoCents: true,
      categoria: true,
    },
  });
}

// Concede (ou renova) o Acesso de cada item de uma compra aprovada.
// Idempotente: chamar de novo com a mesma compra não duplica nada.
export async function concederAcessosDaCompra(compraId: string) {
  const compra = await prisma.compra.findUnique({
    where: { id: compraId },
    include: { itens: { include: { produto: true } } },
  });
  if (!compra) return;

  const agora = Date.now();
  for (const item of compra.itens) {
    const expiraEm = item.produto.duracaoDias
      ? new Date(agora + item.produto.duracaoDias * DIA_MS)
      : null;

    await prisma.acesso.upsert({
      where: {
        userId_produtoId: { userId: compra.userId, produtoId: item.produtoId },
      },
      update: {
        origem: "COMPRA",
        compraId: compra.id,
        revogadoEm: null,
        expiraEm,
      },
      create: {
        userId: compra.userId,
        produtoId: item.produtoId,
        origem: "COMPRA",
        compraId: compra.id,
        expiraEm,
      },
    });
  }
}

// Revoga os acessos concedidos por uma compra (estorno / chargeback).
// Não mexe em acesso manual nem em acesso de outra compra ao mesmo produto.
export async function revogarAcessosDaCompra(compraId: string) {
  await prisma.acesso.updateMany({
    where: { compraId, origem: "COMPRA", revogadoEm: null },
    data: { revogadoEm: new Date() },
  });
}
