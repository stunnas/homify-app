"use client";
import React from "react";

type PixelatedCanvasProps = {
  src: string;
  width?: number;
  height?: number;

  /** Size of each cell (in CSS px) used for sampling + grid spacing. */
  cellSize?: number;

  /** Dot size as a fraction of cell size (0..1). */
  dotScale?: number;

  /** Shape of each dot. */
  shape?: "circle" | "square";

  /** Background fill for the canvas each frame. Set "transparent" or undefined to clear instead. */
  backgroundColor?: string;

  /** Convert sampled pixels to grayscale. */
  grayscale?: boolean;

  className?: string;

  /** Redraw on window resize using the provided width/height. */
  responsive?: boolean;

  /** 0..1. Higher value = drop more dots in low-contrast areas (gives that patchy / particle look). */
  dropoutStrength?: number;

  /** Enable interactive pointer distortion animation. */
  interactive?: boolean;

  /** Max per-dot offset (px) from pointer distortion. */
  distortionStrength?: number;

  /** Radius (px) around the pointer that affects dots. */
  distortionRadius?: number;

  /** Distortion style. */
  distortionMode?: "repel" | "attract" | "swirl";

  /** 0..1 how fast the rendered pointer chases the real pointer. */
  followSpeed?: number;

  /** Average multiple sub-samples per cell for smoother color. */
  sampleAverage?: boolean;

  /** Apply a tint color to dots (ex: "#fff" or "rgb(255,0,0)"). */
  tintColor?: string;
  /** 0..1 how strong the tint is mixed in. */
  tintStrength?: number;

  /** Cap animation FPS. */
  maxFps?: number;

  /** How to size the source image inside the canvas' drawable area. */
  objectFit?: "cover" | "contain" | "fill" | "none";

  /** Extra gutter inside the canvas so the art isn't glued to the frame edges. */
  padding?: number;

  /**
   * If true, only distort dots when the pointer is actually hovering
   * over the fitted image box (not just the padded gutter).
   */
  clampDistortionToImage?: boolean;

  /** Random jitter magnitude for dots under influence. */
  jitterStrength?: number;

  /** Speed factor for that jitter motion. */
  jitterSpeed?: number;

  /** Smoothly fade influence after pointer leaves instead of snapping off. */
  fadeOnLeave?: boolean;

  /** 0..1 smoothing rate for the fade. Higher = faster fade. */
  fadeSpeed?: number;
};

