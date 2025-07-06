/* eslint-disable react-hooks/exhaustive-deps */
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useUser } from "@/(authenticatedPages)/context/UserContext";
import {
  LayoutDashboardIcon,
  Watch,
  View,
  BellDotIcon,
  Brain,
  TestTube,
  ChartArea,
  File,
  GitGraphIcon,
  Settings,
  GridIcon,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useMemo } from "react";
import Link from "next/link";

export function AppSidebar(props) {
  const { userProfile, loading } = useUser();
  const { collapsed } = useSidebar();

  const user = userProfile?.data
    ? {
        name: userProfile.data.user_name,
        email: userProfile.data.email,
        avatar: "/avatars/shadcn.jpg",
      }
    : {
        name: loading ? "Loading..." : "Guest",
        email: loading ? "Fetching user..." : "Unknown",
        avatar: "/avatars/shadcn.jpg",
      };

  const navMain = [
    {
      group: "Main",
      links: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
        { title: "Watchlist", url: "/watchlist", icon: Watch },
        { title: "Market Overview", url: "/market-overview", icon: View },
      ],
    },
    {
      group: "Insights",
      links: [
        { title: "Alerts", url: "/alerts", icon: BellDotIcon },
        { title: "Strategies", url: "/strategies", icon: Brain },
        { title: "Backtesting", url: "/backtesting", icon: TestTube },
        { title: "Analytics", url: "/analytics", icon: ChartArea },
        { title: "Option-chain", url: "/option-chain", icon: File },
      ],
    },
    {
      group: "Account",
      links: [
        { title: "Portfolio", url: "/portfolio", icon: File },
        { title: "Trades", url: "/trades", icon: GitGraphIcon },
        { title: "Settings", url: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-white">
                  <GridIcon className="size-4" />
                </div>
                {!collapsed && (
                  <span className="text-lg font-semibold text-white">
                    Sentinel
                  </span>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}