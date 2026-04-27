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

// ── CSS programmable thermostat graphic ──────────────────────────────────────
type ThermoDisplayProps = {
  time: string;
  temp: number;
  mode: string;
  modeColor: string;
  frame: number;
};

const ThermoDisplay: React.FC<ThermoDisplayProps> = ({
  time, temp, mode, modeColor, frame,
}) => {
  const glowPulse = Math.sin(frame * 0.12) * 0.25 + 0.75;
  const SCREEN_W = 900;
  const SCREEN_H = 530;
  const rayAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div
      style={{
        width: 960,
        backgroundColor: "#111418",
        borderRadius: 36,
        padding: "14px 14px 14px 14px",
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.85), 0 0 0 2px #252830, inset 0 1px 0 rgba(255,255,255,0.05)",
        position: "relative",
      }}
    >
      {/* Device top nub */}
      <div
        style={{
          position: "absolute",
          top: -2,
          left: "50%",
          transform: "translateX(-50%)",
          width: 32,
          height: 6,
          backgroundColor: "#1E2228",
          borderRadius: "0 0 4px 4px",
        }}
      />

      {/* Screen */}
      <div
        style={{
          width: SCREEN_W,
          height: SCREEN_H,
          background:
            "linear-gradient(145deg, #3A7FA8 0%, #226088 30%, #1A506E 70%, #0F3A52 100%)",
          borderRadius: 22,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Screen bg radial */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(80,160,200,0.35) 0%, transparent 70%)",
          }}
        />

        {/* Top status bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingInline: 28,
            paddingBlock: 14,
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: "rgba(255,255,255,0.9)",
              fontFamily: "monospace",
              letterSpacing: 2,
              fontWeight: 600,
            }}
          >
            {time}
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                backgroundColor: modeColor,
                boxShadow: `0 0 12px ${modeColor}`,
                opacity: glowPulse,
              }}
            />
            <div
              style={{
                fontSize: 18,
                color: modeColor,
                fontFamily: "monospace",
                letterSpacing: 3,
                fontWeight: 700,
              }}
            >
              {mode}
            </div>
          </div>
        </div>

        {/* Main screen content */}
        <div style={{ display: "flex", flex: 1 }}>
          {/* Left panel: sun + menu */}
          <div
            style={{
              width: 255,
              padding: "20px 20px 16px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              borderRight: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {/* Sun icon */}
            <svg width={82} height={82} viewBox="0 0 72 72">
              <circle
                cx={36}
                cy={36}
                r={16}
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth={3.5}
              />
              {rayAngles.map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const x1 = 36 + 22 * Math.cos(rad);
                const y1 = 36 + 22 * Math.sin(rad);
                const x2 = 36 + 30 * Math.cos(rad);
                const y2 = 36 + 30 * Math.sin(rad);
                return (
                  <line
                    key={angle}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255,255,255,0.75)"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* Menu items */}
            {["TEMPERATURE", "WEATHER", "AIR CONDITION", "HOME"].map(
              (item, i) => (
                <div
                  key={item}
                  style={{
                    fontSize: 17,
                    color:
                      i === 0
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,255,255,0.55)",
                    letterSpacing: 1.5,
                    fontFamily: "monospace",
                    fontWeight: i === 0 ? 700 : 400,
                    paddingBlock: 4,
                    borderBottom:
                      i === 3
                        ? "none"
                        : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>

          {/* Right panel: house + temperature */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              position: "relative",
            }}
          >
            {/* House SVG */}
            <div style={{ position: "relative", width: 280, height: 300 }}>
              <svg viewBox="0 0 260 280" width={280} height={300}>
                <polygon
                  points="130,18 10,118 50,118"
                  fill="none"
                  stroke="rgba(255,255,255,0.82)"
                  strokeWidth={5}
                  strokeLinejoin="round"
                />
                <polygon
                  points="130,18 250,118 210,118"
                  fill="none"
                  stroke="rgba(255,255,255,0.82)"
                  strokeWidth={5}
                  strokeLinejoin="round"
                />
                <rect
                  x={50}
                  y={118}
                  width={160}
                  height={142}
                  fill="none"
                  stroke="rgba(255,255,255,0.82)"
                  strokeWidth={5}
                />
                <rect
                  x={112}
                  y={210}
                  width={36}
                  height={50}
                  fill="none"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth={3}
                />
              </svg>

              {/* Temperature inside house */}
              <div
                style={{
                  position: "absolute",
                  top: "52%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: 90,
                  fontWeight: 900,
                  color: "#FFFFFF",
                  fontFamily: "'Arial Black', Arial, sans-serif",
                  lineHeight: 1,
                  textShadow: `0 0 40px ${modeColor}88`,
                }}
              >
                {temp}°
              </div>
            </div>

            {/* Vertical temp scale bar */}
            <div
              style={{
                width: 16,
                height: 220,
                backgroundColor: "rgba(255,255,255,0.12)",
                borderRadius: 8,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${((temp - 60) / 30) * 100}%`,
                  backgroundColor: modeColor,
                  borderRadius: 8,
                  boxShadow: `0 0 12px ${modeColor}`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom icon row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            paddingInline: 20,
            paddingBlock: 12,
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {["≡", "❄", "◉", "⌂", "⏻", "▤"].map((icon, i) => (
            <div
              key={i}
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

      {/* Device bottom power button */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 28,
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor: "#1E2228",
          border: "1.5px solid #333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          color: "#555",
        }}
      >
        ⏻
      </div>
    </div>
  );
};

// ── Scene frame ranges ──────────────────────────────────────────────────────
// S1 Intro:         0  – 88
// S2 Hero:         74  – 200
// Thermostat CSS:  74  – 665
// S3 Morning:     184  – 358
// S4 Pre-Arrival: 342  – 516
// S5 Sleep:       500  – 665
// S6 Savings:     649  – 870
// S7 CTA:         854  – 960

export const ECIThermostat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Thermostat graphic: visible S2–S5
  const thermoOp = sceneOp(frame, 74, 665, 18);
  const thermoSpring = spring({
    frame: frame - 78,
    fps,
    config: { damping: 16, stiffness: 180 },
    durationInFrames: 35,
  });
  const thermoY = interpolate(thermoSpring, [0, 1], [-80, 0]);
  const thermoScale = interpolate(thermoSpring, [0, 1], [0.92, 1.0]);

  const thermoTemp = Math.round(
    interpolate(
      frame,
      [184, 240, 342, 406, 500, 562],
      [72, 78, 78, 72, 72, 68],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );
  const thermoModeColor =
    frame < 200
      ? "#FFFFFF"
      : frame < 342
      ? "#F59E0B"
      : frame < 500
      ? ECI_GREEN
      : "#818CF8";
  const thermoMode =
    frame < 200
      ? "HOME"
      : frame < 342
      ? "AWAY"
      : frame < 500
      ? "HOME"
      : "SLEEP";
  const thermoTime =
    frame < 220
      ? "10:00 AM"
      : frame < 380
      ? "8:00 AM"
      : frame < 540
      ? "5:00 PM"
      : "10:30 PM";

  // ── Scene 1: Intro ─────────────────────────────────────────────────────
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

  // ── Scene 2: Hero ──────────────────────────────────────────────────────
  const s2Op = sceneOp(frame, 74, 200);
  const s2Title = useSlideUp(frame, fps, 100);
  const s2Sub = useSlideUp(frame, fps, 116);

  // ── Scene 3: Morning — leaving for work ────────────────────────────────
  const s3Op = sceneOp(frame, 184, 358);
  const s3Head = useSlideUp(frame, fps, 200);
  const s3Temp = useSlideUp(frame, fps, 218);
  const s3Desc = useSlideUp(frame, fps, 236);
  const s3TempVal = Math.round(
    interpolate(frame, [220, 248], [72, 78], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // ── Scene 4: Pre-arrival ───────────────────────────────────────────────
  const s4Op = sceneOp(frame, 342, 516);
  const s4Head = useSlideUp(frame, fps, 358);
  const s4Temp = useSlideUp(frame, fps, 376);
  const s4Desc = useSlideUp(frame, fps, 394);
  const s4TempVal = Math.round(
    interpolate(frame, [378, 406], [78, 72], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // ── Scene 5: Sleep ─────────────────────────────────────────────────────
  const s5Op = sceneOp(frame, 500, 665);
  const s5Head = useSlideUp(frame, fps, 516);
  const s5Temp = useSlideUp(frame, fps, 534);
  const s5Desc = useSlideUp(frame, fps, 552);
  const s5TempVal = Math.round(
    interpolate(frame, [538, 566], [72, 68], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // ── Scene 6: Savings ───────────────────────────────────────────────────
  const s6Op = sceneOp(frame, 649, 870);
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
  const BAR_H = 380;

  // ── Scene 7: CTA ───────────────────────────────────────────────────────
  const s7Op = sceneOp(frame, 854, 960);
  const s7LogoSpring = spring({
    frame: frame - 860,
    fps,
    config: { damping: 15, stiffness: 210 },
    durationInFrames: 28,
  });
  const s7LogoScale = interpolate(s7LogoSpring, [0, 1], [0.5, 1.0]);
  const s7LogoOp = interpolate(s7LogoSpring, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s7Cta = useSlideUp(frame, fps, 874);
  const s7Phone = useSlideUp(frame, fps, 888);
  const s7Sub = useSlideUp(frame, fps, 902);

  const sceneBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const THERMO_TOP = 70;
  const THERMO_H_EST = 610;
  const CONTENT_TOP = THERMO_TOP + THERMO_H_EST + 24;

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
    paddingInline: 50,
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
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 50% at 50% 30%, #0C1726 0%, ${BG} 70%)`,
        }}
      />

      {/* ════════ CSS THERMOSTAT (S2–S5) ════════ */}
      <div
        style={{
          position: "absolute",
          top: THERMO_TOP,
          left: (width - 960) / 2,
          opacity: thermoOp,
          transform: `translateY(${thermoY}px) scale(${thermoScale})`,
          transformOrigin: "top center",
        }}
      >
        <ThermoDisplay
          time={thermoTime}
          temp={thermoTemp}
          mode={thermoMode}
          modeColor={thermoModeColor}
          frame={frame}
        />
      </div>

      {/* ════════ SCENE 1 — Intro ════════ */}
      <div style={{ ...sceneBase, opacity: s1Op, gap: 44 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 65% 45% at 50% 48%, ${ECI_GREEN}20 0%, transparent 68%)`,
          }}
        />
        <div style={{ opacity: s1LogoOp, transform: `scale(${s1LogoScale})` }}>
          <Img src={staticFile("eci_logo.png")} style={{ width: 360, height: "auto" }} />
        </div>
        <div
          style={{
            opacity: s1H1.opacity,
            transform: `translateY(${s1H1.y}px)`,
            textAlign: "center",
            paddingInline: 60,
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 900, color: "#FFF", lineHeight: 1.1 }}>
            PROGRAMMABLE
          </div>
          <div style={{ fontSize: 72, fontWeight: 900, color: ECI_GREEN, lineHeight: 1.1 }}>
            THERMOSTATS
          </div>
        </div>
        <div
          style={{
            opacity: s1H2.opacity,
            transform: `translateY(${s1H2.y}px)`,
            fontSize: 36,
            color: "#8899BB",
            fontWeight: 700,
            letterSpacing: "3px",
            textAlign: "center",
          }}
        >
          SMART. EFFICIENT. COMFORTABLE.
        </div>
      </div>

      {/* ════════ SCENE 2 — Hero ════════ */}
      <div style={{ ...CardBase, opacity: s2Op, justifyContent: "flex-start", paddingTop: 28 }}>
        <div
          style={{
            opacity: s2Title.opacity,
            transform: `translateY(${s2Title.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 62, fontWeight: 900, color: "#FFF", lineHeight: 1.1 }}>
            YOUR HOME,
          </div>
          <div style={{ fontSize: 62, fontWeight: 900, color: ECI_GREEN, lineHeight: 1.1 }}>
            ALWAYS COMFORTABLE.
          </div>
        </div>
        <div
          style={{
            opacity: s2Sub.opacity,
            transform: `translateY(${s2Sub.y}px)`,
            fontSize: 34,
            color: "#7A8899",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Set your schedule once. Your programmable thermostat does the rest — automatically.
        </div>
      </div>

      {/* ════════ SCENE 3 — Morning: Leaving for work ════════ */}
      <div style={{ ...CardBase, opacity: s3Op }}>
        <div
          style={{
            opacity: s3Head.opacity,
            transform: `translateY(${s3Head.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 30, color: "#8899BB", letterSpacing: "4px", marginBottom: 8 }}>
            ☀️ &nbsp; SUMMER MORNING
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#FFFFFF",
              fontFamily: "monospace",
              letterSpacing: "2px",
            }}
          >
            8:00 AM
          </div>
          <div style={{ fontSize: 32, color: "#7A8899", marginTop: 8 }}>
            You leave for work
          </div>
        </div>

        <div
          style={{
            opacity: s3Temp.opacity,
            transform: `translateY(${s3Temp.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 130,
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
              paddingInline: 28,
              paddingBlock: 10,
              backgroundColor: "#F59E0B22",
              border: "2px solid #F59E0B",
              borderRadius: 10,
              fontSize: 26,
              color: "#F59E0B",
              fontWeight: 700,
              letterSpacing: "3px",
              marginTop: 12,
            }}
          >
            AWAY MODE — AC OFF
          </div>
        </div>

        <div
          style={{
            opacity: s3Desc.opacity,
            transform: `translateY(${s3Desc.y}px)`,
            fontSize: 34,
            color: "#7A8899",
            textAlign: "center",
            lineHeight: 1.55,
          }}
        >
          No need to manually adjust. Your programmable thermostat sets itself to 78° the moment you walk out the door.
        </div>
      </div>

      {/* ════════ SCENE 4 — Pre-arrival ════════ */}
      <div style={{ ...CardBase, opacity: s4Op }}>
        <div
          style={{
            opacity: s4Head.opacity,
            transform: `translateY(${s4Head.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 30, color: "#8899BB", letterSpacing: "4px", marginBottom: 8 }}>
            🏡 &nbsp; PRE-ARRIVAL
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#FFFFFF",
              fontFamily: "monospace",
              letterSpacing: "2px",
            }}
          >
            5:00 PM
          </div>
          <div style={{ fontSize: 32, color: "#7A8899", marginTop: 8 }}>
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
              fontSize: 130,
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
              paddingInline: 28,
              paddingBlock: 10,
              backgroundColor: `${ECI_GREEN}22`,
              border: `2px solid ${ECI_GREEN}`,
              borderRadius: 10,
              fontSize: 26,
              color: ECI_GREEN,
              fontWeight: 700,
              letterSpacing: "3px",
              marginTop: 12,
            }}
          >
            HOME MODE — AC ON
          </div>
        </div>

        <div
          style={{
            opacity: s4Desc.opacity,
            transform: `translateY(${s4Desc.y}px)`,
            fontSize: 34,
            color: "#7A8899",
            textAlign: "center",
            lineHeight: 1.55,
          }}
        >
          AC fires up at 5 PM automatically. Walk in at 5:30 to a perfectly cool 72° — without lifting a finger.
        </div>
      </div>

      {/* ════════ SCENE 5 — Sleep ════════ */}
      <div style={{ ...CardBase, opacity: s5Op }}>
        <div
          style={{
            opacity: s5Head.opacity,
            transform: `translateY(${s5Head.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 30, color: "#8899BB", letterSpacing: "4px", marginBottom: 8 }}>
            🌙 &nbsp; SLEEP MODE
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#FFFFFF",
              fontFamily: "monospace",
              letterSpacing: "2px",
            }}
          >
            10:30 PM
          </div>
          <div style={{ fontSize: 32, color: "#7A8899", marginTop: 8 }}>
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
              fontSize: 130,
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
              paddingInline: 28,
              paddingBlock: 10,
              backgroundColor: "#818CF822",
              border: "2px solid #818CF8",
              borderRadius: 10,
              fontSize: 26,
              color: "#818CF8",
              fontWeight: 700,
              letterSpacing: "3px",
              marginTop: 12,
            }}
          >
            SLEEP MODE
          </div>
        </div>

        <div
          style={{
            opacity: s5Desc.opacity,
            transform: `translateY(${s5Desc.y}px)`,
            fontSize: 34,
            color: "#7A8899",
            textAlign: "center",
            lineHeight: 1.55,
          }}
        >
          Cools to 68° for better sleep — then warms back up before your alarm.
        </div>
      </div>

      {/* ════════ SCENE 6 — Savings ════════ */}
      <div style={{ ...sceneBase, opacity: s6Op, gap: 28 }}>
        <div
          style={{
            opacity: s6Title.opacity,
            transform: `translateY(${s6Title.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, color: "#8899BB", fontWeight: 700, letterSpacing: "2px" }}>
            ADD IT ALL UP AND SAVE UP TO
          </div>
          <div
            style={{
              fontSize: 172,
              fontWeight: 900,
              color: ECI_GREEN,
              lineHeight: 1,
              textShadow: `0 0 60px ${ECI_GREEN}66`,
            }}
          >
            {Math.round(pctCount)}%
          </div>
          <div style={{ fontSize: 40, color: "#FFFFFF", fontWeight: 700, letterSpacing: "4px" }}>
            ANNUALLY
          </div>
        </div>

        {/* Green fill bar */}
        <div style={{ width: 900 }}>
          <div
            style={{
              width: "100%",
              height: 30,
              backgroundColor: "#1A2030",
              borderRadius: 15,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${barFill * 100}%`,
                height: "100%",
                backgroundColor: ECI_GREEN,
                borderRadius: 15,
                boxShadow: `0 0 24px ${ECI_GREEN}88`,
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <div style={{ fontSize: 22, color: "#3A4A60" }}>0%</div>
            <div style={{ fontSize: 22, color: ECI_GREEN, fontWeight: 700 }}>
              10% annual savings
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ display: "flex", gap: 60, alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 24, color: "#667788" }}>Without</div>
            <div
              style={{
                width: 140,
                height: barFill * BAR_H,
                backgroundColor: "#404858",
                borderRadius: "8px 8px 0 0",
              }}
            />
            <div style={{ fontSize: 28, color: "#667788", fontWeight: 700 }}>$2,000/yr</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div
              style={{
                fontSize: 22,
                color: ECI_GREEN,
                fontWeight: 700,
                backgroundColor: `${ECI_GREEN}22`,
                border: `1.5px solid ${ECI_GREEN}`,
                borderRadius: 8,
                paddingInline: 14,
                paddingBlock: 6,
                opacity: barFill,
                letterSpacing: 1,
              }}
            >
              $200 SAVED
            </div>
            <div style={{ fontSize: 24, color: ECI_GREEN }}>With Programmable</div>
            <div
              style={{
                width: 140,
                height: barFill * BAR_H * 0.9,
                backgroundColor: ECI_GREEN,
                borderRadius: "8px 8px 0 0",
                boxShadow: `0 0 30px ${ECI_GREEN}55`,
              }}
            />
            <div style={{ fontSize: 28, color: ECI_GREEN, fontWeight: 700 }}>$1,800/yr</div>
          </div>
        </div>

        <div
          style={{
            opacity: s6Badge.opacity,
            transform: `translateY(${s6Badge.y}px)`,
            paddingInline: 40,
            paddingBlock: 20,
            backgroundColor: `${ECI_GREEN}18`,
            border: `2px solid ${ECI_GREEN}`,
            borderRadius: 18,
            fontSize: 30,
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
            fontSize: 28,
            color: "#55667A",
            textAlign: "center",
          }}
        >
          Better than adjusting by hand. Every single day.
        </div>
      </div>

      {/* ════════ SCENE 7 — CTA ════════ */}
      <div style={{ ...sceneBase, opacity: s7Op, gap: 40 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${ECI_GREEN}1A 0%, transparent 70%)`,
          }}
        />
        <div style={{ opacity: s7LogoOp, transform: `scale(${s7LogoScale})` }}>
          <Img src={staticFile("eci_logo.png")} style={{ width: 340, height: "auto" }} />
        </div>
        <div
          style={{
            opacity: s7Cta.opacity,
            transform: `translateY(${s7Cta.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 76, fontWeight: 900, color: "#FFF", lineHeight: 1.1 }}>
            CALL US TODAY
          </div>
          <div
            style={{
              fontSize: 46,
              color: ECI_GREEN,
              fontWeight: 700,
              letterSpacing: "2px",
              marginTop: 10,
            }}
          >
            TO START SAVING!
          </div>
        </div>
        <div style={{ opacity: s7Phone.opacity, transform: `translateY(${s7Phone.y}px)` }}>
          <div
            style={{
              paddingInline: 52,
              paddingBlock: 30,
              backgroundColor: ECI_GREEN,
              borderRadius: 26,
              fontSize: 68,
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
            opacity: s7Sub.opacity,
            transform: `translateY(${s7Sub.y}px)`,
            fontSize: 32,
            color: ECI_ORANGE,
            fontWeight: 700,
            letterSpacing: "1px",
            textAlign: "center",
          }}
        >
          Ask about programmable thermostat installation
        </div>
      </div>
    </div>
  );
};
