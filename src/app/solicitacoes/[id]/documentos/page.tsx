import { prisma } from "@/lib/prisma";
import { addDocument, removeDocument } from "@/app/actions";
import { StepFooter } from "@/components/StepFooter";
import Link from "next/link";
import { getNextStep, getPrevStep } from "@/lib/wizard";

const DOCUMENT_TYPE_LABEL: Record<string, string> = {
  IDENTIDADE: "RG / CPF / Passaporte",
  COMPROVANTE_RENDA: "Comprovante de renda",
  EXTRATO_BANCARIO: "Extrato bancário",
  VINCULO_EMPREGATICIO: "Comprovante de vínculo empregatício",
  ITINERARIO: "Itinerário (se já tiver)",
  OUTRO: "Outro",
};

export default async function DocumentosPage(
  props: PageProps<"/solicitacoes/[id]/documentos">,
) {
  const { id } = await props.params;

  const documents = await prisma.document.findMany({
    where: { applicationId: id },
    orderBy: { uploadedAt: "asc" },
  });

  const addAction = addDocument.bind(null, id);
  const next = getNextStep("documentos");
  const prev = getPrevStep("documentos");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Documentos</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Liste o que você já tem em mãos. O upload real de arquivos ainda
          não está conectado — por enquanto só registramos o nome do
          documento, pra montar o checklist.
        </p>
      </div>

      {documents.length > 0 && (
        <ul className="flex flex-col gap-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between rounded-md border border-zinc-200 px-4 py-2.5 text-sm"
            >
              <div>
                <p className="font-medium">
                  {DOCUMENT_TYPE_LABEL[doc.type] ?? doc.type}
                </p>
                <p className="text-zinc-500">{doc.fileName}</p>
              </div>
              <form action={removeDocument.bind(null, doc.id, id)}>
                <button
                  type="submit"
                  className="text-xs text-red-600 hover:underline"
                >
                  Remover
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form
        action={addAction}
        className="flex flex-col gap-3 rounded-md border border-dashed border-zinc-300 p-4 sm:flex-row sm:items-end"
      >
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm font-medium">Tipo de documento</span>
          <select
            name="type"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            {Object.entries(DOCUMENT_TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm font-medium">Nome do arquivo</span>
          <input
            name="fileName"
            placeholder="ex: extrato-nubank-julho.pdf"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <button
          type="submit"
          className="rounded-lg border border-blue-700 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
        >
          Adicionar
        </button>
      </form>

      <div className="flex items-center justify-between border-t border-zinc-100 pt-5">
        {prev ? (
          <Link
            href={`/solicitacoes/${id}/${prev.slug}`}
            className="text-sm text-zinc-600 hover:underline"
          >
            ← Voltar
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={`/solicitacoes/${id}/${next ? next.slug : "revisao"}`}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
        >
          Continuar
        </Link>
      </div>
    </div>
  );
}
