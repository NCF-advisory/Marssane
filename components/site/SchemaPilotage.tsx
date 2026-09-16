import { createElement } from "react";
import Script from "next/script";

export function SchemaPilotage() {
  return (
    <>
      <Script
        src="/animations/chiffres-pilotage/marssane-pilotage.js"
        type="module"
        strategy="afterInteractive"
      />
      {createElement("marssane-pilotage", {
        style: { display: "block", width: "100%", aspectRatio: "16 / 9" },
      })}
    </>
  );
}
