import { createElement } from "react";
import Script from "next/script";

/** Le schéma livré conserve son animation SVG et ses contrôles accessibles. */
export function SchemaDevis({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <>
      <Script
        src="/animations/devis-menuiserie-v8/marssane-devis.js"
        type="module"
        strategy="afterInteractive"
      />
      {createElement("marssane-devis", {
        theme,
        style: { display: "block", width: "100%", aspectRatio: "16 / 9" },
      })}
    </>
  );
}
