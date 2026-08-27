import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function BlogLayout({ children }: LayoutProps<"/blog">) {
  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-ink">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
