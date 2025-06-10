"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { UserNav } from "./UserNav";
import { MobileSidebar } from "./MobileSidebar";
import GlobalSearch from "@/components/search/GlobalSearch";
import { Search, X, Heart } from "lucide-react";

export const Header = observer(() => {
  const { authStore } = useStore();
  const [mounted, setMounted] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!authStore.isInitialized) {
      authStore.initialize();
    }
  }, [authStore]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            YogaPlatform
          </Link>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            YogaPlatform
          </Link>

          {authStore.isAuthenticated && (
            <div className="flex-1 max-w-md mx-8">
              <GlobalSearch />
            </div>
          )}

          {authStore.isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard/videos">Videos</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/dashboard/favorites">
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </Link>
              </Button>
              <UserNav />
            </div>
          ) : (
            <div className="space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {authStore.isAuthenticated && <MobileSidebar />}
              <Link href="/" className="text-xl font-bold">
                YogaPlatform
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              {authStore.isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                >
                  {mobileSearchOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              )}

              {authStore.isAuthenticated ? (
                <UserNav />
              ) : (
                <div className="space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          {mobileSearchOpen && authStore.isAuthenticated && (
            <div className="mt-4">
              <GlobalSearch isMobile={true} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;
