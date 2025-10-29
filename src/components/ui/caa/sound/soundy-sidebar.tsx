"use client";

import * as React from "react";
import {
  SidebarMenuButton as BaseSidebarMenuButton,
  SidebarMenuSubButton as BaseSidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/shadcn/sidebar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/shadcn/tooltip";
import { cn } from "@/lib/utils";
import {
  useSoundInteractions,
  SoundPreset,
} from "@/hooks/use-sound-interactions";
import { SoundyButton } from "@/components/ui/caa/sound/soundy-button";
import { PanelLeft } from "lucide-react";

// --- SoundySidebarMenuButton ---------------------------------------

export interface SoundySidebarMenuButtonProps
  extends React.ComponentProps<typeof BaseSidebarMenuButton> {
  soundPreset?: SoundPreset | false;
}

/**
 * SoundySidebarMenuButton
 * - drop-in replacement for SidebarMenuButton
 * - adds hover/focus/click sounds
 */
export const SoundySidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SoundySidebarMenuButtonProps
>(
  (
    {
      soundPreset = "sidebar",
      onClick,
      onMouseEnter,
      onFocus,
      className,
      ...rest
    },
    ref
  ) => {
    const hasSound = soundPreset !== false;

    const {
      onHover,
      onFocus: onFocusSound,
      wrapClick,
    } = useSoundInteractions(
      hasSound ? (soundPreset as SoundPreset) : undefined
    );

    return (
      <BaseSidebarMenuButton
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
      />
    );
  }
);
SoundySidebarMenuButton.displayName = "SoundySidebarMenuButton";

// --- SoundySidebarMenuSubButton ------------------------------------

export interface SoundySidebarMenuSubButtonProps
  extends React.ComponentProps<typeof BaseSidebarMenuSubButton> {
  soundPreset?: SoundPreset | false;
}

/**
 * SoundySidebarMenuSubButton
 * drop-in replacement for SidebarMenuSubButton
 * supports asChild, variant, size, isActive
 */
export const SoundySidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  SoundySidebarMenuSubButtonProps
>(
  (
    {
      soundPreset = "sidebar",
      onClick,
      onMouseEnter,
      onFocus,
      className,
      ...rest
    },
    ref
  ) => {
    const hasSound = soundPreset !== false;

    const {
      onHover,
      onFocus: onFocusSound,
      wrapClick,
    } = useSoundInteractions(
      hasSound ? (soundPreset as SoundPreset) : undefined
    );

    return (
      <BaseSidebarMenuSubButton
        ref={ref}
        className={cn(className, "cursor-target")}
        onMouseEnter={(e: any) => {
          if (hasSound) onHover();
          onMouseEnter?.(e);
        }}
        onFocus={(e: any) => {
          if (hasSound) onFocusSound();
          onFocus?.(e);
        }}
        // NOTE: SubButton is rendered "asChild" -> often ends up as <a/>.
        // We still wrap the click so audio fires before navigation.
        onClick={wrapClick(onClick as any)}
        {...rest}
      />
    );
  }
);
SoundySidebarMenuSubButton.displayName = "SoundySidebarMenuSubButton";

export interface SoundySidebarTriggerProps
  extends React.ComponentProps<typeof SoundyButton> {
  soundPreset?: SoundPreset | false;
  tooltip?: React.ReactNode;
  tooltipSide?: React.ComponentProps<typeof TooltipContent>["side"];
  tooltipAlign?: React.ComponentProps<typeof TooltipContent>["align"];
}
/**
 * SoundySidebarTrigger
 * - drop-in replacement for SidebarTrigger
 * - same look/props as your original SidebarTrigger (variant="ghost", size="icon", etc.)
 * - plays hover/focus/click sounds
 * - guarantees toggleSidebar() still runs after click sound has started
 */
export const SoundySidebarTrigger = React.forwardRef<
  React.ElementRef<typeof SoundyButton>,
  SoundySidebarTriggerProps
>(
  (
    {
      className,
      onClick,
      soundPreset = "sidebar",
      tooltip,
      tooltipSide = "top",
      tooltipAlign = "center",
      ...props
    },
    ref
  ) => {
    const { toggleSidebar, state } = useSidebar();
    // state is typically "expanded" | "collapsed"

    const hasSound = soundPreset !== false;
    const {
      onHover,
      onFocus: onFocusSound,
      wrapClick,
    } = useSoundInteractions(
      hasSound ? (soundPreset as SoundPreset) : undefined
    );

    // if caller didn't supply `tooltip`, we auto-label based on current state
    const tooltipLabel =
      tooltip ?? (state === "collapsed" ? "Open Sidebar" : "Hide Sidebar");

    // soundy button core
    const coreButton = (
      <SoundyButton
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", className, "cursor-target")}
        onMouseEnter={(e) => {
          if (hasSound) onHover();
          props.onMouseEnter?.(e);
        }}
        onFocus={(e) => {
          if (hasSound) onFocusSound();
          props.onFocus?.(e);
        }}
        onClick={wrapClick<React.MouseEvent<any>>((e) => {
          // dev's onClick first
          onClick?.(e);
          // then actually toggle sidebar
          toggleSidebar();
        })}
        {...props}
      >
        <PanelLeft />
        <span className="sr-only">
          {state === "collapsed" ? "Open Sidebar" : "Hide Sidebar"}
        </span>
      </SoundyButton>
    );

    return (
      <Tooltip>
        <TooltipTrigger asChild>{coreButton}</TooltipTrigger>
        <TooltipContent side={tooltipSide} align={tooltipAlign}>
          {tooltipLabel}
        </TooltipContent>
      </Tooltip>
    );
  }
);

SoundySidebarTrigger.displayName = "SoundySidebarTrigger";
