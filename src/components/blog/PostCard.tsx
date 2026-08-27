import Link from "next/link";
import { BlogPostMeta, formatPostDate } from "@/lib/blog";

export function PostCard({ post }: { post: BlogPostMeta }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-400">
      <Link href={`/blog/${post.slug}`} className="block">
        <h2 className="text-lg font-bold tracking-tight text-ink">
          {post.title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tag/${tag}`}
            className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600 hover:bg-slate-100 hover:text-ink"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </article>
  );
}
