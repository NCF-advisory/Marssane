import type { Metadata } from "next";
// `ViewTransition` vient du canal canary de React, celui que Next.js embarque
// (types déclarés via react-canary.d.ts à la racine).
import { ViewTransition } from "react";
import localFont from "next/font/local";
import { Nav } from "@/components/site/Nav";
import { ReservationDialog } from "@/components/site/ReservationDialog";
import { champSession } from "@/lib/session-display";
import "./globals.css";

const plusJakartaSans = localFont({
  src: "./fonts/plus-jakarta-sans-latin-variable.woff2",
  variable: "--font-jakarta-sans",
  weight: "400 800",
  display: "swap",
});

const splineSansMono = localFont({
  src: "./fonts/spline-sans-mono-latin-variable.woff2",
  variable: "--font-spline-mono",
  weight: "400 600",
  display: "swap",
});

// Même ciblage que le kicker du héro : dirigeants de PME de moins de 20 salariés.
const description =
  "Marssane forme les dirigeants de PME de moins de 20 salariés à utiliser l'IA sur leurs propres dossiers.";

export const metadata: Metadata = {
  title: "Marssane · Formation IA",
  description,
  robots: { index: false, follow: false },
  // og:image reste à produire (aucun asset visuel disponible à ce jalon).
  openGraph: {
    title: "Marssane · Formation IA",
    description,
    locale: "fr_FR",
    type: "website",
    siteName: "Marssane",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakartaSans.variable} ${splineSansMono.variable} h-full antialiased`}
    >
      {/* La nav est montée ici, hors de `children` : elle survit aux changements
          de route, ce qui rend sa transition de tonalité possible. */}
      <body className="min-h-full flex flex-col">
        <Nav />
        {/* Le corps de page est la seule zone qui change à la navigation : c'est
            lui qui fait le fondu croisé (voir « Fondu croisé entre pages » dans
            globals.css). La nav, hors de ce périmètre, est traitée comme un
            élément persistant de la transition. */}
        <ViewTransition>{children}</ViewTransition>
        {/* Montée ici, hors de `children` : le bouton « Réserver ma place » de
            la nav est présent sur tout le site, la modale qu'il ouvre doit
            l'être aussi (un seul id="reservation-dialog" dans le DOM). */}
        <ReservationDialog sessionLabel={champSession()} />
      </body>
    </html>
  );
}
