import { requireAdmin } from "@/lib/admin";
import ConteudoForm from "../ConteudoForm";

export default async function NovoConteudoPage() {
  await requireAdmin();
  return <ConteudoForm />;
}
