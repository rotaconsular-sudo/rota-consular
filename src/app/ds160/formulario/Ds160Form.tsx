"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  secoesVisiveis,
  type Ds160Dados,
  type Ds160Field,
} from "@/lib/ds160Form";
import { salvarRascunho, enviarDs160 } from "../actions";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/30";

// Um campo conta como "preenchido" se tem valor de verdade em dados[key].
// Listas contam pela presença de pelo menos 1 item; bool conta como
// respondido em true OU false (undefined = ainda não respondido).
function campoPreenchido(campo: Ds160Field, valor: unknown): boolean {
  if (campo.kind === "list") {
    return Array.isArray(valor) && valor.length > 0;
  }
  if (campo.kind === "bool") {
    return valor === true || valor === false;
  }
  return valor !== undefined && valor !== null && String(valor).trim() !== "";
}

export default function Ds160Form({ initial }: { initial: Ds160Dados }) {
  const [dados, setDados] = useState<Ds160Dados>(initial ?? {});
  const [estado, setEstado] = useState<"idle" | "salvando" | "salvo">("idle");
  const [confirmar, setConfirmar] = useState(false);
  const [, startSave] = useTransition();
  const primeiroRender = useRef(true);

  useEffect(() => {
    if (primeiroRender.current) {
      primeiroRender.current = false;
      return;
    }
    setEstado("salvando");
    const t = setTimeout(() => {
      startSave(async () => {
        await salvarRascunho(dados);
        setEstado("salvo");
      });
    }, 800);
    return () => clearTimeout(t);
  }, [dados]);

  const secoes = secoesVisiveis(dados);

  // Progresso: só conta campos visíveis, com input real (sem "note"). Lista
  // opcional some do total quando vazia — não penaliza quem não tem o que
  // declarar num campo que nem é obrigatório.
  let totalCampos = 0;
  let camposPreenchidos = 0;
  for (const sec of secoes) {
    for (const campo of sec.campos) {
      if (campo.kind === "note") continue;
      const valor = dados[campo.key];
      if (campo.kind === "list" && campo.optional && !campoPreenchido(campo, valor)) continue;
      totalCampos++;
      if (campoPreenchido(campo, valor)) camposPreenchidos++;
    }
  }
  const percentual = totalCampos > 0 ? Math.round((camposPreenchidos / totalCampos) * 100) : 0;

  // Seção ativa (pra destacar a pill correspondente) via scroll listener —
  // mais simples que IntersectionObserver aqui e sem gambiarra visível.
  // secoesRef guarda a lista mais atual sem forçar o efeito a religar o
  // listener a cada render (secoesVisiveis recalcula a cada mudança em dados).
  const [secaoAtivaId, setSecaoAtivaId] = useState<string | undefined>(secoes[0]?.id);
  const secoesRef = useRef(secoes);

  useEffect(() => {
    secoesRef.current = secoes;
  }, [secoes]);

  useEffect(() => {
    function atualizarSecaoAtiva() {
      const atuais = secoesRef.current;
      let ativa: string | undefined = atuais[0]?.id;
      for (const sec of atuais) {
        const el = document.getElementById(`sec-${sec.id}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 140) ativa = sec.id;
      }
      setSecaoAtivaId(ativa);
    }
    atualizarSecaoAtiva();
    window.addEventListener("scroll", atualizarSecaoAtiva, { passive: true });
    return () => window.removeEventListener("scroll", atualizarSecaoAtiva);
  }, []);

  function irParaSecao(id: string) {
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setCampo(key: string, value: unknown) {
    setDados((d) => ({ ...d, [key]: value }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-ink">
          Rascunho do DS-160
        </h1>
        <span className="text-xs text-slate-400">
          {estado === "salvando" ? "salvando…" : estado === "salvo" ? "salvo ✓" : "salva sozinho"}
        </span>
      </div>

      <div className="sticky top-[72px] z-30 -mx-6 flex flex-col gap-2 border-b border-slate-200 bg-slate-50/95 px-6 py-3 backdrop-blur">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Progresso do formulário</span>
          <span className="text-ink">{percentual}% preenchido</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-ink transition-[width] duration-300"
            style={{ width: `${percentual}%` }}
          />
        </div>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
          {secoes.map((sec, i) => {
            const ativa = sec.id === secaoAtivaId;
            return (
              <button
                key={sec.id}
                type="button"
                title={sec.titulo}
                aria-label={sec.titulo}
                aria-current={ativa ? "step" : undefined}
                onClick={() => irParaSecao(sec.id)}
                className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-semibold transition ${
                  ativa
                    ? "bg-ink text-white"
                    : "border border-slate-300 text-slate-500 hover:border-ink hover:text-ink"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {secoes.map((sec) => (
        <section
          key={sec.id}
          id={`sec-${sec.id}`}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 scroll-mt-36"
        >
          <h2 className="text-sm font-bold text-ink">{sec.titulo}</h2>
          {sec.campos.map((campo) => (
            <Campo
              key={campo.key}
              campo={campo}
              valor={dados[campo.key]}
              onChange={(v) => setCampo(campo.key, v)}
            />
          ))}
        </section>
      ))}

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        {!confirmar ? (
          <button
            type="button"
            onClick={() => setConfirmar(true)}
            className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-ink-muted"
          >
            Revisar e enviar para a equipe
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-600">
              Depois de enviar, <strong>não dá mais pra editar</strong>. Confere se
              está tudo certo?
            </p>
            <div className="flex gap-2">
              <form action={enviarDs160}>
                <button
                  type="submit"
                  className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink-muted"
                >
                  Enviar
                </button>
              </form>
              <button
                type="button"
                onClick={() => setConfirmar(false)}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-ink"
              >
                Voltar e revisar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Campo({
  campo,
  valor,
  onChange,
}: {
  campo: Ds160Field;
  valor: unknown;
  onChange: (v: unknown) => void;
}) {
  const label = (
    <span className="text-sm font-medium text-slate-700">
      {campo.label}
      {"optional" in campo && campo.optional && (
        <span className="ml-1 text-xs font-normal text-slate-400">(opcional)</span>
      )}
    </span>
  );

  if (campo.kind === "note") {
    return (
      <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-500">
        {campo.help}
      </p>
    );
  }

  if (campo.kind === "bool") {
    const v = valor === true;
    return (
      <div className="flex flex-col gap-1.5">
        {label}
        <div className="flex gap-2">
          {[
            { l: "Sim", b: true },
            { l: "Não", b: false },
          ].map((o) => (
            <button
              key={o.l}
              type="button"
              onClick={() => onChange(o.b)}
              className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition ${
                (valor === true) === o.b && valor !== undefined
                  ? "border-ink bg-slate-100 text-ink"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
        {campo.help && <span className="text-xs text-slate-400">{campo.help}</span>}
        {/* usa v pra evitar warning de var não usada em alguns lints */}
        <input type="hidden" value={String(v)} readOnly />
      </div>
    );
  }

  if (campo.kind === "select") {
    return (
      <label className="flex flex-col gap-1.5">
        {label}
        <select
          value={String(valor ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        >
          <option value="">Selecione…</option>
          {campo.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {campo.help && <span className="text-xs text-slate-400">{campo.help}</span>}
      </label>
    );
  }

  if (campo.kind === "textarea") {
    return (
      <label className="flex flex-col gap-1.5">
        {label}
        <textarea
          value={String(valor ?? "")}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={inputCls}
        />
        {campo.help && <span className="text-xs text-slate-400">{campo.help}</span>}
      </label>
    );
  }

  if (campo.kind === "list") {
    const linhas: Record<string, unknown>[] = Array.isArray(valor)
      ? (valor as Record<string, unknown>[])
      : [];
    return (
      <div className="flex flex-col gap-2">
        {label}
        {campo.help && <span className="text-xs text-slate-400">{campo.help}</span>}
        {linhas.map((linha, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3"
          >
            {campo.itemFields.map((f) => (
              <label key={f.key} className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                {f.label}
                {f.kind === "select" ? (
                  <select
                    value={String(linha[f.key] ?? "")}
                    onChange={(e) => {
                      const novas = [...linhas];
                      novas[i] = { ...novas[i], [f.key]: e.target.value };
                      onChange(novas);
                    }}
                    className={inputCls}
                  >
                    <option value="">Selecione…</option>
                    {(f.options ?? []).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : f.kind === "textarea" ? (
                  <textarea
                    value={String(linha[f.key] ?? "")}
                    onChange={(e) => {
                      const novas = [...linhas];
                      novas[i] = { ...novas[i], [f.key]: e.target.value };
                      onChange(novas);
                    }}
                    rows={3}
                    className={inputCls}
                  />
                ) : (
                  <input
                    value={String(linha[f.key] ?? "")}
                    onChange={(e) => {
                      const novas = [...linhas];
                      novas[i] = { ...novas[i], [f.key]: e.target.value };
                      onChange(novas);
                    }}
                    className={inputCls}
                  />
                )}
              </label>
            ))}
            <button
              type="button"
              onClick={() => onChange(linhas.filter((_, j) => j !== i))}
              className="w-fit text-xs font-medium text-err hover:underline"
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...linhas, {}])}
          className="w-fit rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-ink transition hover:border-ink"
        >
          + Adicionar
        </button>
      </div>
    );
  }

  // text | date
  return (
    <label className="flex flex-col gap-1.5">
      {label}
      <input
        value={String(valor ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          campo.kind === "date"
            ? "DD/MM/AAAA"
            : "placeholder" in campo
              ? campo.placeholder
              : undefined
        }
        className={inputCls}
      />
      {campo.help && <span className="text-xs text-slate-400">{campo.help}</span>}
    </label>
  );
}
