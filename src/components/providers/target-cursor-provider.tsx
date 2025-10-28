"use client";

import React from "react";
import TargetCursor from "@/components/ui/react-bits/target-cursor";

interface TargetCursorProviderProps {
  children: React.ReactNode;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
}

/**
 * Client-side provider for the TargetCursor component.
 * Allows you to include the cursor globally (e.g. inside a layout)
 * without running client hooks on the server.
 */
export function TargetCursorProvider({
  children,
  spinDuration = 10,
  hideDefaultCursor = true,
}: TargetCursorProviderProps) {
  return (
    <>
      {children}
      <TargetCursor
        spinDuration={spinDuration}
        hideDefaultCursor={hideDefaultCursor}
      />
    </>
  );
}
