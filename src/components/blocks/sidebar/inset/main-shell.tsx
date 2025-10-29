"use client";

import * as React from "react";

import { SidebarInset } from "@/components/ui/shadcn/sidebar";
import { Separator } from "@/components/ui/shadcn/separator";
import { DynamicBreadcrumbs } from "@/components/blocks/sidebar/content/dynamic-breadcrumbs";
import { SoundySidebarTrigger } from "@/components/ui/caa/sound/soundy-sidebar";
import { SettingsDialog } from "@/components/blocks/settings/settings-dialog";

/**
 * ShellMain
 *
 * Wraps the main column to the right of the sidebar.
 * Renders a sticky header (trigger + breadcrumbs).
 * Provides a scrollable content region for page content.
 */
export function ShellMain({ children }: { children: React.ReactNode }) {
  return (
    <SidebarInset className="flex flex-1 flex-col min-w-0">
      {/* Sticky header row (never scrolls away) */}
      <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b bg-background/80 px-4 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 transition-[height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <SoundySidebarTrigger />
        <SettingsDialog />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <DynamicBreadcrumbs />
      </div>

      {/* Scrollable page body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">{children}</div>
    </SidebarInset>
  );
}
