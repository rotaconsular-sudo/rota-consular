import type { Metadata } from "next";
import { getAllPosts, getAllTags, filterPosts } from "@/lib/blog";
import { PostCard } from "@/components/blog/PostCard";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { Pagination } from "@/components/blog/Pagination";

const PAGE_SIZE = 6;

export async function generateMetadata(
  props: PageProps<"/blog/tag/[tag]">
): Promise<Metadata> {
  const { tag } = await props.params;
  return {
    title: `#${tag} | Blog Rota Consular`,
    description: `Artigos marcados com #${tag} no blog do Rota Consular.`,
  };
}

export default async function BlogTagPage(props: PageProps<"/blog/tag/[tag]">) {
  const { tag } = await props.params;
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams.page) || 1);

  const allPosts = getAllPosts();
  const tags = getAllTags();
  const filtered = filterPosts(allPosts, { tag });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const posts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        Artigos com #{tag}
      </h1>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          {posts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              Nenhum artigo encontrado com essa tag.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            basePath={`/blog/tag/${tag}`}
          />
        </div>

        <BlogSidebar tags={tags} activeTag={tag} />
      </div>
    </div>
  );
}
