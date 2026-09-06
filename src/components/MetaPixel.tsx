"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { hasConsent } from "@/lib/consent";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

// Instala o fbq (fila até o fbevents.js carregar) e dispara o PageView.
// Equivalente ao snippet oficial da Meta, escrito de forma legível.
function carregarPixel() {
  if (window.fbq) return;

  const fbq: any = function (...args: unknown[]) {
    fbq.callMethod
      ? fbq.callMethod.apply(fbq, args)
      : fbq.queue.push(args);
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);

  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Carrega o Meta Pixel só depois do consentimento de "marketing". Reage ao
// evento rc-consent-changed (a pessoa aceita no banner) e dispara PageView
// em cada troca de rota.
export default function MetaPixel() {
  const pathname = usePathname();
  const ativo = useRef(false);

  useEffect(() => {
    if (!PIXEL_ID) return;

    function tentar() {
      if (ativo.current || !hasConsent("marketing")) return;
      carregarPixel();
      ativo.current = true;
    }

    tentar();
    window.addEventListener("rc-consent-changed", tentar);
    return () => window.removeEventListener("rc-consent-changed", tentar);
  }, []);

  useEffect(() => {
    if (ativo.current && window.fbq) window.fbq("track", "PageView");
  }, [pathname]);

  return null;
}
