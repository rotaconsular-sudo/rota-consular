import { prisma } from "@/lib/prisma";

// Sem autenticação real ainda — usuário fixo de teste até o login por
// magic link ser implementado (ver PROJECT.md).
const TEST_USER_EMAIL = "teste@rotaconsular.com.br";

export async function getCurrentUser() {
  return prisma.user.upsert({
    where: { email: TEST_USER_EMAIL },
    update: {},
    create: {
      email: TEST_USER_EMAIL,
      name: "Usuário de Teste",
    },
  });
}
