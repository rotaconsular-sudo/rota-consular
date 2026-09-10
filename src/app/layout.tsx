import type { Metadata } from "next";
import { Libre_Franklin, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import MetaPixel from "@/components/MetaPixel";
import { SITE_URL } from "@/lib/url";

// Libre Franklin: gótica americana (linhagem Franklin Gothic) — cara cívica.
const franklin = Libre_Franklin({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// IBM Plex Mono: eyebrows, tags e números — voz de campo de formulário.
const plexMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Source Serif 4: bloco de aviso "oficial".
const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rota Consular",
  description:
    "Preparação para o visto americano de turismo (B1/B2) — checklist de prontidão, nunca uma promessa de aprovação.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${franklin.variable} ${plexMono.variable} ${sourceSerif.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <CookieBanner />
        <MetaPixel />
      </body>
    </html>
  );
}
