import { prisma } from "@/lib/prisma";
import { mpConfigurado } from "@/lib/mercadopago";
import SiteHeader from "@/components/SiteHeader";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; p?: string }>;
}) {
  const { erro, p } = await searchParams;

  // `?p=slug` destaca um produto específico (vem do "Leve também"). Sem ele,
  // usa o primeiro PRINCIPAL ativo.
  const destaque = p
    ? await prisma.produto.findFirst({
        where: { slug: p, ativo: true },
        select: { slug: true, nome: true, descricao: true, precoCents: true },
      })
    : null;

  const [principalPadrao, bumps] = await Promise.all([
    destaque
      ? Promise.resolve(destaque)
      : prisma.produto.findFirst({
          where: { tipo: "PRINCIPAL", ativo: true },
          orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
          select: { slug: true, nome: true, descricao: true, precoCents: true },
        }),
    prisma.produto.findMany({
      where: { tipo: "ORDER_BUMP", ativo: true, ...(p ? { slug: { not: p } } : {}) },
      orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
      select: { slug: true, nome: true, descricao: true, precoCents: true },
    }),
  ]);

  const principal = principalPadrao;

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
