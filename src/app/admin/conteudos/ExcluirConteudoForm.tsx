"use client";

import { useActionState } from "react";
import { excluirConteudo, type FormState } from "./actions";

export default function ExcluirConteudoForm({ conteudoId }: { conteudoId: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    excluirConteudo.bind(null, conteudoId),
    {},
  );

  return (
    <form
      action={action}
      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
    >
      <div className="text-sm">
        <p className="font-medium text-ink">Excluir conteúdo</p>
        {state.error ? (
          <p className="mt-0.5 text-err">{state.error}</p>
        ) : (
          <p className="mt-0.5 text-slate-400">
            Remove o conteúdo e o desvincula de todos os produtos. Não afeta compras.
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-err/40 px-4 py-2 text-sm font-semibold text-err transition hover:bg-err/5 disabled:opacity-50"
      >
        {pending ? "Excluindo…" : "Excluir"}
      </button>
    </form>
  );
}
