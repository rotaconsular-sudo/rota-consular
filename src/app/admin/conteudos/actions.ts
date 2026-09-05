"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { youtubeId } from "@/lib/youtube";
import type { ConteudoTipo } from "@/generated/prisma/enums";

export type FormState = { error?: string };

const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25MB

function isHttpUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

type Campos = {
  titulo: string;
  tipo: ConteudoTipo;
  videoUrl: string | null;
  markdown: string | null;
  link: string | null;
  ativo: boolean;
  ordem: number;
};

function parseBase(formData: FormData): Campos {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const tipoRaw = String(formData.get("tipo") ?? "");
  const ordemRaw = String(formData.get("ordem") ?? "0").trim();

  if (!titulo) throw "O título é obrigatório.";
  if (!["VIDEO", "PDF", "ROTEIRO", "LINK"].includes(tipoRaw))
    throw "Tipo inválido.";
  const tipo = tipoRaw as ConteudoTipo;

  const ordem = Number(ordemRaw);
  if (!Number.isInteger(ordem)) throw "Ordem deve ser um número inteiro.";

  let videoUrl: string | null = null;
  let markdown: string | null = null;
  let link: string | null = null;

  if (tipo === "VIDEO") {
    videoUrl = String(formData.get("videoUrl") ?? "").trim();
    if (!videoUrl) throw "Informe a URL do vídeo no YouTube.";
    if (!youtubeId(videoUrl))
      throw "Não reconheci essa URL como um vídeo do YouTube.";
  } else if (tipo === "ROTEIRO") {
    markdown = String(formData.get("markdown") ?? "").trim();
    if (!markdown) throw "O roteiro não pode ficar vazio.";
  } else if (tipo === "LINK") {
    link = String(formData.get("link") ?? "").trim();
    if (!isHttpUrl(link)) throw "Informe uma URL válida (com http:// ou https://).";
  }

  return {
    titulo,
    tipo,
    videoUrl,
    markdown,
    link,
    ativo: formData.get("ativo") === "on",
    ordem,
  };
}

// Sobe o PDF pro Vercel Blob (privado). Retorna { blobUrl, arquivoNome } ou
// null se não veio arquivo novo.
async function uploadPdfSeHouver(
  formData: FormData,
): Promise<{ blobUrl: string; arquivoNome: string } | null> {
  const file = formData.get("arquivo");
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > MAX_PDF_BYTES) throw "PDF maior que 25MB.";
  if (file.type && file.type !== "application/pdf") throw "O arquivo precisa ser um PDF.";

  const safe = file.name.replace(/[^\w.\-]+/g, "_");
  const blob = await put(`conteudos/${crypto.randomUUID()}-${safe}`, file, {
    access: "private",
    addRandomSuffix: false,
  });
  return { blobUrl: blob.url, arquivoNome: file.name };
}

export async function salvarConteudo(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim() || null;

  let base: Campos;
  let pdf: { blobUrl: string; arquivoNome: string } | null;
  try {
    base = parseBase(formData);
    pdf = await uploadPdfSeHouver(formData);
    if (base.tipo === "PDF" && !id && !pdf) throw "Envie o arquivo PDF.";
  } catch (e) {
    return { error: typeof e === "string" ? e : "Dados inválidos." };
  }

  if (id) {
    const atual = await prisma.conteudo.findUnique({ where: { id } });
    if (!atual) return { error: "Conteúdo não encontrado." };

    // Trocou de arquivo: apaga o antigo do Blob.
    if (pdf && atual.blobUrl) {
      try {
        await del(atual.blobUrl);
      } catch {
        // arquivo já sumiu — segue
      }
    }

    await prisma.conteudo.update({
      where: { id },
      data: {
        titulo: base.titulo,
        tipo: base.tipo,
        videoUrl: base.videoUrl,
        markdown: base.markdown,
        link: base.link,
        ...(pdf ? { blobUrl: pdf.blobUrl, arquivoNome: pdf.arquivoNome } : {}),
        // Trocou pra um tipo que não usa arquivo: limpa referência.
        ...(base.tipo !== "PDF" ? { blobUrl: null, arquivoNome: null } : {}),
        ativo: base.ativo,
        ordem: base.ordem,
      },
    });
  } else {
    await prisma.conteudo.create({
      data: {
        titulo: base.titulo,
        tipo: base.tipo,
        videoUrl: base.videoUrl,
        markdown: base.markdown,
        link: base.link,
        blobUrl: pdf?.blobUrl ?? null,
        arquivoNome: pdf?.arquivoNome ?? null,
        ativo: base.ativo,
        ordem: base.ordem,
      },
    });
  }

  revalidatePath("/admin/conteudos");
  redirect("/admin/conteudos");
}

export async function alternarAtivoConteudo(id: string) {
  await requireAdmin();
  const c = await prisma.conteudo.findUnique({ where: { id } });
  if (!c) return;
  await prisma.conteudo.update({ where: { id }, data: { ativo: !c.ativo } });
  revalidatePath("/admin/conteudos");
}

export async function excluirConteudo(
  id: string,
  _prev: FormState,
): Promise<FormState> {
  await requireAdmin();
  const c = await prisma.conteudo.findUnique({ where: { id } });
  if (!c) redirect("/admin/conteudos");
  if (c!.blobUrl) {
    try {
      await del(c!.blobUrl);
    } catch {
      // ok
    }
  }
  // ProdutoConteudo tem onDelete: Cascade — os vínculos somem junto.
  await prisma.conteudo.delete({ where: { id } });
  revalidatePath("/admin/conteudos");
  revalidatePath("/admin/produtos");
  redirect("/admin/conteudos");
}
