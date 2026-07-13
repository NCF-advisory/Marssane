import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, SHADOW, RADIUS } from "../theme";
import { AI_LOGOS, type AiLogo } from "../logos";
import { AiLogoGlyph } from "../components/AiLogo";
import { pop, ramp } from "../anim";

const COL_W = 520;
const GAP = 44;

/** Une tuile de logo IA (colonne « Installer »), rendue monochrome encre. */
function LogoTile({ logo }: { logo: AiLogo }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: "26px 12px",
        background: C.toile,
        borderRadius: RADIUS.card,
        border: "1px solid rgba(16,24,40,0.05)",
      }}
    >
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AiLogoGlyph logo={logo} size={52} />
      </div>
      <span
        style={{
          fontFamily: FONT.sans,
          fontWeight: 600,
          fontSize: 26,
          color: C.body,
        }}
      >
        {logo.label}
      </span>
    </div>
  );
}

/** Une ligne à puce (colonnes « Utiliser » et « Automatiser »). */
function Bullet({ children }: { children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: C.canard,
          flex: "none",
        }}
      />
      <span style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 32, color: C.ink }}>
        {children}
      </span>
    </div>
  );
}

/** Un panneau-colonne : slide-up séquentiel + entête. */
function Column({
  label,
  children,
  local,
  fps,
  delay,
}: {
  label: string;
  children: ReactNode;
  local: number;
  fps: number;
  delay: number;
}) {
  const p = Math.min(1, pop(local, fps, delay));
  return (
    <div
      style={{
        width: COL_W,
        background: C.surface,
        borderRadius: RADIUS.card,
        border: "1px solid rgba(16,24,40,0.06)",
        boxShadow: SHADOW.hero,
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${(1 - p) * 60}px)`,
      }}
    >
      <div
        style={{
          padding: "26px 30px",
          borderBottom: "1px solid rgba(16,24,40,0.06)",
        }}
      >
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 22,
            letterSpacing: "0.04em",
            color: C.faint,
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ padding: "30px" }}>{children}</div>
    </div>
  );
}

/**
 * G3 — La pile se range (14–20,5 s). La pile désordonnée se réorganise en trois
 * colonnes nettes « Installer », « Utiliser au quotidien », « Automatiser », qui
 * apparaissent en slide-up séquentiel. Titre « Une journée de formation. » au
 * dessus. La colonne « Installer » montre les IA utilisées (Claude, ChatGPT,
 * Mistral, GLM).
 */
export function G3Colonnes({ local, fps }: { local: number; fps: number }) {
  const titleT = ramp(local, 6, 30);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 44,
        }}
      >
        <span
          style={{
            fontFamily: FONT.sans,
            fontWeight: 800,
            fontSize: 68,
            letterSpacing: "-0.02em",
            color: C.ink,
            opacity: titleT,
            transform: `translateY(${(1 - titleT) * 20}px)`,
          }}
        >
          Une journée de formation.
        </span>

        <div style={{ display: "flex", gap: GAP, alignItems: "flex-start" }}>
          <Column label="Installer" local={local} fps={fps} delay={26}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              {AI_LOGOS.map((logo) => (
                <LogoTile key={logo.label} logo={logo} />
              ))}
            </div>
          </Column>

          <Column label="Utiliser au quotidien" local={local} fps={fps} delay={35}>
            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              <Bullet>Trier les mails</Bullet>
              <Bullet>Résumer un dossier</Bullet>
              <Bullet>Rédiger un courrier</Bullet>
              <Bullet>Interroger vos documents</Bullet>
            </div>
          </Column>

          <Column label="Automatiser" local={local} fps={fps} delay={44}>
            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              <Bullet>Construire un scénario</Bullet>
              <Bullet>Le déclencher seul</Bullet>
              <Bullet>Garder la main dessus</Bullet>
              <Bullet>Repartir avec le système</Bullet>
            </div>
          </Column>
        </div>
      </div>
    </AbsoluteFill>
  );
}
