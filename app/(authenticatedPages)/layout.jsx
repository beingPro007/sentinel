"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { UserProvider } from "../(authenticatedPages)/context/UserContext";
import { Analytics } from "@vercel/analytics/react";

export default function DashboardLayout({ children }) {
  return (
    <UserProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white">
          {/* Sidebar */}
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden w-full h-full">
            <main className="flex-1 overflow-y-auto w-full h-full">
              {children}
              <Analytics />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}
