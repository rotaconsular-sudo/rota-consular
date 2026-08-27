import Link from "next/link";
import { getPrevStep } from "@/lib/wizard";

export function StepFooter({
  applicationId,
  currentSlug,
}: {
  applicationId: string;
  currentSlug: string;
}) {
  const prev = getPrevStep(currentSlug);

  return (
    <div className="flex items-center justify-between border-t border-slate-100 pt-5">
      {prev ? (
        <Link
          href={`/solicitacoes/${applicationId}/${prev.slug}`}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Voltar
        </Link>
      ) : (
        <span />
      )}

      <button
        type="submit"
        className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-muted"
      >
        Salvar e continuar
      </button>
    </div>
  );
}
