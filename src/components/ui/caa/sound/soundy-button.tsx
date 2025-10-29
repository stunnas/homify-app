"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/shadcn/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/shadcn/tooltip";
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

/**
 * SoundyTooltipButton Uses
 * 
 * Simple: 
 * <SoundyTooltipButton
      tooltip="Settings"
      variant="ghost"
    >
      <Settings className="size-4" />
    </SoundyTooltipButton>
 * 
 * Advanced:
 * <SoundyTooltipButton
      tooltip={{
        side: "right",
        align: "start",
        className: "text-[10px] font-medium tracking-wide",
        children: (
          <>
            <div>Settings</div>
            <div className="text-muted-foreground text-[9px]">
              Personalization & theme
            </div>
          </>
        ),
      }}
      iconSize
      variant="ghost"
      preset="button"
    >
      <Settings className="size-4" />
    </SoundyTooltipButton>
 */

// SoundyTooltipButton-------------------------------------

// case 1: simple tooltip like "Settings" or <span>Settings</span>
type TooltipSimple = string | React.ReactNode;

// case 2: advanced tooltip props, basically TooltipContent props
type TooltipAdvanced = Omit<
  React.ComponentProps<typeof TooltipContent>,
  "children"
> & {
  children: React.ReactNode;
};

export interface SoundyTooltipButtonProps extends SoundyButtonProps {
  tooltip?: TooltipSimple | TooltipAdvanced;
  iconSize?: boolean;
}

// runtime + type guard to tell TS "this is the advanced object form"
function isTooltipAdvanced(
  t: TooltipSimple | TooltipAdvanced
): t is TooltipAdvanced {
  // we only care that it's an object (not null) and not a valid ReactElement-only branch.
  // checking typeof === "object" is enough to narrow away string/number/boolean.
  return typeof t === "object" && t !== null && !React.isValidElement(t);
}

export const SoundyTooltipButton = React.forwardRef<
  HTMLButtonElement,
  SoundyTooltipButtonProps
>(({ tooltip, iconSize = false, className, preset, ...rest }, ref) => {
  // core soundy button with optional "icon button" sizing
  const core = (
    <SoundyButton
      ref={ref}
      preset={preset}
      className={cn(
        iconSize &&
          "h-8 w-8 min-h-8 min-w-8 p-0 flex items-center justify-center",
        "cursor-target",
        className
      )}
      {...rest}
    />
  );

  // if no tooltip at all, bail early
  if (!tooltip) {
    return core;
  }

  // if tooltip is simple (string / node / <span/> / <Settings/> etc.):
  if (!isTooltipAdvanced(tooltip)) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{core}</TooltipTrigger>
        <TooltipContent side="top" align="center">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }

  // if tooltip is advanced object props:
  // now TS knows `tooltip` is TooltipAdvanced, i.e. a spreadable object.
  return (
    <Tooltip>
      <TooltipTrigger asChild>{core}</TooltipTrigger>
      <TooltipContent {...tooltip} />
    </Tooltip>
  );
});

SoundyTooltipButton.displayName = "SoundyTooltipButton";
