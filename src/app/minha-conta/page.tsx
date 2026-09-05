import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { minhaBiblioteca } from "@/lib/acesso";

const TIPO_ICON: Record<string, string> = {
  VIDEO: "▶",
  PDF: "⬇",
  ROTEIRO: "☰",
  LINK: "↗",
};

function formatData(d: Date) {
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function MinhaContaPage() {
  const user = await requireUser();
  const biblioteca = await minhaBiblioteca(user.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Minha conta</h1>
        <p className="mt-1 text-sm text-slate-500">
          Materiais liberados pelas suas compras.
        </p>
      </div>

      {biblioteca.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Você ainda não tem nenhum material liberado.
        </div>
      ) : (
        biblioteca.map(({ acesso, produto, conteudos }) => (
          <section
            key={acesso.id}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-base font-bold text-ink">{produto.nome}</h2>
              {acesso.expiraEm && (
                <span className="text-xs text-slate-400">
                  acesso até {formatData(acesso.expiraEm)}
                </span>
              )}
            </div>

            {conteudos.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">
                Nenhum material publicado ainda para este produto.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col divide-y divide-slate-100">
                {conteudos.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/minha-conta/${c.id}`}
                      className="flex items-center gap-3 py-3 text-sm transition hover:text-accent"
                    >
                      <span className="text-slate-300">{TIPO_ICON[c.tipo]}</span>
                      <span className="font-medium text-ink">{c.titulo}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))
      )}
    </div>
  );
}
