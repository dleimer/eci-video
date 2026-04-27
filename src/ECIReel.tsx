import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// Placeholder — swap these once ECI brand assets are confirmed
const BRAND_PRIMARY = "#0057A8";
const BRAND_ACCENT = "#F5A623";
const BG = "#050A14";

export const ECIReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Strobe flash at open
  const flashOpacity = interpolate(frame, [1, 3, 5, 7], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo slams in from top
  const logoSpring = spring({
    frame: frame - 7,
    fps,
    config: { damping: 14, stiffness: 240, mass: 0.85 },
    durationInFrames: 38,
  });
  const logoY = interpolate(logoSpring, [0, 1], [-400, 0]);
  const logoScale = interpolate(logoSpring, [0, 1], [1.5, 1.0]);
  const logoOpacity = interpolate(frame, [7, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Neon glow builds on landing
  const glow = interpolate(
    frame,
    [35, 45, 65, 120],
    [0, 60, 35, 30],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Accent streaks shoot across
  const makeStreak = (startFrame: number) => ({
    x: interpolate(frame, [startFrame, startFrame + 8], [-600, width + 600], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    alpha: interpolate(
      frame,
      [startFrame, startFrame + 1, startFrame + 6, startFrame + 8],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    ),
  });

  const streak1 = makeStreak(48);
  const streak2 = makeStreak(52);

  // Content fade in
  const contentOpacity = interpolate(frame, [65, 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contentY = interpolate(frame, [65, 82], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoSize = 220;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: BG,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 35% at 50% 40%, #0a1a36 0%, ${BG} 68%)`,
        }}
      />

      {/* Logo placeholder — replace with Img + staticFile once assets arrive */}
      <div
        style={{
          position: "absolute",
          top: height * 0.32,
          left: (width - logoSize) / 2,
          width: logoSize,
          height: logoSize,
          opacity: logoOpacity,
          transform: `translateY(${logoY}px) scale(${logoScale})`,
          transformOrigin: "center center",
          filter: `drop-shadow(0 0 ${glow}px ${BRAND_PRIMARY})`,
          borderRadius: "50%",
          border: `6px solid ${BRAND_PRIMARY}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 ${glow}px ${BRAND_PRIMARY}88`,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: BRAND_PRIMARY,
            fontFamily: "'Arial Black', Arial, sans-serif",
          }}
        >
          ECI
        </div>
      </div>

      {/* Content block */}
      <div
        style={{
          position: "absolute",
          top: height * 0.58,
          left: 0,
          right: 0,
          textAlign: "center",
          paddingInline: 60,
          opacity: contentOpacity,
          transform: `translateY(${contentY}px)`,
          fontFamily: "'Arial Black', Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "1px",
            textTransform: "uppercase",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Your Headline Here
        </div>
        <div
          style={{
            fontSize: 30,
            color: BRAND_ACCENT,
            fontWeight: 700,
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          Supporting detail
        </div>
      </div>

      {/* Accent streaks */}
      {[
        { data: streak1, color: BRAND_PRIMARY },
        { data: streak2, color: BRAND_ACCENT },
      ].map(({ data, color }) => (
        <div
          key={color}
          style={{
            position: "absolute",
            left: data.x,
            top: height * 0.55,
            width: 600,
            height: 4,
            background: `linear-gradient(to right, transparent, ${color} 30%, ${color} 70%, transparent)`,
            opacity: data.alpha,
            boxShadow: `0 0 20px 6px ${color}`,
          }}
        />
      ))}

      {/* Strobe overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "white",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
