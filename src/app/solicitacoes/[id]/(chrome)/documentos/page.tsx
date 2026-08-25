import { prisma } from "@/lib/prisma";
import { addDocument, removeDocument } from "@/app/actions";
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
        <h2 className="text-lg font-bold text-slate-900">Documentos</h2>
        <p className="mt-1 text-sm text-slate-500">
          Envie o que você já tem em mãos. Arquivos até 8MB, armazenados de
          forma privada — só você tem acesso.
        </p>
      </div>

      {documents.length > 0 && (
        <ul className="flex flex-col gap-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {DOCUMENT_TYPE_LABEL[doc.type] ?? doc.type}
                </p>
                <a
                  href={`/solicitacoes/${id}/documentos/${doc.id}`}
                  className="text-slate-500 hover:underline"
                >
                  {doc.fileName}
                </a>
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
        encType="multipart/form-data"
        className="flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 p-4 sm:flex-row sm:items-end"
      >
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">Tipo de documento</span>
          <select
            name="type"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          >
            {Object.entries(DOCUMENT_TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">Arquivo</span>
          <input
            name="file"
            type="file"
            required
            accept="application/pdf,image/*"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
        </label>

        <button
          type="submit"
          className="rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          Adicionar
        </button>
      </form>

      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        {prev ? (
          <Link
            href={`/solicitacoes/${id}/${prev.slug}`}
            className="text-sm text-slate-600 hover:underline"
          >
            ← Voltar
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={`/solicitacoes/${id}/${next ? next.slug : "revisao"}`}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
        >
          Continuar
        </Link>
      </div>
    </div>
  );
}
