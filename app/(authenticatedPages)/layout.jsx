import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNav } from "@/components/top-nav";

export default function AuthenticatedLayout({ children }) {
  return (
    <div>
      <TopNav />
      <SidebarProvider>
        <div className="flex h-screen">
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden w-full h-full">
            <main className="flex-1 overflow-y-auto w-full h-full">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
