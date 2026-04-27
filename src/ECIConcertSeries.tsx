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
const BG = "#02050E";
const PLATINUM = "#D8D2C8";

const sceneOp = (frame: number, s: number, e: number, fade = 16): number =>
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
    y: interpolate(s, [0, 1], [44, 0]),
  };
};

// Stars pre-defined for twinkling background
const STARS: { x: number; y: number; r: number; phase: number }[] = [
  { x: 88, y: 140, r: 2.2, phase: 0.0 },
  { x: 210, y: 60, r: 1.6, phase: 1.1 },
  { x: 380, y: 220, r: 2.8, phase: 2.3 },
  { x: 540, y: 90, r: 1.4, phase: 0.7 },
  { x: 700, y: 175, r: 2.0, phase: 3.1 },
  { x: 830, y: 50, r: 1.8, phase: 1.8 },
  { x: 960, y: 130, r: 2.4, phase: 0.4 },
  { x: 140, y: 310, r: 1.2, phase: 2.9 },
  { x: 460, y: 280, r: 2.0, phase: 1.5 },
  { x: 620, y: 360, r: 1.6, phase: 0.2 },
  { x: 780, y: 300, r: 2.6, phase: 3.4 },
  { x: 300, y: 420, r: 1.4, phase: 2.1 },
  { x: 900, y: 400, r: 1.8, phase: 0.9 },
  { x: 50, y: 480, r: 2.2, phase: 1.6 },
  { x: 490, y: 460, r: 1.0, phase: 2.7 },
  { x: 750, y: 480, r: 2.4, phase: 0.5 },
  { x: 180, y: 550, r: 1.6, phase: 3.0 },
  { x: 1010, y: 260, r: 2.0, phase: 1.3 },
  { x: 660, y: 200, r: 1.4, phase: 2.5 },
  { x: 320, y: 160, r: 2.6, phase: 0.8 },
];

// Floating music notes config
const NOTES: { symbol: string; x: number; period: number; offset: number; size: number }[] = [
  { symbol: "♪", x: 80,   period: 220, offset: 0,   size: 38 },
  { symbol: "♫", x: 240,  period: 260, offset: 80,  size: 52 },
  { symbol: "♩", x: 420,  period: 200, offset: 40,  size: 34 },
  { symbol: "♬", x: 600,  period: 240, offset: 140, size: 48 },
  { symbol: "♪", x: 760,  period: 210, offset: 60,  size: 40 },
  { symbol: "♫", x: 940,  period: 250, offset: 110, size: 44 },
  { symbol: "♩", x: 160,  period: 230, offset: 170, size: 36 },
  { symbol: "♬", x: 860,  period: 215, offset: 30,  size: 50 },
];

