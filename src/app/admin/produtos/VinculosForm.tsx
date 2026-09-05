"use client";

import { useActionState } from "react";
import Link from "next/link";
import { salvarVinculos, type FormState } from "./actions";

type ConteudoOpcao = {
  id: string;
  titulo: string;
  tipo: string;
  ativo: boolean;
};

const TIPO_LABEL: Record<string, string> = {
  VIDEO: "vídeo",
  PDF: "PDF",
  ROTEIRO: "roteiro",
  LINK: "link",
};

export default function VinculosForm({
  produtoId,
  conteudos,
  vinculadosIds,
}: {
  produtoId: string;
  conteudos: ConteudoOpcao[];
  vinculadosIds: string[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    salvarVinculos.bind(null, produtoId),
    {},
  );
  const vinculados = new Set(vinculadosIds);

  return (
    <form action={action} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <h2 className="text-sm font-bold text-ink">Conteúdos liberados por este produto</h2>
        <p className="mt-1 text-xs text-slate-400">
          Quem comprar este produto passa a ver, na área de membros, os conteúdos marcados aqui.
        </p>
      </div>

      {conteudos.length === 0 ? (
        <p className="text-sm text-slate-500">
          Nenhum conteúdo cadastrado ainda.{" "}
          <Link href="/admin/conteudos/novo" className="text-accent hover:underline">
            Criar conteúdo
          </Link>
          .
        </p>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-slate-100">
            {conteudos.map((c) => (
              <label key={c.id} className="flex items-center gap-3 py-2.5 text-sm">
                <input
                  type="checkbox"
                  name="conteudoIds"
                  value={c.id}
                  defaultChecked={vinculados.has(c.id)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span className="font-medium text-ink">{c.titulo}</span>
                <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-400">
                  {TIPO_LABEL[c.tipo] ?? c.tipo}
                </span>
                {!c.ativo && (
                  <span className="text-xs text-slate-400">(inativo)</span>
                )}
              </label>
            ))}
          </div>

          <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink-muted disabled:opacity-50"
            >
              {pending ? "Salvando…" : "Salvar vínculos"}
            </button>
            {state.ok && <span className="text-sm text-ok">Vínculos salvos.</span>}
            {state.error && <span className="text-sm text-err">{state.error}</span>}
          </div>
        </>
      )}
    </form>
  );
}
