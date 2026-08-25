import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireApplicationAccess } from "@/lib/applications";
import { WizardNav } from "@/components/WizardNav";
import { WIZARD_STEPS } from "@/lib/wizard";

export default async function ApplicationLayout(
  props: LayoutProps<"/solicitacoes/[id]">,
) {
  const { id } = await props.params;

  await requireApplicationAccess(id);

  const application = await prisma.application.findUniqueOrThrow({
    where: { id },
    include: { answers: true, documents: true },
  });

  const completedSlugs = WIZARD_STEPS.filter((s) => {
    if (s.step) return application.answers.some((a) => a.step === s.step);
    if (s.slug === "documentos") return application.documents.length > 0;
    return false;
  }).map((s) => s.slug);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
          ← Minhas solicitações
        </Link>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
          Solicitação de{" "}
          {new Date(application.createdAt).toLocaleDateString("pt-BR")}
        </h1>
      </div>

      <div className="flex flex-1 flex-col gap-8 sm:flex-row">
        <nav className="sm:w-56 sm:shrink-0">
          <WizardNav applicationId={application.id} completedSlugs={completedSlugs} />
        </nav>

        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {props.children}
        </div>
      </div>
    </div>
  );
}
