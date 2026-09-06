// Consentimento de cookies (LGPD). Banner próprio + registro no Postgres.
//
// Enquanto não houver nenhuma ferramenta de marketing/estatística, o banner
// fica dormente — ele só aparece quando NEXT_PUBLIC_META_PIXEL_ID estiver
// definido (é o dia em que passa a existir algo pra consentir).

export const POLICY_VERSION = "2026-09-06"; // = updatedAt da política; bump se ela mudar

// Ativa quando existe algum tracker configurado.
export const CONSENT_ACTIVE = Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID);

export type ConsentChoices = { estatistica: boolean; marketing: boolean };
export type StoredConsent = ConsentChoices & { v: string; t: number };

const COOKIE = "rc_consent";
const VID = "rc_vid";
const MAX_AGE_DAYS = 180; // LGPD: consentimento vale ~6 meses

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

function writeCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const exp = new Date(Date.now() + days * 86400_000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax`;
}

export function getStoredConsent(): StoredConsent | null {
  try {
    const raw = readCookie(COOKIE) ?? localStorage.getItem(COOKIE);
    if (!raw) return null;
    const p = JSON.parse(raw) as StoredConsent;
    if (typeof p?.v !== "string" || typeof p?.t !== "number") return null;
    return p;
  } catch {
    return null;
  }
}

// true = precisa mostrar o banner (sem registro, política mudou ou venceu).
export function needsConsent(): boolean {
  if (!CONSENT_ACTIVE) return false;
  const c = getStoredConsent();
  if (!c) return true;
  if (c.v !== POLICY_VERSION) return true;
  if (Date.now() - c.t > MAX_AGE_DAYS * 86400_000) return true;
  return false;
}

// Consentimento efetivo por categoria — usado pra liberar scripts.
export function hasConsent(cat: keyof ConsentChoices): boolean {
  if (!CONSENT_ACTIVE) return false;
  const c = getStoredConsent();
  return Boolean(c && c.v === POLICY_VERSION && c[cat]);
}

function getVisitorId(): string {
  let id = readCookie(VID);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
    writeCookie(VID, id, MAX_AGE_DAYS);
  }
  return id;
}

export async function saveConsent(choices: ConsentChoices) {
  const stored: StoredConsent = { ...choices, v: POLICY_VERSION, t: Date.now() };
  const json = JSON.stringify(stored);
  writeCookie(COOKIE, json, MAX_AGE_DAYS);
  try {
    localStorage.setItem(COOKIE, json);
  } catch {}

  const visitorId = getVisitorId();
  try {
    await fetch("/api/consent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...choices, visitorId, policyVersion: POLICY_VERSION }),
      keepalive: true,
    });
  } catch {}

  window.dispatchEvent(new CustomEvent("rc-consent-changed", { detail: stored }));
}

// Reabrir o banner (link "Cookies" no rodapé).
export function openCookiePrefs() {
  window.dispatchEvent(new CustomEvent("rc-open-cookie-prefs"));
}
