import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export type BlogPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  readingMinutes: number;
};

export type BlogPost = BlogPostMeta & {
  contentHtml: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

function readPostFile(fileName: string): BlogPost {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const words = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    tags: data.tags ?? [],
    publishedAt: data.publishedAt,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    contentHtml: marked.parse(content, { async: false }),
  };
}

export function getAllPosts(): BlogPost[] {
  const files = fs.existsSync(POSTS_DIR)
    ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"))
    : [];

  return files
    .map(readPostFile)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return readPostFile(`${slug}.md`);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) tags.add(tag);
  }
  return Array.from(tags).sort();
}

export function filterPosts(
  posts: BlogPost[],
  { q, tag }: { q?: string; tag?: string }
): BlogPost[] {
  let result = posts;

  if (tag) {
    result = result.filter((p) => p.tags.includes(tag));
  }

  if (q) {
    const needle = q.trim().toLowerCase();
    if (needle) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.excerpt.toLowerCase().includes(needle) ||
          p.tags.some((t) => t.toLowerCase().includes(needle))
      );
    }
  }

  return result;
}

export function getRelatedPosts(slug: string, limit = 2): BlogPost[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === slug);
  const others = all.filter((p) => p.slug !== slug);
  if (!current) return others.slice(0, limit);

  return others
    .map((post) => ({
      post,
      shared: post.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        (a.post.publishedAt < b.post.publishedAt ? 1 : -1)
    )
    .slice(0, limit)
    .map((s) => s.post);
}

export function formatPostDate(publishedAt: string): string {
  return new Date(`${publishedAt}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
