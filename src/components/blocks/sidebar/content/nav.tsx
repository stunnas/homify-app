// nav.tsx

"use client";

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/shadcn/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/shadcn/sidebar";
import {
  SoundySidebarMenuButton,
  SoundySidebarMenuSubButton,
} from "@/components/ui/caa/sound/soundy-sidebar";
import { SoundyDropdownMenuItem } from "@/components/ui/caa/sound/soundy-dropdown";
import { NavItem } from "@/lib/data/nav-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAccent } from "@/components/providers/accent-provider";

interface NavProps {
  items: NavItem[];
  baseSlug: string;
  currentPath?: string;
}

export function Nav({ items, baseSlug, currentPath }: NavProps) {
  const { open } = useSidebar();
  const { currentAccent } = useAccent();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = (item.items ?? []).length > 0;

          // helper for building child links so we don't repeat code
          const subLinks = (item.items ?? []).map((subItem) => {
            const href = `/${baseSlug}/${item.url}/${subItem.url}`;
            const isActive = currentPath === href;
            return {
              title: subItem.title,
              href,
              isActive,
              icon: subItem.icon,
            };
          });

          return open ? (
            // ─────────────────────────
            // EXPANDED SIDEBAR (Collapsible)
            // ─────────────────────────
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SoundySidebarMenuButton
                    tooltip={item.title}
                    soundPreset="sidebar"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {hasChildren ? (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    ) : null}
                  </SoundySidebarMenuButton>
                </CollapsibleTrigger>

                {hasChildren ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {subLinks.map((link) => (
                        <SidebarMenuSubItem key={link.title}>
                          <SoundySidebarMenuSubButton asChild>
                            <a
                              href={link.href}
                              className={
                                link.isActive
                                  ? "bg-accent text-accent-foreground"
                                  : ""
                              }
                            >
                              {link.icon && (
                                <link.icon className="size-4 shrink-0" />
                              )}
                              <span
                                className={
                                  link.isActive ? "underline font-bold" : ""
                                }
                              >
                                {link.title}
                              </span>
                            </a>
                          </SoundySidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            // ─────────────────────────
            // COLLAPSED SIDEBAR (DropdownMenu)
            // ─────────────────────────
            <SidebarMenuItem key={item.title}>
              {hasChildren ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SoundySidebarMenuButton
                      tooltip={item.title}
                      soundPreset="sidebar"
                      className="justify-center"
                    >
                      {item.icon && <item.icon />}
                    </SoundySidebarMenuButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="min-w-48 rounded-lg"
                    side="right"
                    sideOffset={8}
                    align="start"
                  >
                    <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-2">
                      {item.icon && <item.icon className="size-4 shrink-0" />}
                      <span className="font-medium">{item.title}</span>
                    </DropdownMenuLabel>

                    {subLinks.map((link) => (
                      <SoundyDropdownMenuItem key={link.title} asChild>
                        <a
                          href={link.href}
                          className={cn(
                            "gap-2 p-2 m-2 cursor-pointer border",
                            link.isActive
                              ? currentAccent === "default"
                                ? "bg-primary text-background"
                                : "bg-accent text-accent-foreground"
                              : ""
                          )}
                        >
                          {link.icon && (
                            <link.icon className="size-4 shrink-0" />
                          )}
                          <span
                            className={
                              link.isActive ? "underline font-bold" : ""
                            }
                          >
                            {link.title}
                          </span>
                        </a>
                      </SoundyDropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <SoundySidebarMenuButton
                  asChild
                  tooltip={item.title}
                  soundPreset="sidebar"
                  className="justify-center"
                >
                  <a
                    href={`/${baseSlug}/${item.url}`}
                    className={item.isActive ? "underline font-bold" : ""}
                  >
                    {item.icon && <item.icon />}
                  </a>
                </SoundySidebarMenuButton>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
