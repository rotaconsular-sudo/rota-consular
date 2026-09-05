import { prisma } from "@/lib/prisma";

// Acessos ativos de um usuário: não revogados e ainda dentro da validade.
export async function acessosAtivos(userId: string) {
  return prisma.acesso.findMany({
    where: {
      userId,
      revogadoEm: null,
      OR: [{ expiraEm: null }, { expiraEm: { gt: new Date() } }],
    },
    include: { produto: true },
    orderBy: { produto: { ordem: "asc" } },
  });
}

// Ids dos produtos com acesso ativo agora.
export async function produtosLiberados(userId: string): Promise<string[]> {
  const acessos = await acessosAtivos(userId);
  return acessos.map((a) => a.produtoId);
}

// Um conteúdo é visível se algum produto que o libera está entre os
// produtos com acesso ativo do usuário. Sempre revalidar no servidor
// antes de renderizar o conteúdo ou servir o arquivo.
export async function podeVerConteudo(
  userId: string,
  conteudoId: string,
): Promise<boolean> {
  const liberados = await produtosLiberados(userId);
  if (liberados.length === 0) return false;
  const vinculo = await prisma.produtoConteudo.findFirst({
    where: { conteudoId, produtoId: { in: liberados } },
  });
  return Boolean(vinculo);
}

// "Biblioteca" do usuário: cada produto que ele tem, com os conteúdos
// (ativos) que aquele produto libera.
export async function minhaBiblioteca(userId: string) {
  const acessos = await acessosAtivos(userId);
  if (acessos.length === 0) return [];

  const produtos = await prisma.produto.findMany({
    where: { id: { in: acessos.map((a) => a.produtoId) } },
    include: {
      conteudos: {
        include: { conteudo: true },
      },
    },
  });
  const porId = new Map(produtos.map((p) => [p.id, p]));

  return acessos.map((acesso) => {
    const produto = porId.get(acesso.produtoId);
    const conteudos = (produto?.conteudos ?? [])
      .map((pc) => pc.conteudo)
      .filter((c) => c.ativo)
      .sort((a, b) => a.ordem - b.ordem || (a.createdAt < b.createdAt ? -1 : 1));
    return { acesso, produto: acesso.produto, conteudos };
  });
}
