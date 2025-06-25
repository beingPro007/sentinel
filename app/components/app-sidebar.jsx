"use client";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { Home, BarChart2, Brain, Briefcase } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Option Chain", href: "/option-chain", icon: BarChart2 },
  { label: "Strategy Builder", href: "/strategy-builder", icon: Brain },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between text-xl font-bold px-4 py-2">
        <span>📊 Sentinel</span>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>{/* e.g. user profile or settings */}</SidebarFooter>
    </Sidebar>
  );
}
