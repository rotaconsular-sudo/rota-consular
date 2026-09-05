import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import {
  buscarUsuario,
  concederAcesso,
  revogarAcesso,
  reativarAcesso,
} from "./actions";

const OK_MSG: Record<string, string> = {
  concedido: "Acesso concedido.",
  revogado: "Acesso revogado.",
  reativado: "Acesso reativado.",
};
const ERRO_MSG: Record<string, string> = {
  email: "E-mail inválido.",
  produto: "Produto não encontrado.",
};

function status(a: { revogadoEm: Date | null; expiraEm: Date | null }) {
  if (a.revogadoEm) return { label: "revogado", cls: "bg-slate-100 text-slate-400" };
  if (a.expiraEm && a.expiraEm < new Date())
    return { label: "expirado", cls: "bg-warn/10 text-warn" };
  return { label: "ativo", cls: "bg-ok/10 text-ok" };
}

function fmt(d: Date | null) {
  return d
    ? d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "—";
}

export default async function AdminAcessosPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; ok?: string; erro?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const email = sp.email?.trim().toLowerCase() ?? "";

  const [usuario, produtos] = await Promise.all([
    email
      ? prisma.user.findUnique({
          where: { email },
          include: {
            acessos: {
              include: { produto: true },
              orderBy: { createdAt: "desc" },
            },
          },
        })
      : null,
    prisma.produto.findMany({ orderBy: [{ ordem: "asc" }, { createdAt: "asc" }] }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Acessos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Conceder ou revogar acesso a um produto manualmente (cortesia, suporte,
          teste). Compras aprovadas concedem acesso sozinhas.
        </p>
      </div>

      {sp.ok && OK_MSG[sp.ok] && (
        <p className="rounded-lg border border-ok/30 bg-ok/5 px-3 py-2 text-sm text-ok">
          {OK_MSG[sp.ok]}
        </p>
      )}
      {sp.erro && ERRO_MSG[sp.erro] && (
        <p className="rounded-lg border border-err/30 bg-err/5 px-3 py-2 text-sm text-err">
          {ERRO_MSG[sp.erro]}
        </p>
      )}

      <form
        action={buscarUsuario}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4"
      >
        <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-slate-700">
          E-mail do usuário
          <input
            name="email"
            type="email"
            defaultValue={email}
            placeholder="cliente@email.com"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/30"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink-muted"
        >
          Buscar
        </button>
      </form>

      {email && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-bold text-ink">
              {usuario ? usuario.email : email}
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {usuario
                ? `Conta criada em ${fmt(usuario.createdAt)}`
                : "Nenhuma conta com esse e-mail ainda — conceder acesso vai criar uma."}
            </p>

            {usuario && usuario.acessos.length > 0 && (
              <table className="mt-4 w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="py-2 font-medium">Produto</th>
                    <th className="py-2 font-medium">Origem</th>
                    <th className="py-2 font-medium">Expira</th>
                    <th className="py-2 font-medium">Status</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuario.acessos.map((a) => {
                    const s = status(a);
                    return (
                      <tr key={a.id}>
                        <td className="py-2.5 font-medium text-ink">{a.produto.nome}</td>
                        <td className="py-2.5 text-slate-500">{a.origem.toLowerCase()}</td>
                        <td className="py-2.5 text-slate-500">{fmt(a.expiraEm)}</td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.cls}`}>
                            {s.label}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          {a.revogadoEm ? (
                            <form action={reativarAcesso.bind(null, a.id, email)}>
                              <button className="text-sm font-medium text-accent hover:underline">
                                Reativar
                              </button>
                            </form>
                          ) : (
                            <form action={revogarAcesso.bind(null, a.id, email)}>
                              <button className="text-sm font-medium text-err hover:underline">
                                Revogar
                              </button>
                            </form>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <form
            action={concederAcesso}
            className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <input type="hidden" name="email" value={email} />
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              Produto
              <select
                name="produtoId"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/30"
              >
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              Duração
              <select
                name="duracao"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/30"
              >
                <option value="produto">Padrão do produto</option>
                <option value="nunca">Não expira</option>
              </select>
            </label>
            <button
              type="submit"
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink-muted"
            >
              Conceder acesso
            </button>
          </form>
        </>
      )}
    </div>
  );
}
