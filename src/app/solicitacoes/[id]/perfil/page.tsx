import { prisma } from "@/lib/prisma";
import { requireApplicationAccess } from "@/lib/applications";
import { savePerfilAnswers } from "@/app/actions";
import { Quiz } from "@/components/Quiz";
import type { QuizAnswers } from "@/lib/quizQuestions";

// Fora do grupo (chrome) de propósito: o quiz é uma experiência de tela
// cheia (fundo escuro, 1 pergunta por vez), não a página branca com
// sidebar que as outras etapas usam.
export default async function PerfilPage(
  props: PageProps<"/solicitacoes/[id]/perfil">,
) {
  const { id } = await props.params;

  await requireApplicationAccess(id);

  const answer = await prisma.answer.findUnique({
    where: { applicationId_step: { applicationId: id, step: "PERFIL" } },
  });

  const initialAnswers = (answer?.data as QuizAnswers) ?? undefined;
  const action = savePerfilAnswers.bind(null, id);

  return <Quiz initialAnswers={initialAnswers} onComplete={action} />;
}
