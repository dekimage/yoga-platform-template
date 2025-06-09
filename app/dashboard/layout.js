"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/DashboardHeader";

const DashboardLayout = observer(({ children }) => {
  const router = useRouter();
  const { authStore, videoStore } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is already authenticated
      if (authStore.isAuthenticated && authStore.user) {
        setIsLoading(false);
        return;
      }

      // Try to initialize from token (this will call /api/auth/me)

      await authStore.initialize();

      if (!authStore.isAuthenticated) {
        router.push("/login");
        return;
      }

      // Load videos if authenticated
      if (!videoStore.isInitialized) {
        await videoStore.fetchVideos();
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [authStore, videoStore, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authStore.isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
});

export default DashboardLayout;
