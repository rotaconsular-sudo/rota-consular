import Link from "next/link";

/**
 * Cabeçalho compartilhado do blog (índice, busca e páginas de tag).
 * Segue o sistema das páginas públicas: eyebrow com filete, título em navy,
 * cor só onde significa algo — o resto é cinza. Sem sidebar: a navegação por
 * tag vira uma fileira de pills logo abaixo da busca.
 */
export function BlogHero({
  title,
  subtitle,
  tags,
  activeTag,
  query,
}: {
  title: string;
  subtitle?: string;
  tags: string[];
  activeTag?: string;
  query?: string;
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:py-16">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-slate-300" />
          <span className="eyebrow text-slate-500">Blog Rota Consular</span>
        </div>

        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            {subtitle}
          </p>
        )}

        <form action="/blog" className="mt-8 flex max-w-md gap-2">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Buscar por tema, ex: DS-160, vínculos…"
            aria-label="Buscar no blog"
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-ink focus:ring-2 focus:ring-ink/30"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-muted"
          >
            Buscar
          </button>
        </form>

        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <TagPill href="/blog" active={!activeTag}>
              Todas
            </TagPill>
            {tags.map((tag) => (
              <TagPill
                key={tag}
                href={`/blog/tag/${tag}`}
                active={activeTag === tag}
              >
                #{tag}
              </TagPill>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function TagPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-ink text-white"
          : "border border-slate-300 text-slate-600 hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
