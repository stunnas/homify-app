"use client";

import Link from "next/link";
import { PROGRAMS, getDefaultRouteForProgram } from "@/lib/data/nav-data";
import { SubpageComponentProps } from "@/lib/data/nav-data";
import ElectricBorder from "@/components/ui/caa/electric-border";
import { useElectricBorderColor } from "@/hooks/use-electric-border-color";
import { SoundyLink } from "@/components/ui/caa/sound/soundy-link";

export function HomePrograms({
  programSlug,
  subpageSlug,
}: SubpageComponentProps) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">
          Homify Programs
        </h2>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROGRAMS.map((prog) => {
          const DefaultIcon = prog.logo;
          const href = getDefaultRouteForProgram(prog.slug);

          return (
            <ElectricBorder
              key={prog.slug}
              color={useElectricBorderColor()}
              thickness={8}
              pulse={true}
              className="cursor-target"
            >
              <SoundyLink
                href={href}
                className="group relative aspect-square w-full h-full rounded-xl overflow-hidden 
                           flex flex-col items-center justify-center transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Background icon fill */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
                  <DefaultIcon className="size-1/2 md:size-16 lg:size-40 text-foreground/10 group-hover:text-foreground/100 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Dark overlay for hover contrast */}
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                {/* Text overlay */}
                <div className="absolute bottom-6 left-0 right-0 z-10 flex flex-col items-center text-center">
                  <span className="font-semibold text-lg tracking-tight transition-colors">
                    {prog.name}
                  </span>
                </div>
              </SoundyLink>
            </ElectricBorder>
          );
        })}
      </div>
    </div>
  );
}
