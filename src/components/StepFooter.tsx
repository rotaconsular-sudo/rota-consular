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
    <div className="flex items-center justify-between border-t border-zinc-100 pt-5">
      {prev ? (
        <Link
          href={`/solicitacoes/${applicationId}/${prev.slug}`}
          className="text-sm text-zinc-600 hover:underline"
        >
          ← Voltar
        </Link>
      ) : (
        <span />
      )}

      <button
        type="submit"
        className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
      >
        Salvar e continuar
      </button>
    </div>
  );
}
