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
      className="w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-70"
    >
      {isPending ? "Abrindo pagamento…" : "Desbloquear checklist completo — R$47"}
    </button>
  );
}
