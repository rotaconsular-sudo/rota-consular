import Link from "next/link";

// Rodapé enxuto pras telas que não usam o SiteFooter público (checkout,
// login, área logada). Só o link legal, sem distração.
export default function MinimalFooter() {
  return (
    <footer className="border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-400">
      <Link
        href="/politica-de-privacidade"
        className="transition hover:text-ink"
      >
        Política de Privacidade
      </Link>
    </footer>
  );
}
