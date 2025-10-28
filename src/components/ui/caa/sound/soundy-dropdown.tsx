"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenuItem as BaseDropdownMenuItem,
  DropdownMenuCheckboxItem as BaseDropdownMenuCheckboxItem,
  DropdownMenuRadioItem as BaseDropdownMenuRadioItem,
  DropdownMenuSubTrigger as BaseDropdownMenuSubTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import {
  useSoundInteractions,
  SoundPreset,
} from "@/hooks/use-sound-interactions";

// SoundyDropdownMenuItem-----------------------------
export interface SoundyDropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseDropdownMenuItem> {
  soundPreset?: SoundPreset | false;
}

export const SoundyDropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof BaseDropdownMenuItem>,
  SoundyDropdownMenuItemProps
>(
  (
    {
      className,
      soundPreset = "button",
      onSelect,
      onMouseEnter,
      onFocus,
      ...props
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
      <BaseDropdownMenuItem
        ref={ref}
        className={cn(className, "cursor-target")}
        // Radix passes a DOM Event here
        onSelect={wrapClick<CustomEvent | Event>(onSelect)}
        onMouseEnter={(e) => {
          if (hasSound) onHover();
          onMouseEnter?.(e);
        }}
        onFocus={(e) => {
          if (hasSound) onFocusSound();
          onFocus?.(e);
        }}
        {...props}
      />
    );
  }
);
SoundyDropdownMenuItem.displayName = "SoundyDropdownMenuItem";

// SoundyDropdownMenuCheckboxItem---------------------------------
export interface SoundyDropdownMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseDropdownMenuCheckboxItem> {
  soundPreset?: SoundPreset | false;
}

export const SoundyDropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof BaseDropdownMenuCheckboxItem>,
  SoundyDropdownMenuCheckboxItemProps
>(
  (
    {
      className,
      soundPreset = "button",
      onSelect,
      onMouseEnter,
      onFocus,
      ...props
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
      <BaseDropdownMenuCheckboxItem
        ref={ref}
        className={cn(className, "cursor-target")}
        onSelect={wrapClick<CustomEvent | Event>(onSelect)}
        onMouseEnter={(e) => {
          if (hasSound) onHover();
          onMouseEnter?.(e);
        }}
        onFocus={(e) => {
          if (hasSound) onFocusSound();
          onFocus?.(e);
        }}
        {...props}
      />
    );
  }
);
SoundyDropdownMenuCheckboxItem.displayName = "SoundyDropdownMenuCheckboxItem";

// SoundyDropdownMenuRadioItem------------------------------------
export interface SoundyDropdownMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseDropdownMenuRadioItem> {
  soundPreset?: SoundPreset | false;
}

export const SoundyDropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof BaseDropdownMenuRadioItem>,
  SoundyDropdownMenuRadioItemProps
>(
  (
    {
      className,
      soundPreset = "button",
      onSelect,
      onMouseEnter,
      onFocus,
      ...props
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
      <BaseDropdownMenuRadioItem
        ref={ref}
        className={cn(className, "cursor-target")}
        onSelect={wrapClick<CustomEvent | Event>(onSelect)}
        onMouseEnter={(e) => {
          if (hasSound) onHover();
          onMouseEnter?.(e);
        }}
        onFocus={(e) => {
          if (hasSound) onFocusSound();
          onFocus?.(e);
        }}
        {...props}
      />
    );
  }
);
SoundyDropdownMenuRadioItem.displayName = "SoundyDropdownMenuRadioItem";

// SoundyDropdownMenuSubTrigger----------------------------------------------------
// This one doesn't use onSelect, it uses onClick (React synthetic event).
export interface SoundyDropdownMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseDropdownMenuSubTrigger> {
  soundPreset?: SoundPreset | false;
}

export const SoundyDropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof BaseDropdownMenuSubTrigger>,
  SoundyDropdownMenuSubTriggerProps
>(
  (
    {
      className,
      soundPreset = "button",
      onClick,
      onMouseEnter,
      onFocus,
      ...props
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
      <BaseDropdownMenuSubTrigger
        ref={ref}
        className={cn(className, "cursor-target")}
        onClick={wrapClick<React.MouseEvent<any>>(onClick)}
        onMouseEnter={(e) => {
          if (hasSound) onHover();
          onMouseEnter?.(e);
        }}
        onFocus={(e) => {
          if (hasSound) onFocusSound();
          onFocus?.(e);
        }}
        {...props}
      />
    );
  }
);
SoundyDropdownMenuSubTrigger.displayName = "SoundyDropdownMenuSubTrigger";
