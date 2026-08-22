import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Toda ação/rota que mexe numa Application deve reconfirmar quem é o dono,
// mesmo que a tela já pareça garantir isso — Server Actions e Route
// Handlers são alcançáveis por POST/GET direto, não só pela UI.
export async function requireOwnApplication(userId: string, applicationId: string) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application || application.userId !== userId) notFound();

  return application;
}
