"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { salvarConteudo, type FormState } from "./actions";
import ExcluirConteudoForm from "./ExcluirConteudoForm";

type Conteudo = {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: "VIDEO" | "PDF" | "ROTEIRO" | "LINK";
  videoUrl: string | null;
  blobUrl: string | null;
  arquivoNome: string | null;
  markdown: string | null;
  link: string | null;
  ativo: boolean;
  ordem: number;
};

const field =
  "rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/30";
const label = "flex flex-col gap-1.5 text-sm font-medium text-slate-700";

export default function ConteudoForm({ conteudo }: { conteudo?: Conteudo }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    salvarConteudo,
    {},
  );
  const [tipo, setTipo] = useState<Conteudo["tipo"]>(conteudo?.tipo ?? "VIDEO");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/admin/conteudos" className="hover:text-ink">
          Conteúdos
        </Link>
        <span>/</span>
        <span className="text-slate-600">
          {conteudo ? conteudo.titulo : "Novo conteúdo"}
        </span>
      </div>

      <form
        action={formAction}
        className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6"
      >
        {conteudo && <input type="hidden" name="id" value={conteudo.id} />}

        {state.error && (
          <p className="rounded-lg border border-err/30 bg-err/5 px-3 py-2 text-sm text-err">
            {state.error}
          </p>
        )}

        <label className={label}>
          Título
          <input name="titulo" defaultValue={conteudo?.titulo} required className={field} />
        </label>

        <label className={label}>
          Descrição (aparece abaixo do conteúdo)
          <textarea
            name="descricao"
            defaultValue={conteudo?.descricao ?? ""}
            rows={5}
            placeholder={"Sobre o que é este material, o que a pessoa vai ver…\n\nAceita Markdown."}
            className={field}
          />
        </label>

        <label className={label}>
          Tipo
          <select
            name="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as Conteudo["tipo"])}
            className={field}
          >
            <option value="VIDEO">Vídeo (YouTube)</option>
            <option value="PDF">PDF</option>
            <option value="ROTEIRO">Roteiro (Markdown)</option>
            <option value="LINK">Link</option>
          </select>
        </label>

        {tipo === "VIDEO" && (
          <label className={label}>
            URL do vídeo
            <input
              name="videoUrl"
              defaultValue={conteudo?.videoUrl ?? ""}
              placeholder="https://www.youtube.com/watch?v=..."
              className={field}
            />
            <span className="text-xs font-normal text-slate-400">
              Deixe o vídeo como <strong>não listado</strong> no YouTube.
            </span>
          </label>
        )}

        {tipo === "PDF" && (
          <label className={label}>
            Arquivo PDF
            <input
              name="arquivo"
              type="file"
              accept="application/pdf"
              className="text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
            />
            {conteudo?.arquivoNome && (
              <span className="text-xs font-normal text-slate-400">
                Atual: {conteudo.arquivoNome} — envie um novo só se quiser substituir.
              </span>
            )}
          </label>
        )}

        {tipo === "ROTEIRO" && (
          <label className={label}>
            Roteiro (Markdown)
            <textarea
              name="markdown"
              defaultValue={conteudo?.markdown ?? ""}
              rows={12}
              className={`${field} font-mono text-xs`}
              placeholder={"## Dia 1 — Chegada\n\n- Manhã: ...\n"}
            />
          </label>
        )}

        {tipo === "LINK" && (
          <label className={label}>
            URL
            <input
              name="link"
              defaultValue={conteudo?.link ?? ""}
              placeholder="https://..."
              className={field}
            />
          </label>
        )}

        <label className={label}>
          Ordem
          <input
            name="ordem"
            type="number"
            defaultValue={conteudo?.ordem ?? 0}
            className={`${field} sm:w-32`}
          />
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            name="ativo"
            defaultChecked={conteudo ? conteudo.ativo : true}
            className="h-4 w-4 rounded border-slate-300"
          />
          Ativo
        </label>

        <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink-muted disabled:opacity-50"
          >
            {pending ? "Salvando…" : conteudo ? "Salvar alterações" : "Criar conteúdo"}
          </button>
          <Link
            href="/admin/conteudos"
            className="text-sm font-medium text-slate-500 hover:text-ink"
          >
            Cancelar
          </Link>
        </div>
      </form>

      {conteudo && <ExcluirConteudoForm conteudoId={conteudo.id} />}
    </div>
  );
}
