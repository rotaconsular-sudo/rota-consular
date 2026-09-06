"use client";

export default function ImprimirBotao() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden w-fit rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink-muted"
    >
      Imprimir / Salvar em PDF
    </button>
  );
}
