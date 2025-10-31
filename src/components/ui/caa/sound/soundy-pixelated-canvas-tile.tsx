"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useBoxSize } from "@/hooks/use-box-size";
import { PixelatedCanvas } from "@/components/ui/caa/pixelated-canvas/pixelated-canvas";
import {
  useSoundInteractions,
  type SoundPreset,
} from "@/hooks/use-sound-interactions";

/**
 * PixelatedCanvasTile
 * - Measures its own size
 * - Resolves theme-aware src + tint
 * - Renders <PixelatedCanvas> full-bleed in a styled frame
 * - (NEW) Optionally enables hover/focus/click sound via `preset`
 */

export interface SoundyPixelatedCanvasTileProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof PixelatedCanvas>,
    "width" | "height" | "src" | "className"
  > {
  /** Optional fixed src, or theme-based light/dark variants */
  src?: string;
  srcDark?: string;
  srcLight?: string;

  /** Optional frame visual override */
  frameClassName?: string;

  /** Optional extra DOM attributes for outer <div> */
  outerProps?: React.HTMLAttributes<HTMLDivElement>;

  /** Enables sound effects ("tile", "button", etc.) */
  preset?: SoundPreset | false;
}

export const SoundyPixelatedCanvasTile = React.forwardRef<
  HTMLDivElement,
  SoundyPixelatedCanvasTileProps
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
      preset,

      ...rest
    },
    ref
  ) => {
    const { resolvedTheme } = useTheme();
    const { ref: measureRef, w, h } = useBoxSize();

    /** Merge forwarded + measuring refs */
    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (measureRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
      },
      [ref, measureRef]
    );

    /** Theme-based src resolve */
    const finalSrc = React.useMemo(() => {
      if (src) return src;
      if (resolvedTheme === "dark" && srcDark) return srcDark;
      if (resolvedTheme !== "dark" && srcLight) return srcLight;
      return resolvedTheme === "dark"
        ? (srcDark ?? srcLight)
        : (srcLight ?? srcDark);
    }, [src, srcDark, srcLight, resolvedTheme]);

    /** Tint auto-fallback */
    const effectiveTintColor = React.useMemo(() => {
      if (tintColor) return tintColor;
      return resolvedTheme === "dark" ? "#ffffff" : "#000000";
    }, [tintColor, resolvedTheme]);

    /** Handle sound logic (only if preset != false) */
    const hasSound = preset !== false && preset !== undefined;
    const {
      onHover,
      onFocus: onFocusSound,
      wrapClick,
    } = useSoundInteractions(hasSound ? preset : undefined);

    /** Split user outer props to merge correctly */
    const {
      className: userClassName,
      tabIndex: userTabIndex,
      onMouseEnter: userOnMouseEnter,
      onFocus: userOnFocus,
      onClick: userOnClick,
      ...restOuter
    } = outerProps ?? {};

    /** Merge classNames safely (no overwriting) */
    const mergedClassName = cn(
      "relative w-full h-full rounded-xl overflow-hidden border border-border shadow-lg bg-gradient-to-br from-primary/10 via-background to-accent/10",
      frameClassName,
      hasSound && "cursor-target",
      userClassName
    );

    /** Merge event handlers safely */
    const mergedHandlers = {
      tabIndex: hasSound ? (userTabIndex ?? 0) : userTabIndex,
      onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
        if (hasSound) onHover();
        userOnMouseEnter?.(e);
      },
      onFocus: (e: React.FocusEvent<HTMLDivElement>) => {
        if (hasSound) onFocusSound();
        userOnFocus?.(e);
      },
      onClick: wrapClick(userOnClick),
    };

    /** Render */
    return (
      <div
        ref={mergedRef}
        className={mergedClassName}
        {...restOuter}
        {...mergedHandlers}
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

SoundyPixelatedCanvasTile.displayName = "SoundyPixelatedCanvasTile";
