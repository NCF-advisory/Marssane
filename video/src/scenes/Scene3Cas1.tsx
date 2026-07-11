import { AbsoluteFill, interpolate } from "remotion";
import { C, FONT } from "../theme";
import { Kicker, Titre, BadgeEcume } from "../components/primitives";
import { ramp, pop, countInt, easeOut } from "../anim";

/**
 * Cas 1 — Trier vos mails. Un chiffre mono géant compte 47 → 6, la jauge passe
 * de pleine (grise, 08:02) à 13 % (turquoise, 17:00), puis le badge écume pop.
 */
export function Scene3Cas1({ local, fps }: { local: number; fps: number }) {
  const t = ramp(local, 40, 90); // 0 = état 08:02 / 1 = état 17:00
  const n = countInt(local, 40, 90, 47, 6);
  const pct = interpolate(t, [0, 1], [100, 13]);
  const numColor = t < 0.5 ? C.faint : C.inkEcume;
  const badge = pop(local, fps, 96);

  const headY = interpolate(local, [0, 20], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 44,
        padding: "0 90px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          transform: `translateY(${headY}px)`,
        }}
      >
        <Kicker>Cas 01</Kicker>
        <Titre size={100} style={{ textAlign: "center" }}>
          Trier vos mails
        </Titre>
      </div>

      {/* Chiffre géant */}
      <div
        style={{
          fontFamily: FONT.mono,
          fontWeight: 600,
          fontSize: 300,
          lineHeight: 1,
          color: numColor,
          letterSpacing: "-0.03em",
        }}
      >
        {n}
      </div>

      {/* Légende (crossfade 08:02 → 17:00) */}
      <div style={{ position: "relative", height: 48, width: 640 }}>
        <Caption opacity={1 - t} time="08:02" status="non triés" />
        <Caption opacity={t} time="17:00" status="à traiter" statusColor={C.inkEcume} />
      </div>

      {/* Jauge (crossfade gris plein → turquoise 13 %) */}
      <div
        style={{
          width: 640,
          height: 24,
          borderRadius: 999,
          background: C.barTrack,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${pct}%`,
            borderRadius: 999,
            background: C.repere,
            opacity: 1 - t,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${pct}%`,
            borderRadius: 999,
            background: C.turquoise,
            opacity: t,
          }}
        />
      </div>

      <BadgeEcume
        style={{
          opacity: Math.min(1, badge),
          transform: `scale(${0.9 + 0.1 * Math.min(1, badge)})`,
        }}
      >
        triée par votre automatisation
      </BadgeEcume>
    </AbsoluteFill>
  );
}

function Caption({
  opacity,
  time,
  status,
  statusColor = C.faint,
}: {
  opacity: number;
  time: string;
  status: string;
  statusColor?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        opacity,
        fontFamily: FONT.mono,
        fontSize: 40,
      }}
    >
      <span style={{ color: C.faint }}>{time}</span>
      <span style={{ color: statusColor, fontWeight: 600 }}>{status}</span>
    </div>
  );
}
