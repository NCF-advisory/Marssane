import { createElement } from "react";
import Script from "next/script";

export function SchemaSecretaireVocal() {
  return (
    <>
      <Script
        src="/animations/secretaire-vocal/marssane-secretaire-vocal.js"
        type="module"
        strategy="afterInteractive"
      />
      {createElement("marssane-secretaire-vocal", {
        style: { display: "block", width: "100%", aspectRatio: "16 / 9" },
      })}
    </>
  );
}
