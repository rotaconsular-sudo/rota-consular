"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateToken, hashToken } from "@/lib/crypto";
import { sendMagicLink } from "@/lib/mailer";

const TOKEN_DURATION_MINUTES = 15;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function requestMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    redirect("/entrar?erro=email_invalido");
  }

  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_DURATION_MINUTES * 60 * 1000);

  await prisma.verificationToken.create({
    data: { email, tokenHash, expiresAt },
  });

  const baseUrl = await getBaseUrl();
  await sendMagicLink(email, `${baseUrl}/verificar?token=${token}`);

  redirect("/entrar?enviado=1");
}
