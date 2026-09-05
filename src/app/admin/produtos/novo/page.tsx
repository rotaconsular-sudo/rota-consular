import { requireAdmin } from "@/lib/admin";
import { categoriasExistentes } from "@/lib/loja";
import ProdutoForm from "../ProdutoForm";

export default async function NovoProdutoPage() {
  await requireAdmin();
  return <ProdutoForm categorias={await categoriasExistentes()} />;
}
