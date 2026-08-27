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
      className="w-full rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white transition hover:bg-ink-muted disabled:cursor-wait disabled:opacity-70"
    >
      {isPending ? "Abrindo pagamento…" : "Desbloquear checklist completo — R$47"}
    </button>
  );
}
