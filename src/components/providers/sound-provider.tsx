"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";

export type SoundId = "tileHover" | "tileSelect"; // add whatever you need

type SoundProviderValue = {
  play: (id: SoundId) => void;
  muted: boolean;
  setMuted: (m: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
};

const SoundContext = createContext<SoundProviderValue | null>(null);

/**
 * soundsConfig:
 * map each logical sound id -> actual audio file path, volume multiplier, etc
 *
 * You can change these paths to whatever .mp3/.wav you have in /public/sounds.
 * Short, ~50-200ms .wav or .mp3 clips perform best for UI sounds.
 */
const soundsConfig: Record<SoundId, { src: string; volume: number }> = {
  tileHover: {
    src: "/sounds/tile-hover.wav",
    volume: 1,
  },
  tileSelect: {
    src: "/sounds/tile-select.wav",
    volume: 1,
  },
};

export function SoundProvider({ children }: { children: React.ReactNode }) {
  // store preloaded <audio> elements in a ref so they persist across renders
  const audioMapRef = useRef<Map<SoundId, HTMLAudioElement>>(new Map());

  // global volume/mute state you can expose to a settings panel
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1); // 0..1 master volume

  // preload sounds on mount
  useEffect(() => {
    const map = audioMapRef.current;
    for (const [id, cfg] of Object.entries(soundsConfig) as [
      SoundId,
      { src: string; volume: number },
    ][]) {
      // Create only once
      if (!map.has(id)) {
        const el = new Audio(cfg.src);
        el.preload = "auto";
        el.volume = cfg.volume * volume * (muted ? 0 : 1);
        map.set(id, el);
      }
    }
  }, []); // run once

  // keep volume/mute in sync across all loaded sounds
  useEffect(() => {
    const map = audioMapRef.current;
    for (const [id, cfg] of Object.entries(soundsConfig) as [
      SoundId,
      { src: string; volume: number },
    ][]) {
      const el = map.get(id);
      if (el) {
        el.volume = cfg.volume * volume * (muted ? 0 : 1);
      }
    }
  }, [muted, volume]);

  const play = useCallback((id: SoundId) => {
    const el = audioMapRef.current.get(id);
    if (!el) return;
    try {
      // restart from start each trigger for snappy UI sounds
      el.currentTime = 0;
      // Some browsers block audio until user interacted at least once
      void el.play();
    } catch {
      // ignore play() rejection
    }
  }, []);

  const value: SoundProviderValue = {
    play,
    muted,
    setMuted,
    volume,
    setVolume,
  };

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("useSound must be used inside <SoundProvider>");
  }
  return ctx;
}
