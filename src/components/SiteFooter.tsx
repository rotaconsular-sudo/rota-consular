import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";

/**
 * Âncora escura que fecha as páginas públicas, no mesmo navy da capa.
 * O disclaimer estava duplicado em 4 páginas — vive aqui agora.
 */


export default function SiteFooter() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <Link
            href="/"
            className="text-sm font-bold tracking-[0.14em] text-white transition hover:text-accent-soft"
          >
            ROTA CONSULAR
          </Link>
          <nav className="flex flex-col gap-3 text-sm text-slate-400 sm:items-end">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="transition hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-12 border-t border-white/10 pt-8 text-xs leading-relaxed text-slate-500">
          O Rota Consular é uma ferramenta de tecnologia e inteligência
          estratégica. Não somos afiliados ao governo dos Estados Unidos, à
          Embaixada ou ao Consulado americano. Isso não é uma promessa de
          aprovação — a decisão final é sempre do oficial consular americano.
          Nossa missão é te ajudar a chegar na entrevista com a melhor
          estratégia e documentação possível.
        </p>
      </div>
    </footer>
  );
}
