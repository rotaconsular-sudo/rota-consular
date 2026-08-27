"use client";

import { useTransition } from "react";
import { runAnalysis } from "@/app/actions";

export function RunAnalysisButton({
  applicationId,
  label,
}: {
  applicationId: string;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => runAnalysis(applicationId))}
      className="w-full rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white transition hover:bg-ink-muted disabled:cursor-wait disabled:opacity-70"
    >
      {isPending ? "Analisando… pode levar até 20 segundos" : label}
    </button>
  );
}
