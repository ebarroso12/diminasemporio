import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito_Sans, Parisienne } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--fonte-display",
  display: "swap",
});

const corpo = Nunito_Sans({
  subsets: ["latin"],
  variable: "--fonte-corpo",
  display: "swap",
});

const script = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--fonte-script",
  display: "swap",
});

const urlBase =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(urlBase),
  title: {
    default: `${site.nomeCompleto} — ${site.tagline}`,
    template: `%s · ${site.nome}`,
  },
  description: site.descricao,
  openGraph: {
    title: `${site.nomeCompleto} — ${site.tagline}`,
    description: site.descricao,
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/fotos/pao-de-queijo-recheado.jpeg" }],
  },
  icons: { icon: "/fotos/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#1c3a5e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${corpo.variable} ${script.variable}`}>
      <body className="textura-papel">{children}</body>
    </html>
  );
}
