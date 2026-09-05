"use client";

import { useMemo, useState } from "react";
import { formatBRL } from "@/lib/money";
import { criarPedido } from "./actions";

type ProdutoLite = {
  slug: string;
  nome: string;
  descricao: string | null;
  precoCents: number;
};

const PIX_DISCOUNT_RATE = 0.03;

export default function CheckoutForm({
  produto,
  bumps,
  mpConfigurado,
  erro,
}: {
  produto: ProdutoLite;
  bumps: ProdutoLite[];
  mpConfigurado: boolean;
  erro?: string;
}) {
  const [selectedBumps, setSelectedBumps] = useState<Set<string>>(new Set());
  const [paymentMethod, setPaymentMethod] = useState<"cartao" | "pix">("pix");
  const [email, setEmail] = useState("");
  const [emailConfirma, setEmailConfirma] = useState("");

  const norm = (s: string) => s.trim().toLowerCase();
  const emailConfere = norm(email) === norm(emailConfirma);
  const mostrarErroEmail = emailConfirma.length > 0 && !emailConfere;

  function toggleBump(slug: string) {
    setSelectedBumps((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  const subtotalCents = useMemo(() => {
    const bumpsTotal = bumps
      .filter((b) => selectedBumps.has(b.slug))
      .reduce((sum, b) => sum + b.precoCents, 0);
    return produto.precoCents + bumpsTotal;
  }, [selectedBumps, bumps, produto.precoCents]);

  const pixDiscountCents =
    paymentMethod === "pix" ? Math.round(subtotalCents * PIX_DISCOUNT_RATE) : 0;
  const totalCents = subtotalCents - pixDiscountCents;

  const ERRO_MSG: Record<string, string> = {
    email: "Digite um e-mail válido.",
    email_confere: "Os dois e-mails não batem. Confira e tente de novo.",
    indisponivel: "Nenhum produto disponível para compra no momento.",
    config: "Pedido registrado, mas o pagamento ainda não está ligado. Já já habilitamos.",
  };

  return (
    <form
      action={criarPedido}
      onSubmit={(e) => {
        if (!emailConfere) e.preventDefault();
      }}
      className="mx-auto grid max-w-5xl gap-6 px-6 py-10 lg:grid-cols-[1fr_360px]"
    >
      <input type="hidden" name="principalSlug" value={produto.slug} />
      {bumps
        .filter((b) => selectedBumps.has(b.slug))
        .map((b) => (
          <input key={b.slug} type="hidden" name="bump" value={b.slug} />
        ))}

      <div className="flex flex-col gap-6">
        {erro && ERRO_MSG[erro] && (
          <p className="rounded-lg border border-warn/30 bg-warn/5 px-4 py-3 text-sm text-warn">
            {ERRO_MSG[erro]}
          </p>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="text-base font-bold text-ink">Identificação</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">E-mail</span>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@email.com"
                className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">Confirme o e-mail</span>
              <input
                name="emailConfirmacao"
                type="email"
                required
                value={emailConfirma}
                onChange={(e) => setEmailConfirma(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                placeholder="repita o e-mail"
                aria-invalid={mostrarErroEmail}
                className={`rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 ${
                  mostrarErroEmail
                    ? "border-err focus:border-err focus:ring-err/30"
                    : "border-slate-300 focus:border-ink focus:ring-ink/40"
                }`}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">WhatsApp</span>
              <input
                name="whatsapp"
                type="tel"
                placeholder="DDD + número"
                className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">Nome completo</span>
              <input
                name="nome"
                type="text"
                placeholder="Nome e sobrenome"
                className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
              />
            </label>
          </div>
          {mostrarErroEmail ? (
            <p className="mt-3 text-xs text-err">Os dois e-mails não são iguais.</p>
          ) : (
            <p className="mt-3 text-xs text-slate-400">
              O acesso aos materiais fica vinculado a esse e-mail — confira com atenção.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="text-base font-bold text-ink">Pagamento</h2>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("cartao")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition sm:flex-none sm:px-6 ${
                paymentMethod === "cartao"
                  ? "border-ink bg-slate-100 text-ink"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              Cartão
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("pix")}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition sm:flex-none sm:px-6 ${
                paymentMethod === "pix"
                  ? "border-ink bg-slate-100 text-ink"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              Pix
              <span className="absolute -top-2 -right-2 rounded-full bg-ok px-1.5 py-0.5 text-[10px] font-bold text-white">
                3% OFF
              </span>
            </button>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            A escolha e os dados do pagamento são feitos na tela segura do Mercado Pago.
          </p>
        </div>

        {bumps.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
            <p className="text-sm text-slate-600">
              Temos{" "}
              <span className="font-semibold text-ink">
                {bumps.length} ofertas disponíveis
              </span>{" "}
              para você:
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {bumps.map((bump) => {
                const checked = selectedBumps.has(bump.slug);
                return (
                  <div
                    key={bump.slug}
                    className="rounded-xl border border-dashed border-slate-300 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          OFERTA! Leve junto o {bump.nome}
                        </p>
                        <p className="text-sm font-bold text-ink">
                          {formatBRL(bump.precoCents)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBump(bump.slug)}
                        className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                          checked
                            ? "bg-ok text-white"
                            : "bg-ink text-white hover:bg-ink-muted"
                        }`}
                      >
                        {checked ? "OFERTA ADICIONADA" : "PEGAR OFERTA"}
                      </button>
                    </div>
                    {bump.descricao && (
                      <p className="mt-2 text-xs text-slate-600">{bump.descricao}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">Seu carrinho</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
              {1 + selectedBumps.size}
            </span>
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            <li className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-ink">{produto.nome}</p>
                <p className="text-xs text-slate-400">1 un.</p>
              </div>
              <span className="font-semibold text-slate-700">
                {formatBRL(produto.precoCents)}
              </span>
            </li>
            {bumps
              .filter((b) => selectedBumps.has(b.slug))
              .map((bump) => (
                <li key={bump.slug} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-ink">{bump.nome}</p>
                    <p className="text-xs text-slate-400">1 un.</p>
                  </div>
                  <span className="font-semibold text-slate-700">
                    {formatBRL(bump.precoCents)}
                  </span>
                </li>
              ))}
          </ul>

          <div className="mt-4 flex flex-col gap-1.5 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatBRL(subtotalCents)}</span>
            </div>
            {paymentMethod === "pix" && (
              <div className="flex justify-between text-ok">
                <span>Desconto automático (Pix)</span>
                <span>- {formatBRL(pixDiscountCents)}</span>
              </div>
            )}
            <div className="mt-1 flex justify-between text-base font-bold text-ink">
              <span>Total</span>
              <span>{formatBRL(totalCents)}</span>
            </div>
          </div>
        </div>

        {(() => {
          const podeEnviar = mpConfigurado && emailConfere;
          return (
            <button
              type="submit"
              disabled={!podeEnviar}
              className={`w-full rounded-full px-5 py-3.5 text-sm font-bold transition ${
                podeEnviar
                  ? "bg-ink text-white hover:bg-ink-muted"
                  : "cursor-not-allowed bg-slate-300 text-slate-500"
              }`}
            >
              {mpConfigurado ? "IR PARA O PAGAMENTO" : "COMPRAR"}
            </button>
          );
        })()}
        {!mpConfigurado && (
          <p className="text-center text-xs text-slate-400">
            Checkout em configuração — pagamento será habilitado em breve.
          </p>
        )}
      </div>
    </form>
  );
}
