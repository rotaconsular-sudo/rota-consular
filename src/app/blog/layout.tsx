import SiteHeader from "@/components/SiteHeader";

export default function BlogLayout({ children }: LayoutProps<"/blog">) {
  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-ink">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
