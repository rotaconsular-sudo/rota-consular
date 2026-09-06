"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { sendDs160Numero } from "@/lib/mailer";

export async function devolverNumero(id: string, formData: FormData) {
  await requireAdmin();
  const numero = String(formData.get("numero") ?? "").trim();
  if (!numero) redirect(`/admin/ds160/${id}?erro=numero`);

  const s = await prisma.solicitacaoDs160.update({
    where: { id },
    data: { numeroDs160: numero, status: "ENTREGUE", entregueEm: new Date() },
    include: { user: true },
  });

  await sendDs160Numero({ email: s.user.email, numero });

  revalidatePath(`/admin/ds160/${id}`);
  redirect(`/admin/ds160/${id}?ok=1`);
}
