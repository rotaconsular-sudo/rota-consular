/**
 * Contato único da Rota Consular.
 *
 * TODO (operador): trocar WHATSAPP_NUMERO pelo número real da consultora,
 * no formato internacional só com dígitos (ex.: 5511999998888).
 * É o único ponto do site que aponta para o WhatsApp da assessoria.
 */
export const WHATSAPP_NUMERO = "5500000000000";

export const EMAIL_CONTATO = "contato@rotaconsular.com.br";

/** Monta o link wa.me com uma mensagem pré-preenchida. */
export function whatsappLink(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}
