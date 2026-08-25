"use client";

import { useTransition } from "react";
import { createCheckoutPreference } from "@/app/actions";

export function UnlockChecklistButton({ applicationId }: { applicationId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => createCheckoutPreference(applicationId))}
      className="w-full rounded-full bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
    >
      {isPending ? "Abrindo pagamento…" : "Desbloquear checklist completo — R$47"}
    </button>
  );
}
