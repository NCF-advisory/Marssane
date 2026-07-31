import type { Metadata } from "next";
// `ViewTransition` vient du canal canary de React, celui que Next.js embarque
// (types déclarés via react-canary.d.ts à la racine).
import { ViewTransition } from "react";
import localFont from "next/font/local";
import { Nav } from "@/components/site/Nav";
import { ReservationDialog } from "@/components/site/ReservationDialog";
import { champSession } from "@/lib/session-display";
import { HOME_DESCRIPTION, SITE_URL } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Marssane · Formation IA",
  description: HOME_DESCRIPTION,
  openGraph: {
    title: "Marssane · Formation IA",
    description: HOME_DESCRIPTION,
    url: "/",
    locale: "fr_FR",
    type: "website",
    siteName: "Marssane",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Marssane · La formation IA des dirigeants de PME",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marssane · Formation IA",
    description: HOME_DESCRIPTION,
    images: ["/opengraph-image.png"],
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
        <Analytics />
      </body>
    </html>
  );
}
