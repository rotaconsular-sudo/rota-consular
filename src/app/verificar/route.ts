import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/crypto";
import { createSession } from "@/lib/session";

// Cookies só podem ser gravados em Server Action ou Route Handler — por
// isso essa verificação é uma rota, não uma page.tsx comum.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) redirect("/entrar");

  const tokenHash = hashToken(token);
  const record = await prisma.verificationToken.findUnique({
    where: { tokenHash },
  });

  if (!record || record.consumedAt || record.expiresAt < new Date()) {
    redirect("/entrar?erro=link_invalido");
  }

  await prisma.verificationToken.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  const user = await prisma.user.upsert({
    where: { email: record.email },
    update: {},
    create: { email: record.email },
  });

  await createSession(user.id);
  redirect("/");
}
