"use client";

import { useState } from "react";
import { Quiz } from "@/components/Quiz";
import type { QuizAnswers } from "@/lib/quizQuestions";

// Demo do passo 1: só a experiência do quiz, sem persistir nada ainda.
// Quando o formato estiver aprovado, o onComplete passa a chamar uma
// server action que salva as respostas (próximo passo).
export default function AnalisePerfilPage() {
  const [result, setResult] = useState<QuizAnswers | null>(null);

  if (result) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-4 px-6 py-16">
        <h1 className="text-xl font-semibold text-ink">Respostas coletadas (demo)</h1>
        <pre className="overflow-auto rounded-lg bg-ink p-4 text-xs text-slate-100">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  }

  return <Quiz onComplete={setResult} />;
}
