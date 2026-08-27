import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";

/**
 * Nav única do site. `dark` é a variante que fica sobreposta à capa da home;
 * `light` é a barra fixa das páginas internas. Mesmos links nas duas — antes
 * cada página tinha (ou não tinha) a sua.
 */
export default function SiteHeader({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";

  return (
    <header
      className={
        dark
          ? "relative z-10"
          : "sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className={`text-sm font-bold tracking-[0.14em] transition ${
            dark ? "text-white hover:text-accent-soft" : "text-ink hover:text-accent"
          }`}
        >
          ROTA CONSULAR
        </Link>

        <nav
          className={`flex items-center gap-6 text-sm font-medium ${
            dark ? "text-white/70" : "text-slate-600"
          }`}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`hidden transition sm:inline ${
                dark ? "hover:text-white" : "hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/entrar"
            className={`rounded-full border px-4 py-1.5 transition ${
              dark
                ? "border-white/25 text-white hover:border-white/60 hover:bg-white/10"
                : "border-slate-300 text-ink hover:border-ink"
            }`}
          >
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  );
}
