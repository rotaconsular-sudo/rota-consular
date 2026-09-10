import Link from "next/link";
import { BlogPostMeta, formatPostDate } from "@/lib/blog";

export function PostCard({ post }: { post: BlogPostMeta }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-400 hover:shadow-sm">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingMinutes} min de leitura</span>
      </div>

      <Link href={`/blog/${post.slug}`} className="mt-3 block">
        <h2 className="text-lg font-bold leading-snug tracking-tight text-ink transition group-hover:text-accent">
          {post.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {post.excerpt}
        </p>
      </Link>

      <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-slate-100">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tag/${tag}`}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-ink hover:text-ink"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </article>
  );
}
