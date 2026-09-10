import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { SITE_URL } from "@/lib/url";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const paginas: MetadataRoute.Sitemap = [
    { url: "", priority: 1, changeFrequency: "weekly" as const },
    { url: "/analise-de-perfil", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/mapads160", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/ds160", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/ds160-preenchido", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/assessoria-completa", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/sobre", priority: 0.5, changeFrequency: "yearly" as const },
    { url: "/blog", priority: 0.6, changeFrequency: "daily" as const },
    { url: "/politica-de-privacidade", priority: 0.2, changeFrequency: "yearly" as const },
  ].map((p) => ({
    url: `${SITE_URL}${p.url}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(`${post.updatedAt}T00:00:00`),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const tags: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: `${SITE_URL}/blog/tag/${tag}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.3,
  }));

  return [...paginas, ...posts, ...tags];
}
