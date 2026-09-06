import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const STATUS: Record<string, { label: string; cls: string }> = {
  RASCUNHO: { label: "preenchendo", cls: "bg-slate-100 text-slate-500" },
  ENVIADO: { label: "aguardando equipe", cls: "bg-warn/10 text-warn" },
  ENTREGUE: { label: "número entregue", cls: "bg-ok/10 text-ok" },
};

function fmt(d: Date | null) {
  return d ? d.toLocaleDateString("pt-BR") : "—";
}

export default async function AdminDs160Page() {
  await requireAdmin();

  const lista = await prisma.solicitacaoDs160.findMany({
    orderBy: [{ status: "asc" }, { enviadoEm: "desc" }, { createdAt: "desc" }],
    include: { user: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-ink">DS-160</h1>
        <p className="mt-1 text-sm text-slate-500">
          Rascunhos de DS-160 enviados pelos clientes. Abra pra ver os dados,
          baixar o JSON e devolver o número.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">CPF</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Enviado</th>
              <th className="px-4 py-3 font-medium">Nº DS-160</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lista.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Nenhuma solicitação ainda.
                </td>
              </tr>
            )}
            {lista.map((s) => {
              const st = STATUS[s.status] ?? { label: s.status, cls: "" };
              return (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{s.user.name ?? "—"}</p>
                    <p className="text-xs text-slate-400">{s.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.cpf ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.cls}`}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{fmt(s.enviadoEm)}</td>
                  <td className="px-4 py-3 font-medium text-ink">{s.numeroDs160 ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/ds160/${s.id}`}
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      Abrir
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
