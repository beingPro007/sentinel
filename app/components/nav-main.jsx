"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function NavMain({ items = [] }) {
  return (
    <>
      {items.map((section) => (
        <SidebarGroup key={section.group}>
          <SidebarGroupLabel className="pl-4">
            {section.group}
          </SidebarGroupLabel>
          <SidebarMenu>
            {section.links.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    shallow
                    className={cn(
                      "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-sidebar-accent transition"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
