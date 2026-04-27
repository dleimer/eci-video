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

export const ECIFeedPost: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 200 },
    durationInFrames: 35,
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.7, 1.0]);
  const logoOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [20, 40], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [35, 60], [0, width * 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: BG,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Arial Black', Arial, sans-serif",
      }}
    >
      {/* Background radial */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 70% at 50% 50%, #0a1a36 0%, ${BG} 75%)`,
        }}
      />

      {/* Logo placeholder — replace with <Img src={staticFile("eci_logo.png")} /> */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 48,
          width: 260,
          height: 260,
          borderRadius: "50%",
          border: `6px solid ${BRAND_PRIMARY}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 40px ${BRAND_PRIMARY}55`,
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: BRAND_PRIMARY,
            letterSpacing: "-2px",
          }}
        >
          ECI
        </div>
      </div>

      {/* Tagline / content area */}
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          textAlign: "center",
          paddingInline: 60,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "1px",
            textTransform: "uppercase",
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Your Headline Here
        </div>
        <div
          style={{
            fontSize: 28,
            color: BRAND_ACCENT,
            fontWeight: 600,
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          Supporting detail
        </div>
      </div>

      {/* Accent line */}
      <div
        style={{
          position: "absolute",
          bottom: height * 0.12,
          left: (width - lineWidth) / 2,
          width: lineWidth,
          height: 3,
          backgroundColor: BRAND_ACCENT,
          boxShadow: `0 0 12px ${BRAND_ACCENT}`,
        }}
      />
    </div>
  );
};
