"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/shadcn/button";
import {
  useSoundInteractions,
  SoundPreset,
} from "@/hooks/use-sound-interactions";
import { cn } from "@/lib/utils";

export interface SoundyButtonProps extends ButtonProps {
  // preset = which sound profile to use
  // false disables sound entirely on this instance
  preset?: SoundPreset | false;
}

/**
 * SoundyButton
 * Wraps shadcn Button so you keep variant, size, asChild, etc.
 * Adds hover/focus/click sounds via useSoundInteractions().
 * Ensures click sound actually fires before user onClick runs.
 */
export const SoundyButton = React.forwardRef<
  HTMLButtonElement,
  SoundyButtonProps
>(
  (
    {
      preset = "button",
      onClick,
      onMouseEnter,
      onFocus,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const hasSound = preset !== false;

    const {
      onHover,
      onFocus: onFocusSound,
      wrapClick,
    } = useSoundInteractions(hasSound ? (preset as SoundPreset) : undefined);

    return (
      <Button
        ref={ref}
        className={cn(className, "cursor-target")}
        onMouseEnter={(e) => {
          if (hasSound) onHover();
          onMouseEnter?.(e);
        }}
        onFocus={(e) => {
          if (hasSound) onFocusSound();
          onFocus?.(e);
        }}
        // click sound (with delay-safe wrap)
        onClick={wrapClick(onClick)}
        {...rest}
      >
        {children}
      </Button>
    );
  }
);

SoundyButton.displayName = "SoundyButton";

export interface SoundyBasicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  preset?: SoundPreset | false;
}

/**
 * SoundyBasicButton
 * A lightweight button that uses useSoundInteractions for hover/focus/click sounds.
 * - No Shadcn dependencies
 * - No variant/size logic
 * - Keeps ref + all standard button props
 */

// SoundyBasicButton-------------------------------------
export const SoundyBasicButton = React.forwardRef<
  HTMLButtonElement,
  SoundyBasicButtonProps
>(
  (
    {
      preset = "button",
      onClick,
      onMouseEnter,
      onFocus,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const hasSound = preset !== false;
    const {
      onHover,
      onFocus: onFocusSound,
      wrapClick,
    } = useSoundInteractions(hasSound ? (preset as SoundPreset) : undefined);

    return (
      <button
        ref={ref}
        className={cn(className, "cursor-target")}
        onMouseEnter={(e) => {
          if (hasSound) onHover();
          onMouseEnter?.(e);
        }}
        onFocus={(e) => {
          if (hasSound) onFocusSound();
          onFocus?.(e);
        }}
        onClick={wrapClick(onClick)}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

SoundyBasicButton.displayName = "SoundyBasicButton";
