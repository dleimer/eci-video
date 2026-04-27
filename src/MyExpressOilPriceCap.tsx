import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";

const FLAME_GREEN = "#22C55E";
const BRAND_ORANGE = "#F97316";
const ICE_BLUE = "#93C5FD";
const ICE_DARK = "#0B1628";
const BG = "#0A0D14";

const sceneOp = (frame: number, s: number, e: number, fade = 16): number =>
  interpolate(frame, [s, s + fade, e - fade, e], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const useSlideUp = (frame: number, fps: number, delay: number, dist = 44) => {
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
    y: interpolate(s, [0, 1], [dist, 0]),
  };
};

// Pre-defined snowflakes for scene 1
const FLAKES: { x: number; period: number; offset: number; size: number; opacity: number }[] = [
  { x: 60,   period: 160, offset: 0,   size: 28, opacity: 0.6 },
  { x: 180,  period: 200, offset: 45,  size: 20, opacity: 0.4 },
  { x: 320,  period: 140, offset: 20,  size: 34, opacity: 0.55 },
  { x: 450,  period: 180, offset: 80,  size: 22, opacity: 0.45 },
  { x: 580,  period: 155, offset: 35,  size: 30, opacity: 0.6 },
  { x: 700,  period: 190, offset: 60,  size: 18, opacity: 0.4 },
  { x: 820,  period: 145, offset: 10,  size: 32, opacity: 0.5 },
  { x: 940,  period: 175, offset: 90,  size: 24, opacity: 0.55 },
  { x: 130,  period: 165, offset: 120, size: 20, opacity: 0.35 },
  { x: 760,  period: 210, offset: 55,  size: 16, opacity: 0.4 },
];

const BENEFITS = [
  {
    icon: "🔒",
    title: "PRICE CAP",
    desc: "We lock in a capped price for the year based on market rates",
    color: FLAME_GREEN,
  },
  {
    icon: "💳",
    title: "BUDGET PAYMENTS",
    desc: "Predictable monthly payments based on your past usage",
    color: ICE_BLUE,
  },
  {
    icon: "🛡️",
    title: "PRICE PROTECTION",
    desc: "A small monthly fee guarantees you never pay more per gallon",
    color: BRAND_ORANGE,
  },
  {
    icon: "📉",
    title: "PRICE FLEXIBILITY",
    desc: "If market prices drop, your price drops too",
    color: "#A78BFA",
  },
];

