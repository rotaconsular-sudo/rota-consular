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
import { SITE_URL } from "@/lib/url";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;
  const url = `/blog/${post.slug}`;

  return {
    title: `${title} | Blog Rota Consular`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ["Rota Consular"],
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 2);
  const primaryTag = post.tags[0];
  const wasUpdated = post.updatedAt !== post.publishedAt;
  const canonical = `${SITE_URL}/blog/${post.slug}`;

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      inLanguage: "pt-BR",
      author: { "@type": "Organization", name: "Rota Consular", url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "Rota Consular",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo-rota-consular.png`,
        },
      },
      mainEntityOfPage: canonical,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${SITE_URL}/blog`,
        },
        { "@type": "ListItem", position: 3, name: post.title, item: canonical },
      ],
    },
  ];

  if (post.faq.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            {wasUpdated && (
              <>
                <span aria-hidden>·</span>
                <span>atualizado em {formatPostDate(post.updatedAt)}</span>
              </>
            )}
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
          className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-ink prose-h2:mt-10 prose-h2:mb-3 prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-base prose-h3:mt-6 prose-p:leading-relaxed prose-p:text-slate-700 prose-a:font-medium prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-strong:text-ink prose-li:text-slate-700 prose-li:marker:text-slate-400 prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:not-italic prose-blockquote:text-slate-600 prose-table:text-sm"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {post.faq.length > 0 && (
          <section className="mt-14 border-t border-slate-200 pt-10">
            <h2 className="text-xl font-bold tracking-tight text-ink">
              Perguntas frequentes
            </h2>
            <dl className="mt-6 divide-y divide-slate-200">
              {post.faq.map((f) => (
                <div key={f.q} className="py-4">
                  <dt className="font-semibold text-ink">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-slate-700">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

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
