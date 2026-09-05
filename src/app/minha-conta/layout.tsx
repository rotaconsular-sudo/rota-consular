import { logout } from "@/app/actions";
import { requireUser } from "@/lib/auth";
import SiteHeader from "@/components/SiteHeader";

export default async function MinhaContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

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
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
