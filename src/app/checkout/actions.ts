"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/url";
import {
  createLojaPreference,
  mpConfigurado,
} from "@/lib/mercadopago";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function criarPedido(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const nome = String(formData.get("nome") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const bumpSlugs = formData.getAll("bump").map(String).filter(Boolean);

  if (!EMAIL_RE.test(email)) redirect("/checkout?erro=email");

  const principal = await prisma.produto.findFirst({
    where: { tipo: "PRINCIPAL", ativo: true },
    orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
  });
  if (!principal) redirect("/checkout?erro=indisponivel");

  const bumps = bumpSlugs.length
    ? await prisma.produto.findMany({
        where: { slug: { in: bumpSlugs }, tipo: "ORDER_BUMP", ativo: true },
      })
    : [];

  const itens = [principal, ...bumps];
  const valorCents = itens.reduce((s, p) => s + p.precoCents, 0);

  const user = await prisma.user.upsert({
    where: { email },
    update: nome ? { name: nome } : {},
    create: { email, name: nome || null },
  });

  const compra = await prisma.compra.create({
    data: {
      userId: user.id,
      valorCents,
      status: "PENDENTE",
      raw: whatsapp ? { whatsapp } : undefined,
      itens: {
        create: itens.map((p) => ({ produtoId: p.id, precoCents: p.precoCents })),
      },
    },
  });

  if (!mpConfigurado()) {
    // Sem token do Mercado Pago: a Compra fica registrada como PENDENTE
    // e o checkout avisa que o pagamento ainda não está ligado.
    redirect("/checkout?erro=config");
  }

  const baseUrl = await getBaseUrl();
  const pref = await createLojaPreference({
    compraId: compra.id,
    items: itens.map((p) => ({
      id: p.slug,
      title: p.nome,
      unitPriceCents: p.precoCents,
    })),
    payerEmail: email,
    successUrl: `${baseUrl}/checkout/obrigado`,
    notificationUrl: `${baseUrl}/api/mercadopago/loja/webhook`,
  });

  await prisma.compra.update({
    where: { id: compra.id },
    data: { mpPreferenceId: pref.id },
  });

  redirect(pref.initPoint);
}
