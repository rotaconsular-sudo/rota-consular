import Link from "next/link";

export function BlogSidebar({
  tags,
  activeTag,
  query,
}: {
  tags: string[];
  activeTag?: string;
  query?: string;
}) {
  return (
    <aside className="flex w-full flex-col gap-6 lg:w-64 lg:shrink-0">
      <form action="/blog" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="O que você procura?"
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-muted"
        >
          Buscar
        </button>
      </form>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Tags
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              !activeTag
                ? "bg-ink text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-100 hover:text-ink"
            }`}
          >
            Todas
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag}`}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                activeTag === tag
                  ? "bg-ink text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-100 hover:text-ink"
              }`}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
