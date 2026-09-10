import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  formatPostDate,
} from "@/lib/blog";
import { PostCard } from "@/components/blog/PostCard";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Blog Rota Consular`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 2);
  const primaryTag = post.tags[0];

  return (
    <>
      {/* Cabeçalho do artigo */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-ink"
          >
            <span aria-hidden>←</span> Blog
          </Link>

          {primaryTag && (
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-10 bg-slate-300" />
              <Link
                href={`/blog/tag/${primaryTag}`}
                className="eyebrow text-slate-500 transition hover:text-ink"
              >
                {primaryTag}
              </Link>
            </div>
          )}

          <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
            <time dateTime={post.publishedAt}>
              {formatPostDate(post.publishedAt)}
            </time>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min de leitura</span>
            {post.tags.length > 0 && (
              <>
                <span aria-hidden>·</span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag}`}
                      className="rounded-full border border-slate-200 px-2.5 py-0.5 font-medium text-slate-500 transition hover:border-ink hover:text-ink"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-2xl px-6 py-12">
        <div
          className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-ink prose-h2:mt-10 prose-h2:mb-3 prose-h2:text-xl sm:prose-h2:text-2xl prose-p:leading-relaxed prose-p:text-slate-700 prose-a:font-medium prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-strong:text-ink prose-li:text-slate-700 prose-li:marker:text-slate-400 prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:not-italic prose-blockquote:text-slate-600"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* CTA — mesma âncora navy do resto do site */}
        <aside className="mt-14 rounded-2xl bg-ink p-8 text-center">
          <span className="eyebrow text-accent-soft">Análise grátis</span>
          <p className="mx-auto mt-3 max-w-md text-balance text-lg font-bold text-white">
            Descubra o nível de prontidão do seu perfil para o visto
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            Um questionário rápido e um diagnóstico imediato — sem custo e sem
            cartão de crédito.
          </p>
          <Link
            href="/analise-de-perfil"
            className="mt-5 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-ink transition hover:bg-slate-100"
          >
            Fazer análise grátis
          </Link>
        </aside>

        {related.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-10">
            <h2 className="text-lg font-bold tracking-tight text-ink">
              Continue lendo
            </h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
