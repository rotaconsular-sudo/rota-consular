import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { minhaBiblioteca } from "@/lib/acesso";
import { Kicker } from "@/components/marketing";

const TIPO_LABEL: Record<string, string> = {
  VIDEO: "Vídeo",
  PDF: "PDF",
  ROTEIRO: "Roteiro",
  LINK: "Link",
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
        <Kicker>Área de membros</Kicker>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
          Minha conta
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Materiais liberados pelas suas compras.
        </p>
      </div>

      {biblioteca.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Você ainda não tem nenhum material liberado.
        </div>
      ) : (
        biblioteca.map(({ acesso, produto, conteudos }) => (
          <section
            key={acesso.id}
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-bold text-ink">{produto.nome}</h2>
              {acesso.expiraEm && (
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-400">
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
                      className="group flex items-center gap-3 py-3 text-sm"
                    >
                      <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-brand">
                        {TIPO_LABEL[c.tipo] ?? c.tipo}
                      </span>
                      <span className="font-medium text-ink transition group-hover:text-accent">
                        {c.titulo}
                      </span>
                      <span
                        className="ml-auto text-slate-300 transition group-hover:text-accent"
                        aria-hidden
                      >
                        →
                      </span>
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
