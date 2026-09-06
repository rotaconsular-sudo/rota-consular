"use client";

import { CONSENT_ACTIVE, openCookiePrefs } from "@/lib/consent";

// Link "Cookies" nos rodapés — reabre o banner pra pessoa mudar a escolha.
// Some quando o consentimento ainda não está ativo (nenhum tracker).
export default function CookiePrefsButton({
  className,
}: {
  className?: string;
}) {
  if (!CONSENT_ACTIVE) return null;
  return (
    <button type="button" onClick={openCookiePrefs} className={className}>
      Cookies
    </button>
  );
}
