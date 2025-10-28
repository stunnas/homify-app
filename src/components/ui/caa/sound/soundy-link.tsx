"use client";

import Link, { LinkProps } from "next/link";
import * as React from "react";
import {
  useSoundInteractions,
  SoundPreset,
} from "@/hooks/use-sound-interactions";
import { cn } from "@/lib/utils";

type SoundyLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    preset?: SoundPreset | false;
  };

/**
 * SoundyLink
 * plays hover + click sounds (if preset is provided)
 * guarantees click sound fires before we navigate away
 */
export const SoundyLink = React.forwardRef<HTMLAnchorElement, SoundyLinkProps>(
  (
    {
      preset = "tile",
      onClick,
      onMouseEnter,
      onFocus,
      className,
      children,
      ...linkProps
    },
    ref
  ) => {
    // If preset === false we don't wire any sounds.
    const hasSound = preset !== false;

    const {
      onHover,
      onFocus: onFocusSound,
      wrapClick,
    } = useSoundInteractions(hasSound ? (preset as SoundPreset) : undefined);

    return (
      <Link
        ref={ref}
        {...linkProps}
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
      >
        {children}
      </Link>
    );
  }
);

SoundyLink.displayName = "SoundyLink";

export interface SoundyBreadcrumbLinkProps
  extends Omit<React.ComponentPropsWithoutRef<"a">, "href"> {
  href: string;
  asChild?: boolean;
  preset?: SoundPreset | false;
}

/**
 * SoundyBreadcrumbLink
 * - Styled like BreadcrumbLink
 * - Click/hover/focus sound like SoundyLink
 * - Uses Next.js routing via SoundyLink under the hood
 */
export const SoundyBreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  SoundyBreadcrumbLinkProps
>(
  (
    {
      className,
      preset = "tile",
      asChild, // kept for signature parity with BreadcrumbLink, but ignored
      href,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <SoundyLink
        ref={ref}
        href={href}
        preset={preset}
        className={cn("transition-colors hover:text-foreground", className, "cursor-target")}
        {...rest}
      >
        {children}
      </SoundyLink>
    );
  }
);

SoundyBreadcrumbLink.displayName = "SoundyBreadcrumbLink";