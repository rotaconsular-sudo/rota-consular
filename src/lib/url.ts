import { headers } from "next/headers";

// URL pública canônica — usada em sitemap, robots e metadataBase (rodam no
// build, sem request pra ler o host).
export const SITE_URL = "https://rotaconsular.com.br";

export async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
