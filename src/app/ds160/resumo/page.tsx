import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatarValorDs160 } from "@/lib/ds160";
import { DS160_SECTIONS, secoesVisiveis, type Ds160Dados } from "@/lib/ds160Form";
import ImprimirBotao from "./ImprimirBotao";

export default async function Ds160ResumoPage() {
  const user = await requireUser();

  const solicitacao = await prisma.solicitacaoDs160.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!solicitacao || solicitacao.status === "RASCUNHO") {
    redirect("/ds160");
  }

  const dados = (solicitacao.dados as Ds160Dados) ?? {};
  const secoes = secoesVisiveis(dados);

  return (
    <div className="flex flex-col gap-6">
      <style>{`
        @media print {
          header, footer { display: none !important; }
        }
      `}</style>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight text-ink">
          Suas respostas, prontas pra usar
        </h1>
        <ImprimirBotao />
      </div>

      <div className="rounded-2xl border border-warn/30 bg-warn/5 p-4 text-sm text-slate-700">
        Isso NÃO é o envio oficial do seu DS-160 — é só um resumo organizado
        das suas respostas, pra você preencher no site oficial do Consulado
        americano (ceac.state.gov). A Rota Consular não envia nada por você
        neste plano.
      </div>

      {secoes.map((sec) => (
        <section key={sec.id} className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold text-ink">{sec.titulo}</h2>
          <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {sec.campos
              .filter((c) => c.kind !== "note")
              .map((c) => (
                <div key={c.key} className="flex justify-between gap-3 border-b border-slate-50 py-1">
                  <dt className="text-slate-500">{c.label}</dt>
                  <dd className="text-right font-medium text-ink">
                    {formatarValorDs160(dados[c.key])}
                  </dd>
                </div>
              ))}
          </dl>
        </section>
      ))}

      {secoes.length === 0 && (
        <p className="text-sm text-slate-500">
          Nenhuma resposta encontrada em {DS160_SECTIONS.length} seções.
        </p>
      )}
    </div>
  );
}
