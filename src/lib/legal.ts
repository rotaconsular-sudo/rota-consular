import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const LEGAL_DIR = path.join(process.cwd(), "content", "legal");

export type LegalDoc = {
  title: string;
  updatedAt: string;
  contentHtml: string;
};

// Lê content/legal/<slug>.md — o front matter tem `title` e `updatedAt`.
// O primeiro "# Título" e a linha "**Última atualização:**" do corpo são
// removidos porque a página já mostra os dois no cabeçalho.
export function getLegalDoc(slug: string): LegalDoc | null {
  const filePath = path.join(LEGAL_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const body = content
    .replace(/^\s*#\s+.*\r?\n/, "")
    .replace(/^\s*\*\*[ÚU]ltima atualiza[cç][aã]o:.*\r?\n/i, "")
    .trimStart();

  // YAML converte `2026-09-06` num Date — normaliza pra "YYYY-MM-DD".
  const updatedAt =
    data.updatedAt instanceof Date
      ? data.updatedAt.toISOString().slice(0, 10)
      : String(data.updatedAt ?? "");

  return {
    title: data.title ?? slug,
    updatedAt,
    contentHtml: marked.parse(body, { async: false }),
  };
}
