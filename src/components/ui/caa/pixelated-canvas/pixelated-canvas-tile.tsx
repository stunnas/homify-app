"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useBoxSize } from "@/hooks/use-box-size";
import { PixelatedCanvas } from "./pixelated-canvas";

/**
 * PixelatedCanvasTile:
 * - measures its own size
 * - resolves light/dark src and default tint
 * - renders PixelatedCanvas full-bleed in a pretty frame
 *
 * NEW:
 * - forwardRef so a parent can still get the DOM node
 * - `outerProps` lets a parent (like the soundy wrapper) inject event handlers,
 *   tabIndex, cursor-target class, etc, directly onto the SAME outer div.
 */

export interface PixelatedCanvasTileProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof PixelatedCanvas>,
    "width" | "height" | "src" | "className" // we calculate these internally
  > {
  /** Force a single src always */
  src?: string;
  srcDark?: string;
  srcLight?: string;
  frameClassName?: string;  // Extra classes for the frame visuals

  /**
   * Extra DOM props for the OUTER frame <div>.
   * This is how the soundy wrapper injects handlers + cursor-target.
   */
  outerProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const PixelatedCanvasTile = React.forwardRef<
  HTMLDivElement,
  PixelatedCanvasTileProps
>(
  (
    {
      src,
      srcDark,
      srcLight,
      objectFit = "cover",
      padding = 72,
      cellSize = 3,
      dotScale = 0.9,
      shape = "circle",
      backgroundColor = "transparent",
      dropoutStrength = 0.1,
      interactive = true,
      distortionStrength = 10,
      distortionRadius = 80,
      distortionMode = "swirl",
      followSpeed = 0.2,
      jitterStrength = 5,
      jitterSpeed = 4,
      sampleAverage = true,
      tintColor,
      tintStrength = 0.1,
      maxFps = 60,
      grayscale = false,
      fadeOnLeave,
      fadeSpeed,
      responsive,

      frameClassName,
      outerProps,
      ...rest // any future props for PixelatedCanvas
    },
    ref
  ) => {
    const { resolvedTheme } = useTheme();

    // measure box with our hook
    const { ref: measureRef, w, h } = useBoxSize();

    // merge forwarded ref + measureRef into one callback ref
    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        // forwardRef from parent
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }

        // our internal measuring ref
        (measureRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
      },
      [ref, measureRef]
    );

    // theme-aware source selection
    const finalSrc = React.useMemo(() => {
      if (src) return src;
      if (resolvedTheme === "dark" && srcDark) return srcDark;
      if (resolvedTheme !== "dark" && srcLight) return srcLight;
      // fallback: prefer whichever exists
      return resolvedTheme === "dark"
        ? (srcDark ?? srcLight)
        : (srcLight ?? srcDark);
    }, [src, srcDark, srcLight, resolvedTheme]);

    // theme-aware tint fallback (dark => white tint, light => black tint)
    const effectiveTintColor = React.useMemo(() => {
      if (tintColor) return tintColor;
      return resolvedTheme === "dark" ? "#ffffff" : "#000000";
    }, [tintColor, resolvedTheme]);

    return (
      <div
        ref={mergedRef}
        className={cn(
          "relative w-full h-full rounded-xl overflow-hidden border border-border shadow-lg bg-gradient-to-br from-primary/10 via-background to-accent/10",
          frameClassName,
          outerProps?.className
        )}
        // spread other event handlers / tabIndex / etc from outerProps
        {...outerProps}
      >
        {w > 0 && h > 0 && finalSrc ? (
          <PixelatedCanvas
            src={finalSrc}
            width={w}
            height={h}
            objectFit={objectFit}
            padding={padding}
            cellSize={cellSize}
            dotScale={dotScale}
            shape={shape}
            backgroundColor={backgroundColor}
            dropoutStrength={dropoutStrength}
            interactive={interactive}
            distortionStrength={distortionStrength}
            distortionRadius={distortionRadius}
            distortionMode={distortionMode}
            followSpeed={followSpeed}
            jitterStrength={jitterStrength}
            jitterSpeed={jitterSpeed}
            sampleAverage={sampleAverage}
            tintColor={effectiveTintColor}
            tintStrength={tintStrength}
            maxFps={maxFps}
            grayscale={grayscale}
            fadeOnLeave={fadeOnLeave}
            fadeSpeed={fadeSpeed}
            responsive={responsive}
            className="absolute inset-0"
            {...rest}
          />
        ) : null}
      </div>
    );
  }
);

PixelatedCanvasTile.displayName = "PixelatedCanvasTile";
