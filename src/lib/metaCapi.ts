import { createHash } from "crypto";

/**
 * Meta Conversions API (server-side).
 *
 * Envia eventos direto pro Graph API, em paralelo ao Pixel do navegador,
 * deduplicados por `eventId` (o mesmo id é usado no `fbq('track', ..., { eventID })`).
 * Resiliente a adblock/iOS. No-op sem `META_CAPI_ACCESS_TOKEN`.
 *
 * Gere o token em Events Manager → Configurações → Conversions API → gerar
 * token de acesso. Coloque em `META_CAPI_ACCESS_TOKEN` (Vercel + .env.local).
 * Opcional: `META_CAPI_TEST_CODE` p/ ver os eventos na aba "Testar eventos".
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_CODE = process.env.META_CAPI_TEST_CODE;
const GRAPH_VERSION = "v21.0";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Normaliza e faz hash de e-mail (minúsculo, sem espaços). */
function hashEmail(email: string): string | undefined {
  const v = email.trim().toLowerCase();
  return v ? sha256(v) : undefined;
}

/** Normaliza e faz hash de telefone: só dígitos, com DDI. */
function hashPhone(phone: string): string | undefined {
  let d = phone.replace(/\D/g, "");
  if (!d) return undefined;
  // BR sem DDI: 10 ou 11 dígitos (com DDD) -> prefixa 55
  if (d.length <= 11) d = "55" + d;
  return sha256(d);
}

export type CapiEvent = {
  eventName:
    | "Lead"
    | "Purchase"
    | "InitiateCheckout"
    | "ViewContent"
    | "CompleteRegistration";
  /** Mesmo id do evento do navegador (dedupe). */
  eventId: string;
  eventSourceUrl?: string;
  email?: string | null;
  phone?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  /** Cookies _fbp / _fbc, quando disponíveis. */
  fbp?: string | null;
  fbc?: string | null;
  customData?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_ids?: string[];
  };
};

export async function sendCapiEvent(ev: CapiEvent): Promise<void> {
  if (!PIXEL_ID || !ACCESS_TOKEN) return;

  const userData: Record<string, unknown> = {};
  const em = ev.email ? hashEmail(ev.email) : undefined;
  const ph = ev.phone ? hashPhone(ev.phone) : undefined;
  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  if (ev.clientIp) userData.client_ip_address = ev.clientIp;
  if (ev.userAgent) userData.client_user_agent = ev.userAgent;
  if (ev.fbp) userData.fbp = ev.fbp;
  if (ev.fbc) userData.fbc = ev.fbc;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: ev.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: ev.eventId,
        action_source: "website",
        ...(ev.eventSourceUrl ? { event_source_url: ev.eventSourceUrl } : {}),
        user_data: userData,
        ...(ev.customData ? { custom_data: ev.customData } : {}),
      },
    ],
  };
  if (TEST_CODE) payload.test_event_code = TEST_CODE;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // não deixa o request pendurar o webhook/action
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error("[metaCapi] falhou:", res.status, txt.slice(0, 300));
    }
  } catch (err) {
    console.error("[metaCapi] erro:", err);
  }
}
