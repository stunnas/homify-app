// lib/data/programs/home-about-data.ts

import { Files, TimerReset, Film } from "lucide-react";
import type { ComponentType } from "react";

/* ---------- App meta ---------- */
export interface AppMeta {
  name: string;
  version: string;
  status: string;
}
export const APP_META: AppMeta = {
  name: "Homify",
  version: "1.0.0",
  status: "Active & Maintained",
};

/* ---------- Overview ---------- */
export interface OverviewSection {
  title: string;
  subtitle: string;
  paragraphs: string[];
  keyFeatures: { title: string; desc: string }[];
}
export const OVERVIEW: OverviewSection = {
  title: "About Homify",
  subtitle:
    "An all-in-one, locally-enhanced personal productivity and intelligence hub.",
  paragraphs: [
    "Homify is an all-in-one, locally-enhanced personal productivity and intelligence hub that merges multiple standalone tools into one unified desktop experience. It’s designed for smart organization, context-aware interactions, and private LLM workflows — all powered through a local-first architecture.",
    "",
    "Every tool is deeply integrated, sharing context and data seamlessly. It's built for people who care about privacy, local control, and reducing tool fragmentation.",
  ],
  keyFeatures: [
    {
      title: "Smart File Watcher",
      desc: "Interact with your files as data, not just icons. AI-driven tagging, contextual grouping, and instant previews across projects.",
    },
    {
      title: "Pomodoro + Attention Analytics",
      desc: "Focus tracking and habit insight. Sessions, interruptions, optional webcam-based distraction detection, plus trend visualizations.",
    },
    {
      title: "LLM Director",
      desc: "Autonomous media pipeline. Transform text prompts → image → video → publishable social content.",
    },
  ],
};

/* ---------- Programs ---------- */
export interface ProgramModule {
  key: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  tagline: string;
  descBullets: string[];
}
export const PROGRAM_MODULES: ProgramModule[] = [
  {
    key: "file-watcher",
    name: "Smart File Watcher",
    icon: Files,
    tagline: "Interact with your files as data, not just icons.",
    descBullets: [
      "Monitors your local directory structure using Tauri FS APIs.",
      "Automatically organizes files by type, context, or user-defined rules.",
      "Replaces file explorer workflows with tagging, contextual grouping, and AI-driven organization.",
      "Enables one-click access, previews, and contextual insights across projects.",
    ],
  },
  {
    key: "focus-analytics",
    name: "Pomodoro + Attention Analytics",
    icon: TimerReset,
    tagline: "Focus better. Understand your habits.",
    descBullets: [
      "Deeply integrated Pomodoro-style work sessions.",
      "Tracks interruptions, completion streaks, and session quality.",
      "Optional webcam attention analysis (only if the user opts in) to detect distraction / looking away.",
      "Generates visual analytics: streaks, focus zones, and behavioral trends.",
    ],
  },
  {
    key: "llm-director",
    name: "LLM Director",
    icon: Film,
    tagline: "From text → image → video → post.",
    descBullets: [
      "Autonomous text-to-media pipeline using open source text-to-image and image-to-video models.",
      "n8n-driven workflow chaining for generation, refinement, and export.",
      "Produces assets ready for social (clips, stories, posts).",
      "Stores metadata, prompt history, and performance metrics for later reuse.",
      "Scales from solo experimentation to repeatable content automation.",
    ],
  },
];

/* ---------- Build ---------- */
export interface BuildInfoItem {
  label: string;
  value: string;
}
export const BUILD_INFO: BuildInfoItem[] = [
  { label: "Runtime Stack", value: "Next.js + Tauri + Bun + Python" },
  { label: "Local-First Architecture", value: "No cloud dependency for core workflows" },
  { label: "LLM Privacy Model", value: "Private, contextual, on-device / local-service LLM usage" },
  { label: "Workflow Orchestration", value: "n8n pipelines for media generation" },
];

export interface DependencyInfo {
  name: string;
  note: string;
}
export const DEPENDENCIES: DependencyInfo[] = [
  { name: "Next.js", note: "UI/runtime layer" },
  { name: "Tauri", note: "Desktop shell + filesystem access" },
  { name: "Bun", note: "Runtime / package manager" },
  { name: "TypeScript", note: "Typed app logic" },
  { name: "Python", note: "Model runners / automation glue" },
  { name: "ShadCN UI", note: "Composable UI primitives" },
];

/* ---------- Licensing ---------- */
export interface LicenseInfo {
  licenseSummary: string;
  copyrightLine: string;
  thirdParty: { name: string; license: string }[];
}
export const LICENSE: LicenseInfo = {
  licenseSummary:
    "Homify is currently distributed under a permissive license for personal and experimental use.",
  copyrightLine: "MIT License © 2025 Homify Contributors",
  thirdParty: [
    { name: "Next.js", license: "MIT" },
    { name: "Tauri", license: "MIT" },
    { name: "shadcn/ui", license: "MIT" },
    { name: "Tailwind CSS", license: "MIT" },
    { name: "React", license: "MIT" },
  ],
};

/* ---------- Unified tab config (single source of truth) ---------- */
export type TabKey = "overview" | "programs" | "build" | "licensing";
export const TAB_ORDER: TabKey[] = ["overview", "programs", "build", "licensing"];

export const TABS: Record<
  TabKey,
  { label: string; header: { title: string; subtitle: string } }
> = {
  overview: {
    label: "Overview",
    header: { title: OVERVIEW.title, subtitle: OVERVIEW.subtitle },
  },
  programs: {
    label: "Programs",
    header: {
      title: "Programs & Modules",
      subtitle: "Core components of the Homify ecosystem.",
    },
  },
  build: {
    label: "Build",
    header: {
      title: "Build Information",
      subtitle: "Technical composition and architecture principles.",
    },
  },
  licensing: {
    label: "License",
    header: {
      title: "Licensing",
      subtitle: "License information and third-party attributions.",
    },
  },
};
