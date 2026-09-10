import Link from "next/link";
import { logout } from "@/app/actions";
import { requireUser } from "@/lib/auth";
import { tierDs160 } from "@/lib/ds160";
import SiteHeader from "@/components/SiteHeader";
import MinimalFooter from "@/components/MinimalFooter";

export default async function Ds160Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const tier = await tierDs160(user.id);
  const acesso = tier !== null;

  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <SiteHeader variant="minimal">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="hidden sm:inline">{user.email}</span>
          <form action={logout}>
            <button type="submit" className="transition hover:text-ink">
              Sair
            </button>
          </form>
        </div>
      </SiteHeader>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        {acesso ? (
          children
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h1 className="text-lg font-bold text-ink">DS-160 preenchido pra você</h1>
            <p className="mt-2 text-sm text-slate-600">
              Você ainda não tem acesso a este serviço. Ele é liberado depois da
              compra.
            </p>
            <Link
              href="/checkout?p=ds160-preenchido"
              className="mt-4 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-star transition hover:bg-brand-strong"
            >
              Ver o serviço
            </Link>
          </div>
        )}
      </main>
      <MinimalFooter />
    </div>
  );
}
