import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { DS160_SECTIONS, type Ds160Dados } from "@/lib/ds160Form";
import { devolverNumero } from "../actions";

function mostra(valor: unknown): string {
  if (valor === true) return "Sim";
  if (valor === false) return "Não";
  if (valor === undefined || valor === null || valor === "") return "—";
  if (Array.isArray(valor)) {
    return valor
      .map((it) =>
        typeof it === "object" && it
          ? Object.values(it as Record<string, unknown>).join(" · ")
          : String(it),
      )
      .join("  |  ");
  }
  return String(valor);
}

export default async function AdminDs160DetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;

  const s = await prisma.solicitacaoDs160.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!s) notFound();

  const dados = (s.dados as Ds160Dados) ?? {};

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/admin/ds160" className="hover:text-ink">
          DS-160
        </Link>
        <span>/</span>
        <span className="text-slate-600">{s.user.name ?? s.user.email}</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <div>
          <p className="font-medium text-ink">{s.user.name ?? "—"}</p>
          <p className="text-xs text-slate-400">{s.user.email} · CPF {s.cpf ?? "—"}</p>
          <p className="mt-1 text-xs text-slate-400">
            Status: {s.status} {s.enviadoEm ? `· enviado ${s.enviadoEm.toLocaleString("pt-BR")}` : ""}
          </p>
        </div>
        <a
          href={`/admin/ds160/${s.id}/exportar`}
          className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-white transition hover:bg-ink-muted"
        >
          Baixar JSON (robô)
        </a>
      </div>

      {/* devolver o número */}
      <form
        action={devolverNumero.bind(null, s.id)}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4"
      >
        <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-slate-700">
          Número do DS-160
          <input
            name="numero"
            defaultValue={s.numeroDs160 ?? ""}
            placeholder="AA00XXXXXX"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/30"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink-muted"
        >
          Salvar e enviar por e-mail
        </button>
        {sp.ok && <span className="text-sm text-ok">Número enviado ao cliente.</span>}
        {sp.erro === "numero" && <span className="text-sm text-err">Digite o número.</span>}
      </form>

      {/* dados preenchidos */}
      {DS160_SECTIONS.map((sec) => (
        <section key={sec.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-bold text-ink">{sec.titulo}</h2>
          <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {sec.campos
              .filter((c) => c.kind !== "note")
              .map((c) => (
                <div key={c.key} className="flex justify-between gap-3 border-b border-slate-50 py-1">
                  <dt className="text-slate-500">{c.label}</dt>
                  <dd className="text-right font-medium text-ink">{mostra(dados[c.key])}</dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