export const ECIConcertSeries: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Floating note helper
  const noteData = NOTES.map(({ symbol, x, period, offset, size }) => {
    const t = (frame + offset) % period;
    const y = height * 0.72 - (t / period) * 520;
    const opacity =
      t < 28 ? (t / 28) * 0.55 : t > period - 28 ? ((period - t) / 28) * 0.55 : 0.55;
    return { symbol, x, y, opacity, size };
  });

  // Star twinkle
  const starOpacity = (phase: number) =>
    Math.sin(frame * 0.07 + phase) * 0.35 + 0.55;

  // Stage glow pulsing slightly
  const stageGlowIntensity = Math.sin(frame * 0.04) * 0.08 + 0.92;

  // ── Scene 1: Platinum Sponsor (0–110) ──────────────────────────────────
  const s1Op = sceneOp(frame, 0, 110);
  const logoSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 230, mass: 0.9 },
    durationInFrames: 32,
  });
  const s1LogoY = interpolate(logoSpring, [0, 1], [-320, 0]);
  const s1LogoScale = interpolate(logoSpring, [0, 1], [1.3, 1.0]);
  const s1LogoOp = interpolate(frame, [10, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shimmerX = interpolate(frame, [30, 80], [-400, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const s1Badge = useSlideUp(frame, fps, 38);
  const s1Tagline = useSlideUp(frame, fps, 54);

  // ── Scene 2: Concert Series Name (94–310) ──────────────────────────────
  const s2Op = sceneOp(frame, 94, 310);
  const s2Line1 = useSlideUp(frame, fps, 108);
  const s2Line2 = useSlideUp(frame, fps, 124);
  const s2Line3 = useSlideUp(frame, fps, 140);
  const lineExpand = interpolate(frame, [155, 200], [0, 800], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Scene 3: When (294–480) ────────────────────────────────────────────
  const s3Op = sceneOp(frame, 294, 480);
  const s3Label = useSlideUp(frame, fps, 308);
  const s3Date = useSlideUp(frame, fps, 324);
  const s3Day = useSlideUp(frame, fps, 342);
  const s3Time = useSlideUp(frame, fps, 360);

  // ── Scene 4: Where (464–620) ───────────────────────────────────────────
  const s4Op = sceneOp(frame, 464, 620);
  const s4Label = useSlideUp(frame, fps, 478);
  const s4Park = useSlideUp(frame, fps, 496);
  const s4City = useSlideUp(frame, fps, 514);
  const s4Free = useSlideUp(frame, fps, 534);

  // ── Scene 5: CTA (604–750) ─────────────────────────────────────────────
  const s5Op = sceneOp(frame, 604, 750);
  const s5LogoSpring = spring({
    frame: frame - 610,
    fps,
    config: { damping: 15, stiffness: 220 },
    durationInFrames: 28,
  });
  const s5LogoScale = interpolate(s5LogoSpring, [0, 1], [0.5, 1.0]);
  const s5LogoOp = interpolate(s5LogoSpring, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s5Headline = useSlideUp(frame, fps, 628);
  const s5Sub = useSlideUp(frame, fps, 646);
  const s5Sponsor = useSlideUp(frame, fps, 664);

  const sceneBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingInline: 56,
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
      {/* ── Night sky background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 120% 55% at 50% 0%, #080E20 0%, ${BG} 65%)`,
        }}
      />

      {/* Twinkling stars */}
      {STARS.map((star, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: star.x,
            top: star.y,
            width: star.r * 2,
            height: star.r * 2,
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            opacity: starOpacity(star.phase),
            boxShadow: `0 0 ${star.r * 3}px rgba(255,255,255,0.8)`,
          }}
        />
      ))}

      {/* Stage glow from bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: height * 0.45,
          background: `radial-gradient(ellipse 110% 80% at 50% 100%, rgba(247,148,29,${0.22 * stageGlowIntensity}) 0%, rgba(131,193,65,${0.10 * stageGlowIntensity}) 45%, transparent 72%)`,
          pointerEvents: "none",
        }}
      />

      {/* Floating music notes */}
      {noteData.map((n, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: n.x,
            top: n.y,
            fontSize: n.size,
            color: i % 2 === 0 ? ECI_GREEN : ECI_ORANGE,
            opacity: n.opacity,
            pointerEvents: "none",
            textShadow: `0 0 20px ${i % 2 === 0 ? ECI_GREEN : ECI_ORANGE}88`,
          }}
        >
          {n.symbol}
        </div>
      ))}

      {/* ════════ SCENE 1 — Platinum Sponsor ════════ */}
      <div style={{ ...sceneBase, opacity: s1Op, gap: 36 }}>
        {/* Platinum shimmer overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, transparent ${shimmerX - 80}px, rgba(255,255,255,0.06) ${shimmerX}px, transparent ${shimmerX + 80}px)`,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            opacity: s1LogoOp,
            transform: `translateY(${s1LogoY}px) scale(${s1LogoScale})`,
            transformOrigin: "center top",
          }}
        >
          <Img
            src={staticFile("eci_logo.png")}
            style={{ width: 340, height: "auto" }}
          />
        </div>

        {/* Platinum sponsor badge */}
        <div
          style={{
            opacity: s1Badge.opacity,
            transform: `translateY(${s1Badge.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              paddingInline: 40,
              paddingBlock: 16,
              border: `2px solid ${PLATINUM}`,
              borderRadius: 12,
              background: `linear-gradient(180deg, rgba(216,210,200,0.18) 0%, rgba(160,154,148,0.08) 100%)`,
              boxShadow: `0 0 40px rgba(216,210,200,0.15), inset 0 1px 0 rgba(255,255,255,0.15)`,
            }}
          >
            <div
              style={{
                fontSize: 20,
                letterSpacing: "6px",
                fontWeight: 700,
                background: `linear-gradient(180deg, #F0EDE8 0%, #C8C2BA 45%, #A89E96 65%, #D4CEC8 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ✦ &nbsp; PLATINUM SPONSOR &nbsp; ✦
            </div>
          </div>
        </div>

        <div
          style={{
            opacity: s1Tagline.opacity,
            transform: `translateY(${s1Tagline.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.15,
            }}
          >
            PROUD TO SUPPORT
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: ECI_GREEN,
              lineHeight: 1.15,
            }}
          >
            OUR COMMUNITY
          </div>
        </div>
      </div>

      {/* ════════ SCENE 2 — Concert Series Name ════════ */}
      <div style={{ ...sceneBase, opacity: s2Op, gap: 20 }}>
        {/* Warm center glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 75% 50% at 50% 50%, rgba(247,148,29,0.12) 0%, transparent 65%)`,
          }}
        />

        <div
          style={{
            opacity: s2Line1.opacity,
            transform: `translateY(${s2Line1.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: PLATINUM,
              letterSpacing: "10px",
              marginBottom: 4,
            }}
          >
            LANGHORNE
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
              fontSize: 112,
              fontWeight: 900,
              color: ECI_ORANGE,
              lineHeight: 1,
              textShadow: `0 0 80px ${ECI_ORANGE}66`,
            }}
          >
            SUMMER
          </div>
        </div>

        <div
          style={{
            opacity: s2Line3.opacity,
            transform: `translateY(${s2Line3.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1,
              letterSpacing: "2px",
            }}
          >
            CONCERT
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: ECI_GREEN,
              lineHeight: 1,
              letterSpacing: "2px",
              textShadow: `0 0 60px ${ECI_GREEN}55`,
            }}
          >
            SERIES
          </div>
        </div>

        {/* Expanding accent line */}
        <div
          style={{
            width: lineExpand,
            height: 3,
            backgroundColor: ECI_ORANGE,
            borderRadius: 2,
            boxShadow: `0 0 16px ${ECI_ORANGE}`,
            marginTop: 8,
          }}
        />
      </div>

      {/* ════════ SCENE 3 — When ════════ */}
      <div style={{ ...sceneBase, opacity: s3Op, gap: 24 }}>
        <div
          style={{
            opacity: s3Label.opacity,
            transform: `translateY(${s3Label.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: ECI_ORANGE,
              fontWeight: 700,
              letterSpacing: "8px",
            }}
          >
            📅 &nbsp; WHEN
          </div>
        </div>

        <div
          style={{
            opacity: s3Date.opacity,
            transform: `translateY(${s3Date.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 40,
              color: "#7A8899",
              fontWeight: 700,
              letterSpacing: "4px",
              marginBottom: 6,
            }}
          >
            STARTING
          </div>
          <div
            style={{
              fontSize: 136,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 0.95,
              textShadow: "0 0 60px rgba(255,255,255,0.2)",
            }}
          >
            MAY
          </div>
          <div
            style={{
              fontSize: 136,
              fontWeight: 900,
              color: ECI_GREEN,
              lineHeight: 0.95,
              textShadow: `0 0 80px ${ECI_GREEN}55`,
            }}
          >
            27TH
          </div>
        </div>

        <div
          style={{
            opacity: s3Day.opacity,
            transform: `translateY(${s3Day.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              paddingInline: 36,
              paddingBlock: 14,
              border: `2px solid ${ECI_ORANGE}`,
              borderRadius: 12,
              backgroundColor: `${ECI_ORANGE}15`,
              fontSize: 36,
              fontWeight: 900,
              color: ECI_ORANGE,
              letterSpacing: "2px",
            }}
          >
            EVERY OTHER WEDNESDAY
          </div>
        </div>

        <div
          style={{
            opacity: s3Time.opacity,
            transform: `translateY(${s3Time.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "3px",
            }}
          >
            7 – 9 PM
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#667788",
              marginTop: 6,
              fontWeight: 700,
              letterSpacing: "2px",
            }}
          >
            FREE ADMISSION · ALL AGES
          </div>
        </div>
      </div>

      {/* ════════ SCENE 4 — Where ════════ */}
      <div style={{ ...sceneBase, opacity: s4Op, gap: 28 }}>
        <div
          style={{
            opacity: s4Label.opacity,
            transform: `translateY(${s4Label.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: ECI_GREEN,
              fontWeight: 700,
              letterSpacing: "8px",
            }}
          >
            📍 &nbsp; WHERE
          </div>
        </div>

        <div
          style={{
            opacity: s4Park.opacity,
            transform: `translateY(${s4Park.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.05,
              textShadow: "0 0 40px rgba(255,255,255,0.15)",
            }}
          >
            LANGHORNE
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: ECI_GREEN,
              lineHeight: 1.05,
              textShadow: `0 0 60px ${ECI_GREEN}55`,
            }}
          >
            COMMUNITY
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.05,
            }}
          >
            PARK
          </div>
        </div>

        <div
          style={{
            opacity: s4City.opacity,
            transform: `translateY(${s4City.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 34,
              color: "#7A8899",
              fontWeight: 700,
              letterSpacing: "4px",
            }}
          >
            LANGHORNE, PA
          </div>
        </div>

        <div
          style={{
            opacity: s4Free.opacity,
            transform: `translateY(${s4Free.y}px)`,
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {["🎶 FREE CONCERTS", "👨‍👩‍👧 FAMILY FRIENDLY", "🌙 SUMMER NIGHTS"].map((tag) => (
              <div
                key={tag}
                style={{
                  paddingInline: 22,
                  paddingBlock: 10,
                  borderRadius: 30,
                  backgroundColor: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(255,255,255,0.18)",
                  fontSize: 22,
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  whiteSpace: "nowrap",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ SCENE 5 — CTA ════════ */}
      <div style={{ ...sceneBase, opacity: s5Op, gap: 36 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 80% 60% at 50% 55%, ${ECI_GREEN}18 0%, transparent 68%)`,
          }}
        />

        <div
          style={{
            opacity: s5Headline.opacity,
            transform: `translateY(${s5Headline.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.1,
            }}
          >
            COME ENJOY
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: ECI_ORANGE,
              lineHeight: 1.1,
              textShadow: `0 0 60px ${ECI_ORANGE}55`,
            }}
          >
            THE MUSIC!
          </div>
        </div>

        <div style={{ opacity: s5LogoOp, transform: `scale(${s5LogoScale})` }}>
          <Img
            src={staticFile("eci_logo.png")}
            style={{ width: 300, height: "auto" }}
          />
        </div>

        <div
          style={{
            opacity: s5Sub.opacity,
            transform: `translateY(${s5Sub.y}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 34,
              color: ECI_GREEN,
              fontWeight: 700,
              letterSpacing: "2px",
            }}
          >
            SEE YOU THIS SUMMER!
          </div>
        </div>

        <div
          style={{
            opacity: s5Sponsor.opacity,
            transform: `translateY(${s5Sponsor.y}px)`,
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              paddingInline: 36,
              paddingBlock: 18,
              border: `1.5px solid ${PLATINUM}55`,
              borderRadius: 14,
              background: `linear-gradient(180deg, rgba(216,210,200,0.08) 0%, rgba(120,116,112,0.04) 100%)`,
            }}
          >
            <div
              style={{
                fontSize: 20,
                letterSpacing: "5px",
                fontWeight: 700,
                background: `linear-gradient(180deg, #F0EDE8 0%, #C8C2BA 50%, #D4CEC8 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ✦ &nbsp; PLATINUM SPONSOR &nbsp; ✦
            </div>
            <div
              style={{
                fontSize: 28,
                color: "#FFFFFF",
                fontWeight: 900,
                marginTop: 6,
                letterSpacing: "2px",
              }}
            >
              ECI · Comfort You Can Count On
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
