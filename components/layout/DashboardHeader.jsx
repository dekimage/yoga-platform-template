"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Button } from "@/components/ui/button";
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
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            YogaPlatform
          </Link>
          <div className="flex items-center space-x-4">
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

  const handleSubscribe = async () => {
    try {
      const params = new URLSearchParams({
        products: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID,
        customerEmail: authStore.user.email,
        customerName: authStore.user.fullName,
        metadata: JSON.stringify({
          fullName: authStore.user.fullName,
          marketingConsent:
            authStore.user.marketingConsent?.toString() || "false",
        }),
      });

      window.location.href = `/api/subscription/create?${params.toString()}`;
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      alert("Failed to start subscription. Please try again.");
    }
  };

  const handleManageSubscription = async () => {
    // Simple redirect to Polar.sh customer dashboard
    // Users can log in with their email and manage their subscription
    window.open("https://polar.sh/dashboard/subscriptions", "_blank");
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 py-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left spacer to balance the layout */}
          <div className="flex-1"></div>

          {/* Center - Global Search */}
          {authStore.user && (
            <div className="flex-1 max-w-md mx-8">
              <GlobalSearch />
            </div>
          )}

          {/* Right side navigation */}
          <div className="flex-1 flex items-center justify-end space-x-4">
            {/* Navigation Links */}
            {authStore.user && (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/videos">Videos</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/favorites">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </Link>
                </Button>
              </>
            )}

            {/* Subscribe Premium button only if user is not an active member */}
            {authStore.user && !authStore.user.activeMember && (
              <Button
                onClick={handleSubscribe}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Subscribe Premium
              </Button>
            )}

            {/* User Navigation */}
            {authStore.user ? (
              <UserNav />
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {authStore.user && <MobileSidebar />}
              <Link href="/" className="text-xl font-bold">
                YogaPlatform
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              {/* Mobile Search Toggle */}
              {authStore.user && (
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

              {/* Subscribe Premium button for mobile */}
              {authStore.user && !authStore.user.activeMember && (
                <Button
                  onClick={handleSubscribe}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Premium
                </Button>
              )}

              {/* User Navigation */}
              {authStore.user ? (
                <UserNav />
              ) : (
                <div className="flex items-center space-x-2">
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
          {mobileSearchOpen && authStore.user && (
            <div className="mt-4">
              <GlobalSearch isMobile={true} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
});
