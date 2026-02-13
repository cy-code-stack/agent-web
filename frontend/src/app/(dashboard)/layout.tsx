"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, Header, MobileNav } from "@/components/layout";
import { useAuthStore, useSidebarStore } from "@/lib/store";
import { useMounted } from "@/lib/hooks";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const mounted = useMounted();
  const { isAuthenticated, isLoading } = useAuthStore();
  const { isCollapsed } = useSidebarStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !isAuthenticated && !isLoading) {
      router.push(ROUTES.LOGIN);
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop only */}
      <Sidebar />

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main content area */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          "md:pl-64",
          isCollapsed && "md:pl-16"
        )}
      >
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
