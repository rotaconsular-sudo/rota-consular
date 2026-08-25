import { requestMagicLink } from "./actions";

const ERROR_MESSAGE: Record<string, string> = {
  email_invalido: "Digite um e-mail válido.",
  link_invalido: "Esse link expirou ou já foi usado. Peça um novo.",
};

export default async function EntrarPage(props: PageProps<"/entrar">) {
  const params = await props.searchParams;
  const enviado = params.enviado === "1";
  const erro = typeof params.erro === "string" ? params.erro : null;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-16">
      <div>
        <p className="text-sm font-semibold text-blue-600">Rota Consular</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Entrar
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Sem senha — mandamos um link de acesso pro seu e-mail.
        </p>
      </div>

      {enviado ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Enviamos um link de acesso pro seu e-mail. Clique nele pra entrar
          (ele expira em 15 minutos).
        </div>
      ) : (
        <form
          action={requestMagicLink}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {erro && (
            <p className="text-sm text-red-600">
              {ERROR_MESSAGE[erro] ?? "Não foi possível enviar o link."}
            </p>
          )}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">E-mail</span>
            <input
              type="email"
              name="email"
              required
              autoFocus
              placeholder="voce@email.com"
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
          >
            Enviar link de acesso
          </button>
        </form>
      )}
    </div>
  );
}