export const PixelatedCanvas: React.FC<PixelatedCanvasProps> = ({
  src,
  width = 400,
  height = 500,
  cellSize = 3,
  dotScale = 0.9,
  shape = "square",
  backgroundColor = "#000000",
  grayscale = false,
  className,
  responsive = false,
  dropoutStrength = 0.4,
  interactive = true,
  distortionStrength = 3,
  distortionRadius = 80,
  distortionMode = "swirl",
  followSpeed = 0.2,
  sampleAverage = true,
  tintColor = "#FFFFFF",
  tintStrength = 0.2,
  maxFps = 60,
  objectFit = "cover",
  padding = 24,
  clampDistortionToImage = true,
  jitterStrength = 4,
  jitterSpeed = 4,
  fadeOnLeave = true,
  fadeSpeed = 0.1,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // all sampled dots live here after we precompute once
  const samplesRef = React.useRef<
    Array<{
      x: number; // absolute canvas X (not image-local)
      y: number; // absolute canvas Y
      r: number;
      g: number;
      b: number;
      a: number;
      drop: boolean;
      seed: number;
    }>
  >([]);

  // store global render dims
  const dimsRef = React.useRef<{
    width: number;
    height: number;
    dot: number;
  } | null>(null);

  // where on the canvas we actually drew/scaled the source image
  // used for centering, padding, and clamping distortion
  const drawBoxRef = React.useRef<{
    x: number;
    y: number;
    w: number;
    h: number;
  }>({ x: 0, y: 0, w: width, h: height });

  // for animation / pointer smoothing
  const targetMouseRef = React.useRef<{ x: number; y: number }>({
    x: -9999,
    y: -9999,
  });
  const animMouseRef = React.useRef<{ x: number; y: number }>({
    x: -9999,
    y: -9999,
  });
  const pointerInsideRef = React.useRef<boolean>(false);

  // activity smoothly fades instead of hard on/off
  const activityRef = React.useRef<number>(0);
  const activityTargetRef = React.useRef<number>(0);

  // requestAnimationFrame book-keeping
  const rafRef = React.useRef<number | null>(null);
  const lastFrameRef = React.useRef<number>(0);

  React.useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    /** compute() - sets up samplesRef + dimsRef for rendering */
    const compute = () => {
      if (!canvas) return;
      const dpr =
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

      // logical display size (CSS px)
      const displayW = width ?? img.naturalWidth;
      const displayH = height ?? img.naturalHeight;

      // actually size the <canvas> element
      canvas.width = Math.max(1, Math.floor(displayW * dpr));
      canvas.height = Math.max(1, Math.floor(displayH * dpr));
      canvas.style.width = `${displayW}px`;
      canvas.style.height = `${displayH}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // full canvas paint each frame will use backgroundColor,
      // but for now we just need these numbers:
      const canvasW = displayW;
      const canvasH = displayH;

      // inner drawable area after padding
      const innerW = Math.max(1, canvasW - padding * 2);
      const innerH = Math.max(1, canvasH - padding * 2);

      // source image natural size
      const iw = img.naturalWidth || displayW;
      const ih = img.naturalHeight || displayH;

      // figure out fitted size of the image INSIDE that inner box
      let fittedW = innerW;
      let fittedH = innerH;

      if (objectFit === "cover") {
        const scale = Math.max(innerW / iw, innerH / ih);
        fittedW = Math.ceil(iw * scale);
        fittedH = Math.ceil(ih * scale);
      } else if (objectFit === "contain") {
        const scale = Math.min(innerW / iw, innerH / ih);
        fittedW = Math.ceil(iw * scale);
        fittedH = Math.ceil(ih * scale);
      } else if (objectFit === "fill") {
        fittedW = innerW;
        fittedH = innerH;
      } else {
        // "none": draw at native size, no scale
        fittedW = iw;
        fittedH = ih;
      }

      // center that fitted rect INSIDE the canvas
      const boxX = Math.floor((canvasW - fittedW) / 2);
      const boxY = Math.floor((canvasH - fittedH) / 2);

      drawBoxRef.current = {
        x: boxX,
        y: boxY,
        w: fittedW,
        h: fittedH,
      };

      // now draw the image into an offscreen canvas of JUST that fitted box size
      const offscreen = document.createElement("canvas");
      offscreen.width = Math.max(1, fittedW);
      offscreen.height = Math.max(1, fittedH);

      const off = offscreen.getContext("2d");
      if (!off) return;

      off.drawImage(img, 0, 0, fittedW, fittedH);

      // read pixel data
      let imageData: ImageData;
      try {
        imageData = off.getImageData(0, 0, offscreen.width, offscreen.height);
      } catch {
        // fallback if tainted: just draw source directly and bail on pixel-step effect
        ctx.drawImage(img, boxX, boxY, fittedW, fittedH);
        return;
      }

      const data = imageData.data;
      const stride = offscreen.width * 4;

      // effective dot size
      const effectiveDotSize = Math.max(1, Math.floor(cellSize * dotScale));
      dimsRef.current = {
        width: canvasW,
        height: canvasH,
        dot: effectiveDotSize,
      };

      // helper: get luminance at a sample coord in offscreen space
      const luminanceAt = (px: number, py: number) => {
        const ix = Math.max(0, Math.min(offscreen.width - 1, px));
        const iy = Math.max(0, Math.min(offscreen.height - 1, py));
        const idx = iy * stride + ix * 4;
        const rr = data[idx];
        const gg = data[idx + 1];
        const bb = data[idx + 2];
        return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
      };

      // deterministic-ish pseudo-random
      const hash2D = (ix: number, iy: number) => {
        const s = Math.sin(ix * 12.9898 + iy * 78.233) * 43758.5453123;
        return s - Math.floor(s);
      };

      // optional tint parsing
      let tintRGB: [number, number, number] | null = null;
      if (tintColor && tintStrength > 0) {
        const parseTint = (c: string): [number, number, number] | null => {
          if (c.startsWith("#")) {
            const hex = c.slice(1);
            if (hex.length === 3) {
              const r = parseInt(hex[0] + hex[0], 16);
              const g = parseInt(hex[1] + hex[1], 16);
              const b = parseInt(hex[2] + hex[2], 16);
              return [r, g, b];
            }
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return [r, g, b];
          }
          const m = c.match(/rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/i);
          if (m)
            return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
          return null;
        };
        tintRGB = parseTint(tintColor);
      }

      const outSamples: Array<{
        x: number;
        y: number;
        r: number;
        g: number;
        b: number;
        a: number;
        drop: boolean;
        seed: number;
      }> = [];

      // walk a grid over the fitted image area
      for (let yy = 0; yy < offscreen.height; yy += cellSize) {
        const cy = Math.min(
          offscreen.height - 1,
          yy + Math.floor(cellSize / 2)
        );

        for (let xx = 0; xx < offscreen.width; xx += cellSize) {
          const cx = Math.min(
            offscreen.width - 1,
            xx + Math.floor(cellSize / 2)
          );

          // sample color
          let r = 0,
            g = 0,
            b = 0,
            a = 0;
          if (!sampleAverage) {
            const idx = cy * stride + cx * 4;
            r = data[idx];
            g = data[idx + 1];
            b = data[idx + 2];
            a = data[idx + 3] / 255;
          } else {
            let count = 0;
            for (let oy = -1; oy <= 1; oy++) {
              for (let ox = -1; ox <= 1; ox++) {
                const sx = Math.max(0, Math.min(offscreen.width - 1, cx + ox));
                const sy = Math.max(0, Math.min(offscreen.height - 1, cy + oy));
                const sIdx = sy * stride + sx * 4;
                r += data[sIdx];
                g += data[sIdx + 1];
                b += data[sIdx + 2];
                a += data[sIdx + 3] / 255;
                count++;
              }
            }
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            a = a / count;
          }

          // grayscale or tint
          if (grayscale) {
            const L = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
            r = L;
            g = L;
            b = L;
          } else if (tintRGB && tintStrength > 0) {
            const k = Math.max(0, Math.min(1, tintStrength));
            r = Math.round(r * (1 - k) + tintRGB[0] * k);
            g = Math.round(g * (1 - k) + tintRGB[1] * k);
            b = Math.round(b * (1 - k) + tintRGB[2] * k);
          }

          // dropout based on local contrast so flat areas thin out
          const Lc = luminanceAt(cx, cy);
          const Lx1 = luminanceAt(cx - 1, cy);
          const Lx2 = luminanceAt(cx + 1, cy);
          const Ly1 = luminanceAt(cx, cy - 1);
          const Ly2 = luminanceAt(cx, cy + 1);
          const grad =
            Math.abs(Lx2 - Lx1) +
            Math.abs(Ly2 - Ly1) +
            Math.abs(Lc - (Lx1 + Lx2 + Ly1 + Ly2) / 4);
          const gradientNorm = Math.max(0, Math.min(1, grad / 255));
          const dropoutProb = Math.max(
            0,
            Math.min(1, (1 - gradientNorm) * dropoutStrength)
          );
          const drop = hash2D(cx, cy) < dropoutProb;

          const seed = hash2D(cx, cy);

          // now the IMPORTANT part:
          // instead of (xx,yy) from the offscreen space,
          // place this dot in CANVAS coordinates with the box offset.
          outSamples.push({
            x: xx + boxX,
            y: yy + boxY,
            r,
            g,
            b,
            a,
            drop,
            seed,
          });
        }
      }

      samplesRef.current = outSamples;
    };

    img.onload = () => {
      if (cancelled) return;
      compute();

      // if interactive == false, do one static draw and stop
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      if (!interactive) {
        const ctx = canvasEl.getContext("2d");
        const dims = dimsRef.current;
        const samples = samplesRef.current;
        if (!ctx || !dims || !samples) return;

        if (backgroundColor && backgroundColor !== "transparent") {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, dims.width, dims.height);
        } else {
          ctx.clearRect(0, 0, dims.width, dims.height);
        }

        for (const s of samples) {
          if (s.drop || s.a <= 0) continue;
          const drawX = s.x + cellSize / 2;
          const drawY = s.y + cellSize / 2;

          ctx.globalAlpha = s.a;
          ctx.fillStyle = `rgb(${s.r}, ${s.g}, ${s.b})`;

          if (shape === "circle") {
            const radius = dims.dot / 2;
            ctx.beginPath();
            ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(
              drawX - dims.dot / 2,
              drawY - dims.dot / 2,
              dims.dot,
              dims.dot
            );
          }
        }

        ctx.globalAlpha = 1;
        return;
      }

      // ----- interactive mode -----

      const onPointerMove = (e: PointerEvent) => {
        const rect = canvasEl.getBoundingClientRect();
        targetMouseRef.current.x = e.clientX - rect.left;
        targetMouseRef.current.y = e.clientY - rect.top;
        pointerInsideRef.current = true;
        activityTargetRef.current = 1;
      };
      const onPointerEnter = () => {
        pointerInsideRef.current = true;
        activityTargetRef.current = 1;
      };
      const onPointerLeave = () => {
        pointerInsideRef.current = false;
        if (fadeOnLeave) {
          activityTargetRef.current = 0;
        } else {
          targetMouseRef.current.x = -9999;
          targetMouseRef.current.y = -9999;
        }
      };

      canvasEl.addEventListener("pointermove", onPointerMove);
      canvasEl.addEventListener("pointerenter", onPointerEnter);
      canvasEl.addEventListener("pointerleave", onPointerLeave);

      const animate = () => {
        const now = performance.now();
        const minDelta = 1000 / Math.max(1, maxFps);
        if (now - lastFrameRef.current < minDelta) {
          rafRef.current = requestAnimationFrame(animate);
          return;
        }
        lastFrameRef.current = now;

        const ctx = canvasEl.getContext("2d");
        const dims = dimsRef.current;
        const samples = samplesRef.current;
        if (!ctx || !dims || !samples) {
          rafRef.current = requestAnimationFrame(animate);
          return;
        }

        // smooth mouse interpolation
        animMouseRef.current.x =
          animMouseRef.current.x +
          (targetMouseRef.current.x - animMouseRef.current.x) * followSpeed;
        animMouseRef.current.y =
          animMouseRef.current.y +
          (targetMouseRef.current.y - animMouseRef.current.y) * followSpeed;

        // smooth fade of "activity" so it eases out on leave
        if (fadeOnLeave) {
          activityRef.current =
            activityRef.current +
            (activityTargetRef.current - activityRef.current) * fadeSpeed;
        } else {
          activityRef.current = pointerInsideRef.current ? 1 : 0;
        }

        const mx = animMouseRef.current.x;
        const my = animMouseRef.current.y;
        const t = now * 0.001 * jitterSpeed;
        const box = drawBoxRef.current;

        // clear / paint bg
        if (backgroundColor && backgroundColor !== "transparent") {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, dims.width, dims.height);
        } else {
          ctx.clearRect(0, 0, dims.width, dims.height);
        }

        const sigma = Math.max(1, distortionRadius * 0.5);
        const activity = Math.max(0, Math.min(1, activityRef.current));

        for (const s of samples) {
          if (s.drop || s.a <= 0) continue;

          let drawX = s.x + cellSize / 2;
          let drawY = s.y + cellSize / 2;

          // distance from pointer
          const dx = drawX - mx;
          const dy = drawY - my;
          const dist2 = dx * dx + dy * dy;

          // optional: only allow distortion if pointer is within the actual image box
          let allowDistort = true;
          if (clampDistortionToImage) {
            allowDistort =
              mx >= box.x &&
              mx <= box.x + box.w &&
              my >= box.y &&
              my <= box.y + box.h;
          }

          const falloff = Math.exp(-dist2 / (2 * sigma * sigma));
          const influence = allowDistort ? falloff * activity : 0;

          if (influence > 0.0005) {
            if (distortionMode === "repel") {
              const dist = Math.sqrt(dist2) + 0.0001;
              drawX += (dx / dist) * distortionStrength * influence;
              drawY += (dy / dist) * distortionStrength * influence;
            } else if (distortionMode === "attract") {
              const dist = Math.sqrt(dist2) + 0.0001;
              drawX -= (dx / dist) * distortionStrength * influence;
              drawY -= (dy / dist) * distortionStrength * influence;
            } else if (distortionMode === "swirl") {
              const angle = distortionStrength * 0.05 * influence;
              const cosA = Math.cos(angle);
              const sinA = Math.sin(angle);
              const rx = cosA * dx - sinA * dy;
              const ry = sinA * dx + cosA * dy;
              drawX = mx + rx;
              drawY = my + ry;
            }

            // jitter "breathing" motion
            if (jitterStrength > 0) {
              const k = s.seed * 43758.5453;
              const jx = Math.sin(t + k) * jitterStrength * influence;
              const jy = Math.cos(t + k * 1.13) * jitterStrength * influence;
              drawX += jx;
              drawY += jy;
            }
          }

          ctx.globalAlpha = s.a;
          ctx.fillStyle = `rgb(${s.r}, ${s.g}, ${s.b})`;

          if (shape === "circle") {
            const radius = dims.dot / 2;
            ctx.beginPath();
            ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(
              drawX - dims.dot / 2,
              drawY - dims.dot / 2,
              dims.dot,
              dims.dot
            );
          }
        }

        ctx.globalAlpha = 1;

        rafRef.current = requestAnimationFrame(animate);
      };

      // kick off anim loop
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);

      const cleanup = () => {
        canvasEl.removeEventListener("pointermove", onPointerMove);
        canvasEl.removeEventListener("pointerenter", onPointerEnter);
        canvasEl.removeEventListener("pointerleave", onPointerLeave);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };

      // stash for onUnmount
      (img as any)._cleanup = cleanup;
    };

    img.onerror = () => {
      console.error("Failed to load image for PixelatedCanvas:", src);
    };

    if (responsive) {
      const onResize = () => {
        if (img.complete && img.naturalWidth) {
          compute();
        }
      };
      window.addEventListener("resize", onResize);

      return () => {
        cancelled = true;
        window.removeEventListener("resize", onResize);
        if ((img as any)._cleanup) (img as any)._cleanup();
      };
    }

    return () => {
      cancelled = true;
      if ((img as any)._cleanup) (img as any)._cleanup();
    };
  }, [
    src,
    width,
    height,
    cellSize,
    dotScale,
    shape,
    backgroundColor,
    grayscale,
    responsive,
    dropoutStrength,
    interactive,
    distortionStrength,
    distortionRadius,
    distortionMode,
    followSpeed,
    sampleAverage,
    tintColor,
    tintStrength,
    maxFps,
    objectFit,
    padding,
    clampDistortionToImage,
    jitterStrength,
    jitterSpeed,
    fadeOnLeave,
    fadeSpeed,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label="Pixelated rendering of source image"
      role="img"
    />
  );
};