export const MyExpressOilPriceCap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── Snowflakes (scene 1) ──
  const flakeData = FLAKES.map(({ x, period, offset, size, opacity }) => {
    const t = (frame + offset) % period;
    const y = -40 + (t / period) * (height + 80);
    const alpha =
      t < 20 ? (t / 20) * opacity : t > period - 20 ? ((period - t) / 20) * opacity : opacity;
    return { x, y, size, alpha };
  });

  // ── Scene 1: Cold Winter (0–110) ──────────────────────────────────────
  const s1Op = sceneOp(frame, 0, 110);
  const s1Line1 = useSlideUp(frame, fps, 10);
  const s1Line2 = useSlideUp(frame, fps, 26);
  const s1Thermo = useSlideUp(frame, fps, 42);

  // Thermometer mercury drops
  const thermoFill = interpolate(frame, [50, 90], [0.72, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const thermoTemp = Math.round(interpolate(frame, [50, 90], [72, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  // ── Scene 2: Oil Prices Surged (94–250) ──────────────────────────────
  const s2Op = sceneOp(frame, 94, 250);
  const s2Line1 = useSlideUp(frame, fps, 108);
  const s2Line2 = useSlideUp(frame, fps, 124);
  const s2Arrow = useSlideUp(frame, fps, 140, 60);
  const s2Price = useSlideUp(frame, fps, 155);

  // Price counter animating up
  const oilPrice = interpolate(frame, [160, 220], [2.89, 5.49], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bar chart bars growing
  const bar1H = interpolate(frame, [148, 188], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bar2H = interpolate(frame, [158, 198], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bar3H = interpolate(frame, [168, 208], [0, 260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bar4H = interpolate(frame, [178, 218], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Scene 3: The Turn (234–370) ──────────────────────────────────────
  const s3Op = sceneOp(frame, 234, 370);
  const s3Line1 = useSlideUp(frame, fps, 248);
  const s3Line2 = useSlideUp(frame, fps, 266);
  const s3Line3 = useSlideUp(frame, fps, 284);

  // ── Scene 4: Program Reveal (354–510) ────────────────────────────────
  const s4Op = sceneOp(frame, 354, 510);
  const logoSpring = spring({
    frame: frame - 360,
    fps,
    config: { damping: 13, stiffness: 240, mass: 0.85 },
    durationInFrames: 34,
  });
  const s4LogoY = interpolate(logoSpring, [0, 1], [-250, 0]);
  const s4LogoScale = interpolate(logoSpring, [0, 1], [1.25, 1.0]);
  const s4LogoOp = interpolate(frame, [360, 376], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s4Title = useSlideUp(frame, fps, 392);
  const s4Sub = useSlideUp(frame, fps, 410);

  // Glow pulse on logo
  const glowPulse = Math.sin(frame * 0.1) * 12 + 28;

  // ── Scene 5: Benefits (494–680) ──────────────────────────────────────
  const s5Op = sceneOp(frame, 494, 680);
  const s5Header = useSlideUp(frame, fps, 506);
  const benefitSlides = BENEFITS.map((_, i) => useSlideUp(frame, fps, 520 + i * 22));

  // ── Scene 6: CTA (664–750) ────────────────────────────────────────────
  const s6Op = sceneOp(frame, 664, 780);
  const s6LogoSpring = spring({
    frame: frame - 670,
    fps,
    config: { damping: 15, stiffness: 220 },
    durationInFrames: 26,
  });
  const s6LogoScale = interpolate(s6LogoSpring, [0, 1], [0.5, 1.0]);
  const s6LogoOp = interpolate(s6LogoSpring, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s6Line1 = useSlideUp(frame, fps, 686);
  const s6Line2 = useSlideUp(frame, fps, 700);
  const s6Phone = useSlideUp(frame, fps, 714);

  const sceneBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingInline: 64,
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
      {/* ── Shared bg glow ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 90% 60% at 50% 50%, #0C1828 0%, ${BG} 70%)`,
        }}
      />

      {/* ════════ SCENE 1 — Cold Winter ════════ */}
      <div style={{ ...sceneBase, opacity: s1Op, gap: 36 }}>
        {/* Ice blue bg wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 100% 80% at 50% 40%, ${ICE_DARK} 0%, ${BG} 75%)`,
          }}
        />

        {/* Snowflakes */}
        {flakeData.map((f, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: f.x,
              top: f.y,
              fontSize: f.size,
              color: ICE_BLUE,
              opacity: f.alpha,
              pointerEvents: "none",
              textShadow: `0 0 14px ${ICE_BLUE}`,
            }}
          >
            ❄
          </div>
        ))}

        <div
          style={{
            opacity: s1Line1.opacity,
            transform: `translateY(${s1Line1.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 40,
              color: ICE_BLUE,
              fontWeight: 700,
              letterSpacing: "6px",
            }}
          >
            THIS PAST WINTER...
          </div>
        </div>

        <div
          style={{
            opacity: s1Line2.opacity,
            transform: `translateY(${s1Line2.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.0,
            }}
          >
            WAS
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              color: ICE_BLUE,
              lineHeight: 1.0,
              textShadow: `0 0 60px ${ICE_BLUE}66`,
            }}
          >
            BRUTAL.
          </div>
        </div>

        {/* Inline thermometer */}
        <div
          style={{
            opacity: s1Thermo.opacity,
            transform: `translateY(${s1Thermo.y}px)`,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Thermometer graphic */}
          <div style={{ position: "relative", width: 36, height: 160 }}>
            {/* Tube */}
            <div
              style={{
                position: "absolute",
                left: 10,
                top: 0,
                width: 16,
                height: 120,
                borderRadius: "8px 8px 0 0",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: `2px solid ${ICE_BLUE}66`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${thermoFill * 100}%`,
                  backgroundColor: ICE_BLUE,
                  boxShadow: `0 0 10px ${ICE_BLUE}`,
                }}
              />
            </div>
            {/* Bulb */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 4,
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: ICE_BLUE,
                boxShadow: `0 0 16px ${ICE_BLUE}`,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              color: ICE_BLUE,
              textShadow: `0 0 40px ${ICE_BLUE}88`,
            }}
          >
            {thermoTemp}°F
          </div>
        </div>
      </div>

      {/* ════════ SCENE 2 — Oil Prices Surged ════════ */}
      <div style={{ ...sceneBase, opacity: s2Op, gap: 28 }}>
        {/* Warm red/orange wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 90% 70% at 50% 50%, #1C0A00 0%, ${BG} 70%)`,
          }}
        />

        <div
          style={{
            opacity: s2Line1.opacity,
            transform: `translateY(${s2Line1.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 38, color: "#9CA3AF", fontWeight: 700, letterSpacing: "4px" }}>
            AND OIL PRICES...
          </div>
        </div>

        <div
          style={{
            opacity: s2Line2.opacity,
            transform: `translateY(${s2Line2.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              color: "#EF4444",
              lineHeight: 1.0,
              textShadow: "0 0 60px #EF444466",
            }}
          >
            SURGED.
          </div>
        </div>

        {/* Bar chart */}
        <div
          style={{
            opacity: s2Arrow.opacity,
            transform: `translateY(${s2Arrow.y}px)`,
            display: "flex",
            alignItems: "flex-end",
            gap: 18,
            height: 380,
          }}
        >
          {[
            { label: "2021", height: bar1H, color: "#6B7280" },
            { label: "2022", height: bar2H, color: "#F97316" },
            { label: "2023", height: bar3H, color: "#EF4444" },
            { label: "2024–25", height: bar4H, color: "#DC2626" },
          ].map(({ label, height: h, color }) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  width: 140,
                  height: h,
                  backgroundColor: color,
                  borderRadius: "8px 8px 0 0",
                  boxShadow: `0 0 20px ${color}55`,
                  transition: "none",
                }}
              />
              <div style={{ fontSize: 20, color: "#9CA3AF", fontWeight: 700 }}>{label}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            opacity: s2Price.opacity,
            transform: `translateY(${s2Price.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 36, color: "#9CA3AF", fontWeight: 700 }}>
            Price per gallon reached
          </div>
          <div
            style={{
              fontSize: 108,
              fontWeight: 900,
              color: "#EF4444",
              lineHeight: 1.0,
              textShadow: "0 0 60px #EF444477",
            }}
          >
            ${oilPrice.toFixed(2)}
          </div>
        </div>
      </div>

      {/* ════════ SCENE 3 — The Turn ════════ */}
      <div style={{ ...sceneBase, opacity: s3Op, gap: 32 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 80% 70% at 50% 50%, #0D1F10 0%, ${BG} 70%)`,
          }}
        />

        <div
          style={{
            opacity: s3Line1.opacity,
            transform: `translateY(${s3Line1.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, color: "#9CA3AF", fontWeight: 700, letterSpacing: "3px" }}>
            YOUR HEATING BILL
          </div>
        </div>

        <div
          style={{
            opacity: s3Line2.opacity,
            transform: `translateY(${s3Line2.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 900,
              color: FLAME_GREEN,
              lineHeight: 1.05,
              textShadow: `0 0 60px ${FLAME_GREEN}55`,
            }}
          >
            DIDN'T HAVE
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 900,
              color: FLAME_GREEN,
              lineHeight: 1.05,
              textShadow: `0 0 60px ${FLAME_GREEN}55`,
            }}
          >
            TO HURT.
          </div>
        </div>

        <div
          style={{
            opacity: s3Line3.opacity,
            transform: `translateY(${s3Line3.y}px)`,
            textAlign: "center",
            paddingInline: 20,
          }}
        >
          <div
            style={{
              fontSize: 36,
              color: "#9CA3AF",
              lineHeight: 1.5,
              fontWeight: 700,
            }}
          >
            There's a smarter way to budget for your home heating.
          </div>
        </div>
      </div>

      {/* ════════ SCENE 4 — Program Reveal ════════ */}
      <div style={{ ...sceneBase, opacity: s4Op, gap: 30 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 80% 60% at 50% 42%, #0D1C0A 0%, ${BG} 70%)`,
          }}
        />

        <div
          style={{
            opacity: s4LogoOp,
            transform: `translateY(${s4LogoY}px) scale(${s4LogoScale})`,
            transformOrigin: "center top",
            filter: `drop-shadow(0 0 ${glowPulse}px ${FLAME_GREEN}99)`,
          }}
        >
          <Img
            src={staticFile("myexpressoil_logo.png")}
            style={{ width: 280, height: "auto" }}
          />
        </div>

        <div
          style={{
            opacity: s4Title.opacity,
            transform: `translateY(${s4Title.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 26,
              color: BRAND_ORANGE,
              fontWeight: 700,
              letterSpacing: "5px",
              marginBottom: 10,
            }}
          >
            INTRODUCING THE
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.1,
            }}
          >
            PRICE CAP
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: FLAME_GREEN,
              lineHeight: 1.1,
              textShadow: `0 0 50px ${FLAME_GREEN}66`,
            }}
          >
            BUDGET PROGRAM
          </div>
        </div>

        <div
          style={{
            opacity: s4Sub.opacity,
            transform: `translateY(${s4Sub.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              paddingInline: 32,
              paddingBlock: 14,
              border: `2px solid ${FLAME_GREEN}55`,
              borderRadius: 12,
              backgroundColor: `${FLAME_GREEN}0F`,
              fontSize: 30,
              color: "#D1FAE5",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            Budget-friendly · Auto delivery · Price protected
          </div>
        </div>
      </div>

      {/* ════════ SCENE 5 — 4 Benefits ════════ */}
      <div style={{ ...sceneBase, opacity: s5Op, gap: 22 }}>
        <div
          style={{
            opacity: s5Header.opacity,
            transform: `translateY(${s5Header.y}px)`,
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          <div
            style={{
              fontSize: 34,
              color: BRAND_ORANGE,
              fontWeight: 700,
              letterSpacing: "4px",
            }}
          >
            YOU GET THE BEST OF BOTH:
          </div>
        </div>

        {BENEFITS.map((b, i) => (
          <div
            key={b.title}
            style={{
              opacity: benefitSlides[i].opacity,
              transform: `translateY(${benefitSlides[i].y}px)`,
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 20,
              paddingInline: 28,
              paddingBlock: 18,
              backgroundColor: `${b.color}12`,
              border: `1.5px solid ${b.color}44`,
              borderRadius: 16,
              borderLeft: `5px solid ${b.color}`,
            }}
          >
            <div style={{ fontSize: 40, flexShrink: 0 }}>{b.icon}</div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: b.color,
                  letterSpacing: "1px",
                  marginBottom: 4,
                }}
              >
                {b.title}
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: "#9CA3AF",
                  fontWeight: 700,
                  lineHeight: 1.35,
                }}
              >
                {b.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ════════ SCENE 6 — CTA ════════ */}
      <div style={{ ...sceneBase, opacity: s6Op, gap: 36 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 90% 70% at 50% 50%, #0E1C0A 0%, ${BG} 70%)`,
          }}
        />

        <div
          style={{
            opacity: s6LogoOp,
            transform: `scale(${s6LogoScale})`,
            filter: `drop-shadow(0 0 28px ${FLAME_GREEN}88)`,
          }}
        >
          <Img
            src={staticFile("myexpressoil_logo.png")}
            style={{ width: 240, height: "auto" }}
          />
        </div>

        <div
          style={{
            opacity: s6Line1.opacity,
            transform: `translateY(${s6Line1.y}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1 }}>
            DON'T WAIT FOR
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: BRAND_ORANGE,
              lineHeight: 1.1,
              textShadow: `0 0 50px ${BRAND_ORANGE}55`,
            }}
          >
            NEXT WINTER.
          </div>
        </div>

        <div
          style={{
            opacity: s6Line2.opacity,
            transform: `translateY(${s6Line2.y}px)`,
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              paddingInline: 40,
              paddingBlock: 22,
              backgroundColor: FLAME_GREEN,
              borderRadius: 20,
              fontSize: 46,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "1px",
              boxShadow: `0 10px 50px ${FLAME_GREEN}66`,
              marginBottom: 20,
            }}
          >
            SIGN UP TODAY
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: BRAND_ORANGE,
              letterSpacing: "2px",
            }}
          >
            myexpressoil.com
          </div>
        </div>

        <div
          style={{
            opacity: s6Phone.opacity,
            transform: `translateY(${s6Phone.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 54,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "2px",
              textShadow: `0 0 40px ${FLAME_GREEN}66`,
            }}
          >
            215-245-3200
          </div>
        </div>
      </div>
    </div>
  );
};
