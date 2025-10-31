"use client";

import { useState, useEffect, useRef } from "react";

/**
 * useBoxSize
 *
 * - Gives you a `ref` to put on any div.
 * - Tracks that div's rendered width/height (in px) using ResizeObserver.
 * - Updates whenever the element resizes.
 *
 * Usage:
 *   const { ref, w, h } = useBoxSize();
 *   return <div ref={ref}> ... </div>
 */
export function useBoxSize() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) {
        setSize({
          w: Math.floor(cr.width),
          h: Math.floor(cr.height),
        });
      }
    });

    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, []);

  return { ref, ...size };
}
