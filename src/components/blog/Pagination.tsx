import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  basePath,
  query,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  query?: string;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav className="mt-8 flex items-center justify-center gap-2 text-sm">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={`rounded-lg border border-slate-300 px-3 py-1.5 font-medium ${
          page === 1
            ? "pointer-events-none text-slate-300"
            : "text-slate-600 hover:border-slate-400 hover:text-ink"
        }`}
      >
        Anterior
      </Link>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={hrefFor(n)}
          className={`rounded-lg px-3 py-1.5 font-medium ${
            n === page
              ? "bg-ink text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {n}
        </Link>
      ))}
      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={`rounded-lg border border-slate-300 px-3 py-1.5 font-medium ${
          page === totalPages
            ? "pointer-events-none text-slate-300"
            : "text-slate-600 hover:border-slate-400 hover:text-ink"
        }`}
      >
        Próxima
      </Link>
    </nav>
  );
}
