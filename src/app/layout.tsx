import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const manrope = localFont({
  src: "./fonts/Manrope-latin-variable.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-manrope",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Cleanic’All — Nettoyage canapé, matelas et tapis en Île-de-France",
  description: "Nettoyage professionnel à domicile de canapés, matelas, tapis et fin de chantier en Île-de-France. Demandez votre devis à Cleanic’All.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
