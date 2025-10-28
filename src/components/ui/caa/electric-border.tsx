"use client";

import React, { CSSProperties, PropsWithChildren } from "react";

type ElectricBorderProps = PropsWithChildren<{
  color?: string;
  thickness?: number;
  className?: string;
  style?: CSSProperties;
  pulse?: boolean; // optional visual enhancement
}>;

/**
 * Assumes a global <filter id="electric-border" /> already exists.
 * This component just draws layered borders & glow.
 */
const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  color = "#6D28D9",
  thickness = 2,
  className,
  style,
  pulse = true,
}) => {
  const radius = (style?.borderRadius as string) ?? "0.75rem";

  const strokeStyle: CSSProperties = {
    borderRadius: radius,
    borderWidth: thickness,
    borderStyle: "solid",
    borderColor: color,
    filter: "url(#electric-border)", // <-- global filter
  };

  const glowOuter: CSSProperties = {
    borderRadius: radius,
    boxShadow: `
      0 0 8px ${color},
      0 0 24px ${color}80
    `,
    opacity: 0.6,
    transition: "opacity .2s ease",
    ...(pulse
      ? {
          animation: "electricPulse 2s ease-in-out infinite alternate",
        }
      : {}),
  };

  return (
    <div
      className={`relative isolate ${className ?? ""}`}
      style={{ borderRadius: radius, ...style }}
    >
      {/* Glow halo */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={glowOuter}
      />

      {/* Main stroke */}
      <div
        className="absolute inset-0 box-border pointer-events-none z-20"
        style={strokeStyle}
      />

      {/* Inner content */}
      <div className="relative" style={{ borderRadius: radius }}>
        {children}
      </div>
    </div>
  );
};

export default ElectricBorder;
