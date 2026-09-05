import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { logout } from "@/app/actions";

// Abas do admin. Vão sendo ligadas conforme cada passo é construído.
const TABS = [{ href: "/admin/produtos", label: "Produtos" }];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm font-bold tracking-[0.14em] text-ink"
            >
              ROTA CONSULAR · ADMIN
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
              {TABS.map((t) => (
                <Link key={t.href} href={t.href} className="transition hover:text-ink">
                  {t.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{user.email}</span>
            <form action={logout}>
              <button type="submit" className="transition hover:text-ink">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
