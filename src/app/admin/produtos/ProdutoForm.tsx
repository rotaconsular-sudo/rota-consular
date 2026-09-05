"use client";

import { useActionState } from "react";
import Link from "next/link";
import { salvarProduto, type FormState } from "./actions";
import ExcluirProdutoForm from "./ExcluirProdutoForm";

type Produto = {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  precoCents: number;
  tipo: "PRINCIPAL" | "ORDER_BUMP";
  duracaoDias: number | null;
  ativo: boolean;
  ordem: number;
};

const field =
  "rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/30";
const label = "flex flex-col gap-1.5 text-sm font-medium text-slate-700";

export default function ProdutoForm({ produto }: { produto?: Produto }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    salvarProduto,
    {},
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/admin/produtos" className="hover:text-ink">
          Produtos
        </Link>
        <span>/</span>
        <span className="text-slate-600">{produto ? produto.nome : "Novo produto"}</span>
      </div>

      <form action={formAction} className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6">
        {produto && <input type="hidden" name="id" value={produto.id} />}

        {state.error && (
          <p className="rounded-lg border border-err/30 bg-err/5 px-3 py-2 text-sm text-err">
            {state.error}
          </p>
        )}

        <label className={label}>
          Nome
          <input name="nome" defaultValue={produto?.nome} required className={field} />
        </label>

        <label className={label}>
          Slug
          <input
            name="slug"
            defaultValue={produto?.slug}
            required
            placeholder="checklist-casv"
            className={field}
          />
          <span className="text-xs font-normal text-slate-400">
            Identificador único. É o que vai como <code>id</code> do item no Mercado Pago —
            evite trocar depois que houver vendas.
          </span>
        </label>

        <label className={label}>
          Descrição
          <textarea
            name="descricao"
            defaultValue={produto?.descricao ?? ""}
            rows={3}
            className={field}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={label}>
            Preço (R$)
            <input
              name="preco"
              defaultValue={produto ? (produto.precoCents / 100).toFixed(2) : ""}
              required
              inputMode="decimal"
              placeholder="27,90"
              className={field}
            />
          </label>

          <label className={label}>
            Tipo
            <select name="tipo" defaultValue={produto?.tipo ?? "PRINCIPAL"} className={field}>
              <option value="PRINCIPAL">Principal</option>
              <option value="ORDER_BUMP">Order bump</option>
            </select>
          </label>

          <label className={label}>
            Dias de acesso
            <input
              name="duracaoDias"
              defaultValue={produto?.duracaoDias ?? ""}
              inputMode="numeric"
              placeholder="365"
              className={field}
            />
            <span className="text-xs font-normal text-slate-400">
              Vazio = não expira. Produtos de visto americano = 365.
            </span>
          </label>

          <label className={label}>
            Ordem
            <input
              name="ordem"
              type="number"
              defaultValue={produto?.ordem ?? 0}
              className={field}
            />
            <span className="text-xs font-normal text-slate-400">
              Menor aparece primeiro no checkout.
            </span>
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            name="ativo"
            defaultChecked={produto ? produto.ativo : true}
            className="h-4 w-4 rounded border-slate-300"
          />
          Ativo (aparece no checkout)
        </label>

        <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink-muted disabled:opacity-50"
          >
            {pending ? "Salvando…" : produto ? "Salvar alterações" : "Criar produto"}
          </button>
          <Link
            href="/admin/produtos"
            className="text-sm font-medium text-slate-500 hover:text-ink"
          >
            Cancelar
          </Link>
        </div>
      </form>

      {produto && <ExcluirProdutoForm produtoId={produto.id} />}
    </div>
  );
}
