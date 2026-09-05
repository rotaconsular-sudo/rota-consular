import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function ObrigadoPage() {
  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <SiteHeader variant="minimal" />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-6 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ok/10 text-xl text-ok">
          ✓
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Pagamento recebido
        </h1>
        <p className="text-sm text-slate-600">
          Assim que o Mercado Pago confirmar (costuma ser na hora, no Pix),
          você recebe um e-mail com o link de acesso aos materiais.
        </p>
        <p className="text-sm text-slate-500">
          Já pode entrar pela sua conta usando o mesmo e-mail da compra:
        </p>
        <Link
          href="/minha-conta"
          className="mx-auto mt-2 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-ink-muted"
        >
          Ir para Minha conta
        </Link>
      </main>
    </div>
  );
}
