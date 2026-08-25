"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WIZARD_STEPS } from "@/lib/wizard";

export function WizardNav({
  applicationId,
  completedSlugs,
}: {
  applicationId: string;
  completedSlugs: string[];
}) {
  const pathname = usePathname();

  return (
    <ol className="flex flex-col gap-1">
      {WIZARD_STEPS.map((step, index) => {
        const href = `/solicitacoes/${applicationId}/${step.slug}`;
        const isActive = pathname === href;
        const isDone = completedSlugs.includes(step.slug);

        return (
          <li key={step.slug}>
            <Link
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-blue-50 font-semibold text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] ${
                  isDone
                    ? "bg-emerald-600 text-white"
                    : isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-600"
                }`}
              >
                {isDone ? "✓" : index + 1}
              </span>
              {step.title}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
