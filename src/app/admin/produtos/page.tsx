import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { formatBRL } from "@/lib/money";
import { alternarAtivo } from "./actions";

export default async function AdminProdutosPage() {
  await requireAdmin();

  const produtos = await prisma.produto.findMany({
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { conteudos: true, itens: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Produtos</h1>
          <p className="mt-1 text-sm text-slate-500">
            O que aparece no checkout e libera acesso na área de membros.
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-ink-muted"
        >
          Novo produto
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Acesso</th>
              <th className="px-4 py-3 font-medium">Conteúdos</th>
              <th className="px-4 py-3 font-medium">Ativo</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {produtos.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  Nenhum produto ainda.
                </td>
              </tr>
            )}
            {produtos.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-ink">{p.nome}</td>
                <td className="px-4 py-3">
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                    {p.slug}
                  </code>
                </td>
                <td className="px-4 py-3 text-slate-700">{formatBRL(p.precoCents)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500">
                    {p.tipo === "PRINCIPAL" ? "principal" : "order bump"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {p.duracaoDias ? `${p.duracaoDias} dias` : "não expira"}
                </td>
                <td className="px-4 py-3 text-slate-500">{p._count.conteudos}</td>
                <td className="px-4 py-3">
                  <form action={alternarAtivo.bind(null, p.id)}>
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                        p.ativo
                          ? "bg-ok/10 text-ok hover:bg-ok/20"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {p.ativo ? "ativo" : "inativo"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/produtos/${p.id}`}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
