import { createElement } from "react";
import Script from "next/script";

export function SchemaProspection() {
  return (
    <>
      <Script
        src="/animations/prospection-v2/marssane-prospection.js"
        type="module"
        strategy="afterInteractive"
      />
      {createElement("marssane-prospection", {
        style: { display: "block", width: "100%", aspectRatio: "16 / 9" },
      })}
    </>
  );
}
