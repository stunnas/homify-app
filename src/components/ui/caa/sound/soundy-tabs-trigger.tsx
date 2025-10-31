"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";
import {
  useSoundInteractions,
  type SoundPreset,
} from "@/hooks/use-sound-interactions";

/**
 * Props are:
 * - all the normal Radix <Tabs.Trigger> props
 * - plus optional `preset` like SoundyButton
 *
 * You still pass `value="overview"` etc. exactly like a normal TabsTrigger.
 */
export interface SoundyTabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  preset?: SoundPreset | false;
}

export const SoundyTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  SoundyTabsTriggerProps
>(
  (
    {
      preset = "button",
      className,
      onClick,
      onMouseEnter,
      onFocus,
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
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          // carry over styling from your existing TabsTrigger
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
          "cursor-target",
          className
        )}
        // SOUND: hover / focus / click
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
      </TabsPrimitive.Trigger>
    );
  }
);

SoundyTabsTrigger.displayName = "SoundyTabsTrigger";
