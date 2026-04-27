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
const BG = "#080D17";
const SCREEN_BG = "#04090F";

// Scene opacity: fade in at start, fade out at end
const sceneOp = (frame: number, s: number, e: number, fade = 14): number =>
  interpolate(frame, [s, s + fade, e - fade, e], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Slide-up entrance with spring
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

// Digital thermostat display
type ThermostatProps = {
  temp: number;
  mode: string;
  statusColor: string;
  statusLabel: string;
  frame: number;
};

const ThermostatDisplay: React.FC<ThermostatProps> = ({
  temp,
  mode,
  statusColor,
  statusLabel,
  frame,
}) => {
  const pulse = Math.sin(frame * 0.14) * 0.35 + 0.65;

  return (
    <div
      style={{
        width: 680,
        backgroundColor: "#181C27",
        borderRadius: 44,
        boxShadow: "0 28px 70px rgba(0,0,0,0.75), 0 0 0 1.5px #252935",
        padding: "26px 26px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Screen */}
      <div
        style={{
          backgroundColor: SCREEN_BG,
          borderRadius: 24,
          padding: "30px 20px 22px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          border: "1px solid #0D1525",
          overflow: "hidden",
        }}
      >
        {/* Screen inner glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 60% 50% at 50% 30%, #0C1E38 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Mode label */}
        <div
          style={{
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: 5,
            color: ECI_GREEN,
            fontFamily: "monospace",
            marginBottom: 14,
          }}
        >
          {mode}
        </div>

        {/* Temperature */}
        <div
          style={{
            fontSize: 136,
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 1,
            fontFamily: "'Arial Black', Arial, sans-serif",
            textShadow: `0 0 60px ${ECI_GREEN}44`,
          }}
        >
          {temp}°
        </div>

        <div
          style={{
            fontSize: 22,
            color: "#4A5A78",
            letterSpacing: 3,
            fontFamily: "'Arial', sans-serif",
            marginTop: 8,
          }}
        >
          FAHRENHEIT
        </div>

        {/* Status indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 18,
            opacity: pulse,
          }}
        >
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              backgroundColor: statusColor,
              boxShadow: `0 0 8px ${statusColor}`,
            }}
          />
          <div
            style={{
              fontSize: 16,
              color: statusColor,
              fontFamily: "monospace",
              letterSpacing: 3,
              fontWeight: 700,
            }}
          >
            {statusLabel}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: "50%",
            backgroundColor: "#22252F",
            border: "2px solid #32363F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#7A8899",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          −
        </div>
        <div
          style={{
            paddingInline: 30,
            height: 62,
            borderRadius: 31,
            backgroundColor: ECI_GREEN,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 3,
            fontFamily: "monospace",
          }}
        >
          SCHEDULE
        </div>
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: "50%",
            backgroundColor: "#22252F",
            border: "2px solid #32363F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#7A8899",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          +
        </div>
      </div>
    </div>
  );
};

// 24-hour schedule zones
const SCHEDULE_ZONES = [
  { label: "SLEEP", temp: "65°", pct: 0.25, color: "#1A2E5A", bright: "#2244AA" },
  { label: "HOME",  temp: "70°", pct: 0.09, color: "#1A4228", bright: "#2A7040" },
  { label: "AWAY",  temp: "62°", pct: 0.41, color: "#3D2610", bright: "#7A4A18" },
  { label: "HOME",  temp: "70°", pct: 0.17, color: "#1A4228", bright: "#2A7040" },
  { label: "SLEEP", temp: "65°", pct: 0.08, color: "#1A2E5A", bright: "#2244AA" },
];

export const ECIThermostat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ─── Scene opacities ──────────────────────────────────────────────────────
  const s1Op = sceneOp(frame, 0, 82);
  const s2Op = sceneOp(frame, 68, 218);
  const s2aOp = sceneOp(frame, 68, 150, 12);
  const s2bOp = sceneOp(frame, 134, 218, 12);
  const s3Op = sceneOp(frame, 200, 318);
  const s4Op = sceneOp(frame, 298, 390);
  const s5Op = sceneOp(frame, 372, 432);

  // ─── Scene 1: Intro ───────────────────────────────────────────────────────
  const logoSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16, stiffness: 210 },
    durationInFrames: 30,
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.55, 1.0]);
  const logoOp = interpolate(logoSpring, [0, 0.25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s1Headline = useSlideUp(frame, fps, 26);
  const s1Sub = useSlideUp(frame, fps, 42);

  // ─── Scene 2A: Manual thermostat ──────────────────────────────────────────
  const s2aLabel = useSlideUp(frame, fps, 74);
  const s2aDesc = useSlideUp(frame, fps, 88);

  // ─── Scene 2B: Smart thermostat ───────────────────────────────────────────
  const s2bLabel = useSlideUp(frame, fps, 140);
  const s2bDesc = useSlideUp(frame, fps, 155);

  // Animate set-point dropping from 72° → 65° (AWAY mode kicks in)
  const smartTemp = Math.round(
    interpolate(frame, [148, 174], [72, 65], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // ─── Scene 3: Schedule ────────────────────────────────────────────────────
  const SCHED_START = 216;
  const barWipe = interpolate(frame, [SCHED_START, SCHED_START + 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s3Title = useSlideUp(frame, fps, 204);
  const s3Sub = useSlideUp(frame, fps, SCHED_START + 60);
  const zoneOps = SCHEDULE_ZONES.map((_, i) =>
    interpolate(frame, [SCHED_START + 42 + i * 12, SCHED_START + 58 + i * 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // ─── Scene 4: Savings ─────────────────────────────────────────────────────
  const SAV_START = 314;
  const s4Title = useSlideUp(frame, fps, 302);

  // Bar fill: 0 → 1 over 60 frames
  const barFill = interpolate(frame, [SAV_START, SAV_START + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Counter: 0 → 10 matching bar fill
  const pctCount = interpolate(frame, [SAV_START, SAV_START + 62], [0, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const s4Savings = useSlideUp(frame, fps, SAV_START + 58);
  const s4Tagline = useSlideUp(frame, fps, SAV_START + 72);

  // ─── Scene 5: CTA ─────────────────────────────────────────────────────────
  const s5LogoSpring = spring({
    frame: frame - 378,
    fps,
    config: { damping: 15, stiffness: 210 },
    durationInFrames: 28,
  });
  const s5LogoScale = interpolate(s5LogoSpring, [0, 1], [0.5, 1.0]);
  const s5LogoOp = interpolate(s5LogoSpring, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s5Cta = useSlideUp(frame, fps, 396);
  const s5Phone = useSlideUp(frame, fps, 410);

  // ─── Shared layout ────────────────────────────────────────────────────────
  const BAR_H = 480;
  const SCHED_W = 940;

  const sceneBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
      {/* Global background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 50% at 50% 50%, #0C1726 0%, ${BG} 70%)`,
        }}
      />

      {/* ═══════════════ SCENE 1 — ECI Intro ═══════════════ */}
      <div style={{ ...sceneBase, opacity: s1Op, gap: 40 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 65% 45% at 50% 48%, ${ECI_GREEN}20 0%, transparent 68%)`,
          }}
        />

        {/* Logo */}
        <div
          style={{
            opacity: logoOp,
            transform: `scale(${logoScale})`,
          }}
        >
          <Img
            src={staticFile("eci_logo.png")}
            style={{ width: 320, height: "auto" }}
          />
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: s1Headline.opacity,
            transform: `translateY(${s1Headline.y}px)`,
            textAlign: "center",
            paddingInline: 70,
          }}
        >
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.1,
              letterSpacing: "0px",
            }}
          >
            PROGRAMMABLE
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              color: ECI_GREEN,
              lineHeight: 1.1,
            }}
          >
            THERMOSTATS
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: s1Sub.opacity,
            transform: `translateY(${s1Sub.y}px)`,
            fontSize: 30,
            color: "#8899BB",
            fontWeight: 700,
            letterSpacing: "3px",
            textAlign: "center",
          }}
        >
          SMART. EFFICIENT. COMFORTABLE.
        </div>
      </div>

      {/* ═══════════════ SCENE 2A — Manual Thermostat ═══════════════ */}
      <div
        style={{
          ...sceneBase,
          opacity: s2Op * s2aOp,
          gap: 28,
        }}
      >
        <div
          style={{
            opacity: s2aLabel.opacity,
            transform: `translateY(${s2aLabel.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#EE5555",
              fontWeight: 700,
              letterSpacing: 3,
            }}
          >
            ✕ WITHOUT SMART SCHEDULING
          </div>
        </div>

        <ThermostatDisplay
          temp={72}
          mode="MANUAL"
          statusColor="#888888"
          statusLabel="NO SCHEDULE"
          frame={frame}
        />

        <div
          style={{
            opacity: s2aDesc.opacity,
            transform: `translateY(${s2aDesc.y}px)`,
            textAlign: "center",
            paddingInline: 80,
          }}
        >
          <div style={{ fontSize: 28, color: "#7A8899", lineHeight: 1.55 }}>
            Stays at 72° whether you're home,{"\n"}away, or sleeping.{"\n"}Wasted energy.
          </div>
        </div>
      </div>

      {/* ═══════════════ SCENE 2B — Smart Thermostat ═══════════════ */}
      <div
        style={{
          ...sceneBase,
          opacity: s2Op * s2bOp,
          gap: 28,
        }}
      >
        <div
          style={{
            opacity: s2bLabel.opacity,
            transform: `translateY(${s2bLabel.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: ECI_GREEN,
              fontWeight: 700,
              letterSpacing: 3,
            }}
          >
            ✓ WITH PROGRAMMABLE THERMOSTAT
          </div>
        </div>

        <ThermostatDisplay
          temp={smartTemp}
          mode="PROGRAMMED"
          statusColor={ECI_ORANGE}
          statusLabel="AWAY MODE"
          frame={frame}
        />

        <div
          style={{
            opacity: s2bDesc.opacity,
            transform: `translateY(${s2bDesc.y}px)`,
            textAlign: "center",
            paddingInline: 80,
          }}
        >
          <div style={{ fontSize: 28, color: "#7A8899", lineHeight: 1.55 }}>
            Drops to 65° automatically{"\n"}when you leave or go to sleep.
          </div>
        </div>
      </div>

      {/* ═══════════════ SCENE 3 — Schedule ═══════════════ */}
      <div style={{ ...sceneBase, opacity: s3Op, gap: 44 }}>
        {/* Title */}
        <div
          style={{
            opacity: s3Title.opacity,
            transform: `translateY(${s3Title.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 46, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1 }}>
            YOUR SCHEDULE,
          </div>
          <div style={{ fontSize: 46, fontWeight: 900, color: ECI_GREEN, lineHeight: 1.1 }}>
            AUTOMATICALLY
          </div>
        </div>

        {/* Schedule bar */}
        <div style={{ width: SCHED_W }}>
          {/* Zone temp + label rows */}
          <div style={{ display: "flex", width: SCHED_W, marginBottom: 14 }}>
            {SCHEDULE_ZONES.map((zone, i) => (
              <div
                key={i}
                style={{
                  width: zone.pct * SCHED_W,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  opacity: zoneOps[i],
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: "#FFFFFF",
                  }}
                >
                  {zone.temp}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#6A7A99",
                    letterSpacing: 1,
                    fontWeight: 700,
                  }}
                >
                  {zone.label}
                </div>
              </div>
            ))}
          </div>

          {/* Colored timeline bar (wipes in) */}
          <div
            style={{
              width: SCHED_W * barWipe,
              height: 88,
              borderRadius: 14,
              overflow: "hidden",
              display: "flex",
              boxShadow: "0 6px 30px rgba(0,0,0,0.5)",
            }}
          >
            {SCHEDULE_ZONES.map((zone, i) => (
              <div
                key={i}
                style={{
                  flex: zone.pct,
                  background: `linear-gradient(to bottom, ${zone.bright}, ${zone.color})`,
                  borderRight:
                    i < SCHEDULE_ZONES.length - 1
                      ? "2px solid #080D17"
                      : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#FFFFFF99",
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  {zone.label}
                </div>
              </div>
            ))}
          </div>

          {/* Time labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 12,
              opacity: zoneOps[3],
            }}
          >
            {["12am", "6am", "12pm", "6pm", "10pm", "12am"].map((t) => (
              <div key={t} style={{ fontSize: 18, color: "#445566" }}>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: s3Sub.opacity,
            transform: `translateY(${s3Sub.y}px)`,
            textAlign: "center",
            paddingInline: 80,
          }}
        >
          <div style={{ fontSize: 28, color: "#7A8899", lineHeight: 1.55 }}>
            Set it once. Save energy every single day.
          </div>
        </div>
      </div>

      {/* ═══════════════ SCENE 4 — Savings ═══════════════ */}
      <div style={{ ...sceneBase, opacity: s4Op, gap: 36 }}>
        {/* Title */}
        <div
          style={{
            opacity: s4Title.opacity,
            transform: `translateY(${s4Title.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 36, color: "#8899BB", fontWeight: 700, letterSpacing: "2px" }}>
            SAVE UP TO
          </div>
        </div>

        {/* Big percentage counter */}
        <div style={{ textAlign: "center", lineHeight: 1 }}>
          <span
            style={{
              fontSize: 160,
              fontWeight: 900,
              color: ECI_GREEN,
              textShadow: `0 0 60px ${ECI_GREEN}66`,
            }}
          >
            {Math.round(pctCount)}
          </span>
          <span
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: ECI_GREEN,
            }}
          >
            %
          </span>
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#FFFFFF",
            fontWeight: 700,
            letterSpacing: "4px",
            textAlign: "center",
          }}
        >
          ANNUALLY
        </div>

        {/* Savings progress bar */}
        <div style={{ width: 840 }}>
          <div
            style={{
              width: "100%",
              height: 24,
              backgroundColor: "#1A2030",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${barFill * 100}%`,
                height: "100%",
                backgroundColor: ECI_GREEN,
                borderRadius: 12,
                boxShadow: `0 0 20px ${ECI_GREEN}88`,
                transition: "none",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <div style={{ fontSize: 18, color: "#445566" }}>0%</div>
            <div
              style={{
                fontSize: 18,
                color: ECI_GREEN,
                fontWeight: 700,
              }}
            >
              10% savings goal
            </div>
          </div>
        </div>

        {/* Bar chart — Manual vs Programmable */}
        <div style={{ display: "flex", gap: 56, alignItems: "flex-end" }}>
          {/* Manual */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 18, color: "#667788" }}>Manual</div>
            <div
              style={{
                width: 120,
                height: barFill * BAR_H,
                backgroundColor: "#404858",
                borderRadius: "8px 8px 0 0",
              }}
            />
            <div style={{ fontSize: 20, color: "#667788", fontWeight: 700 }}>
              $2,000
            </div>
          </div>

          {/* Programmable */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              position: "relative",
            }}
          >
            {/* Savings badge above bar */}
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
            <div style={{ fontSize: 18, color: ECI_GREEN }}>Programmable</div>
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
              $1,800
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: s4Savings.opacity,
            transform: `translateY(${s4Savings.y}px)`,
          }}
        >
          <div
            style={{
              paddingInline: 36,
              paddingBlock: 18,
              backgroundColor: `${ECI_GREEN}18`,
              border: `2px solid ${ECI_GREEN}`,
              borderRadius: 18,
              fontSize: 24,
              color: ECI_GREEN,
              fontWeight: 700,
              letterSpacing: "1px",
              textAlign: "center",
            }}
          >
            On heating & cooling costs
          </div>
        </div>

        <div
          style={{
            opacity: s4Tagline.opacity,
            transform: `translateY(${s4Tagline.y}px)`,
            fontSize: 22,
            color: "#667788",
            textAlign: "center",
          }}
        >
          Better than adjusting by hand. Every time.
        </div>
      </div>

      {/* ═══════════════ SCENE 5 — CTA ═══════════════ */}
      <div style={{ ...sceneBase, opacity: s5Op, gap: 36 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${ECI_GREEN}1A 0%, transparent 70%)`,
          }}
        />

        <div
          style={{
            opacity: s5LogoOp,
            transform: `scale(${s5LogoScale})`,
          }}
        >
          <Img
            src={staticFile("eci_logo.png")}
            style={{ width: 280, height: "auto" }}
          />
        </div>

        <div
          style={{
            opacity: s5Cta.opacity,
            transform: `translateY(${s5Cta.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1 }}>
            CALL US TODAY
          </div>
          <div
            style={{
              fontSize: 36,
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
            opacity: s5Phone.opacity,
            transform: `translateY(${s5Phone.y}px)`,
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
      </div>
    </div>
  );
};
