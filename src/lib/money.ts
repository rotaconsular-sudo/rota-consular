export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Aceita "27,90", "27.90", "R$ 27,90", "1.234,56" -> centavos (Int).
// Retorna null se não der pra ler como número >= 0.
export function parseReaisToCents(input: string): number | null {
  let s = input.replace(/R\$/gi, "").replace(/\s/g, "").trim();
  if (!s) return null;

  if (s.includes(",")) {
    // Formato BR: vírgula é decimal, ponto é separador de milhar.
    s = s.replace(/\./g, "").replace(",", ".");
  }
  // Sem vírgula: ponto (se houver) é o decimal — deixa como está.

  const value = Number(s);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}
