"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  needsConsent,
  saveConsent,
  type ConsentChoices,
} from "@/lib/consent";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [detalhado, setDetalhado] = useState(false);
  const [estatistica, setEstatistica] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setOpen(needsConsent());
    function reabrir() {
      setDetalhado(true);
      setOpen(true);
    }
    window.addEventListener("rc-open-cookie-prefs", reabrir);
    return () => window.removeEventListener("rc-open-cookie-prefs", reabrir);
  }, []);

  if (!open) return null;

  async function decidir(choices: ConsentChoices) {
    setSalvando(true);
    await saveConsent(choices);
    setOpen(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-6 py-4 text-sm text-slate-600">
        <p>
          Usamos cookies necessários para o site funcionar. Com sua permissão,
          usamos também cookies de estatística e de marketing.{" "}
          <Link
            href="/politica-de-privacidade"
            className="font-medium text-accent hover:underline"
          >
            Saiba mais
          </Link>
          .
        </p>

        {detalhado && (
          <div className="flex flex-col gap-2 border-y border-slate-100 py-3">
            <label className="flex items-start gap-2">
              <input type="checkbox" checked disabled className="mt-0.5 h-4 w-4" />
              <span>
                <strong className="text-ink">Necessários</strong>{" "}
                <span className="text-slate-400">— sempre ativos</span>. Login,
                sessão e retomada da análise.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={estatistica}
                onChange={(e) => setEstatistica(e.target.checked)}
                className="mt-0.5 h-4 w-4"
              />
              <span>
                <strong className="text-ink">Estatística</strong> — nos ajuda a
                entender como o site é usado.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-0.5 h-4 w-4"
              />
              <span>
                <strong className="text-ink">Marketing</strong> — mede o
                resultado de anúncios (ex.: redes sociais).
              </span>
            </label>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={salvando}
            onClick={() => decidir({ estatistica: true, marketing: true })}
            className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-white transition hover:bg-ink-muted disabled:opacity-60"
          >
            Aceitar tudo
          </button>
          <button
            type="button"
            disabled={salvando}
            onClick={() => decidir({ estatistica: false, marketing: false })}
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-ink transition hover:border-ink disabled:opacity-60"
          >
            Rejeitar
          </button>
          {detalhado ? (
            <button
              type="button"
              disabled={salvando}
              onClick={() => decidir({ estatistica, marketing })}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-ink transition hover:border-ink disabled:opacity-60"
            >
              Salvar escolha
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setDetalhado(true)}
              className="rounded-full px-4 py-2 text-xs font-semibold text-slate-500 transition hover:text-ink"
            >
              Personalizar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
