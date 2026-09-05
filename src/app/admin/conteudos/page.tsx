import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { alternarAtivoConteudo } from "./actions";

const TIPO_LABEL: Record<string, string> = {
  VIDEO: "vídeo",
  PDF: "PDF",
  ROTEIRO: "roteiro",
  LINK: "link",
};

function resumo(c: {
  tipo: string;
  videoUrl: string | null;
  arquivoNome: string | null;
  link: string | null;
  markdown: string | null;
}) {
  if (c.tipo === "VIDEO") return c.videoUrl ?? "—";
  if (c.tipo === "PDF") return c.arquivoNome ?? "—";
  if (c.tipo === "LINK") return c.link ?? "—";
  if (c.tipo === "ROTEIRO")
    return c.markdown ? `${c.markdown.slice(0, 60)}…` : "—";
  return "—";
}

export default async function AdminConteudosPage() {
  await requireAdmin();

  const conteudos = await prisma.conteudo.findMany({
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { produtos: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Conteúdos</h1>
          <p className="mt-1 text-sm text-slate-500">
            O que é entregue na área de membros. O vínculo com cada produto é
            feito na tela do produto.
          </p>
        </div>
        <Link
          href="/admin/conteudos/novo"
          className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-ink-muted"
        >
          Novo conteúdo
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Origem</th>
              <th className="px-4 py-3 font-medium">Produtos</th>
              <th className="px-4 py-3 font-medium">Ativo</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {conteudos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Nenhum conteúdo ainda.
                </td>
              </tr>
            )}
            {conteudos.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-ink">{c.titulo}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500">
                    {TIPO_LABEL[c.tipo]}
                  </span>
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-xs text-slate-500">
                  {resumo(c)}
                </td>
                <td className="px-4 py-3 text-slate-500">{c._count.produtos}</td>
                <td className="px-4 py-3">
                  <form action={alternarAtivoConteudo.bind(null, c.id)}>
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                        c.ativo
                          ? "bg-ok/10 text-ok hover:bg-ok/20"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {c.ativo ? "ativo" : "inativo"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/conteudos/${c.id}`}
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
