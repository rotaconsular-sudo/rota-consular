import { prisma } from "@/lib/prisma";
import { fetchPayment } from "@/lib/mercadopago";
import { sendMagicLink } from "@/lib/mailer";
import { generateToken, hashToken } from "@/lib/crypto";
import { getBaseUrl } from "@/lib/url";

const TOKEN_DURATION_MINUTES = 15;

// Nunca confiar no corpo/query da notificação além do id — o status e o
// external_reference são sempre buscados de novo na API do Mercado Pago.
function extractPaymentId(body: unknown, url: URL) {
  const fromQuery = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  if (fromQuery) return fromQuery;

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
    // notificação sem corpo JSON (ex: query params só) — segue com null
  }

  const paymentId = extractPaymentId(body, url);
  if (!paymentId) return new Response("ok", { status: 200 });

  const payment = await fetchPayment(paymentId);
  const applicationId = payment.external_reference;
  if (!applicationId) return new Response("ok", { status: 200 });

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });
  if (!application) return new Response("ok", { status: 200 });

  const status =
    payment.status === "approved"
      ? "APPROVED"
      : payment.status === "rejected" || payment.status === "cancelled"
        ? "REJECTED"
        : "PENDING";

  const existing = await prisma.payment.findFirst({
    where: { applicationId, mpPaymentId: null, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  const paymentRecord = await prisma.payment.upsert({
    where: { mpPaymentId: String(payment.id) },
    update: { status },
    create: {
      applicationId,
      mpPreferenceId: existing?.mpPreferenceId ?? "",
      mpPaymentId: String(payment.id),
      status,
      amountCents: Math.round((payment.transaction_amount ?? 0) * 100),
    },
  });

  if (existing && existing.id !== paymentRecord.id) {
    await prisma.payment.delete({ where: { id: existing.id } });
  }

  if (status === "APPROVED" && application.email) {
    const user = await prisma.user.upsert({
      where: { email: application.email },
      update: {},
      create: { email: application.email },
    });

    if (!application.userId) {
      await prisma.application.update({
        where: { id: applicationId },
        data: { userId: user.id },
      });
    }

    const token = generateToken();
    await prisma.verificationToken.create({
      data: {
        email: application.email,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + TOKEN_DURATION_MINUTES * 60 * 1000),
      },
    });
    const baseUrl = await getBaseUrl();
    await sendMagicLink(application.email, `${baseUrl}/verificar?token=${token}`);
  }

  return new Response("ok", { status: 200 });
}
