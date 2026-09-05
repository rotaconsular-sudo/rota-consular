import { prisma } from "@/lib/prisma";
import { mpConfigurado } from "@/lib/mercadopago";
import SiteHeader from "@/components/SiteHeader";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  const [principal, bumps] = await Promise.all([
    prisma.produto.findFirst({
      where: { tipo: "PRINCIPAL", ativo: true },
      orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
      select: { slug: true, nome: true, descricao: true, precoCents: true },
    }),
    prisma.produto.findMany({
      where: { tipo: "ORDER_BUMP", ativo: true },
      orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
      select: { slug: true, nome: true, descricao: true, precoCents: true },
    }),
  ]);

  return (
    <div className="min-h-full bg-slate-50">
      <SiteHeader variant="minimal">
        <span className="inline-flex items-center rounded-full border border-ok/30 bg-ok/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ok">
          Ambiente seguro
        </span>
      </SiteHeader>

      {principal ? (
        <CheckoutForm
          produto={principal}
          bumps={bumps}
          mpConfigurado={mpConfigurado()}
          erro={erro}
        />
      ) : (
        <div className="mx-auto max-w-md px-6 py-20 text-center text-sm text-slate-500">
          Nenhum produto disponível para compra no momento.
        </div>
      )}
    </div>
  );
}
