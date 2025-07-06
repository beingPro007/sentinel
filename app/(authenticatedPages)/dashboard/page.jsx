"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/(authenticatedPages)/context/UserContext";
import { useEffect } from "react";

export default function Dashboard() {
  const { userProfile, loading, error } = useUser();

  // Remove OAuth code from URL only after userProfile is available
  useEffect(() => {
    if (userProfile?.data?.user_name) {
      const url = new URL(window.location.href);
      if (url.searchParams.has("code")) {
        console.log("OAuth code received:", url.searchParams.get("code"));
        url.searchParams.delete("code");
        window.history.replaceState(null, "", url.pathname);
      }
    }
  }, [userProfile]);

  if (error) {
    return <div className="p-5 text-red-500 bg-zinc-900">{error}</div>;
  }

  if (loading) {
    return (
      <div className="p-5 text-white bg-zinc-900">Loading OAuth flow...</div>
    );
  }

  return (
    <SidebarInset className="flex h-full flex-col overflow-hidden">
      {/* Header with breadcrumb */}
      <header className="flex h-16 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <h2 className="text-2xl font-semibold p-6 mb-0 text-white">
        Welcome, {userProfile?.data?.user_name || "User"}!
      </h2>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <h2 className="text-2xl  mb-6 font-mono text-white">
          🚀 Your 10 Strategies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <Card key={idx} className="bg-muted/50 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle>Strategy {idx + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Description or content here...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SidebarInset>
  );
}
