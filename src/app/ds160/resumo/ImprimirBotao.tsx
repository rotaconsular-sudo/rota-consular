"use client";

export default function ImprimirBotao() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden w-fit rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-star transition hover:bg-brand-strong"
    >
      Imprimir / Salvar em PDF
    </button>
  );
}
