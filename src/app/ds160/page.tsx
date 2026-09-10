import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getOrCreateSolicitacao, tierDs160 } from "@/lib/ds160";
import { DS160_SECTIONS } from "@/lib/ds160Form";
import { salvarCpf } from "./actions";

export default async function Ds160Page({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string; erro?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireUser();
  const tier = await tierDs160(user.id);
  const s = await getOrCreateSolicitacao(user.id);

  if (tier === null) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-lg font-bold text-ink">DS-160</h1>
        <p className="mt-2 text-sm text-slate-600">
          Você ainda não tem acesso a este serviço. Escolha uma das opções abaixo.
        </p>
        <div className="mt-4 flex flex-col items-center gap-2">
          <Link
            href="/checkout?p=ds160-preenchido"
            className="inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-star transition hover:bg-brand-strong"
          >
            Quero que façam por mim — R$97
          </Link>
          <Link
            href="/mapads160"
            className="inline-flex rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-ink transition hover:border-hairline"
          >
            Quero preencher sozinho — R$27,90
          </Link>
        </div>
      </div>
    );
  }

  const completo = tier === "completo";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-ink">
          DS-160 preenchido pra você
        </h1>
        {completo ? (
          <p className="mt-1 text-sm text-slate-500">
            Você preenche o rascunho em português. Um especialista humano com{" "}
            <strong className="text-ink">mais de 15 anos de experiência</strong>{" "}
            em vistos americanos revisa cada resposta com cuidado — só depois
            dessa revisão o DS-160 oficial é preenchido em inglês, diretamente
            no site do Consulado americano, e você recebe o número por e-mail.
          </p>
        ) : (
          <p className="mt-1 text-sm text-slate-500">
            Você preenche o formulário em português, no seu tempo. Ao final,
            você recebe um resumo organizado das suas respostas, pronto pra
            usar no preenchimento oficial no site do Consulado.
          </p>
        )}
      </div>

      {sp.enviado === "1" && completo && (
        <p className="rounded-xl border border-ok/30 bg-ok/5 px-4 py-3 text-sm text-ok">
          Recebemos o seu rascunho. Um especialista humano com mais de 15 anos
          de experiência vai revisar suas respostas e, estando tudo certo,
          preencher o DS-160 oficial no Consulado e te mandar o número por
          e-mail.
        </p>
      )}

      {completo && s.status === "ENTREGUE" && s.numeroDs160 && (
        <div className="rounded-2xl border border-ok/30 bg-ok/5 p-6">
          <p className="text-sm font-semibold text-ink">Seu DS-160 está pronto</p>
          <p className="mt-2 text-2xl font-extrabold text-ok">{s.numeroDs160}</p>
          <p className="mt-2 text-xs text-slate-600">
            Guarde esse número — você vai precisar dele para agendar a entrevista.
          </p>
        </div>
      )}

      {s.status === "ENVIADO" && completo && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          <p className="font-semibold text-ink">Rascunho enviado ✓</p>
          <p className="mt-1">
            Um especialista humano com mais de 15 anos de experiência está
            revisando suas respostas e preenchendo o DS-160 oficial. Você
            recebe o número por e-mail assim que estiver pronto.
          </p>
        </div>
      )}

      {s.status !== "RASCUNHO" && !completo && (
        <div className="rounded-2xl border border-ok/30 bg-ok/5 p-6 text-sm text-slate-600">
          <p className="font-semibold text-ink">Suas respostas estão prontas.</p>
          <Link
            href="/ds160/resumo"
            className="mt-3 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-star transition hover:bg-brand-strong"
          >
            Ver minhas respostas →
          </Link>
        </div>
      )}

      {s.status === "RASCUNHO" && (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-bold text-ink">Como funciona</h2>
            {completo ? (
              <ol className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                <li>1. Você preenche {DS160_SECTIONS.length} seções de perguntas, em português. Pode sair e voltar — salva sozinho.</li>
                <li>2. Ao terminar, você envia. A partir daí não dá mais pra editar.</li>
                <li>
                  3. Um <strong className="text-ink">especialista humano com mais de 15 anos de experiência</strong>{" "}
                  em vistos americanos revisa suas respostas ponto a ponto, em busca de qualquer erro ou inconsistência.
                </li>
                <li>4. Estando tudo certo, a equipe preenche o DS-160 oficial <strong className="text-ink">em inglês</strong>, diretamente no site do Consulado americano.</li>
                <li>5. Você recebe o <strong>número do DS-160</strong> por e-mail (o mesmo que você cadastrou).</li>
              </ol>
            ) : (
              <ol className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                <li>1. Você preenche as seções do formulário, em português. Pode sair e voltar — salva sozinho.</li>
                <li>2. Ao terminar, você envia — a partir daí não dá mais pra editar.</li>
                <li>3. Você recebe um resumo organizado das suas respostas, pronto pra usar no preenchimento oficial no site do Consulado.</li>
              </ol>
            )}
          </div>

          {!s.cpf ? (
            <form
              action={salvarCpf}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6"
            >
              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
                Pra começar, confirme seu CPF
                <input
                  name="cpf"
                  inputMode="numeric"
                  required
                  placeholder="000.000.000-00"
                  className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-hairline focus:ring-2 focus:ring-accent/30"
                />
              </label>
              {sp.erro === "cpf" && (
                <p className="text-xs text-err">CPF inválido — digite os 11 números.</p>
              )}
              <button
                type="submit"
                className="w-fit rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-star transition hover:bg-brand-strong"
              >
                Começar o formulário
              </button>
            </form>
          ) : (
            <Link
              href="/ds160/formulario"
              className="w-fit rounded-full bg-brand px-5 py-3 text-sm font-bold text-star transition hover:bg-brand-strong"
            >
              Continuar o formulário →
            </Link>
          )}
        </>
      )}
    </div>
  );
}
