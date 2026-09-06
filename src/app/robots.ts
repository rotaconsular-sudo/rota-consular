import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Áreas privadas / funcionais — não devem ser indexadas.
      disallow: [
        "/admin",
        "/api",
        "/entrar",
        "/verificar",
        "/checkout",
        "/minha-conta",
        "/solicitacoes",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
