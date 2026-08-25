import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, formatPostDate } from "@/lib/blog";

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

  return (
    <article className="mx-auto max-w-2xl px-6 py-12">
      <nav className="text-xs text-slate-500">
        <Link href="/blog" className="hover:text-blue-600">
          Blog
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-700">{post.title}</span>
      </nav>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
        {post.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tag/${tag}`}
            className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700"
          >
            #{tag}
          </Link>
        ))}
      </div>

      <div
        className="prose prose-slate mt-8 max-w-none prose-headings:font-bold prose-a:text-blue-600"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
        <p className="text-sm font-semibold text-slate-900">
          Quer saber o nível de prontidão da sua documentação para o visto?
        </p>
        <Link
          href="/#analise-gratis"
          className="mt-3 inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Fazer análise grátis
        </Link>
      </div>
    </article>
  );
}
