import type { Metadata } from "next";
import { startFreeApplication } from "@/app/actions";

export const metadata: Metadata = {
  title: "Análise Grátis de Perfil | Rota Consular",
  description:
    "Descubra em minutos o nível de prontidão da sua documentação para o visto americano de turismo (B1/B2), sem custo.",
};

export default function AnaliseDePerfilPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-slate-900">
      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-7 shadow-sm sm:p-9">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700">
              GRÁTIS
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Quais são as suas chances reais de aprovação?
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Nossa Inteligência Artificial avalia o seu perfil em apenas 2
              minutos. Descubra agora se você está no caminho certo ou se
              corre o risco de perder a taxa do visto por erros simples.
            </p>

            <form
              action={startFreeApplication}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <label className="flex flex-1 flex-col gap-1.5 text-left">
                <span className="text-sm font-medium text-slate-700">Seu melhor e-mail</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                />
              </label>
              <label className="flex flex-1 flex-col gap-1.5 text-left">
                <span className="text-sm font-medium text-slate-700">Seu WhatsApp</span>
                <input
                  name="whatsapp"
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                />
              </label>
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
              >
                ➔ Iniciar Minha Análise Gratuita
              </button>
            </form>
            <p className="mt-3 text-xs text-slate-500">
              🔒 100% seguro e sigiloso. Sem necessidade de cartão de crédito.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-10 text-center text-xs text-slate-400">
          O Rota Consular é uma ferramenta de tecnologia e inteligência
          estratégica. Não somos afiliados ao governo dos Estados Unidos, à
          Embaixada ou ao Consulado americano. Isso não é uma promessa de
          aprovação — a decisão final é sempre do oficial consular
          americano. Nossa missão é te ajudar a chegar na entrevista com a
          melhor estratégia e documentação possível.
        </div>
      </footer>
    </div>
  );
}
