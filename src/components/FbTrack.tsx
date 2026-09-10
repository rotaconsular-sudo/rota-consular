"use client";

import { useEffect } from "react";
import { hasConsent } from "@/lib/consent";

/**
 * Dispara UM evento padrão do Meta Pixel quando a página monta.
 * Respeita o consentimento de marketing (o `fbq` só existe depois dele) e
 * tenta de novo se a pessoa aceitar o banner depois de a página já ter
 * carregado. Some no server (retorna null).
 *
 * Uso: <FbTrack event="Lead" /> numa page/client component.
 */
export function FbTrack({
  event,
  params,
  eventId,
}: {
  event: string;
  params?: Record<string, unknown>;
  /** Mesmo id usado no CAPI server-side, pra dedupe. */
  eventId?: string;
}) {
  const key = event + "|" + (eventId ?? "") + "|" + JSON.stringify(params ?? {});

  useEffect(() => {
    let fired = false;

    function fire() {
      if (fired) return;
      if (!hasConsent("marketing") || typeof window.fbq !== "function") return;
      window.fbq(
        "track",
        event,
        params,
        eventId ? { eventID: eventId } : undefined,
      );
      fired = true;
    }

    fire();
    window.addEventListener("rc-consent-changed", fire);
    // o fbevents.js pode carregar um instante depois do consentimento
    const iv = window.setInterval(fire, 1000);
    const stop = window.setTimeout(() => window.clearInterval(iv), 8000);

    return () => {
      window.removeEventListener("rc-consent-changed", fire);
      window.clearInterval(iv);
      window.clearTimeout(stop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}
