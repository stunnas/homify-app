"use client";

import * as React from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { AccentProvider } from "@/components/providers/accent-provider";
import { ElectricBorderProvider } from "@/components/providers/electric-border-provider";
import { SoundProvider } from "@/components/providers/sound-provider";
import { TargetCursorProvider } from "@/components/providers/target-cursor-provider";
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";


/**
 * AppProviders
 *
 * This wraps all global client-side providers in one place.
 * Order matters! If one provider depends on context from another,
 * keep that order here.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TargetCursorProvider>
        <AccentProvider>
          <SoundProvider>
            <SidebarProvider>
                <ElectricBorderProvider>{children}</ElectricBorderProvider>
            </SidebarProvider>
          </SoundProvider>
        </AccentProvider>
      </TargetCursorProvider>
    </ThemeProvider>
  );
}
