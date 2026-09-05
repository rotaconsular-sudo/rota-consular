import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { fetchPayment } from "@/lib/mercadopago";
import { sendAcessoLiberado } from "@/lib/mailer";
import { generateToken, hashToken } from "@/lib/crypto";
import { getBaseUrl } from "@/lib/url";
import { concederAcessosDaCompra, revogarAcessosDaCompra } from "@/lib/loja";

const TOKEN_MINUTOS = 15;

// Nunca confia no corpo além do id — status e external_reference são sempre
// rebuscados na API do Mercado Pago.
function extrairPaymentId(body: unknown, url: URL) {
  const daQuery = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  if (daQuery) return daQuery;
  if (body && typeof body === "object" && "data" in body) {
    const data = (body as { data?: { id?: unknown } }).data;
    if (data?.id) return String(data.id);
  }
  return null;
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    // notificação sem corpo JSON — segue com null
  }

  const paymentId = extrairPaymentId(body, url);
  if (!paymentId) return new Response("ok", { status: 200 });

  const payment = await fetchPayment(paymentId);

  const ref = payment.external_reference ?? "";
  if (!ref.startsWith("pedido:")) {
    // não é pagamento da loja (pode ser o do freemium) — ignora
    return new Response("ok", { status: 200 });
  }
  const compraId = ref.slice("pedido:".length);

  const compra = await prisma.compra.findUnique({
    where: { id: compraId },
    include: { itens: { include: { produto: true } }, user: true },
  });
  if (!compra) return new Response("ok", { status: 200 });

  const mpPaymentId = String(payment.id);

  // Idempotência: já processado com esse pagamento e num estado final.
  if (compra.mpPaymentId === mpPaymentId && compra.status !== "PENDENTE") {
    return new Response("ok", { status: 200 });
  }

  const raw = JSON.parse(JSON.stringify(payment)) as Prisma.InputJsonValue;

  if (payment.status === "approved") {
    await prisma.compra.update({
      where: { id: compra.id },
      data: { status: "APROVADA", mpPaymentId, raw },
    });
    await concederAcessosDaCompra(compra.id);

    // e-mail com link que já loga e cai na área de membros
    const token = generateToken();
    await prisma.verificationToken.create({
      data: {
        email: compra.user.email,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + TOKEN_MINUTOS * 60 * 1000),
      },
    });
    const baseUrl = await getBaseUrl();
    await sendAcessoLiberado(compra.user.email, {
      loginUrl: `${baseUrl}/verificar?token=${token}&next=/minha-conta`,
      produtos: compra.itens.map((i) => i.produto.nome),
    });
  } else if (
    payment.status === "refunded" ||
    payment.status === "charged_back" ||
    payment.status === "cancelled"
  ) {
    await prisma.compra.update({
      where: { id: compra.id },
      data: {
        status: payment.status === "cancelled" ? "REJEITADA" : "ESTORNADA",
        mpPaymentId,
        raw,
      },
    });
    await revogarAcessosDaCompra(compra.id);
  } else {
    // pending / in_process / etc — só registra o id, sem liberar nada
    await prisma.compra.update({
      where: { id: compra.id },
      data: { mpPaymentId },
    });
  }

  return new Response("ok", { status: 200 });
}
