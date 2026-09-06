import Link from "next/link";
import CookiePrefsButton from "@/components/CookiePrefsButton";

// Rodapé enxuto pras telas que não usam o SiteFooter público (checkout,
// login, área logada). Sem distração, mas com o disclaimer institucional —
// justamente nas telas de pagamento/documento oficial que mais precisam
// deixar claro que a Rota Consular não é o consulado.
export default function MinimalFooter() {
  return (
    <footer className="flex flex-col items-center gap-2 border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-400">
      <p>
        A Rota Consular é uma empresa privada de assessoria e não possui
        qualquer vínculo com consulados ou embaixadas.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/politica-de-privacidade"
          className="transition hover:text-ink"
        >
          Política de Privacidade
        </Link>
        <CookiePrefsButton className="transition hover:text-ink" />
      </div>
    </footer>
  );
}
