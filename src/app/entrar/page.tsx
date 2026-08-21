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
        <p className="text-sm font-medium text-blue-700">Rota Consular</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Entrar</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Sem senha — mandamos um link de acesso pro seu e-mail.
        </p>
      </div>

      {enviado ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Enviamos um link de acesso pro seu e-mail. Clique nele pra entrar
          (ele expira em 15 minutos).
        </div>
      ) : (
        <form action={requestMagicLink} className="flex flex-col gap-3">
          {erro && (
            <p className="text-sm text-red-600">
              {ERROR_MESSAGE[erro] ?? "Não foi possível enviar o link."}
            </p>
          )}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">E-mail</span>
            <input
              type="email"
              name="email"
              required
              autoFocus
              placeholder="voce@email.com"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
          >
            Enviar link de acesso
          </button>
        </form>
      )}
    </div>
  );
}
