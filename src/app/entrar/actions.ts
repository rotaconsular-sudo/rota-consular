"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateToken, hashToken } from "@/lib/crypto";
import { sendMagicLink } from "@/lib/mailer";
import { getBaseUrl } from "@/lib/url";

const TOKEN_DURATION_MINUTES = 15;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
