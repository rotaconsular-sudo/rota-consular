"use client";

import { useMemo, useState } from "react";
import { FLAGSHIP_PRODUCT, ORDER_BUMPS } from "@/lib/products";
import SiteHeader from "@/components/SiteHeader";

// Estrutura estática do checkout, fiel ao layout de referência (identificação
// + pagamento + order bumps + resumo do carrinho). A integração real com
// Mercado Pago (Payment Bricks) ainda não está ligada aqui — só a UI.

const PIX_DISCOUNT_RATE = 0.03;

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function CheckoutPage() {
  const product = FLAGSHIP_PRODUCT;
  const [selectedBumps, setSelectedBumps] = useState<Set<string>>(new Set());
  const [paymentMethod, setPaymentMethod] = useState<"cartao" | "pix">("pix");

  function toggleBump(slug: string) {
    setSelectedBumps((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  const subtotalCents = useMemo(() => {
    const bumpsTotal = ORDER_BUMPS.filter((b) => selectedBumps.has(b.slug)).reduce(
      (sum, b) => sum + b.priceCents,
      0,
    );
    return product.priceCents + bumpsTotal;
  }, [selectedBumps, product.priceCents]);

  const pixDiscountCents =
    paymentMethod === "pix" ? Math.round(subtotalCents * PIX_DISCOUNT_RATE) : 0;
  const totalCents = subtotalCents - pixDiscountCents;

  return (
    <div className="min-h-full bg-slate-50">
      <SiteHeader variant="minimal">
        <span className="inline-flex items-center rounded-full border border-ok/30 bg-ok/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ok">
          Ambiente seguro
        </span>
      </SiteHeader>

      <div className="mx-auto grid max-w-5xl gap-6 px-6 py-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
            <h2 className="text-base font-bold text-ink">Identificação</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">E-mail</span>
                <input
                  type="email"
                  placeholder="seuemail@hotmail.com"
                  className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Telefone</span>
                <input
                  type="tel"
                  placeholder="DDD + número"
                  className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Nome completo</span>
                <input
                  type="text"
                  placeholder="Nome e sobrenome"
                  className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">CPF</span>
                <input
                  type="text"
                  placeholder="123.456.789-12"
                  className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/40"
                />
              </label>
            </div>
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

            <div className="mt-5 rounded-lg border border-slate-200 p-4">
              <span className="inline-flex items-center rounded-full border border-ok/30 bg-ok/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ok">
                APROVAÇÃO IMEDIATA
              </span>
              {paymentMethod === "pix" && (
                <p className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                  <span className="rounded bg-ok/10 px-1.5 py-0.5 font-semibold text-ok">
                    3% OFF
                  </span>
                  Garanta {formatBRL(pixDiscountCents)} de desconto pagando via Pix
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
            <p className="text-sm text-slate-600">
              Temos <span className="font-semibold text-ink">{ORDER_BUMPS.length} ofertas disponíveis</span> para você:
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {ORDER_BUMPS.map((bump) => {
                const checked = selectedBumps.has(bump.slug);
                return (
                  <div
                    key={bump.slug}
                    className="rounded-xl border border-dashed border-slate-300 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          OFERTA! Leve junto o {bump.title}
                        </p>
                        <p className="text-sm font-bold text-ink">
                          {formatBRL(bump.priceCents)}
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
                        <input type="checkbox" readOnly checked={checked} className="pointer-events-none" />
                        {checked ? "OFERTA ADICIONADA" : "PEGAR OFERTA"}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-600">{bump.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
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
                  <p className="font-medium text-ink">{product.title}</p>
                  <p className="text-xs text-slate-400">1 un.</p>
                </div>
                <span className="font-semibold text-slate-700">{formatBRL(product.priceCents)}</span>
              </li>
              {ORDER_BUMPS.filter((b) => selectedBumps.has(b.slug)).map((bump) => (
                <li key={bump.slug} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-ink">{bump.title}</p>
                    <p className="text-xs text-slate-400">1 un.</p>
                  </div>
                  <span className="font-semibold text-slate-700">{formatBRL(bump.priceCents)}</span>
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

          <button
            type="button"
            disabled
            title="Checkout em configuração — pagamento ainda não está ligado ao Mercado Pago"
            className="w-full cursor-not-allowed rounded-full bg-slate-300 px-5 py-3.5 text-sm font-bold text-slate-500"
          >
            COMPRAR
          </button>
          <p className="text-center text-xs text-slate-400">
            Checkout em configuração — pagamento será habilitado em breve.
          </p>
        </div>
      </div>
    </div>
  );
}
