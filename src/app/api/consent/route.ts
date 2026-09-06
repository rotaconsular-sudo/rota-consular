import { prisma } from "@/lib/prisma";

// Registra a escolha de cookies do visitante. Sem auth (visitante anônimo),
// sem IP — só o id anônimo de navegador que o cliente já gerou.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const visitorId = String(b.visitorId ?? "").slice(0, 64);
  if (!visitorId) return new Response("bad request", { status: 400 });

  await prisma.consentLog.create({
    data: {
      visitorId,
      estatistica: Boolean(b.estatistica),
      marketing: Boolean(b.marketing),
      policyVersion: String(b.policyVersion ?? "").slice(0, 32),
      userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
    },
  });

  return new Response("ok");
}
