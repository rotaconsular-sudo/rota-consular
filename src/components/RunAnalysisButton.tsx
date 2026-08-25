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
      className="w-full rounded-full bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
    >
      {isPending ? "Analisando… pode levar até 20 segundos" : label}
    </button>
  );
}
