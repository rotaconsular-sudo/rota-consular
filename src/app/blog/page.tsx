import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags, filterPosts, formatPostDate } from "@/lib/blog";
import { PostCard } from "@/components/blog/PostCard";
import { BlogHero } from "@/components/blog/BlogHero";
import { Pagination } from "@/components/blog/Pagination";

const PAGE_SIZE = 6;

export const metadata: Metadata = {
  title: "Blog | Rota Consular",
  description:
    "Artigos sobre visto americano, DS-160 e preparação para a entrevista consular.",
};

export default async function BlogPage(props: PageProps<"/blog">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const page = Math.max(1, Number(searchParams.page) || 1);

  const allPosts = getAllPosts();
  const tags = getAllTags();
  const filtered = filterPosts(allPosts, { q });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const posts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Destaque só na entrada limpa do blog (1ª página, sem busca).
  const showFeatured = !q && page === 1 && posts.length > 0;
  const featured = showFeatured ? posts[0] : null;
  const rest = showFeatured ? posts.slice(1) : posts;

  return (
    <>
      <BlogHero
        title="Blog e notícias"
        subtitle="Artigos sobre visto americano, DS-160 e preparação para a entrevista consular — sem promessa de aprovação, só informação para você chegar preparado."
        tags={tags}
        query={q}
      />

      <div className="mx-auto max-w-5xl px-6 py-12">
        {q && (
          <p className="mb-6 text-sm text-slate-600">
            {filtered.length}{" "}
            {filtered.length === 1 ? "resultado" : "resultados"} para{" "}
            <span className="font-semibold text-ink">&ldquo;{q}&rdquo;</span>
          </p>
        )}

        {posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            Nenhum artigo encontrado{q ? ` para "${q}"` : ""}.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {featured && <FeaturedPost post={featured} />}
            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                {rest.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath="/blog"
          query={q}
        />
      </div>
    </>
  );
}

function FeaturedPost({
  post,
}: {
  post: ReturnType<typeof getAllPosts>[number];
}) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-7 transition hover:border-slate-400 hover:shadow-sm sm:p-9">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-star">
          Em destaque
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <time dateTime={post.publishedAt}>
            {formatPostDate(post.publishedAt)}
          </time>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min de leitura</span>
        </div>
      </div>

      <Link href={`/blog/${post.slug}`} className="mt-4 block">
        <h2 className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-ink transition group-hover:text-accent sm:text-3xl">
          {post.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {post.excerpt}
        </p>
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link
          href={`/blog/${post.slug}`}
          className="text-sm font-semibold text-accent transition hover:text-ink"
        >
          Ler artigo →
        </Link>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag}`}
              className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-hairline hover:text-ink"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
