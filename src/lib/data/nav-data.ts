import { HomePrograms } from "@/components/blocks/programs/home/home-programs";
import {
  Home,
  FolderCode,
  Cctv,
  Videotape,
  Bot,
  CalendarCheck2,
  BadgeInfo,
  TimerReset,
  LayoutDashboard,
} from "lucide-react";

export interface Program {
  name: string;
  slug: string;
  logo: React.ElementType;
}

export interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  isActive?: boolean;
  items?: NavSubItem[];
}

export interface NavSubItem {
  title: string;
  url: string;
  icon: React.ElementType;
  codeblock?: React.ComponentType<SubpageComponentProps>;
}

export type SubpageComponentProps = {
  programSlug: string;
  subpageSlug: string;
};

export const PROGRAMS: Program[] = [
  {
    name: "Home",
    slug: "home",
    logo: Home,
  },
  {
    name: "Pomodoro Timer",
    slug: "pomodoro-timer",
    logo: TimerReset,
  },
  {
    name: "LLM Director",
    slug: "llm-director",
    logo: Cctv,
  },
];

export const NAV_DATA: Record<Program["name"], NavItem[]> = {
  Home: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Programs",
          url: "programs",
          icon: FolderCode,
          codeblock: HomePrograms,
        },
        {
          title: "About",
          url: "about",
          icon: BadgeInfo,
        },
      ],
    },
  ],
  "Pomodoro Timer": [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Sessions",
          url: "sessions",
          icon: CalendarCheck2,
        },
      ],
    },
  ],
  "LLM Director": [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Projects",
          url: "projects",
          icon: Videotape,
        },
        {
          title: "Agents",
          url: "agents",
          icon: Bot,
        },
      ],
    },
  ],
};

export function getDefaultRouteForProgram(programSlug: string): string {
  const program = PROGRAMS.find((p) => p.slug === programSlug);
  if (!program) {
    return "/"; // fallback or throw
  }

  const items = NAV_DATA[program.name];
  if (!items || items.length === 0) {
    return `/${programSlug}`;
  }

  // Grab the first nav item
  const firstItem = items[0];
  // If the item has subitems, use the first subitem for a deeper route
  if (firstItem.items && firstItem.items.length > 0) {
    const firstSub = firstItem.items[0];
    return `/${programSlug}/${firstItem.url}/${firstSub.url}`;
  }
  // else just go to e.g. /pomodoro/dashboard
  return `/${programSlug}/${firstItem.url}`;
}

/**
 * Build a Map of every path → display name:
 *  For each program:
 *    "/" + slug => program name
 *    "/" + slug + "/" + item.url => item.title
 *    "/" + slug + "/" + item.url + "/" + subItem.url => subItem.title
 */
export function buildFullPathMap(): Record<string, string> {
  const pathMap: Record<string, string> = {};

  for (const program of PROGRAMS) {
    pathMap[`/${program.slug}`] = program.name;

    // For each NavItem:
    const items = NAV_DATA[program.name] || [];
    for (const item of items) {
      const itemPath = `/${program.slug}/${item.url}`;
      pathMap[itemPath] = item.title; // e.g. "/ai-bridge/dashboard" => "Dashboard"

      // For each sub-item:
      if (item.items) {
        for (const sub of item.items) {
          const subPath = `/${program.slug}/${item.url}/${sub.url}`;
          pathMap[subPath] = sub.title; // e.g. "/ai-bridge/dashboard/agents" => "Agents"
        }
      }
    }
  }

  return pathMap;
}
