"use client";

import { useEffect, useMemo, useState } from "react";
import {
  QUIZ_QUESTIONS,
  type QuizAnswers,
  type QuizQuestion,
} from "@/lib/quizQuestions";

// Não usamos o índice do array cheio direto: perguntas condicionais (showIf)
// entram/saem da lista visível conforme as respostas, então mantemos só um
// ponteiro na lista de IDs já visitados (histórico), que sempre reflete o
// caminho realmente percorrido pelo usuário.
export function Quiz({
  initialAnswers,
  onComplete,
}: {
  initialAnswers?: QuizAnswers;
  onComplete: (answers: QuizAnswers) => void | Promise<void>;
}) {
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers ?? {});
  const [history, setHistory] = useState<string[]>(() =>
    QUIZ_QUESTIONS.filter(
      (q) => initialAnswers?.[q.id] !== undefined && (!q.showIf || q.showIf(initialAnswers)),
    ).map((q) => q.id),
  );

  const current = useMemo(() => {
    const visible = QUIZ_QUESTIONS.filter(
      (q) => !q.showIf || q.showIf(answers),
    );
    return visible.find((q) => !history.includes(q.id)) ?? null;
  }, [answers, history]);

  const progressTotal = useMemo(
    () => QUIZ_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers)).length,
    [answers],
  );
  const progressIndex = history.length;

  function answer(id: string, value: string) {
    const nextAnswers = { ...answers, [id]: value };
    setAnswers(nextAnswers);
    setHistory((h) => [...h, id]);
  }

  function goBack() {
    setHistory((h) => h.slice(0, -1));
  }

  useEffect(() => {
    if (!current) onComplete(answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  if (!current) return null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0b3d91] to-[#0a2f6e] text-white">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10">
        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white transition-all duration-300"
            style={{
              width: `${((progressIndex + 1) / Math.max(progressTotal, 1)) * 100}%`,
            }}
          />
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
          Pergunta {progressIndex + 1} de {progressTotal}
        </p>

        <QuestionScreen
          key={current.id}
          question={current}
          value={answers[current.id]}
          onAnswer={(value) => answer(current.id, value)}
          canGoBack={history.length > 0}
          onBack={goBack}
        />
      </div>
    </div>
  );
}

function QuestionScreen({
  question,
  value,
  onAnswer,
  canGoBack,
  onBack,
}: {
  question: QuizQuestion;
  value: string | undefined;
  onAnswer: (value: string) => void;
  canGoBack: boolean;
  onBack: () => void;
}) {
  // QuestionScreen é remontado a cada pergunta (key={current.id} no Quiz),
  // então o estado inicial já reflete a pergunta certa sem precisar de um
  // efeito pra resincronizar.
  const [textValue, setTextValue] = useState(value ?? "");

  useEffect(() => {
    if (question.kind !== "choice") return;
    function onKeyDown(e: KeyboardEvent) {
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1) return;
      const option = (question as Extract<QuizQuestion, { kind: "choice" }>)
        .options[n - 1];
      if (option) onAnswer(option.key);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [question, onAnswer]);

  return (
    <div className="flex flex-1 flex-col justify-center gap-8">
      <h2 className="font-serif text-2xl leading-snug sm:text-3xl">
        {question.question}
      </h2>

      {question.kind === "choice" ? (
        <div className="flex flex-col gap-3">
          {question.options.map((option, i) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onAnswer(option.key)}
              className="flex items-center gap-3 rounded-xl border border-white/25 bg-white/5 px-4 py-3.5 text-left text-sm font-medium transition hover:border-white/50 hover:bg-white/10 sm:text-base"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/15 text-xs font-semibold">
                {String.fromCharCode(65 + i)}
              </span>
              {option.label}
            </button>
          ))}
          <p className="mt-1 text-xs text-white/50">
            Use as teclas 1-{question.options.length} ou clique para
            selecionar
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!question.optional && !textValue.trim()) return;
            onAnswer(textValue.trim());
          }}
          className="flex flex-col gap-4"
        >
          <input
            autoFocus
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder={question.placeholder}
            required={!question.optional}
            className="border-b border-white/30 bg-transparent pb-2 text-lg outline-none placeholder:text-white/40 focus:border-white"
          />
          <button
            type="submit"
            className="w-fit rounded-lg bg-white px-5 py-2 text-sm font-semibold text-[#0b3d91] transition hover:bg-white/90"
          >
            OK · pressione Enter
          </button>
        </form>
      )}

      {canGoBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-fit text-sm text-white/60 hover:text-white hover:underline"
        >
          ← Voltar
        </button>
      )}
    </div>
  );
}
