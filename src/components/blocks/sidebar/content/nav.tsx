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
} from "@/components/ui/shadcn/sidebar";
import {
  SoundySidebarMenuButton,
  SoundySidebarMenuSubButton,
} from "@/components/ui/caa/sound/soundy-sidebar";
import { NavItem } from "@/lib/data/nav-data";

interface NavProps {
  items: NavItem[];
  baseSlug: string;
  currentPath?: string;
}

export function Nav({ items, baseSlug, currentPath }: NavProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          return (
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
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SoundySidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {(item.items ?? []).map((subItem) => {
                      const href = `/${baseSlug}/${item.url}/${subItem.url}`;
                      const isActive = currentPath === href;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SoundySidebarMenuSubButton
                            asChild
                            variant={isActive ? "accent" : "default"}
                          >
                            <a href={href}>
                              <span
                                className={
                                  isActive ? "underline font-bold" : ""
                                }
                              >
                                {subItem.title}
                              </span>
                            </a>
                          </SoundySidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
