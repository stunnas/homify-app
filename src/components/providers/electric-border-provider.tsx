"use client";

import React, { createContext, useContext } from "react";

const ElectricBorderContext = createContext(true); // placeholder, could add flags later

export function ElectricBorderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ElectricBorderContext.Provider value={true}>
      {/* Global filter defs. Rendered once at the root. */}
      <svg
        className="pointer-events-none fixed opacity-0"
        width="0"
        height="0"
        aria-hidden
        focusable="false"
      >
        <defs>
          <filter
            id="electric-border"
            colorInterpolationFilters="sRGB"
            x="-200%"
            y="-200%"
            width="500%"
            height="500%"
          >
            {/* You can tweak frequency/dur here to control CPU */}
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise1"
              seed="1"
            />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate
                attributeName="dy"
                values="700;0"
                dur="12s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise2"
              seed="2"
            />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate
                attributeName="dx"
                values="490;0"
                dur="12s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feBlend
              in="offsetNoise1"
              in2="offsetNoise2"
              mode="color-dodge"
              result="combinedNoise"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="combinedNoise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      {children}
    </ElectricBorderContext.Provider>
  );
}

// currently not doing anything fancy, but having this hook
// means you can later gate animation (e.g. prefers-reduced-motion, battery saver, etc.)
export function useElectricBorder() {
  return useContext(ElectricBorderContext);
}
