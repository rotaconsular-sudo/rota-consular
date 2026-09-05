import { prisma } from "@/lib/prisma";

const DIA_MS = 24 * 60 * 60 * 1000;

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
