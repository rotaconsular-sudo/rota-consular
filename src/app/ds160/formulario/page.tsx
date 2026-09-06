import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { temAcessoDs160, getOrCreateSolicitacao } from "@/lib/ds160";
import type { Ds160Dados } from "@/lib/ds160Form";
import Ds160Form from "./Ds160Form";

export default async function FormularioPage() {
  const user = await requireUser();
  if (!(await temAcessoDs160(user.id))) redirect("/ds160");

  const s = await getOrCreateSolicitacao(user.id);
  // Precisa do CPF (tela anterior) e não pode estar travado.
  if (!s.cpf) redirect("/ds160");
  if (s.status !== "RASCUNHO") redirect("/ds160");

  return <Ds160Form initial={(s.dados as Ds160Dados) ?? {}} />;
}
