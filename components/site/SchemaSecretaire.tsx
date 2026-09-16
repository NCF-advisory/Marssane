import { createElement } from "react";
import Script from "next/script";

export function SchemaSecretaire() {
  return (
    <>
      <Script
        src="/animations/secretaire-digital/marssane-secretaire.js"
        type="module"
        strategy="afterInteractive"
      />
      {createElement("marssane-secretaire", {
        style: { display: "block", width: "100%", aspectRatio: "16 / 9" },
      })}
    </>
  );
}
