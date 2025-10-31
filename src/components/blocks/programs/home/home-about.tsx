"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/shadcn/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn/tabs";
import { SoundyButton } from "@/components/ui/caa/sound/soundy-button";
import { PixelatedCanvas } from "@/components/ui/caa/pixelated-canvas";
import { cn } from "@/lib/utils";
import type { SubpageComponentProps } from "@/lib/data/nav-data";
import {
  APP_META,
  OVERVIEW,
  PROGRAM_MODULES,
  BUILD_INFO,
  DEPENDENCIES,
  LICENSE,
  TABS,
  TAB_ORDER,
  type TabKey,
} from "@/lib/data/programs/home-about-data";
import { useTheme } from "next-themes";
import { useBoxSize } from "@/hooks/use-box-size";

/* ---------- tiny presentational helpers ---------- */

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="p-6 pb-4 border-b border-border/60">
      <h2 className="text-xl font-semibold text-foreground mb-1">{title}</h2>
      {subtitle ? (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-2 border-primary/50 pl-4 py-2">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="font-mono text-sm font-semibold text-foreground mt-1">
        {value}
      </p>
    </div>
  );
}

function ProgramCard({
  name,
  icon: Icon,
  tagline,
  bullets,
}: {
  name: string;
  icon: any;
  tagline: string;
  bullets: string[];
}) {
  return (
    <Card className="border-border bg-card/50 hover:border-primary/50 transition-colors">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex flex-col">
              <h4 className="font-semibold text-foreground">{name}</h4>
              <p className="text-xs text-muted-foreground italic mt-1">
                {tagline}
              </p>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed">
              {bullets.map((b, i) => (
                <li key={i} className="list-disc pl-4 marker:text-primary">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CanvasFrame() {
  const { ref, w, h } = useBoxSize();
  const { resolvedTheme } = useTheme();
  return (
    <div
      ref={ref}
      className="relative flex-1 rounded-xl overflow-hidden border border-border shadow-lg bg-gradient-to-br from-primary/10 via-background to-accent/10"
    >
      {w > 0 && h > 0 && (
        <PixelatedCanvas
          src={
            resolvedTheme === "dark"
              ? "/images/icon.png"
              : "/images/icon-light.png"
          }
          width={w}
          height={h}
          objectFit="cover"
          padding={72}
          cellSize={3}
          dotScale={0.9}
          shape="circle"
          backgroundColor="transparent"
          dropoutStrength={0.1}
          interactive
          distortionStrength={10}
          distortionRadius={80}
          distortionMode="swirl"
          followSpeed={0.2}
          jitterStrength={5}
          jitterSpeed={4}
          sampleAverage
          tintColor={resolvedTheme === "dark" ? "#ffffff" : "#000000"}
          tintStrength={0.1}
          className="absolute inset-0 cursor-target"
        />
      )}
    </div>
  );
}

/* ---------- page ---------- */

export function HomeAbout({}: SubpageComponentProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  return (
    <div className="bg-background text-foreground">
      {/* Top row: title + tabs */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col lg:flex-row lg:items-end lg:gap-3">
            <h1 className="text-3xl font-bold leading-none">{APP_META.name}</h1>
            <Badge className="bg-primary/20 text-primary h-6 px-2 py-0 text-[10px] leading-none self-start lg:self-auto">
              {APP_META.version} • Latest
            </Badge>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabKey)}
            className="w-full lg:w-auto"
          >
            <TabsList className="flex w-full flex-wrap gap-1 lg:w-auto lg:flex-nowrap lg:gap-0 rounded-md border border-border bg-card/40 px-1 py-1">
              {TAB_ORDER.map((k) => (
                <TabsTrigger
                  key={k}
                  value={k}
                  className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground flex-1 rounded-sm px-3 py-1 text-xs lg:text-sm"
                >
                  {TABS[k].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Two-column workspace */}
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3 h-[70vh] min-h-0">
          {/* Left panel */}
          <div className="lg:col-span-1 min-h-0">
            <div className="h-full rounded-xl border border-border bg-gradient-to-br from-primary/[0.25] via-background to-accent/[0.25] flex flex-col">
              <CanvasFrame />
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2 min-h-0">
            <Tabs
              value={activeTab}
              className="flex h-full min-h-0 flex-col rounded-xl border border-border bg-card/10 backdrop-blur overflow-hidden"
            >
              {/* header driven by TABS config */}
              <SectionHeader
                title={TABS[activeTab].header.title}
                subtitle={TABS[activeTab].header.subtitle}
              />

              {/* scrollable body */}
              <div className="flex-1 min-h-0 overflow-y-auto p-6 ">
                {/* Overview */}
                <TabsContent
                  value="overview"
                  forceMount
                  className={cn(
                    activeTab !== "overview" && "hidden",
                    "space-y-4"
                  )}
                >
                  <Card className="border-border bg-card/50">
                    <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
                      {OVERVIEW.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-card/30 text-left text-xs leading-relaxed">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground uppercase tracking-wide text-[10px]">
                            Version
                          </p>
                          <p className="text-sm font-bold text-primary">
                            {APP_META.version}
                          </p>
                        </div>

                        <SoundyButton
                          onClick={() => console.log("View Change Log")}
                        >
                          View Change Log
                        </SoundyButton>
                      </div>
                      <div className="border-t border-border/50 pt-3">
                        <p className="text-muted-foreground uppercase tracking-wide text-[10px]">
                          Status
                        </p>
                        <p className="text-foreground text-xs font-medium">
                          {APP_META.status}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Programs */}
                <TabsContent
                  value="programs"
                  forceMount
                  className={cn(activeTab !== "programs" && "hidden")}
                >
                  <div className="space-y-4">
                    {PROGRAM_MODULES.map((p) => (
                      <ProgramCard
                        key={p.key}
                        name={p.name}
                        icon={p.icon}
                        tagline={p.tagline}
                        bullets={p.descBullets}
                      />
                    ))}
                  </div>
                </TabsContent>

                {/* Build */}
                <TabsContent
                  value="build"
                  forceMount
                  className={cn(activeTab !== "build" && "hidden")}
                >
                  <div className="space-y-4">
                    {BUILD_INFO.map((bi, i) => (
                      <KV key={i} label={bi.label} value={bi.value} />
                    ))}
                  </div>

                  <Card className="border-border bg-card/50 mt-4">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Core Stack / Dependencies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {DEPENDENCIES.map((d, i) => (
                          <div
                            key={i}
                            className="flex items-start justify-between text-sm"
                          >
                            <span className="text-foreground font-medium">
                              {d.name}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs whitespace-nowrap"
                            >
                              {d.note}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* License */}
                <TabsContent
                  value="licensing"
                  forceMount
                  className={cn(activeTab !== "licensing" && "hidden")}
                >
                  <div className="space-y-8">
                    <Card className="border-border bg-card/50">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Homify License
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p>{LICENSE.licenseSummary}</p>
                        <div className="rounded-lg bg-background/50 p-3 font-mono text-xs text-foreground">
                          {LICENSE.copyrightLine}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground text-sm">
                        Third-Party Licenses
                      </h3>
                      {LICENSE.thirdParty.map((lib, i) => (
                        <div
                          key={i}
                          className="border-l-2 border-primary/50 pl-4 py-2"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-foreground text-sm">
                              {lib.name}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {lib.license}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
