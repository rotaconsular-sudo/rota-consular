import type { ReactNode } from "react";

/** Eyebrow com filete vermelho — abre toda seção nas páginas de marketing. */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-0.5 w-6 bg-brand" />
      <span className="eyebrow text-slate-500">{children}</span>
    </div>
  );
}

/** Estrela vermelha — marcador de item "incluído / a favor". */
export function Star({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-3.5 w-3.5 shrink-0 fill-brand ${className}`}
      aria-hidden
    >
      <path d="M8 0l2 5 5 .4-3.8 3.3 1.2 5L8 12.6 3.4 15.7l1.2-5L.8 5.4 5.8 5z" />
    </svg>
  );
}

/** Lista de itens com estrela. */
export function StarList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2.5 text-slate-700">
          <Star className="mt-1.5" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
