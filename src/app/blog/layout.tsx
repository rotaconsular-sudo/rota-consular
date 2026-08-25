import Link from "next/link";

export default function BlogLayout({ children }: LayoutProps<"/blog">) {
  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold text-blue-600">
            🇺🇸 ROTA CONSULAR
          </Link>
          <Link href="/blog" className="text-sm font-semibold text-slate-700 hover:text-blue-600">
            Blog
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
