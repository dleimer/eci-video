import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";

const ECI_GREEN = "#83C141";
const ECI_ORANGE = "#F7941D";
const BG = "#070C16";

// Thermostat image displayed at full canvas width
const THERMO_DISP_W = 1080;
const THERMO_DISP_H = Math.round(1080 * (1013 / 1320)); // 829px

const sceneOp = (frame: number, s: number, e: number, fade = 14): number =>
  interpolate(frame, [s, s + fade, e - fade, e], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const useSlideUp = (frame: number, fps: number, delay: number) => {
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 200 },
    durationInFrames: 30,
  });
  return {
    opacity: interpolate(s, [0, 0.25], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    y: interpolate(s, [0, 1], [40, 0]),
  };
};

// ── Scene frame ranges ──────────────────────────────────────────────────────
// S1 Intro:          0 – 88
// S2 Hero:          74 – 200
// Thermostat image: 74 – 665 (visible throughout S2–S5)
// S3 Morning Away: 184 – 358
// S4 Pre-Arrival:  342 – 516
// S5 Sleep:        500 – 665
// S6 Savings:      649 – 778
// S7 CTA:          762 – 848

export const ECIThermostat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── Global thermostat image opacity + subtle Ken Burns ─────────────────
  const thermoOp = sceneOp(frame, 74, 665, 18);
  const thermoScale = interpolate(frame, [74, 665], [1.0, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Screen temperature overlay ─────────────────────────────────────────
  // Overlaid on the house/temp area of the thermostat screen
  const scrOvOp = sceneOp(frame, 200, 656, 16);

  // Temperature shown on screen changes with each scenario
  const scrTemp = Math.round(
    interpolate(
      frame,
      [200, 245, 342, 406, 500, 562],
      [78, 78, 78, 72, 72, 68],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );
  const scrColor =
    frame < 342 ? "#F59E0B" : frame < 500 ? ECI_GREEN : "#818CF8";
  const scrLabel =
    frame < 342 ? "AWAY MODE" : frame < 500 ? "HOME MODE" : "SLEEP MODE";

  // ── Scene 1: Intro ──────────────────────────────────────────────────────
  const s1Op = sceneOp(frame, 0, 88);
  const logoSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16, stiffness: 210 },
    durationInFrames: 30,
  });
  const s1LogoScale = interpolate(logoSpring, [0, 1], [0.55, 1.0]);
  const s1LogoOp = interpolate(logoSpring, [0, 0.25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s1H1 = useSlideUp(frame, fps, 26);
  const s1H2 = useSlideUp(frame, fps, 40);

  // ── Scene 2: Hero ───────────────────────────────────────────────────────
  const s2Op = sceneOp(frame, 74, 200);
  const s2Title = useSlideUp(frame, fps, 90);
  const s2Sub = useSlideUp(frame, fps, 106);

  // ── Scene 3: Morning — leaving for work (summer) ────────────────────────
  const s3Op = sceneOp(frame, 184, 358);
  const s3Head = useSlideUp(frame, fps, 200);
  const s3Temp = useSlideUp(frame, fps, 218);
  const s3Desc = useSlideUp(frame, fps, 236);
  // Temperature animates: 72° (home) → 78° (away)
  const s3TempVal = Math.round(
    interpolate(frame, [220, 248], [72, 78], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // ── Scene 4: Pre-arrival — AC kicks on before you're home ───────────────
  const s4Op = sceneOp(frame, 342, 516);
  const s4Head = useSlideUp(frame, fps, 358);
  const s4Temp = useSlideUp(frame, fps, 376);
  const s4Desc = useSlideUp(frame, fps, 394);
  // Temperature animates: 78° (away) → 72° (pre-arrival)
  const s4TempVal = Math.round(
    interpolate(frame, [378, 406], [78, 72], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // ── Scene 5: Sleep mode ─────────────────────────────────────────────────
  const s5Op = sceneOp(frame, 500, 665);
  const s5Head = useSlideUp(frame, fps, 516);
  const s5Temp = useSlideUp(frame, fps, 534);
  const s5Desc = useSlideUp(frame, fps, 552);
  // Temperature animates: 72° → 68° (sleep)
  const s5TempVal = Math.round(
    interpolate(frame, [538, 566], [72, 68], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // ── Scene 6: Savings ────────────────────────────────────────────────────
  const s6Op = sceneOp(frame, 649, 778);
  const SAV_START = 666;
  const s6Title = useSlideUp(frame, fps, 653);
  const barFill = interpolate(frame, [SAV_START, SAV_START + 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pctCount = interpolate(frame, [SAV_START, SAV_START + 64], [0, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s6Badge = useSlideUp(frame, fps, SAV_START + 60);
  const s6Tag = useSlideUp(frame, fps, SAV_START + 75);

  // ── Scene 7: CTA ────────────────────────────────────────────────────────
  const s7Op = sceneOp(frame, 762, 848);
  const s7LogoSpring = spring({
    frame: frame - 768,
    fps,
    config: { damping: 15, stiffness: 210 },
    durationInFrames: 28,
  });
  const s7LogoScale = interpolate(s7LogoSpring, [0, 1], [0.5, 1.0]);
  const s7LogoOp = interpolate(s7LogoSpring, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s7Cta = useSlideUp(frame, fps, 786);
  const s7Phone = useSlideUp(frame, fps, 800);

  // ── Shared helpers ───────────────────────────────────────────────────────
  const CONTENT_TOP = THERMO_DISP_H - 60; // content card starts here
  const BAR_H = 400;

  const sceneBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  // Helper: scenario content card (below thermostat image)
  const CardBase: React.CSSProperties = {
    position: "absolute",
    top: CONTENT_TOP,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingInline: 60,
    gap: 22,
  };

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: BG,
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Arial Black', Arial, sans-serif",
      }}
    >
      {/* Global dark bg gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 50% at 50% 30%, #0C1726 0%, ${BG} 70%)`,
        }}
      />

      {/* ════════ THERMOSTAT IMAGE (S2–S5) ════════ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: THERMO_DISP_W,
          height: THERMO_DISP_H + 80,
          opacity: thermoOp,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("eci_thermostat.png")}
          style={{
            width: THERMO_DISP_W,
            height: THERMO_DISP_H,
            objectFit: "cover",
            transform: `scale(${thermoScale})`,
            transformOrigin: "center top",
            display: "block",
          }}
        />

        {/* Bottom gradient: image fades into BG */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 280,
            background: `linear-gradient(to bottom, transparent, ${BG})`,
          }}
        />

        {/* Screen temperature overlay (on the house/temp area of the display) */}
        {/* House icon area is approx x:510-900, y:150-490 in the 1080×829 display */}
        <div
          style={{
            position: "absolute",
            left: 510,
            top: 150,
            width: 400,
            height: 360,
            backgroundColor: "rgba(12, 38, 72, 0.88)",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: scrOvOp,
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: scrColor,
              fontWeight: 700,
              letterSpacing: 4,
              fontFamily: "monospace",
            }}
          >
            {scrLabel}
          </div>
          <div
            style={{
              fontSize: 86,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1,
              textShadow: `0 0 40px ${scrColor}88`,
            }}
          >
            {scrTemp}°
          </div>
          <div style={{ fontSize: 16, color: "#6A8AAA", letterSpacing: 2 }}>
            FAHRENHEIT
          </div>
        </div>

        {/* ECI brand watermark on thermostat */}
        <div
          style={{
            position: "absolute",
            top: 18,
            left: 18,
            opacity: 0.9,
          }}
        >
          <Img
            src={staticFile("eci_logo.png")}
            style={{ width: 100, height: "auto" }}
          />
        </div>

        {/* "ECI SMART THERMOSTAT" label strip */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              paddingInline: 28,
              paddingBlock: 10,
              backgroundColor: `${ECI_GREEN}DD`,
              borderRadius: 24,
              fontSize: 20,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "3px",
            }}
          >
            ECI SMART THERMOSTAT
          </div>
        </div>
      </div>

      {/* ════════ SCENE 1 — ECI Intro ════════ */}
      <div style={{ ...sceneBase, opacity: s1Op, gap: 40 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 65% 45% at 50% 48%, ${ECI_GREEN}20 0%, transparent 68%)`,
          }}
        />
        <div style={{ opacity: s1LogoOp, transform: `scale(${s1LogoScale})` }}>
          <Img
            src={staticFile("eci_logo.png")}
            style={{ width: 320, height: "auto" }}
          />
        </div>
        <div
          style={{
            opacity: s1H1.opacity,
            transform: `translateY(${s1H1.y}px)`,
            textAlign: "center",
            paddingInline: 70,
          }}
        >
          <div style={{ fontSize: 58, fontWeight: 900, color: "#FFF", lineHeight: 1.1 }}>
            PROGRAMMABLE
          </div>
          <div style={{ fontSize: 58, fontWeight: 900, color: ECI_GREEN, lineHeight: 1.1 }}>
            THERMOSTATS
          </div>
        </div>
        <div
          style={{
            opacity: s1H2.opacity,
            transform: `translateY(${s1H2.y}px)`,
            fontSize: 28,
            color: "#8899BB",
            fontWeight: 700,
            letterSpacing: "3px",
            textAlign: "center",
          }}
        >
          SMART. EFFICIENT. COMFORTABLE.
        </div>
      </div>

      {/* ════════ SCENE 2 — Thermostat Hero ════════ */}
      <div
        style={{
          ...CardBase,
          opacity: s2Op,
          justifyContent: "flex-start",
          paddingTop: 40,
        }}
      >
        <div
          style={{
            opacity: s2Title.opacity,
            transform: `translateY(${s2Title.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 50, fontWeight: 900, color: "#FFF", lineHeight: 1.1 }}>
            YOUR HOME,
          </div>
          <div style={{ fontSize: 50, fontWeight: 900, color: ECI_GREEN, lineHeight: 1.1 }}>
            ALWAYS COMFORTABLE.
          </div>
        </div>
        <div
          style={{
            opacity: s2Sub.opacity,
            transform: `translateY(${s2Sub.y}px)`,
            fontSize: 28,
            color: "#7A8899",
            textAlign: "center",
            lineHeight: 1.55,
          }}
        >
          Set your schedule once. Your ECI thermostat does the rest — automatically.
        </div>
      </div>

      {/* ════════ SCENE 3 — Morning: Leaving for work ════════ */}
      <div style={{ ...CardBase, opacity: s3Op, gap: 20 }}>
        {/* Time + context */}
        <div
          style={{
            opacity: s3Head.opacity,
            transform: `translateY(${s3Head.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#8899BB",
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            ☀️ &nbsp; SUMMER MORNING
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              color: "#FFFFFF",
              fontFamily: "monospace",
              letterSpacing: "2px",
            }}
          >
            8:00 AM
          </div>
          <div style={{ fontSize: 24, color: "#7A8899", marginTop: 8 }}>
            You leave for work
          </div>
        </div>

        {/* Temperature */}
        <div
          style={{
            opacity: s3Temp.opacity,
            transform: `translateY(${s3Temp.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: "#F59E0B",
              lineHeight: 1,
              textShadow: "0 0 60px #F59E0B55",
            }}
          >
            {s3TempVal}°F
          </div>
          <div
            style={{
              display: "inline-block",
              paddingInline: 24,
              paddingBlock: 8,
              backgroundColor: "#F59E0B22",
              border: "2px solid #F59E0B",
              borderRadius: 10,
              fontSize: 20,
              color: "#F59E0B",
              fontWeight: 700,
              letterSpacing: "4px",
              marginTop: 10,
            }}
          >
            AWAY MODE — AC OFF
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            opacity: s3Desc.opacity,
            transform: `translateY(${s3Desc.y}px)`,
            fontSize: 26,
            color: "#7A8899",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          No need to manually adjust. Your ECI thermostat sets itself to 78° the moment you walk out the door.
        </div>
      </div>

      {/* ════════ SCENE 4 — Pre-arrival: AC kicks on before you're home ════════ */}
      <div style={{ ...CardBase, opacity: s4Op, gap: 20 }}>
        <div
          style={{
            opacity: s4Head.opacity,
            transform: `translateY(${s4Head.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#8899BB",
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            🏡 &nbsp; PRE-ARRIVAL
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              color: "#FFFFFF",
              fontFamily: "monospace",
              letterSpacing: "2px",
            }}
          >
            5:00 PM
          </div>
          <div style={{ fontSize: 24, color: "#7A8899", marginTop: 8 }}>
            30 minutes before you arrive
          </div>
        </div>

        <div
          style={{
            opacity: s4Temp.opacity,
            transform: `translateY(${s4Temp.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: ECI_GREEN,
              lineHeight: 1,
              textShadow: `0 0 60px ${ECI_GREEN}55`,
            }}
          >
            {s4TempVal}°F
          </div>
          <div
            style={{
              display: "inline-block",
              paddingInline: 24,
              paddingBlock: 8,
              backgroundColor: `${ECI_GREEN}22`,
              border: `2px solid ${ECI_GREEN}`,
              borderRadius: 10,
              fontSize: 20,
              color: ECI_GREEN,
              fontWeight: 700,
              letterSpacing: "4px",
              marginTop: 10,
            }}
          >
            HOME MODE — AC ON
          </div>
        </div>

        <div
          style={{
            opacity: s4Desc.opacity,
            transform: `translateY(${s4Desc.y}px)`,
            fontSize: 26,
            color: "#7A8899",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          AC fires up automatically at 5 PM. Walk in at 5:30 to a perfectly cool 72° — without lifting a finger.
        </div>
      </div>

      {/* ════════ SCENE 5 — Sleep mode ════════ */}
      <div style={{ ...CardBase, opacity: s5Op, gap: 20 }}>
        <div
          style={{
            opacity: s5Head.opacity,
            transform: `translateY(${s5Head.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#8899BB",
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            🌙 &nbsp; SLEEP MODE
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              color: "#FFFFFF",
              fontFamily: "monospace",
              letterSpacing: "2px",
            }}
          >
            10:30 PM
          </div>
          <div style={{ fontSize: 24, color: "#7A8899", marginTop: 8 }}>
            You head to bed
          </div>
        </div>

        <div
          style={{
            opacity: s5Temp.opacity,
            transform: `translateY(${s5Temp.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: "#818CF8",
              lineHeight: 1,
              textShadow: "0 0 60px #818CF855",
            }}
          >
            {s5TempVal}°F
          </div>
          <div
            style={{
              display: "inline-block",
              paddingInline: 24,
              paddingBlock: 8,
              backgroundColor: "#818CF822",
              border: "2px solid #818CF8",
              borderRadius: 10,
              fontSize: 20,
              color: "#818CF8",
              fontWeight: 700,
              letterSpacing: "4px",
              marginTop: 10,
            }}
          >
            SLEEP MODE
          </div>
        </div>

        <div
          style={{
            opacity: s5Desc.opacity,
            transform: `translateY(${s5Desc.y}px)`,
            fontSize: 26,
            color: "#7A8899",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Cools down to 68° automatically for better sleep — then warms back up before your alarm.
        </div>
      </div>

      {/* ════════ SCENE 6 — Savings ════════ */}
      <div style={{ ...sceneBase, opacity: s6Op, gap: 32 }}>
        <div
          style={{
            opacity: s6Title.opacity,
            transform: `translateY(${s6Title.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 34, color: "#8899BB", fontWeight: 700, letterSpacing: "2px" }}>
            ADD IT ALL UP AND
          </div>
          <div style={{ fontSize: 38, color: "#8899BB", fontWeight: 700, letterSpacing: "2px" }}>
            SAVE UP TO
          </div>
          <div
            style={{
              fontSize: 148,
              fontWeight: 900,
              color: ECI_GREEN,
              lineHeight: 1,
              textShadow: `0 0 60px ${ECI_GREEN}66`,
            }}
          >
            {Math.round(pctCount)}%
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#FFFFFF",
              fontWeight: 700,
              letterSpacing: "4px",
            }}
          >
            ANNUALLY
          </div>
        </div>

        {/* Green fill bar */}
        <div style={{ width: 860 }}>
          <div
            style={{
              width: "100%",
              height: 26,
              backgroundColor: "#1A2030",
              borderRadius: 13,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${barFill * 100}%`,
                height: "100%",
                backgroundColor: ECI_GREEN,
                borderRadius: 13,
                boxShadow: `0 0 24px ${ECI_GREEN}88`,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <div style={{ fontSize: 18, color: "#3A4A60" }}>0%</div>
            <div style={{ fontSize: 18, color: ECI_GREEN, fontWeight: 700 }}>
              10% annual savings
            </div>
          </div>
        </div>

        {/* Bar chart comparison */}
        <div style={{ display: "flex", gap: 60, alignItems: "flex-end" }}>
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
          >
            <div style={{ fontSize: 18, color: "#667788" }}>Without</div>
            <div
              style={{
                width: 120,
                height: barFill * BAR_H,
                backgroundColor: "#404858",
                borderRadius: "8px 8px 0 0",
              }}
            />
            <div style={{ fontSize: 20, color: "#667788", fontWeight: 700 }}>
              $2,000/yr
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
          >
            <div
              style={{
                fontSize: 16,
                color: ECI_GREEN,
                fontWeight: 700,
                backgroundColor: `${ECI_GREEN}22`,
                border: `1.5px solid ${ECI_GREEN}`,
                borderRadius: 8,
                paddingInline: 12,
                paddingBlock: 5,
                opacity: barFill,
                letterSpacing: 1,
              }}
            >
              $200 SAVED
            </div>
            <div style={{ fontSize: 18, color: ECI_GREEN }}>With ECI</div>
            <div
              style={{
                width: 120,
                height: barFill * BAR_H * 0.9,
                backgroundColor: ECI_GREEN,
                borderRadius: "8px 8px 0 0",
                boxShadow: `0 0 30px ${ECI_GREEN}55`,
              }}
            />
            <div style={{ fontSize: 20, color: ECI_GREEN, fontWeight: 700 }}>
              $1,800/yr
            </div>
          </div>
        </div>

        <div
          style={{
            opacity: s6Badge.opacity,
            transform: `translateY(${s6Badge.y}px)`,
            paddingInline: 36,
            paddingBlock: 18,
            backgroundColor: `${ECI_GREEN}18`,
            border: `2px solid ${ECI_GREEN}`,
            borderRadius: 18,
            fontSize: 24,
            color: ECI_GREEN,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          On annual heating &amp; cooling costs
        </div>

        <div
          style={{
            opacity: s6Tag.opacity,
            transform: `translateY(${s6Tag.y}px)`,
            fontSize: 22,
            color: "#55667A",
            textAlign: "center",
          }}
        >
          Better than adjusting by hand. Every single day.
        </div>
      </div>

      {/* ════════ SCENE 7 — CTA ════════ */}
      <div style={{ ...sceneBase, opacity: s7Op, gap: 36 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${ECI_GREEN}1A 0%, transparent 70%)`,
          }}
        />
        <div style={{ opacity: s7LogoOp, transform: `scale(${s7LogoScale})` }}>
          <Img
            src={staticFile("eci_logo.png")}
            style={{ width: 280, height: "auto" }}
          />
        </div>
        <div
          style={{
            opacity: s7Cta.opacity,
            transform: `translateY(${s7Cta.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 900, color: "#FFF", lineHeight: 1.1 }}>
            CALL US TODAY
          </div>
          <div
            style={{
              fontSize: 34,
              color: ECI_GREEN,
              fontWeight: 700,
              letterSpacing: "2px",
              marginTop: 8,
            }}
          >
            TO START SAVING!
          </div>
        </div>
        <div
          style={{
            opacity: s7Phone.opacity,
            transform: `translateY(${s7Phone.y}px)`,
          }}
        >
          <div
            style={{
              paddingInline: 56,
              paddingBlock: 26,
              backgroundColor: ECI_GREEN,
              borderRadius: 26,
              fontSize: 56,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "2px",
              boxShadow: `0 12px 50px ${ECI_GREEN}77`,
            }}
          >
            215-245-3200
          </div>
        </div>
        <div
          style={{
            opacity: s7Phone.opacity,
            fontSize: 22,
            color: ECI_ORANGE,
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          Ask about our programmable thermostat installation
        </div>
      </div>
    </div>
  );
};
