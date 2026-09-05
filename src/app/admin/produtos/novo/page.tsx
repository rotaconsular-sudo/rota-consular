import { requireAdmin } from "@/lib/admin";
import ProdutoForm from "../ProdutoForm";

export default async function NovoProdutoPage() {
  await requireAdmin();
  return <ProdutoForm />;
}
