"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useMounted } from "@/lib/hooks";
import { ROUTES } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();
  const mounted = useMounted();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (mounted) {
      if (isAuthenticated) {
        router.replace(ROUTES.DASHBOARD);
      } else {
        router.replace(ROUTES.LOGIN);
      }
    }
  }, [mounted, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
