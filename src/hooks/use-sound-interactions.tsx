"use client";

import { useCallback } from "react";
import { useSound } from "@/components/providers/sound-provider";

export type SoundPreset = "tile" | "button" | "sidebar";

export function useSoundInteractions(preset?: SoundPreset) {
  const { play } = useSound();

  // map UI preset -> which sound ids to fire
  const hoverSound =
    preset === "tile" ||
    preset === "button" ||
    preset === "sidebar" ||
    preset === "scroll"
      ? "tileHover"
      : null;
  const clickSound =
    preset === "tile" ||
    preset === "button" ||
    preset === "sidebar" ||
    preset === "scroll"
      ? "tileSelect"
      : null;

  const onHover = useCallback(() => {
    if (hoverSound) play(hoverSound);
  }, [hoverSound, play]);

  const onFocus = useCallback(() => {
    if (hoverSound) play(hoverSound);
  }, [hoverSound, play]);

  /**
   * We return a wrapper that:
   * 1. plays click sound
   * 2. waits ~40ms so the browser actually starts playback
   * 3. then calls the user's original onClick handler
   *
   * This fixes the "sound never plays because page navigated immediately" issue.
   * We "type" the returned fn as returning void (what Radix expects),
   * even though it runs async internally.
   */
  const wrapClick = useCallback(
    <E,>(userHandler?: (e: E) => void) => {
      // We return a function that TS believes is just (e: E) => void
      return (e: E) => {
        // fire-and-forget async flow
        (async () => {
          if (clickSound) {
            try {
              play(clickSound);
              await new Promise((r) => setTimeout(r, 40));
            } catch {
              // ignore
            }
          }
          userHandler?.(e);
        })();
      };
    },
    [clickSound, play]
  );

  return {
    onHover,
    onFocus,
    wrapClick,
  };
}
