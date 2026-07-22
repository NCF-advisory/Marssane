import type { Metadata } from "next";
import localFont from "next/font/local";
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

const description =
  "Marssane forme les dirigeants de PME et les professions libérales à l'utilisation de l'IA.";

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
