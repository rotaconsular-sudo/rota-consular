import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireApplicationAccess } from "@/lib/applications";
import { WizardNav } from "@/components/WizardNav";
import { WIZARD_STEPS } from "@/lib/wizard";
import SiteHeader from "@/components/SiteHeader";
import MinimalFooter from "@/components/MinimalFooter";
import { Kicker } from "@/components/marketing";
import { logout } from "@/app/actions";

export default async function ApplicationLayout(
  props: LayoutProps<"/solicitacoes/[id]">,
) {
  const { id } = await props.params;

  await requireApplicationAccess(id);

  const application = await prisma.application.findUniqueOrThrow({
    where: { id },
    include: { answers: true },
  });

  const completedSlugs = WIZARD_STEPS.filter((s) =>
    s.step ? application.answers.some((a) => a.step === s.step) : false,
  ).map((s) => s.slug);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader variant="minimal">
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-ink transition hover:border-hairline"
          >
            Sair
          </button>
        </form>
      </SiteHeader>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-ink"
        >
          <span aria-hidden>←</span> Minhas solicitações
        </Link>
        <div className="mt-6">
          <Kicker>Análise de perfil</Kicker>
        </div>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink">
          Solicitação de{" "}
          {new Date(application.createdAt).toLocaleDateString("pt-BR")}
        </h1>
      </div>

      <div className="flex flex-1 flex-col gap-8 sm:flex-row">
        <nav className="sm:w-56 sm:shrink-0">
          <WizardNav applicationId={application.id} completedSlugs={completedSlugs} />
        </nav>

        <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          {props.children}
        </div>
      </div>
      </div>
      <MinimalFooter />
    </div>
  );
}
