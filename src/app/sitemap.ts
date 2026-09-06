import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/url";

export default function sitemap(): MetadataRoute.Sitemap {
  const paginas: MetadataRoute.Sitemap = [
    { url: "", priority: 1 },
    { url: "/analise-de-perfil", priority: 0.9 },
    { url: "/mapads160", priority: 0.8 },
    { url: "/assessoria-completa", priority: 0.7 },
    { url: "/blog", priority: 0.6 },
    { url: "/politica-de-privacidade", priority: 0.2 },
  ].map((p) => ({
    url: `${SITE_URL}${p.url}`,
    lastModified: new Date(),
    priority: p.priority,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(`${post.publishedAt}T00:00:00`),
    priority: 0.5,
  }));

  return [...paginas, ...posts];
}
